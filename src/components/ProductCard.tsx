"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { brl, installment, discountPercent } from "@/lib/format";
import { ProductImage } from "./ProductImage";
import { StarRating } from "./StarRating";
import { useCart } from "@/context/CartContext";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const off = discountPercent(product.price, product.oldPrice);

  return (
    <div className="card group flex flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-gold">
      <Link
        href={`/produtos/${product.slug}`}
        className="relative block"
        aria-label={product.name}
      >
        <ProductImage
          categorySlug={product.category}
          name={product.name}
          className="aspect-square"
        />
        {off > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-1 text-xs font-bold text-green-900 shadow-sm">
            -{off}%
          </span>
        )}
        {product.bestseller && (
          <span className="absolute right-3 top-3 rounded-full bg-green-900/85 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wide text-gold shadow-sm">
            Mais vendido
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex flex-wrap gap-1">
          {product.badges.map((b) => (
            <span
              key={b}
              className="rounded-full bg-cream px-2 py-0.5 text-[0.65rem] font-medium text-green-700"
            >
              {b}
            </span>
          ))}
        </div>

        <Link href={`/produtos/${product.slug}`}>
          <h3 className="font-display text-base font-medium leading-snug text-green-900 transition group-hover:text-green-600">
            {product.name}
          </h3>
        </Link>

        <p className="mt-1 line-clamp-2 text-sm text-ink/60">
          {product.shortDescription}
        </p>

        <div className="mt-2">
          <StarRating value={product.rating} reviews={product.reviews} />
        </div>

        <div className="mt-auto pt-3">
          {product.oldPrice && (
            <span className="text-sm text-ink/40 line-through">
              {brl(product.oldPrice)}
            </span>
          )}
          <div className="flex items-end gap-2">
            <span className="text-xl font-semibold text-green-900">
              {brl(product.price)}
            </span>
          </div>
          <span className="text-xs text-ink/50">{installment(product.price)}</span>

          <button
            onClick={() => add(product.id)}
            className="btn-gold mt-3 w-full"
          >
            <ShoppingBag size={16} />
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
}
