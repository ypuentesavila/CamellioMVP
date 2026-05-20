"use client";

import { useState } from "react";
import {
  MapPin,
  Star,
  DollarSign,
  Briefcase,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { PageShell } from "@/components/layout/PageShell";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonWorkerDashboard } from "@/components/ui/Skeleton";
import { StatCard } from "@/components/shared/StatCard";
import { ReviewCard } from "@/components/features/reviews/ReviewCard";
import { ReviewSummary } from "@/components/features/reviews/ReviewSummary";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { JobCard } from "@/components/features/jobs/JobCard";
import { ApplyModal } from "@/components/features/jobs/ApplyModal";
import { formatCOP, formatCOPShort, timeAgo } from "@/lib/format";
import { useAuth } from "@/context";
import { useJobs } from "@/context";
import { useSimulatedLoading } from "@/hooks/useSimulatedLoading";
import type { Job } from "@/types";

// ─── Static demo data (sections not yet wired to context) ────────────────────

const WORKER_DEMO = {
  name: "Carlos Mendoza",
  location: "Suba, Bogotá",
  rating: 4.8,
  reviewCount: 47,
  completedJobs: 52,
  available: true,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const offerStatusConfig = {
  pending: { label: "Pendiente", variant: "default" as const, icon: Clock },
  negotiating: { label: "Negociando", variant: "warning" as const, icon: MessageSquare },
  accepted: { label: "Aceptada", variant: "success" as const, icon: CheckCircle },
  rejected: { label: "Rechazada", variant: "danger" as const, icon: AlertCircle },
  withdrawn: { label: "Retirada", variant: "neutral" as const, icon: AlertCircle },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WorkerDashboardPage() {
  const { user } = useAuth();
  const { jobs, offers, getReviewsByWorker, getWorkerRating, getJobById } = useJobs();
  const loading = useSimulatedLoading(1300);

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Real data from context
  const openJobs = jobs
    .filter((j) => j.status === "open")
    .sort((a, b) => {
      const order = { urgent: 0, this_week: 1, flexible: 2 };
      return order[a.urgency] - order[b.urgency];
    });

  const workerOffers = user
    ? offers.filter((o) => o.workerId === user.id)
    : [];

  const activeJobs = workerOffers
    .filter((o) => o.status === "accepted")
    .map((o) => {
      const job = getJobById(o.jobId);
      return {
        id: o.id,
        jobId: o.jobId,
        title: job?.title ?? o.jobId,
        employer: job?.employerId ?? "",
        location: job?.location ?? "",
        agreedPrice: o.counterOfferPrice ?? o.proposedPrice,
        chatId: null as string | null,
      };
    });

  // Real reviews from context
  const workerId = user?.id ?? "";
  const workerReviews = getReviewsByWorker(workerId);
  const { average: liveRating, count: liveReviewCount } = getWorkerRating(workerId);

  // Fall back to demo data if no auth
  const displayName = user?.name ?? WORKER_DEMO.name;
  const displayLocation = user?.location ?? WORKER_DEMO.location;
  const displayRating = liveRating || (user?.workerProfile?.rating ?? WORKER_DEMO.rating);
  const displayReviews = liveReviewCount || (user?.workerProfile?.reviewCount ?? WORKER_DEMO.reviewCount);
  const displayCompleted = user?.workerProfile?.completedJobs ?? WORKER_DEMO.completedJobs;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="animate-fade-in">
          <SkeletonWorkerDashboard />
        </div>
        <BottomNav />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-paper pb-20 md:pb-8 animate-fade-in">
      <Navbar />

      {/* ── Greeting ── */}
      <div className="bg-card border-b border-stone-200">
        <PageShell className="py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-stone-500">Buenos días</p>
              <h1 className="text-xl font-bold text-ink mt-0.5">
                {displayName}
              </h1>
              <div className="flex items-center gap-1.5 mt-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-500" />
                <span className="text-sm text-stone-500">{displayLocation}</span>
              </div>
              <div className="mt-2">
                <Badge variant="success" dot size="sm">
                  Disponible
                </Badge>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <Avatar name={displayName} size="xl" />
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-marigold-300 text-marigold-300" />
                <span className="text-sm font-semibold text-ink tnum">
                  {displayRating}
                </span>
                <span className="text-xs text-stone-500 tnum">
                  ({displayReviews})
                </span>
              </div>
            </div>
          </div>
        </PageShell>
      </div>

      {/* ── Stats ── */}
      <PageShell className="mt-5">
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={DollarSign}
            label="Este mes"
            value="—"
            sub="+12%"
            variant="primary"
          />
          <StatCard
            icon={Briefcase}
            label="Activos"
            value={String(activeJobs.length)}
            variant="default"
          />
          <StatCard
            icon={Star}
            label="Calificación"
            value={String(displayRating)}
            sub={`${displayReviews} reseñas`}
            variant="warning"
          />
        </div>
      </PageShell>

      {/* ── Nearby jobs (real data + JobCard) ── */}
      <div className="mt-7">
        <PageShell>
          <SectionHeader
            title="Trabajos cerca de ti"
            count={openJobs.length}
            action={{ label: "Ver todos", href: "/explorar" }}
          />
        </PageShell>

        {openJobs.length === 0 ? (
          <PageShell>
            <EmptyState
              icon={Search}
              title="Sin trabajos disponibles"
              description="No hay trabajos en tu zona ahora mismo. Vuelve más tarde o explora otras categorías."
              action={{ label: "Explorar todos", href: "/explorar", variant: "soft" }}
            />
          </PageShell>
        ) : (
          <div className="max-w-7xl mx-auto overflow-x-auto scrollbar-hide snap-x snap-mandatory">
          <div className="flex gap-3 px-4 sm:px-6 lg:px-8 pb-3 w-max">
            {openJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                variant="compact"
                onApply={setSelectedJob}
              />
            ))}
          </div>
          </div>
        )}
      </div>

      {/* ── Active jobs ── */}
      <PageShell className="mt-7">
        <SectionHeader
          title="Trabajos activos"
          count={activeJobs.length}
          action={{ label: "Ver todos", href: "/explorar" }}
        />

        {activeJobs.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="Sin trabajos activos"
            description="Cuando acepten tu propuesta, el trabajo aparecerá aquí."
            action={{ label: "Ver mis postulaciones", href: "#aplicaciones", variant: "outline" }}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {activeJobs.map((job) => (
              <div
                key={job.id}
                className="bg-card rounded-[16px] p-4 border border-stone-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-ink text-sm truncate">
                      {job.title}
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {job.employer} · {job.location}
                    </p>
                    <p className="text-xs font-semibold text-ink tnum mt-1">
                      {formatCOP(job.agreedPrice)}
                    </p>
                  </div>
                  <Badge variant="warning" dot size="sm" className="shrink-0">
                    En progreso
                  </Badge>
                </div>
                <div className="mt-3 pt-3 border-t border-stone-200 flex items-center gap-2">
                  <Link href={`/trabajos/${job.jobId ?? job.id}`}>
                    <Button variant="soft" size="sm">
                      Ver detalles
                    </Button>
                  </Link>
                  <Link href={job.chatId ? `/mensajes/${job.chatId}` : "/mensajes"}>
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="w-4 h-4" />
                      Chat
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </PageShell>

      {/* ── Applications (real offers from context) ── */}
      <PageShell className="mt-7">
        <SectionHeader
          title="Mis postulaciones"
          count={workerOffers.length}
          action={{
            label: "Ver todas",
            href: "/dashboard/worker/applications",
          }}
        />

        {workerOffers.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="Sin postulaciones todavía"
            description="Explora los trabajos disponibles y envía tu primera propuesta. Es gratis."
            action={{ label: "Explorar trabajos", href: "/explorar" }}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {workerOffers.map((offer) => {
              const s = offerStatusConfig[offer.status];
              const StatusIcon = s.icon;
              const relatedJob = jobs.find((j) => j.id === offer.jobId);
              return (
                <div
                  key={offer.id}
                  className="bg-card rounded-[16px] p-4 border border-stone-200 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-ink text-sm truncate">
                      {relatedJob?.title ?? "Trabajo"}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-ink font-semibold tnum">
                        {formatCOP(offer.proposedPrice)}
                      </span>
                      {offer.counterOfferPrice && (
                        <>
                          <span className="text-xs text-stone-200">→</span>
                          <span className="text-xs text-marigold-400 font-semibold tnum">
                            {formatCOP(offer.counterOfferPrice)}
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {relatedJob?.location} · {timeAgo(offer.createdAt)}
                    </p>
                  </div>
                  <Badge variant={s.variant} size="sm" className="shrink-0">
                    <StatusIcon className="w-3 h-3" />
                    {s.label}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </PageShell>

      {/* ── Earnings preview ── */}
      <PageShell className="mt-7">
        <SectionHeader
          title="Resumen de ingresos"
          action={{ label: "Ver detalle", href: "/dashboard/worker" }}
        />
        <div className="bg-card rounded-[16px] p-5 border border-stone-200">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Este mes", value: formatCOP(340000), trend: "+12%" },
              { label: "Mes anterior", value: formatCOP(304000), trend: null },
              { label: "Trabajos completados", value: String(displayCompleted), trend: null },
              { label: "Promedio por trabajo", value: "$104k", trend: null },
            ].map((item) => (
              <div key={item.label} className="p-3 bg-stone-100 rounded-xl">
                <p className="text-xs text-stone-500">{item.label}</p>
                <p className="text-lg font-bold text-ink tnum mt-0.5">
                  {item.value}
                </p>
                {item.trend && (
                  <p className="text-xs text-forest-500 font-medium">
                    {item.trend} vs mes anterior
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </PageShell>

      {/* ── Reviews (real data from context) ── */}
      <PageShell className="mt-7 pb-4">
        <SectionHeader
          title="Mis reseñas"
          count={workerReviews.length}
          action={{ label: "Ver perfil", href: `/perfil/${workerId}` }}
        />
        <div className="flex flex-col gap-3">
          {/* Aggregate summary */}
          <ReviewSummary reviews={workerReviews} />

          {/* Recent review cards */}
          {workerReviews.slice(0, 3).map((review) => {
            return (
              <ReviewCard
                key={review.id}
                rating={review.rating}
                comment={review.comment}
                createdAt={review.createdAt}
                authorName="Empleador"
                authorRole="employer"
                jobTitle={jobs.find((j) => j.id === review.jobId)?.title}
              />
            );
          })}

          {workerReviews.length === 0 && (
            <EmptyState
              icon={Star}
              title="Aún sin reseñas"
              description="Completa trabajos para que los empleadores te califiquen. Las reseñas aumentan tus contrataciones."
            />
          )}
        </div>
      </PageShell>

      {/* ── Apply modal (lifted to page level to avoid z-index issues) ── */}
      <ApplyModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
      />

      <BottomNav />
    </div>
  );
}
