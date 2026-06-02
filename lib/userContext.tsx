"use client";

import {
  createContext, useContext, useState,
  useEffect, useCallback, ReactNode,
} from "react";

/* ═══════════════════════════════════════════
   TYPES
═══════════════════════════════════════════ */
export interface AuthUser {
  firstName: string;
  lastName:  string;
  email:     string;
  plan:      string;
}

interface AuthContextValue {
  user:            AuthUser | null;
  isAuthenticated: boolean;
  isLoading:       boolean;
  login:   (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup:  (firstName: string, lastName: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout:  () => void;
  /** Kept for backwards-compat with Sidebar / page.tsx */
  setUser: (u: AuthUser) => void;
}

/* ═══════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════ */
const SESSION_KEY = "plannerhub_session";
const USERS_KEY   = "plannerhub_users";

/** Pre-seeded demo accounts */
const SEED_USERS: Array<AuthUser & { password: string }> = [
  {
    firstName: "Muhammad",
    lastName:  "Kabir",
    email:     "demo@plannerhub.com",
    password:  "demo123",
    plan:      "Pro Member",
  },
  {
    firstName: "Admin",
    lastName:  "User",
    email:     "admin@plannerhub.com",
    password:  "admin123",
    plan:      "Admin",
  },
];

/* ═══════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════ */
function loadUsers(): Array<AuthUser & { password: string }> {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const stored: Array<AuthUser & { password: string }> = raw ? JSON.parse(raw) : [];
    // Merge stored users, seed users take precedence for same email
    const merged = [...stored];
    SEED_USERS.forEach((seed) => {
      if (!merged.find((u) => u.email === seed.email)) merged.push(seed);
    });
    return merged;
  } catch {
    return [...SEED_USERS];
  }
}

function saveUsers(users: Array<AuthUser & { password: string }>) {
  try { localStorage.setItem(USERS_KEY, JSON.stringify(users)); } catch { /* noop */ }
}

function loadSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveSession(user: AuthUser) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(user)); } catch { /* noop */ }
}

function clearSession() {
  try { localStorage.removeItem(SESSION_KEY); } catch { /* noop */ }
}

/* ═══════════════════════════════════════════
   CONTEXT
═══════════════════════════════════════════ */
const AuthContext = createContext<AuthContextValue>({
  user: null, isAuthenticated: false, isLoading: true,
  login:   async () => ({ success: false }),
  signup:  async () => ({ success: false }),
  logout:  () => {},
  setUser: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user,      setUserState] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* Restore session from localStorage on mount */
  useEffect(() => {
    const stored = loadSession();
    if (stored) setUserState(stored);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (
    email: string, password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    await new Promise((r) => setTimeout(r, 900)); // simulate network

    const users = loadUsers();
    const match = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    );

    if (!match) {
      return { success: false, error: "Invalid email or password. Try demo@plannerhub.com / demo123" };
    }

    const authUser: AuthUser = {
      firstName: match.firstName,
      lastName:  match.lastName,
      email:     match.email,
      plan:      match.plan,
    };
    saveSession(authUser);
    setUserState(authUser);
    return { success: true };
  }, []);

  const signup = useCallback(async (
    firstName: string, lastName: string, email: string, password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    await new Promise((r) => setTimeout(r, 1000)); // simulate network

    const users = loadUsers();
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: "An account with this email already exists. Please log in." };
    }

    const newUser = { firstName, lastName, email, password, plan: "Free Plan" };
    saveUsers([...users, newUser]);

    const authUser: AuthUser = { firstName, lastName, email, plan: "Free Plan" };
    saveSession(authUser);
    setUserState(authUser);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUserState(null);
  }, []);

  /** Back-compat shim so any component calling setUser() still works */
  const setUser = useCallback((u: AuthUser) => {
    setUserState(u);
    saveSession(u);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated: !!user, isLoading,
      login, signup, logout, setUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useUser() {
  return useContext(AuthContext);
}
