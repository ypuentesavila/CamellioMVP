"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/context";

interface MobileHeaderProps {
  variant?: "home" | "context";
  title?: string;
  onBack?: () => void;
  actions?: React.ReactNode;
  className?: string;
}

export function MobileHeader({
  variant = "home",
  title,
  onBack,
  actions,
  className,
}: MobileHeaderProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleBack = onBack ?? (() => router.back());

  return (
    <header
      className={cn(
        "md:hidden sticky top-0 z-40 h-14 pt-safe flex items-center transition-all duration-200",
        scrolled
          ? "bg-card/96 backdrop-blur-md shadow-nav"
          : "bg-card",
        className
      )}
      style={{ transitionTimingFunction: "cubic-bezier(.2,.7,.3,1)" }}
    >
      {variant === "context" ? (
        /* Context header — back + title + optional actions */
        <div className="flex items-center w-full px-3 gap-2">
          <button
            onClick={handleBack}
            className="flex items-center justify-center h-10 w-10 rounded-xl text-ink hover:bg-stone-100 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
            aria-label="Volver"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={2} />
          </button>
          {title && (
            <h1 className="flex-1 text-base font-semibold text-ink truncate">
              {title}
            </h1>
          )}
          {actions && (
            <div className="flex items-center gap-1 shrink-0">{actions}</div>
          )}
        </div>
      ) : (
        /* Home header — logo + avatar */
        <div className="flex items-center justify-between w-full px-4">
          <Logo variant="horizontal" size="sm" />
          <div className="flex items-center gap-2">
            {actions}
            {isAuthenticated && user ? (
              <Avatar name={user.name} size="sm" />
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
}
