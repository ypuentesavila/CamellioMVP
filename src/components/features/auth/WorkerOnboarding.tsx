"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Phone, Mail, CreditCard, CheckCircle2, Circle, Camera } from "lucide-react";
import { AuthLayout } from "./AuthLayout";
import { Input } from "@/components/ui/Input";
import { Chip, ChipGroup } from "@/components/ui/Chip";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { categories } from "@/data/categories";
import { copy } from "@/data/copy";
import { cn } from "@/lib/utils";

const ZONES = [
  "Usaquén", "Chapinero", "Santa Fe", "San Cristóbal",
  "Usme", "Tunjuelito", "Bosa", "Kennedy",
  "Fontibón", "Engativá", "Suba", "Barrios Unidos",
  "Teusaquillo", "Los Mártires", "Antonio Nariño",
  "Puente Aranda", "La Candelaria", "Rafael Uribe Uribe",
  "Ciudad Bolívar",
];

const EXPERIENCE_OPTIONS = ["1–2", "3–5", "6–10", "10+"];
const DAYS = ["L", "M", "X", "J", "V", "S", "D"];
const DAY_LABELS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

interface Step1Data {
  name: string;
  cedula: string;
  phone: string;
  email: string;
}

interface Step2Data {
  categoryIds: string[];
  zone: string;
}

interface Step3Data {
  experience: string;
  rate: number;
  days: number[];
}

