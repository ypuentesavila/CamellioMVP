"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { AuthLayout } from "./AuthLayout";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context";
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

    if (!email.trim()) { setError("Ingresa tu correo."); return; }
    if (!password.trim()) { setError("Ingresa tu contraseña."); return; }

    setLoading(true);
    try {
      const user = await login(email.trim(), password);
      router.push(user.role === 'worker' ? '/dashboard/worker' : '/dashboard/employer');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Correo o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
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
    </AuthLayout>
  );
}
