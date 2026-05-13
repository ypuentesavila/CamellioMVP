import {
  Home,
  Search,
  Briefcase,
  User,
  PlusCircle,
  MessageSquare,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavLink {
  label: string;
  href: string;
}

export interface BottomNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  accent?: boolean;
}

// ─── Top nav links ────────────────────────────────────────────────────────────

export const guestTopNav: NavLink[] = [
  { label: "Explorar", href: "/explorar" },
  { label: "Cómo funciona", href: "/como-funciona" },
];

export const workerTopNav: NavLink[] = [
  { label: "Explorar", href: "/explorar" },
  { label: "Mis trabajos", href: "/dashboard/worker" },
  { label: "Mensajes", href: "/mensajes" },
];

export const employerTopNav: NavLink[] = [
  { label: "Mis trabajos", href: "/dashboard/employer" },
  { label: "Postulantes", href: "/dashboard/employer/applicants" },
  { label: "Mensajes", href: "/mensajes" },
];

// ─── Bottom nav items ─────────────────────────────────────────────────────────

export const guestBottomNav: BottomNavItem[] = [
  { label: "Inicio", href: "/", icon: Home },
  { label: "Explorar", href: "/explorar", icon: Search },
  { label: "Publicar", href: "/publicar", icon: PlusCircle, accent: true },
  { label: "Perfil", href: "/perfil", icon: User },
];

export const workerBottomNav: BottomNavItem[] = [
  { label: "Inicio", href: "/", icon: Home },
  { label: "Explorar", href: "/explorar", icon: Search },
  { label: "Trabajos", href: "/dashboard/worker", icon: Briefcase },
  { label: "Perfil", href: "/perfil", icon: User },
];

export const employerBottomNav: BottomNavItem[] = [
  { label: "Inicio", href: "/", icon: Home },
  { label: "Publicar", href: "/publicar", icon: PlusCircle, accent: true },
  { label: "Trabajos", href: "/dashboard/employer", icon: Briefcase },
  { label: "Perfil", href: "/perfil", icon: User },
];

// ─── Active state helper ──────────────────────────────────────────────────────

export function isNavActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}
