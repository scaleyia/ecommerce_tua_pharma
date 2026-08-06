import { writeFileSync } from "node:fs";
import { bsProducts } from "../src/lib/catalog.generated";
const CAT: Record<string,string> = { cabelo:"Cabelo", beleza:"Beleza & Colágeno", saude:"Saúde & Bem-estar", fitness:"Fitness & Performance", longevidade:"Longevidade" };
const slugify = (s: string) =>
  s.normalize("NFKD").replace(/[̀-ͯ]/g, "") // tira acentos
   .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const out = bsProducts.map((p) => ({
  handle: slugify(p.slug || p.name),
  title: p.name,
  description: p.description || p.shortDescription || p.name,
  category: CAT[p.category] ?? p.category,
  price: Number(p.price.toFixed(2)),
  compare_at: Number((p.refPrice ?? p.price).toFixed(2)),
  sku: p.id.toUpperCase(),
}));
writeFileSync("medusa/apps/backend/tua-products.json", JSON.stringify(out, null, 2), "utf8");
console.log("OK:", out.length, "produtos -> tua-medusa/apps/backend/tua-products.json");
