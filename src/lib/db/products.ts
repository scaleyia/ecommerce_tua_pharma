import "server-only";
import type { Product } from "@/lib/types";
import { createAdminClient } from "@/lib/supabase/admin";
import * as mock from "@/lib/data";

// true quando o .env.local ainda tem placeholders → usamos o mock
function supabaseReady() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return url.startsWith("http") && !url.includes("SEU-PROJETO") && !key.includes("coloque");
}

type Row = Record<string, unknown>;

// linha do banco → tipo Product usado pela loja
export function rowToProduct(r: Row): Product {
  return {
    id: r.id as string,
    slug: r.slug as string,
    name: r.name as string,
    category: r.category as string,
    price: Number(r.price),
    oldPrice: r.old_price != null ? Number(r.old_price) : undefined,
    rating: Number(r.rating),
    reviews: Number(r.reviews),
    shortDescription: (r.short_description as string) ?? "",
    description: (r.description as string) ?? "",
    benefits: (r.benefits as string[]) ?? [],
    badges: (r.badges as string[]) ?? [],
    packaging: (r.packaging as Product["packaging"]) ?? "jar-capsule-green",
    imageLabel: (r.image_label as string) ?? undefined,
    sizes: (r.sizes as Product["sizes"]) ?? undefined,
    bestseller: Boolean(r.bestseller),
    special: Boolean(r.special),
  };
}

export async function getProducts(): Promise<Product[]> {
  if (!supabaseReady()) return mock.products;
  const db = createAdminClient();
  const { data, error } = await db
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: true });
  if (error || !data) return mock.products;
  return data.map(rowToProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  if (!supabaseReady()) return mock.productBySlug(slug);
  const db = createAdminClient();
  const { data } = await db.from("products").select("*").eq("slug", slug).maybeSingle();
  return data ? rowToProduct(data) : undefined;
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const all = await getProducts();
  return all.filter((p) => p.category === slug);
}

export async function getBestsellers(): Promise<Product[]> {
  const all = await getProducts();
  return all.filter((p) => p.bestseller);
}

export async function getSpecialOffers(): Promise<Product[]> {
  const all = await getProducts();
  return all.filter((p) => p.special);
}
