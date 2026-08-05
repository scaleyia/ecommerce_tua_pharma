import { createClient } from "@supabase/supabase-js";

// Client com SERVICE ROLE — ignora RLS. Use APENAS em código server-side de
// confiança (rotas /admin já autorizadas, webhooks, seed). Nunca no browser.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
