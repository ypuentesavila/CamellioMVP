import { cn } from "@/lib/utils";

// ─── Base ─────────────────────────────────────────────────────────────────────

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse bg-border/60 rounded-lg", className)} />
  );
}

// ─── Primitives ───────────────────────────────────────────────────────────────

export function SkeletonAvatar({ size = "md" }: { size?: "sm" | "md" | "lg" | "xl" }) {
  const sizes = { sm: "w-8 h-8", md: "w-10 h-10", lg: "w-12 h-12", xl: "w-16 h-16" };
  return <Skeleton className={cn("rounded-full shrink-0", sizes[size])} />;
}

export function SkeletonText({
  width = "full",
  height = "h-3.5",
}: {
  width?: "full" | "3/4" | "2/3" | "1/2" | "1/3" | "1/4";
  height?: string;
}) {
  const widths = {
    full: "w-full",
    "3/4": "w-3/4",
    "2/3": "w-2/3",
    "1/2": "w-1/2",
    "1/3": "w-1/3",
    "1/4": "w-1/4",
  };
  return <Skeleton className={cn(height, widths[width], "rounded-full")} />;
}

// ─── Composed skeletons ────────────────────────────────────────────────────────

export function SkeletonStatCard() {
  return (
    <div className="bg-surface rounded-xl p-4 border border-border">
      <Skeleton className="w-8 h-8 rounded-lg mb-3" />
      <Skeleton className="h-5 w-14 rounded-full mb-1.5" />
      <Skeleton className="h-3 w-20 rounded-full" />
    </div>
  );
}

