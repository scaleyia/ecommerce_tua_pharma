import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Client para Server Components / Route Handlers. Lê a sessão do usuário via
// cookies e respeita RLS (anon key + sessão).
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // chamado de um Server Component: ignora (o middleware renova a sessão)
          }
        },
      },
    }
  );
}
