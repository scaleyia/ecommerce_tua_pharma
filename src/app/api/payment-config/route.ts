// Configuração de pagamento lida em tempo de EXECUÇÃO (não no build).
//
// A chave pública da Pagar.me era embutida no bundle durante o build, o que
// criava uma armadilha silenciosa: criar ou trocar a variável no Vercel não
// tinha efeito nenhum até um rebuild sem cache, e o botão de cartão sumia sem
// erro algum. Lendo aqui no servidor, a variável passa a valer no próximo
// carregamento da página — sem deploy.
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  const publicKey =
    process.env.PAGARME_PUBLIC_KEY ||
    process.env.NEXT_PUBLIC_PAGARME_PUBLIC_KEY ||
    "";

  return NextResponse.json({
    cardEnabled: Boolean(publicKey),
    publicKey: publicKey || null,
    // diagnóstico: diz de qual variável veio, sem expor valor secreto nenhum
    source: process.env.PAGARME_PUBLIC_KEY
      ? "PAGARME_PUBLIC_KEY"
      : process.env.NEXT_PUBLIC_PAGARME_PUBLIC_KEY
        ? "NEXT_PUBLIC_PAGARME_PUBLIC_KEY"
        : "nenhuma",
  });
}
