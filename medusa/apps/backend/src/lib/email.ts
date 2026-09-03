// Envio de e-mail pela API do Resend, por HTTP puro.
//
// Sem SDK de propósito: o build do Docker já teve problema de limite do npm, e
// esta integração é uma única chamada POST — não vale uma dependência a mais.

const RESEND_URL = "https://api.resend.com/emails"

export type EmailInput = {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}

export const emailEnabled = () => Boolean(process.env.RESEND_API_KEY)

export async function sendEmail(input: EmailInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error("RESEND_API_KEY não configurada")
  }

  const from =
    process.env.EMAIL_FROM || "Tua Pharma <pedidos@tuapharma.com.br>"

  const res = await fetch(RESEND_URL, {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(input.to) ? input.to : [input.to],
      subject: input.subject,
      html: input.html,
      ...(input.replyTo ? { reply_to: input.replyTo } : {}),
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`Resend respondeu ${res.status}: ${body.slice(0, 300)}`)
  }
}

export function brl(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value ?? 0))
}

/** Escapa texto vindo do pedido antes de entrar no HTML do e-mail. */
export function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
