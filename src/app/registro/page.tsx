"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Wrench,
  Building2,
  CheckCircle,
  User,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/context";
import { cn } from "@/lib/utils";
import { formatCOP } from "@/lib/format";

type Role = "worker" | "employer";

const neighborhoods = [
  "Chapinero",
  "Suba",
  "Kennedy",
  "Usaquén",
  "Engativá",
  "Teusaquillo",
  "Bosa",
  "Fontibón",
  "Barrios Unidos",
  "Puente Aranda",
  "La Candelaria",
  "Antonio Nariño",
];

const categories = [
  { id: "plomeria", label: "Plomería", icon: "🔧" },
  { id: "electricidad", label: "Electricidad", icon: "⚡" },
  { id: "carpinteria", label: "Carpintería", icon: "🪚" },
  { id: "pintura", label: "Pintura", icon: "🖌️" },
  { id: "limpieza", label: "Limpieza", icon: "🧹" },
  { id: "mudanzas", label: "Mudanzas", icon: "📦" },
  { id: "cerrajeria", label: "Cerrajería", icon: "🔑" },
  { id: "fumigacion", label: "Fumigación", icon: "🐛" },
];

// Progress bar
function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-1.5 flex-1 rounded-full transition-all duration-300",
            i < step ? "bg-primary" : "bg-border"
          )}
        />
      ))}
    </div>
  );
}

// Input wrapper
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-text-primary mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-danger mt-1">{error}</p>}
    </div>
  );
}

const inputCls = (err?: string) =>
  cn(
    "w-full px-3.5 py-2.5 rounded-xl border text-sm text-text-primary bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors",
    err ? "border-danger" : "border-border"
  );

