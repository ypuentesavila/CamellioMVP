"use client";

import { Suspense, useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Avatar } from "@/components/ui/Avatar";
import { Stars } from "@/components/ui/Stars";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { categories } from "@/data/categories";
import { workers } from "@/data/users";
import { formatCOP } from "@/lib/format";
import { useSimulatedLoading } from "@/hooks/useSimulatedLoading";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

const CATEGORY_NAMES: Record<string, string> = {
  plomeria: "Plomería",
  electricidad: "Electricidad",
  carpinteria: "Carpintería",
  pintura: "Pintura",
  limpieza: "Limpieza",
  mudanzas: "Mudanzas",
  cerrajeria: "Cerrajería",
  fumigacion: "Fumigación",
};

function verificationLevel(w: User) {
  if ((w.workerProfile?.rating ?? 0) >= 4.8 && (w.workerProfile?.reviewCount ?? 0) >= 30) return 3;
  if (w.workerProfile?.verified) return 2;
  return 1;
}

function WorkerCard({ w }: { w: User }) {
  const profile = w.workerProfile!;
  const level = verificationLevel(w);

  return (
    <Link
      href={`/perfil/${w.id}`}
      className="flex items-center gap-4 p-4 bg-card rounded-[16px] border border-stone-200 hover:border-ink transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink group"
    >
      <div className="relative shrink-0">
        <Avatar name={w.name} size="md" />
        {profile.available && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-forest-500 rounded-full ring-2 ring-card" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-bold text-ink truncate">{w.name}</p>

          {level === 3 && (
            <span className="text-[9px] font-bold bg-ink text-marigold-300 px-1.5 py-0.5 rounded-full shrink-0">
              Maestro
            </span>
          )}

          {level === 2 && (
            <span className="text-[9px] font-bold bg-forest-100 text-forest-600 px-1.5 py-0.5 rounded-full shrink-0">
              Verificado
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 mb-1.5">
          <CategoryIcon slug={profile.category} size="sm" className="w-5 h-5 rounded-md bg-azulejo-100" />
          <span className="text-xs text-stone-500">
            {CATEGORY_NAMES[profile.category] ?? profile.category}
          </span>
          <span className="text-stone-300">·</span>
          <MapPin className="w-3 h-3 text-stone-400 shrink-0" strokeWidth={1.5} />
          <span className="text-xs text-stone-400 truncate">{w.location.split(",")[0]}</span>
        </div>

        <div className="flex items-center gap-3">
          <Stars rating={profile.rating} count={profile.reviewCount} size="sm" />
          <span className="text-xs font-semibold text-ink tnum">
            {formatCOP(profile.hourlyRate)}
            <span className="font-normal text-stone-400">/h</span>
          </span>
        </div>
      </div>

      <div className="shrink-0 w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center group-hover:bg-ink transition-colors">
        <Search className="w-3.5 h-3.5 text-stone-400 group-hover:text-paper transition-colors" />
      </div>
    </Link>
  );
}

function ExplorarContent() {
  const searchParams = useSearchParams();
  const loading = useSimulatedLoading(700);

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(
    searchParams.get("categoria")
  );

  useEffect(() => {
    const cat = searchParams.get("categoria");
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  const filtered = useMemo(() => {
    return workers
      .filter((w) => !activeCategory || w.workerProfile?.category === activeCategory)
      .filter((w) => {
        if (!query.trim()) return true;

        const q = query.toLowerCase();

        return (
          w.name.toLowerCase().includes(q) ||
          (w.workerProfile?.skills ?? []).some((s) => s.toLowerCase().includes(q)) ||
          w.location.toLowerCase().includes(q) ||
          CATEGORY_NAMES[w.workerProfile?.category ?? ""]?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (b.workerProfile?.rating ?? 0) - (a.workerProfile?.rating ?? 0));
  }, [query, activeCategory]);

  return (
    <div className="min-h-screen bg-paper pb-24">
      <Navbar />

      <div className="sticky top-14 z-40 bg-paper/95 backdrop-blur-sm border-b border-stone-200 shadow-nav">
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-0">
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por oficio, nombre o zona..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-card text-sm text-ink placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-ink focus:border-ink transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 px-4 max-w-2xl mx-auto pb-3 w-max">
            <button
              onClick={() => setActiveCategory(null)}
              className={cn(
                "shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors border",
                !activeCategory
                  ? "bg-ink text-paper border-ink"
                  : "bg-card text-stone-500 border-stone-200 hover:border-stone-400"
              )}
            >
              Todos
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(activeCategory === cat.slug ? null : cat.slug)}
                className={cn(
                  "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border whitespace-nowrap",
                  activeCategory === cat.slug
                    ? "bg-ink text-paper border-ink"
                    : "bg-card text-stone-500 border-stone-200 hover:border-stone-400"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-5">
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
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={SlidersHorizontal}
            eyebrow={query || activeCategory ? "Sin resultados" : "Sin trabajadores"}
            title={query || activeCategory ? "No hay trabajadores con ese filtro" : "No hay trabajadores disponibles"}
            description={
              query || activeCategory
                ? "Intenta con otros filtros o amplía la búsqueda."
                : "Pronto habrá trabajadores disponibles en tu zona."
            }
            action={
              query || activeCategory
                ? {
                    label: "Limpiar filtros",
                    onClick: () => {
                      setQuery("");
                      setActiveCategory(null);
                    },
                    variant: "outline",
                  }
                : undefined
            }
          />
        ) : (
          <>
            <p className="text-xs text-stone-400 mb-4">
              {filtered.length} trabajador{filtered.length !== 1 ? "es" : ""}
              {activeCategory && (
                <>
                  {" "}en{" "}
                  <span className="font-semibold text-stone-600">
                    {CATEGORY_NAMES[activeCategory]}
                  </span>
                </>
              )}
            </p>

            <div className="flex flex-col gap-3 animate-fade-in">
              {filtered.map((w) => (
                <WorkerCard key={w.id} w={w} />
              ))}
            </div>
          </>
        )}
      </div>

      <BottomNav />
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