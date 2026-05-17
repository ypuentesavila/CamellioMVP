import { cn } from "@/lib/utils";

interface BrandMarkProps {
  size?: number;
  onDark?: boolean;
  className?: string;
}

export function BrandMark({ size = 40, onDark = false, className }: BrandMarkProps) {
  const rx = size * 0.28;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      {/* Tile background */}
      <rect
        width="40"
        height="40"
        rx={rx}
        fill={onDark ? "rgba(247,242,230,0.12)" : "#1E2A3A"}
      />

      {/* C ring — azulejo-500 */}
      <path
        d="M27.5 13.5 A9.5 9.5 0 1 0 27.5 26.5"
        stroke={onDark ? "#B6CCE8" : "#234478"}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Dot — marigold-300 */}
      <circle cx="27.5" cy="13.5" r="3.2" fill="#F3B033" />
    </svg>
  );
}
