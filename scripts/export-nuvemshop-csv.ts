// Gera a planilha de importação de produtos para o Nuvemshop (formato oficial).
// Uso: npx tsx scripts/export-nuvemshop-csv.ts  ->  nuvemshop-produtos.csv (raiz)
import { writeFileSync } from "node:fs";
import { bsProducts } from "../src/lib/catalog.generated";

const CATEGORIA: Record<string, string> = {
  cabelo: "Cabelo",
  beleza: "Beleza & Colágeno",
  saude: "Saúde & Bem-estar",
  fitness: "Fitness & Performance",
  longevidade: "Longevidade",
};

const HEADERS = [
  "Identificador URL",
  "Nome",
  "Categorias",
  "Nome da variação 1",
  "Valor da variação 1",
  "Preço",
  "Preço promocional",
  "Peso",
  "Altura",
  "Largura",
  "Comprimento",
  "Estoque",
  "SKU",
  "Código de Barras",
  "Exibir na loja",
  "Frete Grátis",
  "Descrição",
  "Tags",
  "Título para SEO",
  "Descrição para SEO",
  "Marca",
  "Produto físico",
];

// Escapa um campo CSV (aspas, vírgulas, quebras de linha).
const cell = (v: string | number): string => {
  const s = String(v ?? "").replace(/\r?\n/g, " ").trim();
  return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const money = (n: number) => n.toFixed(2).replace(".", ","); // 122,31

const rows = bsProducts.map((p) => [
  p.slug,
  p.name,
  CATEGORIA[p.category] ?? p.category,
  "", // Nome da variação 1
  "", // Valor da variação 1
  money(p.refPrice ?? p.price), // Preço cheio (referência)
  money(p.price), // Preço promocional (−10%)
  "0.10", // Peso (kg)
  "10", // Altura
  "10", // Largura
  "10", // Comprimento
  "100", // Estoque
  p.id.toUpperCase(), // SKU
  "", // Código de Barras
  "SIM", // Exibir na loja
  "NÃO", // Frete Grátis
  p.description || p.shortDescription || p.name, // Descrição
  [CATEGORIA[p.category] ?? p.category, "manipulado", "Tua Pharma"].join(", "),
  p.name, // Título SEO
  p.shortDescription || p.name, // Descrição SEO
  "Tua Pharma", // Marca
  "SIM", // Produto físico
]);

const csv =
  "﻿" + // BOM p/ acentos no Excel
  [HEADERS, ...rows].map((r) => r.map(cell).join(",")).join("\r\n");

writeFileSync("nuvemshop-produtos.csv", csv, "utf8");
console.log(`OK: nuvemshop-produtos.csv gerado com ${rows.length} produtos.`);
