"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  MapPin,
  Camera,
  CheckCircle2,
  ArrowRight,
  Zap,
  Clock,
} from "lucide-react";
import { AuthLayout } from "@/components/features/auth/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { Mosaico } from "@/components/brand/Mosaico";
import { categories } from "@/data/categories";
import { copy } from "@/data/copy";
import { useAuth } from "@/context";
import { useJobs } from "@/context";
import { formatCOP } from "@/lib/format";
import { cn } from "@/lib/utils";

const ZONES = [
  "Usaquén", "Chapinero", "Santa Fe", "San Cristóbal", "Usme",
  "Tunjuelito", "Bosa", "Kennedy", "Fontibón", "Engativá",
  "Suba", "Barrios Unidos", "Teusaquillo", "Los Mártires",
  "Antonio Nariño", "Puente Aranda", "La Candelaria",
  "Rafael Uribe Uribe", "Ciudad Bolívar",
];

const URGENCY_OPTIONS = [
  { value: "urgent" as const, label: copy.jobs.post.step2.urgencyUrgent, desc: "Lo necesito hoy o mañana", icon: Zap, accent: "bg-amber-100 border-amber-200 text-amber-500" },
  { value: "this_week" as const, label: copy.jobs.post.step2.urgencyWeek, desc: "En los próximos 7 días", icon: Clock, accent: "bg-azulejo-100 border-azulejo-200 text-azulejo-500" },
  { value: "flexible" as const, label: copy.jobs.post.step2.urgencyFlexible, desc: "Sin fecha límite específica", icon: Clock, accent: "bg-stone-100 border-stone-200 text-stone-500" },
];

const CATEGORY_NAMES: Record<string, string> = {
  plomeria: "Plomería", electricidad: "Electricidad", carpinteria: "Carpintería",
  pintura: "Pintura", limpieza: "Limpieza", mudanzas: "Mudanzas",
  cerrajeria: "Cerrajería", fumigacion: "Fumigación",
};

