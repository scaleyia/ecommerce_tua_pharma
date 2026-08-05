"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  BadgeCheck,
  Award,
  Leaf,
  Mail,
  MapPin,
  Instagram,
  MessageCircle,
} from "lucide-react";
import { Logo } from "./Logo";
import { categories } from "@/lib/data";
import { siteConfig, aboutText, whatsappLink } from "@/lib/site";

const seals = [
  {
    icon: ShieldCheck,
    title: "Autorizado ANVISA",
    sub: siteConfig.sanitary.afe ? `AFE nº ${siteConfig.sanitary.afe}` : "Farmácia licenciada",
  },
  { icon: Lock, title: "Site Seguro", sub: "Certificado SSL 256-bit" },
  { icon: BadgeCheck, title: "Compra Garantida", sub: "Satisfação ou reembolso" },
  {
    icon: Award,
    title: "Farmacêutico Responsável",
    sub: `${siteConfig.pharmacist.name} — ${siteConfig.pharmacist.crf}`,
  },
  { icon: Leaf, title: "Qualidade Certificada", sub: "Boas Práticas de Manipulação" },
];

const payments = ["Visa", "Master", "Elo", "Amex", "Hipercard", "Pix", "Boleto"];

export function Footer() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <footer className="mt-16 bg-green-900 text-white/80">
      {/* selos de confiança */}
      <div className="border-b border-white/10">
        <div className="container-tua grid grid-cols-2 gap-4 py-8 sm:grid-cols-3 lg:grid-cols-5">
          {seals.map((s) => (
            <div key={s.title} className="flex items-center gap-3">
              <s.icon size={30} className="shrink-0 text-gold" />
              <div className="leading-tight">
                <p className="text-xs font-semibold text-white">{s.title}</p>
                <p className="text-[0.68rem] text-white/55">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* newsletter */}
      <div className="border-b border-white/10">
        <div className="container-tua flex flex-col items-center gap-4 py-8 text-center lg:flex-row lg:justify-between lg:text-left">
          <div>
            <h3 className="font-display text-xl font-light text-white">
              Receba ofertas exclusivas
            </h3>
            <p className="text-sm text-white/60">
              Cadastre seu e-mail e ganhe <strong className="text-gold">10% OFF</strong> na
              primeira compra.
            </p>
          </div>
          {sent ? (
            <p className="rounded-full bg-gold/15 px-5 py-3 text-sm text-gold">
              ✓ Inscrição confirmada! Enviamos seu cupom por e-mail.
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) setSent(true);
              }}
              className="flex w-full max-w-md items-center gap-2"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu melhor e-mail"
                className="w-full rounded-full bg-white/10 px-4 py-3 text-sm text-white outline-none ring-1 ring-white/15 placeholder:text-white/40 focus:ring-gold/50"
              />
              <button type="submit" className="btn-gold shrink-0">
                Cadastrar
              </button>
            </form>
          )}
        </div>
      </div>

      {/* colunas */}
      <div className="container-tua grid grid-cols-2 gap-8 py-12 md:grid-cols-4 lg:grid-cols-5">
        <div className="col-span-2 md:col-span-1">
          <Logo size="sm" />
          <p className="mt-4 text-sm text-white/55">{aboutText.short}</p>
          <div className="mt-4 flex gap-2">
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram da Tua Pharma"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-gold transition hover:bg-gold hover:text-green-900"
            >
              <Instagram size={16} />
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp da Tua Pharma"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-gold transition hover:bg-gold hover:text-green-900"
            >
              <MessageCircle size={16} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">
            Categorias
          </h4>
          <ul className="space-y-2 text-sm">
            {categories.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link href={`/produtos?categoria=${c.slug}`} className="hover:text-gold">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">
            Institucional
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/sobre" className="hover:text-gold">Sobre a Tua Pharma</Link></li>
            <li><Link href="/clube" className="hover:text-gold">Clube de Vantagens</Link></li>
            <li><Link href="/receita" className="hover:text-gold">Envie sua receita</Link></li>
            <li><a href="#" className="hover:text-gold">Política de Privacidade</a></li>
            <li><Link href="/trocas-devolucoes" className="hover:text-gold">Trocas e Devoluções</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">
            Atendimento
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-gold"
              >
                <MessageCircle size={15} className="text-gold" /> WhatsApp: {siteConfig.contact.whatsapp}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex items-center gap-2 hover:text-gold"
              >
                <Mail size={15} className="text-gold" /> {siteConfig.contact.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={15} className="mt-0.5 shrink-0 text-gold" />
              {siteConfig.address.street} — {siteConfig.address.district}, {siteConfig.address.city}/
              {siteConfig.address.state}
            </li>
          </ul>
          <p className="mt-4 text-xs text-white/50">{siteConfig.contact.hours}</p>
        </div>
      </div>

      {/* pagamentos */}
      <div className="border-t border-white/10">
        <div className="container-tua flex flex-col items-center gap-3 py-6 lg:flex-row lg:justify-between">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="mr-1 text-xs text-white/50">Formas de pagamento:</span>
            {payments.map((p) => (
              <span
                key={p}
                className="rounded-md bg-white px-2 py-1 text-[0.68rem] font-semibold text-green-900"
              >
                {p}
              </span>
            ))}
          </div>
          <span className="text-xs text-white/50">
            🔒 Ambiente 100% seguro e criptografado
          </span>
        </div>
      </div>

      {/* base legal */}
      <div className="bg-green-950">
        <div className="container-tua flex flex-col gap-1 py-6 text-center text-[0.72rem] text-white/45">
          <p>
            {siteConfig.legalName} · CNPJ: {siteConfig.cnpj} · {siteConfig.address.full}
          </p>
          <p>
            Farmacêutico Responsável: {siteConfig.pharmacist.name} · {siteConfig.pharmacist.crf} ·
            Registro CRF-MG nº {siteConfig.crfRegistration.number}
            {siteConfig.sanitary.afe ? ` · AFE/ANVISA nº ${siteConfig.sanitary.afe}` : ""}
            {siteConfig.sanitary.license ? ` · Licença Sanitária nº ${siteConfig.sanitary.license}` : ""}
          </p>
          <p className="mt-2">
            © {2026} Tua Pharma. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
