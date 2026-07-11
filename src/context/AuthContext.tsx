"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@/lib/types";

const USERS_KEY = "tua-users";
const SESSION_KEY = "tua-session";

type StoredAccount = { password: string; user: User };
type Accounts = Record<string, StoredAccount>;

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
  login: (email: string, password: string) => AuthResult;
  register: (input: RegisterInput) => AuthResult;
  logout: () => void;
  update: (patch: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readAccounts(): Accounts {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeAccounts(accounts: Accounts) {
  localStorage.setItem(USERS_KEY, JSON.stringify(accounts));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const persistSession = (next: User | null) => {
    setUser(next);
    if (next) localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    else localStorage.removeItem(SESSION_KEY);
  };

  const register = (input: RegisterInput): AuthResult => {
    const email = input.email.trim().toLowerCase();
    if (!email || !input.password || !input.name)
      return { ok: false, error: "Preencha nome, e-mail e senha." };
    const accounts = readAccounts();
    if (accounts[email])
      return { ok: false, error: "Já existe uma conta com este e-mail." };

    const newUser: User = {
      name: input.name.trim(),
      email,
      phone: input.phone,
      cpf: input.cpf,
      birthdate: input.birthdate,
      points: 120,
    };
    accounts[email] = { password: input.password, user: newUser };
    writeAccounts(accounts);
    persistSession(newUser);
    return { ok: true };
  };

  const login = (email: string, password: string): AuthResult => {
    const key = email.trim().toLowerCase();
    const accounts = readAccounts();
    const account = accounts[key];
    if (!account) return { ok: false, error: "E-mail não cadastrado." };
    if (account.password !== password)
      return { ok: false, error: "Senha incorreta." };
    persistSession(account.user);
    return { ok: true };
  };

  const logout = () => persistSession(null);

  const update = (patch: Partial<User>) => {
    if (!user) return;
    const next = { ...user, ...patch };
    persistSession(next);
    const accounts = readAccounts();
    if (accounts[user.email]) {
      accounts[user.email].user = next;
      writeAccounts(accounts);
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
