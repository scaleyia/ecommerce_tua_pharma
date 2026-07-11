"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Tag,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { products } from "@/lib/data";
import { brl } from "@/lib/format";
import { ProductImage } from "@/components/ProductImage";

const FREE_SHIPPING = 199;
const COUPONS: Record<string, number> = {
  TUA5: 0.05,
  TUA10: 0.1,
  TUA15: 0.15,
  TUA20: 0.2,
  BEMVINDO: 0.05,
};

export default function CartPage() {
  const { items, setQty, remove, subtotal, clear } = useCart();
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState<{ code: string; rate: number } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [placed, setPlaced] = useState(false);

  const shipping = subtotal >= FREE_SHIPPING || subtotal === 0 ? 0 : 19.9;
  const discount = applied ? subtotal * applied.rate : 0;
  const total = subtotal - discount + shipping;

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (COUPONS[code]) {
      setApplied({ code, rate: COUPONS[code] });
      setCouponError("");
    } else {
      setApplied(null);
      setCouponError("Cupom inválido. Tente TUA10.");
    }
  };

  const checkout = () => {
    setPlaced(true);
    clear();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (placed) {
    return (
      <div className="container-tua flex flex-col items-center gap-5 py-24 text-center">
        <CheckCircle2 size={64} className="text-green-600" />
        <h1 className="font-display text-3xl font-light text-green-900">
          Pedido realizado com sucesso!
        </h1>
        <p className="max-w-md text-ink/60">
          Obrigado por comprar na Tua Pharma. Enviamos a confirmação por e-mail e você pode
          acompanhar o status na sua conta. (Demonstração — nenhuma cobrança foi feita.)
        </p>
        <div className="flex gap-3">
          <Link href="/produtos" className="btn-green">Continuar comprando</Link>
          <Link href="/conta" className="btn-outline">Ver meus pedidos</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-tua flex flex-col items-center gap-5 py-24 text-center">
        <ShoppingBag size={64} className="text-green-900/20" />
        <h1 className="font-display text-3xl font-light text-green-900">
          Seu carrinho está vazio
        </h1>
        <p className="text-ink/60">Explore nossos manipulados e suplementos.</p>
        <Link href="/produtos" className="btn-gold">Ver produtos</Link>
      </div>
    );
  }

  return (
    <div className="container-tua py-8">
      <h1 className="mb-6 font-display text-3xl font-light text-green-900">
        Meu carrinho
      </h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* itens */}
        <div className="space-y-4">
          {items.map((item) => {
            const p = products.find((x) => x.id === item.productId);
            if (!p) return null;
            return (
              <div key={item.productId} className="card flex gap-4 p-4">
                <ProductImage
                  categorySlug={p.category}
                  className="h-24 w-24 shrink-0 rounded-xl"
                  iconSize={44}
                />
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={`/produtos/${p.slug}`}
                      className="font-medium text-green-900 hover:text-green-600"
                    >
                      {p.name}
                    </Link>
                    <button
                      onClick={() => remove(p.id)}
                      className="text-ink/30 hover:text-red-500"
                      aria-label="Remover"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <span className="text-xs text-ink/50">{p.badges.join(" · ")}</span>

                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-full border border-green-900/15">
                      <button
                        onClick={() => setQty(p.id, item.quantity - 1)}
                        className="px-3 py-1.5 text-green-900 hover:text-green-600"
                        aria-label="Diminuir"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => setQty(p.id, item.quantity + 1)}
                        className="px-3 py-1.5 text-green-900 hover:text-green-600"
                        aria-label="Aumentar"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-900">
                        {brl(p.price * item.quantity)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-ink/45">{brl(p.price)} cada</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex justify-between">
            <Link href="/produtos" className="text-sm font-medium text-green-700 hover:text-gold-dark">
              ← Continuar comprando
            </Link>
            <button onClick={clear} className="text-sm text-ink/50 hover:text-red-500">
              Esvaziar carrinho
            </button>
          </div>
        </div>

        {/* resumo */}
        <aside className="h-fit space-y-4 lg:sticky lg:top-28">
          <div className="card p-6">
            <h2 className="font-display text-xl font-light text-green-900">
              Resumo do pedido
            </h2>

            {/* cupom */}
            <div className="mt-4">
              <label className="label flex items-center gap-1.5">
                <Tag size={14} className="text-gold-dark" /> Cupom de desconto
              </label>
              <div className="flex gap-2">
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Ex.: TUA10"
                  className="input"
                />
                <button onClick={applyCoupon} className="btn-green shrink-0 px-4 py-2">
                  Aplicar
                </button>
              </div>
              {couponError && <p className="mt-1 text-xs text-red-500">{couponError}</p>}
              {applied && (
                <p className="mt-1 text-xs text-green-600">
                  Cupom {applied.code} aplicado ({applied.rate * 100}% OFF)
                </p>
              )}
            </div>

            <dl className="mt-5 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink/60">Subtotal</dt>
                <dd className="text-green-900">{brl(subtotal)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <dt>Desconto</dt>
                  <dd>- {brl(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-ink/60">Frete</dt>
                <dd className={shipping === 0 ? "text-green-600" : "text-green-900"}>
                  {shipping === 0 ? "Grátis" : brl(shipping)}
                </dd>
              </div>
              <div className="my-2 h-px bg-green-900/10" />
              <div className="flex items-end justify-between">
                <dt className="font-medium text-green-900">Total</dt>
                <dd className="font-display text-2xl font-light text-green-900">
                  {brl(total)}
                </dd>
              </div>
            </dl>

            <button onClick={checkout} className="btn-gold mt-5 w-full">
              <Lock size={16} /> Finalizar compra
            </button>
            <p className="mt-3 text-center text-xs text-ink/45">
              Pagamento 100% seguro · Pix, cartão ou boleto
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
