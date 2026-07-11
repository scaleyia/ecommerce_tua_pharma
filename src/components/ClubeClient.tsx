"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Crown,
  UserPlus,
  ShoppingCart,
  Gift,
  Check,
  Star,
  Clock,
  Tag,
  Cake,
  Headphones,
} from "lucide-react";
import { Icon } from "@/components/Icon";
import { Logo } from "@/components/Logo";
import { clubRewards, MIN_REDEEM, POINTS_PER_REAL } from "@/lib/data";
import { useAuth } from "@/context/AuthContext";

const steps = [
  {
    icon: UserPlus,
    title: "1. Cadastre-se grátis",
    text: "Crie sua conta no Clube Tua em segundos, sem nenhum custo.",
  },
  {
    icon: ShoppingCart,
    title: "2. Ganhe pontos comprando",
    text: `A cada R$ 1 gasto você acumula ${POINTS_PER_REAL} ponto. É automático.`,
  },
  {
    icon: Gift,
    title: "3. Troque por prêmios",
    text: `A partir de ${MIN_REDEEM} pontos você já resgata cupons, brindes e produtos.`,
  },
];

const perks = [
  { icon: Clock, title: "Pontos válidos por 12 meses", text: "Tempo de sobra para acumular e resgatar." },
  { icon: Tag, title: "Ofertas exclusivas", text: "Descontos só para membros do clube." },
  { icon: Cake, title: "Brinde de aniversário", text: "Um presente especial no seu mês." },
  { icon: Headphones, title: "Atendimento prioritário", text: "Suporte farmacêutico com preferência." },
];

const faq = [
  { q: "O clube tem algum custo?", a: "Não! O Clube de Vantagens Tua é 100% gratuito. Basta se cadastrar." },
  { q: "Como eu ganho pontos?", a: `A cada R$ 1 em compras você ganha ${POINTS_PER_REAL} ponto, creditado automaticamente após a confirmação do pedido.` },
  { q: "Quando posso resgatar prêmios?", a: `Assim que atingir ${MIN_REDEEM} pontos. Quanto mais pontos, melhores os prêmios disponíveis.` },
  { q: "Os pontos expiram?", a: "Seus pontos ficam válidos por 12 meses a partir de cada compra." },
];

