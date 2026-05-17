// No "use client" — StarDisplay is server-safe (pure JSX).
// StarPicker uses useState but is always rendered inside a "use client" parent (ReviewModal).
import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const sizes = {
  sm: "w-3.5 h-3.5",
  md: "w-5 h-5",
  lg: "w-7 h-7",
};

// ─── Display-only ─────────────────────────────────────────────────────────────

interface StarDisplayProps {
  value: number;
  size?: keyof typeof sizes;
  showValue?: boolean;
  className?: string;
}

export function StarDisplay({
  value,
  size = "sm",
  showValue = false,
  className,
}: StarDisplayProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              sizes[size],
              i < Math.floor(value)
                ? "fill-marigold-300 text-marigold-300"
                : i < value
                ? "fill-marigold-300/40 text-marigold-300/40"
                : "text-stone-300 fill-none"
            )}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-sm font-semibold text-ink">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}

// ─── Interactive picker ────────────────────────────────────────────────────────

interface StarPickerProps {
  value: number;
  onChange: (rating: number) => void;
  size?: keyof typeof sizes;
  className?: string;
}

const ratingLabels = ["", "Muy malo", "Malo", "Regular", "Bueno", "Excelente"];

export function StarPicker({
  value,
  onChange,
  size = "lg",
  className,
}: StarPickerProps) {
  const [hovered, setHovered] = useState(0);

  const active = hovered || value;

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div
        className="flex items-center gap-1"
        onMouseLeave={() => setHovered(0)}
      >
        {Array.from({ length: 5 }).map((_, i) => {
          const star = i + 1;
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHovered(star)}
              className="transition-transform hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 rounded-sm"
              aria-label={`${star} estrella${star > 1 ? "s" : ""}`}
            >
              <Star
                className={cn(
                  sizes[size],
                  "transition-colors",
                  star <= active
                    ? "fill-marigold-300 text-marigold-300"
                    : "text-stone-300 fill-none"
                )}
              />
            </button>
          );
        })}
      </div>
      <p
        className={cn(
          "text-sm font-semibold transition-colors h-5",
          active ? "text-marigold-400" : "text-stone-500"
        )}
      >
        {ratingLabels[active] ?? ""}
      </p>
    </div>
  );
}
