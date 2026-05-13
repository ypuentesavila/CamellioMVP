import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary-light text-primary",
        success: "bg-success/10 text-success",
        warning: "bg-accent-light text-accent",
        danger: "bg-danger/10 text-danger",
        neutral: "bg-background text-text-secondary border border-border",
        dark: "bg-primary-dark text-white",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({ className, variant, size, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full", {
            "bg-primary": variant === "default",
            "bg-success": variant === "success",
            "bg-accent": variant === "warning",
            "bg-danger": variant === "danger",
            "bg-text-secondary": variant === "neutral",
          })}
        />
      )}
      {children}
    </span>
  );
}

export { badgeVariants };
