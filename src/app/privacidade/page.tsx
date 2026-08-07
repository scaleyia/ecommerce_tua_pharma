import { Gift, Lock, ShieldCheck, Database, Mail } from "lucide-react";
import { siteConfig } from "@/lib/site";

export const metadata = { title: "Política de Privacidade — Tua Pharma" };

export default function PrivacidadePage() {
  return (
    <div className="pb-16">
      {/* hero */}
      <section className="bg-green-900 text-white">
        <div className="container-tua py-14">
          <span className="eyebrow text-gold">Institucional</span>
          <h1 className="mt-2 font-display text-4xl font-light leading-tight text-balance md:text-5xl">
            Política de Privacidade e Dados
          </h1>
          <p className="mt-4 max-w-2xl text-white/70">
            Como a {siteConfig.name} coleta, usa e protege seus dados, e as regras do
            Clube de Vantagens. Ao usar nosso site você concorda com estas condições.
          </p>
        </div>
      </section>

      <div className="container-tua max-w-3xl space-y-8 py-12">
        {/* regra do brinde — destaque */}
        <div className="flex gap-3 rounded-2xl border border-gold/30 bg-gold/10 p-5">
          <Gift size={22} className="mt-0.5 shrink-0 text-gold-dark" />
          <div className="text-sm leading-relaxed text-ink/75">
            <strong className="text-green-900">Resgate de brindes e prêmios do Clube.</strong>{" "}
            Os brindes, prêmios e recompensas resgatados com pontos do Clube de Vantagens são
            entregues <strong>exclusivamente junto de um próximo pedido</strong>. Não há envio
            avulso de brindes: o mimo acompanha a próxima compra realizada após o resgate.
            Pontos e prêmios não são convertidos em dinheiro e são de uso pessoal e intransferível.
          </div>
        </div>

        {/* coleta */}
        <Section icon={Database} title="Quais dados coletamos">
          Coletamos os dados que você nos fornece ao criar conta, fazer pedidos, enviar receitas
          ou participar de promoções — como nome, e-mail, telefone, CPF, endereço e histórico de
          compras. Dados de navegação (cookies) podem ser usados para melhorar sua experiência.
        </Section>

        {/* uso */}
        <Section icon={ShieldCheck} title="Como usamos seus dados">
          Usamos seus dados para processar pedidos, manipular fórmulas, gerenciar o Clube de
          Vantagens, prestar atendimento e enviar comunicações que você autorizar. Não vendemos
          seus dados a terceiros.
        </Section>

        {/* segurança */}
        <Section icon={Lock} title="Segurança e seus direitos">
          Adotamos medidas técnicas e organizacionais para proteger seus dados. Conforme a LGPD,
          você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento.
        </Section>

        {/* contato */}
        <Section icon={Mail} title="Fale com a gente">
          Dúvidas sobre privacidade? Escreva para{" "}
          <a href={`mailto:${siteConfig.contact.email}`} className="text-green-700 underline">
            {siteConfig.contact.email}
          </a>
          .
        </Section>

        <p className="text-xs text-ink/45">
          {siteConfig.legalName} · CNPJ {siteConfig.cnpj} · {siteConfig.address.full}
        </p>
      </div>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <Icon size={20} className="text-gold-dark" />
        <h2 className="font-display text-xl text-green-900">{title}</h2>
      </div>
      <p className="text-sm leading-relaxed text-ink/70">{children}</p>
    </section>
  );
}
