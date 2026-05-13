"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Globe,
  Wrench,
  Building2,
  ArrowRight,
  CheckCircle,
  Briefcase,
  MessageSquare,
  Star,
  Search,
  Users,
  Zap,
  ExternalLink,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context";
import { workers, employers } from "@/data/users";
import { cn } from "@/lib/utils";

// ─── Data ─────────────────────────────────────────────────────────────────────

const categoryLabel: Record<string, string> = {
  plomeria: "Plomero",
  electricidad: "Electricista",
  carpinteria: "Carpintero",
  pintura: "Pintor",
  limpieza: "Limpieza",
  cerrajeria: "Cerrajero",
  mudanzas: "Mudanzas",
  fumigacion: "Fumigación",
};

interface Experience {
  id: string;
  iconBg: string;
  icon: React.ElementType;
  label: string;
  title: string;
  description: string;
  features: { icon: React.ElementType; text: string }[];
  route: string;
  routeLabel: string;
  statusLabel: string;
  statusVariant: "success" | "default" | "neutral";
  ctaLabel: string;
  demoUserId?: string;
  external?: boolean;
}

const experiences: Experience[] = [
  {
    id: "landing",
    iconBg: "from-slate-600 to-slate-800",
    icon: Globe,
    label: "Experiencia pública · Marketing",
    title: "Landing Page",
    description:
      "Página de marketing de Camellio. Lo que ve un visitante nuevo. Presentación del producto, beneficios y flujo de registro.",
    features: [
      { icon: CheckCircle, text: "Landing principal + variantes por rol" },
      { icon: Users, text: "Para técnicos · Para clientes" },
      { icon: Zap, text: "CTAs que conectan con la app" },
    ],
    route: "/landing",
    routeLabel: "/landing",
    statusLabel: "Público",
    statusVariant: "neutral",
    ctaLabel: "Ver landing page",
  },
  {
    id: "worker",
    iconBg: "from-blue-500 to-indigo-500",
    icon: Wrench,
    label: "Experiencia trabajador",
    title: "App de Trabajador",
    description:
      "Dashboard completo para Carlos Mendoza, plomero en Suba. Trabaja con datos reales del contexto y persistencia en localStorage.",
    features: [
      { icon: Search, text: "Explorar y postularse a trabajos" },
      { icon: Briefcase, text: "Gestión de trabajos activos" },
      { icon: MessageSquare, text: "Chat y calificaciones" },
    ],
    route: "/dashboard/worker",
    routeLabel: "/dashboard/worker",
    statusLabel: "Demo · u1",
    statusVariant: "success",
    ctaLabel: "Entrar como Carlos",
    demoUserId: "u1",
  },
  {
    id: "employer",
    iconBg: "from-indigo-600 to-blue-700",
    icon: Building2,
    label: "Experiencia empleador",
    title: "App de Empleador",
    description:
      "Dashboard para Juan Pablo Restrepo, administrador de local en Chapinero. Postulantes reales, negociación y revisiones activas.",
    features: [
      { icon: Briefcase, text: "Publicar y gestionar trabajos" },
      { icon: Users, text: "Revisar postulantes y negociar" },
      { icon: Star, text: "Calificar y gestionar contrataciones" },
    ],
    route: "/dashboard/employer",
    routeLabel: "/dashboard/employer",
    statusLabel: "Demo · u8",
    statusVariant: "default",
    ctaLabel: "Entrar como Juan Pablo",
    demoUserId: "u8",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HubPage() {
  const router = useRouter();
  const { login, user, logout } = useAuth();

  function handleExperience(exp: Experience) {
    if (exp.demoUserId) {
      login(exp.demoUserId);
    }
    router.push(exp.route);
  }

  function handleQuickLogin(userId: string, role: "worker" | "employer") {
    login(userId);
    router.push(role === "worker" ? "/dashboard/worker" : "/dashboard/employer");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-primary-mid to-background">
      {/* ── Header ── */}
      <header className="sticky top-0 z-10 bg-surface/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-primary">Camellio</span>
            <Badge variant="neutral" size="sm">Demo Hub</Badge>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <Avatar name={user.name} size="sm" />
                <span className="text-xs text-text-secondary hidden sm:block">
                  {user.name.split(" ")[0]}
                </span>
                <button
                  onClick={logout}
                  className="text-xs text-text-secondary hover:text-danger transition-colors"
                >
                  Salir
                </button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm">Iniciar sesión</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-surface border border-border text-xs font-semibold text-text-secondary px-3 py-1.5 rounded-full mb-5">
          <span className="w-2 h-2 rounded-full bg-success inline-block" />
          Proyecto en desarrollo activo
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3 tracking-tight">
          Bienvenido a Camellio
        </h1>
        <p className="text-text-secondary text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          Plataforma de servicios locales para Bogotá. Elige la experiencia que quieres
          explorar o inicia sesión con una cuenta demo.
        </p>
      </div>

      {/* ── Experience cards ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {experiences.map((exp) => {
            const Icon = exp.icon;
            return (
              <div
                key={exp.id}
                className="bg-surface rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col overflow-hidden group"
              >
                {/* Card header */}
                <div className={`bg-gradient-to-br ${exp.iconBg} p-6`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant={exp.statusVariant} size="sm">
                      {exp.statusLabel}
                    </Badge>
                  </div>
                  <p className="text-white/70 text-xs font-medium mb-0.5">
                    {exp.label}
                  </p>
                  <h2 className="text-white text-lg font-bold">{exp.title}</h2>
                </div>

                {/* Card body */}
                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-sm text-text-secondary leading-relaxed mb-4">
                    {exp.description}
                  </p>

                  <ul className="flex flex-col gap-2 mb-5 flex-1">
                    {exp.features.map((f) => {
                      const FIcon = f.icon;
                      return (
                        <li key={f.text} className="flex items-center gap-2">
                          <FIcon className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="text-xs text-text-secondary">{f.text}</span>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Route */}
                  <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-background rounded-lg">
                    <code className="text-xs text-text-secondary font-mono flex-1 truncate">
                      {exp.routeLabel}
                    </code>
                    <ArrowRight className="w-3 h-3 text-border shrink-0" />
                  </div>

                  <button
                    onClick={() => handleExperience(exp)}
                    className={cn(
                      "w-full py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]",
                      "bg-primary text-white hover:bg-blue-700 hover:shadow-md"
                    )}
                  >
                    {exp.ctaLabel}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Quick access ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-10">
        <div className="bg-surface rounded-2xl border border-border p-5 shadow-card">
          <div className="flex items-center gap-2 mb-5">
            <Zap className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-bold text-text-primary">
              Acceso rápido
            </h3>
            <span className="text-xs text-text-secondary">
              — click para iniciar sesión al instante
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Workers */}
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" />
                Trabajadores
              </p>
              <div className="flex flex-col gap-2">
                {workers.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => handleQuickLogin(w.id, "worker")}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-left",
                      user?.id === w.id
                        ? "border-primary bg-primary-light"
                        : "border-border bg-background hover:border-primary hover:bg-primary-light/50"
                    )}
                  >
                    <Avatar name={w.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-text-primary truncate leading-tight">
                        {w.name}
                      </p>
                      <p className="text-xs text-text-secondary truncate">
                        {categoryLabel[w.workerProfile?.category ?? ""] ?? "Trabajador"}
                        {" · "}
                        <span className="font-mono text-[10px]">{w.id}</span>
                      </p>
                    </div>
                    {user?.id === w.id ? (
                      <Badge variant="success" size="sm" dot>
                        Activo
                      </Badge>
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 text-border" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Employers */}
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                Empleadores
              </p>
              <div className="flex flex-col gap-2">
                {employers.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => handleQuickLogin(e.id, "employer")}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-left",
                      user?.id === e.id
                        ? "border-primary bg-primary-light"
                        : "border-border bg-background hover:border-primary hover:bg-primary-light/50"
                    )}
                  >
                    <Avatar name={e.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-text-primary truncate leading-tight">
                        {e.name}
                      </p>
                      <p className="text-xs text-text-secondary truncate">
                        {e.employerProfile?.companyName ?? "Empleador"}
                        {" · "}
                        <span className="font-mono text-[10px]">{e.id}</span>
                      </p>
                    </div>
                    {user?.id === e.id ? (
                      <Badge variant="success" size="sm" dot>
                        Activo
                      </Badge>
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 text-border" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Routes reference ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-10">
        <div className="bg-surface rounded-2xl border border-border p-5 shadow-card">
          <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-text-secondary" />
            Mapa de rutas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {[
              { route: "/", label: "Demo hub", desc: "Esta página" },
              { route: "/landing", label: "Landing principal", desc: "Selector de rol" },
              { route: "/landing/empleado", label: "LP · Trabajadores", desc: "Marketing para técnicos" },
              { route: "/landing/empleador", label: "LP · Empleadores", desc: "Marketing para clientes" },
              { route: "/login", label: "Login", desc: "Inicio de sesión" },
              { route: "/registro", label: "Registro", desc: "Crear cuenta (4 pasos)" },
              { route: "/dashboard/worker", label: "Worker dashboard", desc: "Panel del trabajador" },
              { route: "/dashboard/employer", label: "Employer dashboard", desc: "Panel del empleador" },
              { route: "/mensajes", label: "Mensajes", desc: "Lista de chats" },
              { route: "/mensajes/c1", label: "Chat", desc: "Conversación individual" },
              { route: "/explorar", label: "Explorar trabajos", desc: "Buscar y aplicar" },
              { route: "/publicar", label: "Publicar trabajo", desc: "Empleadores" },
              { route: "/trabajos/j1", label: "Detalle trabajo", desc: "Con postular modal" },
              { route: "/dashboard/worker/applications", label: "Mis postulaciones", desc: "Worker" },
              { route: "/dashboard/employer/applicants", label: "Postulantes", desc: "Employer" },
              { route: "/perfil/u1", label: "Perfil trabajador", desc: "Carlos Mendoza" },
              { route: "/perfil/u7", label: "Perfil empleador", desc: "María Castellanos" },
              { route: "/worker", label: "→ Worker", desc: "Shortcut auto-login" },
              { route: "/employer", label: "→ Employer", desc: "Shortcut auto-login" },
            ].map((r) => (
              <Link
                key={r.route}
                href={r.route}
                className="flex items-center gap-3 p-3 bg-background rounded-xl hover:bg-primary-light hover:border-primary border border-transparent transition-all group"
              >
                <code className="text-xs font-mono text-primary truncate flex-1">
                  {r.route}
                </code>
                <span className="text-xs text-text-secondary shrink-0 hidden sm:block">
                  {r.desc}
                </span>
                <ArrowRight className="w-3 h-3 text-border shrink-0 group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            {[
              "Next.js 15",
              "TypeScript",
              "Tailwind CSS",
              "React Context",
              "localStorage",
              "Framer Motion",
            ].map((tech) => (
              <span
                key={tech}
                className="text-xs bg-surface border border-border text-text-secondary px-2.5 py-1 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
          <p className="text-xs text-text-secondary">
            Camellio MVP · Bogotá, Colombia
          </p>
        </div>
      </footer>
    </div>
  );
}
