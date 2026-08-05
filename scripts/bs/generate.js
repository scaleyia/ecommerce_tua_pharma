// Gera src/lib/catalog.generated.ts a partir do catálogo público da BS Pharma
// (products.json do Shopify). Preço nosso = refPrice (BS) −10%, derivado em data.ts.
// Não usamos fotos deles: a ilustração vem de `packaging` + `imageLabel`.
// Uso: node scripts/bs/generate.js
const fs = require("fs");
const path = require("path");
const dir = __dirname;

const all = require("./products.json").products;
const load = (c) => require(`./col-${c}.json`).products.map((p) => p.handle);
const cols = {
  beleza: new Set(load("beleza")),
  saude: new Set(load("saude-e-bem-estar")),
  fitness: new Set(load("emagrecimento")),
  longevidade: new Set(load("longevidade")),
};
const ofertas = new Set(load("ofertas"));
const maisVendidos = new Set(load("mais-vendidos"));

// Garrafas base (royalty-free, verificadas: limpas, centralizadas, rótulo
// livre). O rótulo Tua Pharma (logo + nome + dose) é impresso por cima no
// componente ProductImage — a logo fica NO produto. Rotaciona p/ variar.
const BOTTLES = [
  "/produtos/base/pote-capsula-1.jpg",
  "/produtos/base/pote-capsula-2.jpg",
  "/produtos/base/pote-capsula-3.jpg",
];
const pickImage = (i) => BOTTLES[i % BOTTLES.length];

const HAIR = /minoxidil|capilar|cabelo|queda|fios|finasterida|biotina|keranat|redensyl|capixyl|anagrow|t[oó]nico|espironolactona t[oó]pic/i;

const stripHtml = (html) =>
  (html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&aacute;/g, "á").replace(/&eacute;/g, "é").replace(/&iacute;/g, "í")
    .replace(/&oacute;/g, "ó").replace(/&uacute;/g, "ú").replace(/&atilde;/g, "ã")
    .replace(/&ccedil;/g, "ç").replace(/&otilde;/g, "õ").replace(/&reg;/g, "®")
    .replace(/&#39;|&rsquo;/g, "'").replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();

const sentences = (txt) =>
  txt.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0);

const category = (p) => {
  const h = p.handle;
  const inBeleza = cols.beleza.has(h);
  if (inBeleza) return HAIR.test(p.title) ? "cabelo" : "beleza";
  if (cols.fitness.has(h)) return "fitness";
  if (cols.saude.has(h)) return "saude";
  if (cols.longevidade.has(h)) return "longevidade";
  // fallback por palavra-chave
  if (HAIR.test(p.title)) return "cabelo";
  if (/emagrec|gordura|apetite|treino|creatina|massa|whey/i.test(p.title)) return "fitness";
  return "saude";
};

// Classificação de forma por TÍTULO (alta precisão; a maioria dos manipulados é
// cápsula). A gramatura separa sachê (dose única, poucos g) de pó (pote, 100g+).
const packaging = (title) => {
  const t = title.toLowerCase();
  const gm = t.match(/(\d+(?:[.,]\d+)?)\s?g\b/);
  const grams = gm ? parseFloat(gm[1].replace(",", ".")) : null;

  if (/sach[êe]/.test(t)) return "caixa";
  if (/minoxidil|lo[çc][ãa]o capilar|\bspray\b/.test(t)) return "spray";
  if (/shampoo|xampu|condicionador/.test(t)) return "frasco";
  if (/sublingual|\bgotas\b|conta-gotas/.test(t)) return "gotas";
  if (/x[áa]rope|solu[çc][ãa]o oral|t[ôo]nico oral/.test(t)) return "frasco";
  if (/pomada|em gel|\bgel\b|g[ée]l\b/.test(t) && !/gelatin/.test(t)) return "bisnaga";
  if (/creme|hidratante|s[ée]rum|serum/.test(t)) return "pote-creme";
  if (/creatina|whey|prote[íi]na|glutamina|maltodextrina|powder/.test(t)) return "pote-po";
  if (grams != null && grams <= 30) return "caixa"; // dose única em sachê
  if (grams != null && grams >= 100) return "pote-po"; // pó em pote
  return "pote-capsula";
};

