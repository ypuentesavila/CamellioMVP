"use client";

import Link from "next/link";
import {
  MapPin,
  Clock,
  Briefcase,
  MessageSquare,
  ShieldCheck,
  Award,
  Star,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Stars } from "@/components/ui/Stars";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { Mosaico } from "@/components/brand/Mosaico";
import { ReviewCard } from "@/components/features/reviews/ReviewCard";
import { ReviewSummary } from "@/components/features/reviews/ReviewSummary";
import { useJobs } from "@/context";
import { useAuth } from "@/context";
import { formatCOP } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

const CATEGORY_NAMES: Record<string, string> = {
  plomeria: "Plomería", electricidad: "Electricidad", carpinteria: "Carpintería",
  pintura: "Pintura", limpieza: "Limpieza", mudanzas: "Mudanzas",
  cerrajeria: "Cerrajería", fumigacion: "Fumigación",
};

const PORTFOLIO_BG = ["bg-azulejo-100", "bg-marigold-100", "bg-forest-100", "bg-stone-100"];

function verificationLevel(profile: NonNullable<User["workerProfile"]>, reviewCount: number) {
  if ((profile.rating ?? 0) >= 4.8 && reviewCount >= 30) return 3;
  if (profile.verified) return 2;
  return 1;
}

interface WorkerProfileViewProps {
  user: User;
}

