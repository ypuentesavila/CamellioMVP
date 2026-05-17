"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-ink text-paper hover:bg-ink/90",
        azulejo:
          "bg-azulejo-500 text-white hover:bg-azulejo-600",
        marigold:
          "bg-marigold-300 text-ink hover:bg-marigold-400",
        outline:
          "border border-stone-200 bg-transparent text-ink hover:bg-stone-100",
        soft:
          "bg-stone-100 text-ink hover:bg-stone-200",
        ghost:
          "text-stone-500 hover:text-ink hover:bg-stone-100",
        danger:
          "bg-danger text-white hover:bg-red-700",
        // Legacy aliases
        secondary:
          "bg-azulejo-100 text-azulejo-500 hover:bg-azulejo-200",
        accent:
          "bg-marigold-300 text-ink hover:bg-marigold-400",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export function Button({
  className,
  variant,
  size,
  loading,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

export { buttonVariants };
