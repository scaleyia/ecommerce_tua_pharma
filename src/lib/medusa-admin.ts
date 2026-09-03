// Acesso à API admin do Medusa a partir do SERVIDOR do site (nunca do navegador).
//
// Autentica com uma chave secreta (`sk_...`) via Basic auth. A chave vive só em
// variável de ambiente no servidor — não é embutida no site e não aparece para
// o visitante.
const BACKEND =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const SECRET = process.env.MEDUSA_ADMIN_API_KEY || "";

export const adminEnabled = () => Boolean(SECRET);

function authHeader(): string {
  // Basic base64("sk_...:") — a senha vai vazia, como o Medusa espera
  return `Basic ${Buffer.from(`${SECRET}:`).toString("base64")}`;
}

export async function adminFetch(
  path: string,
  init: { method?: string; body?: unknown } = {}
): Promise<any> {
  if (!SECRET) throw new Error("MEDUSA_ADMIN_API_KEY não configurada.");

  const res = await fetch(`${BACKEND}${path}`, {
    method: init.method ?? (init.body ? "POST" : "GET"),
    headers: {
      authorization: authHeader(),
      "content-type": "application/json",
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      json?.message || `Medusa admin respondeu ${res.status} em ${path}`
    );
  }
  return json;
}

const GROUP_NAME = "Leads — pop-up";
let groupIdCache: string | null = null;

/** Id do grupo de leads, criando-o na primeira vez. */
export async function getLeadsGroupId(): Promise<string> {
  if (groupIdCache) return groupIdCache;

  const { customer_groups } = await adminFetch(
    `/admin/customer-groups?limit=100`
  );
  const existing = (customer_groups ?? []).find(
    (g: any) => g.name === GROUP_NAME
  );
  if (existing) {
    groupIdCache = existing.id;
    return existing.id;
  }

  const { customer_group } = await adminFetch(`/admin/customer-groups`, {
    body: { name: GROUP_NAME },
  });
  groupIdCache = customer_group.id;
  return customer_group.id;
}

export type LeadInput = {
  name: string;
  email: string;
  whatsapp?: string;
  birthdate?: string;
  coupon?: string;
  origem?: string;
};

/**
 * Grava o lead como cliente do Medusa, dentro do grupo "Leads — pop-up".
 * Se o e-mail já existir (a pessoa preencheu de novo, ou já é cliente), só
 * completa os dados que faltavam — nunca apaga o que já estava lá.
 */
export async function saveLead(lead: LeadInput): Promise<"criado" | "atualizado"> {
  const [first, ...rest] = lead.name.trim().split(/\s+/);
  const metadata = {
    lead: true,
    origem: lead.origem || "popup-cadastro",
    nascimento: lead.birthdate || "",
    cupom: lead.coupon || "",
    capturado_em: new Date().toISOString(),
  };

  const { customers } = await adminFetch(
    `/admin/customers?limit=1&email=${encodeURIComponent(lead.email)}`
  );
  const existing = customers?.[0];

  let customerId: string;
  let resultado: "criado" | "atualizado";

  if (existing) {
    customerId = existing.id;
    resultado = "atualizado";
    await adminFetch(`/admin/customers/${customerId}`, {
      method: "POST",
      body: {
        // preserva o que já existe; só preenche buracos
        first_name: existing.first_name || first || "",
        last_name: existing.last_name || rest.join(" "),
        phone: existing.phone || lead.whatsapp || undefined,
        metadata: { ...(existing.metadata ?? {}), ...metadata },
      },
    });
  } else {
    const { customer } = await adminFetch(`/admin/customers`, {
      body: {
        email: lead.email,
        first_name: first || "",
        last_name: rest.join(" "),
        phone: lead.whatsapp || undefined,
        metadata,
      },
    });
    customerId = customer.id;
    resultado = "criado";
  }

  const groupId = await getLeadsGroupId();
  await adminFetch(`/admin/customer-groups/${groupId}/customers`, {
    body: { add: [customerId] },
  });

  return resultado;
}
