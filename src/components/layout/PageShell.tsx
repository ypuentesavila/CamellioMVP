import { cn } from "@/lib/utils";

const maxWidthClasses = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-5xl",
  xl: "max-w-7xl",
  full: "max-w-full",
};

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: keyof typeof maxWidthClasses;
}

export function PageShell({
  children,
  className,
  maxWidth = "xl",
}: PageShellProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        maxWidthClasses[maxWidth],
        className
      )}
    >
      {children}
    </div>
  );
}
