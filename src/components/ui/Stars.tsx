import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarsProps {
  rating: number;
  count?: number;
  size?: "sm" | "md";
  showRating?: boolean;
  className?: string;
}

export function Stars({
  rating,
  count,
  size = "sm",
  showRating = true,
  className,
}: StarsProps) {
  const starClass = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  const rounded = Math.round(rating * 2) / 2;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i + 1 <= Math.floor(rounded);
          const half = !filled && i < rounded;
          return (
            <Star
              key={i}
              className={cn(
                starClass,
                filled || half
                  ? "fill-marigold-300 text-marigold-300"
                  : "fill-none text-stone-300"
              )}
              strokeWidth={1.5}
              style={half ? { clipPath: "inset(0 50% 0 0)" } : undefined}
            />
          );
        })}
      </div>

      {showRating && (
        <span
          className={cn(
            "font-semibold text-ink tnum",
            size === "sm" ? "text-xs" : "text-sm"
          )}
        >
          {rating.toFixed(1)}
        </span>
      )}

      {count !== undefined && (
        <span
          className={cn(
            "text-stone-500",
            size === "sm" ? "text-xs" : "text-sm"
          )}
        >
          ({count})
        </span>
      )}
    </div>
  );
}
