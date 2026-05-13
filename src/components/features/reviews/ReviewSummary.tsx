import { Star } from "lucide-react";
import { StarDisplay } from "@/components/ui/StarRating";
import { cn } from "@/lib/utils";
import type { Review } from "@/types";

interface ReviewSummaryProps {
  reviews: Review[];
  className?: string;
}

export function ReviewSummary({ reviews, className }: ReviewSummaryProps) {
  if (reviews.length === 0) {
    return (
      <div
        className={cn(
          "bg-surface rounded-xl p-5 shadow-card border border-border text-center",
          className
        )}
      >
        <Star className="w-8 h-8 text-border mx-auto mb-2" />
        <p className="text-sm text-text-secondary">Sin reseñas todavía</p>
      </div>
    );
  }

  const average =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    return { star, count, pct: Math.round((count / reviews.length) * 100) };
  });

  return (
    <div
      className={cn(
        "bg-surface rounded-xl p-5 shadow-card border border-border",
        className
      )}
    >
      <div className="flex items-center gap-5">
        {/* Big number */}
        <div className="flex flex-col items-center shrink-0">
          <p className="text-5xl font-bold text-text-primary leading-none">
            {average.toFixed(1)}
          </p>
          <StarDisplay value={average} size="sm" className="mt-2" />
          <p className="text-xs text-text-secondary mt-1">
            {reviews.length} reseña{reviews.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Distribution bars */}
        <div className="flex-1 flex flex-col gap-1.5">
          {distribution.map(({ star, count, pct }) => (
            <div key={star} className="flex items-center gap-2">
              <span className="text-xs text-text-secondary w-3 shrink-0 text-right">
                {star}
              </span>
              <Star className="w-3 h-3 text-accent fill-accent shrink-0" />
              <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-text-secondary w-4 shrink-0">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
