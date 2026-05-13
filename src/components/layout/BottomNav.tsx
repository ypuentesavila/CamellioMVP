"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context";
import {
  guestBottomNav,
  workerBottomNav,
  employerBottomNav,
  isNavActive,
} from "@/lib/nav";

export function BottomNav() {
  const pathname = usePathname();
  const { isWorker, isEmployer } = useAuth();

  const items = isWorker
    ? workerBottomNav
    : isEmployer
    ? employerBottomNav
    : guestBottomNav;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-surface border-t border-border pb-safe">
      <div className="flex items-center justify-around px-2 pt-2 pb-3">
        {items.map(({ label, href, icon: Icon, accent }) => {
          const active = isNavActive(href, pathname);

          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors min-w-0"
            >
              <Icon
                className={cn("h-6 w-6 transition-colors", {
                  "text-primary": active && !accent,
                  "text-accent": accent,
                  "text-text-secondary": !active && !accent,
                })}
                strokeWidth={active && !accent ? 2.5 : 1.75}
              />
              <span
                className={cn("text-xs font-medium transition-colors", {
                  "text-primary": active && !accent,
                  "text-accent": accent,
                  "text-text-secondary": !active && !accent,
                })}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
