import { NextResponse } from "next/server";
import { appendFile, access } from "fs/promises";
import path from "path";
import { saveLead, adminEnabled } from "@/lib/medusa-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CSV_PATH = path.join(process.cwd(), "leads.csv");
const HEADER = "data,nome,whatsapp,email,nascimento,cupom,origem\n";

function esc(value: unknown): string {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name, whatsapp, email, birthdate, coupon, origem } = body as {
      name?: string;
      whatsapp?: string;
      email?: string;
      birthdate?: string;
      coupon?: string;
      origem?: string;
    };

    if (!name || !email) {
      return NextResponse.json(
        { ok: false, error: "Nome e e-mail são obrigatórios." },
        { status: 400 }
      );
    }

    const date = new Date().toISOString();
    const source = origem || "popup-cadastro";

    // 1) grava na planilha local leads.csv (best-effort:
    //    em ambientes serverless como a Vercel o disco é somente-leitura)
    try {
      const row =
        [date, name, whatsapp, email, birthdate, coupon, source]
          .map(esc)
          .join(",") + "\n";
      try {
        await access(CSV_PATH);
      } catch {
        await appendFile(CSV_PATH, HEADER);
      }
      await appendFile(CSV_PATH, row);
    } catch {
      // disco somente-leitura (Vercel): ignora e segue para o webhook
    }

    // 2) encaminha para a planilha externa (Google Sheets / n8n) se configurado
    const webhook = process.env.LEADS_WEBHOOK_URL;
    if (webhook) {
      try {
        await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date,
            name,
            whatsapp,
            email,
            birthdate,
            coupon,
            origem: source,
          }),
        });
      } catch {
        // não bloqueia o cadastro se o webhook falhar
      }
    }

    // 3) destino DEFINITIVO: grava no Medusa, no grupo "Leads — pop-up".
    //    O CSV local some a cada requisição na Vercel e a planilha depende do
    //    Google; aqui o lead fica no mesmo banco da loja, visível no painel.
    let saved: "criado" | "atualizado" | null = null;
    let saveError: string | null = null;
    if (adminEnabled()) {
      try {
        saved = await saveLead({
          name,
          email,
          whatsapp,
          birthdate,
          coupon,
          origem: source,
        });
      } catch (e: any) {
        saveError = e?.message || "falha ao gravar no Medusa";
        console.error("[lead] falha ao gravar no Medusa:", saveError);
      }
    } else {
      saveError = "MEDUSA_ADMIN_API_KEY não configurada";
    }

    // O visitante nunca vê erro: o cupom dele não pode depender da nossa
    // infraestrutura. Mas devolvemos o diagnóstico para monitoramento.
    return NextResponse.json({ ok: true, saved, saveError });
  } catch {
    return NextResponse.json({ ok: false, error: "Erro ao salvar." }, { status: 500 });
  }
}