export function SkeletonJobCardCompact() {
  return (
    <div className="flex-shrink-0 w-64 snap-start bg-surface rounded-xl p-4 border border-border">
      <div className="flex items-start justify-between mb-3">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-4 w-16 rounded-full" />
      </div>
      <Skeleton className="h-3.5 w-full rounded-full mb-1.5" />
      <Skeleton className="h-3.5 w-2/3 rounded-full mb-3" />
      <Skeleton className="h-3 w-1/2 rounded-full" />
      <div className="mt-3 pt-3 border-t border-border flex justify-between">
        <Skeleton className="h-3 w-16 rounded-full" />
        <Skeleton className="h-3 w-14 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonJobCardFull() {
  return (
    <div className="bg-surface rounded-xl p-4 border border-border">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <Skeleton className="h-4 w-3/4 rounded-full mb-2" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-5 w-20 rounded-full shrink-0" />
      </div>
      <Skeleton className="h-3 w-1/3 rounded-full mb-3" />
      <div className="pt-3 border-t border-border flex justify-between">
        <Skeleton className="h-3 w-24 rounded-full" />
        <Skeleton className="h-8 w-28 rounded-xl" />
      </div>
    </div>
  );
}

export function SkeletonChatItem() {
  return (
    <div className="flex items-start gap-3 px-4 py-3.5 border-b border-border">
      <SkeletonAvatar size="md" />
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-3.5 w-28 rounded-full" />
          <Skeleton className="h-3 w-10 rounded-full" />
        </div>
        <Skeleton className="h-3 w-36 rounded-full" />
        <Skeleton className="h-3 w-3/4 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonOfferItem() {
  return (
    <div className="bg-surface rounded-xl p-4 border border-border flex items-center justify-between gap-3">
      <div className="min-w-0 flex-1 flex flex-col gap-1.5">
        <Skeleton className="h-3.5 w-2/3 rounded-full" />
        <Skeleton className="h-3 w-1/2 rounded-full" />
        <Skeleton className="h-3 w-1/3 rounded-full" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full shrink-0" />
    </div>
  );
}

export function SkeletonActiveJob() {
  return (
    <div className="bg-surface rounded-xl p-4 border border-border">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1 flex flex-col gap-1.5">
          <Skeleton className="h-4 w-3/4 rounded-full" />
          <Skeleton className="h-3 w-1/2 rounded-full" />
          <Skeleton className="h-3 w-20 rounded-full" />
        </div>
        <Skeleton className="h-5 w-24 rounded-full shrink-0" />
      </div>
      <div className="pt-3 border-t border-border flex gap-2">
        <Skeleton className="h-8 w-28 rounded-xl" />
        <Skeleton className="h-8 w-20 rounded-xl" />
      </div>
    </div>
  );
}

export function SkeletonApplicantCard() {
  return (
    <div className="bg-surface rounded-xl p-4 border border-border">
      <div className="flex items-start gap-3 mb-3">
        <SkeletonAvatar size="md" />
        <div className="flex-1 flex flex-col gap-1.5">
          <Skeleton className="h-3.5 w-32 rounded-full" />
          <Skeleton className="h-3 w-24 rounded-full" />
          <Skeleton className="h-3 w-28 rounded-full" />
        </div>
        <Skeleton className="h-5 w-20 rounded-full shrink-0" />
      </div>
      <Skeleton className="h-8 w-full rounded-xl mb-3" />
      <div className="flex gap-3 mb-3">
        <Skeleton className="h-14 flex-1 rounded-xl" />
        <Skeleton className="h-14 flex-1 rounded-xl" />
      </div>
      <Skeleton className="h-3 w-full rounded-full mb-1.5" />
      <Skeleton className="h-3 w-2/3 rounded-full mb-3" />
      <div className="pt-3 border-t border-border flex gap-2">
        <Skeleton className="h-8 flex-1 rounded-xl" />
        <Skeleton className="h-8 w-20 rounded-xl" />
        <Skeleton className="h-8 w-10 rounded-xl" />
      </div>
    </div>
  );
}

// ─── Full-page dashboard skeletons ────────────────────────────────────────────

function SkeletonSectionHeader() {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-32 rounded-full" />
        <Skeleton className="h-5 w-6 rounded-full" />
      </div>
      <Skeleton className="h-3 w-16 rounded-full" />
    </div>
  );
}

export function SkeletonWorkerDashboard() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Greeting */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-20 rounded-full" />
              <Skeleton className="h-6 w-40 rounded-full" />
              <Skeleton className="h-3 w-28 rounded-full" />
              <Skeleton className="h-5 w-24 rounded-full mt-1" />
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <SkeletonAvatar size="xl" />
              <Skeleton className="h-3 w-16 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5">
        <div className="grid grid-cols-3 gap-3">
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
        </div>
      </div>

      {/* Nearby jobs */}
      <div className="mt-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SkeletonSectionHeader />
        </div>
        <div className="flex gap-3 px-4 sm:px-6 lg:px-8 pb-3 overflow-hidden">
          <SkeletonJobCardCompact />
          <SkeletonJobCardCompact />
          <SkeletonJobCardCompact />
        </div>
      </div>

      {/* Active jobs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-7">
        <SkeletonSectionHeader />
        <SkeletonActiveJob />
      </div>

      {/* Applications */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-7">
        <SkeletonSectionHeader />
        <div className="flex flex-col gap-3">
          <SkeletonOfferItem />
          <SkeletonOfferItem />
        </div>
      </div>
    </div>
  );
}

export function SkeletonEmployerDashboard() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Greeting */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-20 rounded-full" />
              <Skeleton className="h-6 w-48 rounded-full" />
              <Skeleton className="h-3 w-36 rounded-full" />
              <Skeleton className="h-3 w-28 rounded-full" />
              <Skeleton className="h-5 w-24 rounded-full mt-1" />
            </div>
            <div className="flex flex-col items-end gap-3 shrink-0">
              <SkeletonAvatar size="xl" />
              <Skeleton className="h-8 w-32 rounded-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5">
        <div className="grid grid-cols-3 gap-3">
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
        </div>
      </div>

      {/* Published jobs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-7">
        <SkeletonSectionHeader />
        <div className="flex flex-col gap-3">
          <SkeletonJobCardFull />
          <SkeletonJobCardFull />
        </div>
      </div>

      {/* Applicants */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-7">
        <SkeletonSectionHeader />
        <div className="flex flex-col gap-3">
          <SkeletonApplicantCard />
        </div>
      </div>
    </div>
  );
}
