"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  Package,
  Crown,
  LogOut,
  Star,
  Save,
  MapPin,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { clubRewards, MIN_REDEEM } from "@/lib/data";
import { brl } from "@/lib/format";
import { Icon } from "@/components/Icon";

const mockOrders = [
  { id: "#TUA-10432", date: "28/06/2026", status: "Entregue", total: 259.7, items: 3 },
  { id: "#TUA-10390", date: "12/06/2026", status: "A caminho", total: 89.9, items: 1 },
  { id: "#TUA-10321", date: "02/05/2026", status: "Entregue", total: 174.8, items: 2 },
];

type Tab = "perfil" | "pedidos" | "clube";

export default function ContaPage() {
  const { user, hydrated, logout, update } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("perfil");
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    cpf: "",
    birthdate: "",
    cep: "",
    address: "",
  });

  useEffect(() => {
    if (hydrated && !user) router.replace("/login");
  }, [hydrated, user, router]);

  useEffect(() => {
    if (user)
      setForm({
        name: user.name,
        phone: user.phone ?? "",
        cpf: user.cpf ?? "",
        birthdate: user.birthdate ?? "",
        cep: user.cep ?? "",
        address: user.address ?? "",
      });
  }, [user]);

  if (!hydrated || !user) {
    return <div className="container-tua py-24 text-center text-ink/50">Carregando...</div>;
  }

  const nextReward = clubRewards.find((r) => r.points > user.points) ?? null;
  const clubProgress = nextReward
    ? Math.min(100, (user.points / nextReward.points) * 100)
    : 100;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    update(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const tabs: { key: Tab; label: string; icon: typeof UserIcon }[] = [
    { key: "perfil", label: "Meus dados", icon: UserIcon },
    { key: "pedidos", label: "Meus pedidos", icon: Package },
    { key: "clube", label: "Meu clube", icon: Crown },
  ];

  return (
    <div className="container-tua py-8">
      {/* cabeçalho da conta */}
      <div className="flex flex-col gap-4 rounded-3xl bg-green-900 p-6 text-white sm:flex-row sm:items-center sm:justify-between md:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-2xl font-display text-gold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm text-white/60">Bem-vindo(a) de volta,</p>
            <h1 className="font-display text-2xl font-light">{user.name}</h1>
            <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-medium text-gold">
              <Crown size={12} /> Membro Clube Tua
            </span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="flex items-center gap-1 text-2xl font-display text-gold">
              <Star size={18} className="fill-gold" /> {user.points}
            </p>
            <p className="text-xs text-white/50">pontos Tua</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
          >
            <LogOut size={15} /> Sair
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* menu lateral */}
        <aside className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${
                tab === t.key
                  ? "bg-green-700 text-white"
                  : "bg-white text-green-900 hover:bg-cream"
              }`}
            >
              <t.icon size={17} /> {t.label}
            </button>
          ))}
        </aside>

        {/* conteúdo */}
        <div>
          {tab === "perfil" && (
            <form onSubmit={save} className="card p-6 md:p-8">
              <h2 className="mb-5 font-display text-xl font-light text-green-900">
                Meus dados
              </h2>
              {saved && (
                <p className="mb-4 rounded-lg bg-green-50 px-4 py-2.5 text-sm text-green-700">
                  ✓ Dados atualizados com sucesso!
                </p>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Nome completo</label>
                  <input value={form.name} onChange={set("name")} className="input" />
                </div>
                <div>
                  <label className="label">E-mail</label>
                  <input value={user.email} disabled className="input opacity-60" />
                </div>
                <div>
                  <label className="label">Telefone</label>
                  <input value={form.phone} onChange={set("phone")} className="input" placeholder="(11) 90000-0000" />
                </div>
                <div>
                  <label className="label">CPF</label>
                  <input value={form.cpf} onChange={set("cpf")} className="input" placeholder="000.000.000-00" />
                </div>
                <div>
                  <label className="label">Data de nascimento</label>
                  <input type="date" value={form.birthdate} onChange={set("birthdate")} className="input" />
                </div>
                <div>
                  <label className="label">CEP</label>
                  <input value={form.cep} onChange={set("cep")} className="input" placeholder="00000-000" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label flex items-center gap-1.5">
                    <MapPin size={14} className="text-gold-dark" /> Endereço
                  </label>
                  <input value={form.address} onChange={set("address")} className="input" placeholder="Rua, número, bairro, cidade/UF" />
                </div>
              </div>
              <button type="submit" className="btn-gold mt-6">
                <Save size={16} /> Salvar alterações
              </button>
            </form>
          )}

          {tab === "pedidos" && (
            <div className="card p-6 md:p-8">
              <h2 className="mb-5 font-display text-xl font-light text-green-900">
                Meus pedidos
              </h2>
              <div className="space-y-3">
                {mockOrders.map((o) => (
                  <div
                    key={o.id}
                    className="flex flex-col gap-2 rounded-xl border border-green-900/10 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium text-green-900">{o.id}</p>
                      <p className="text-xs text-ink/50">
                        {o.date} · {o.items} {o.items === 1 ? "item" : "itens"}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          o.status === "Entregue"
                            ? "bg-green-50 text-green-700"
                            : "bg-gold/15 text-gold-dark"
                        }`}
                      >
                        {o.status}
                      </span>
                      <span className="font-semibold text-green-900">{brl(o.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "clube" && (
            <div className="card p-6 md:p-8">
              <h2 className="mb-2 font-display text-xl font-light text-green-900">
                Meu Clube de Vantagens
              </h2>
              <p className="mb-5 text-sm text-ink/60">
                Você acumulou{" "}
                <strong className="text-gold-dark">{user.points} pontos</strong>. Ganhe 1
                ponto a cada R$ 1 e troque por prêmios a partir de {MIN_REDEEM} pontos.
              </p>

              <div className="rounded-2xl bg-green-900 p-6 text-white">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">Seus pontos</span>
                  <span className="flex items-center gap-1.5 font-display text-2xl text-gold">
                    <Star size={18} className="fill-gold" /> {user.points}
                  </span>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gold transition-all"
                    style={{ width: `${clubProgress}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-white/60">
                  {nextReward
                    ? `Faltam ${nextReward.points - user.points} pontos para "${nextReward.name}"`
                    : "Você já pode resgatar todos os prêmios disponíveis!"}
                </p>
              </div>

              <h3 className="mt-6 mb-3 font-display text-lg text-green-900">
                Prêmios em destaque
              </h3>
              <div className="space-y-2">
                {clubRewards.slice(0, 4).map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center gap-3 rounded-xl border border-green-900/10 p-3"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cream text-green-700">
                      <Icon name={r.icon} size={18} />
                    </span>
                    <span className="flex-1 text-sm font-medium text-green-900">{r.name}</span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        user.points >= r.points
                          ? "bg-green-50 text-green-700"
                          : "bg-cream text-ink/50"
                      }`}
                    >
                      {r.points} pts
                    </span>
                  </div>
                ))}
              </div>

              <Link href="/clube" className="btn-gold mt-6">
                <Crown size={16} /> Ver e resgatar prêmios
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
