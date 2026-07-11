"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Minus, ShoppingBag, Zap } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function ProductPurchase({ productId }: { productId: string }) {
  const { add, setOpen } = useCart();
  const [qty, setQty] = useState(1);
  const router = useRouter();

  const buyNow = () => {
    add(productId, qty);
    setOpen(false);
    router.push("/carrinho");
  };

  return (
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

      <button onClick={() => add(productId, qty)} className="btn-outline flex-1">
        <ShoppingBag size={18} />
        Adicionar ao carrinho
      </button>
      <button onClick={buyNow} className="btn-gold flex-1">
        <Zap size={18} />
        Comprar agora
      </button>
    </div>
  );
}
