"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";
import { Button, buttonVariants } from "@/components/ui/Button";

interface AuthCta {
  label: string;
  onClick?: () => void;
  href?: string;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
  form?: string;
}

interface AuthLayoutProps {
  children: React.ReactNode;
  step?: number;
  totalSteps?: number;
  onBack?: () => void;
  backHref?: string;
  cta?: AuthCta;
  footer?: React.ReactNode;
  className?: string;
}

export function AuthLayout({
  children,
  step,
  totalSteps,
  onBack,
  backHref,
  cta,
  footer,
  className,
}: AuthLayoutProps) {
  const showProgress = step !== undefined && totalSteps !== undefined;
  const showBack = step !== undefined && step > 0 && (onBack || backHref);
  const progress = showProgress ? ((step) / totalSteps) * 100 : 0;

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur-sm">
        <div className="flex items-center h-14 px-4 gap-3">
          {showBack ? (
            backHref ? (
              <Link
                href={backHref}
                className="flex items-center justify-center h-10 w-10 rounded-xl text-ink hover:bg-stone-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink shrink-0"
                aria-label="Volver"
              >
                <ChevronLeft className="w-5 h-5" strokeWidth={2} />
              </Link>
            ) : (
              <button
                onClick={onBack}
                className="flex items-center justify-center h-10 w-10 rounded-xl text-ink hover:bg-stone-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink shrink-0"
                aria-label="Volver"
              >
                <ChevronLeft className="w-5 h-5" strokeWidth={2} />
              </button>
            )
          ) : (
            <div className="w-10 shrink-0" />
          )}

          <div className="flex-1 flex justify-center">
            <Link href="/">
              <Logo variant="compact" size="sm" />
            </Link>
          </div>

          {showProgress && (
            <span className="text-xs text-stone-500 font-medium shrink-0 w-10 text-right">
              {step}/{totalSteps}
            </span>
          )}
          {!showProgress && <div className="w-10 shrink-0" />}
        </div>

        {showProgress && (
          <div className="h-0.5 bg-stone-200">
            <div
              className="h-0.5 bg-ink transition-all duration-500"
              style={{
                width: `${progress}%`,
                transitionTimingFunction: "cubic-bezier(.2,.7,.3,1)",
              }}
              role="progressbar"
              aria-valuenow={step}
              aria-valuemin={0}
              aria-valuemax={totalSteps}
            />
          </div>
        )}
      </header>

      {/* Content */}
      <main
        className={cn(
          "flex-1 w-full max-w-sm mx-auto px-4 pt-6 pb-32",
          className
        )}
      >
        {children}
      </main>

      {/* Sticky CTA + footer */}
      {(cta || footer) && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-paper/95 backdrop-blur-sm border-t border-stone-200 pb-safe">
          <div className="max-w-sm mx-auto px-4 pt-3 pb-2 flex flex-col gap-2">
            {cta && (
              cta.href ? (
                <Link
                  href={cta.href}
                  className={cn(
                    buttonVariants({ variant: "primary", size: "lg" }),
                    "w-full",
                    cta.disabled && "opacity-50 pointer-events-none"
                  )}
                >
                  {cta.label}
                </Link>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={cta.onClick}
                  loading={cta.loading}
                  disabled={cta.disabled}
                  type={cta.type ?? "button"}
                  form={cta.form}
                >
                  {cta.label}
                </Button>
              )
            )}
            {footer}
          </div>
        </div>
      )}
    </div>
  );
}
