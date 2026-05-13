"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  MessageSquare,
  CheckCircle,
  Star,
  AlertCircle,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { PageShell } from "@/components/layout/PageShell";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ApplyModal } from "@/components/features/jobs/ApplyModal";
import { useAuth, useJobs, useChat } from "@/context";
import { getUserById } from "@/data/users";
import { formatCOP, formatCOPShort, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Job } from "@/types";

const urgencyConfig = {
  urgent: { label: "Urgente", variant: "danger" as const, icon: Zap },
  this_week: { label: "Esta semana", variant: "warning" as const, icon: Clock },
  flexible: { label: "Flexible", variant: "neutral" as const, icon: Clock },
};

const offerStatusConfig = {
  pending: { label: "Pendiente", variant: "default" as const, icon: Clock },
  negotiating: { label: "Negociando", variant: "warning" as const, icon: MessageSquare },
  accepted: { label: "Aceptada", variant: "success" as const, icon: CheckCircle },
  rejected: { label: "Rechazada", variant: "danger" as const, icon: AlertCircle },
  withdrawn: { label: "Retirada", variant: "neutral" as const, icon: AlertCircle },
};

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={cn("w-3.5 h-3.5", i < Math.floor(rating) ? "fill-accent text-accent" : "text-border")} />
      ))}
    </div>
  );
}

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, isWorker, isEmployer } = useAuth();
  const { jobs, offers, acceptOffer, rejectOffer, counterOffer } = useJobs();
  const { createChat } = useChat();

  const [applyOpen, setApplyOpen] = useState(false);

  const job = jobs.find((j) => j.id === id);
  const employer = job ? getUserById(job.employerId) : undefined;
  const jobOffers = job ? offers.filter((o) => o.jobId === job.id) : [];
  const myOffer = user && isWorker ? jobOffers.find((o) => o.workerId === user.id) : undefined;

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[70vh] px-4">
          <EmptyState
            icon={AlertCircle}
            title="Trabajo no encontrado"
            description="Este trabajo no existe o fue eliminado."
            action={{ label: "Explorar trabajos", href: "/explorar" }}
          />
        </div>
        <BottomNav />
      </div>
    );
  }

  const urgency = urgencyConfig[job.urgency];
  const UrgencyIcon = urgency.icon;

  const jobStatusLabel = {
    open: "Abierto",
    in_progress: "En progreso",
    completed: "Completado",
    cancelled: "Cancelado",
    draft: "Borrador",
  }[job.status];

  const jobStatusVariant = {
    open: "success" as const,
    in_progress: "warning" as const,
    completed: "neutral" as const,
    cancelled: "danger" as const,
    draft: "neutral" as const,
  }[job.status];

  function handleOpenChat(workerId: string) {
    if (!user || !job) return;
    const chat = createChat(job.id, [workerId, job.employerId]);
    router.push(`/mensajes/${chat.id}`);
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <Navbar />

      {/* Back header */}
      <div className="bg-surface border-b border-border">
        <PageShell className="py-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>

          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant={urgency.variant} size="sm">
                  <UrgencyIcon className="w-3 h-3" />
                  {urgency.label}
                </Badge>
                <Badge variant={jobStatusVariant} dot size="sm">
                  {jobStatusLabel}
                </Badge>
              </div>
              <h1 className="text-xl font-bold text-text-primary leading-tight">
                {job.title}
              </h1>
              <div className="flex items-center gap-1.5 mt-1.5 text-text-secondary">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="text-sm">{job.location}</span>
                <span className="text-border">·</span>
                <span className="text-sm">{timeAgo(job.createdAt)}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xl font-bold text-primary">
                {formatCOPShort(job.budget.min)}–{formatCOPShort(job.budget.max)}
              </p>
              <p className="text-xs text-text-secondary">COP</p>
            </div>
          </div>
        </PageShell>
      </div>

      <PageShell className="py-5 max-w-3xl">
        <div className="flex flex-col gap-6">

          {/* Description */}
          <div className="bg-surface rounded-xl p-5 shadow-card border border-border">
            <h2 className="text-sm font-bold text-text-primary mb-3">Descripción</h2>
            <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
              {job.description}
            </p>
          </div>

          {/* Budget detail */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface rounded-xl p-4 shadow-card border border-border text-center">
              <p className="text-xs text-text-secondary mb-1">Presupuesto mínimo</p>
              <p className="text-lg font-bold text-text-primary">{formatCOP(job.budget.min)}</p>
            </div>
            <div className="bg-primary-light rounded-xl p-4 border border-primary/20 text-center">
              <p className="text-xs text-primary mb-1">Presupuesto máximo</p>
              <p className="text-lg font-bold text-primary">{formatCOP(job.budget.max)}</p>
            </div>
          </div>

          {/* Employer info */}
          {employer && (
            <div className="bg-surface rounded-xl p-4 shadow-card border border-border">
              <h2 className="text-sm font-bold text-text-primary mb-3">Publicado por</h2>
              <Link
                href={`/perfil/${employer.id}`}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <Avatar name={employer.name} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-text-primary">{employer.name}</p>
                    {employer.employerProfile?.verified && (
                      <CheckCircle className="w-3.5 h-3.5 text-primary" />
                    )}
                  </div>
                  <p className="text-xs text-text-secondary">
                    {employer.employerProfile?.companyName ?? "Empleador"}
                    {" · "}
                    {employer.location}
                  </p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {employer.employerProfile?.jobsPosted ?? 0} trabajos publicados
                  </p>
                </div>
                <span className="text-xs text-primary font-medium">Ver perfil →</span>
              </Link>
            </div>
          )}

          {/* ── Worker: Apply CTA ── */}
          {isWorker && job.status === "open" && (
            <div className="bg-surface rounded-xl p-4 shadow-card border border-border">
              {myOffer ? (
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Tu propuesta</p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {formatCOP(myOffer.proposedPrice)}
                      {myOffer.counterOfferPrice && (
                        <> → <span className="text-accent font-medium">{formatCOP(myOffer.counterOfferPrice)}</span></>
                      )}
                    </p>
                  </div>
                  <Badge
                    variant={offerStatusConfig[myOffer.status].variant}
                    dot
                    size="sm"
                  >
                    {offerStatusConfig[myOffer.status].label}
                  </Badge>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      ¿Te interesa este trabajo?
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Envía tu propuesta con tu precio y disponibilidad
                    </p>
                  </div>
                  <Button variant="primary" size="md" onClick={() => setApplyOpen(true)}>
                    Postularme a este trabajo
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* ── Employer: Applicants ── */}
          {isEmployer && user?.id === job.employerId && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-text-primary">
                  Postulantes
                </h2>
                <Badge variant="default" size="sm">
                  {jobOffers.filter(o => o.status !== "withdrawn").length}
                </Badge>
              </div>

              {jobOffers.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="Sin postulantes todavía"
                  description="Los trabajadores verán este trabajo y enviarán sus propuestas pronto."
                />
              ) : (
                <div className="flex flex-col gap-3">
                  {jobOffers.map((offer) => {
                    const worker = getUserById(offer.workerId);
                    if (!worker) return null;
                    const s = offerStatusConfig[offer.status];
                    const SIcon = s.icon;

                    return (
                      <div key={offer.id} className="bg-surface rounded-xl p-4 shadow-card border border-border">
                        <div className="flex items-start gap-3 mb-3">
                          <Avatar name={worker.name} size="md" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-sm font-semibold text-text-primary">{worker.name}</p>
                                <p className="text-xs text-text-secondary">
                                  {worker.workerProfile?.category ?? "Trabajador"}
                                </p>
                              </div>
                              <Badge variant={s.variant} size="sm" className="shrink-0">
                                <SIcon className="w-3 h-3" />
                                {s.label}
                              </Badge>
                            </div>
                            {worker.workerProfile && (
                              <div className="flex items-center gap-1.5 mt-1">
                                <StarRow rating={worker.workerProfile.rating} />
                                <span className="text-xs text-text-secondary">
                                  {worker.workerProfile.rating} ({worker.workerProfile.reviewCount})
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Pricing */}
                        <div className="flex gap-3 mb-3">
                          <div className="flex-1 p-3 bg-background rounded-lg">
                            <p className="text-xs text-text-secondary">Propuesta</p>
                            <p className="text-base font-bold text-text-primary">
                              {formatCOP(offer.proposedPrice)}
                            </p>
                          </div>
                          {offer.counterOfferPrice && (
                            <div className="flex-1 p-3 bg-primary-light rounded-lg">
                              <p className="text-xs text-primary">Acordado</p>
                              <p className="text-base font-bold text-primary">
                                {formatCOP(offer.counterOfferPrice)}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Message */}
                        <p className="text-xs text-text-secondary italic leading-relaxed mb-3 line-clamp-2">
                          &quot;{offer.message}&quot;
                        </p>

                        {/* Actions */}
                        {offer.status === "pending" && (
                          <div className="flex gap-2 pt-3 border-t border-border">
                            <Button
                              variant="primary"
                              size="sm"
                              className="flex-1"
                              onClick={() => acceptOffer(offer.id)}
                            >
                              <CheckCircle className="w-4 h-4" />
                              Contratar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/perfil/${worker.id}`)}
                            >
                              Ver perfil
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenChat(worker.id)}
                            >
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                        {offer.status === "negotiating" && (
                          <div className="flex gap-2 pt-3 border-t border-border">
                            <Button
                              variant="primary"
                              size="sm"
                              className="flex-1"
                              onClick={() => acceptOffer(offer.id)}
                            >
                              Aceptar {formatCOPShort(offer.counterOfferPrice!)}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenChat(worker.id)}
                            >
                              <MessageSquare className="w-4 h-4" />
                              Chat
                            </Button>
                          </div>
                        )}
                        {offer.status === "accepted" && (
                          <div className="flex gap-2 pt-3 border-t border-border">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleOpenChat(worker.id)}
                            >
                              <MessageSquare className="w-4 h-4" />
                              Abrir chat
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Offer count for guests/other employers */}
          {!isEmployer && !isWorker && job.status === "open" && (
            <div className="bg-primary-light rounded-xl p-4 border border-primary/20 text-center">
              <p className="text-sm font-semibold text-primary mb-1">
                ¿Quieres aplicar a este trabajo?
              </p>
              <p className="text-xs text-text-secondary mb-3">
                Inicia sesión como trabajador para enviar tu propuesta
              </p>
              <Link href="/login">
                <Button variant="primary" size="sm">Iniciar sesión</Button>
              </Link>
            </div>
          )}

        </div>
      </PageShell>

      {/* Apply modal */}
      <ApplyModal
        job={applyOpen ? job : null}
        onClose={() => setApplyOpen(false)}
      />

      <BottomNav />
    </div>
  );
}
