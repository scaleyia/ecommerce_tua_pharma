// Pedidos reais do cliente logado (Store API da Medusa).
import { sdk } from "./medusa-client";

export type StoreOrder = {
  id: string;
  number: string; // "#TUA-1042"
  date: string; // dd/mm/aaaa
  status: string; // rótulo em português
  total: number; // em reais
  items: number;
};

/** status do pedido + do pagamento → rótulo curto pro cliente */
function label(o: any): string {
  if (o.status === "canceled") return "Cancelado";
  if (o.fulfillment_status === "delivered") return "Entregue";
  if (o.fulfillment_status === "shipped") return "A caminho";
  if (o.payment_status === "captured" || o.payment_status === "authorized")
    return "Em preparação";
  if (o.payment_status === "awaiting" || o.payment_status === "not_paid")
    return "Aguardando pagamento";
  return "Em processamento";
}

export async function listMyOrders(): Promise<StoreOrder[]> {
  const { orders } = await sdk.store.order.list({
    limit: 50,
    order: "-created_at",
    fields: "*items,+status,+payment_status,+fulfillment_status",
  } as any);

  return (orders ?? []).map((o: any) => ({
    id: o.id,
    number: `#TUA-${o.display_id}`,
    date: new Date(o.created_at).toLocaleDateString("pt-BR"),
    status: label(o),
    total: Number(o.total ?? 0),
    items: (o.items ?? []).reduce(
      (n: number, i: any) => n + Number(i.quantity ?? 0),
      0
    ),
  }));
}
