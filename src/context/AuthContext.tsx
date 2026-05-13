"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { User } from "@/types";
import { getUserById } from "@/data/users";

const STORAGE_KEY = "camellio_auth";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isWorker: boolean;
  isEmployer: boolean;
  login: (userId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      const { userId } = JSON.parse(stored);
      return getUserById(userId) ?? null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ userId: user.id }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = useCallback((userId: string) => {
    const found = getUserById(userId);
    if (!found) throw new Error(`User ${userId} not found`);
    setUser(found);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isWorker: user?.role === "worker",
        isEmployer: user?.role === "employer",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
