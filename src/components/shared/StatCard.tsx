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
    iconBg: "bg-primary-light",
    iconColor: "text-primary",
    value: "text-text-primary",
  },
  primary: {
    iconBg: "bg-primary",
    iconColor: "text-white",
    value: "text-primary",
  },
  success: {
    iconBg: "bg-success/10",
    iconColor: "text-success",
    value: "text-success",
  },
  warning: {
    iconBg: "bg-accent-light",
    iconColor: "text-accent",
    value: "text-accent",
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
        "bg-surface rounded-xl p-4 shadow-card border border-border",
        className
      )}
    >
      {Icon && (
        <div
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center mb-3",
            v.iconBg
          )}
        >
          <Icon className={cn("w-4 h-4", v.iconColor)} />
        </div>
      )}
      <p className={cn("text-xl font-bold leading-none", v.value)}>{value}</p>
      <p className="text-xs text-text-secondary mt-1 leading-tight">{label}</p>
      {sub && <p className="text-xs text-success font-medium mt-1">{sub}</p>}
    </div>
  );
}
