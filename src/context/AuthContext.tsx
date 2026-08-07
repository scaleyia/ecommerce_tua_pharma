"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@/lib/types";
import { sdk } from "@/lib/medusa-client";

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  cpf?: string;
  birthdate?: string;
};

type AuthResult = { ok: boolean; error?: string };

type AuthContextValue = {
  user: User | null;
  hydrated: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (input: RegisterInput) => Promise<AuthResult>;
  logout: () => Promise<void>;
  update: (patch: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// customer da Medusa -> User da loja (dados extras vivem em metadata)
function mapCustomer(c: any): User {
  const meta = c?.metadata ?? {};
  return {
    name: [c?.first_name, c?.last_name].filter(Boolean).join(" ") || c?.email,
    email: c?.email,
    phone: c?.phone || meta.phone || undefined,
    cpf: meta.cpf || undefined,
    birthdate: meta.birthdate || undefined,
    cep: meta.cep || undefined,
    address: meta.address || undefined,
    points: Number(meta.points ?? 0),
  };
}

function splitName(full: string): { first: string; last: string } {
  const parts = full.trim().split(/\s+/);
  return { first: parts[0] ?? "", last: parts.slice(1).join(" ") };
}

// mensagem amigável a partir do erro do SDK
function friendly(e: any, fallback: string): string {
  const msg = String(e?.message ?? e ?? "");
  if (/exists|já existe|already/i.test(msg)) return "Já existe uma conta com este e-mail.";
  if (/unauthorized|invalid|credentials|senha|password/i.test(msg))
    return "E-mail ou senha incorretos.";
  if (/network|fetch|failed to fetch/i.test(msg))
    return "Não foi possível conectar ao servidor. Tente novamente.";
  return fallback;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Restaura a sessão: se houver token válido, busca o customer atual.
  useEffect(() => {
    (async () => {
      try {
        const { customer } = await sdk.store.customer.retrieve();
        if (customer) setUser(mapCustomer(customer));
      } catch {
        /* sem sessão ativa */
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  const register = async (input: RegisterInput): Promise<AuthResult> => {
    const email = input.email.trim().toLowerCase();
    if (!email || !input.password || !input.name)
      return { ok: false, error: "Preencha nome, e-mail e senha." };

    try {
      // 1) cria a credencial de acesso (emailpass) e guarda o token de registro
      await sdk.auth.register("customer", "emailpass", {
        email,
        password: input.password,
      });

      // 2) cria o customer na Medusa (aparece na aba Clientes)
      const { first, last } = splitName(input.name);
      await sdk.store.customer.create({
        email,
        first_name: first,
        last_name: last,
        phone: input.phone || undefined,
        metadata: {
          cpf: input.cpf || null,
          birthdate: input.birthdate || null,
          phone: input.phone || null,
          points: 120, // bônus de boas-vindas do Clube
        },
      });

      // 3) autentica de fato (gera o token de sessão do cliente)
      await sdk.auth.login("customer", "emailpass", {
        email,
        password: input.password,
      });

      const { customer } = await sdk.store.customer.retrieve();
      setUser(mapCustomer(customer));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: friendly(e, "Não foi possível cadastrar.") };
    }
  };

  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      await sdk.auth.login("customer", "emailpass", {
        email: email.trim().toLowerCase(),
        password,
      });
      const { customer } = await sdk.store.customer.retrieve();
      setUser(mapCustomer(customer));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: friendly(e, "Não foi possível entrar.") };
    }
  };

  const logout = async () => {
    try {
      await sdk.auth.logout();
    } catch {
      /* ignore */
    }
    setUser(null);
  };

  const update = async (patch: Partial<User>) => {
    if (!user) return;
    const next = { ...user, ...patch };
    setUser(next); // otimista

    try {
      const { first, last } = splitName(next.name);
      await sdk.store.customer.update({
        first_name: first,
        last_name: last,
        phone: next.phone || undefined,
        metadata: {
          cpf: next.cpf || null,
          birthdate: next.birthdate || null,
          phone: next.phone || null,
          cep: next.cep || null,
          address: next.address || null,
          points: next.points,
        },
      });
    } catch {
      /* mantém o estado otimista mesmo se a persistência falhar */
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, hydrated, login, register, logout, update }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
