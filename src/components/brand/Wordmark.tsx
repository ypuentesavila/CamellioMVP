import { cn } from "@/lib/utils";

interface WordmarkProps {
  size?: "sm" | "md" | "lg";
  onDark?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-3xl",
};

export function Wordmark({ size = "md", onDark = false, className }: WordmarkProps) {
  return (
    <span
      className={cn(
        "font-bold select-none",
        sizeClasses[size],
        onDark ? "text-paper" : "text-ink",
        className
      )}
      style={{
        fontFamily: "var(--font-geist-sans, var(--font-sans), system-ui)",
        letterSpacing: "-0.035em",
        fontWeight: 700,
      }}
    >
      camellio
    </span>
  );
}
