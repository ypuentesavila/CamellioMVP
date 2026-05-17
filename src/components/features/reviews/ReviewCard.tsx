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
        "bg-card rounded-[16px] p-4 border border-stone-200",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <Avatar name={authorName} size="sm" />
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-ink">{authorName}</p>
              {verified && (
                <CheckCircle className="w-3.5 h-3.5 text-forest-500" />
              )}
            </div>
            {authorRole && (
              <p className="text-xs text-stone-500 capitalize">
                {authorRole === "worker" ? "Trabajador" : "Empleador"}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <StarDisplay value={rating} size="sm" />
          <span className="text-xs text-stone-400">{timeAgo(createdAt)}</span>
        </div>
      </div>

      <p className="text-sm text-stone-500 leading-relaxed italic">
        &quot;{comment}&quot;
      </p>

      {jobTitle && (
        <p className="text-xs text-stone-400 mt-2 pt-2 border-t border-stone-100">
          Trabajo:{" "}
          <span className="font-medium text-ink">{jobTitle}</span>
        </p>
      )}
    </div>
  );
}
