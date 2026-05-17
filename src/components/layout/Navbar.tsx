"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Avatar } from "@/components/ui/Avatar";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context";
import {
  guestTopNav,
  workerTopNav,
  employerTopNav,
  isNavActive,
} from "@/lib/nav";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, isWorker, isEmployer, isAuthenticated, logout } = useAuth();

  const navLinks = isWorker
    ? workerTopNav
    : isEmployer
    ? employerTopNav
    : guestTopNav;

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm shadow-nav">
      <PageShell>
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <span className="text-xl font-bold text-ink tracking-tight">
              camellio
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-6 flex-1 ml-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  isNavActive(link.href, pathname)
                    ? "text-ink"
                    : "text-stone-500 hover:text-ink"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {isAuthenticated && user ? (
              <>
                {isEmployer && (
                  <Link
                    href="/publicar"
                    className={cn(buttonVariants({ variant: "primary", size: "md" }))}
                  >
                    + Publicar trabajo
                  </Link>
                )}
                {/* User pill */}
                <Link
                  href={`/perfil/${user.id}`}
                  className="flex items-center gap-2.5 pl-2 pr-4 py-1.5 rounded-xl hover:bg-paper transition-colors"
                >
                  <Avatar name={user.name} size="sm" />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-ink leading-none">
                      {user.name.split(" ")[0]}
                    </span>
                    <span className="text-xs text-stone-500 capitalize leading-none mt-0.5">
                      {user.role === "worker" ? "Trabajador" : "Empleador"}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={logout}
                  title="Cerrar sesión"
                  className="flex items-center justify-center h-9 w-9 rounded-xl hover:bg-paper text-stone-400 hover:text-ink transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={cn(buttonVariants({ variant: "ghost", size: "md" }))}
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/registro"
                  className={cn(buttonVariants({ variant: "primary", size: "md" }))}
                >
                  Publicar trabajo
                </Link>
              </>
            )}
          </div>

          {/* Mobile right */}
          <div className="md:hidden flex items-center gap-2">
            {isAuthenticated && user && (
              <Link href={`/perfil/${user.id}`}>
                <Avatar name={user.name} size="sm" />
              </Link>
            )}
            <button
              className="flex items-center justify-center h-10 w-10 rounded-xl hover:bg-paper transition-colors"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {mobileOpen
                ? <X className="h-5 w-5 text-ink" />
                : <Menu className="h-5 w-5 text-ink" />}
            </button>
          </div>
        </div>
      </PageShell>

      {/* Mobile drawer */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-200",
          mobileOpen ? "max-h-96 border-t border-stone-200" : "max-h-0"
        )}
      >
        <PageShell>
          <nav className="flex flex-col gap-1 py-4">
            {/* Show nav links only for guest — auth users use BottomNav */}
            {!isAuthenticated &&
              navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobile}
                  className={cn(
                    "px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                    isNavActive(link.href, pathname)
                      ? "bg-azulejo-100 text-ink"
                      : "text-stone-500 hover:text-ink hover:bg-paper"
                  )}
                >
                  {link.label}
                </Link>
              ))}

            {/* Auth actions */}
            <div className={cn("flex flex-col gap-2", !isAuthenticated && "pt-3 border-t border-stone-200 mt-2")}>
              {isAuthenticated ? (
                <>
                  {isEmployer && (
                    <Link
                      href="/publicar"
                      onClick={closeMobile}
                      className={cn(buttonVariants({ variant: "primary", size: "md" }))}
                    >
                      + Publicar trabajo
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); closeMobile(); }}
                    className={cn(buttonVariants({ variant: "outline", size: "md" }))}
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={closeMobile}
                    className={cn(buttonVariants({ variant: "outline", size: "md" }))}
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    href="/registro"
                    onClick={closeMobile}
                    className={cn(buttonVariants({ variant: "primary", size: "md" }))}
                  >
                    Publicar trabajo
                  </Link>
                </>
              )}
            </div>
          </nav>
        </PageShell>
      </div>
    </header>
  );
}
