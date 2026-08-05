import Link from "next/link";
import { RotateCcw, ShieldCheck, Truck, Clock, AlertTriangle } from "lucide-react";
import { siteConfig, whatsappLink } from "@/lib/site";

export const metadata = { title: "Trocas e Devoluções — Tua Pharma" };

export default function TrocasDevolucoesPage() {
  return (
    <div className="pb-16">
      {/* hero */}
      <section className="bg-green-900 text-white">
        <div className="container-tua py-14">
          <span className="eyebrow text-gold">Institucional</span>
          <h1 className="mt-2 font-display text-4xl font-light leading-tight text-balance md:text-5xl">
            Trocas, Devoluções e Entregas
          </h1>
          <p className="mt-4 max-w-2xl text-white/70">
            Nosso compromisso é com a sua segurança e satisfação. Conheça abaixo as condições
            para trocas, devoluções e os prazos de entrega dos seus pedidos.
          </p>
        </div>
      </section>

      <div className="container-tua max-w-3xl space-y-8 py-12">
        {/* aviso manipulados */}
        <div className="flex gap-3 rounded-2xl border border-gold/30 bg-gold/10 p-5">
          <AlertTriangle size={22} className="mt-0.5 shrink-0 text-gold-dark" />
          <div className="text-sm leading-relaxed text-ink/75">
            <strong className="text-green-900">Medicamentos manipulados são personalizados.</strong>{" "}
            Por serem preparados exclusivamente para cada paciente, conforme prescrição, os
            manipulados <strong>não podem ser trocados ou devolvidos</strong> após o preparo, salvo
            em caso de defeito, erro de manipulação ou divergência em relação ao pedido — em
            atendimento às normas sanitárias da ANVISA.
          </div>
        </div>

        {/* direito de arrependimento */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <RotateCcw size={20} className="text-gold-dark" />
            <h2 className="font-display text-2xl text-green-900">Direito de arrependimento (7 dias)</h2>
          </div>
          <p className="text-sm leading-relaxed text-ink/70">
            Para compras realizadas pela internet, o cliente tem até <strong>7 dias corridos</strong>,
            a contar do recebimento, para desistir da compra (art. 49 do Código de Defesa do
            Consumidor). Esse direito aplica-se a <strong>produtos industrializados e de prateleira</strong>{" "}
            (suplementos, cosméticos e similares) que estejam <strong>lacrados, sem uso e na embalagem
            original</strong>. Não se aplica a medicamentos manipulados, pelos motivos descritos acima.
          </p>
        </section>

        {/* produto com defeito */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck size={20} className="text-gold-dark" />
            <h2 className="font-display text-2xl text-green-900">Produto com defeito ou avaria</h2>
          </div>
          <p className="text-sm leading-relaxed text-ink/70">
            Se o produto chegar com defeito, avaria de transporte, fora da validade ou em desacordo
            com o pedido, entre em contato em até <strong>7 dias corridos</strong> após o recebimento.
            Faremos a análise e, confirmado o problema, providenciaremos a{" "}
            <strong>troca, o reenvio ou o reembolso integral</strong>, incluindo o valor do frete,
            sem custo adicional para você.
          </p>
        </section>

        {/* como solicitar */}
        <section className="rounded-2xl border border-green-900/5 bg-white p-6 shadow-card">
          <h2 className="mb-3 font-display text-2xl text-green-900">Como solicitar</h2>
          <ol className="space-y-2 text-sm text-ink/70">
            <li>
              <strong>1.</strong> Entre em contato pelo WhatsApp{" "}
              <a
                href={whatsappLink("Olá! Gostaria de solicitar uma troca/devolução do meu pedido.")}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-green-700 hover:text-gold-dark"
              >
                {siteConfig.contact.whatsapp}
              </a>{" "}
              ou pelo e-mail{" "}
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="font-medium text-green-700 hover:text-gold-dark"
              >
                {siteConfig.contact.email}
              </a>
              , informando o número do pedido.
            </li>
            <li>
              <strong>2.</strong> Nossa equipe orientará sobre a devolução do produto (quando
              aplicável) e os próximos passos.
            </li>
            <li>
              <strong>3.</strong> Após o recebimento e a análise do produto, o reembolso é processado
              em até <strong>10 dias úteis</strong>, na mesma forma de pagamento utilizada na compra.
            </li>
          </ol>
        </section>

        {/* prazos de entrega */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Truck size={20} className="text-gold-dark" />
            <h2 className="font-display text-2xl text-green-900">Prazos de entrega</h2>
          </div>
          <p className="text-sm leading-relaxed text-ink/70">{siteConfig.delivery.note}</p>
          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-cream p-4 text-sm text-ink/70">
            <Clock size={18} className="shrink-0 text-gold-dark" />
            <span>
              O prazo começa a contar após a confirmação do pagamento e, no caso de manipulados,
              inclui o tempo de preparo da fórmula. Pedidos com receita passam por análise
              farmacêutica antes do preparo.
            </span>
          </div>
        </section>

        <p className="border-t border-green-900/10 pt-6 text-xs leading-relaxed text-ink/45">
          Este documento é um modelo e deve ser revisado e validado pelo responsável legal e pelo
          farmacêutico responsável técnico antes da publicação definitiva. Dúvidas? Fale conosco pelo{" "}
          <Link href="/receita" className="text-green-700 hover:text-gold-dark">
            atendimento
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
