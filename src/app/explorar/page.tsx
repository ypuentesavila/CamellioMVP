"use client";

import { useState } from "react";
import { Search, Briefcase } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { PageShell } from "@/components/layout/PageShell";
import { JobCard } from "@/components/features/jobs/JobCard";
import { ApplyModal } from "@/components/features/jobs/ApplyModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonJobCardFull } from "@/components/ui/Skeleton";
import { useJobs } from "@/context";
import { categories } from "@/data/categories";
import { useSimulatedLoading } from "@/hooks/useSimulatedLoading";
import { cn } from "@/lib/utils";
import type { Job } from "@/types";

export default function ExplorarPage() {
  const { jobs } = useJobs();
  const loading = useSimulatedLoading(900);

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const openJobs = jobs.filter((j) => j.status === "open");

  const filtered = openJobs
    .filter((j) => !activeCategory || j.category === activeCategory)
    .filter(
      (j) =>
        !query ||
        j.title.toLowerCase().includes(query.toLowerCase()) ||
        j.location.toLowerCase().includes(query.toLowerCase()) ||
        j.description.toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => {
      const order = { urgent: 0, this_week: 1, flexible: 2 };
      return order[a.urgency] - order[b.urgency];
    });

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <Navbar />

      {/* Sticky search + filter header */}
      <div className="sticky top-16 z-40 bg-surface border-b border-border shadow-nav">
        <PageShell className="pt-4 pb-0">
          <h1 className="text-lg font-bold text-text-primary mb-3">
            Explorar trabajos
          </h1>
          <div className="relative mb-3">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por servicio o barrio..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>
        </PageShell>

        {/* Category chips — outer div centers to match PageShell, inner holds scroll content */}
        <div className="max-w-7xl mx-auto overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 px-4 sm:px-6 lg:px-8 pb-3 w-max">
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              "flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors border",
              !activeCategory
                ? "bg-primary text-white border-primary"
                : "bg-background text-text-secondary border-border hover:border-primary hover:text-primary"
            )}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() =>
                setActiveCategory(
                  activeCategory === cat.slug ? null : cat.slug
                )
              }
              className={cn(
                "flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border whitespace-nowrap",
                activeCategory === cat.slug
                  ? "bg-primary text-white border-primary"
                  : "bg-background text-text-secondary border-border hover:border-primary hover:text-primary"
              )}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
        </div>
      </div>

      {/* Job list */}
      <PageShell className="py-5">
        {loading ? (
          <div className="flex flex-col gap-3 animate-fade-in">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonJobCardFull key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Search}
            title="Sin resultados"
            description={
              activeCategory || query
                ? "No hay trabajos que coincidan con tu búsqueda. Intenta con otros filtros."
                : "No hay trabajos disponibles en este momento. Vuelve más tarde."
            }
            action={
              activeCategory || query
                ? {
                    label: "Ver todos los trabajos",
                    onClick: () => {
                      setActiveCategory(null);
                      setQuery("");
                    },
                    variant: "outline",
                  }
                : undefined
            }
          />
        ) : (
          <div className="flex flex-col gap-3 animate-fade-in">
            <p className="text-xs text-text-secondary">
              {filtered.length} trabajo{filtered.length !== 1 ? "s" : ""}{" "}
              disponible{filtered.length !== 1 ? "s" : ""}
              {activeCategory && (
                <> en &quot;{categories.find((c) => c.slug === activeCategory)?.name}&quot;</>
              )}
            </p>
            {filtered.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                variant="full"
                onApply={setSelectedJob}
              />
            ))}
          </div>
        )}
      </PageShell>

      <ApplyModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      <BottomNav />
    </div>
  );
}