export default function RegistroPage() {
  const router = useRouter();
  const { login, isAuthenticated, isWorker } = useAuth();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [category, setCategory] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [bio, setBio] = useState("");
  const [companyName, setCompanyName] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.replace(isWorker ? "/dashboard/worker" : "/dashboard/employer");
    }
  }, [isAuthenticated, isWorker, router]);

  function clearError(field: string) {
    setErrors((e) => ({ ...e, [field]: "" }));
  }

  // ── Step validators ──────────────────────────────────────────────────────────

  function validateStep2(): boolean {
    const errs: Record<string, string> = {};
    if (name.trim().length < 3) errs.name = "Mínimo 3 caracteres";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Email inválido";
    if (phone.trim().length < 7) errs.phone = "Número inválido";
    if (!neighborhood) errs.neighborhood = "Selecciona tu barrio";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function validateStep3(): boolean {
    const errs: Record<string, string> = {};
    if (role === "worker") {
      if (!category) errs.category = "Selecciona una categoría";
      if (!hourlyRate || Number(hourlyRate) <= 0) errs.hourlyRate = "Ingresa una tarifa válida";
      if (bio.trim().length < 30) errs.bio = "Mínimo 30 caracteres";
    } else {
      if (bio.trim().length < 20) errs.bio = "Mínimo 20 caracteres";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleStep2Next() {
    if (validateStep2()) setStep(3);
  }

  async function handleStep3Next() {
    if (!validateStep3()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitting(false);
    setStep(4);
  }

  function handleFinish() {
    // Log in as the matching demo user
    const demoId = role === "worker" ? "u1" : "u7";
    login(demoId);
    router.push(role === "worker" ? "/dashboard/worker" : "/dashboard/employer");
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-primary-mid to-background flex flex-col">
      {/* Minimal header */}
      <div className="px-4 py-4 flex items-center justify-between">
        <button
          onClick={() => (step > 1 ? setStep((s) => s - 1) : router.push("/"))}
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {step > 1 ? "Atrás" : "Volver"}
        </button>
        <span className="text-sm text-text-secondary">
          {step < 4 && `Paso ${step} de 3`}
        </span>
      </div>

      <div className="flex-1 flex items-start justify-center px-4 pb-12 pt-2">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-6">
            <span className="text-2xl font-bold text-primary">Camellio</span>
          </div>

          {/* Progress bar (steps 1-3) */}
          {step < 4 && (
            <div className="mb-6">
              <ProgressBar step={step} total={3} />
            </div>
          )}

          <div className="bg-surface rounded-2xl shadow-card-hover border border-border overflow-hidden">
            {/* ── Step 1: Role selection ── */}
            {step === 1 && (
              <div className="p-6">
                <h1 className="text-xl font-bold text-text-primary mb-1">
                  ¿Cómo quieres usar Camellio?
                </h1>
                <p className="text-sm text-text-secondary mb-6">
                  Elige tu rol para personalizar tu experiencia
                </p>

                <div className="flex flex-col gap-3">
                  {/* Worker card */}
                  <button
                    onClick={() => {
                      setRole("worker");
                      setStep(2);
                    }}
                    className={cn(
                      "flex items-start gap-4 p-5 rounded-xl border-2 transition-all text-left",
                      role === "worker"
                        ? "border-primary bg-primary-light"
                        : "border-border bg-background hover:border-primary hover:bg-primary-light/60"
                    )}
                  >
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shrink-0">
                      <Wrench className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-text-primary text-base">
                        Soy trabajador
                      </p>
                      <p className="text-sm text-text-secondary mt-0.5 leading-relaxed">
                        Ofrece tus servicios técnicos, conecta con clientes
                        cerca de ti y genera ingresos.
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {["Plomería", "Electricidad", "Pintura", "+5 más"].map(
                          (tag) => (
                            <span
                              key={tag}
                              className="text-xs bg-primary text-white px-2 py-0.5 rounded-full"
                            >
                              {tag}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-text-secondary shrink-0 mt-0.5" />
                  </button>

                  {/* Employer card */}
                  <button
                    onClick={() => {
                      setRole("employer");
                      setStep(2);
                    }}
                    className={cn(
                      "flex items-start gap-4 p-5 rounded-xl border-2 transition-all text-left",
                      role === "employer"
                        ? "border-primary bg-primary-light"
                        : "border-border bg-background hover:border-primary hover:bg-primary-light/60"
                    )}
                  >
                    <div className="w-12 h-12 bg-primary-dark rounded-xl flex items-center justify-center shrink-0">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-text-primary text-base">
                        Soy empleador
                      </p>
                      <p className="text-sm text-text-secondary mt-0.5 leading-relaxed">
                        Publica trabajos, encuentra profesionales verificados y
                        gestiona tus contrataciones.
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {["Publicar gratis", "Sin comisiones", "Califica"].map(
                          (tag) => (
                            <span
                              key={tag}
                              className="text-xs bg-primary-dark text-white px-2 py-0.5 rounded-full"
                            >
                              {tag}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-text-secondary shrink-0 mt-0.5" />
                  </button>
                </div>

                <p className="text-center text-sm text-text-secondary mt-5">
                  ¿Ya tienes cuenta?{" "}
                  <Link
                    href="/login"
                    className="text-primary font-semibold hover:underline"
                  >
                    Inicia sesión
                  </Link>
                </p>
              </div>
            )}

            {/* ── Step 2: Personal info ── */}
            {step === 2 && (
              <div className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center",
                      role === "worker" ? "bg-primary" : "bg-primary-dark"
                    )}
                  >
                    {role === "worker" ? (
                      <Wrench className="w-4 h-4 text-white" />
                    ) : (
                      <Building2 className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-text-primary leading-none">
                      Tu información básica
                    </h1>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {role === "worker" ? "Cuenta de trabajador" : "Cuenta de empleador"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <Field label="Nombre completo" error={errors.name}>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => { setName(e.target.value); clearError("name"); }}
                        className={cn(inputCls(errors.name), "pl-10")}
                        placeholder="Carlos Mendoza"
                        autoComplete="name"
                      />
                    </div>
                  </Field>

                  <Field label="Email" error={errors.email}>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
                        className={cn(inputCls(errors.email), "pl-10")}
                        placeholder="tu@email.com"
                        autoComplete="email"
                      />
                    </div>
                  </Field>

                  <Field label="Teléfono" error={errors.phone}>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => { setPhone(e.target.value); clearError("phone"); }}
                        className={cn(inputCls(errors.phone), "pl-10")}
                        placeholder="+57 310 000 0000"
                        autoComplete="tel"
                      />
                    </div>
                  </Field>

                  <Field label="Barrio en Bogotá" error={errors.neighborhood}>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                      <select
                        value={neighborhood}
                        onChange={(e) => { setNeighborhood(e.target.value); clearError("neighborhood"); }}
                        className={cn(inputCls(errors.neighborhood), "pl-10")}
                      >
                        <option value="">Selecciona tu barrio...</option>
                        {neighborhoods.map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                  </Field>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleStep2Next}
                  className="w-full mt-6"
                >
                  Continuar
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* ── Step 3: Role-specific info ── */}
            {step === 3 && role === "worker" && (
              <div className="p-6">
                <h1 className="text-lg font-bold text-text-primary mb-1">
                  Tu perfil profesional
                </h1>
                <p className="text-sm text-text-secondary mb-5">
                  Esta información ayuda a los empleadores a encontrarte
                </p>

                <div className="flex flex-col gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      Categoría principal
                    </label>
                    {errors.category && (
                      <p className="text-xs text-danger mb-2">{errors.category}</p>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => { setCategory(cat.id); clearError("category"); }}
                          className={cn(
                            "flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all",
                            category === cat.id
                              ? "border-primary bg-primary-light"
                              : "border-border bg-background hover:border-primary/40"
                          )}
                        >
                          <span className="text-xl">{cat.icon}</span>
                          <span className="text-sm font-medium text-text-primary">
                            {cat.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hourly rate */}
                  <Field label="Tarifa por hora (COP)" error={errors.hourlyRate}>
                    <div className="relative">
                      <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                      <input
                        type="number"
                        value={hourlyRate}
                        onChange={(e) => { setHourlyRate(e.target.value); clearError("hourlyRate"); }}
                        className={cn(inputCls(errors.hourlyRate), "pl-10")}
                        placeholder="25000"
                        min={1}
                      />
                    </div>
                    {hourlyRate && Number(hourlyRate) > 0 && (
                      <p className="text-xs text-text-secondary mt-1">
                        {formatCOP(Number(hourlyRate))} COP por hora
                      </p>
                    )}
                  </Field>

                  {/* Bio */}
                  <Field label="Descripción de tu trabajo" error={errors.bio}>
                    <textarea
                      value={bio}
                      onChange={(e) => { setBio(e.target.value); clearError("bio"); }}
                      className={cn(inputCls(errors.bio), "resize-none leading-relaxed")}
                      placeholder="Cuéntanos sobre tu experiencia, especialidades y qué te diferencia de otros profesionales..."
                      rows={4}
                    />
                    <div className="flex justify-end mt-1">
                      <span className={cn("text-xs", bio.length >= 30 ? "text-success" : "text-text-secondary")}>
                        {bio.length}/30 mín
                      </span>
                    </div>
                  </Field>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleStep3Next}
                  loading={submitting}
                  className="w-full mt-5"
                >
                  {submitting ? "Creando tu cuenta..." : "Crear cuenta"}
                </Button>
              </div>
            )}

            {step === 3 && role === "employer" && (
              <div className="p-6">
                <h1 className="text-lg font-bold text-text-primary mb-1">
                  Tu perfil de empleador
                </h1>
                <p className="text-sm text-text-secondary mb-5">
                  Información que verán los trabajadores
                </p>

                <div className="flex flex-col gap-4">
                  <Field label="Nombre de empresa (opcional)">
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className={cn(inputCls(), "pl-10")}
                        placeholder="Distribuciones Ejemplo S.A.S."
                      />
                    </div>
                  </Field>

                  <Field label="Descripción" error={errors.bio}>
                    <textarea
                      value={bio}
                      onChange={(e) => { setBio(e.target.value); clearError("bio"); }}
                      className={cn(inputCls(errors.bio), "resize-none leading-relaxed")}
                      placeholder="¿Qué tipo de trabajos necesitas? ¿Con qué frecuencia contratas? Esto genera más confianza en los trabajadores..."
                      rows={4}
                    />
                    <div className="flex justify-end mt-1">
                      <span className={cn("text-xs", bio.length >= 20 ? "text-success" : "text-text-secondary")}>
                        {bio.length}/20 mín
                      </span>
                    </div>
                  </Field>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleStep3Next}
                  loading={submitting}
                  className="w-full mt-5"
                >
                  {submitting ? "Creando tu cuenta..." : "Crear cuenta"}
                </Button>
              </div>
            )}

            {/* ── Step 4: Success ── */}
            {step === 4 && (
              <div className="p-8 flex flex-col items-center text-center">
                {/* Success animation */}
                <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-5">
                  <CheckCircle className="w-10 h-10 text-success" strokeWidth={1.75} />
                </div>

                <h1 className="text-2xl font-bold text-text-primary mb-2">
                  ¡Bienvenido a Camellio!
                </h1>

                {/* User preview */}
                <div className="flex items-center gap-3 bg-background rounded-xl px-4 py-3 mb-4 w-full">
                  <Avatar name={name} size="md" />
                  <div className="text-left">
                    <p className="font-semibold text-text-primary text-sm">{name}</p>
                    <p className="text-xs text-text-secondary">
                      {neighborhood}, Bogotá
                    </p>
                  </div>
                  <Badge
                    variant={role === "worker" ? "default" : "dark"}
                    size="sm"
                    className="ml-auto"
                  >
                    {role === "worker" ? "Trabajador" : "Empleador"}
                  </Badge>
                </div>

                <p className="text-sm text-text-secondary leading-relaxed mb-6 max-w-xs">
                  Tu cuenta está lista.{" "}
                  {role === "worker"
                    ? "Comienza explorando trabajos cerca de ti en Bogotá."
                    : "Publica tu primer trabajo y recibe propuestas en minutos."}
                </p>

                {/* What's next checklist */}
                <div className="w-full bg-background rounded-xl p-4 mb-6 text-left">
                  <p className="text-xs font-bold text-text-primary mb-3">
                    PRÓXIMOS PASOS
                  </p>
                  {(role === "worker"
                    ? [
                        "Completa tu perfil con foto",
                        "Explora trabajos disponibles",
                        "Envía tu primera propuesta",
                      ]
                    : [
                        "Publica tu primer trabajo",
                        "Recibe propuestas de trabajadores",
                        "Elige al candidato ideal",
                      ]
                  ).map((step, i) => (
                    <div key={step} className="flex items-center gap-2.5 py-1.5">
                      <div className="w-5 h-5 rounded-full bg-primary-light flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary">{i + 1}</span>
                      </div>
                      <p className="text-sm text-text-secondary">{step}</p>
                    </div>
                  ))}
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleFinish}
                  className="w-full"
                >
                  Ir a mi dashboard
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Legal note */}
          {step < 4 && (
            <p className="text-xs text-center text-text-secondary mt-4 px-4">
              Al registrarte aceptas nuestros{" "}
              <span className="underline cursor-pointer">Términos de uso</span> y{" "}
              <span className="underline cursor-pointer">Política de privacidad</span>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
