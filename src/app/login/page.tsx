"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login, user, hydrated } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (hydrated && user) router.replace("/conta");
  }, [hydrated, user, router]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = login(email, password);
    if (res.ok) router.push("/conta");
    else setError(res.error ?? "Não foi possível entrar.");
  };

  return (
    <div className="container-tua flex justify-center py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-4 rounded-t-3xl bg-green-900 py-8">
          <Logo size="md" />
          <p className="text-sm text-white/60">Acesse sua conta</p>
        </div>

        <form onSubmit={submit} className="card -mt-6 space-y-4 rounded-3xl p-8">
          <h1 className="font-display text-2xl font-light text-green-900">Entrar</h1>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
          )}

          <div>
            <label className="label">E-mail</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="input pl-11"
              />
            </div>
          </div>

          <div>
            <label className="label">Senha</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
              <input
                type={show ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input px-11"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40"
                aria-label="Mostrar senha"
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-ink/60">
              <input type="checkbox" className="accent-green-700" /> Lembrar de mim
            </label>
            <a href="#" className="text-green-700 hover:text-gold-dark">Esqueci a senha</a>
          </div>

          <button type="submit" className="btn-gold w-full">
            <LogIn size={16} /> Entrar
          </button>

          <p className="text-center text-sm text-ink/60">
            Não tem conta?{" "}
            <Link href="/cadastro" className="font-medium text-green-700 hover:text-gold-dark">
              Cadastre-se
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
