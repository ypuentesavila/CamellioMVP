"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { AuthLayout } from "./AuthLayout";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context";
import { users } from "@/data/users";
import { copy } from "@/data/copy";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Ingresa tu correo.");
      return;
    }
    if (!password.trim()) {
      setError("Ingresa tu contraseña.");
      return;
    }

    setLoading(true);

    await new Promise((r) => setTimeout(r, 600));

    const match = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!match) {
      setLoading(false);
      setError(
        "No encontramos una cuenta con ese correo. Revisa o regístrate."
      );
      return;
    }

    login(match.id);
    router.push(
      match.role === "worker" ? "/dashboard/worker" : "/dashboard/employer"
    );
  }

  return (
    <AuthLayout
      cta={{
        label: loading ? "Entrando…" : "Entrar",
        type: "submit",
        form: "login-form",
        loading,
      }}
      footer={
        <p className="text-xs text-stone-500 text-center">
          {copy.auth.login.noAccount}{" "}
          <Link href="/registro" className="text-ink font-semibold underline underline-offset-2">
            {copy.auth.login.register}
          </Link>
        </p>
      }
    >
      <div className="mb-8">
        <p className="eyebrow text-stone-500 mb-2">
          {copy.auth.login.eyebrow}
        </p>
        <h1 className="text-2xl font-bold text-ink tracking-tight">
          {copy.auth.login.title}
        </h1>
      </div>

      <form
        id="login-form"
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-4"
      >
        <Input
          label={copy.auth.login.email}
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leadingIcon={Mail}
          placeholder="tu@correo.com"
          required
        />

        <Input
          label={copy.auth.login.password}
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leadingIcon={Lock}
          placeholder="••••••••"
          required
        />

        {error && (
          <p role="alert" className="text-xs text-amber-500 leading-snug">
            {error}
          </p>
        )}

        <Link
          href="/registro?forgot=1"
          className="text-xs text-stone-500 hover:text-ink transition-colors self-start"
        >
          {copy.auth.login.forgotPassword}
        </Link>
      </form>

      <div className="mt-6 pt-6 border-t border-stone-200">
        <p className="text-xs text-stone-500 mb-3">Acceso rápido para demo</p>
        <div className="flex flex-col gap-2">
          {[
            { id: "u1", label: "Carlos Mendoza", role: "Trabajador · Plomería" },
            { id: "u8", label: "Juan Pablo Restrepo", role: "Cliente · Chapinero" },
          ].map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => {
                login(u.id);
                router.push(
                  u.id.startsWith("u1") || u.id.startsWith("u2") || u.id.startsWith("u3")
                    ? "/dashboard/worker"
                    : "/dashboard/employer"
                );
              }}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl border border-stone-200",
                "bg-card hover:border-ink hover:bg-stone-100 transition-colors text-left"
              )}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink truncate">
                  {u.label}
                </p>
                <p className="text-xs text-stone-500 truncate">{u.role}</p>
              </div>
              <span className="text-xs text-stone-400 font-mono shrink-0">
                {u.id}
              </span>
            </button>
          ))}
        </div>
      </div>
    </AuthLayout>
  );
}
