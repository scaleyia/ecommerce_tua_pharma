"use client";

import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { products } from "@/lib/data";
import { brl } from "@/lib/format";
import { ProductImage } from "./ProductImage";

const FREE_SHIPPING = 199;

export function CartDrawer() {
  const { items, isOpen, setOpen, setQty, remove, subtotal, count } = useCart();

  const missing = Math.max(0, FREE_SHIPPING - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING) * 100);

  return (
    <>
      {/* overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-green-950/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isOpen}
      />

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Carrinho de compras"
      >
        <header className="flex items-center justify-between border-b border-green-900/10 bg-green-900 px-5 py-4 text-white">
          <span className="flex items-center gap-2 font-display text-lg font-light tracking-wide">
            <ShoppingBag size={18} className="text-gold" />
            Meu carrinho
            <span className="text-sm text-gold">({count})</span>
          </span>
          <button onClick={() => setOpen(false)} aria-label="Fechar">
            <X size={22} className="text-white/80 hover:text-gold" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <ShoppingBag size={48} className="text-green-900/20" />
            <p className="text-ink/60">Seu carrinho está vazio.</p>
            <button onClick={() => setOpen(false)} className="btn-green">
              Continuar comprando
            </button>
          </div>
        ) : (
          <>
            <div className="border-b border-green-900/10 bg-white px-5 py-3">
              {missing > 0 ? (
                <p className="text-xs text-ink/70">
                  Faltam <strong className="text-green-700">{brl(missing)}</strong> para
                  o <strong>frete grátis</strong>
                </p>
              ) : (
                <p className="text-xs font-medium text-green-600">
                  🎉 Você ganhou frete grátis!
                </p>
              )}
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-green-900/10">
                <div
                  className="h-full rounded-full bg-gold transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-5">
              {items.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                if (!product) return null;
                return (
                  <div key={item.productId} className="card flex gap-3 p-3">
                    <ProductImage
                      categorySlug={product.category}
                      className="h-20 w-20 shrink-0 rounded-xl"
                      iconSize={40}
                    />
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/produtos/${product.slug}`}
                          onClick={() => setOpen(false)}
                          className="text-sm font-medium leading-snug text-green-900 hover:text-green-600"
                        >
                          {product.name}
                        </Link>
                        <button
                          onClick={() => remove(product.id)}
                          aria-label="Remover"
                          className="text-ink/30 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center rounded-full border border-green-900/15">
                          <button
                            onClick={() => setQty(product.id, item.quantity - 1)}
                            className="px-2 py-1 text-green-900 hover:text-green-600"
                            aria-label="Diminuir"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => setQty(product.id, item.quantity + 1)}
                            className="px-2 py-1 text-green-900 hover:text-green-600"
                            aria-label="Aumentar"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-green-900">
                          {brl(product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <footer className="border-t border-green-900/10 bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-ink/70">Subtotal</span>
                <span className="text-xl font-semibold text-green-900">
                  {brl(subtotal)}
                </span>
              </div>
              <Link
                href="/carrinho"
                onClick={() => setOpen(false)}
                className="btn-gold w-full"
              >
                Finalizar compra
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="mt-2 w-full text-center text-sm text-ink/60 hover:text-green-700"
              >
                Continuar comprando
              </button>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