export default function PublicarPage() {
  const router = useRouter();
  const { user, isAuthenticated, isEmployer } = useAuth();
  const { createJob } = useJobs();

  const [step, setStep] = useState(1);

  // Step 1
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [zone, setZone] = useState("");

  // Step 2
  const [budgetMin, setBudgetMin] = useState("80000");
  const [budgetMax, setBudgetMax] = useState("150000");
  const [urgency, setUrgency] = useState<"urgent" | "this_week" | "flexible">("flexible");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdJobId, setCreatedJobId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
    else if (!isEmployer) router.replace("/dashboard/worker");
  }, [isAuthenticated, isEmployer, router]);

  function validateStep1() {
    const e: Record<string, string> = {};
    if (title.trim().length < 10) e.title = copy.errors.minLength(10);
    if (!category) e.category = "Selecciona una categoría.";
    if (!zone) e.zone = "Selecciona tu zona.";
    if (description.trim().length > 0 && description.trim().length < 20)
      e.description = copy.errors.minLength(20);
    return e;
  }

  function validateStep2() {
    const e: Record<string, string> = {};
    const min = Number(budgetMin);
    const max = Number(budgetMax);
    if (!budgetMin || min <= 0) e.budgetMin = "Ingresa un mínimo.";
    if (!budgetMax || max <= 0) e.budgetMax = "Ingresa un máximo.";
    if (min > 0 && max > 0 && min > max) e.budgetMax = "El máximo debe ser mayor al mínimo.";
    return e;
  }

  function handleStep1Next() {
    const e = validateStep1();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep(2);
  }

  function handleStep2Next() {
    const e = validateStep2();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep(3);
  }

  async function handlePublish() {
    if (!user) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));

    const newJob = createJob({
      employerId: user.id,
      title: title.trim(),
      description: description.trim() || `Solicitud de ${CATEGORY_NAMES[category] ?? category} en ${zone}`,
      category,
      location: `${zone}, Bogotá`,
      budget: { min: Number(budgetMin), max: Number(budgetMax) },
      urgency,
    });

    setCreatedJobId(newJob.id);
    setSubmitting(false);
    setSuccess(true);
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (success && createdJobId) {
    return (
      <div className="min-h-screen bg-ink flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <Mosaico density="med" />
        </div>
        <div className="relative z-10 flex flex-col flex-1 justify-center px-4 max-w-sm mx-auto w-full">
          <div className="w-16 h-16 rounded-2xl bg-forest-500/20 border border-forest-500/30 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-forest-100" strokeWidth={1.75} />
          </div>
          <p className="eyebrow text-marigold-300 mb-2">{copy.auth.welcome.eyebrow}</p>
          <h1 className="text-2xl font-bold text-paper tracking-tight mb-3">
            Solicitud publicada
          </h1>
          <p className="text-sm text-paper/60 leading-relaxed mb-8">
            Los trabajadores verificados en tu zona ya pueden ver tu solicitud. Recibirás propuestas pronto.
          </p>
          <div className="flex flex-col gap-3">
            <Button
              variant="marigold"
              size="lg"
              className="w-full"
              onClick={() => router.push(`/trabajos/${createdJobId}`)}
            >
              Ver mi solicitud
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full border-paper/30 text-paper hover:bg-paper/10"
              onClick={() => router.push("/dashboard/employer")}
            >
              Ir al panel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const c = copy.jobs.post;

  return (
    <AuthLayout
      step={step}
      totalSteps={3}
      onBack={step > 1 ? () => setStep((s) => s - 1) : undefined}
      backHref={step === 1 ? "/dashboard/employer" : undefined}
      cta={
        step === 1 ? { label: copy.cta.continue, onClick: handleStep1Next } :
        step === 2 ? { label: copy.cta.continue, onClick: handleStep2Next } :
        { label: c.step3.cta, onClick: handlePublish, loading: submitting }
      }
    >
      {/* ── Step 1: ¿Qué necesitas? ── */}
      {step === 1 && (
        <>
          <div className="mb-8">
            <p className="eyebrow text-stone-500 mb-2">{c.eyebrow}</p>
            <h1 className="text-2xl font-bold text-ink tracking-tight">{c.step1.title}</h1>
          </div>

          <div className="flex flex-col gap-5">
            {/* Title */}
            <Input
              label={c.step1.titleLabel}
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: "" })); }}
              leadingIcon={FileText}
              placeholder="Ej: Reparación de tubería en la cocina"
              error={errors.title}
              required
            />

            {/* Category grid */}
            <div>
              <p className="eyebrow text-stone-500 mb-2">{c.step1.categoryLabel}</p>
              {errors.category && <p className="text-xs text-amber-500 mb-2">{errors.category}</p>}
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => { setCategory(cat.slug); setErrors((p) => ({ ...p, category: "" })); }}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-150",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink",
                      category === cat.slug
                        ? "bg-ink text-paper border-ink"
                        : "bg-card border-stone-200 hover:border-stone-400"
                    )}
                  >
                    <CategoryIcon slug={cat.slug} size="sm" />
                    <span className={cn("text-sm font-semibold", category === cat.slug ? "text-paper" : "text-ink")}>
                      {cat.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Zone */}
            <div>
              <p className="eyebrow text-stone-500 mb-2">{c.step1.locationLabel}</p>
              {errors.zone && <p className="text-xs text-amber-500 mb-2">{errors.zone}</p>}
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                <select
                  value={zone}
                  onChange={(e) => { setZone(e.target.value); setErrors((p) => ({ ...p, zone: "" })); }}
                  className={cn(
                    "w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-ink bg-card",
                    "focus:outline-none focus:ring-2 focus:ring-ink focus:border-ink transition-colors",
                    errors.zone ? "border-amber-500" : "border-stone-200"
                  )}
                >
                  <option value="">Selecciona tu localidad...</option>
                  {ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
                </select>
              </div>
            </div>

            {/* Description (optional) */}
            <div>
              <p className="eyebrow text-stone-500 mb-2">
                {c.step1.descriptionLabel}
              </p>
              <div className="bg-azulejo-100/60 rounded-xl px-4 py-2.5 mb-2">
                <p className="text-xs text-azulejo-600 leading-snug">{c.step1.aiHint}</p>
              </div>
              <textarea
                value={description}
                onChange={(e) => { setDescription(e.target.value); setErrors((p) => ({ ...p, description: "" })); }}
                className={cn(
                  "w-full px-4 py-3 rounded-xl border text-sm text-ink bg-card",
                  "focus:outline-none focus:ring-2 focus:ring-ink focus:border-ink transition-colors resize-none leading-relaxed placeholder:text-stone-400",
                  errors.description ? "border-amber-500" : "border-stone-200"
                )}
                placeholder="Describe el problema con detalle: qué pasó, condiciones del lugar..."
                rows={4}
              />
              {errors.description && (
                <p className="text-xs text-amber-500 mt-1">{errors.description}</p>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Step 2: Cuánto y cuándo ── */}
      {step === 2 && (
        <>
          <div className="mb-8">
            <p className="eyebrow text-stone-500 mb-2">{c.eyebrow}</p>
            <h1 className="text-2xl font-bold text-ink tracking-tight">{c.step2.title}</h1>
          </div>

          <div className="flex flex-col gap-6">
            {/* Budget */}
            <div>
              <p className="eyebrow text-stone-500 mb-3">{c.step2.budgetLabel}</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="number"
                    value={budgetMin}
                    onChange={(e) => { setBudgetMin(e.target.value); setErrors((p) => ({ ...p, budgetMin: "" })); }}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl border text-sm text-ink bg-card tnum",
                      "focus:outline-none focus:ring-2 focus:ring-ink focus:border-ink transition-colors",
                      errors.budgetMin ? "border-amber-500" : "border-stone-200"
                    )}
                    placeholder="Mínimo"
                    min={1}
                  />
                  {errors.budgetMin && <p className="text-xs text-amber-500 mt-1">{errors.budgetMin}</p>}
                  {Number(budgetMin) > 0 && (
                    <p className="text-xs text-stone-400 mt-1 tnum">{formatCOP(Number(budgetMin))}</p>
                  )}
                </div>
                <div>
                  <input
                    type="number"
                    value={budgetMax}
                    onChange={(e) => { setBudgetMax(e.target.value); setErrors((p) => ({ ...p, budgetMax: "" })); }}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl border text-sm text-ink bg-card tnum",
                      "focus:outline-none focus:ring-2 focus:ring-ink focus:border-ink transition-colors",
                      errors.budgetMax ? "border-amber-500" : "border-stone-200"
                    )}
                    placeholder="Máximo"
                    min={1}
                  />
                  {errors.budgetMax && <p className="text-xs text-amber-500 mt-1">{errors.budgetMax}</p>}
                  {Number(budgetMax) > 0 && (
                    <p className="text-xs text-stone-400 mt-1 tnum">{formatCOP(Number(budgetMax))}</p>
                  )}
                </div>
              </div>
              <p className="text-xs text-stone-400 mt-2">{c.step2.budgetBenchmark}</p>
            </div>

            {/* Urgency */}
            <div>
              <p className="eyebrow text-stone-500 mb-3">{c.step2.urgencyLabel}</p>
              <div className="flex flex-col gap-2">
                {URGENCY_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const active = urgency === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setUrgency(opt.value)}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-150",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink",
                        active ? "bg-ink border-ink" : "bg-card border-stone-200 hover:border-stone-400"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-xl shrink-0 flex items-center justify-center",
                        active ? "bg-paper/20" : opt.accent.split(" ")[0]
                      )}>
                        <Icon className={cn("w-4 h-4", active ? "text-paper" : opt.accent.split(" ")[2])} strokeWidth={1.75} />
                      </div>
                      <div>
                        <p className={cn("text-sm font-semibold", active ? "text-paper" : "text-ink")}>{opt.label}</p>
                        <p className={cn("text-xs", active ? "text-paper/60" : "text-stone-400")}>{opt.desc}</p>
                      </div>
                      <div className={cn(
                        "ml-auto w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center",
                        active ? "border-paper" : "border-stone-300"
                      )}>
                        {active && <div className="w-2 h-2 rounded-full bg-paper" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Photos (placeholder) */}
            <div>
              <p className="eyebrow text-stone-500 mb-1">{c.step2.photosLabel}</p>
              <p className="text-xs text-stone-400 mb-3">{c.step2.photosHint}</p>
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <button
                    key={i}
                    type="button"
                    className="w-20 h-20 rounded-xl border-2 border-dashed border-stone-200 bg-card flex flex-col items-center justify-center gap-1 text-stone-400 hover:border-stone-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                  >
                    <Camera className="w-5 h-5" strokeWidth={1.5} />
                    <span className="text-[10px]">{i === 0 ? "Agregar" : ""}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Step 3: Confirma ── */}
      {step === 3 && (
        <>
          <div className="mb-8">
            <p className="eyebrow text-stone-500 mb-2">{c.eyebrow}</p>
            <h1 className="text-2xl font-bold text-ink tracking-tight">{c.step3.title}</h1>
          </div>

          {/* Summary card */}
          <div className="bg-card border border-stone-200 rounded-[16px] overflow-hidden mb-4">
            <div className="bg-ink px-4 py-3 flex items-center gap-3">
              <CategoryIcon slug={category} size="sm" />
              <span className="text-sm font-bold text-paper">{CATEGORY_NAMES[category] ?? category}</span>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div>
                <p className="text-[10px] text-stone-400 uppercase tracking-wide mb-0.5">Solicitud</p>
                <p className="text-sm font-semibold text-ink">{title}</p>
                {description && (
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">{description}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-stone-100">
                <div>
                  <p className="text-[10px] text-stone-400 uppercase tracking-wide mb-0.5">Zona</p>
                  <p className="text-sm font-semibold text-ink">{zone}</p>
                </div>
                <div>
                  <p className="text-[10px] text-stone-400 uppercase tracking-wide mb-0.5">Urgencia</p>
                  <p className="text-sm font-semibold text-ink">
                    {URGENCY_OPTIONS.find((u) => u.value === urgency)?.label}
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-stone-100">
                <p className="text-[10px] text-stone-400 uppercase tracking-wide mb-0.5">Presupuesto</p>
                <p className="text-sm font-bold text-ink tnum">
                  {formatCOP(Number(budgetMin))} – {formatCOP(Number(budgetMax))}
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-stone-400 text-center">{c.step3.liveTime}</p>
        </>
      )}
    </AuthLayout>
  );
}
