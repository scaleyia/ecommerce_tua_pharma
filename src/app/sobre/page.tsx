import Link from "next/link";
import { FlaskConical, ShieldCheck, Leaf, HeartHandshake, Microscope, Award } from "lucide-react";
import { Logo } from "@/components/Logo";

export const metadata = { title: "Sobre — Tua Pharma" };

const values = [
  { icon: Microscope, title: "Precisão técnica", text: "Fórmulas manipuladas com exatidão em laboratório de alto padrão." },
  { icon: Leaf, title: "Ingredientes puros", text: "Matérias-primas selecionadas, com certificado de qualidade e pureza." },
  { icon: ShieldCheck, title: "Segurança total", text: "Boas Práticas de Manipulação e controle de qualidade rigoroso." },
  { icon: HeartHandshake, title: "Cuidado humano", text: "Atendimento farmacêutico próximo, atencioso e personalizado." },
];

export default function SobrePage() {
  return (
    <div className="pb-8">
      {/* hero */}
      <section className="bg-green-900 text-white">
        <div className="container-tua grid items-center gap-8 py-16 lg:grid-cols-2">
          <div>
            <span className="eyebrow text-gold">Nossa história</span>
            <h1 className="mt-2 font-display text-4xl font-light leading-tight text-balance md:text-5xl">
              Manipulação artesanal com alma e ciência
            </h1>
            <p className="mt-4 text-white/70">
              A Tua Pharma nasceu do propósito de tratar cada pessoa como única. Unimos a
              tradição da manipulação artesanal à tecnologia farmacêutica moderna para criar
              fórmulas exclusivas, feitas sob medida para o seu corpo e o seu bem-estar.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6">
              {[
                { n: "+15 mil", l: "fórmulas criadas" },
                { n: "+30 anos", l: "de experiência" },
                { n: "4.9/5", l: "satisfação" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="font-display text-3xl text-gold">{s.n}</p>
                  <p className="text-xs text-white/55">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center rounded-3xl bg-green-950 p-12">
            <div className="flex flex-col items-center gap-6">
              <FlaskConical size={80} className="text-gold" strokeWidth={1} />
              <Logo size="lg" />
            </div>
          </div>
        </div>
      </section>

      {/* valores */}
      <section className="container-tua py-16">
        <div className="mb-10 text-center">
          <span className="eyebrow">O que nos move</span>
          <h2 className="mt-1 font-display text-3xl font-light text-green-900">Nossos valores</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.title} className="card p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-900 text-gold">
                <v.icon size={26} />
              </div>
              <h3 className="mt-4 font-display text-lg text-green-900">{v.title}</h3>
              <p className="mt-2 text-sm text-ink/60">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* missão */}
      <section className="container-tua">
        <div className="grid gap-8 rounded-3xl border border-green-900/5 bg-white p-8 shadow-card lg:grid-cols-3 lg:p-12">
          {[
            { title: "Missão", text: "Promover saúde e bem-estar por meio de fórmulas personalizadas, seguras e eficazes, com cuidado humano em cada detalhe." },
            { title: "Visão", text: "Ser referência nacional em manipulação farmacêutica, reconhecida pela qualidade, inovação e confiança." },
            { title: "Compromisso", text: "Transparência, responsabilidade e excelência técnica em cada fórmula que sai da nossa farmácia." },
          ].map((m) => (
            <div key={m.title}>
              <div className="mb-3 flex items-center gap-2">
                <Award size={20} className="text-gold-dark" />
                <h3 className="font-display text-xl text-green-900">{m.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-ink/65">{m.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* cta */}
      <section className="container-tua pt-16">
        <div className="flex flex-col items-center gap-5 rounded-3xl bg-gradient-to-r from-green-700 to-green-900 p-10 text-center text-white">
          <h2 className="max-w-xl font-display text-3xl font-light text-balance">
            Vamos cuidar de você com uma fórmula sob medida?
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/produtos" className="btn-gold">Ver produtos</Link>
            <Link href="/receita" className="btn-ghost-gold">Enviar minha receita</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
