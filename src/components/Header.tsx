"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Truck,
  Crown,
  FileText,
  Phone,
} from "lucide-react";
import { Logo } from "./Logo";
import { categories } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { count, setOpen } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(query.trim() ? `/produtos?q=${encodeURIComponent(query.trim())}` : "/produtos");
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-green-900 text-white shadow-lg">
      {/* top bar */}
      <div className="border-b border-white/10 bg-green-950">
        <div className="container-tua flex h-9 items-center justify-between text-[0.72rem] text-white/70">
          <span className="flex items-center gap-2">
            <Truck size={13} className="text-gold" />
            Frete grátis acima de <strong className="text-gold">R$ 199</strong>
          </span>
          <div className="hidden items-center gap-5 md:flex">
            <Link href="/receita" className="flex items-center gap-1 hover:text-gold">
              <FileText size={13} /> Envie sua receita
            </Link>
            <Link href="/clube" className="flex items-center gap-1 hover:text-gold">
              <Crown size={13} /> Clube de Vantagens
            </Link>
            <span className="flex items-center gap-1">
              <Phone size={13} /> (11) 4000-0000
            </span>
          </div>
        </div>
      </div>

      {/* main bar */}
      <div className="container-tua flex items-center gap-4 py-4">
        <button
          className="lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menu"
        >
          <Menu size={24} className="text-gold" />
        </button>

        <Link href="/" className="shrink-0">
          <Logo size="md" />
        </Link>

        <form
          onSubmit={submitSearch}
          className="ml-auto hidden max-w-xl flex-1 items-center lg:flex"
        >
          <div className="flex w-full items-center rounded-full bg-white px-4 py-2.5">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busque por produtos, vitaminas, manipulados..."
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink/40"
            />
            <button type="submit" aria-label="Buscar">
              <Search size={18} className="text-green-700" />
            </button>
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1 lg:ml-4">
          <Link
            href={user ? "/conta" : "/login"}
            className="flex items-center gap-2 rounded-full px-3 py-2 text-sm hover:bg-white/10"
          >
            <User size={20} className="text-gold" />
            <span className="hidden text-left leading-tight sm:block">
              <span className="block text-[0.65rem] text-white/60">
                {user ? "Olá," : "Entrar /"}
              </span>
              <span className="block text-xs font-medium">
                {user ? user.name.split(" ")[0] : "Cadastrar"}
              </span>
            </span>
          </Link>

          <button
            onClick={() => setOpen(true)}
            className="relative flex items-center gap-2 rounded-full px-3 py-2 hover:bg-white/10"
            aria-label="Abrir carrinho"
          >
            <span className="relative">
              <ShoppingBag size={22} className="text-gold" />
              {count > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[0.65rem] font-bold text-green-900">
                  {count}
                </span>
              )}
            </span>
          </button>
        </div>
      </div>

      {/* category nav */}
      <nav className="hidden border-t border-white/10 lg:block">
        <div className="container-tua flex items-center gap-1 overflow-x-auto py-2 text-sm no-scrollbar">
          <Link
            href="/produtos"
            className="whitespace-nowrap rounded-full px-3 py-1.5 font-medium text-gold hover:bg-white/10"
          >
            Todos os produtos
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/produtos?categoria=${c.slug}`}
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* mobile search */}
      <form onSubmit={submitSearch} className="container-tua pb-3 lg:hidden">
        <div className="flex w-full items-center rounded-full bg-white px-4 py-2.5">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar produtos..."
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink/40"
          />
          <button type="submit" aria-label="Buscar">
            <Search size={18} className="text-green-700" />
          </button>
        </div>
      </form>

      {/* mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-green-950/60"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 flex h-full w-80 max-w-[85%] flex-col bg-green-900 p-5">
            <div className="mb-6 flex items-center justify-between">
              <Logo size="sm" />
              <button onClick={() => setMobileOpen(false)} aria-label="Fechar">
                <X size={24} className="text-gold" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 overflow-y-auto">
              <Link
                href="/produtos"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 font-medium text-gold hover:bg-white/10"
              >
                Todos os produtos
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/produtos?categoria=${c.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-white/85 hover:bg-white/10"
                >
                  {c.name}
                </Link>
              ))}
              <div className="my-3 h-px bg-white/10" />
              <Link href="/clube" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-white/85 hover:bg-white/10">
                Clube de Vantagens
              </Link>
              <Link href="/receita" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-white/85 hover:bg-white/10">
                Envie sua receita
              </Link>
              <Link href="/sobre" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-white/85 hover:bg-white/10">
                Sobre a Tua Pharma
              </Link>
              <Link href={user ? "/conta" : "/login"} onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-white/85 hover:bg-white/10">
                {user ? "Minha conta" : "Entrar / Cadastrar"}
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
