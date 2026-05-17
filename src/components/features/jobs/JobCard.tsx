"use client";

import Link from "next/link";
import { MapPin, Users, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context";
import { useJobs } from "@/context";
import { formatCOPShort, timeAgo } from "@/lib/format";
import type { Job } from "@/types";

const urgencyConfig = {
  urgent: { label: "Urgente", variant: "danger" as const },
  this_week: { label: "Esta semana", variant: "warning" as const },
  flexible: { label: "Flexible", variant: "neutral" as const },
};

const offerStatusBadge = {
  pending: { label: "Postulado", variant: "default" as const, dot: true },
  negotiating: { label: "Negociando", variant: "warning" as const, dot: true },
  accepted: { label: "Contratado", variant: "success" as const, dot: true },
  rejected: { label: "Rechazada", variant: "danger" as const, dot: false },
  withdrawn: { label: "Retirado", variant: "neutral" as const, dot: false },
};

interface JobCardProps {
  job: Job;
  variant?: "compact" | "full";
  onApply?: (job: Job) => void;
}

export function JobCard({ job, variant = "compact", onApply }: JobCardProps) {
  const { user, isWorker } = useAuth();
  const { offers } = useJobs();

  const existingOffer = user
    ? offers.find((o) => o.jobId === job.id && o.workerId === user.id)
    : undefined;

  const urgency = urgencyConfig[job.urgency];
  const isCompact = variant === "compact";

  const cardContent = (
    <>
      <div className="flex items-start justify-between gap-2 mb-3">
        <Badge variant={urgency.variant} size="sm">{urgency.label}</Badge>
        <span className="text-sm font-bold text-ink shrink-0 tnum">
          {formatCOPShort(job.budget.min)}–{formatCOPShort(job.budget.max)}
        </span>
      </div>

      <h3 className={cn("font-semibold text-ink leading-snug", isCompact ? "text-sm" : "text-base")}>
        {isCompact
          ? job.title.length > 48 ? job.title.slice(0, 48) + "…" : job.title
          : job.title}
      </h3>

      {!isCompact && (
        <p className="text-sm text-stone-500 leading-relaxed line-clamp-2 mt-1">
          {job.description}
        </p>
      )}

      <div className="flex items-center gap-1.5 text-stone-400 mt-2">
        <MapPin className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
        <span className="text-xs">{job.location}</span>
        <span className="text-xs text-stone-200">·</span>
        <span className="text-xs">{timeAgo(job.createdAt)}</span>
      </div>

      <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-stone-400">
          <Users className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span className="text-xs">
            {job.offerCount} propuesta{job.offerCount !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {!isCompact && (
            <Link
              href={`/trabajos/${job.id}`}
              className="text-xs text-stone-400 hover:text-ink transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Ver detalles
            </Link>
          )}

          {isWorker && (
            existingOffer ? (
              <Badge
                variant={offerStatusBadge[existingOffer.status].variant}
                dot={offerStatusBadge[existingOffer.status].dot}
                size="sm"
              >
                {offerStatusBadge[existingOffer.status].label}
              </Badge>
            ) : (
              <button
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); onApply?.(job); }}
                className="flex items-center gap-0.5 text-xs font-semibold text-ink hover:gap-1.5 transition-all duration-150"
              >
                Postularme
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )
          )}

          {isCompact && !isWorker && (
            <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
          )}
        </div>
      </div>
    </>
  );

  if (isCompact) {
    return (
      <Link
        href={`/trabajos/${job.id}`}
        className="block bg-card rounded-[16px] border border-stone-200 shadow-card card-hover flex-shrink-0 w-64 snap-start p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div className="bg-card rounded-[16px] border border-stone-200 shadow-card w-full p-5 card-hover">
      {cardContent}
    </div>
  );
}
