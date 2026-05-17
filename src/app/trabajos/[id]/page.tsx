"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  MapPin,
  Clock,
  Users,
  MessageSquare,
  CheckCircle,
  CheckCircle2,
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
        <Star
          key={i}
          className={cn(
            "w-3.5 h-3.5",
            i < Math.floor(rating)
              ? "fill-marigold-300 text-marigold-300"
              : "text-stone-200"
          )}
        />
      ))}
    </div>
  );
}

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, isWorker, isEmployer } = useAuth();
  const { jobs, offers, acceptOffer } = useJobs();
  const { createChat } = useChat();

  const [applyOpen, setApplyOpen] = useState(false);

  const job = jobs.find((j) => j.id === id);
  const employer = job ? getUserById(job.employerId) : undefined;
  const jobOffers = job ? offers.filter((o) => o.jobId === job.id) : [];
  const myOffer = user && isWorker ? jobOffers.find((o) => o.workerId === user.id) : undefined;

  if (!job) {
    return (
      <div className="min-h-screen bg-paper">
        <Navbar />
        <div className="flex items-center justify-center min-h-[70vh] px-4">
          <EmptyState
            icon={AlertCircle}
            title="Trabajo no encontrado"
            description="Este trabajo no existe o fue eliminado."
            action={{ label: "Explorar trabajadores", href: "/explorar" }}
          />
        </div>
        <BottomNav />
      </div>
    );
  }

  const urgency = urgencyConfig[job.urgency];
  const UrgencyIcon = urgency.icon;

  const jobStatusLabel: Record<string, string> = {
    open: "Abierto", in_progress: "En progreso", completed: "Completado",
    cancelled: "Cancelado", draft: "Borrador",
  };

  const jobStatusVariant: Record<string, "success" | "warning" | "neutral" | "danger"> = {
    open: "success", in_progress: "warning", completed: "neutral",
    cancelled: "danger", draft: "neutral",
  };

  function handleOpenChat(workerId: string) {
    if (!user || !job) return;
    const chat = createChat(job.id, [workerId, job.employerId]);
    router.push(`/mensajes/${chat.id}`);
  }

  return (
    <div className="min-h-screen bg-paper pb-24">
      <Navbar />

      {/* Back + header */}
      <div className="bg-card border-b border-stone-200">
        <PageShell className="py-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-ink transition-colors mb-3 min-h-[44px] -ml-1 px-1"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={2} />
            Volver
          </button>

          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant={urgency.variant} size="sm">
                  <UrgencyIcon className="w-3 h-3" />
                  {urgency.label}
                </Badge>
                <Badge variant={jobStatusVariant[job.status] ?? "neutral"} dot size="sm">
                  {jobStatusLabel[job.status] ?? job.status}
                </Badge>
              </div>
              <h1 className="text-xl font-bold text-ink leading-tight">{job.title}</h1>
              <div className="flex items-center gap-1.5 mt-1.5 text-stone-400">
                <MapPin className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
                <span className="text-sm">{job.location}</span>
                <span className="text-stone-200">·</span>
                <span className="text-sm">{timeAgo(job.createdAt)}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xl font-bold text-ink tnum">
                {formatCOPShort(job.budget.min)}–{formatCOPShort(job.budget.max)}
              </p>
              <p className="text-xs text-stone-400">COP</p>
            </div>
          </div>
        </PageShell>
      </div>

      <PageShell className="py-5 max-w-2xl">
        <div className="flex flex-col gap-5">

          {/* Description */}
          <div className="bg-card rounded-[16px] p-5 border border-stone-200">
            <h2 className="text-sm font-bold text-ink mb-3">Descripción</h2>
            <p className="text-sm text-stone-500 leading-relaxed whitespace-pre-wrap">
              {job.description}
            </p>
          </div>

          {/* Budget */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card rounded-[16px] p-4 border border-stone-200 text-center">
              <p className="text-xs text-stone-400 mb-1">Presupuesto mínimo</p>
              <p className="text-lg font-bold text-ink tnum">{formatCOP(job.budget.min)}</p>
            </div>
            <div className="bg-azulejo-100 rounded-[16px] p-4 border border-azulejo-200 text-center">
              <p className="text-xs text-azulejo-500 mb-1">Presupuesto máximo</p>
              <p className="text-lg font-bold text-azulejo-600 tnum">{formatCOP(job.budget.max)}</p>
            </div>
          </div>

          {/* Employer */}
          {employer && (
            <div className="bg-card rounded-[16px] p-4 border border-stone-200">
              <h2 className="text-sm font-bold text-ink mb-3">Publicado por</h2>
              <Link
                href={`/perfil/${employer.id}`}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <Avatar name={employer.name} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-ink">{employer.name}</p>
                    {employer.employerProfile?.verified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-forest-500" />
                    )}
                  </div>
                  <p className="text-xs text-stone-500">
                    {employer.employerProfile?.companyName ?? "Empleador"} · {employer.location}
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {employer.employerProfile?.jobsPosted ?? 0} trabajos publicados
                  </p>
                </div>
                <span className="text-xs text-stone-400 font-medium shrink-0">Ver perfil →</span>
              </Link>
            </div>
          )}

          {/* Worker: apply CTA */}
          {isWorker && job.status === "open" && (
            <div className="bg-card rounded-[16px] p-4 border border-stone-200">
              {myOffer ? (
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">Tu propuesta</p>
                    <p className="text-xs text-stone-400 mt-0.5 tnum">
                      {formatCOP(myOffer.proposedPrice)}
                      {myOffer.counterOfferPrice && (
                        <> → <span className="text-marigold-400 font-medium">{formatCOP(myOffer.counterOfferPrice)}</span></>
                      )}
                    </p>
                  </div>
                  <Badge variant={offerStatusConfig[myOffer.status].variant} dot size="sm">
                    {offerStatusConfig[myOffer.status].label}
                  </Badge>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">¿Te interesa este trabajo?</p>
                    <p className="text-xs text-stone-400 mt-0.5">Envía tu propuesta con tu precio y disponibilidad</p>
                  </div>
                  <Button variant="primary" size="md" onClick={() => setApplyOpen(true)}>
                    Postularme a este trabajo
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Employer: applicants */}
          {isEmployer && user?.id === job.employerId && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-ink">Postulantes</h2>
                <Badge variant="default" size="sm">
                  {jobOffers.filter((o) => o.status !== "withdrawn").length}
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
                      <div key={offer.id} className="bg-card rounded-[16px] p-4 border border-stone-200">
                        <div className="flex items-start gap-3 mb-3">
                          <Avatar name={worker.name} size="md" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-sm font-semibold text-ink">{worker.name}</p>
                                <p className="text-xs text-stone-400">{worker.workerProfile?.category ?? "Trabajador"}</p>
                              </div>
                              <Badge variant={s.variant} size="sm" className="shrink-0">
                                <SIcon className="w-3 h-3" />
                                {s.label}
                              </Badge>
                            </div>
                            {worker.workerProfile && (
                              <div className="flex items-center gap-1.5 mt-1">
                                <StarRow rating={worker.workerProfile.rating} />
                                <span className="text-xs text-stone-400 tnum">
                                  {worker.workerProfile.rating} ({worker.workerProfile.reviewCount})
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-3 mb-3">
                          <div className="flex-1 p-3 bg-stone-100 rounded-xl">
                            <p className="text-xs text-stone-400">Propuesta</p>
                            <p className="text-base font-bold text-ink tnum">{formatCOP(offer.proposedPrice)}</p>
                          </div>
                          {offer.counterOfferPrice && (
                            <div className="flex-1 p-3 bg-azulejo-100 rounded-xl">
                              <p className="text-xs text-azulejo-500">Acordado</p>
                              <p className="text-base font-bold text-azulejo-600 tnum">{formatCOP(offer.counterOfferPrice)}</p>
                            </div>
                          )}
                        </div>

                        <p className="text-xs text-stone-400 italic leading-relaxed mb-3 line-clamp-2">
                          &quot;{offer.message}&quot;
                        </p>

                        {offer.status === "pending" && (
                          <div className="flex gap-2 pt-3 border-t border-stone-100">
                            <Button variant="primary" size="sm" className="flex-1" onClick={() => acceptOffer(offer.id)}>
                              <CheckCircle className="w-4 h-4" />
                              Contratar
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => router.push(`/perfil/${worker.id}`)}>
                              Ver perfil
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleOpenChat(worker.id)}>
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                        {offer.status === "negotiating" && (
                          <div className="flex gap-2 pt-3 border-t border-stone-100">
                            <Button variant="primary" size="sm" className="flex-1" onClick={() => acceptOffer(offer.id)}>
                              Aceptar {formatCOPShort(offer.counterOfferPrice!)}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleOpenChat(worker.id)}>
                              <MessageSquare className="w-4 h-4" />
                              Chat
                            </Button>
                          </div>
                        )}
                        {offer.status === "accepted" && (
                          <div className="flex gap-2 pt-3 border-t border-stone-100">
                            <Button variant="soft" size="sm" onClick={() => handleOpenChat(worker.id)}>
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

          {/* Guest CTA */}
          {!isEmployer && !isWorker && job.status === "open" && (
            <div className="bg-azulejo-100 rounded-[16px] p-4 border border-azulejo-200 text-center">
              <p className="text-sm font-semibold text-azulejo-600 mb-1">
                ¿Quieres aplicar a este trabajo?
              </p>
              <p className="text-xs text-stone-500 mb-3">
                Inicia sesión como trabajador para enviar tu propuesta
              </p>
              <Link href="/login">
                <Button variant="primary" size="sm">Iniciar sesión</Button>
              </Link>
            </div>
          )}
        </div>
      </PageShell>

      <ApplyModal job={applyOpen ? job : null} onClose={() => setApplyOpen(false)} />
      <BottomNav />
    </div>
  );
}
