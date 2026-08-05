/**
 * Seed do banco Supabase a partir dos dados mock (src/lib/data.ts).
 * Uso:  npm run seed
 * Requer NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY em .env.local.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { categories, products } from "../src/lib/data";

// carrega .env.local sem dependência extra
for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key || url.includes("SEU-PROJETO") || key.includes("coloque")) {
  console.error("\n❌ Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY em .env.local primeiro.\n");
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });

const COUPONS = [
  { code: "TUA5", percent: 0.05, active: true },
  { code: "TUA10", percent: 0.1, active: true },
  { code: "TUA15", percent: 0.15, active: true },
  { code: "TUA20", percent: 0.2, active: true },
];

async function main() {
  console.log("→ categorias…");
  const cat = await db.from("categories").upsert(
    categories.map((c, i) => ({
      slug: c.slug,
      name: c.name,
      tagline: c.tagline,
      icon: c.icon,
      gradient: c.gradient,
      accent: c.accent,
      position: i,
    }))
  );
  if (cat.error) throw cat.error;

  console.log("→ produtos…");
  const prod = await db.from("products").upsert(
    products.map((p) => ({
      slug: p.slug,
      name: p.name,
      category: p.category,
      price: p.price,
      old_price: p.oldPrice ?? null,
      stock: 100,
      rating: p.rating,
      reviews: p.reviews,
      short_description: p.shortDescription,
      description: p.description,
      benefits: p.benefits,
      badges: p.badges,
      packaging: p.packaging,
      image_label: p.imageLabel ?? null,
      sizes: p.sizes ?? null,
      bestseller: p.bestseller ?? false,
      special: p.special ?? false,
      active: true,
    })),
    { onConflict: "slug" }
  );
  if (prod.error) throw prod.error;

  console.log("→ cupons…");
  const cp = await db.from("coupons").upsert(COUPONS);
  if (cp.error) throw cp.error;

  console.log(`\n✅ Seed concluído: ${categories.length} categorias, ${products.length} produtos, ${COUPONS.length} cupons.\n`);
}

main().catch((e) => {
  console.error("❌ Erro no seed:", e.message || e);
  process.exit(1);
});
