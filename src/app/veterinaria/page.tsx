import Link from "next/link";
import {
  PawPrint,
  Stethoscope,
  FlaskConical,
  ShieldCheck,
  HeartHandshake,
  Pill,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { whatsappLink } from "@/lib/site";

export const metadata = {
  title: "Linha VET — Farmácia Veterinária | Tua Pharma",
  description:
    "A Tua Pharma também manipula fórmulas veterinárias sob medida para o seu pet, com a mesma qualidade e segurança da nossa linha humana.",
};

// TODO(cliente): substituir os textos placeholder abaixo pelo copy oficial da
// Linha VET que o cliente vai enviar. Estrutura e layout já prontos.
const beneficios = [
  { icon: FlaskConical, title: "Fórmulas sob medida", text: "Dosagem e sabor ajustados ao porte, à espécie e ao tratamento do seu pet." },
  { icon: Pill, title: "Formas fáceis de administrar", text: "Pastas palatáveis, cápsulas, líquidos e transdérmicos — o que for melhor para o animal." },
  { icon: ShieldCheck, title: "Segurança farmacêutica", text: "Mesma Boas Práticas de Manipulação da linha humana, com controle de qualidade rigoroso." },
  { icon: HeartHandshake, title: "Ao lado do veterinário", text: "Trabalhamos junto ao médico-veterinário prescritor, do pré ao pós-tratamento." },
];

export default function VeterinariaPage() {
  return (
    <div className="pb-8">
      {/* hero */}
      <section className="bg-green-900 text-white">
        <div className="container-tua grid items-center gap-8 py-16 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-4 py-1.5 text-sm font-medium text-gold">
              <PawPrint size={16} /> Nova Linha VET
            </span>
            <h1 className="mt-3 font-display text-4xl font-light leading-tight text-balance md:text-5xl">
              Farmácia de manipulação também para o seu pet
            </h1>
            <p className="mt-4 text-white/70">
              Além da linha humana, a Tua Pharma manipula fórmulas veterinárias
              sob medida — com a mesma precisão técnica, ingredientes de alta
              pureza e o cuidado que a sua família (de patas também) merece.
            </p>
            <p className="mt-2 text-xs text-white/40">
              {/* placeholder — trocar pelo texto oficial da Linha VET */}
              Texto institucional da Linha VET a ser definido pelo cliente.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/produtos?categoria=veterinaria" className="btn-gold">
                Ver produtos VET
              </Link>
              <a
                href={whatsappLink("Olá! Quero saber mais sobre a Linha Veterinária (VET) da Tua Pharma.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost-gold"
              >
                Falar com um farmacêutico
              </a>
            </div>
          </div>
          <div className="flex items-center justify-center rounded-3xl bg-green-950 p-12">
            <div className="flex flex-col items-center gap-6">
              <Stethoscope size={80} className="text-gold" strokeWidth={1} />
              <Logo size="lg" />
            </div>
          </div>
        </div>
      </section>

      {/* benefícios */}
      <section className="container-tua py-16">
        <div className="mb-10 text-center">
          <span className="eyebrow">Por que manipular para o pet</span>
          <h2 className="mt-1 font-display text-3xl font-light text-green-900">
            Cuidado veterinário personalizado
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {beneficios.map((b) => (
            <div key={b.title} className="card p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-900 text-gold">
                <b.icon size={26} />
              </div>
              <h3 className="mt-4 font-display text-lg text-green-900">{b.title}</h3>
              <p className="mt-2 text-sm text-ink/60">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* como funciona */}
      <section className="container-tua">
        <div className="grid gap-8 rounded-3xl border border-green-900/5 bg-white p-8 shadow-card lg:grid-cols-3 lg:p-12">
          {[
            { n: "1", title: "Envie a receita", text: "O veterinário prescreve a fórmula; você nos envia a receita pelo site ou WhatsApp." },
            { n: "2", title: "Manipulamos sob medida", text: "Preparamos na dosagem e forma ideais para a espécie e o porte do animal." },
            { n: "3", title: "Entregamos com cuidado", text: "Seu pedido chega pronto para o tratamento, com orientação de uso." },
          ].map((s) => (
            <div key={s.n}>
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-900 font-display text-gold">
                  {s.n}
                </span>
                <h3 className="font-display text-xl text-green-900">{s.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-ink/65">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* cta */}
      <section className="container-tua pt-16">
        <div className="flex flex-col items-center gap-5 rounded-3xl bg-gradient-to-r from-green-700 to-green-900 p-10 text-center text-white">
          <PawPrint size={40} className="text-gold" strokeWidth={1.5} />
          <h2 className="max-w-xl font-display text-3xl font-light text-balance">
            Tem uma receita veterinária? A gente manipula.
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/receita" className="btn-gold">Enviar receita do pet</Link>
            <Link href="/produtos?categoria=veterinaria" className="btn-ghost-gold">
              Ver produtos VET
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
