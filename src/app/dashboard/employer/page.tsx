"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Briefcase,
  Users,
  Plus,
  CheckCircle,
  Clock,
  MessageSquare,
  Star,
  ChevronRight,
  Building2,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { PageShell } from "@/components/layout/PageShell";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonEmployerDashboard } from "@/components/ui/Skeleton";
import { StatCard } from "@/components/shared/StatCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ReviewCard } from "@/components/features/reviews/ReviewCard";
import { ReviewModal } from "@/components/features/reviews/ReviewModal";
import { formatCOP, formatCOPShort, timeAgo } from "@/lib/format";
import { useJobs, useAuth } from "@/context";
import { getUserById } from "@/data/users";
import { useSimulatedLoading } from "@/hooks/useSimulatedLoading";

// stats.published is derived from publishedJobs.length inside the component

// publishedJobs is now derived from useJobs() context inside the component (typed as Job[])

const applicants = [
  {
    id: "o7",
    jobId: "j2",
    jobTitle: "Instalación de tomacorrientes",
    workerName: "Andrés Felipe Vargas",
    workerCategory: "Electricista certificado",
    workerRating: 4.6,
    workerReviews: 23,
    proposedPrice: 200000,
    counterOfferPrice: 170000,
    status: "negotiating" as const,
    message:
      "Soy técnico electricista certificado por el SENA. La instalación incluye materiales y garantía de 6 meses.",
    createdAt: "2026-05-08T15:00:00Z",
  },
  {
    id: "o5",
    jobId: "j5",
    jobTitle: "Puerta corrediza atascada",
    workerName: "Diego Ríos Parra",
    workerCategory: "Carpintero",
    workerRating: 4.7,
    workerReviews: 15,
    proposedPrice: 180000,
    counterOfferPrice: undefined,
    status: "pending" as const,
    message:
      "Puedo revisar el riel y darle diagnóstico sin costo. Si hay que cambiar el riel, lo consigo en ferretería.",
    createdAt: "2026-05-08T08:00:00Z",
  },
  {
    id: "o6",
    jobId: "j5",
    jobTitle: "Puerta corrediza atascada",
    workerName: "Sebastián Jiménez Ariza",
    workerCategory: "Cerrajero",
    workerRating: 4.3,
    workerReviews: 9,
    proposedPrice: 150000,
    counterOfferPrice: undefined,
    status: "pending" as const,
    message:
      "También trabajo con puertas corredizas de madera. Puedo ir mañana.",
    createdAt: "2026-05-08T14:30:00Z",
  },
];

const activeHires = [
  {
    id: "hire-1",
    jobId: "j10",
    jobTitle: "Reparación tubería rota en baño",
    workerName: "Carlos Mendoza",
    workerCategory: "Plomero",
    workerRating: 4.8,
    agreedPrice: 110000,
    chatId: "c4",
    startedAt: "2026-04-13T08:00:00Z",
  },
];

const reviewsGiven = [
  {
    id: "r3",
    workerName: "Carlos Mendoza",
    jobTitle: "Reparación de tubería rota",
    rating: 5,
    comment:
      "Carlos es el mejor plomero que he contratado. Identificó el problema enseguida y dejó todo limpio.",
    createdAt: "2026-04-14T18:00:00Z",
  },
];

