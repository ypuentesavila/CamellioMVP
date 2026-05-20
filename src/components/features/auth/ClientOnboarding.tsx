"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Phone, Mail, Lock } from "lucide-react";
import { AuthLayout } from "./AuthLayout";
import { Input } from "@/components/ui/Input";
import { Chip, ChipGroup } from "@/components/ui/Chip";
import { useAuth } from "@/context";
import { copy } from "@/data/copy";

const ZONES = [
  "Usaquén", "Chapinero", "Santa Fe", "San Cristóbal",
  "Usme", "Tunjuelito", "Bosa", "Kennedy",
  "Fontibón", "Engativá", "Suba", "Barrios Unidos",
  "Teusaquillo", "Los Mártires", "Antonio Nariño",
  "Puente Aranda", "La Candelaria", "Rafael Uribe Uribe",
  "Ciudad Bolívar",
];

export function ClientOnboarding() {
  const router = useRouter();
  const { registerEmployer } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [zone, setZone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = copy.errors.required;
    if (!email.trim()) e.email = copy.errors.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = copy.errors.invalidEmail;
    if (!password.trim()) e.password = copy.errors.required;
    else if (password.length < 6) e.password = "Mínimo 6 caracteres.";
    if (!phone.trim()) e.phone = copy.errors.required;
    else if (!/^[+\d\s\-()]{7,}$/.test(phone.trim())) e.phone = copy.errors.invalidPhone;
    if (!zone) e.zone = "Selecciona tu zona.";
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      await registerEmployer({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: phone.trim(),
        location: `${zone}, Bogotá`,
      });
      router.push("/bienvenido");
    } catch (err: unknown) {
      setErrors({ email: err instanceof Error ? err.message : "Error al registrar." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      cta={{
        label: loading ? "Guardando…" : copy.auth.onboarding.client.cta,
        onClick: handleSubmit,
        loading,
      }}
      footer={null}
    >
      <div className="mb-8">
        <p className="eyebrow text-stone-500 mb-2">
          {copy.auth.onboarding.client.eyebrow}
        </p>
        <h1 className="text-2xl font-bold text-ink tracking-tight">
          {copy.auth.onboarding.client.title}
        </h1>
      </div>

      <div className="flex flex-col gap-5">
        <Input
          label={copy.auth.onboarding.client.nameLabel}
          type="text"
          autoComplete="name"
          autoCapitalize="words"
          value={name}
          onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
          leadingIcon={User}
          placeholder="Tu nombre completo"
          error={errors.name}
          required
        />

        <Input
          label="Correo electrónico"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
          leadingIcon={Mail}
          placeholder="tu@correo.com"
          error={errors.email}
          required
        />

        <Input
          label="Contraseña"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
          leadingIcon={Lock}
          placeholder="Mínimo 6 caracteres"
          error={errors.password}
          required
        />

        <Input
          label={copy.auth.onboarding.client.phonelabel}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: "" })); }}
          leadingIcon={Phone}
          placeholder="+57 300 000 0000"
          error={errors.phone}
          required
        />

        <div>
          <p className="eyebrow text-stone-500 mb-2">
            {copy.auth.onboarding.client.zoneLabel}
          </p>
          {errors.zone && (
            <p className="text-xs text-amber-500 mb-2">{errors.zone}</p>
          )}
          <ChipGroup aria-label="Zona de Bogotá">
            {ZONES.map((z) => (
              <Chip
                key={z}
                active={zone === z}
                onClick={() => { setZone(z); setErrors((p) => ({ ...p, zone: "" })); }}
              >
                {z}
              </Chip>
            ))}
          </ChipGroup>
        </div>
      </div>
    </AuthLayout>
  );
}
