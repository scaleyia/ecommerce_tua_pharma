"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Tag,
  CheckCircle2,
  Lock,
  LogIn,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { placeOrder, type CheckoutAddress } from "@/lib/checkout";
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

const emptyAddress = {
  name: "",
  phone: "",
  cep: "",
  street: "",
  number: "",
  complement: "",
  district: "",
  city: "",
  uf: "",
};

export default function CartPage() {
  const { items, setQty, remove, subtotal, clear } = useCart();
  const { user, hydrated } = useAuth();
  const router = useRouter();
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState<{ code: string; rate: number } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [placed, setPlaced] = useState<{ displayId?: number } | null>(null);
  const [addr, setAddr] = useState(emptyAddress);
  const [loading, setLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  // pré-preenche o endereço com os dados da conta
  useEffect(() => {
    if (user)
      setAddr((a) => ({
        ...a,
        name: a.name || user.name || "",
        phone: a.phone || user.phone || "",
        cep: a.cep || user.cep || "",
        street: a.street || user.address || "",
      }));
  }, [user]);

  const shipping = subtotal >= FREE_SHIPPING || subtotal === 0 ? 0 : 19.9;
  const discount = applied ? subtotal * applied.rate : 0;
  const total = subtotal - discount + shipping;

  const setField = (k: keyof typeof addr) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setAddr((a) => ({ ...a, [k]: e.target.value }));

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

  const checkout = async () => {
    // trava: só compra logado
    if (!user) {
      router.push("/login?redirect=/carrinho");
      return;
    }
    // valida endereço mínimo p/ frete + pedido
    if (!addr.street || !addr.number || !addr.city || !addr.uf || !addr.cep) {
      setCheckoutError("Preencha o endereço de entrega (CEP, rua, número, cidade e UF).");
      return;
    }
    setCheckoutError("");
    setLoading(true);
    try {
      const [first, ...rest] = addr.name.trim().split(/\s+/);
      const address: CheckoutAddress = {
        first_name: first || user.name,
        last_name: rest.join(" "),
        phone: addr.phone || undefined,
        address_1: `${addr.street}, ${addr.number}${addr.complement ? " - " + addr.complement : ""}`,
        address_2: addr.district || undefined,
        city: addr.city,
        province: addr.uf,
        postal_code: addr.cep.replace(/\D/g, ""),
        country_code: "br",
      };
      const order = await placeOrder({ items, email: user.email, address });
      setPlaced({ displayId: order.displayId });
      clear();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e: any) {
      setCheckoutError(e?.message || "Não foi possível concluir o pedido.");
    } finally {
      setLoading(false);
    }
  };

  if (placed) {
    return (
      <div className="container-tua flex flex-col items-center gap-5 py-24 text-center">
        <CheckCircle2 size={64} className="text-green-600" />
        <h1 className="font-display text-3xl font-light text-green-900">
          Pedido realizado com sucesso!
        </h1>
        <p className="max-w-md text-ink/60">
          Obrigado por comprar na Tua Pharma
          {placed.displayId ? ` — seu pedido é o nº ${placed.displayId}` : ""}. Você
          pode acompanhar o status na sua conta.
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
          {items.map((item) => (
            <div key={item.productId + (item.size ?? "")} className="card flex gap-4 p-4">
              <ProductImage
                packaging={item.packaging}
                categorySlug={item.category}
                image={item.image}
                showBrand={false}
                label={item.imageLabel ?? item.name}
                className="h-24 w-24 shrink-0 rounded-xl"
              />
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/produtos/${item.slug}`}
                    className="font-medium text-green-900 hover:text-green-600"
                  >
                    {item.name}
                    {item.size && <span className="text-ink/50"> · {item.size}</span>}
                  </Link>
                  <button
                    onClick={() => remove(item.productId, item.size)}
                    className="text-ink/30 hover:text-red-500"
                    aria-label="Remover"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-full border border-green-900/15">
                    <button
                      onClick={() => setQty(item.productId, item.quantity - 1, item.size)}
                      className="px-3 py-1.5 text-green-900 hover:text-green-600"
                      aria-label="Diminuir"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => setQty(item.productId, item.quantity + 1, item.size)}
                      className="px-3 py-1.5 text-green-900 hover:text-green-600"
                      aria-label="Aumentar"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-900">
                      {brl(item.price * item.quantity)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-ink/45">{brl(item.price)} cada</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

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

            {/* trava: precisa estar logado para comprar */}
            {hydrated && !user ? (
              <div className="mt-5 rounded-xl bg-cream p-4 text-center">
                <p className="text-sm text-ink/70">
                  Para finalizar a compra, entre na sua conta ou cadastre-se.
                </p>
                <Link
                  href="/login?redirect=/carrinho"
                  className="btn-gold mt-3 w-full"
                >
                  <LogIn size={16} /> Entrar para comprar
                </Link>
                <Link
                  href="/cadastro"
                  className="mt-2 block text-xs font-medium text-green-700 hover:text-gold-dark"
                >
                  Não tem conta? Cadastre-se
                </Link>
              </div>
            ) : (
              <>
                {/* endereço de entrega */}
                <div className="mt-5 border-t border-green-900/10 pt-4">
                  <h3 className="mb-2 text-sm font-semibold text-green-900">
                    Endereço de entrega
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <input value={addr.name} onChange={setField("name")} placeholder="Nome completo" className="input col-span-2" />
                    <input value={addr.phone} onChange={setField("phone")} placeholder="Telefone" className="input" />
                    <input value={addr.cep} onChange={setField("cep")} placeholder="CEP" className="input" />
                    <input value={addr.street} onChange={setField("street")} placeholder="Rua" className="input col-span-2" />
                    <input value={addr.number} onChange={setField("number")} placeholder="Número" className="input" />
                    <input value={addr.complement} onChange={setField("complement")} placeholder="Complemento" className="input" />
                    <input value={addr.district} onChange={setField("district")} placeholder="Bairro" className="input col-span-2" />
                    <input value={addr.city} onChange={setField("city")} placeholder="Cidade" className="input" />
                    <input value={addr.uf} onChange={setField("uf")} placeholder="UF" maxLength={2} className="input" />
                  </div>
                </div>

                {checkoutError && (
                  <p className="mt-3 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
                    {checkoutError}
                  </p>
                )}

                <button
                  onClick={checkout}
                  disabled={loading}
                  className="btn-gold mt-4 w-full disabled:opacity-60"
                >
                  <Lock size={16} /> {loading ? "Processando..." : "Finalizar compra"}
                </button>
                <p className="mt-3 text-center text-xs text-ink/45">
                  Pagamento 100% seguro · Pix, cartão ou boleto
                </p>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
