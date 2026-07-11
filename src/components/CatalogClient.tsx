"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, Search } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { categories, products } from "@/lib/data";

type SortKey = "relevancia" | "menor" | "maior" | "avaliacao";

export function CatalogClient() {
  const params = useSearchParams();
  const activeCategory = params.get("categoria") ?? "";
  const query = (params.get("q") ?? "").toLowerCase();
  const [sort, setSort] = useState<SortKey>("relevancia");

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const matchCat = activeCategory ? p.category === activeCategory : true;
      const matchQuery = query
        ? (p.name + " " + p.shortDescription + " " + p.badges.join(" "))
            .toLowerCase()
            .includes(query)
        : true;
      return matchCat && matchQuery;
    });

    list = [...list];
    if (sort === "menor") list.sort((a, b) => a.price - b.price);
    else if (sort === "maior") list.sort((a, b) => b.price - a.price);
    else if (sort === "avaliacao") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [activeCategory, query, sort]);

  const currentCat = categories.find((c) => c.slug === activeCategory);
  const heading = currentCat
    ? currentCat.name
    : query
      ? `Resultados para "${params.get("q")}"`
      : "Todos os produtos";

  const chipHref = (slug: string) => {
    const sp = new URLSearchParams();
    if (slug) sp.set("categoria", slug);
    if (query) sp.set("q", params.get("q") ?? "");
    const qs = sp.toString();
    return qs ? `/produtos?${qs}` : "/produtos";
  };

  return (
    <div className="container-tua py-8">
      {/* breadcrumb */}
      <nav className="mb-4 text-xs text-ink/50">
        <Link href="/" className="hover:text-green-700">Início</Link>
        <span className="mx-1.5">/</span>
        <span className="text-green-900">{heading}</span>
      </nav>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-light text-green-900">{heading}</h1>
          <p className="mt-1 text-sm text-ink/55">
            {filtered.length} {filtered.length === 1 ? "produto" : "produtos"} encontrado
            {filtered.length === 1 ? "" : "s"}
          </p>
        </div>
        <label className="flex items-center gap-2 self-start rounded-full border border-green-900/15 bg-white px-4 py-2 text-sm sm:self-auto">
          <SlidersHorizontal size={15} className="text-green-700" />
          <span className="text-ink/60">Ordenar:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="bg-transparent font-medium text-green-900 outline-none"
          >
            <option value="relevancia">Relevância</option>
            <option value="menor">Menor preço</option>
            <option value="maior">Maior preço</option>
            <option value="avaliacao">Melhor avaliados</option>
          </select>
        </label>
      </div>

      {/* filtros de categoria */}
      <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto pb-1">
        <Link
          href={chipHref("")}
          className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition ${
            !activeCategory
              ? "border-green-700 bg-green-700 text-white"
              : "border-green-900/15 bg-white text-green-900 hover:border-green-500"
          }`}
        >
          Todas
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={chipHref(c.slug)}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition ${
              activeCategory === c.slug
                ? "border-green-700 bg-green-700 text-white"
                : "border-green-900/15 bg-white text-green-900 hover:border-green-500"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-green-900/15 py-20 text-center">
          <Search size={40} className="text-green-900/20" />
          <p className="text-ink/60">Nenhum produto encontrado.</p>
          <Link href="/produtos" className="btn-green">
            Ver todos os produtos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
