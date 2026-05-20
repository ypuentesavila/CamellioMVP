"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/types";
import { api, getToken, setToken, clearToken } from "@/lib/api";

interface RegisterWorkerData {
  name: string;
  email: string;
  password: string;
  location: string;
  category: string;
  skills: string[];
  hourlyRate: number;
  phone?: string;
}

interface RegisterEmployerData {
  name: string;
  email: string;
  password: string;
  location: string;
  phone?: string;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isWorker: boolean;
  isEmployer: boolean;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  registerWorker: (data: RegisterWorkerData) => Promise<User>;
  registerEmployer: (data: RegisterEmployerData) => Promise<User>;
  logout: () => void;
}

interface AuthResponse {
  token: string;
  user: User;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setAuthLoading(false);
      return;
    }
    api.get<User>('/auth/me')
      .then(setUser)
      .catch(() => clearToken())
      .finally(() => setAuthLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    const { token, user } = await api.post<AuthResponse>('/auth/login', { email, password });
    setToken(token);
    setUser(user);
    return user;
  }, []);

  const registerWorker = useCallback(async (data: RegisterWorkerData): Promise<User> => {
    const { token, user } = await api.post<AuthResponse>('/auth/register/worker', data);
    setToken(token);
    setUser(user);
    return user;
  }, []);

  const registerEmployer = useCallback(async (data: RegisterEmployerData): Promise<User> => {
    const { token, user } = await api.post<AuthResponse>('/auth/register/employer', data);
    setToken(token);
    setUser(user);
    return user;
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isWorker: user?.role === 'worker',
        isEmployer: user?.role === 'employer',
        authLoading,
        login,
        registerWorker,
        registerEmployer,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