const activityFeed = [
  {
    id: "a1",
    icon: MessageSquare,
    color: "text-azulejo-500 bg-azulejo-100",
    text: "Andrés Vargas aceptó negociar precio — $170.000",
    time: "2026-05-09T11:30:00Z",
  },
  {
    id: "a2",
    icon: Users,
    color: "text-stone-500 bg-stone-100",
    text: "Sebastián Jiménez se postuló a 'Puerta corrediza'",
    time: "2026-05-08T14:30:00Z",
  },
  {
    id: "a3",
    icon: Users,
    color: "text-stone-500 bg-stone-100",
    text: "Diego Ríos se postuló a 'Puerta corrediza'",
    time: "2026-05-08T08:00:00Z",
  },
  {
    id: "a4",
    icon: Plus,
    color: "text-forest-500 bg-forest-100",
    text: "Publicaste 'Puerta corrediza de madera atascada'",
    time: "2026-05-07T11:45:00Z",
  },
  {
    id: "a5",
    icon: CheckCircle,
    color: "text-forest-500 bg-forest-100",
    text: "Trabajo completado — Reparación tubería · Carlos Mendoza",
    time: "2026-04-14T17:00:00Z",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const jobStatusConfig = {
  open: { label: "Abierto", variant: "default" as const, dot: true },
  in_progress: { label: "En progreso", variant: "warning" as const, dot: true },
  completed: { label: "Completado", variant: "success" as const, dot: false },
  cancelled: { label: "Cancelado", variant: "danger" as const, dot: false },
  draft: { label: "Borrador", variant: "neutral" as const, dot: false },
};

const urgencyLabel = {
  urgent: { label: "Urgente", variant: "danger" as const },
  this_week: { label: "Esta semana", variant: "warning" as const },
  flexible: { label: "Flexible", variant: "neutral" as const },
};

const offerStatusConfig = {
  pending: { label: "Pendiente", variant: "neutral" as const },
  negotiating: { label: "Negociando", variant: "warning" as const },
  accepted: { label: "Aceptada", variant: "success" as const },
  rejected: { label: "Rechazada", variant: "danger" as const },
  withdrawn: { label: "Retirada", variant: "neutral" as const },
};

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${
            i < Math.floor(rating) ? "fill-marigold-300 text-marigold-300" : "text-stone-200"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EmployerDashboardPage() {
  const { user } = useAuth();
  const { jobs, getReviewsByJob, getReviewsByWorker, hasReviewed, offers } = useJobs();

  // Real jobs from context typed as Job[] — fixes TS2339 on acceptedOfferId / updatedAt
  const publishedJobs = jobs.filter((j) => j.employerId === (user?.id ?? ""));

  // ReviewModal state: { jobId, jobTitle, offerId, targetId, targetName }
  const [reviewTarget, setReviewTarget] = useState<{
    jobId: string;
    jobTitle: string;
    offerId: string;
    targetId: string;
    targetName: string;
  } | null>(null);

  const EMPLOYER_ID = user?.id ?? "";
  const loading = useSimulatedLoading(1400);

  // Real reviews given by this employer (across all their completed jobs)
  const realReviews = publishedJobs.flatMap((j) => getReviewsByJob(j.id));

  // Reviews received by this employer from workers
  const receivedReviews = getReviewsByWorker(EMPLOYER_ID);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="animate-fade-in">
          <SkeletonEmployerDashboard />
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
                {user?.name ?? ""}
              </h1>
              <div className="flex items-center gap-1.5 mt-1">
                <Building2 className="w-3.5 h-3.5 text-stone-500" />
                <span className="text-sm text-stone-500">
                  {(user as any)?.employerProfile?.companyName ?? ""}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-stone-500" />
                <span className="text-sm text-stone-500">
                  {user?.location ?? ""}
                </span>
              </div>
              {true && (
                <div className="mt-2">
                  <Badge variant="default" size="sm">
                    <CheckCircle className="w-3 h-3" />
                    Verificado
                  </Badge>
                </div>
              )}
            </div>
            <Avatar name={user?.name ?? ""} size="xl" className="shrink-0" />
          </div>
        </PageShell>
      </div>

      {/* ── Stats ── */}
      <PageShell className="mt-5">
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={Briefcase}
            label="Publicados"
            value={String(publishedJobs.length)}
            variant="primary"
          />
          <StatCard
            icon={Users}
            label="Postulantes"
            value={String(applicants.filter((a) => a.status === "pending" || a.status === "negotiating").length)}
            sub="pendientes"
            variant="warning"
          />
          <StatCard
            icon={CheckCircle}
            label="Activos"
            value={String(activeHires.length)}
            variant="success"
          />
        </div>
      </PageShell>

      {/* ── Published jobs ── */}
      <PageShell className="mt-7">
        <SectionHeader
          title="Mis trabajos publicados"
          count={publishedJobs.length}
          action={{ label: "Ver todos", href: "/dashboard/employer/jobs" }}
        />

        <div className="flex flex-col gap-3">
          {/* Post new job card */}
          <Link href="/publicar" className="w-full bg-card rounded-[16px] border-2 border-dashed border-stone-200 hover:border-ink hover:bg-stone-50 transition-all p-5 text-center group block">
            <Plus className="w-6 h-6 text-stone-500 group-hover:text-ink mx-auto mb-1 transition-colors" />
            <p className="text-sm font-semibold text-stone-500 group-hover:text-ink transition-colors">
              Publicar nuevo trabajo
            </p>
            <p className="text-xs text-stone-400 mt-0.5">
              Gratis · Sin comisiones ocultas
            </p>
          </Link>

          {publishedJobs.map((job) => {
            const s = jobStatusConfig[job.status];
            const u = urgencyLabel[job.urgency];
            return (
              <div
                key={job.id}
                className="bg-card rounded-[16px] p-4 border border-stone-200"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-ink text-sm leading-snug">
                      {job.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <Badge variant="default" size="sm">
                        {job.category}
                      </Badge>
                      <Badge variant={u.variant} size="sm">
                        {u.label}
                      </Badge>
                    </div>
                  </div>
                  <Badge variant={s.variant} dot={s.dot} size="sm" className="shrink-0">
                    {s.label}
                  </Badge>
                </div>

                {/* Meta row */}
                <div className="flex items-center gap-3 text-stone-500 text-xs">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {job.location}
                  </div>
                  <span className="text-stone-200">·</span>
                  <span className="font-semibold text-ink tnum">
                    {formatCOPShort(job.budget.min)}–{formatCOPShort(job.budget.max)}
                  </span>
                  <span className="text-stone-200">·</span>
                  <span>{timeAgo(job.createdAt)}</span>
                </div>

                {/* Footer */}
                <div className="mt-3 pt-3 border-t border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-stone-500">
                    <Users className="w-3.5 h-3.5" />
                    <span>
                      {job.offerCount}{" "}
                      {job.offerCount === 1 ? "postulante" : "postulantes"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {job.status === "open" && job.offerCount > 0 && (
                      <Link href={`/trabajos/${job.id}`}>
                        <Button variant="primary" size="sm">
                          Ver postulantes
                        </Button>
                      </Link>
                    )}
                    <Link href={`/trabajos/${job.id}`}>
                      <Button variant="ghost" size="sm">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </PageShell>

      {/* ── Applicants ── */}
      <PageShell className="mt-7">
        <SectionHeader
          title="Postulantes recientes"
          count={applicants.length}
          action={{
            label: "Ver todos",
            href: "/dashboard/employer/applicants",
          }}
        />

        <div className="flex flex-col gap-3">
          {applicants.map((app) => {
            const s = offerStatusConfig[app.status];
            return (
              <div
                key={app.id}
                className="bg-card rounded-[16px] p-4 border border-stone-200"
              >
                {/* Worker info */}
                <div className="flex items-start gap-3 mb-3">
                  <Avatar name={app.workerName} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-ink text-sm">
                          {app.workerName}
                        </p>
                        <p className="text-xs text-stone-500">
                          {app.workerCategory}
                        </p>
                      </div>
                      <Badge variant={s.variant} size="sm" className="shrink-0">
                        {s.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRow rating={app.workerRating} />
                      <span className="text-xs text-stone-500 tnum">
                        {app.workerRating} ({app.workerReviews})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Job reference */}
                <p className="text-xs text-stone-500 bg-stone-100 rounded-xl px-3 py-2 mb-3">
                  Para: <span className="font-medium text-ink">{app.jobTitle}</span>
                </p>

                {/* Pricing */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 p-3 bg-stone-100 rounded-xl">
                    <p className="text-xs text-stone-500">Propuesta inicial</p>
                    <p className="text-base font-bold text-ink tnum">
                      {formatCOP(app.proposedPrice)}
                    </p>
                  </div>
                  {app.counterOfferPrice && (
                    <div className="flex-1 p-3 bg-azulejo-100 rounded-xl">
                      <p className="text-xs text-azulejo-500">Acordado</p>
                      <p className="text-base font-bold text-azulejo-600 tnum">
                        {formatCOP(app.counterOfferPrice)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Message preview */}
                <p className="text-xs text-stone-500 italic leading-relaxed mb-3 line-clamp-2">
                  &quot;{app.message}&quot;
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-stone-200">
                  {app.status === "pending" && (
                    <Button variant="primary" size="sm" className="flex-1">
                      <CheckCircle className="w-4 h-4" />
                      Contratar
                    </Button>
                  )}
                  {app.status === "negotiating" && (
                    <Button variant="primary" size="sm" className="flex-1">
                      <CheckCircle className="w-4 h-4" />
                      Aceptar ${formatCOPShort(app.counterOfferPrice!)}
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    Ver perfil
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </PageShell>

      {/* ── Active hires ── */}
      <PageShell className="mt-7">
        <SectionHeader
          title="Contrataciones activas"
          count={activeHires.length}
          action={{ label: "Ver todas", href: "/dashboard/employer/applicants" }}
        />

        {activeHires.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Sin contrataciones activas"
            description="Acepta la propuesta de un trabajador para comenzar un trabajo."
            action={{ label: "Ver postulantes", href: "#postulantes", variant: "outline" }}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {activeHires.map((hire) => (
              <div
                key={hire.id}
                className="bg-card rounded-[16px] p-4 border border-stone-200"
              >
                <div className="flex items-start gap-3">
                  <Avatar name={hire.workerName} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-ink text-sm">
                          {hire.workerName}
                        </p>
                        <p className="text-xs text-stone-500">
                          {hire.workerCategory}
                        </p>
                      </div>
                      <Badge variant="warning" dot size="sm">
                        En progreso
                      </Badge>
                    </div>
                    <p className="text-xs text-stone-500 mt-1 truncate">
                      {hire.jobTitle}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs font-semibold text-ink tnum">
                        {formatCOP(hire.agreedPrice)}
                      </span>
                      <div className="flex items-center gap-1">
                        <StarRow rating={hire.workerRating} />
                        <span className="text-xs text-stone-500 tnum">
                          {hire.workerRating}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-stone-200 flex items-center gap-2">
                  <Link href={`/trabajos/${hire.jobId ?? ""}`}>
                    <Button variant="soft" size="sm">
                      Ver detalles
                    </Button>
                  </Link>
                  <Link href="/mensajes">
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="w-4 h-4" />
                      Chat
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="ml-auto text-forest-500">
                    <CheckCircle className="w-4 h-4" />
                    Completar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </PageShell>

      {/* ── Hiring activity ── */}
      <PageShell className="mt-7">
        <SectionHeader title="Actividad reciente" />

        <div className="bg-card rounded-[16px] border border-stone-200 divide-y divide-stone-100">
          {activityFeed.map((event, index) => {
            const Icon = event.icon;
            return (
              <div
                key={event.id}
                className="flex items-start gap-3 p-4 hover:bg-stone-50 transition-colors"
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${event.color}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ink leading-snug">
                    {event.text}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {timeAgo(event.time)}
                  </p>
                </div>
                {index === 0 && (
                  <span className="w-2 h-2 rounded-full bg-azulejo-500 shrink-0 mt-1.5" />
                )}
              </div>
            );
          })}
        </div>
      </PageShell>

      {/* ── Reviews received (from workers) ── */}
      <PageShell className="mt-7">
        <SectionHeader
          title="Calificaciones recibidas"
          count={receivedReviews.length}
        />
        <div className="flex flex-col gap-3">
          {receivedReviews.length === 0 ? (
            <div className="bg-card rounded-[16px] border border-dashed border-stone-200 p-8 text-center">
              <Star className="w-8 h-8 text-stone-200 mx-auto mb-2" />
              <p className="text-sm text-stone-500">
                Aún no tienes calificaciones
              </p>
              <p className="text-xs text-stone-400 mt-1">
                Los trabajadores podrán calificarte al completar un trabajo
              </p>
            </div>
          ) : (
            <>
              {/* Average badge */}
              <div className="flex items-center gap-3 p-4 bg-card rounded-[16px] border border-stone-200">
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const avg = receivedReviews.reduce((s, r) => s + r.rating, 0) / receivedReviews.length;
                    return (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.round(avg) ? "fill-marigold-300 text-marigold-300" : "text-stone-200"}`}
                      />
                    );
                  })}
                </div>
                <div>
                  <p className="text-lg font-bold text-ink tnum leading-none">
                    {(receivedReviews.reduce((s, r) => s + r.rating, 0) / receivedReviews.length).toFixed(1)}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {receivedReviews.length} calificación{receivedReviews.length !== 1 ? "es" : ""} de trabajadores
                  </p>
                </div>
              </div>
              {receivedReviews.map((review) => {
                const author = getUserById(review.authorId);
                const job = publishedJobs.find((j) => j.id === review.jobId);
                return (
                  <ReviewCard
                    key={review.id}
                    rating={review.rating}
                    comment={review.comment}
                    createdAt={review.createdAt}
                    authorName={author?.name ?? "Trabajador"}
                    authorRole="worker"
                    jobTitle={job?.title}
                  />
                );
              })}
            </>
          )}
        </div>
      </PageShell>

      {/* ── Reviews given (real data from context) ── */}
      <PageShell className="mt-7 pb-4">
        <SectionHeader
          title="Reseñas que dejé"
          count={realReviews.length}
          action={{ label: "Ver todas", href: "/perfil/u8" }}
        />

        <div className="flex flex-col gap-3">
          {realReviews.map((review) => {
            const target = getUserById(review.targetId);
            const job = publishedJobs.find((j) => j.id === review.jobId);
            return (
              <ReviewCard
                key={review.id}
                rating={review.rating}
                comment={review.comment}
                createdAt={review.createdAt}
                authorName={user?.name ?? ""}
                jobTitle={job?.title}
              />
            );
          })}

          {/* Pending review prompts — completed jobs without a review */}
          {publishedJobs
            .filter(
              (j) =>
                j.status === "completed" && !hasReviewed(j.id, EMPLOYER_ID)
            )
            .map((j) => {
              const acceptedOffer = offers.find(
                (o) => o.id === j.acceptedOfferId
              );
              const worker = acceptedOffer
                ? getUserById(acceptedOffer.workerId)
                : undefined;
              if (!worker || !acceptedOffer) return null;
              return (
                <div
                  key={j.id}
                  className="bg-marigold-100 rounded-[16px] p-4 border border-marigold-200 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink">
                      ¿Cómo te fue con {worker.name.split(" ")[0]}?
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5 truncate">
                      {j.title} · {timeAgo(j.createdAt)}
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="shrink-0"
                    onClick={() =>
                      setReviewTarget({
                        jobId: j.id,
                        jobTitle: j.title,
                        offerId: acceptedOffer.id,
                        targetId: worker.id,
                        targetName: worker.name,
                      })
                    }
                  >
                    <Star className="w-4 h-4" />
                    Calificar
                  </Button>
                </div>
              );
            })}

          {realReviews.length === 0 &&
            !publishedJobs.some((j) => j.status === "completed") && (
              <div className="bg-card rounded-[16px] border border-dashed border-stone-200 p-8 text-center">
                <Star className="w-8 h-8 text-stone-200 mx-auto mb-2" />
                <p className="text-sm text-stone-500">
                  Aún no has dejado reseñas
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  Podrás calificar a los trabajadores al completar un trabajo
                </p>
              </div>
            )}
        </div>
      </PageShell>

      {/* ── ReviewModal ── */}
      {reviewTarget && (
        <ReviewModal
          isOpen={reviewTarget !== null}
          onClose={() => setReviewTarget(null)}
          jobId={reviewTarget.jobId}
          jobTitle={reviewTarget.jobTitle}
          offerId={reviewTarget.offerId}
          targetId={reviewTarget.targetId}
          targetName={reviewTarget.targetName}
          authorId={EMPLOYER_ID}
        />
      )}

      <BottomNav />
    </div>
  );
}
