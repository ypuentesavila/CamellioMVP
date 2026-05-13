"use client";

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
                ? "fill-accent text-accent"
                : i < value
                ? "fill-accent/40 text-accent/40"
                : "text-border fill-none"
            )}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-sm font-semibold text-text-primary">
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
              className="transition-transform hover:scale-110 active:scale-95 focus:outline-none"
              aria-label={`${star} estrella${star > 1 ? "s" : ""}`}
            >
              <Star
                className={cn(
                  sizes[size],
                  "transition-colors",
                  star <= active
                    ? "fill-accent text-accent"
                    : "text-border fill-none"
                )}
              />
            </button>
          );
        })}
      </div>
      <p
        className={cn(
          "text-sm font-semibold transition-colors h-5",
          active ? "text-accent" : "text-text-secondary"
        )}
      >
        {ratingLabels[active] ?? ""}
      </p>
    </div>
  );
}
