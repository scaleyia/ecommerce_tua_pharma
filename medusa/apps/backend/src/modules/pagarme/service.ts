import {
  AbstractPaymentProvider,
  MedusaError,
  PaymentActions,
  PaymentSessionStatus,
} from "@medusajs/framework/utils"
import {
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  Logger,
  ProviderWebhookPayload,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  WebhookActionResult,
} from "@medusajs/framework/types"

type Options = {
  /** Chave secreta do Pagar.me (sk_test_... ou sk_live_...) */
  secretKey: string
  /** Segundos até o Pix expirar (padrão 3600 = 1h) */
  pixExpiresIn?: number
  /** Texto na fatura do cartão (máx 13 chars) */
  statementDescriptor?: string
}

type InjectedDependencies = { logger: Logger }

const PAGARME_API = "https://api.pagar.me/core/v5"

/**
 * Payment provider do Pagar.me (API v5) para Medusa v2.
 * Suporta Pix (assíncrono, QR code) e cartão de crédito (via card_token).
 */
export default class PagarmeProviderService extends AbstractPaymentProvider<Options> {
  static identifier = "pagarme"

  protected logger_: Logger
  protected options_: Options

  constructor(container: InjectedDependencies, options: Options) {
    super(container, options)
    this.logger_ = container.logger
    this.options_ = options
  }

