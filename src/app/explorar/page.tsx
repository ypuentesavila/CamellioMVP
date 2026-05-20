"use client";

import { Suspense, useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import {
  Search, MapPin, SlidersHorizontal, X, ChevronDown, Award, CheckCircle2,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileFooter } from "@/components/layout/MobileFooter";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Avatar } from "@/components/ui/Avatar";
import { Stars } from "@/components/ui/Stars";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { JobCard } from "@/components/features/jobs/JobCard";
import { ApplyModal } from "@/components/features/jobs/ApplyModal";
import { categories } from "@/data/categories";
import { formatCOPShort } from "@/lib/format";
import { api } from "@/lib/api";
import { useSimulatedLoading } from "@/hooks/useSimulatedLoading";
import { useAuth, useJobs } from "@/context";
import { cn } from "@/lib/utils";
import type { User, Job } from "@/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CATEGORY_NAMES: Record<string, string> = {
  plomeria: "Plomería", electricidad: "Electricidad", carpinteria: "Carpintería",
  pintura: "Pintura", limpieza: "Limpieza", mudanzas: "Mudanzas",
  cerrajeria: "Cerrajería", fumigacion: "Fumigación",
};

function verificationLevel(w: User): 1 | 2 | 3 {
  if ((w.workerProfile?.rating ?? 0) >= 4.8 && (w.workerProfile?.reviewCount ?? 0) >= 30) return 3;
  if (w.workerProfile?.verified) return 2;
  return 1;
}

// ─── Sort options ──────────────────────────────────────────────────────────────

type SortId = "relevancia" | "mejor" | "economico" | "trabajos";

const SORTS: { id: SortId; label: string; hint: string }[] = [
  { id: "relevancia", label: "Recomendados",      hint: "Mezcla rating, disponibilidad y experiencia" },
  { id: "mejor",      label: "Mejor calificados", hint: "Por rating y reseñas" },
  { id: "economico",  label: "Más económicos",    hint: "Por tarifa/hora" },
  { id: "trabajos",   label: "Más experiencia",   hint: "Por trabajos completados" },
];

// ─── Worker card ──────────────────────────────────────────────────────────────

function AvailBadge({ available }: { available: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[11.5px] font-semibold", available ? "text-forest-500" : "text-stone-400")}>
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", available ? "bg-forest-500 softpulse" : "bg-stone-300")} />
      {available ? "Disponible ahora" : "Esta semana"}
    </span>
  );
}

function LevelBadge({ level }: { level: 1 | 2 | 3 }) {
  if (level === 3) return (
    <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-ink text-marigold-300 px-1.5 py-0.5 rounded-full shrink-0">
      <Award className="w-2.5 h-2.5" /> Maestro
    </span>
  );
  if (level === 2) return (
    <span className="text-[9px] font-bold bg-forest-100 text-forest-600 px-1.5 py-0.5 rounded-full shrink-0">
      Verificado
    </span>
  );
  return null;
}

