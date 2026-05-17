"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";
import { Avatar } from "@/components/ui/Avatar";
import { Button, buttonVariants } from "@/components/ui/Button";
import { useAuth } from "@/context";

type Variant = "transparent" | "default" | "compact";

interface NavLink {
  label: string;
  href: string;
}

const GUEST_NAV: NavLink[] = [
  { label: "Inicio", href: "/" },
  { label: "Explorar trabajadores", href: "/explorar" },
  { label: "Cómo funciona", href: "/como-funciona" },
];

const WORKER_NAV: NavLink[] = [
  { label: "Explorar", href: "/explorar" },
  { label: "Mis solicitudes", href: "/dashboard/worker" },
  { label: "Mensajes", href: "/mensajes" },
];

const EMPLOYER_NAV: NavLink[] = [
  { label: "Inicio", href: "/" },
  { label: "Mis solicitudes", href: "/dashboard/employer" },
  { label: "Mensajes", href: "/mensajes" },
];

function isActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

interface HeaderProps {
  variant?: Variant;
}

export function Header({ variant = "default" }: HeaderProps) {
  const pathname = usePathname();
  const { user, isWorker, isEmployer, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (variant !== "transparent") return;
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  const navLinks = isWorker
    ? WORKER_NAV
    : isEmployer
    ? EMPLOYER_NAV
    : GUEST_NAV;

  const isCompact = variant === "compact";
  const isTransparent = variant === "transparent" && !scrolled;
  const height = isCompact ? "h-14" : "h-[68px]";

  const headerBg = isTransparent
    ? "bg-transparent"
    : "bg-card/96 backdrop-blur-md shadow-nav";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        headerBg
      )}
      style={{ transitionTimingFunction: "cubic-bezier(.2,.7,.3,1)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn("flex items-center justify-between gap-6", height)}>
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Logo
              variant={isCompact ? "compact" : "horizontal"}
              size={isCompact ? "sm" : "md"}
              onDark={isTransparent}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  isTransparent
                    ? isActive(link.href, pathname)
                      ? "text-paper"
                      : "text-paper/70 hover:text-paper"
                    : isActive(link.href, pathname)
                    ? "text-ink"
                    : "text-stone-500 hover:text-ink"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {isAuthenticated && user ? (
              <>
                {isEmployer && (
                  <Link
                    href="/publicar"
                    className={cn(buttonVariants({ variant: "primary", size: "sm" }))}
                  >
                    Publicar solicitud
                  </Link>
                )}
                <Link
                  href={`/perfil/${user.id}`}
                  className={cn(
                    "flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl transition-colors",
                    isTransparent
                      ? "hover:bg-white/10"
                      : "hover:bg-stone-100"
                  )}
                >
                  <Avatar name={user.name} size="sm" />
                  <div className="flex flex-col">
                    <span
                      className={cn(
                        "text-sm font-semibold leading-none",
                        isTransparent ? "text-paper" : "text-ink"
                      )}
                    >
                      {user.name.split(" ")[0]}
                    </span>
                    <span
                      className={cn(
                        "text-xs capitalize leading-none mt-0.5",
                        isTransparent ? "text-paper/60" : "text-stone-500"
                      )}
                    >
                      {isWorker ? "Trabajador" : "Cliente"}
                    </span>
                  </div>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/registro?rol=trabajador"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    isTransparent &&
                      "border-paper/40 text-paper hover:bg-white/10 hover:border-paper"
                  )}
                >
                  Soy trabajador
                </Link>
                <Link
                  href="/publicar"
                  className={cn(buttonVariants({ variant: "primary", size: "sm" }))}
                >
                  Publicar solicitud
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className={cn(
              "md:hidden flex items-center justify-center h-10 w-10 rounded-xl transition-colors",
              isTransparent ? "hover:bg-white/10" : "hover:bg-stone-100"
            )}
            onClick={() => setMobileOpen((p) => !p)}
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
          >
            <span
              className={cn(
                "flex flex-col gap-[5px] w-5",
                isTransparent ? "text-paper" : "text-ink"
              )}
            >
              <span
                className={cn(
                  "block h-0.5 w-5 rounded-full bg-current transition-all duration-200",
                  mobileOpen && "translate-y-[7px] rotate-45"
                )}
              />
              <span
                className={cn(
                  "block h-0.5 w-3.5 rounded-full bg-current transition-all duration-200",
                  mobileOpen && "opacity-0"
                )}
              />
              <span
                className={cn(
                  "block h-0.5 w-5 rounded-full bg-current transition-all duration-200",
                  mobileOpen && "-translate-y-[7px] -rotate-45"
                )}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all bg-card",
          mobileOpen ? "max-h-[480px] border-t border-stone-200" : "max-h-0"
        )}
        style={{ transitionDuration: "260ms", transitionTimingFunction: "cubic-bezier(.2,.7,.3,1)" }}
      >
        <div className="px-4 py-5 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                isActive(link.href, pathname)
                  ? "bg-azulejo-100 text-ink"
                  : "text-stone-500 hover:text-ink hover:bg-stone-100"
              )}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-3 mt-2 border-t border-stone-200 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                {isEmployer && (
                  <Link
                    href="/publicar"
                    onClick={() => setMobileOpen(false)}
                    className={cn(buttonVariants({ variant: "primary", size: "md" }), "w-full")}
                  >
                    Publicar solicitud
                  </Link>
                )}
                <Button
                  variant="outline"
                  size="md"
                  className="w-full"
                  onClick={() => { logout(); setMobileOpen(false); }}
                >
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/registro?rol=trabajador"
                  onClick={() => setMobileOpen(false)}
                  className={cn(buttonVariants({ variant: "outline", size: "md" }), "w-full")}
                >
                  Soy trabajador
                </Link>
                <Link
                  href="/publicar"
                  onClick={() => setMobileOpen(false)}
                  className={cn(buttonVariants({ variant: "primary", size: "md" }), "w-full")}
                >
                  Publicar solicitud
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
