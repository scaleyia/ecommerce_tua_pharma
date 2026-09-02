// Tokenização de cartão no navegador (Pagar.me API v5).
// O número do cartão NUNCA passa pelo nosso backend: vai direto pra Pagar.me
// usando a CHAVE PÚBLICA (pk_), que só serve pra criar token. O backend recebe
// apenas o `card_token`.
//
// A chave vem de `/api/payment-config`, lida no SERVIDOR em tempo de execução.
// Antes ela era embutida no bundle em tempo de build, e isso criava uma
// armadilha silenciosa: cadastrar a variável no Vercel não surtia efeito até um
// rebuild sem cache, e o botão de cartão simplesmente não aparecia — sem erro.

let cachedKey: string | null | undefined;

/** Busca a chave pública no servidor (uma vez por sessão de página). */
export async function getPublicKey(): Promise<string | null> {
  if (cachedKey !== undefined) return cachedKey;
  // valor embutido no build, quando existir, evita a ida ao servidor
  const inlined = process.env.NEXT_PUBLIC_PAGARME_PUBLIC_KEY;
  if (inlined) {
    cachedKey = inlined;
    return cachedKey;
  }
  try {
    const res = await fetch("/api/payment-config", { cache: "no-store" });
    const json = await res.json();
    cachedKey = json?.publicKey || null;
  } catch {
    cachedKey = null;
  }
  return cachedKey ?? null;
}

/** true quando a loja consegue aceitar cartão (há chave pública configurada). */
export async function cardEnabled(): Promise<boolean> {
  return Boolean(await getPublicKey());
}

export type CardInput = {
  number: string;
  holderName: string;
  expMonth: string; // "12"
  expYear: string; // "2030" ou "30"
  cvv: string;
};

export async function tokenizeCard(card: CardInput): Promise<string> {
  const publicKey = await getPublicKey();
  if (!publicKey) {
    throw new Error("Pagamento com cartão indisponível no momento. Use o Pix.");
  }
  const res = await fetch(
    `https://api.pagar.me/core/v5/tokens?appId=${encodeURIComponent(publicKey)}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type: "card",
        card: {
          number: card.number.replace(/\D/g, ""),
          holder_name: card.holderName.trim(),
          exp_month: Number(card.expMonth),
          exp_year: Number(
            card.expYear.length === 2 ? `20${card.expYear}` : card.expYear
          ),
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
