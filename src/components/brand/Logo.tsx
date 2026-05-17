import { cn } from "@/lib/utils";
import { BrandMark } from "./BrandMark";
import { Wordmark } from "./Wordmark";

interface LogoProps {
  variant?: "horizontal" | "compact" | "mark-only";
  size?: "sm" | "md" | "lg";
  onDark?: boolean;
  className?: string;
}

const markSize = { sm: 28, md: 36, lg: 48 };
const wordSize = { sm: "sm", md: "md", lg: "lg" } as const;

export function Logo({
  variant = "horizontal",
  size = "md",
  onDark = false,
  className,
}: LogoProps) {
  if (variant === "mark-only") {
    return (
      <BrandMark size={markSize[size]} onDark={onDark} className={className} />
    );
  }

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <BrandMark size={markSize["sm"]} onDark={onDark} />
        <Wordmark size="sm" onDark={onDark} />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <BrandMark size={markSize[size]} onDark={onDark} />
      <Wordmark size={wordSize[size]} onDark={onDark} />
    </div>
  );
}
