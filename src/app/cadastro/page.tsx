"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Gift } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";

export default function CadastroPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    birthdate: "",
    password: "",
    confirm: "",
  });
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError("As senhas não coincidem.");
      return;
    }
    if (!terms) {
      setError("Você precisa aceitar os termos de uso.");
      return;
    }
    const res = register(form);
    if (res.ok) router.push("/conta");
    else setError(res.error ?? "Não foi possível cadastrar.");
  };

  return (
    <div className="container-tua flex justify-center py-16">
      <div className="w-full max-w-lg">
        <div className="mb-8 flex flex-col items-center gap-3 rounded-t-3xl bg-green-900 py-8">
          <Logo size="md" />
          <span className="flex items-center gap-2 rounded-full bg-gold/15 px-3 py-1 text-xs font-medium text-gold">
            <Gift size={14} /> Ganhe 10% OFF na primeira compra
          </span>
        </div>

        <form onSubmit={submit} className="card -mt-6 space-y-4 rounded-3xl p-8">
          <h1 className="font-display text-2xl font-light text-green-900">Criar conta</h1>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
          )}

          <div>
            <label className="label">Nome completo *</label>
            <input required value={form.name} onChange={set("name")} className="input" placeholder="Seu nome" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">E-mail *</label>
              <input type="email" required value={form.email} onChange={set("email")} className="input" placeholder="seu@email.com" />
            </div>
            <div>
              <label className="label">Telefone</label>
              <input value={form.phone} onChange={set("phone")} className="input" placeholder="(11) 90000-0000" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">CPF</label>
              <input value={form.cpf} onChange={set("cpf")} className="input" placeholder="000.000.000-00" />
            </div>
            <div>
              <label className="label">Data de nascimento</label>
              <input type="date" value={form.birthdate} onChange={set("birthdate")} className="input" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Senha *</label>
              <input type="password" required value={form.password} onChange={set("password")} className="input" placeholder="••••••••" />
            </div>
            <div>
              <label className="label">Confirmar senha *</label>
              <input type="password" required value={form.confirm} onChange={set("confirm")} className="input" placeholder="••••••••" />
            </div>
          </div>

          <label className="flex items-start gap-2 text-sm text-ink/65">
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              className="mt-1 accent-green-700"
            />
            Li e aceito os Termos de Uso e a Política de Privacidade e desejo entrar
            gratuitamente no Clube Tua Essencial.
          </label>

          <button type="submit" className="btn-gold w-full">
            <UserPlus size={16} /> Criar minha conta
          </button>

          <p className="text-center text-sm text-ink/60">
            Já tem conta?{" "}
            <Link href="/login" className="font-medium text-green-700 hover:text-gold-dark">
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
