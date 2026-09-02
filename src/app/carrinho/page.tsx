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
  QrCode,
  CreditCard,
  Copy,
  Loader2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  startCheckout,
  completeWhenPaid,
  pagarmeEnabled,
  type CheckoutAddress,
  type PaymentMethod,
} from "@/lib/checkout";
import { cardEnabled, tokenizeCard } from "@/lib/pagarme";
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

const emptyCard = {
  number: "",
  holder: "",
  exp: "", // MM/AA
  cvv: "",
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

  // pagamento
  const [method, setMethod] = useState<PaymentMethod>("pix");
  const [cpf, setCpf] = useState("");
  const [card, setCard] = useState(emptyCard);
  const [pagarmeOn, setPagarmeOn] = useState(false);
  const [pix, setPix] = useState<{
    cartId: string;
    qrCode?: string;
    qrCodeUrl?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // pré-preenche o endereço com os dados da conta
  useEffect(() => {
    if (user) {
      setAddr((a) => ({
        ...a,
        name: a.name || user.name || "",
        phone: a.phone || user.phone || "",
        cep: a.cep || user.cep || "",
        street: a.street || user.address || "",
      }));
      setCpf((c) => c || user.cpf || "");
    }
  }, [user]);

  // o seletor Pix/cartão só faz sentido com a Pagar.me habilitada na região
  useEffect(() => {
    pagarmeEnabled().then(setPagarmeOn);
  }, []);

  // Pix é assíncrono: fica tentando fechar o carrinho até o pagamento cair
  useEffect(() => {
    if (!pix) return;
    let alive = true;
    const timer = setInterval(async () => {
      const order = await completeWhenPaid(pix.cartId);
      if (order && alive) {
        clearInterval(timer);
        setPix(null);
        setPlaced({ displayId: order.displayId });
        clear();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 5000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [pix, clear]);

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
    // Pix na Pagar.me exige CPF do pagador
    if (pagarmeOn && !cpf.replace(/\D/g, "")) {
      setCheckoutError("Informe o CPF do titular para gerar o pagamento.");
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
      // cartão: token gerado no navegador (o número não passa pelo nosso servidor)
      let cardToken: string | undefined;
      if (pagarmeOn && method === "credit_card") {
        const [mm, yy] = card.exp.split("/").map((s) => s.trim());
        cardToken = await tokenizeCard({
          number: card.number,
          holderName: card.holder,
          expMonth: mm ?? "",
          expYear: yy ?? "",
          cvv: card.cvv,
        });
      }

      const result = await startCheckout({
        items,
        email: user.email,
        address,
        paymentMethod: method,
        document: cpf,
        phone: addr.phone,
        cardToken,
      });

      if (result.kind === "pix") {
        setPix(result);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setPlaced({ displayId: result.order.displayId });
        clear();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
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

  // aguardando o Pix cair (o pedido só é criado depois do pagamento)
  if (pix) {
    return (
      <div className="container-tua flex flex-col items-center gap-5 py-16 text-center">
        <QrCode size={48} className="text-green-700" />
        <h1 className="font-display text-3xl font-light text-green-900">
          Pague com Pix para concluir
        </h1>
        <p className="max-w-md text-ink/60">
          Abra o app do seu banco, escaneie o QR code abaixo (ou use o
          copia-e-cola) e pague <strong>{brl(total)}</strong>. Assim que o
          pagamento cair, seu pedido é gerado automaticamente.
        </p>

        {pix.qrCodeUrl && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={pix.qrCodeUrl}
            alt="QR code do Pix"
            className="h-60 w-60 rounded-2xl border border-green-900/10 bg-white p-3"
          />
        )}

        {pix.qrCode && (
          <div className="w-full max-w-md">
            <p className="label text-left">Pix copia e cola</p>
            <div className="flex gap-2">
              <input readOnly value={pix.qrCode} className="input font-mono text-xs" />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(pix.qrCode!);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="btn-green shrink-0 px-4 py-2"
              >
                <Copy size={16} /> {copied ? "Copiado!" : "Copiar"}
              </button>
            </div>
          </div>
        )}

        <p className="flex items-center gap-2 text-sm text-ink/50">
          <Loader2 size={16} className="animate-spin" /> Aguardando confirmação do
          pagamento...
        </p>
        <button
          onClick={() => setPix(null)}
          className="text-xs font-medium text-ink/50 hover:text-red-500"
        >
          Cancelar e voltar ao carrinho
        </button>
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

                {/* forma de pagamento (só com a Pagar.me habilitada) */}
                {pagarmeOn && (
                  <div className="mt-5 border-t border-green-900/10 pt-4">
                    <h3 className="mb-2 text-sm font-semibold text-green-900">
                      Forma de pagamento
                    </h3>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setMethod("pix")}
                        className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                          method === "pix"
                            ? "border-gold bg-gold/10 text-green-900"
                            : "border-green-900/15 text-ink/60 hover:border-green-900/30"
                        }`}
                      >
                        <QrCode size={16} /> Pix
                      </button>
                      {cardEnabled() && (
                        <button
                          type="button"
                          onClick={() => setMethod("credit_card")}
                          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                            method === "credit_card"
                              ? "border-gold bg-gold/10 text-green-900"
                              : "border-green-900/15 text-ink/60 hover:border-green-900/30"
                          }`}
                        >
                          <CreditCard size={16} /> Cartão
                        </button>
                      )}
                    </div>

                    <input
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
                      placeholder="CPF do titular"
                      className="input mt-2"
                    />

                    {method === "credit_card" && (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <input
                          value={card.number}
                          onChange={(e) => setCard((c) => ({ ...c, number: e.target.value }))}
                          placeholder="Número do cartão"
                          inputMode="numeric"
                          className="input col-span-2"
                        />
                        <input
                          value={card.holder}
                          onChange={(e) => setCard((c) => ({ ...c, holder: e.target.value }))}
                          placeholder="Nome impresso no cartão"
                          className="input col-span-2"
                        />
                        <input
                          value={card.exp}
                          onChange={(e) => setCard((c) => ({ ...c, exp: e.target.value }))}
                          placeholder="Validade (MM/AA)"
                          className="input"
                        />
                        <input
                          value={card.cvv}
                          onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value }))}
                          placeholder="CVV"
                          inputMode="numeric"
                          className="input"
                        />
                      </div>
                    )}
                  </div>
                )}

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
                  <Lock size={16} />{" "}
                  {loading
                    ? "Processando..."
                    : pagarmeOn && method === "pix"
                      ? "Gerar Pix e finalizar"
                      : "Finalizar compra"}
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
