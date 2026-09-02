// Tokenização de cartão no navegador (Pagar.me API v5).
// O número do cartão NUNCA passa pelo nosso backend: vai direto pra Pagar.me
// usando a CHAVE PÚBLICA (pk_), que só serve pra criar token. O backend recebe
// apenas o `card_token`.
const PUBLIC_KEY = process.env.NEXT_PUBLIC_PAGARME_PUBLIC_KEY || "";

export const cardEnabled = () => Boolean(PUBLIC_KEY);

export type CardInput = {
  number: string;
  holderName: string;
  expMonth: string; // "12"
  expYear: string; // "2030" ou "30"
  cvv: string;
};

export async function tokenizeCard(card: CardInput): Promise<string> {
  if (!PUBLIC_KEY) {
    throw new Error(
      "Pagamento com cartão indisponível no momento. Use o Pix."
    );
  }
  const res = await fetch(
    `https://api.pagar.me/core/v5/tokens?appId=${encodeURIComponent(PUBLIC_KEY)}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type: "card",
        card: {
          number: card.number.replace(/\D/g, ""),
          holder_name: card.holderName.trim(),
          exp_month: Number(card.expMonth),
          exp_year: Number(card.expYear.length === 2 ? `20${card.expYear}` : card.expYear),
          cvv: card.cvv.replace(/\D/g, ""),
        },
      }),
    }
  );
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json?.id) {
    const msg =
      json?.message ||
      json?.errors?.[Object.keys(json?.errors ?? {})[0]]?.[0] ||
      "Não foi possível validar os dados do cartão.";
    throw new Error(msg);
  }
  return json.id as string;
}
