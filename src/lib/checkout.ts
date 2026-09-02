// Fluxo de checkout na Medusa (client-side, com o token do cliente logado):
// cria carrinho → endereço → método de frete → sessão de pagamento → pedido.
//
// Pagamento: usa o provider Pagar.me (`pp_pagarme_pagarme`) quando ele estiver
// habilitado na região; senão cai no manual (`pp_system_default`), pra loja não
// quebrar enquanto a chave da Pagar.me não estiver configurada.
//
// Pix é ASSÍNCRONO: o pedido só é criado depois que o cliente paga. Por isso o
// `startCheckout` devolve o QR code e o `completeWhenPaid` é chamado em loop
// pela tela do carrinho até o pagamento cair.
import { sdk, REGION_ID } from "./medusa-client";
import type { CartItem } from "./types";

export const PAGARME_PROVIDER = "pp_pagarme_pagarme";
export const MANUAL_PROVIDER = "pp_system_default";

export type PaymentMethod = "pix" | "credit_card";

export type CheckoutAddress = {
  first_name: string;
  last_name: string;
  phone?: string;
  address_1: string;
  address_2?: string;
  city: string;
  province?: string; // UF
  postal_code?: string; // CEP
  country_code: string; // "br"
};

export type PlacedOrder = { orderId: string; displayId?: number };

export type CheckoutResult =
  | { kind: "order"; order: PlacedOrder }
  | {
      kind: "pix";
      cartId: string;
      qrCode?: string;
      qrCodeUrl?: string;
      expiresAt?: string;
    };

/** Provedores de pagamento habilitados na região (define se o Pagar.me está ligado). */
export async function listProviders(): Promise<string[]> {
  try {
    const { payment_providers } = await sdk.store.payment.listPaymentProviders({
      region_id: REGION_ID,
    });
    return (payment_providers ?? []).map((p: any) => p.id);
  } catch {
    return [];
  }
}

export async function pagarmeEnabled(): Promise<boolean> {
  return (await listProviders()).includes(PAGARME_PROVIDER);
}

export async function startCheckout(opts: {
  items: CartItem[];
  email: string;
  address: CheckoutAddress;
  paymentMethod: PaymentMethod;
  /** CPF/CNPJ do cliente — exigido pela Pagar.me no Pix. */
  document?: string;
  phone?: string;
  /** token gerado no navegador (só para cartão) */
  cardToken?: string;
  installments?: number;
}): Promise<CheckoutResult> {
  const line_items = opts.items
    .filter((i) => i.variantId)
    .map((i) => ({ variant_id: i.variantId as string, quantity: i.quantity }));

  if (!line_items.length) {
    throw new Error(
      "Os produtos do carrinho não estão vinculados ao catálogo da Medusa (sem variante). É preciso vender produtos do Medusa (rodar o seed)."
    );
  }

  // 1) carrinho (associa ao cliente logado pelo token JWT do SDK)
  const { cart } = await sdk.store.cart.create({
    region_id: REGION_ID || undefined,
    email: opts.email,
    items: line_items,
  } as any);

  // 2) endereços de entrega/cobrança
  await sdk.store.cart.update(cart.id, {
    email: opts.email,
    shipping_address: opts.address,
    billing_address: opts.address,
  } as any);

  // 3) método de frete (usa a primeira opção disponível na região)
  const { shipping_options } = await sdk.store.fulfillment.listCartOptions({
    cart_id: cart.id,
  });
  if (!shipping_options?.length) {
    throw new Error(
      "Nenhuma opção de frete configurada no Medusa para esta região."
    );
  }
  await sdk.store.cart.addShippingMethod(cart.id, {
    option_id: shipping_options[0].id,
  });

  // 4) sessão de pagamento
  const providers = await listProviders();
  const usePagarme = providers.includes(PAGARME_PROVIDER);
  const provider_id = usePagarme ? PAGARME_PROVIDER : MANUAL_PROVIDER;

  // o carrinho precisa ser relido: o frete mudou o total
  const { cart: cartWithShipping } = await sdk.store.cart.retrieve(cart.id);

  const { payment_collection } = await sdk.store.payment.initiatePaymentSession(
    cartWithShipping as any,
    {
      provider_id,
      data: usePagarme
        ? {
            payment_method: opts.paymentMethod,
            document: opts.document ?? "",
            phone: opts.phone ?? "",
            customer_name:
              `${opts.address.first_name} ${opts.address.last_name}`.trim(),
            customer_email: opts.email,
            ...(opts.cardToken ? { card_token: opts.cardToken } : {}),
            ...(opts.installments ? { installments: opts.installments } : {}),
          }
        : {},
    }
  );

  // Pix: devolve o QR code e espera o pagamento (o pedido nasce depois).
  if (usePagarme && opts.paymentMethod === "pix") {
    const session: any = (payment_collection?.payment_sessions ?? []).find(
      (s: any) => s.provider_id === PAGARME_PROVIDER
    );
    const data = session?.data ?? {};
    return {
      kind: "pix",
      cartId: cart.id,
      qrCode: data.pix_qr_code,
      qrCodeUrl: data.pix_qr_code_url,
      expiresAt: data.pix_expires_at,
    };
  }

  // Cartão (autorização na hora) e manual: fecha o pedido já.
  return { kind: "order", order: await completeCart(cart.id) };
}

/** Fecha o carrinho e devolve o pedido. Lança erro se a Medusa recusar. */
export async function completeCart(cartId: string): Promise<PlacedOrder> {
  const res = await sdk.store.cart.complete(cartId);
  if (res.type !== "order") {
    throw new Error(
      (res as any)?.error?.message || "Não foi possível concluir o pedido."
    );
  }
  return {
    orderId: res.order.id,
    displayId: (res.order as any).display_id,
  };
}

/**
 * Tenta fechar o carrinho: só dá certo quando a Pagar.me já confirmou o Pix
 * (a autorização da sessão consulta a Pagar.me na hora, então funciona mesmo
 * que o webhook atrase). Devolve null enquanto o pagamento não caiu.
 */
export async function completeWhenPaid(
  cartId: string
): Promise<PlacedOrder | null> {
  try {
    return await completeCart(cartId);
  } catch {
    return null;
  }
}
