"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, User, Phone, Mail, Check, Copy, PartyPopper } from "lucide-react";
import { Logo } from "./Logo";
import { useAuth } from "@/context/AuthContext";

const POPUP_FLAG = "tua-popup-shown";
const DELAY_MS = 1200; // aparece logo após carregar/atualizar a página

type Segment = { label: string; code: string; win: boolean };

// 8 fatias (visual). Só as fatias "win" podem ser sorteadas → cliente sempre ganha cupom.
const SEGMENTS: Segment[] = [
  { label: "5% OFF", code: "TUA5", win: true },
  { label: "10% OFF", code: "TUA10", win: true },
  { label: "Frete Grátis", code: "FRETEGRATIS", win: false },
  { label: "15% OFF", code: "TUA15", win: true },
  { label: "Brinde", code: "BRINDE", win: false },
  { label: "10% OFF", code: "TUA10", win: true },
  { label: "20% OFF", code: "TUA20", win: true },
  { label: "5% OFF", code: "TUA5", win: true },
];

const SEG = 360 / SEGMENTS.length;

export function RoletaPopup() {
  const { user, hydrated } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", whatsapp: "", email: "" });
  const [consent, setConsent] = useState(true);
  const [error, setError] = useState("");
  const [phase, setPhase] = useState<"form" | "spinning" | "won">("form");
  const [rotation, setRotation] = useState(0);
  const [prize, setPrize] = useState<Segment | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    // Estratégia: mostra a roleta a cada visita/refresh enquanto o usuário
    // NÃO estiver logado. Se estiver logado, nunca aparece.
    if (user) return;
    const t = setTimeout(() => {
      setOpen(true);
      // marca que um pop-up apareceu nesta sessão (evita o pop-up de receita junto)
      try {
        sessionStorage.setItem(POPUP_FLAG, "1");
      } catch {}
    }, DELAY_MS);
    return () => clearTimeout(t);
  }, [hydrated, user]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const spin = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return setError("Preencha seu nome.");
    if (form.whatsapp.replace(/\D/g, "").length < 10)
      return setError("Preencha um WhatsApp válido.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      return setError("Preencha um e-mail válido.");
    if (!consent) return setError("É preciso aceitar receber as comunicações.");
    setError("");

    // sorteia uma fatia premiada
    const winners = SEGMENTS.map((s, i) => (s.win ? i : -1)).filter((i) => i >= 0);
    const target = winners[Math.floor(Math.random() * winners.length)];
    const wonCoupon = SEGMENTS[target].code;

    // salva o lead -> API (planilha) + backup no localStorage
    const lead = { ...form, coupon: wonCoupon };
    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    }).catch(() => {});
    try {
      const leads = JSON.parse(localStorage.getItem("tua-leads") || "[]");
      leads.push({ ...lead, date: new Date().toISOString() });
      localStorage.setItem("tua-leads", JSON.stringify(leads));
    } catch {}

    const theta = target * SEG + SEG / 2;
    const jitter = (Math.random() - 0.5) * (SEG * 0.5);
    const finalRotation = 360 * 6 + (360 - theta) + jitter;

    setPhase("spinning");
    setRotation(finalRotation);
    setTimeout(() => {
      setPrize(SEGMENTS[target]);
      setPhase("won");
      try {
        localStorage.setItem("tua-cupom-roleta", SEGMENTS[target].code);
      } catch {}
    }, 4800);
  };

  const copy = () => {
    if (!prize) return;
    navigator.clipboard?.writeText(prize.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-green-950/70 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-cream shadow-2xl">
        <button
          onClick={() => setOpen(false)}
          aria-label="Fechar"
          className="absolute right-4 top-4 z-10 text-green-900/50 hover:text-green-900"
        >
          <X size={22} />
        </button>

        <div className="flex flex-col items-center gap-4 px-6 pb-6 pt-8 text-center">
          <Logo size="sm" />

          {phase !== "won" ? (
            <>
              <h2 className="font-display text-3xl font-light tracking-wide text-green-900">
                GIRE A ROLETA
              </h2>
              <p className="-mt-2 text-sm text-ink/60">
                E ganhe um <strong className="text-gold-dark">desconto especial</strong> para
                a sua compra!
              </p>

              {/* roleta */}
              <div className="relative my-1 h-56 w-56">
                {/* ponteiro */}
                <div className="absolute -top-1 left-1/2 z-20 -translate-x-1/2">
                  <div className="h-0 w-0 border-x-[10px] border-t-[16px] border-x-transparent border-t-green-900" />
                </div>
                {/* disco */}
                <div
                  className="h-56 w-56 rounded-full border-4 border-green-900 shadow-card"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transition: "transform 4.8s cubic-bezier(0.16, 1, 0.3, 1)",
                    backgroundImage: `conic-gradient(${SEGMENTS.map(
                      (_, i) =>
                        `${i % 2 ? "#E6C878" : "#C9A24B"} ${i * SEG}deg ${(i + 1) * SEG}deg`
                    ).join(",")})`,
                  }}
                >
                  {SEGMENTS.map((s, i) => (
                    <div
                      key={i}
                      className="absolute left-1/2 top-0 h-1/2 origin-bottom"
                      style={{ transform: `translateX(-50%) rotate(${i * SEG + SEG / 2}deg)` }}
                    >
                      <span className="mt-3 block whitespace-nowrap text-[11px] font-bold text-green-950">
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
                {/* eixo central */}
                <div className="absolute left-1/2 top-1/2 z-10 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-green-900 bg-gold" />
              </div>

              <form onSubmit={spin} className="w-full space-y-2.5">
                <label className="flex cursor-pointer items-center justify-center gap-2 text-xs text-ink/70">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="accent-green-700"
                  />
                  Concordo em receber comunicações da Tua Pharma
                </label>

                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
                  <input value={form.name} onChange={set("name")} placeholder="Nome" className="input pl-11" />
                </div>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
                  <input value={form.whatsapp} onChange={set("whatsapp")} placeholder="Ex: (00) 00000-0000" className="input pl-11" />
                </div>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
                  <input value={form.email} onChange={set("email")} placeholder="Ex: seuemail@aqui.com" className="input pl-11" />
                </div>

                {error && <p className="text-xs text-red-500">{error}</p>}

                <button type="submit" disabled={phase === "spinning"} className="btn-gold w-full">
                  {phase === "spinning" ? "Girando..." : "GIRAR!"}
                </button>
                <p className="text-[0.65rem] text-ink/40">
                  Seus dados são tratados com sigilo, conforme a LGPD.
                </p>
              </form>
            </>
          ) : (
            /* resultado */
            <div className="flex flex-col items-center gap-4 py-2">
              <PartyPopper size={44} className="text-gold" />
              <h2 className="font-display text-2xl font-light text-green-900">
                Parabéns, {form.name.split(" ")[0]}!
              </h2>
              <p className="text-sm text-ink/60">
                Você ganhou <strong className="text-green-700">{prize?.label}</strong> na sua
                próxima compra. Use o cupom abaixo:
              </p>
              <button
                onClick={copy}
                className="flex items-center gap-3 rounded-xl border-2 border-dashed border-gold bg-gold/10 px-6 py-3 font-display text-2xl font-medium tracking-widest text-green-900"
              >
                {prize?.code}
                {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} className="text-gold-dark" />}
              </button>
              <p className="text-xs text-ink/50">{copied ? "Copiado!" : "Toque para copiar"}</p>
              <Link href="/produtos" onClick={() => setOpen(false)} className="btn-gold mt-1 w-full">
                Aproveitar agora
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
