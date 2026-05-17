import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full font-medium",
  {
    variants: {
      variant: {
        neutral:
          "bg-stone-100 text-stone-600 border border-stone-200",
        azulejo:
          "bg-azulejo-100 text-azulejo-600",
        marigold:
          "bg-marigold-100 text-ink",
        forest:
          "bg-forest-100 text-forest-600",
        amber:
          "bg-amber-100 text-amber-500",
        ink:
          "bg-ink text-paper",
        outline:
          "border border-stone-200 text-stone-600 bg-transparent",
        // Legacy aliases
        default:
          "bg-azulejo-100 text-azulejo-600",
        success:
          "bg-forest-100 text-forest-600",
        warning:
          "bg-marigold-100 text-ink",
        danger:
          "bg-red-50 text-danger border border-red-100",
        dark:
          "bg-ink text-paper",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "md",
    },
  }
);

const dotColors: Record<string, string> = {
  neutral: "bg-stone-400",
  azulejo: "bg-azulejo-500",
  marigold: "bg-marigold-300",
  forest: "bg-forest-500",
  amber: "bg-amber-500",
  ink: "bg-paper",
  outline: "bg-stone-400",
  default: "bg-azulejo-500",
  success: "bg-forest-500",
  warning: "bg-marigold-300",
  danger: "bg-danger",
  dark: "bg-paper",
};

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({
  className,
  variant,
  size,
  dot,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            dotColors[variant ?? "neutral"]
          )}
        />
      )}
      {children}
    </span>
  );
}

export { badgeVariants };
