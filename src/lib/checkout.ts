// Fluxo de checkout na Medusa (client-side, com o token do cliente logado):
// cria carrinho → endereço → método de frete → sessão de pagamento manual →
// completa o carrinho, gerando um PEDIDO real na Medusa.
import { sdk, REGION_ID } from "./medusa-client";
import type { CartItem } from "./types";

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

export async function placeOrder(opts: {
  items: CartItem[];
  email: string;
  address: CheckoutAddress;
}): Promise<PlacedOrder> {
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
  const { shipping_options } =
    await sdk.store.fulfillment.listCartOptions({ cart_id: cart.id });
  if (!shipping_options?.length) {
    throw new Error(
      "Nenhuma opção de frete configurada no Medusa para esta região."
    );
  }
  await sdk.store.cart.addShippingMethod(cart.id, {
    option_id: shipping_options[0].id,
  });

  // 4) pagamento manual (pp_system_default) — pedido entra como pendente
  await sdk.store.payment.initiatePaymentSession(cart as any, {
    provider_id: "pp_system_default",
  });

  // 5) completa o carrinho → gera o pedido
  const res = await sdk.store.cart.complete(cart.id);
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
