import { CheckCircle } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { StarDisplay } from "@/components/ui/StarRating";
import { timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";

interface ReviewCardProps {
  rating: number;
  comment: string;
  createdAt: string;
  authorName: string;
  authorRole?: "worker" | "employer";
  jobTitle?: string;
  verified?: boolean;
  className?: string;
}

export function ReviewCard({
  rating,
  comment,
  createdAt,
  authorName,
  authorRole,
  jobTitle,
  verified = true,
  className,
}: ReviewCardProps) {
  return (
    <div
      className={cn(
        "bg-surface rounded-xl p-4 shadow-card border border-border",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <Avatar name={authorName} size="sm" />
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-text-primary">
                {authorName}
              </p>
              {verified && (
                <CheckCircle className="w-3.5 h-3.5 text-primary" />
              )}
            </div>
            {authorRole && (
              <p className="text-xs text-text-secondary capitalize">
                {authorRole === "worker" ? "Trabajador" : "Empleador"}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <StarDisplay value={rating} size="sm" />
          <span className="text-xs text-text-secondary">
            {timeAgo(createdAt)}
          </span>
        </div>
      </div>

      {/* Comment */}
      <p className="text-sm text-text-secondary leading-relaxed italic">
        &quot;{comment}&quot;
      </p>

      {/* Job reference */}
      {jobTitle && (
        <p className="text-xs text-text-secondary mt-2 pt-2 border-t border-border">
          Trabajo:{" "}
          <span className="font-medium text-text-primary">{jobTitle}</span>
        </p>
      )}
    </div>
  );
}
