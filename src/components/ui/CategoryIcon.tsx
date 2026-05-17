import {
  Droplets,
  Zap,
  Hammer,
  PaintBucket,
  Sparkles,
  Package,
  Key,
  Bug,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  plomeria:      Droplets,
  electricidad:  Zap,
  carpinteria:   Hammer,
  pintura:       PaintBucket,
  limpieza:      Sparkles,
  mudanzas:      Package,
  cerrajeria:    Key,
  fumigacion:    Bug,
};

interface CategoryIconProps {
  slug: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const TILE_SIZES = {
  sm: "w-9 h-9",
  md: "w-11 h-11",
  lg: "w-14 h-14",
};

const ICON_SIZES = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

export function CategoryIcon({ slug, size = "md", className }: CategoryIconProps) {
  const Icon = ICON_MAP[slug] ?? Package;

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-xl bg-azulejo-100",
        TILE_SIZES[size],
        className
      )}
    >
      <Icon
        className={cn(ICON_SIZES[size], "text-azulejo-600")}
        strokeWidth={1.75}
        aria-hidden="true"
      />
    </div>
  );
}

export function getCategoryIcon(slug: string): LucideIcon {
  return ICON_MAP[slug] ?? Package;
}
