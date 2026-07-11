import { Suspense } from "react";
import { CatalogClient } from "@/components/CatalogClient";

export const metadata = {
  title: "Produtos — Tua Pharma",
};

export default function ProdutosPage() {
  return (
    <Suspense fallback={<div className="container-tua py-20 text-center text-ink/50">Carregando produtos...</div>}>
      <CatalogClient />
    </Suspense>
  );
}
