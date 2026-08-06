import { Suspense } from "react";
import { CatalogClient } from "@/components/CatalogClient";
import { getAllProducts } from "@/lib/medusa";
import { products as mockProducts } from "@/lib/data";

export const metadata = {
  title: "Produtos — Tua Pharma",
};

// Sempre buscar do backend (produtos gerenciados na Medusa)
export const dynamic = "force-dynamic";

export default async function ProdutosPage() {
  const fromMedusa = await getAllProducts();
  // fallback pro mock enquanto a Medusa não estiver no ar
  const products = fromMedusa.length ? fromMedusa : mockProducts;

  return (
    <Suspense fallback={<div className="container-tua py-20 text-center text-ink/50">Carregando produtos...</div>}>
      <CatalogClient products={products} />
    </Suspense>
  );
}
