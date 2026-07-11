"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

export function ProductRow({ products }: { products: Product[] }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    ref.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={ref}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2"
      >
        {products.map((p) => (
          <div
            key={p.id}
            className="w-[260px] shrink-0 snap-start sm:w-[280px]"
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll(-1)}
        aria-label="Anterior"
        className="absolute -left-3 top-1/3 hidden h-10 w-10 items-center justify-center rounded-full bg-white text-green-900 shadow-card transition hover:bg-gold lg:flex"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => scroll(1)}
        aria-label="Próximo"
        className="absolute -right-3 top-1/3 hidden h-10 w-10 items-center justify-center rounded-full bg-white text-green-900 shadow-card transition hover:bg-gold lg:flex"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
