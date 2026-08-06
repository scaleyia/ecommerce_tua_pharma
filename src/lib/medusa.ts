// Cliente Medusa + mapeamento p/ o tipo Product do Next.
// A loja lê os produtos GERENCIADOS no painel Medusa (localhost:9000/app).
import Medusa from "@medusajs/js-sdk";
import type { Product } from "./types";

const BACKEND = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PK = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";
const REGION = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID || "";

export const medusa = new Medusa({ baseUrl: BACKEND, publishableKey: PK });

// nome da categoria (Medusa) -> slug (Next)
const CAT_SLUG: Record<string, string> = {
  "Cabelo": "cabelo",
  "Beleza & Colágeno": "beleza",
  "Saúde & Bem-estar": "saude",
  "Fitness & Performance": "fitness",
  "Longevidade": "longevidade",
};

function mapProduct(p: any): Product {
  const variant = p.variants?.[0];
  const price = variant?.calculated_price?.calculated_amount ?? 0;
  const catName = p.categories?.[0]?.name;
  return {
    id: p.id,
    variantId: variant?.id,
    slug: p.handle,
    name: p.title,
    category: CAT_SLUG[catName] ?? "saude",
    price,
    rating: 4.7,
    reviews: 120,
    shortDescription: (p.description || "").slice(0, 120),
    description: p.description || "",
    benefits: [],
    badges: ["Manipulado"],
    packaging: "pote-capsula",
    imageLabel: p.title,
  };
}

const FIELDS = "id,title,handle,description,categories.name,variants.id,variants.calculated_price";

export async function getAllProducts(): Promise<Product[]> {
  try {
    const { products } = await medusa.store.product.list({
      limit: 300,
      region_id: REGION || undefined,
      fields: FIELDS,
    } as any);
    return (products || []).map(mapProduct);
  } catch (e) {
    console.error("Medusa getAllProducts falhou:", e);
    return [];
  }
}

// Cria um carrinho na Medusa a partir dos itens do carrinho local.
// (Completar em pedido pago exige pagamento/frete configurados — contas do cliente.)
export async function createMedusaCart(
  items: Array<{ variantId?: string; quantity: number }>,
  email?: string
): Promise<string | null> {
  const line = items
    .filter((i) => i.variantId)
    .map((i) => ({ variant_id: i.variantId as string, quantity: i.quantity }));
  if (!line.length) return null;
  try {
    const { cart } = await medusa.store.cart.create({
      region_id: REGION || undefined,
      items: line,
      ...(email ? { email } : {}),
    } as any);
    return cart?.id ?? null;
  } catch (e) {
    console.error("Medusa createMedusaCart falhou:", e);
    return null;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { products } = await medusa.store.product.list({
      handle: slug,
      region_id: REGION || undefined,
      fields: FIELDS,
    } as any);
    return products?.[0] ? mapProduct(products[0]) : null;
  } catch (e) {
    console.error("Medusa getProductBySlug falhou:", e);
    return null;
  }
}
