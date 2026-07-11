import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="container-tua flex flex-col items-center gap-6 py-24 text-center">
      <Logo size="md" />
      <p className="font-display text-7xl font-light text-green-900">404</p>
      <h1 className="font-display text-2xl font-light text-green-900">
        Página não encontrada
      </h1>
      <p className="max-w-md text-ink/60">
        A página que você procura não existe ou foi movida. Que tal continuar navegando?
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-gold">Voltar ao início</Link>
        <Link href="/produtos" className="btn-outline">Ver produtos</Link>
      </div>
    </div>
  );
}