export function ClubeClient() {
  const { user, update } = useAuth();
  const [redeemed, setRedeemed] = useState<string | null>(null);

  const points = user?.points ?? 0;
  const nextReward = clubRewards.find((r) => r.points > points) ?? null;
  const progress = nextReward
    ? Math.min(100, (points / nextReward.points) * 100)
    : 100;

  const redeem = (id: string, cost: number, name: string) => {
    if (!user || user.points < cost) return;
    update({ points: user.points - cost });
    setRedeemed(name);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setRedeemed(null), 5000);
  };

  return (
    <div className="pb-8">
      {/* hero */}
      <section className="bg-green-900 text-white">
        <div className="container-tua flex flex-col items-center gap-5 py-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-4 py-1.5 text-sm font-medium text-gold">
            <Crown size={16} /> Clube de Vantagens Tua
          </span>
          <h1 className="max-w-3xl font-display text-4xl font-light leading-tight text-balance md:text-5xl">
            Acumule pontos e troque por prêmios
          </h1>
          <p className="max-w-xl text-white/70">
            Cadastre-se <strong className="text-gold">grátis</strong>, ganhe{" "}
            {POINTS_PER_REAL} ponto a cada R$ 1 em compras e resgate cupons, brindes e
            produtos manipulados.
          </p>

          {user ? (
            <div className="mt-2 w-full max-w-md rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">Olá, {user.name.split(" ")[0]}!</span>
                <span className="flex items-center gap-1.5 font-display text-2xl text-gold">
                  <Star size={18} className="fill-gold" /> {points} pts
                </span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-2 text-left text-xs text-white/60">
                {nextReward
                  ? `Faltam ${nextReward.points - points} pontos para "${nextReward.name}"`
                  : "Você pode resgatar todos os prêmios disponíveis!"}
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/cadastro" className="btn-gold">Cadastre-se grátis</Link>
              <Link href="/login" className="btn-ghost-gold">Já sou membro</Link>
            </div>
          )}
        </div>
      </section>

      {redeemed && (
        <div className="container-tua pt-6">
          <div className="rounded-2xl bg-green-50 px-5 py-4 text-center text-green-700">
            🎉 Prêmio <strong>{redeemed}</strong> resgatado com sucesso! Enviamos o código
            por e-mail. (Demonstração)
          </div>
        </div>
      )}

      {/* como funciona */}
      <section className="container-tua py-16">
        <div className="mb-10 text-center">
          <span className="eyebrow">Simples e gratuito</span>
          <h2 className="mt-1 font-display text-3xl font-light text-green-900">Como funciona</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="card relative p-8 text-center">
              <span className="absolute right-5 top-4 font-display text-5xl text-cream">{i + 1}</span>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-900 text-gold">
                <s.icon size={26} />
              </div>
              <h3 className="mt-4 font-display text-xl text-green-900">{s.title}</h3>
              <p className="mt-2 text-sm text-ink/60">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* prêmios */}
      <section className="container-tua pb-6">
        <div className="mb-10 text-center">
          <span className="eyebrow">Troque seus pontos</span>
          <h2 className="mt-1 font-display text-3xl font-light text-green-900">Catálogo de prêmios</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {clubRewards.map((r) => {
            const canRedeem = !!user && points >= r.points;
            return (
              <div key={r.id} className="card flex flex-col p-6">
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cream text-green-700">
                    <Icon name={r.icon} size={22} />
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-green-900 px-3 py-1 text-xs font-semibold text-gold">
                    <Star size={12} className="fill-gold" /> {r.points} pts
                  </span>
                </div>
                <h3 className="mt-4 font-display text-lg text-green-900">{r.name}</h3>
                <p className="mt-1 flex-1 text-sm text-ink/60">{r.description}</p>

                {!user ? (
                  <Link href="/login" className="btn-outline mt-4 w-full">
                    Entrar para resgatar
                  </Link>
                ) : canRedeem ? (
                  <button
                    onClick={() => redeem(r.id, r.points, r.name)}
                    className="btn-gold mt-4 w-full"
                  >
                    Resgatar
                  </button>
                ) : (
                  <button disabled className="btn-outline mt-4 w-full">
                    Faltam {r.points - points} pontos
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* benefícios */}
      <section className="container-tua py-16">
        <div className="mb-10 text-center">
          <span className="eyebrow">Vantagens de ser membro</span>
          <h2 className="mt-1 font-display text-3xl font-light text-green-900">Você ainda ganha</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((b) => (
            <div key={b.title} className="card flex items-start gap-4 p-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream text-green-700">
                <b.icon size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-green-900">{b.title}</h3>
                <p className="mt-1 text-sm text-ink/60">{b.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* faq */}
      <section className="container-tua">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <span className="eyebrow">Dúvidas frequentes</span>
            <h2 className="mt-1 font-display text-3xl font-light text-green-900">Perguntas & Respostas</h2>
          </div>
          <div className="space-y-3">
            {faq.map((f) => (
              <details key={f.q} className="card group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-green-900">
                  {f.q}
                  <span className="text-gold transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm text-ink/65">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* cta final */}
      {!user && (
        <section className="container-tua pt-16">
          <div className="flex flex-col items-center gap-5 rounded-3xl bg-gradient-to-r from-green-700 to-green-900 p-10 text-center text-white">
            <Logo size="md" />
            <h2 className="max-w-xl font-display text-3xl font-light text-balance">
              Comece a acumular pontos hoje mesmo
            </h2>
            <Link href="/cadastro" className="btn-gold">Entrar no Clube grátis</Link>
          </div>
        </section>
      )}
    </div>
  );
}
