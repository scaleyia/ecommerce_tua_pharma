"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Upload,
  CheckCircle2,
  ShieldCheck,
  Clock,
  MessageCircle,
} from "lucide-react";

const steps = [
  { icon: Upload, title: "1. Envie a receita", text: "Faça o upload da foto ou PDF da sua prescrição." },
  { icon: ShieldCheck, title: "2. Análise farmacêutica", text: "Nossos farmacêuticos validam a fórmula com segurança." },
  { icon: Clock, title: "3. Orçamento rápido", text: "Você recebe o orçamento e o prazo em poucas horas." },
  { icon: CheckCircle2, title: "4. Manipulação e entrega", text: "Preparamos sua fórmula e enviamos até você." },
];

export default function ReceitaPage() {
  const [fileName, setFileName] = useState("");
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="container-tua flex flex-col items-center gap-5 py-24 text-center">
        <CheckCircle2 size={64} className="text-green-600" />
        <h1 className="font-display text-3xl font-light text-green-900">
          Receita enviada com sucesso!
        </h1>
        <p className="max-w-md text-ink/60">
          Nossa equipe farmacêutica vai analisar sua prescrição e retornar com o orçamento
          em breve. (Demonstração — nenhum dado foi enviado de verdade.)
        </p>
        <Link href="/produtos" className="btn-gold">Explorar produtos</Link>
      </div>
    );
  }

  return (
    <div className="pb-8">
      {/* hero */}
      <section className="bg-green-900 text-white">
        <div className="container-tua flex flex-col items-center gap-4 py-14 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-gold">
            <FileText size={30} />
          </span>
          <h1 className="max-w-2xl font-display text-4xl font-light text-balance md:text-5xl">
            Envie sua receita e manipule com segurança
          </h1>
          <p className="max-w-xl text-white/70">
            Prático, rápido e com todo o rigor técnico de uma farmácia de manipulação
            especializada.
          </p>
        </div>
      </section>

      {/* passos */}
      <section className="container-tua py-14">
        <div className="grid gap-6 md:grid-cols-4">
          {steps.map((s) => (
            <div key={s.title} className="card p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cream text-green-700">
                <s.icon size={22} />
              </div>
              <h3 className="mt-3 font-medium text-green-900">{s.title}</h3>
              <p className="mt-1 text-sm text-ink/60">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* formulário */}
      <section className="container-tua">
        <div className="mx-auto max-w-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="card space-y-5 p-8"
          >
            <h2 className="font-display text-2xl font-light text-green-900">
              Formulário de envio
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Nome completo *</label>
                <input required className="input" placeholder="Seu nome" />
              </div>
              <div>
                <label className="label">Telefone / WhatsApp *</label>
                <input required className="input" placeholder="(11) 90000-0000" />
              </div>
            </div>

            <div>
              <label className="label">E-mail *</label>
              <input type="email" required className="input" placeholder="seu@email.com" />
            </div>

            {/* upload */}
            <div>
              <label className="label">Foto ou PDF da receita *</label>
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-green-900/20 bg-cream px-4 py-10 text-center transition hover:border-green-500">
                <Upload size={26} className="text-green-700" />
                <span className="text-sm text-ink/60">
                  {fileName ? (
                    <strong className="text-green-700">{fileName}</strong>
                  ) : (
                    <>Clique para selecionar ou arraste o arquivo aqui</>
                  )}
                </span>
                <span className="text-xs text-ink/40">JPG, PNG ou PDF até 10MB</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
                />
              </label>
            </div>

            <div>
              <label className="label">Observações (opcional)</label>
              <textarea
                className="input min-h-24 resize-y"
                placeholder="Conte-nos detalhes sobre a fórmula, dúvidas ou preferências."
              />
            </div>

            <button type="submit" className="btn-gold w-full">
              <Upload size={16} /> Enviar receita
            </button>
            <p className="text-center text-xs text-ink/45">
              Seus dados são tratados com sigilo, conforme a LGPD.
            </p>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-ink/60">
            <MessageCircle size={16} className="text-green-600" />
            Prefere pelo WhatsApp?{" "}
            <a href="https://wa.me/5511900000000" className="font-medium text-green-700 hover:text-gold-dark">
              Fale conosco
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
