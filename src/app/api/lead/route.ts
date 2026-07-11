import { NextResponse } from "next/server";
import { appendFile, access } from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CSV_PATH = path.join(process.cwd(), "leads.csv");
const HEADER = "data,nome,whatsapp,email,cupom,origem\n";

function esc(value: unknown): string {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name, whatsapp, email, coupon } = body as {
      name?: string;
      whatsapp?: string;
      email?: string;
      coupon?: string;
    };

    if (!name || !email) {
      return NextResponse.json(
        { ok: false, error: "Nome e e-mail são obrigatórios." },
        { status: 400 }
      );
    }

    const date = new Date().toISOString();

    // 1) grava na planilha local leads.csv
    const row =
      [date, name, whatsapp, email, coupon, "roleta"].map(esc).join(",") + "\n";
    try {
      await access(CSV_PATH);
    } catch {
      await appendFile(CSV_PATH, HEADER);
    }
    await appendFile(CSV_PATH, row);

    // 2) encaminha para a planilha externa (Google Sheets / n8n) se configurado
    const webhook = process.env.LEADS_WEBHOOK_URL;
    if (webhook) {
      try {
        await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date, name, whatsapp, email, coupon, origem: "roleta" }),
        });
      } catch {
        // não bloqueia o cadastro se o webhook falhar
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Erro ao salvar." }, { status: 500 });
  }
}