export function WorkerOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Step 1
  const [s1, setS1] = useState<Step1Data>({ name: "", cedula: "", phone: "", email: "" });
  const [e1, setE1] = useState<Partial<Step1Data>>({});

  // Step 2
  const [s2, setS2] = useState<Step2Data>({ categoryIds: [], zone: "" });
  const [e2, setE2] = useState<Record<string, string>>({});

  // Step 3
  const [s3, setS3] = useState<Step3Data>({ experience: "", rate: 45000, days: [0, 1, 2, 3, 4] });
  const [e3, setE3] = useState<Partial<Record<keyof Step3Data, string>>>({});

  const [loading, setLoading] = useState(false);

  const s = copy.auth.onboarding.worker;

  function validateStep1() {
    const e: Partial<Step1Data> = {};
    if (!s1.name.trim()) e.name = copy.errors.required;
    if (!s1.cedula.trim()) e.cedula = copy.errors.required;
    if (!s1.phone.trim()) e.phone = copy.errors.required;
    else if (!/^[+\d\s\-()]{7,}$/.test(s1.phone.trim())) e.phone = copy.errors.invalidPhone;
    if (!s1.email.trim()) e.email = copy.errors.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s1.email.trim())) e.email = copy.errors.invalidEmail;
    return e;
  }

  function validateStep2() {
    const e: Record<string, string> = {};
    if (s2.categoryIds.length === 0) e.categoryIds = "Selecciona al menos un oficio.";
    if (!s2.zone) e.zone = "Selecciona tu zona.";
    return e;
  }

  function validateStep3() {
    const e: typeof e3 = {};
    if (!s3.experience) e.experience = "Selecciona años de experiencia.";
    if (s3.days.length === 0) e.days = "Selecciona al menos un día.";
    return e;
  }

  function handleBack() {
    if (step > 1) setStep((p) => p - 1);
  }

  function handleStep1Next() {
    const e = validateStep1();
    if (Object.keys(e).length) { setE1(e); return; }
    setStep(2);
  }

  function handleStep2Next() {
    const e = validateStep2();
    if (Object.keys(e).length) { setE2(e); return; }
    setStep(3);
  }

  function handleStep3Next() {
    const e = validateStep3();
    if (Object.keys(e).length) { setE3(e); return; }
    setStep(4);
  }

  async function handleFinish() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    router.push("/bienvenido");
  }

  function toggleDay(idx: number) {
    setS3((p) => ({
      ...p,
      days: p.days.includes(idx) ? p.days.filter((d) => d !== idx) : [...p.days, idx],
    }));
    setE3((p) => ({ ...p, days: "" }));
  }

  function toggleCategory(id: string) {
    setS2((p) => {
      const has = p.categoryIds.includes(id);
      if (!has && p.categoryIds.length >= 3) return p;
      return { ...p, categoryIds: has ? p.categoryIds.filter((c) => c !== id) : [...p.categoryIds, id] };
    });
    setE2((p) => ({ ...p, categoryIds: "" }));
  }

  const formatRate = (v: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v);

  return (
    <AuthLayout
      step={step}
      totalSteps={4}
      onBack={step > 1 ? handleBack : undefined}
      cta={
        step === 1 ? { label: copy.cta.continue, onClick: handleStep1Next } :
        step === 2 ? { label: copy.cta.continue, onClick: handleStep2Next } :
        step === 3 ? { label: copy.cta.continue, onClick: handleStep3Next } :
        { label: s.step4.cta, onClick: handleFinish, loading }
      }
    >
      {/* ── Step 1: Identidad ── */}
      {step === 1 && (
        <>
          <div className="mb-8">
            <p className="eyebrow text-stone-500 mb-2">{s.step1.eyebrow}</p>
            <h1 className="text-2xl font-bold text-ink tracking-tight">{s.step1.title}</h1>
          </div>

          <div className="flex flex-col gap-4">
            <Input
              label={s.step1.nameLabel}
              type="text"
              autoComplete="name"
              autoCapitalize="words"
              value={s1.name}
              onChange={(e) => { setS1((p) => ({ ...p, name: e.target.value })); setE1((p) => ({ ...p, name: "" })); }}
              leadingIcon={User}
              placeholder="Tu nombre completo"
              error={e1.name}
              required
            />

            <Input
              label={s.step1.cedulaLabel}
              type="text"
              inputMode="numeric"
              value={s1.cedula}
              onChange={(e) => { setS1((p) => ({ ...p, cedula: e.target.value })); setE1((p) => ({ ...p, cedula: "" })); }}
              leadingIcon={CreditCard}
              placeholder="Número de cédula"
              error={e1.cedula}
              required
            />

            <Input
              label={s.step1.phoneLabel}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={s1.phone}
              onChange={(e) => { setS1((p) => ({ ...p, phone: e.target.value })); setE1((p) => ({ ...p, phone: "" })); }}
              leadingIcon={Phone}
              placeholder="+57 300 000 0000"
              error={e1.phone}
              required
            />

            <Input
              label={s.step1.emailLabel}
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              value={s1.email}
              onChange={(e) => { setS1((p) => ({ ...p, email: e.target.value })); setE1((p) => ({ ...p, email: "" })); }}
              leadingIcon={Mail}
              placeholder="tu@correo.com"
              error={e1.email}
              required
            />

            <p className="text-xs text-stone-500 leading-snug bg-stone-100 rounded-xl px-4 py-3">
              {s.step1.privacyNote}
            </p>
          </div>
        </>
      )}

      {/* ── Step 2: Oficios + Zona ── */}
      {step === 2 && (
        <>
          <div className="mb-8">
            <p className="eyebrow text-stone-500 mb-2">{s.step2.eyebrow}</p>
            <h1 className="text-2xl font-bold text-ink tracking-tight">{s.step2.title}</h1>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <p className="eyebrow text-stone-500 mb-1">{s.step2.categoriesLabel}</p>
              <p className="text-xs text-stone-400 mb-3">{s.step2.categoriesHint}</p>
              {e2.categoryIds && (
                <p className="text-xs text-amber-500 mb-2">{e2.categoryIds}</p>
              )}
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => {
                  const active = s2.categoryIds.includes(cat.id);
                  const disabled = !active && s2.categoryIds.length >= 3;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      disabled={disabled}
                      onClick={() => toggleCategory(cat.id)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-150",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink",
                        active
                          ? "border-ink bg-ink text-paper"
                          : "border-stone-200 bg-card text-ink hover:border-stone-400",
                        disabled && "opacity-40 cursor-not-allowed"
                      )}
                    >
                      <CategoryIcon slug={cat.slug} size="sm" />
                      <span className="text-sm font-semibold">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="eyebrow text-stone-500 mb-2">{s.step2.zoneLabel}</p>
              {e2.zone && (
                <p className="text-xs text-amber-500 mb-2">{e2.zone}</p>
              )}
              <ChipGroup aria-label="Zona de trabajo">
                {ZONES.map((z) => (
                  <Chip
                    key={z}
                    active={s2.zone === z}
                    onClick={() => { setS2((p) => ({ ...p, zone: z })); setE2((p) => ({ ...p, zone: "" })); }}
                  >
                    {z}
                  </Chip>
                ))}
              </ChipGroup>
            </div>
          </div>
        </>
      )}

      {/* ── Step 3: Experiencia + Tarifa ── */}
      {step === 3 && (
        <>
          <div className="mb-8">
            <p className="eyebrow text-stone-500 mb-2">{s.step3.eyebrow}</p>
            <h1 className="text-2xl font-bold text-ink tracking-tight">{s.step3.title}</h1>
          </div>

          <div className="flex flex-col gap-6">
            {/* Experience segmented */}
            <div>
              <p className="eyebrow text-stone-500 mb-3">{s.step3.yearsLabel}</p>
              {e3.experience && (
                <p className="text-xs text-amber-500 mb-2">{e3.experience}</p>
              )}
              <div className="grid grid-cols-4 gap-2">
                {EXPERIENCE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => { setS3((p) => ({ ...p, experience: opt })); setE3((p) => ({ ...p, experience: "" })); }}
                    className={cn(
                      "py-3 rounded-xl border text-sm font-semibold transition-all duration-150",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink",
                      s3.experience === opt
                        ? "bg-ink text-paper border-ink"
                        : "bg-card text-ink border-stone-200 hover:border-stone-400"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <p className="text-xs text-stone-400 mt-2">años de experiencia</p>
            </div>

            {/* Rate slider */}
            <div>
              <div className="flex items-baseline justify-between mb-1">
                <p className="eyebrow text-stone-500">{s.step3.rateLabel}</p>
                <span className="text-base font-bold text-ink tnum">
                  {formatRate(s3.rate)}
                  <span className="text-xs font-normal text-stone-500">/h</span>
                </span>
              </div>
              <input
                type="range"
                min={20000}
                max={150000}
                step={5000}
                value={s3.rate}
                onChange={(e) => setS3((p) => ({ ...p, rate: Number(e.target.value) }))}
                className="w-full accent-ink"
                aria-label={s.step3.rateLabel}
              />
              <p className="text-xs text-stone-400 mt-1">{s.step3.rateBenchmark}</p>
            </div>

            {/* Days */}
            <div>
              <p className="eyebrow text-stone-500 mb-3">{s.step3.availabilityLabel}</p>
              {e3.days && (
                <p className="text-xs text-amber-500 mb-2">{e3.days}</p>
              )}
              <div className="flex gap-2">
                {DAYS.map((d, i) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDay(i)}
                    aria-label={DAY_LABELS[i]}
                    aria-pressed={s3.days.includes(i)}
                    className={cn(
                      "flex-1 h-11 rounded-xl border text-sm font-semibold transition-all duration-150",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink",
                      s3.days.includes(i)
                        ? "bg-ink text-paper border-ink"
                        : "bg-card text-stone-500 border-stone-200 hover:border-stone-400"
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Step 4: Verificación ── */}
      {step === 4 && (
        <>
          <div className="mb-8">
            <p className="eyebrow text-stone-500 mb-2">{s.step4.eyebrow}</p>
            <h1 className="text-2xl font-bold text-ink tracking-tight">{s.step4.title}</h1>
          </div>

          <div className="flex flex-col gap-5">
            {/* Profile photo */}
            <div>
              <p className="eyebrow text-stone-500 mb-2">{s.step4.photoLabel}</p>
              <p className="text-xs text-stone-400 mb-3">{s.step4.photoHint}</p>
              <button
                type="button"
                className="w-full h-32 rounded-[16px] border-2 border-dashed border-stone-200 bg-card flex flex-col items-center justify-center gap-2 text-stone-400 hover:border-stone-400 hover:text-stone-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
              >
                <Camera className="w-6 h-6" strokeWidth={1.5} />
                <span className="text-xs font-medium">Subir foto</span>
              </button>
            </div>

            {/* Verification checklist */}
            <div className="flex flex-col gap-2">
              {[
                { label: s.step4.idCard, status: "done" as const },
                { label: s.step4.selfie, status: "current" as const },
                { label: s.step4.background, status: "pending" as const },
              ].map((item) => (
                <div
                  key={item.label}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-[16px] border",
                    item.status === "done" && "bg-forest-100 border-forest-100",
                    item.status === "current" && "bg-azulejo-100 border-azulejo-200",
                    item.status === "pending" && "bg-card border-stone-200"
                  )}
                >
                  {item.status === "done" ? (
                    <CheckCircle2 className="w-5 h-5 text-forest-500 shrink-0" strokeWidth={2} />
                  ) : item.status === "current" ? (
                    <div className="w-5 h-5 rounded-full border-2 border-azulejo-400 shrink-0 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-azulejo-400" />
                    </div>
                  ) : (
                    <Circle className="w-5 h-5 text-stone-300 shrink-0" strokeWidth={1.5} />
                  )}
                  <span
                    className={cn(
                      "text-sm font-semibold flex-1",
                      item.status === "done" && "text-forest-600",
                      item.status === "current" && "text-azulejo-600",
                      item.status === "pending" && "text-stone-400"
                    )}
                  >
                    {item.label}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      item.status === "done" && "text-forest-500",
                      item.status === "current" && "text-azulejo-500",
                      item.status === "pending" && "text-stone-300"
                    )}
                  >
                    {item.status === "done" ? s.step4.statusDone : item.status === "current" ? s.step4.statusCurrent : s.step4.statusPending}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-xs text-stone-400 leading-snug">
              La verificación puede tomar hasta 24 horas. Te avisamos por correo cuando esté lista.
            </p>
          </div>
        </>
      )}
    </AuthLayout>
  );
}