// "Vitamina B12 1000mcg (Sublingual)" -> label curto p/ embalagem
const imageLabel = (title) => {
  let s = title.replace(/®|™/g, "").replace(/\s*\([^)]*\)\s*/g, " ").trim();
  const words = s.split(/\s+/).slice(0, 3).join(" ");
  return words.slice(0, 22);
};

// dose/badge a partir do título (ex.: "1000mcg", "300 g", "5%")
const doseBadge = (title) => {
  const m = title.match(/(\d+[.,]?\d*)\s?(mg|mcg|g|%|ui|bi\s?ufc|mi\s?ufc|ml)/i);
  return m ? m[0].replace(/\s+/g, " ").trim() : null;
};

// rating/reviews: PLACEHOLDER determinístico (não são dados reais da BS).
const hash = (s) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
const placeholderRating = (h) => 4.5 + ((hash(h) % 5) / 10); // 4.5–4.9
const placeholderReviews = (h) => 18 + (hash(h) % 210); // 18–227

const price10 = (ref) => Math.round(ref * 0.9 * 100) / 100;

// Remove menção ao concorrente do texto copiado.
const deBrand = (s) => (s || "").replace(/bs\s*pharma/gi, "Tua Pharma");

const products = all.map((p, i) => {
  const body = deBrand(stripHtml(p.body_html));
  const ss = sentences(body);
  const shortDescription = (ss[0] || p.title).slice(0, 160);
  const description = ss.slice(0, 3).join(" ").slice(0, 600) || shortDescription;
  const cat = category(p);
  const dose = doseBadge(p.title);
  const badges = ["Manipulado"];
  if (dose) badges.push(dose);

  const multi = p.variants.length > 1;
  const refPrice = parseFloat(p.variants[0].price);

  const prod = {
    id: `bs${String(i + 1).padStart(3, "0")}`,
    slug: p.handle,
    name: deBrand(p.title.trim()),
    category: cat,
    packaging: packaging(p.title),
    imageLabel: imageLabel(p.title),
    refPrice,
    price: price10(refPrice),
    rating: Number(placeholderRating(p.handle).toFixed(1)),
    reviews: placeholderReviews(p.handle),
    shortDescription,
    description,
    benefits: [],
    badges,
  };
  if (multi) {
    prod.sizes = p.variants.map((v) => {
      const r = parseFloat(v.price);
      return { label: v.option1 || v.title, refPrice: r, price: price10(r) };
    });
  }
  prod.image = pickImage(i);
  if (ofertas.has(p.handle)) prod.special = true;
  if (maisVendidos.has(p.handle)) prod.bestseller = true;
  return prod;
});

const header = `// GERADO AUTOMATICAMENTE por scripts/bs/generate.js — não editar à mão.
// Fonte: catálogo público BS Pharma (bspharma.com.br). Preço = referência BS −10%.
// rating/reviews são PLACEHOLDERS (não são avaliações reais). Descrições baseadas
// no texto da BS, a revisar/reescrever na identidade Tua Pharma.
import type { Product } from "./types";

export const bsProducts: Product[] = ${JSON.stringify(products, null, 2)};
`;

const out = path.join(dir, "../../src/lib/catalog.generated.ts");
fs.writeFileSync(out, header);
const byCat = products.reduce((a, p) => ((a[p.category] = (a[p.category] || 0) + 1), a), {});
console.log("Gerados", products.length, "produtos ->", path.relative(process.cwd(), out));
console.log("Por categoria:", JSON.stringify(byCat));
console.log("Com sizes (multi-variante):", products.filter((p) => p.sizes).length);
console.log("Em oferta (special):", products.filter((p) => p.special).length);
