import Link from "next/link";
import {
  Truck,
  ShieldCheck,
  FlaskConical,
  Stethoscope,
  ArrowRight,
  Check,
  Crown,
  FileText,
  Upload,
  Quote,
  Star,
} from "lucide-react";
import { HeroCarousel } from "@/components/HeroCarousel";
import { SectionHeading } from "@/components/SectionHeading";
import { ProductRow } from "@/components/ProductRow";
import { CountdownTimer } from "@/components/CountdownTimer";
import { Icon } from "@/components/Icon";
import {
  categories,
  specialOffers,
  bestsellers,
  clubRewards,
  POINTS_PER_REAL,
  MIN_REDEEM,
} from "@/lib/data";

const benefits = [
  { icon: Truck, title: "Frete grátis", sub: "Acima de R$ 199" },
  { icon: ShieldCheck, title: "Compra segura", sub: "Ambiente criptografado" },
  { icon: FlaskConical, title: "Manipulação própria", sub: "Fórmulas sob medida" },
  { icon: Stethoscope, title: "Suporte farmacêutico", sub: "Atendimento humano" },
];

const testimonials = [
  {
    name: "Juliana M.",
    text: "Os manipulados da Tua Pharma mudaram minha rotina. Qualidade impecável e entrega rápida!",
    role: "Cliente Clube Prime",
  },
  {
    name: "Ricardo T.",
    text: "Atendimento farmacêutico excelente, me ajudaram a ajustar a fórmula perfeita para mim.",
    role: "Cliente há 2 anos",
  },
  {
    name: "Camila S.",
    text: "O clube de vantagens vale muito a pena. Cashback de verdade e frete grátis sempre.",
    role: "Cliente Clube Black",
  },
];

