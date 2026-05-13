"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle, MessageSquare, Users, Clock, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { PageShell } from "@/components/layout/PageShell";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { StarDisplay } from "@/components/ui/StarRating";
import { useAuth, useJobs, useChat } from "@/context";
import { getUserById } from "@/data/users";
import { formatCOP, formatCOPShort, timeAgo } from "@/lib/format";

const statusConfig = {
  pending: { label: "Pendiente", variant: "neutral" as const },
  negotiating: { label: "Negociando", variant: "warning" as const },
  accepted: { label: "Aceptada", variant: "success" as const },
  rejected: { label: "Rechazada", variant: "danger" as const },
  withdrawn: { label: "Retirada", variant: "neutral" as const },
};

export default function EmployerApplicantsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { jobs, offers, acceptOffer, rejectOffer } = useJobs();
  const { createChat } = useChat();

  const employerId = user?.id ?? "u8";
  const employerJobs = jobs.filter((j) => j.employerId === employerId && j.status === "open");
  const allOffers = offers.filter((o) => o.employerId === employerId);

  function handleOpenChat(workerId: string, jobId: string) {
    const chat = createChat(jobId, [workerId, employerId]);
    router.push(`/mensajes/${chat.id}`);
  }

  const totalPending = allOffers.filter(
    (o) => o.status === "pending" || o.status === "negotiating"
  ).length;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <Navbar />

      <div className="bg-surface border-b border-border">
        <PageShell className="py-4">
          <Link
            href="/dashboard/employer"
            className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Mi dashboard
          </Link>
          <h1 className="text-xl font-bold text-text-primary">Postulantes</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            {totalPending} pendiente{totalPending !== 1 ? "s" : ""} · {allOffers.length} total
          </p>
        </PageShell>
      </div>

      <PageShell className="py-5">
        {allOffers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Sin postulantes todavía"
            description="Cuando los trabajadores apliquen a tus publicaciones, aparecerán aquí."
            action={{ label: "Ver mis trabajos", href: "/dashboard/employer" }}
          />
        ) : (
          <div className="flex flex-col gap-6">
            {/* Group by job */}
            {employerJobs.map((job) => {
              const jobOffers = allOffers.filter((o) => o.jobId === job.id);
              if (jobOffers.length === 0) return null;

              return (
                <div key={job.id}>
                  <div className="flex items-center justify-between mb-3">
                    <Link
                      href={`/trabajos/${job.id}`}
                      className="text-sm font-bold text-text-primary hover:text-primary transition-colors truncate"
                    >
                      {job.title}
                    </Link>
                    <Badge variant="default" size="sm">{jobOffers.length}</Badge>
                  </div>

                  <div className="flex flex-col gap-3">
                    {jobOffers.map((offer) => {
                      const worker = getUserById(offer.workerId);
                      if (!worker) return null;
                      const s = statusConfig[offer.status];
                      const isPending = offer.status === "pending" || offer.status === "negotiating";

                      return (
                        <div key={offer.id} className="bg-surface rounded-xl p-4 shadow-card border border-border">
                          {/* Worker */}
                          <div className="flex items-start gap-3 mb-3">
                            <Avatar name={worker.name} size="md" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="text-sm font-semibold text-text-primary">
                                    {worker.name}
                                  </p>
                                  <p className="text-xs text-text-secondary">
                                    {worker.workerProfile?.category}
                                  </p>
                                </div>
                                <Badge variant={s.variant} size="sm" className="shrink-0">
                                  {s.label}
                                </Badge>
                              </div>
                              {worker.workerProfile && (
                                <div className="flex items-center gap-1.5 mt-1">
                                  <StarDisplay value={worker.workerProfile.rating} size="sm" />
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
                              <p className="text-sm font-bold text-text-primary">
                                {formatCOP(offer.proposedPrice)}
                              </p>
                            </div>
                            {offer.counterOfferPrice && (
                              <div className="flex-1 p-3 bg-primary-light rounded-lg">
                                <p className="text-xs text-primary">Acordado</p>
                                <p className="text-sm font-bold text-primary">
                                  {formatCOP(offer.counterOfferPrice)}
                                </p>
                              </div>
                            )}
                          </div>

                          <p className="text-xs text-text-secondary italic line-clamp-2 mb-3">
                            &quot;{offer.message}&quot;
                          </p>

                          <div className="flex gap-2 pt-3 border-t border-border">
                            {isPending && (
                              <Button
                                variant="primary"
                                size="sm"
                                className="flex-1"
                                onClick={() => acceptOffer(offer.id)}
                              >
                                <CheckCircle className="w-4 h-4" />
                                {offer.status === "negotiating"
                                  ? `Aceptar ${formatCOPShort(offer.counterOfferPrice!)}`
                                  : "Contratar"}
                              </Button>
                            )}
                            <Link href={`/perfil/${worker.id}`}>
                              <Button variant="outline" size="sm">Ver perfil</Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenChat(worker.id, job.id)}
                            >
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Offers from jobs not currently open (completed, etc.) */}
            {allOffers.filter((o) => !employerJobs.some((j) => j.id === o.jobId)).length > 0 && (
              <div>
                <p className="text-sm font-bold text-text-secondary mb-3">Trabajos finalizados</p>
                <div className="flex flex-col gap-3">
                  {allOffers
                    .filter((o) => !employerJobs.some((j) => j.id === o.jobId))
                    .map((offer) => {
                      const job = jobs.find((j) => j.id === offer.jobId);
                      const worker = getUserById(offer.workerId);
                      if (!worker) return null;
                      const s = statusConfig[offer.status];

                      return (
                        <div key={offer.id} className="bg-surface rounded-xl p-4 border border-border opacity-70">
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-xs text-text-secondary truncate">{job?.title}</p>
                              <p className="text-sm font-semibold text-text-primary">{worker.name}</p>
                              <p className="text-xs text-text-secondary">{formatCOP(offer.proposedPrice)}</p>
                            </div>
                            <Badge variant={s.variant} size="sm">{s.label}</Badge>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        )}
      </PageShell>

      <BottomNav />
    </div>
  );
}
