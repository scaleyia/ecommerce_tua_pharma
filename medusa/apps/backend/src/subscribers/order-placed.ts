// Quando um pedido é criado, avisa o cliente por e-mail — e a farmácia.
//
// Roda para TODO pedido, não importa como nasceu: pelo navegador do cliente ou
// pelo webhook da Pagar.me (quando ele pagou o Pix e fechou a aba). É por isso
// que o envio mora aqui no backend, e não no site.
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { sendEmail, emailEnabled, brl, esc } from "../lib/email"

const VERDE = "#12261C"
const VERDE_CLARO = "#1B4332"
const DOURADO = "#C9A24B"
const CREME = "#F7F5EF"

function linhaItem(item: any): string {
  const qtd = Number(item.quantity ?? 1)
  const total = Number(item.total ?? item.unit_price ?? 0)
  return `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #e6e2d6;color:${VERDE};font-size:14px">
        ${esc(item.product_title || item.title)}
        ${qtd > 1 ? `<span style="color:#6b7d70"> × ${qtd}</span>` : ""}
      </td>
      <td style="padding:12px 0;border-bottom:1px solid #e6e2d6;text-align:right;color:${VERDE};font-size:14px;white-space:nowrap">
        ${brl(total)}
      </td>
    </tr>`
}

function montarHtml(order: any): string {
  const itens = (order.items ?? []).map(linhaItem).join("")
  const end = order.shipping_address ?? {}
  const enderecoLinhas = [
    [end.first_name, end.last_name].filter(Boolean).join(" "),
    end.address_1,
    end.address_2,
    [end.city, end.province].filter(Boolean).join(" - "),
    end.postal_code,
  ]
    .filter(Boolean)
    .map((l: string) => esc(l))
    .join("<br>")

  return `<!doctype html>
<html lang="pt-BR"><body style="margin:0;padding:0;background:${CREME};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREME};padding:32px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden">

        <tr><td style="background:${VERDE};padding:28px 32px;text-align:center">
          <div style="color:${DOURADO};font-size:20px;letter-spacing:3px;font-weight:300">TUA PHARMA</div>
          <div style="color:#ffffff;opacity:.65;font-size:12px;margin-top:4px">Farmácia de Manipulação</div>
        </td></tr>

        <tr><td style="padding:32px">
          <h1 style="margin:0 0 8px;color:${VERDE};font-size:22px;font-weight:400">
            Recebemos seu pedido!
          </h1>
          <p style="margin:0 0 24px;color:#5f7166;font-size:15px;line-height:1.6">
            Obrigado pela confiança${order.shipping_address?.first_name ? `, ${esc(order.shipping_address.first_name)}` : ""}.
            Seu pedido <strong style="color:${VERDE}">nº ${esc(order.display_id)}</strong>
            foi registrado e já entrou em preparação.
          </p>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${itens}
            <tr>
              <td style="padding:12px 0 4px;color:#5f7166;font-size:14px">Frete</td>
              <td style="padding:12px 0 4px;text-align:right;color:#5f7166;font-size:14px">
                ${Number(order.shipping_total ?? 0) === 0 ? "Grátis" : brl(order.shipping_total)}
              </td>
            </tr>
            ${
              Number(order.discount_total ?? 0) > 0
                ? `<tr>
              <td style="padding:4px 0;color:${VERDE_CLARO};font-size:14px">Desconto</td>
              <td style="padding:4px 0;text-align:right;color:${VERDE_CLARO};font-size:14px">- ${brl(order.discount_total)}</td>
            </tr>`
                : ""
            }
            <tr>
              <td style="padding:16px 0 0;border-top:2px solid ${VERDE};color:${VERDE};font-size:16px;font-weight:600">Total</td>
              <td style="padding:16px 0 0;border-top:2px solid ${VERDE};text-align:right;color:${VERDE};font-size:18px;font-weight:600">${brl(order.total)}</td>
            </tr>
          </table>

          ${
            enderecoLinhas
              ? `<div style="margin-top:28px;padding:16px;background:${CREME};border-radius:8px">
                   <div style="color:${DOURADO};font-size:11px;letter-spacing:1.5px;text-transform:uppercase;font-weight:600;margin-bottom:8px">Entrega</div>
                   <div style="color:${VERDE};font-size:14px;line-height:1.6">${enderecoLinhas}</div>
                 </div>`
              : ""
          }

          <p style="margin:28px 0 0;color:#5f7166;font-size:14px;line-height:1.6">
            Você pode acompanhar o status em
            <a href="https://www.tuapharma.com.br/conta" style="color:${VERDE_CLARO};font-weight:600">Meus pedidos</a>.
            Qualquer dúvida, é só responder este e-mail.
          </p>
        </td></tr>

        <tr><td style="background:${CREME};padding:20px 32px;text-align:center;color:#8a9690;font-size:12px;line-height:1.6">
          Tua Pharma · Manipulados com responsabilidade farmacêutica<br>
          <a href="https://www.tuapharma.com.br" style="color:#8a9690">tuapharma.com.br</a>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`
}

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  if (!emailEnabled()) {
    logger.warn("[e-mail] RESEND_API_KEY ausente — pedido criado sem aviso ao cliente.")
    return
  }

  try {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const { data: orders } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "email",
        "total",
        "shipping_total",
        "discount_total",
        "items.*",
        "shipping_address.*",
      ],
      filters: { id: data.id },
    })

    const order = orders?.[0]
    if (!order?.email) {
      logger.warn(`[e-mail] pedido ${data.id} sem e-mail; nada enviado.`)
      return
    }

    const html = montarHtml(order)

    await sendEmail({
      to: order.email,
      subject: `Pedido nº ${order.display_id} confirmado — Tua Pharma`,
      html,
      replyTo: process.env.EMAIL_REPLY_TO,
    })
    logger.info(`[e-mail] confirmação do pedido ${order.display_id} enviada para ${order.email}`)

    // cópia para a farmácia, se configurada — é assim que eles ficam sabendo da venda
    const loja = process.env.EMAIL_TO_STORE
    if (loja) {
      await sendEmail({
        to: loja,
        subject: `Nova venda: pedido nº ${order.display_id} — ${brl(order.total)}`,
        html,
        replyTo: order.email,
      })
      logger.info(`[e-mail] aviso de venda enviado para ${loja}`)
    }
  } catch (err: any) {
    // Nunca deixa a falha de e-mail derrubar o pedido: a venda já aconteceu.
    logger.error(`[e-mail] falha ao enviar confirmação do pedido ${data.id}: ${err?.message}`)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