function WorkerCard({ w, onClick }: { w: User; onClick: () => void }) {
  const profile = w.workerProfile!;
  const level = verificationLevel(w);

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 bg-card rounded-[16px] border border-stone-200 hover:border-ink transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink group"
    >
      <div className="flex items-start gap-3.5">
        <div className="relative shrink-0">
          <Avatar name={w.name} size="md" />
          {profile.available && (
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-forest-500 rounded-full ring-2 ring-card softpulse" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <p className="text-sm font-bold text-ink truncate">{w.name}</p>
            <LevelBadge level={level} />
          </div>

          <div className="flex items-center gap-1.5 mb-2 text-xs text-stone-500">
            <span className="font-semibold text-stone-600">
              {CATEGORY_NAMES[profile.category] ?? profile.category}
            </span>
            <span className="text-stone-300">·</span>
            <MapPin className="w-3 h-3 text-stone-400 shrink-0" strokeWidth={1.5} />
            <span className="truncate">{w.location.split(",")[0]}</span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Stars rating={profile.rating} count={profile.reviewCount} size="sm" />
            <span className="text-xs text-stone-400">·</span>
            <span className="text-xs font-semibold text-ink tnum">
              {formatCOPShort(profile.hourlyRate)}
              <span className="font-normal text-stone-400">/h</span>
            </span>
            <span className="text-xs text-stone-400">·</span>
            <span className="text-xs text-stone-500 tnum">{profile.completedJobs} trabajos</span>
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-end gap-2">
          <AvailBadge available={profile.available} />
          <div className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center group-hover:bg-ink transition-colors mt-auto">
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 group-hover:text-paper -rotate-90 transition-colors" />
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── Sort dropdown ────────────────────────────────────────────────────────────

function SortMenu({ value, onChange }: { value: SortId; onChange: (v: SortId) => void }) {
  const [open, setOpen] = useState(false);
  const current = SORTS.find((s) => s.id === value) ?? SORTS[0];

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [open]);

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 bg-card text-sm font-medium text-ink hover:border-stone-400 transition-colors whitespace-nowrap"
      >
        <span className="text-stone-400 text-xs">Orden:</span>
        <span className="font-semibold">{current.label}</span>
        <ChevronDown className={cn("w-3.5 h-3.5 text-stone-400 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-60 bg-card border border-stone-200 rounded-2xl shadow-modal z-50 overflow-hidden py-1">
          {SORTS.map((s) => (
            <button
              key={s.id}
              onClick={() => { onChange(s.id); setOpen(false); }}
              className={cn(
                "w-full text-left px-4 py-2.5 flex items-start justify-between gap-3 hover:bg-stone-100 transition-colors",
                s.id === value && "bg-stone-100"
              )}
            >
              <div>
                <p className="text-sm font-semibold text-ink">{s.label}</p>
                <p className="text-xs text-stone-400 mt-0.5">{s.hint}</p>
              </div>
              {s.id === value && <span className="text-forest-500 text-sm mt-0.5 shrink-0">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Sign-up gate modal ───────────────────────────────────────────────────────

function SignupGate({ worker, onClose }: { worker: User; onClose: () => void }) {
  const router = useRouter();
  const profile = worker.workerProfile!;
  const level = verificationLevel(worker);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-card rounded-3xl p-6 shadow-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <p className="eyebrow text-marigold-400">Crea tu cuenta</p>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3 p-3 bg-paper rounded-2xl border border-stone-200 mb-5">
          <Avatar name={worker.name} size="md" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-ink truncate">{worker.name}</span>
              <LevelBadge level={level} />
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              {CATEGORY_NAMES[profile.category]} · ⭐ {profile.rating} ({profile.reviewCount})
            </p>
          </div>
          <span className="text-sm font-bold text-ink shrink-0">{formatCOPShort(profile.hourlyRate)}/h</span>
        </div>

        <h3 className="text-[20px] font-bold tracking-tight mb-2">
          Para ver el perfil completo y <span className="serif">contactar.</span>
        </h3>
        <p className="text-sm text-stone-500 leading-relaxed mb-4">
          Crear cuenta es gratis y toma menos de 2 minutos. Solo pides cuando lo necesitas — sin suscripciones.
        </p>

        <ul className="flex flex-col gap-2 mb-5">
          {[
            "Portafolio y fotos reales del trabajador",
            "Chat directo con precio confirmado",
            "Garantía Camellio de 30 días",
          ].map((line) => (
            <li key={line} className="flex gap-2.5 text-sm text-ink items-start">
              <span className="text-forest-500 font-bold shrink-0 mt-0.5">✓</span>
              {line}
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-2">
          <Button variant="marigold" size="lg" className="w-full" onClick={() => router.push("/registro")}>
            Crear cuenta (gratis)
          </Button>
          <Button variant="outline" size="lg" className="w-full" onClick={onClose}>
            Seguir explorando
          </Button>
        </div>
        <p className="text-xs text-stone-400 text-center mt-3">
          ¿Ya tienes cuenta?{" "}
          <button onClick={() => router.push("/login")} className="text-marigold-400 font-semibold">
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  );
}

// ─── Category chips ───────────────────────────────────────────────────────────

function CategoryChips({
  activeCategory,
  setCategory,
}: {
  activeCategory: string | null;
  setCategory: (v: string | null) => void;
}) {
  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 pb-3 w-max">
        <button
          onClick={() => setCategory(null)}
          className={cn(
            "shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors border",
            !activeCategory ? "bg-ink text-paper border-ink" : "bg-card text-stone-500 border-stone-200 hover:border-stone-400"
          )}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(activeCategory === cat.slug ? null : cat.slug)}
            className={cn(
              "shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border whitespace-nowrap",
              activeCategory === cat.slug ? "bg-ink text-paper border-ink" : "bg-card text-stone-500 border-stone-200 hover:border-stone-400"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

type VerifFilter = "cualquiera" | "verificado" | "maestro";
type AvailFilter = "cualquiera" | "ahora" | "esta_sem";
type UrgencyFilter = "todos" | "urgent" | "this_week" | "flexible";

const URGENCY_LABELS: Record<string, string> = {
  todos: "Todos", urgent: "Urgente", this_week: "Esta semana", flexible: "Flexible",
};

function ExplorarContent() {
  const searchParams = useSearchParams();
  const loading = useSimulatedLoading(600);
  const { isAuthenticated, isWorker } = useAuth();
  const { jobs } = useJobs();

  const [query, setQuery]               = useState("");
  const [activeCategory, setCategory]   = useState<string | null>(searchParams.get("categoria"));
  const [allWorkers, setAllWorkers]     = useState<User[]>([]);

  useEffect(() => {
    api.get<User[]>('/workers').then(setAllWorkers).catch(() => {});
  }, []);

  // Workers view
  const [sort, setSort]                 = useState<SortId>("relevancia");
  const [avail, setAvail]               = useState<AvailFilter>("cualquiera");
  const [verifMin, setVerifMin]         = useState<VerifFilter>("cualquiera");
  const [showFilters, setShowFilters]   = useState(false);
  const [gateWorker, setGateWorker]     = useState<User | null>(null);
  const [guestBanner, setGuestBanner]   = useState(true);

  // Worker (jobs) view
  const [urgency, setUrgency]           = useState<UrgencyFilter>("todos");
  const [selectedJob, setSelectedJob]   = useState<Job | null>(null);

  useEffect(() => {
    const cat = searchParams.get("categoria");
    if (cat) setCategory(cat);
  }, [searchParams]);

  const filteredWorkers = useMemo(() => {
    const workerUsers = allWorkers.filter((w) => w.role === "worker" && w.workerProfile);
    let list = workerUsers.filter((w) => {
      const p = w.workerProfile!;
      if (activeCategory && p.category !== activeCategory) return false;
      if (avail === "ahora"    && !p.available) return false;
      if (avail === "esta_sem" && p.available)  return false;
      const level = verificationLevel(w);
      if (verifMin === "verificado" && level < 2) return false;
      if (verifMin === "maestro"    && level < 3) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const name   = w.name.toLowerCase();
        const zone   = w.location.toLowerCase();
        const cat    = (CATEGORY_NAMES[p.category] ?? "").toLowerCase();
        const skills = (p.skills ?? []).join(" ").toLowerCase();
        if (!name.includes(q) && !zone.includes(q) && !cat.includes(q) && !skills.includes(q)) return false;
      }
      return true;
    });
    const sorters: Record<SortId, (a: User, b: User) => number> = {
      relevancia: (a, b) => {
        const score = (u: User) => {
          const p = u.workerProfile!;
          return p.rating * 1.4 + (p.available ? 0.8 : 0) + Math.min(p.completedJobs / 50, 1) * 0.4;
        };
        return score(b) - score(a);
      },
      mejor:     (a, b) => b.workerProfile!.rating - a.workerProfile!.rating,
      economico: (a, b) => a.workerProfile!.hourlyRate - b.workerProfile!.hourlyRate,
      trabajos:  (a, b) => b.workerProfile!.completedJobs - a.workerProfile!.completedJobs,
    };
    return [...list].sort(sorters[sort]);
  }, [allWorkers, query, activeCategory, avail, verifMin, sort]);

  const filteredJobs = useMemo(() => {
    return jobs
      .filter((j) => {
        if (j.status !== "open") return false;
        if (activeCategory && j.category !== activeCategory) return false;
        if (urgency !== "todos" && j.urgency !== urgency) return false;
        if (query.trim()) {
          const q = query.toLowerCase();
          if (
            !j.title.toLowerCase().includes(q) &&
            !j.location.toLowerCase().includes(q) &&
            !(CATEGORY_NAMES[j.category] ?? "").toLowerCase().includes(q)
          ) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const order: Record<string, number> = { urgent: 0, this_week: 1, flexible: 2 };
        return (order[a.urgency] ?? 1) - (order[b.urgency] ?? 1);
      });
  }, [jobs, query, activeCategory, urgency]);

  const activeFilters = useMemo(() => {
    const chips: { key: string; label: string; clear: () => void }[] = [];
    if (avail !== "cualquiera") chips.push({
      key: "avail",
      label: avail === "ahora" ? "Disponible ahora" : "Esta semana",
      clear: () => setAvail("cualquiera"),
    });
    if (verifMin !== "cualquiera") chips.push({
      key: "verif",
      label: verifMin === "maestro" ? "Solo Maestros" : "Verificados+",
      clear: () => setVerifMin("cualquiera"),
    });
    return chips;
  }, [avail, verifMin]);

  const handleWorkerClick = useCallback((w: User) => {
    if (isAuthenticated) {
      window.location.href = `/perfil/${w.id}`;
    } else {
      setGateWorker(w);
    }
  }, [isAuthenticated]);

  const clearAll = () => { setAvail("cualquiera"); setVerifMin("cualquiera"); };
  const sortLabel = SORTS.find((s) => s.id === sort)?.label.toLowerCase() ?? sort;

  // ── Worker view: browse open jobs from backend ─────────────────────────────
  if (isWorker) {
    return (
      <div className="min-h-screen bg-paper pb-20">
        <Navbar />

        <div className="sticky top-16 z-40 bg-paper/95 backdrop-blur-sm border-b border-stone-200 shadow-nav">
          <div className="max-w-2xl mx-auto px-4 pt-4 pb-0">
            <div className="relative mb-3">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por título, zona u oficio…"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-card text-sm text-ink placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-ink focus:border-ink transition-colors"
              />
            </div>

            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 pb-3 w-max">
                {(["todos", "urgent", "this_week", "flexible"] as UrgencyFilter[]).map((u) => (
                  <button
                    key={u}
                    onClick={() => setUrgency(u)}
                    className={cn(
                      "shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors border whitespace-nowrap",
                      urgency === u ? "bg-ink text-paper border-ink" : "bg-card text-stone-500 border-stone-200 hover:border-stone-400"
                    )}
                  >
                    {URGENCY_LABELS[u]}
                  </button>
                ))}
                <div className="w-px bg-stone-200 mx-1 self-stretch" />
                <CategoryChips activeCategory={activeCategory} setCategory={setCategory} />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 pt-5 pb-20">
          {loading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-5 bg-card rounded-[16px] border border-stone-200 flex flex-col gap-3">
                  <Skeleton className="h-3.5 w-20 rounded" />
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <Skeleton className="h-3 w-1/2 rounded" />
                </div>
              ))}
            </div>
          ) : filteredJobs.length === 0 ? (
            <EmptyState
              icon={SlidersHorizontal}
              eyebrow="Sin resultados"
              title="No hay trabajos con esos filtros"
              description="Prueba con otra categoría o quita los filtros."
              action={{ label: "Ver todos", onClick: () => { setQuery(""); setCategory(null); setUrgency("todos"); }, variant: "outline" }}
            />
          ) : (
            <>
              <p className="text-xs text-stone-400 mb-4">
                <span className="font-semibold text-stone-600">{filteredJobs.length}</span>{" "}
                trabajo{filteredJobs.length !== 1 ? "s" : ""} disponible{filteredJobs.length !== 1 ? "s" : ""}
                {activeCategory && <> en <span className="font-semibold text-ink">{CATEGORY_NAMES[activeCategory]}</span></>}
              </p>
              <div className="flex flex-col gap-3 animate-fade-in" key={activeCategory + urgency + query}>
                {filteredJobs.map((j) => (
                  <JobCard key={j.id} job={j} variant="full" onApply={setSelectedJob} />
                ))}
              </div>
            </>
          )}
        </div>

        <ApplyModal job={selectedJob} onClose={() => setSelectedJob(null)} />
        <BottomNav />
      </div>
    );
  }

  // ── Guest / employer view: browse workers ──────────────────────────────────
  return (
    <div className="min-h-screen bg-paper">
      <Header />

      {!isAuthenticated && guestBanner && (
        <div className="max-w-2xl mx-auto px-4 pt-4">
          <div className="flex items-start gap-3 px-4 py-3 bg-azulejo-100 border border-azulejo-200 rounded-2xl">
            <CheckCircle2 className="w-5 h-5 text-azulejo-500 shrink-0 mt-0.5" strokeWidth={1.75} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink">Explorando como invitado</p>
              <p className="text-xs text-stone-500 mt-0.5">
                Crea una cuenta para ver perfiles completos, chatear y publicar solicitudes.
              </p>
            </div>
            <button
              onClick={() => setGuestBanner(false)}
              className="shrink-0 w-6 h-6 flex items-center justify-center text-stone-400 hover:text-ink transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <div className="sticky top-[68px] z-40 bg-paper/95 backdrop-blur-sm border-b border-stone-200 shadow-nav">
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-0">
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Oficio, nombre, zona o habilidad…"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-card text-sm text-ink placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-ink focus:border-ink transition-colors"
              />
            </div>
            <SortMenu value={sort} onChange={setSort} />
            <button
              onClick={() => setShowFilters((p) => !p)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-colors whitespace-nowrap",
                showFilters || activeFilters.length > 0
                  ? "bg-ink text-paper border-ink"
                  : "bg-card text-stone-500 border-stone-200 hover:border-stone-400"
              )}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {activeFilters.length > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-marigold-300 text-ink">
                  {activeFilters.length}
                </span>
              )}
            </button>
          </div>

          <CategoryChips activeCategory={activeCategory} setCategory={setCategory} />

          {showFilters && (
            <div className="pb-4 border-t border-stone-100 pt-3 flex flex-col gap-4">
              <div>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Disponibilidad</p>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { id: "cualquiera" as const, label: "Cualquiera" },
                    { id: "ahora"      as const, label: "Disponible ahora" },
                    { id: "esta_sem"   as const, label: "Esta semana" },
                  ].map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setAvail(a.id)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors",
                        avail === a.id ? "bg-ink text-paper border-ink" : "bg-card text-stone-500 border-stone-200 hover:border-stone-400"
                      )}
                    >
                      {a.id === "ahora" && <span className="w-1.5 h-1.5 rounded-full bg-forest-500 softpulse" />}
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Verificación</p>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { id: "cualquiera" as const, label: "Cualquiera" },
                    { id: "verificado" as const, label: "Verificado+" },
                    { id: "maestro"    as const, label: "Solo Maestros" },
                  ].map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setVerifMin(v.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors",
                        verifMin === v.id ? "bg-ink text-paper border-ink" : "bg-card text-stone-500 border-stone-200 hover:border-stone-400"
                      )}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeFilters.length > 0 && (
            <div className="flex gap-2 pb-3 flex-wrap items-center">
              {activeFilters.map((f) => (
                <span
                  key={f.key}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-marigold-100 border border-marigold-200 text-marigold-500 text-xs font-semibold rounded-full"
                >
                  {f.label}
                  <button onClick={f.clear} className="text-marigold-400 hover:text-ink transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button onClick={clearAll} className="text-xs font-semibold text-stone-400 hover:text-ink transition-colors">
                Limpiar todo
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-5 pb-20">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-card rounded-[16px] border border-stone-200">
                <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                <div className="flex-1 flex flex-col gap-2">
                  <Skeleton className="h-3.5 w-32 rounded" />
                  <Skeleton className="h-3 w-48 rounded" />
                  <Skeleton className="h-3 w-24 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredWorkers.length === 0 ? (
          <EmptyState
            icon={SlidersHorizontal}
            eyebrow="Sin resultados"
            title="No hay trabajadores con esos filtros"
            description="Prueba con otros filtros o amplía la búsqueda."
            action={{ label: "Limpiar filtros", onClick: () => { setQuery(""); setCategory(null); clearAll(); }, variant: "outline" }}
          />
        ) : (
          <>
            <p className="text-xs text-stone-400 mb-4">
              <span className="font-semibold text-stone-600">{filteredWorkers.length}</span>{" "}
              trabajador{filteredWorkers.length !== 1 ? "es" : ""}
              {activeCategory && <> en <span className="font-semibold text-ink">{CATEGORY_NAMES[activeCategory]}</span></>}
              <span> · ordenado por {sortLabel}</span>
            </p>
            <div className="flex flex-col gap-3 animate-fade-in" key={sort + activeCategory + avail + verifMin}>
              {filteredWorkers.map((w) => (
                <WorkerCard key={w.id} w={w} onClick={() => handleWorkerClick(w)} />
              ))}
            </div>
          </>
        )}
      </div>

      {gateWorker && <SignupGate worker={gateWorker} onClose={() => setGateWorker(null)} />}
      <Footer /><MobileFooter />
    </div>
  );
}

export default function ExplorarPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-paper" />}>
      <ExplorarContent />
    </Suspense>
  );
}
