"use client";

import { forwardRef } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leadingIcon?: LucideIcon;
  trailingNode?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leadingIcon: LeadingIcon,
      trailingNode,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="eyebrow text-stone-600"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {LeadingIcon && (
            <span className="pointer-events-none absolute left-3.5 flex items-center">
              <LeadingIcon
                className={cn(
                  "w-4 h-4",
                  error ? "text-amber-500" : "text-stone-400"
                )}
                strokeWidth={1.75}
              />
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full h-11 bg-card rounded-xl border text-sm text-ink",
              "placeholder:text-stone-400",
              "transition-colors duration-150",
              "focus:outline-none focus:ring-2 focus:ring-offset-0",
              LeadingIcon ? "pl-10 pr-4" : "px-4",
              trailingNode && "pr-10",
              error
                ? "border-amber-500 focus:ring-amber-500/40"
                : "border-stone-200 focus:ring-ink focus:border-transparent",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            {...props}
          />

          {trailingNode && (
            <span className="absolute right-3 flex items-center">
              {trailingNode}
            </span>
          )}
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-xs text-amber-500 leading-snug"
          >
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${inputId}-hint`} className="text-xs text-stone-500 leading-snug">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