export default function HomePage() {
  return (
    <>
      <HeroCarousel />

      {/* benefícios */}
      <section className="container-tua pt-8">
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-green-900/5 bg-white p-4 shadow-card lg:grid-cols-4">
          {benefits.map((b) => (
            <div key={b.title} className="flex items-center gap-3 px-2 py-2">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream text-green-700">
                <b.icon size={20} />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-green-900">{b.title}</p>
                <p className="text-xs text-ink/55">{b.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* categorias */}
      <section className="container-tua pt-14">
        <SectionHeading
          eyebrow="Navegue por"
          title="Categorias"
          linkHref="/produtos"
          linkLabel="Ver tudo"
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/produtos?categoria=${c.slug}`}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-green-900/5 bg-white p-4 text-center shadow-card transition hover:-translate-y-1 hover:border-gold/30"
            >
              <span
                className="flex h-14 w-14 items-center justify-center rounded-full text-gold transition group-hover:scale-110"
                style={{
                  backgroundImage: `linear-gradient(140deg, ${c.gradient[0]}, ${c.gradient[1]})`,
                }}
              >
                <Icon name={c.icon} size={24} />
              </span>
              <span className="text-xs font-medium leading-tight text-green-900">
                {c.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ofertas especiais */}
      <section className="container-tua pt-14">
        <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-green-900 to-green-700 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="eyebrow text-gold">Só hoje</span>
            <h2 className="mt-1 font-display text-2xl font-light text-white md:text-3xl">
              Ofertas Especiais
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/70">Termina em:</span>
            <CountdownTimer />
          </div>
        </div>
        <ProductRow products={specialOffers()} />
      </section>

      {/* clube de vantagens */}
      <section className="container-tua pt-16">
        <div className="overflow-hidden rounded-3xl bg-green-900 text-white">
          <div className="grid lg:grid-cols-2">
            <div className="flex flex-col justify-center gap-5 p-8 md:p-12">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-gold">
                <Crown size={14} /> Clube de Vantagens Tua
              </span>
              <h2 className="font-display text-3xl font-light leading-tight text-balance md:text-4xl">
                Acumule pontos e troque por prêmios
              </h2>
              <p className="text-white/70">
                Cadastre-se <strong className="text-gold">grátis</strong> e ganhe{" "}
                {POINTS_PER_REAL} ponto a cada R$ 1 em compras. A partir de {MIN_REDEEM}{" "}
                pontos você troca por cupons, brindes e produtos.
              </p>
              <ul className="grid grid-cols-1 gap-2 text-sm text-white/85 sm:grid-cols-2">
                {[
                  "Cadastro 100% grátis",
                  "1 ponto a cada R$ 1",
                  `Prêmios a partir de ${MIN_REDEEM} pontos`,
                  "Brinde de aniversário",
                ].map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <Check size={16} className="text-gold" /> {p}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3">
                <Link href="/cadastro" className="btn-gold">
                  Cadastre-se grátis
                </Link>
                <Link href="/clube" className="btn-ghost-gold">
                  Ver prêmios
                </Link>
              </div>
            </div>

            <div className="relative flex flex-col justify-center gap-3 bg-green-950 p-8 md:p-12">
              <p className="mb-1 text-sm text-white/60">Alguns prêmios para resgatar:</p>
              {clubRewards.slice(0, 3).map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                    <Icon name={r.icon} size={20} />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{r.name}</p>
                    <p className="text-xs text-white/50">{r.description}</p>
                  </div>
                  <span className="flex shrink-0 items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-xs font-bold text-green-900">
                    <Star size={11} className="fill-green-900" /> {r.points}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* mais vendidos */}
      <section className="container-tua pt-16">
        <SectionHeading
          eyebrow="Preferidos dos clientes"
          title="Mais Vendidos"
          linkHref="/produtos"
        />
        <ProductRow products={bestsellers()} />
      </section>

      {/* sobre a farmácia */}
      <section className="container-tua pt-16">
        <div className="grid items-center gap-8 rounded-3xl border border-green-900/5 bg-white p-8 shadow-card lg:grid-cols-2 lg:p-12">
          <div>
            <span className="eyebrow">Sobre a Tua Pharma</span>
            <h2 className="mt-2 font-display text-3xl font-light text-green-900 text-balance md:text-4xl">
              Manipulação artesanal com precisão de laboratório
            </h2>
            <p className="mt-4 text-ink/70">
              Somos uma farmácia de manipulação dedicada a criar fórmulas exclusivas para
              cada pessoa. Unimos o cuidado artesanal à tecnologia farmacêutica de ponta,
              selecionando ingredientes de alta pureza e seguindo rigorosamente as Boas
              Práticas de Manipulação.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              {[
                { n: "+15 mil", l: "fórmulas manipuladas" },
                { n: "+30 anos", l: "de experiência" },
                { n: "4.9/5", l: "satisfação dos clientes" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="font-display text-2xl text-gold-dark">{s.n}</p>
                  <p className="text-xs text-ink/55">{s.l}</p>
                </div>
              ))}
            </div>
            <Link href="/sobre" className="btn-outline mt-8">
              Conheça nossa história
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {categories.slice(0, 4).map((c) => (
              <div
                key={c.slug}
                className="flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl text-center text-white"
                style={{
                  backgroundImage: `linear-gradient(140deg, ${c.gradient[0]}, ${c.gradient[1]})`,
                }}
              >
                <Icon name={c.icon} size={40} className="text-gold" />
                <span className="px-2 text-sm font-medium">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* envie sua receita */}
      <section className="container-tua pt-16">
        <div className="flex flex-col items-center gap-6 rounded-3xl bg-gradient-to-br from-green-700 to-green-900 p-8 text-center text-white md:p-14">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-gold">
            <FileText size={30} />
          </span>
          <h2 className="max-w-2xl font-display text-3xl font-light text-balance md:text-4xl">
            Tem uma receita? Manipule com a Tua Pharma
          </h2>
          <p className="max-w-xl text-white/70">
            Envie a foto da sua receita, nossos farmacêuticos analisam e preparam sua
            fórmula com todo o rigor técnico. Simples, rápido e seguro.
          </p>
          <Link href="/receita" className="btn-gold">
            <Upload size={16} />
            Enviar minha receita
          </Link>
        </div>
      </section>

      {/* depoimentos */}
      <section className="container-tua pt-16">
        <SectionHeading eyebrow="Quem usa, recomenda" title="O que dizem nossos clientes" />
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="card flex flex-col gap-4 p-6">
              <Quote size={28} className="text-gold" />
              <p className="text-ink/75">{t.text}</p>
              <div className="mt-auto">
                <p className="font-semibold text-green-900">{t.name}</p>
                <p className="text-xs text-ink/50">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
