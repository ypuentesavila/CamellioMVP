"use client";

import { cn } from "@/lib/utils";

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  count?: number;
}

export function Chip({ active = false, count, className, children, ...props }: ChipProps) {
  return (
    <button
      role="option"
      aria-selected={active}
      className={cn(
        "inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-sm font-medium",
        "transition-colors duration-150 whitespace-nowrap shrink-0",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-1",
        active
          ? "bg-ink text-paper"
          : "bg-stone-100 text-stone-600 border border-stone-200 hover:border-stone-400 hover:text-ink",
        className
      )}
      {...props}
    >
      {children}
      {count !== undefined && (
        <span
          className={cn(
            "text-[10px] font-semibold tabular-nums",
            active ? "text-paper/70" : "text-stone-500"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

interface ChipGroupProps {
  children: React.ReactNode;
  className?: string;
  label?: string;
}

export function ChipGroup({ children, className, label }: ChipGroupProps) {
  return (
    <div
      role="listbox"
      aria-label={label}
      className={cn(
        "flex items-center gap-2 overflow-x-auto scrollbar-hide",
        "pb-0.5",
        className
      )}
    >
      {children}
    </div>
  );
}
