import { ShieldCheck, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerificationBadgeProps {
  level: 1 | 2 | 3;
  size?: "sm" | "md";
  className?: string;
}

const CONFIG = {
  1: {
    label: "Identidad verificada",
    icon: ShieldCheck,
    container: "bg-stone-100 border border-stone-200",
    text: "text-stone-600",
    icon_color: "text-stone-400",
  },
  2: {
    label: "Trabajador verificado",
    icon: ShieldCheck,
    container: "bg-forest-100",
    text: "text-forest-600",
    icon_color: "text-forest-500",
  },
  3: {
    label: "Maestro Camellio",
    icon: Award,
    container: "bg-ink",
    text: "text-marigold-300",
    icon_color: "text-marigold-300",
  },
};

export function VerificationBadge({
  level,
  size = "md",
  className,
}: VerificationBadgeProps) {
  const cfg = CONFIG[level];
  const Icon = cfg.icon;

  const iconSize = size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5";
  const textSize = size === "sm" ? "text-[10px]" : "text-xs";
  const padding = size === "sm" ? "px-2 py-0.5 gap-1" : "px-2.5 py-1 gap-1.5";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold",
        cfg.container,
        cfg.text,
        padding,
        className
      )}
    >
      <Icon className={cn(iconSize, cfg.icon_color)} strokeWidth={2} />
      <span className={textSize}>{cfg.label}</span>
    </span>
  );
}
