"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, Zap } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/context";
import { users, workers, employers } from "@/data/users";
import { cn } from "@/lib/utils";

const categoryLabel: Record<string, string> = {
  plomeria: "Plomería",
  electricidad: "Electricidad",
  carpinteria: "Carpintería",
  pintura: "Pintura",
  limpieza: "Limpieza",
  cerrajeria: "Cerrajería",
  mudanzas: "Mudanzas",
  fumigacion: "Fumigación",
};

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isWorker } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoTab, setDemoTab] = useState<"worker" | "employer">("worker");

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.replace(isWorker ? "/dashboard/worker" : "/dashboard/employer");
    }
  }, [isAuthenticated, isWorker, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email) { setError("Ingresa tu email"); return; }
    if (!password) { setError("Ingresa tu contraseña"); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    const found = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!found) {
      setError("No encontramos una cuenta con ese email.");
      setLoading(false);
      return;
    }

    login(found.id);
    router.push(found.role === "worker" ? "/dashboard/worker" : "/dashboard/employer");
  }

  async function handleQuickLogin(userId: string) {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const found = users.find((u) => u.id === userId)!;
    login(userId);
    router.push(found.role === "worker" ? "/dashboard/worker" : "/dashboard/employer");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-primary-mid to-background flex flex-col">
      {/* Minimal header */}
      <div className="px-4 py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Link>
      </div>

      {/* Centered form */}
      <div className="flex-1 flex items-start justify-center px-4 pb-12 pt-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <span className="text-3xl font-bold text-primary">Camellio</span>
            <p className="text-text-secondary mt-1 text-sm">
              Inicia sesión en tu cuenta
            </p>
          </div>

          {/* Form card */}
          <div className="bg-surface rounded-2xl shadow-card-hover border border-border p-6 mb-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  className={cn(
                    "w-full px-3.5 py-2.5 rounded-xl border text-sm text-text-primary bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors",
                    error && !email ? "border-danger" : "border-border"
                  )}
                  placeholder="tu@email.com"
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    className={cn(
                      "w-full px-3.5 py-2.5 pr-11 rounded-xl border text-sm text-text-primary bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors",
                      error && !password ? "border-danger" : "border-border"
                    )}
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-text-secondary mt-1">
                  Demo: usa cualquier contraseña
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-danger/10 text-danger text-sm rounded-xl px-4 py-2.5 border border-danger/20">
                  {error}{" "}
                  {error.includes("cuenta") && (
                    <Link href="/registro" className="underline font-medium">
                      Regístrate aquí
                    </Link>
                  )}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full mt-1"
              >
                Iniciar sesión
              </Button>
            </form>

            <p className="text-center text-sm text-text-secondary mt-4">
              ¿No tienes cuenta?{" "}
              <Link
                href="/registro"
                className="text-primary font-semibold hover:underline"
              >
                Regístrate gratis
              </Link>
            </p>
          </div>

          {/* Demo quick access */}
          <div className="bg-surface rounded-2xl border border-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-accent" />
              <p className="text-sm font-bold text-text-primary">
                Acceso rápido — cuentas demo
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-background rounded-xl p-1 mb-4">
              {(["worker", "employer"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setDemoTab(tab)}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-xs font-semibold transition-all",
                    demoTab === tab
                      ? "bg-surface text-text-primary shadow-card"
                      : "text-text-secondary hover:text-text-primary"
                  )}
                >
                  {tab === "worker" ? "👷 Trabajadores" : "🏢 Empleadores"}
                </button>
              ))}
            </div>

            {/* User cards */}
            <div className="grid grid-cols-2 gap-2">
              {(demoTab === "worker" ? workers : employers).map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleQuickLogin(u.id)}
                  disabled={loading}
                  className="flex items-center gap-2.5 p-3 bg-background rounded-xl border border-border hover:border-primary hover:bg-primary-light transition-all text-left group"
                >
                  <Avatar name={u.name} size="sm" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-text-primary truncate">
                      {u.name.split(" ")[0]} {u.name.split(" ")[1]?.[0]}.
                    </p>
                    <p className="text-xs text-text-secondary truncate">
                      {u.role === "worker"
                        ? categoryLabel[u.workerProfile?.category ?? ""] ?? ""
                        : u.employerProfile?.companyName ?? "Empleador"}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <p className="text-xs text-text-secondary text-center mt-3">
              Emails en:{" "}
              <span className="font-mono text-text-primary">
                {(demoTab === "worker" ? workers : employers)[0]?.email}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
