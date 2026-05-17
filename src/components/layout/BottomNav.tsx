"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Briefcase,
  Plus,
  MessageSquare,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const ITEMS: NavItem[] = [
  { label: "Inicio",      href: "/",           icon: Home          },
  { label: "Solicitudes", href: "/dashboard",   icon: Briefcase     },
  // center slot reserved for FAB
  { label: "Mensajes",   href: "/mensajes",    icon: MessageSquare },
  { label: "Yo",          href: "/perfil",      icon: User          },
];

function isActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function BottomNav() {
  const pathname = usePathname();
  const { user, isWorker, isEmployer, isAuthenticated } = useAuth();

  const solicitudesHref = isWorker
    ? "/dashboard/worker"
    : isEmployer
    ? "/dashboard/employer"
    : "/login";

  const perfilHref =
    isAuthenticated && user ? `/perfil/${user.id}` : "/login";

  const items = [
    { label: "Inicio",      href: "/",               icon: Home          },
    { label: "Solicitudes", href: solicitudesHref,    icon: Briefcase     },
    { label: "Mensajes",    href: "/mensajes",        icon: MessageSquare },
    { label: "Yo",          href: perfilHref,          icon: User          },
  ];

  return (
    <nav
      role="tablist"
      aria-label="Navegación principal"
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card border-t border-stone-200 pb-safe"
    >
      <div className="flex items-end justify-around px-2 pt-2 pb-1">
        {/* Inicio */}
        <NavTab
          label={items[0].label}
          href={items[0].href}
          icon={items[0].icon}
          active={isActive(items[0].href, pathname)}
        />

        {/* Solicitudes */}
        <NavTab
          label={items[1].label}
          href={items[1].href}
          icon={items[1].icon}
          active={isActive(items[1].href, pathname)}
        />

        {/* FAB — Publicar */}
        <div className="flex flex-col items-center" role="tab">
          <Link
            href="/publicar"
            aria-label="Publicar solicitud"
            className={cn(
              "flex items-center justify-center",
              "w-[54px] h-[54px] rounded-2xl",
              "bg-azulejo-500 shadow-fab",
              "-mt-[14px]",
              "transition-transform duration-[180ms]",
              "active:scale-[1.08]"
            )}
            style={{ transitionTimingFunction: "cubic-bezier(.34,1.56,.64,1)" }}
          >
            <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
          </Link>
        </div>

        {/* Mensajes */}
        <NavTab
          label={items[2].label}
          href={items[2].href}
          icon={items[2].icon}
          active={isActive(items[2].href, pathname)}
        />

        {/* Yo */}
        <NavTab
          label={items[3].label}
          href={items[3].href}
          icon={items[3].icon}
          active={isActive(items[3].href, pathname)}
        />
      </div>
    </nav>
  );
}

interface NavTabProps {
  label: string;
  href: string;
  icon: React.ElementType;
  active: boolean;
}

function NavTab({ label, href, icon: Icon, active }: NavTabProps) {
  return (
    <Link
      href={href}
      role="tab"
      aria-current={active ? "page" : undefined}
      className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl min-w-0 min-h-[44px] justify-center"
    >
      <Icon
        className={cn(
          "h-[22px] w-[22px] transition-colors",
          active ? "text-ink" : "text-stone-400"
        )}
        strokeWidth={active ? 2.5 : 1.75}
      />
      <span
        className={cn(
          "text-[10px] font-medium transition-colors leading-none",
          active ? "text-ink" : "text-stone-400"
        )}
      >
        {label}
      </span>
    </Link>
  );
}
