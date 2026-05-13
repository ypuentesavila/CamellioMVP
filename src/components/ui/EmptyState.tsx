import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface EmptyStateAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  variant?: "card" | "inline";
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = "card",
  className,
}: EmptyStateProps) {
  const content = (
    <div className="flex flex-col items-center text-center">
      <div className="w-14 h-14 bg-background rounded-full flex items-center justify-center mb-3 border border-border">
        <Icon className="w-6 h-6 text-border" strokeWidth={1.5} />
      </div>
      <p className="text-sm font-semibold text-text-primary">{title}</p>
      {description && (
        <p className="text-xs text-text-secondary mt-1 leading-relaxed max-w-[200px]">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-4">
          {action.href ? (
            <Link href={action.href}>
              <Button variant={action.variant ?? "primary"} size="sm">
                {action.label}
              </Button>
            </Link>
          ) : (
            <Button
              variant={action.variant ?? "primary"}
              size="sm"
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
    return <div className={cn("py-8 px-4", className)}>{content}</div>;
  }

  return (
    <div
      className={cn(
        "bg-surface rounded-xl border border-dashed border-border p-8",
        className
      )}
    >
      {content}
    </div>
  );
}