  static validateOptions(options: Record<string, unknown>): void {
    if (!options.secretKey) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Pagar.me: a opção 'secretKey' é obrigatória."
      )
    }
  }

  // ---------------------------------------------------------------- helpers

  private authHeader(): string {
    const token = Buffer.from(`${this.options_.secretKey}:`).toString("base64")
    return `Basic ${token}`
  }

  private async request(path: string, method: string, body?: unknown): Promise<any> {
    const res = await fetch(`${PAGARME_API}${path}`, {
      method,
      headers: {
        Authorization: this.authHeader(),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    const text = await res.text()
    const json = text ? JSON.parse(text) : {}

    if (!res.ok) {
      this.logger_.error(`Pagar.me ${method} ${path} -> ${res.status}: ${text}`)
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Pagar.me erro ${res.status}: ${json?.message ?? text}`
      )
    }
    return json
  }

  /** Converte o valor da Medusa (unidade maior, ex.: 122.31) para centavos inteiros. */
  private toCents(amount: unknown): number {
    const raw =
      typeof amount === "object" && amount !== null
        ? (amount as any).numeric ?? (amount as any).valueOf?.() ?? amount
        : amount
    return Math.round(Number(raw) * 100)
  }

  /** Mapeia o status do Pagar.me para o status de sessão da Medusa. */
  private mapStatus(status?: string): PaymentSessionStatus {
    switch (status) {
      case "paid":
      case "captured":
        return PaymentSessionStatus.CAPTURED
      case "authorized_pending_capture":
      case "authorized":
        return PaymentSessionStatus.AUTHORIZED
      case "pending":
      case "processing":
      case "waiting_payment":
        return PaymentSessionStatus.PENDING
      case "canceled":
      case "voided":
        return PaymentSessionStatus.CANCELED
      case "failed":
      case "not_authorized":
      case "refused":
        return PaymentSessionStatus.ERROR
      default:
        return PaymentSessionStatus.PENDING
    }
  }

  private buildCustomer(customer: any, extra: Record<string, any>): any {
    const name =
      extra.customer_name ||
      [customer?.first_name, customer?.last_name].filter(Boolean).join(" ") ||
      "Cliente Tua Pharma"
    const email =
      extra.customer_email || customer?.email || "sememail@tuapharma.com.br"
    const document = String(extra.document ?? "").replace(/\D/g, "")
    const phone = String(extra.phone ?? "").replace(/\D/g, "")

    const c: any = { name, email, type: "individual" }

    // Endereço: o Pagar.me EXIGE endereço de cobrança para cartão. Sem ele a
    // cobrança falha com "validation_error | billing | value is required" —
    // antes de chegar na bandeira, ou seja, TODO cartão era recusado.
    const addr = extra.billing_address as Record<string, any> | undefined
    if (addr?.line_1) {
      c.address = {
        line_1: String(addr.line_1),
        ...(addr.line_2 ? { line_2: String(addr.line_2) } : {}),
        zip_code: String(addr.zip_code ?? "").replace(/\D/g, ""),
        city: String(addr.city ?? ""),
        state: String(addr.state ?? "").toUpperCase().slice(0, 2),
        country: String(addr.country ?? "BR").toUpperCase(),
      }
    }

    if (document) {
      const isCompany = document.length > 11
      c.document = document
      c.document_type = isCompany ? "CNPJ" : "CPF"
      c.type = isCompany ? "company" : "individual"
    }
    if (phone && phone.length >= 10) {
      c.phones = {
        mobile_phone: {
          country_code: "55",
          area_code: phone.slice(0, 2),
          number: phone.slice(2),
        },
      }
    }
    return c
  }

  // ------------------------------------------------------------ core methods

  async initiatePayment(
    input: InitiatePaymentInput
  ): Promise<InitiatePaymentOutput> {
    const { amount, data, context } = input
    const extra = (data ?? {}) as Record<string, any>
    const cents = this.toCents(amount)
    const method = (extra.payment_method as string) ?? "pix"
    const sessionId = (extra.session_id as string) ?? ""

    const payments: any[] = []
    if (method === "credit_card") {
      payments.push({
        payment_method: "credit_card",
        credit_card: {
          installments: Number(extra.installments ?? 1),
          statement_descriptor: this.options_.statementDescriptor ?? "TUAPHARMA",
          ...(extra.card_token ? { card_token: extra.card_token } : {}),
        },
      })
    } else {
      payments.push({
        payment_method: "pix",
        pix: { expires_in: this.options_.pixExpiresIn ?? 3600 },
      })
    }

    const orderBody = {
      closed: true,
      items: [
        {
          amount: cents,
          description: "Pedido Tua Pharma",
          quantity: 1,
          code: sessionId || "cart",
        },
      ],
      customer: this.buildCustomer(context?.customer, extra),
      payments,
      metadata: { session_id: sessionId },
    }

    const order = await this.request("/orders", "POST", orderBody)
    const charge = order?.charges?.[0] ?? {}
    const tx = charge?.last_transaction ?? {}

    return {
      id: order.id,
      status: this.mapStatus(order?.status ?? charge?.status),
      data: {
        id: order.id,
        order_id: order.id,
        charge_id: charge?.id,
        status: order?.status,
        payment_method: method,
        // campos do Pix p/ o storefront exibir o QR code:
        pix_qr_code: tx.qr_code,
        pix_qr_code_url: tx.qr_code_url,
        pix_expires_at: tx.expires_at,
      },
    }
  }

  async authorizePayment(
    input: AuthorizePaymentInput
  ): Promise<AuthorizePaymentOutput> {
    const { status } = await this.getPaymentStatus(input)
    return { status, data: input.data }
  }

  async getPaymentStatus(
    input: GetPaymentStatusInput
  ): Promise<GetPaymentStatusOutput> {
    const orderId = (input.data as any)?.id as string
    if (!orderId) {
      return { status: PaymentSessionStatus.PENDING, data: input.data }
    }
    const order = await this.request(`/orders/${orderId}`, "GET")
    return {
      status: this.mapStatus(order?.status),
      data: { ...(input.data as any), status: order?.status },
    }
  }

  async capturePayment(
    input: CapturePaymentInput
  ): Promise<CapturePaymentOutput> {
    const chargeId = (input.data as any)?.charge_id as string
    // Pix e cartão fecham automaticamente (closed:true). Tentamos capturar
    // explicitamente só p/ o caso de captura manual; erros são tolerados.
    if (chargeId) {
      try {
        const charge = await this.request(`/charges/${chargeId}/capture`, "POST", {})
        return { data: { ...(input.data as any), status: charge?.status } }
      } catch (e) {
        this.logger_.info(`Pagar.me capture no-op (${chargeId}): ${(e as Error).message}`)
      }
    }
    return { data: input.data }
  }

  async cancelPayment(
    input: CancelPaymentInput
  ): Promise<CancelPaymentOutput> {
    const chargeId = (input.data as any)?.charge_id as string
    if (chargeId) {
      try {
        await this.request(`/charges/${chargeId}`, "DELETE")
      } catch (e) {
        this.logger_.info(`Pagar.me cancel no-op (${chargeId}): ${(e as Error).message}`)
      }
    }
    return { data: input.data }
  }

  async deletePayment(
    input: DeletePaymentInput
  ): Promise<DeletePaymentOutput> {
    return this.cancelPayment(input)
  }

  async refundPayment(
    input: RefundPaymentInput
  ): Promise<RefundPaymentOutput> {
    const chargeId = (input.data as any)?.charge_id as string
    const cents = this.toCents(input.amount)
    if (chargeId) {
      const charge = await this.request(`/charges/${chargeId}`, "DELETE", {
        amount: cents,
      })
      return { data: { ...(input.data as any), refund_status: charge?.status } }
    }
    return { data: input.data }
  }

  async retrievePayment(
    input: RetrievePaymentInput
  ): Promise<RetrievePaymentOutput> {
    const orderId = (input.data as any)?.id as string
    if (!orderId) {
      return { data: input.data }
    }
    const order = await this.request(`/orders/${orderId}`, "GET")
    return { data: { ...(input.data as any), status: order?.status } }
  }

  async updatePayment(
    input: UpdatePaymentInput
  ): Promise<UpdatePaymentOutput> {
    // Valor/moeda podem mudar antes do pagamento. Como a ordem do Pagar.me já
    // foi criada no initiate, aqui apenas repassamos os dados atuais.
    return { data: input.data }
  }

  async getWebhookActionAndData(
    payload: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    const body = payload.data as any
    const type = body?.type as string
    const order = body?.data ?? {}
    const sessionId = order?.metadata?.session_id

    if (!sessionId) {
      return { action: PaymentActions.NOT_SUPPORTED }
    }

    const amountCents =
      order?.amount ?? order?.charges?.[0]?.amount ?? 0
    const amount = Number(amountCents) / 100

    switch (type) {
      case "order.paid":
      case "charge.paid":
        return {
          action: PaymentActions.SUCCESSFUL,
          data: { session_id: sessionId, amount },
        }
      case "order.payment_failed":
      case "charge.payment_failed":
        return {
          action: PaymentActions.FAILED,
          data: { session_id: sessionId, amount },
        }
      case "charge.pending":
      case "order.created":
        return {
          action: PaymentActions.PENDING,
          data: { session_id: sessionId, amount },
        }
      default:
        return { action: PaymentActions.NOT_SUPPORTED }
    }
  }
}
