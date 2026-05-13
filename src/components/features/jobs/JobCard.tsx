"use client";

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

  return (
    <div
      className={cn(
        "bg-surface rounded-xl border border-border shadow-card card-hover",
        isCompact
          ? "flex-shrink-0 w-64 snap-start p-4"
          : "w-full p-5"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <Badge variant={urgency.variant} size="sm">
          {urgency.label}
        </Badge>
        <span className="text-sm font-bold text-primary shrink-0">
          {formatCOPShort(job.budget.min)}–{formatCOPShort(job.budget.max)}
        </span>
      </div>

      {/* Title */}
      <h3
        className={cn(
          "font-semibold text-text-primary leading-snug",
          isCompact ? "text-sm" : "text-base"
        )}
      >
        {isCompact
          ? job.title.length > 48
            ? job.title.slice(0, 48) + "…"
            : job.title
          : job.title}
      </h3>

      {/* Description — full variant only */}
      {!isCompact && (
        <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 mt-1">
          {job.description}
        </p>
      )}

      {/* Meta */}
      <div className="flex items-center gap-1.5 text-text-secondary mt-2">
        <MapPin className="w-3.5 h-3.5 shrink-0" />
        <span className="text-xs">{job.location}</span>
        <span className="text-xs text-border">·</span>
        <span className="text-xs">{timeAgo(job.createdAt)}</span>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-text-secondary">
          <Users className="w-3.5 h-3.5" />
          <span className="text-xs">
            {job.offerCount} propuesta{job.offerCount !== 1 ? "s" : ""}
          </span>
        </div>

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
              onClick={() => onApply?.(job)}
              className="flex items-center gap-0.5 text-xs font-semibold text-primary hover:gap-1.5 transition-all duration-150"
            >
              Postularme
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )
        )}
      </div>
    </div>
  );
}
