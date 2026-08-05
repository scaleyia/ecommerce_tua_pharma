"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Minus, ShoppingBag, Zap } from "lucide-react";
import type { Product } from "@/lib/types";
import { unitPrice } from "@/lib/data";
import { brl, installment } from "@/lib/format";
import { useCart } from "@/context/CartContext";

export function ProductPurchase({ product }: { product: Product }) {
  const { add, setOpen } = useCart();
  const [qty, setQty] = useState(1);
  const sizes = product.sizes;
  const [size, setSize] = useState<string | undefined>(
    sizes
      ? sizes.find((s) => s.price === product.price)?.label ?? sizes[0].label
      : undefined
  );
  const router = useRouter();
  const price = unitPrice(product, size);

  const buyNow = () => {
    add(product.id, qty, size);
    setOpen(false);
    router.push("/carrinho");
  };

  return (
    <div className="flex flex-col gap-4">
      {sizes && (
        <div>
          <p className="mb-2 text-sm font-medium text-green-900">
            Escolha o tamanho
          </p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s.label}
                onClick={() => setSize(s.label)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  size === s.label
                    ? "border-green-700 bg-green-700 text-white"
                    : "border-green-900/15 bg-white text-green-900 hover:border-green-500"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <p className="mt-4 font-display text-4xl font-light text-green-900">
            {brl(price)}
          </p>
          <p className="text-sm text-ink/55">
            ou {installment(price)} ·{" "}
            <span className="text-green-600">5% OFF no Pix</span>
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center justify-between rounded-full border border-green-900/15 bg-white sm:w-32">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-4 py-3 text-green-900 hover:text-green-600"
            aria-label="Diminuir"
          >
            <Minus size={16} />
          </button>
          <span className="min-w-6 text-center font-medium">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="px-4 py-3 text-green-900 hover:text-green-600"
            aria-label="Aumentar"
          >
            <Plus size={16} />
          </button>
        </div>

        <button
          onClick={() => add(product.id, qty, size)}
          className="btn-outline flex-1"
        >
          <ShoppingBag size={18} />
          Adicionar ao carrinho
        </button>
        <button onClick={buyNow} className="btn-gold flex-1">
          <Zap size={18} />
          Comprar agora
        </button>
      </div>
    </div>
  );
}
