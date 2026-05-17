import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Mosaico } from "@/components/brand/Mosaico";

interface EmptyStateAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "azulejo" | "outline" | "soft" | "ghost";
}

interface EmptyStateProps {
  icon?: LucideIcon;
  eyebrow?: string;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  variant?: "card" | "inline";
  mosaico?: boolean;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  eyebrow,
  title,
  description,
  action,
  variant = "card",
  mosaico = true,
  className,
}: EmptyStateProps) {
  const content = (
    <div className="relative flex flex-col items-start text-left z-10">
      {eyebrow && (
        <p className="eyebrow text-stone-500 mb-3">{eyebrow}</p>
      )}

      {Icon && (
        <div className="w-11 h-11 bg-paper rounded-xl flex items-center justify-center mb-4 border border-stone-200">
          <Icon className="w-5 h-5 text-stone-400" strokeWidth={1.5} />
        </div>
      )}

      <p className="text-base font-bold text-ink tracking-tight leading-snug">
        {title}
      </p>

      {description && (
        <p className="text-sm text-stone-500 mt-1.5 leading-relaxed max-w-xs">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-5">
          {action.href ? (
            <Link href={action.href}>
              <Button variant={action.variant ?? "primary"} size="md">
                {action.label}
              </Button>
            </Link>
          ) : (
            <Button
              variant={action.variant ?? "primary"}
              size="md"
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );

  if (variant === "inline") {
    return (
      <div className={cn("py-10 px-4 relative overflow-hidden", className)}>
        {mosaico && (
          <div className="absolute top-0 right-0 opacity-30">
            <Mosaico density="sparse" opacity={1} />
          </div>
        )}
        {content}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-card rounded-[16px] border border-dashed border-stone-200 p-6",
        className
      )}
    >
      {mosaico && (
        <div className="absolute top-0 right-0 opacity-25 pointer-events-none">
          <Mosaico density="sparse" opacity={1} />
        </div>
      )}
      {content}
    </div>
  );
}
