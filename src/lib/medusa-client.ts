// SDK Medusa para o navegador (storefront). Usa auth JWT: o token do cliente
// fica no localStorage e é anexado automaticamente nas chamadas /store.
// (O medusa.ts é usado no servidor p/ listar produtos; este é client-side.)
import Medusa from "@medusajs/js-sdk";

const BACKEND =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PK = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

export const REGION_ID = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID || "";

export const sdk = new Medusa({
  baseUrl: BACKEND,
  publishableKey: PK,
  auth: { type: "jwt" },
});
