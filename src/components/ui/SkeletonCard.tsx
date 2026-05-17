import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
  minHeight?: number;
}

export function SkeletonCard({ className, minHeight = 140 }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-[16px] border border-stone-200 overflow-hidden",
        className
      )}
      style={{ minHeight }}
      aria-busy="true"
      aria-label="Cargando..."
    >
      <div className="shimmer h-full w-full" style={{ minHeight }} />
    </div>
  );
}

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
}

export function FadeIn({ children, className }: FadeInProps) {
  return (
    <div className={cn("animate-fade-in", className)}>
      {children}
    </div>
  );
}

export function SkeletonWorkerCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-card rounded-[16px] border border-stone-200 p-4",
        className
      )}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="shimmer w-12 h-12 rounded-full shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="shimmer h-4 w-32 rounded-full" />
          <div className="shimmer h-3 w-24 rounded-full" />
          <div className="shimmer h-3 w-20 rounded-full" />
        </div>
        <div className="shimmer h-6 w-16 rounded-full shrink-0" />
      </div>
      <div className="shimmer h-3 w-full rounded-full mb-2" />
      <div className="shimmer h-3 w-2/3 rounded-full mb-4" />
      <div className="flex gap-2">
        <div className="shimmer h-9 flex-1 rounded-xl" />
        <div className="shimmer h-9 w-12 rounded-xl" />
      </div>
    </div>
  );
}

export function SkeletonRequestCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-card rounded-[16px] border border-stone-200 p-4",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex flex-col gap-2 flex-1">
          <div className="shimmer h-4 w-40 rounded-full" />
          <div className="flex gap-2">
            <div className="shimmer h-5 w-20 rounded-full" />
            <div className="shimmer h-5 w-16 rounded-full" />
          </div>
        </div>
        <div className="shimmer h-5 w-20 rounded-full shrink-0" />
      </div>
      <div className="shimmer h-3 w-1/3 rounded-full mb-4" />
      <div className="pt-3 border-t border-stone-200 flex justify-between items-center">
        <div className="shimmer h-3 w-28 rounded-full" />
        <div className="shimmer h-9 w-28 rounded-xl" />
      </div>
    </div>
  );
}
