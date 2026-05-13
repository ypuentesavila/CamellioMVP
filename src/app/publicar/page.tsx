"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, DollarSign, MapPin } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/context";
import { useJobs } from "@/context";
import { categories } from "@/data/categories";
import { formatCOP } from "@/lib/format";
import { cn } from "@/lib/utils";

const neighborhoods = [
  "Chapinero", "Suba", "Kennedy", "Usaquén", "Engativá",
  "Teusaquillo", "Bosa", "Fontibón", "Barrios Unidos", "Puente Aranda",
  "La Candelaria", "Antonio Nariño",
];

const urgencyOptions = [
  { value: "urgent", label: "Urgente", desc: "Lo necesito hoy o mañana" },
  { value: "this_week", label: "Esta semana", desc: "En los próximos 7 días" },
  { value: "flexible", label: "Flexible", desc: "Sin fecha límite específica" },
] as const;

export default function PublicarPage() {
  const router = useRouter();
  const { user, isEmployer, isAuthenticated } = useAuth();
  const { createJob } = useJobs();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [urgency, setUrgency] = useState<"urgent" | "this_week" | "flexible">("flexible");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdJobId, setCreatedJobId] = useState<string | null>(null);

  // Redirect if not employer
  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
    else if (!isEmployer) router.replace("/dashboard/worker");
  }, [isAuthenticated, isEmployer, router]);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (title.trim().length < 10) errs.title = "Mínimo 10 caracteres";
    if (description.trim().length < 30) errs.description = "Mínimo 30 caracteres";
    if (!category) errs.category = "Selecciona una categoría";
    if (!location) errs.location = "Selecciona una ubicación";
    if (!budgetMin || Number(budgetMin) <= 0) errs.budgetMin = "Ingresa un presupuesto mínimo";
    if (!budgetMax || Number(budgetMax) <= 0) errs.budgetMax = "Ingresa un presupuesto máximo";
    if (Number(budgetMin) > Number(budgetMax)) errs.budgetMax = "El máximo debe ser mayor al mínimo";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    if (!validate() || !user) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));

    const newJob = createJob({
      employerId: user.id,
      title: title.trim(),
      description: description.trim(),
      category,
      location: `${location}, Bogotá`,
      budget: { min: Number(budgetMin), max: Number(budgetMax) },
      urgency,
    });

    setCreatedJobId(newJob.id);
    setSubmitting(false);
    setSuccess(true);
  }

  if (success && createdJobId) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <div className="bg-surface rounded-2xl border border-border p-8 max-w-sm w-full text-center shadow-card-hover">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-success" strokeWidth={1.75} />
            </div>
            <h1 className="text-xl font-bold text-text-primary mb-2">
              ¡Trabajo publicado!
            </h1>
            <p className="text-sm text-text-secondary mb-6 leading-relaxed">
              Los trabajadores podrán ver tu publicación y enviarte propuestas pronto.
            </p>
            <div className="flex flex-col gap-2">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => router.push(`/trabajos/${createdJobId}`)}
              >
                Ver mi publicación
              </Button>
              <Button
                variant="ghost"
                size="md"
                className="w-full"
                onClick={() => router.push("/dashboard/employer")}
              >
                Ir al dashboard
              </Button>
            </div>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <Navbar />

      {/* Back + header */}
      <div className="bg-surface border-b border-border">
        <PageShell className="py-4">
          <Link
            href="/dashboard/employer"
            className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Mi dashboard
          </Link>
          <h1 className="text-xl font-bold text-text-primary">Publicar trabajo</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Gratis · Sin comisiones ocultas
          </p>
        </PageShell>
      </div>

      <PageShell className="py-6">
        <div className="max-w-xl mx-auto flex flex-col gap-5">

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              ¿Qué necesitas?
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setErrors(p => ({ ...p, title: "" })); }}
              className={cn(
                "w-full px-3.5 py-2.5 rounded-xl border text-sm text-text-primary bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors",
                errors.title ? "border-danger" : "border-border"
              )}
              placeholder="Ej: Reparación de tubería en la cocina"
            />
            {errors.title && <p className="text-xs text-danger mt-1">{errors.title}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Categoría
            </label>
            {errors.category && <p className="text-xs text-danger mb-2">{errors.category}</p>}
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => { setCategory(cat.slug); setErrors(p => ({ ...p, category: "" })); }}
                  className={cn(
                    "flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all",
                    category === cat.slug
                      ? "border-primary bg-primary-light"
                      : "border-border bg-background hover:border-primary/40"
                  )}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="text-sm font-medium text-text-primary">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              Barrio
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
              <select
                value={location}
                onChange={(e) => { setLocation(e.target.value); setErrors(p => ({ ...p, location: "" })); }}
                className={cn(
                  "w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-text-primary bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors",
                  errors.location ? "border-danger" : "border-border"
                )}
              >
                <option value="">Selecciona tu barrio...</option>
                {neighborhoods.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            {errors.location && <p className="text-xs text-danger mt-1">{errors.location}</p>}
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              Presupuesto (COP)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                  <input
                    type="number"
                    value={budgetMin}
                    onChange={(e) => { setBudgetMin(e.target.value); setErrors(p => ({ ...p, budgetMin: "" })); }}
                    className={cn(
                      "w-full pl-8 pr-3 py-2.5 rounded-xl border text-sm text-text-primary bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors",
                      errors.budgetMin ? "border-danger" : "border-border"
                    )}
                    placeholder="Mínimo"
                    min={1}
                  />
                </div>
                {errors.budgetMin && <p className="text-xs text-danger mt-1">{errors.budgetMin}</p>}
                {budgetMin && Number(budgetMin) > 0 && <p className="text-xs text-text-secondary mt-1">{formatCOP(Number(budgetMin))}</p>}
              </div>
              <div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                  <input
                    type="number"
                    value={budgetMax}
                    onChange={(e) => { setBudgetMax(e.target.value); setErrors(p => ({ ...p, budgetMax: "" })); }}
                    className={cn(
                      "w-full pl-8 pr-3 py-2.5 rounded-xl border text-sm text-text-primary bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors",
                      errors.budgetMax ? "border-danger" : "border-border"
                    )}
                    placeholder="Máximo"
                    min={1}
                  />
                </div>
                {errors.budgetMax && <p className="text-xs text-danger mt-1">{errors.budgetMax}</p>}
                {budgetMax && Number(budgetMax) > 0 && <p className="text-xs text-text-secondary mt-1">{formatCOP(Number(budgetMax))}</p>}
              </div>
            </div>
          </div>

          {/* Urgency */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              ¿Con qué urgencia lo necesitas?
            </label>
            <div className="flex flex-col gap-2">
              {urgencyOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setUrgency(opt.value)}
                  className={cn(
                    "flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all",
                    urgency === opt.value
                      ? "border-primary bg-primary-light"
                      : "border-border bg-background hover:border-primary/40"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center",
                    urgency === opt.value ? "border-primary" : "border-border"
                  )}>
                    {urgency === opt.value && <div className="w-2 h-2 bg-primary rounded-full" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{opt.label}</p>
                    <p className="text-xs text-text-secondary">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              Descripción del trabajo
            </label>
            <textarea
              value={description}
              onChange={(e) => { setDescription(e.target.value); setErrors(p => ({ ...p, description: "" })); }}
              className={cn(
                "w-full px-3.5 py-2.5 rounded-xl border text-sm text-text-primary bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors resize-none leading-relaxed",
                errors.description ? "border-danger" : "border-border"
              )}
              placeholder="Describe el trabajo con detalle: qué necesitas, condiciones del lugar, materiales disponibles, acceso al inmueble..."
              rows={5}
            />
            <div className="flex items-start justify-between mt-1">
              <p className="text-xs text-danger">{errors.description ?? ""}</p>
              <p className={cn("text-xs ml-auto", description.length >= 30 ? "text-success" : "text-text-secondary")}>
                {description.length}/30 mín
              </p>
            </div>
          </div>

          {/* Submit */}
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            loading={submitting}
            className="w-full"
          >
            {submitting ? "Publicando trabajo..." : "Publicar trabajo"}
          </Button>

          <p className="text-xs text-text-secondary text-center">
            Publicar es gratis. Recibirás propuestas de trabajadores verificados en Bogotá.
          </p>
        </div>
      </PageShell>

      <BottomNav />
    </div>
  );
}
