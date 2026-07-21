import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/* =========================================================================
   TIPOS
   ========================================================================= */

export interface UserProfile {
  name: string;
  email: string;
  plan: string;
  language: string; // ex: "pt-BR"
}

interface UserContextValue {
  user: UserProfile;
  updateProfile: (data: { name: string; email: string }) => void;
  setPlan: (plan: string) => void;
  setLanguage: (language: string) => void;
}

const UserContext = createContext<UserContextValue | null>(null);

/* =========================================================================
   PERSISTÊNCIA (hoje: localStorage / amanhã: troca por chamadas de API
   de autenticação — este contexto é o único ponto que precisa mudar
   quando o backend e o login existirem)
   ========================================================================= */

const STORAGE_KEY = "novix:user";

const DEFAULT_USER: UserProfile = {
  name: "Cliente Novix",
  email: "ClienteNovix@gmail.com",
  plan: "Plano free",
  language: "pt-BR",
};

function loadUser(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_USER, ...JSON.parse(raw) } : DEFAULT_USER;
  } catch {
    return DEFAULT_USER;
  }
}

function saveUser(user: UserProfile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {
    // localStorage indisponível (modo privado, etc) — segue sem persistir
  }
}

/* =========================================================================
   PROVIDER
   ========================================================================= */

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile>(loadUser);

  useEffect(() => saveUser(user), [user]);

  const updateProfile = (data: { name: string; email: string }) => {
    setUser((prev) => ({ ...prev, ...data }));
  };

  const setPlan = (plan: string) => {
    setUser((prev) => ({ ...prev, plan }));
  };

  const setLanguage = (language: string) => {
    setUser((prev) => ({ ...prev, language }));
  };

  return (
    <UserContext.Provider value={{ user, updateProfile, setPlan, setLanguage }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser deve ser usado dentro de <UserProvider>");
  return ctx;
};
