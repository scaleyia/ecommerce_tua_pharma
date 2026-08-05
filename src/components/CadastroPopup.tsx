"use client";

import { useEffect, useState } from "react";
import { X, BadgePercent, User, Mail, Phone, Cake, Check, Gift } from "lucide-react";

const SESSION_KEY = "tua-cadastro-popup";
const POPUP_FLAG = "tua-popup-shown";
const COUPON = "TUA10"; // cupom real de 10% (válido no checkout)

export function CadastroPopup() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [agree, setAgree] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  // aparece após alguns segundos de navegação ativa
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;

    let active = 0;
    const timer = setInterval(() => {
      if (sessionStorage.getItem(POPUP_FLAG)) {
        clearInterval(timer);
        return;
      }
      if (document.visibilityState === "visible") {
        active += 1;
        if (active >= 8) {
          setOpen(true);
          sessionStorage.setItem(SESSION_KEY, "1");
          sessionStorage.setItem(POPUP_FLAG, "1");
          clearInterval(timer);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim()) {
      setError("Preencha nome e e-mail para continuar.");
      return;
    }
    if (!agree) {
      setError("É preciso aceitar receber as comunicações.");
      return;
    }
    setLoading(true);
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          whatsapp,
          email,
          birthdate,
          coupon: COUPON,
          origem: "popup-cadastro",
        }),
      });
    } catch {
      // não bloqueia — mesmo offline, mostra o cupom
    }
    setLoading(false);
    setDone(true);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center">
      <div
        className="absolute inset-0 bg-green-950/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      <div className="relative w-full max-w-md animate-fade-up overflow-hidden rounded-3xl bg-cream shadow-2xl">
        <button
          onClick={() => setOpen(false)}
          aria-label="Fechar"
          className="absolute right-4 top-4 z-10 text-white/70 hover:text-gold"
        >
          <X size={22} />
        </button>

        {done ? (
          /* ---- sucesso: mostra o cupom ---- */
          <div className="flex flex-col items-center gap-4 px-7 py-10 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-700/10 text-green-700">
              <Check size={34} />
            </span>
            <h2 className="font-display text-2xl font-light text-green-900">
              Cadastro concluído! 🎉
            </h2>
            <p className="text-sm text-ink/60">
              Use o cupom abaixo na sua primeira compra e garanta{" "}
              <strong className="text-green-800">10% de desconto</strong>.
            </p>
            <div className="w-full rounded-2xl border border-dashed border-gold bg-white py-4">
              <p className="text-xs uppercase tracking-widest text-ink/50">Seu cupom</p>
              <p className="font-display text-3xl font-medium tracking-wider text-gold-dark">
                {COUPON}
              </p>
            </div>
            <button onClick={() => setOpen(false)} className="btn-gold mt-1 w-full">
              Começar a comprar
            </button>
          </div>
        ) : (
          <>
            {/* topo — a "chamada" do panfleto */}
            <div className="relative flex flex-col items-center gap-2 bg-green-900 px-6 py-7 text-center text-white">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold">
                <BadgePercent size={28} />
              </span>
              <h2 className="font-display text-2xl font-light">
                Ganhe <span className="text-gold">10% OFF</span> na 1ª compra
              </h2>
              <p className="max-w-xs text-sm text-white/70">
                Cadastre-se e receba ofertas exclusivas, brinde de aniversário e
                novidades da Tua Pharma.
              </p>
            </div>

            {/* formulário */}
            <form onSubmit={submit} className="flex flex-col gap-3 p-6">
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-700" />
                <input
                  className="input pl-10"
                  placeholder="Nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-700" />
                <input
                  type="email"
                  className="input pl-10"
                  placeholder="Seu melhor e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-700" />
                <input
                  className="input pl-10"
                  placeholder="WhatsApp (opcional)"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  autoComplete="tel"
                />
              </div>
              <div className="relative">
                <Cake size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-700" />
                <input
                  type="date"
                  className="input pl-10 text-ink/70"
                  aria-label="Data de nascimento"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                />
              </div>

              <label className="mt-1 flex items-start gap-2 text-xs text-ink/60">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-green-700"
                />
                Concordo em receber comunicações da Tua Pharma.
              </label>

              {error && <p className="text-xs text-red-500">{error}</p>}

              <button type="submit" disabled={loading} className="btn-gold mt-1 w-full">
                <Gift size={18} />
                {loading ? "Enviando..." : "Quero meu desconto"}
              </button>

              <p className="text-center text-[0.7rem] text-ink/45">
                Seus dados são tratados com sigilo, conforme a LGPD.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
