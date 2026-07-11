"use client";

import { useEffect, useState } from "react";
import { X, FileText, MessageCircle } from "lucide-react";

const SESSION_KEY = "tua-receita-popup";
const POPUP_FLAG = "tua-popup-shown";
const WHATSAPP =
  "https://wa.me/5511900000000?text=" +
  encodeURIComponent("Olá! Gostaria de enviar minha receita para manipulação. 📄");

export function ReceitaPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;

    let active = 0;
    const timer = setInterval(() => {
      // se outro pop-up (roleta) já apareceu nesta sessão, não mostra
      if (sessionStorage.getItem(POPUP_FLAG)) {
        clearInterval(timer);
        return;
      }
      if (document.visibilityState === "visible") {
        active += 1;
        if (active >= 20) {
          setOpen(true);
          sessionStorage.setItem(SESSION_KEY, "1");
          sessionStorage.setItem(POPUP_FLAG, "1");
          clearInterval(timer);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center">
      <div
        className="absolute inset-0 bg-green-950/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      <div className="relative w-full max-w-md animate-fade-up overflow-hidden rounded-3xl bg-cream shadow-2xl">
        {/* topo */}
        <div className="relative flex flex-col items-center gap-3 bg-green-900 px-6 py-8 text-center text-white">
          <button
            onClick={() => setOpen(false)}
            aria-label="Fechar"
            className="absolute right-4 top-4 text-white/70 hover:text-gold"
          >
            <X size={22} />
          </button>
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-gold">
            <FileText size={30} />
          </span>
          <h2 className="font-display text-2xl font-light">
            Quer enviar sua receita?
          </h2>
          <p className="max-w-xs text-sm text-white/70">
            Fale agora com nossa equipe farmacêutica pelo WhatsApp e manipule sua fórmula
            com segurança. Rápido e sem burocracia.
          </p>
        </div>

        {/* ação */}
        <div className="flex flex-col gap-3 p-6">
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="btn w-full bg-green-500 text-white hover:bg-green-400"
          >
            <MessageCircle size={18} />
            Enviar pelo WhatsApp
          </a>
          <button
            onClick={() => setOpen(false)}
            className="text-center text-sm text-ink/50 hover:text-green-700"
          >
            Agora não, obrigado
          </button>
        </div>
      </div>
    </div>
  );
}
