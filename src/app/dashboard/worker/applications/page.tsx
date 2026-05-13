"use client";

import Link from "next/link";
import { ArrowLeft, Clock, MessageSquare, CheckCircle, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { PageShell } from "@/components/layout/PageShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAuth, useJobs } from "@/context";
import { formatCOP, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";

const statusConfig = {
  pending: { label: "Pendiente", variant: "default" as const, icon: Clock },
  negotiating: { label: "Negociando", variant: "warning" as const, icon: MessageSquare },
  accepted: { label: "Aceptada ✓", variant: "success" as const, icon: CheckCircle },
  rejected: { label: "Rechazada", variant: "danger" as const, icon: AlertCircle },
  withdrawn: { label: "Retirada", variant: "neutral" as const, icon: AlertCircle },
};

const STATUS_ORDER = ["accepted", "negotiating", "pending", "rejected", "withdrawn"];

export default function WorkerApplicationsPage() {
  const { user } = useAuth();
  const { jobs, offers, withdrawOffer } = useJobs();

  const workerId = user?.id ?? "u1";
  const myOffers = offers
    .filter((o) => o.workerId === workerId)
    .sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status));

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <Navbar />

      <div className="bg-surface border-b border-border">
        <PageShell className="py-4">
          <Link
            href="/dashboard/worker"
            className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Mi dashboard
          </Link>
          <h1 className="text-xl font-bold text-text-primary">Mis postulaciones</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            {myOffers.length} postulación{myOffers.length !== 1 ? "es" : ""}
          </p>
        </PageShell>
      </div>

      <PageShell className="py-5">
        {myOffers.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="Sin postulaciones todavía"
            description="Explora los trabajos disponibles y envía tu primera propuesta."
            action={{ label: "Explorar trabajos", href: "/explorar" }}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {myOffers.map((offer) => {
              const job = jobs.find((j) => j.id === offer.jobId);
              const s = statusConfig[offer.status];
              const SIcon = s.icon;
              const canWithdraw = offer.status === "pending" || offer.status === "negotiating";

              return (
                <div
                  key={offer.id}
                  className={cn(
                    "bg-surface rounded-xl p-4 shadow-card border transition-colors",
                    offer.status === "accepted"
                      ? "border-success/30 bg-success/5"
                      : "border-border"
                  )}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/trabajos/${offer.jobId}`}
                        className="font-semibold text-text-primary text-sm hover:text-primary transition-colors truncate block"
                      >
                        {job?.title ?? "Trabajo"}
                      </Link>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {job?.location} · {timeAgo(offer.createdAt)}
                      </p>
                    </div>
                    <Badge variant={s.variant} size="sm" className="shrink-0">
                      <SIcon className="w-3 h-3" />
                      {s.label}
                    </Badge>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 p-3 bg-background rounded-lg">
                      <p className="text-xs text-text-secondary">Tu propuesta</p>
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
                    <div className="flex-1 p-3 bg-background rounded-lg">
                      <p className="text-xs text-text-secondary">Duración</p>
                      <p className="text-sm font-semibold text-text-primary">
                        {offer.estimatedDuration}
                      </p>
                    </div>
                  </div>

                  {/* Message preview */}
                  <p className="text-xs text-text-secondary italic leading-relaxed line-clamp-2 mb-3">
                    &quot;{offer.message}&quot;
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-border">
                    <Link href={`/trabajos/${offer.jobId}`}>
                      <Button variant="secondary" size="sm">Ver trabajo</Button>
                    </Link>
                    {canWithdraw && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => withdrawOffer(offer.id)}
                        className="text-danger hover:text-danger"
                      >
                        Retirar
                      </Button>
                    )}
                    {offer.status === "accepted" && (
                      <Link href="/mensajes">
                        <Button variant="primary" size="sm">
                          <MessageSquare className="w-4 h-4" />
                          Ir al chat
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </PageShell>

      <BottomNav />
    </div>
  );
}
