import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  icon?: LucideIcon;
  sub?: string;
  variant?: "default" | "primary" | "success" | "warning";
  className?: string;
}

const variants = {
  default: {
    iconBg: "bg-azulejo-100",
    iconColor: "text-azulejo-500",
    value: "text-ink",
  },
  primary: {
    iconBg: "bg-ink",
    iconColor: "text-paper",
    value: "text-ink",
  },
  success: {
    iconBg: "bg-forest-100",
    iconColor: "text-forest-500",
    value: "text-forest-600",
  },
  warning: {
    iconBg: "bg-marigold-100",
    iconColor: "text-marigold-400",
    value: "text-marigold-400",
  },
};

export function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  variant = "default",
  className,
}: StatCardProps) {
  const v = variants[variant];
  return (
    <div
      className={cn(
        "bg-card rounded-[16px] p-4 border border-stone-200",
        className
      )}
    >
      {Icon && (
        <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center mb-3", v.iconBg)}>
          <Icon className={cn("w-4 h-4", v.iconColor)} strokeWidth={1.75} />
        </div>
      )}
      <p className={cn("text-xl font-bold leading-none tnum", v.value)}>{value}</p>
      <p className="text-xs text-stone-400 mt-1 leading-tight">{label}</p>
      {sub && <p className="text-xs text-forest-500 font-medium mt-1">{sub}</p>}
    </div>
  );
}