export function WorkerProfileView({ user }: WorkerProfileViewProps) {
  const { getReviewsByWorker, getWorkerRating } = useJobs();
  const { user: viewer } = useAuth();

  const profile = user.workerProfile!;
  const reviews = getReviewsByWorker(user.id);
  const { average: liveRating, count: liveCount } = getWorkerRating(user.id);

  const displayRating = liveRating || profile.rating;
  const displayCount = liveCount || profile.reviewCount;
  const level = verificationLevel(profile, displayCount);

  const isOwnProfile = viewer?.id === user.id;
  const memberYear = new Date(user.createdAt).getFullYear();

  return (
    <div className="max-w-2xl mx-auto">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-ink px-4 pt-8 pb-6">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <Mosaico density="sparse" />
        </div>

        <div className="relative z-10 flex flex-col gap-4">
          {/* Avatar row */}
          <div className="flex items-end gap-4">
            <div className="relative shrink-0">
              <Avatar name={user.name} size="xl" className="ring-2 ring-paper/20" />
              {profile.available && (
                <span className="absolute bottom-1 right-1 w-4 h-4 bg-forest-500 rounded-full ring-2 ring-ink" />
              )}
            </div>

            <div className="flex-1 min-w-0 pb-1">
              {/* Verification badge */}
              {level === 3 && (
                <div className="inline-flex items-center gap-1 bg-marigold-300/20 text-marigold-300 text-[10px] font-bold px-2 py-0.5 rounded-full mb-2">
                  <Award className="w-3 h-3" />
                  Maestro Camellio
                </div>
              )}
              {level === 2 && (
                <div className="inline-flex items-center gap-1 bg-forest-500/20 text-forest-100 text-[10px] font-bold px-2 py-0.5 rounded-full mb-2">
                  <ShieldCheck className="w-3 h-3" />
                  Verificado
                </div>
              )}

              <h1 className="text-xl font-bold text-paper tracking-tight leading-tight">{user.name}</h1>

              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <CategoryIcon slug={profile.category} size="sm" className="w-5 h-5 rounded-md bg-azulejo-500/40" />
                  <span className="text-xs font-semibold text-azulejo-200">
                    {CATEGORY_NAMES[profile.category] ?? profile.category}
                  </span>
                </div>
                <span className="text-paper/30">·</span>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-paper/50 shrink-0" strokeWidth={1.5} />
                  <span className="text-xs text-paper/60">{user.location.split(",")[0]}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-2">
                <Stars rating={displayRating} count={displayCount} size="sm" className="[&_.text-stone-500]:text-paper/50 [&_.text-marigold-300]:text-marigold-300" />
                <span className={cn(
                  "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                  profile.available
                    ? "bg-forest-500/20 text-forest-100"
                    : "bg-paper/10 text-paper/50"
                )}>
                  {profile.available ? "Disponible ahora" : "No disponible"}
                </span>
              </div>
            </div>
          </div>

          {/* CTAs */}
          {!isOwnProfile && (
            <div className="flex gap-2">
              <Link href="/mensajes" className="flex-1">
                <Button variant="outline" size="md" className="w-full border-paper/30 text-paper hover:bg-paper/10">
                  <MessageSquare className="w-4 h-4" />
                  Contactar
                </Button>
              </Link>
              <Link href="/publicar" className="flex-1">
                <Button variant="marigold" size="md" className="w-full">
                  Invitar a solicitud
                </Button>
              </Link>
            </div>
          )}
          {isOwnProfile && (
            <Button variant="outline" size="md" className="border-paper/30 text-paper hover:bg-paper/10">
              Editar perfil
            </Button>
          )}
        </div>
      </div>

      {/* ── Stats strip ──────────────────────────────────────────────────── */}
      <div className="bg-card border-b border-stone-200 px-4 py-4">
        <div className="grid grid-cols-4 gap-3">
          {[
            { value: displayRating.toFixed(1), label: "Calificación", icon: Star, iconClass: "text-marigold-300" },
            { value: String(profile.completedJobs), label: "Completados", icon: Briefcase, iconClass: "text-azulejo-500" },
            { value: `${formatCOP(profile.hourlyRate)}/h`, label: "Tarifa", icon: null, mono: true },
            { value: `Desde ${memberYear}`, label: "Miembro", icon: null },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              {stat.icon && <stat.icon className={cn("w-4 h-4 mb-1", stat.iconClass)} strokeWidth={stat.icon === Star ? 0 : 1.75} fill={stat.icon === Star ? "currentColor" : "none"} />}
              <p className={cn("text-sm font-bold text-ink leading-tight", stat.mono && "tnum text-xs")}>{stat.value}</p>
              <p className="text-[10px] text-stone-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className="px-4 py-6 flex flex-col gap-8">

        {/* Bio */}
        <section>
          <p className="eyebrow text-stone-500 mb-3">Sobre mí</p>
          <div className="bg-card border border-stone-200 rounded-[16px] p-4">
            <p className="text-sm text-stone-500 leading-relaxed">
              {user.bio ?? "Sin descripción disponible."}
            </p>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-stone-100">
              <Clock className="w-4 h-4 text-forest-500" />
              <span className="text-xs text-stone-500">
                Responde en menos de{" "}
                <span className="font-semibold text-forest-600">2 horas</span> en promedio
              </span>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section>
          <p className="eyebrow text-stone-500 mb-3">Servicios y habilidades</p>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="text-xs font-semibold bg-stone-100 text-stone-600 border border-stone-200 px-3 py-1.5 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Portfolio (placeholder) */}
        <section>
          <p className="eyebrow text-stone-500 mb-3">Trabajos realizados</p>
          <div className="grid grid-cols-2 gap-3">
            {profile.skills.slice(0, 4).map((skill, i) => (
              <div
                key={skill}
                className={cn(
                  "aspect-square rounded-[16px] flex flex-col items-center justify-center gap-2 border border-stone-200 placeholder-stripes",
                  PORTFOLIO_BG[i % PORTFOLIO_BG.length]
                )}
              >
                <CategoryIcon slug={profile.category} size="md" />
                <p className="text-xs font-semibold text-stone-600 text-center px-3 leading-tight">
                  {skill}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs text-stone-400 mt-2 text-center">
            Fotos reales del trabajador próximamente
          </p>
        </section>

        {/* Trust indicators */}
        <section>
          <p className="eyebrow text-stone-500 mb-3">Confianza y verificación</p>
          <div className="flex flex-col gap-2">
            {[
              {
                icon: ShieldCheck,
                label: "Identidad verificada",
                sub: "Cédula de ciudadanía confirmada",
                ok: profile.verified,
              },
              {
                icon: CheckCircle2,
                label: "Antecedentes sin novedad",
                sub: "Verificación judicial aprobada",
                ok: profile.verified,
              },
              {
                icon: Star,
                label: `${Math.round((profile.completedJobs / (profile.completedJobs + 2)) * 100)}% de trabajos completados`,
                sub: `${profile.completedJobs} trabajos finalizados`,
                ok: true,
              },
            ].map((item) => (
              <div
                key={item.label}
                className={cn(
                  "flex items-start gap-3 p-4 rounded-[16px] border",
                  item.ok
                    ? "bg-forest-100 border-forest-100"
                    : "bg-card border-stone-200"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-xl shrink-0 flex items-center justify-center",
                    item.ok ? "bg-forest-500/20" : "bg-stone-100"
                  )}
                >
                  {item.ok
                    ? <CheckCircle2 className="w-4 h-4 text-forest-500" />
                    : <Circle className="w-4 h-4 text-stone-300" />
                  }
                </div>
                <div>
                  <p className={cn("text-sm font-semibold leading-tight", item.ok ? "text-forest-700" : "text-stone-400")}>
                    {item.label}
                  </p>
                  <p className={cn("text-xs mt-0.5", item.ok ? "text-forest-600/70" : "text-stone-400")}>
                    {item.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section>
          <p className="eyebrow text-stone-500 mb-3">Calificaciones y reseñas</p>
          <ReviewSummary reviews={reviews} className="mb-3" />
          <div className="flex flex-col gap-3">
            {reviews.length === 0 ? (
              <div className="bg-card rounded-[16px] border border-dashed border-stone-200 p-8 text-center">
                <Star className="w-8 h-8 text-stone-200 mx-auto mb-2" />
                <p className="text-sm text-stone-400">Aún no hay reseñas</p>
              </div>
            ) : (
              reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  rating={review.rating}
                  comment={review.comment}
                  createdAt={review.createdAt}
                  authorName="Empleador"
                  authorRole="employer"
                  verified
                />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
