"use client";

import Link from "next/link";
import {
  MapPin,
  CheckCircle,
  Clock,
  Star,
  Briefcase,
  Shield,
  Award,
  MessageSquare,
  Wrench,
  Zap,
  Hammer,
  Paintbrush,
  Sparkles,
  Key,
  Package,
  Bug,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StarDisplay } from "@/components/ui/StarRating";
import { ReviewCard } from "@/components/features/reviews/ReviewCard";
import { ReviewSummary } from "@/components/features/reviews/ReviewSummary";
import { useJobs } from "@/context";
import { useAuth } from "@/context";
import { getUserById } from "@/data/users";
import { formatCOP } from "@/lib/format";
import type { User } from "@/types";

const categoryIcons: Record<string, React.ElementType> = {
  plomeria: Wrench,
  electricidad: Zap,
  carpinteria: Hammer,
  pintura: Paintbrush,
  limpieza: Sparkles,
  cerrajeria: Key,
  mudanzas: Package,
  fumigacion: Bug,
};

const categoryNames: Record<string, string> = {
  plomeria: "Plomería",
  electricidad: "Electricidad",
  carpinteria: "Carpintería",
  pintura: "Pintura",
  limpieza: "Limpieza",
  cerrajeria: "Cerrajería",
  mudanzas: "Mudanzas",
  fumigacion: "Fumigación",
};

const portfolioColors = [
  "bg-primary-light",
  "bg-accent-light",
  "bg-success/10",
  "bg-primary-mid",
];

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

  const CategoryIcon = categoryIcons[profile.category] ?? Wrench;
  const isOwnProfile = viewer?.id === user.id;

  const memberYear = new Date(user.createdAt).getFullYear();

  return (
    <div className="max-w-3xl mx-auto">
      {/* ── Hero header ── */}
      <div className="bg-gradient-to-br from-primary-light via-primary-mid to-background px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
          {/* Avatar + availability */}
          <div className="relative shrink-0">
            <Avatar name={user.name} size="xl" className="ring-4 ring-surface shadow-card-hover" />
            {profile.available && (
              <span className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-success rounded-full ring-2 ring-surface" />
            )}
          </div>

          {/* Identity */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-text-primary">{user.name}</h1>
              {profile.verified && (
                <CheckCircle className="w-5 h-5 text-primary shrink-0" />
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-2">
              <div className="flex items-center gap-1.5 text-text-secondary text-sm">
                <CategoryIcon className="w-4 h-4 text-primary" />
                <span className="font-medium text-primary">
                  {categoryNames[profile.category] ?? profile.category}
                </span>
              </div>
              <div className="flex items-center gap-1 text-text-secondary text-sm">
                <MapPin className="w-3.5 h-3.5" />
                {user.location}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <StarDisplay value={displayRating} size="sm" showValue />
              <span className="text-xs text-text-secondary">
                ({displayCount} reseñas)
              </span>
              <Badge
                variant={profile.available ? "success" : "neutral"}
                dot
                size="sm"
              >
                {profile.available ? "Disponible ahora" : "No disponible"}
              </Badge>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex gap-2 shrink-0 w-full sm:w-auto">
            {isOwnProfile ? (
              <Button variant="outline" size="md">
                Editar perfil
              </Button>
            ) : (
              <>
                <Link href={`/mensajes`}>
                  <Button variant="outline" size="md">
                    <MessageSquare className="w-4 h-4" />
                    Contactar
                  </Button>
                </Link>
                <Link href="/publicar">
                  <Button variant="primary" size="md">
                    Contratar
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="bg-surface border-b border-border px-4 sm:px-6 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              icon: Star,
              value: displayRating.toFixed(1),
              label: "Calificación",
              color: "text-accent",
            },
            {
              icon: Briefcase,
              value: String(profile.completedJobs),
              label: "Completados",
              color: "text-primary",
            },
            {
              icon: Clock,
              value: `${formatCOP(profile.hourlyRate)}/h`,
              label: "Tarifa hora",
              color: "text-text-primary",
            },
            {
              icon: Award,
              value: `Desde ${memberYear}`,
              label: "Miembro",
              color: "text-text-primary",
            },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-3 rounded-xl bg-background">
              <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
              <p className="text-base font-bold text-text-primary">{stat.value}</p>
              <p className="text-xs text-text-secondary">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6 flex flex-col gap-8">
        {/* ── About ── */}
        <section>
          <h2 className="text-base font-bold text-text-primary mb-3">Sobre mí</h2>
          <div className="bg-surface rounded-xl p-5 shadow-card border border-border">
            <p className="text-sm text-text-secondary leading-relaxed">
              {user.bio ?? "Sin descripción disponible."}
            </p>
            {/* Response time indicator */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
              <Clock className="w-4 h-4 text-success" />
              <span className="text-xs text-text-secondary">
                Responde en menos de{" "}
                <span className="font-semibold text-success">2 horas</span> en promedio
              </span>
            </div>
          </div>
        </section>

        {/* ── Skills ── */}
        <section>
          <h2 className="text-base font-bold text-text-primary mb-3">Servicios y habilidades</h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <Badge key={skill} variant="default" size="md">
                {skill}
              </Badge>
            ))}
          </div>
        </section>

        {/* ── Portfolio (placeholder) ── */}
        <section>
          <h2 className="text-base font-bold text-text-primary mb-3">
            Trabajos realizados
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {profile.skills.slice(0, 4).map((skill, i) => (
              <div
                key={skill}
                className={`aspect-square ${portfolioColors[i % portfolioColors.length]} rounded-xl flex flex-col items-center justify-center gap-2 border border-border`}
              >
                <CategoryIcon className="w-8 h-8 text-primary" />
                <p className="text-xs font-medium text-text-secondary text-center px-2 leading-tight">
                  {skill}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs text-text-secondary mt-2 text-center">
            Portfolio con fotos reales próximamente
          </p>
        </section>

        {/* ── Trust indicators ── */}
        <section>
          <h2 className="text-base font-bold text-text-primary mb-3">
            Confianza y verificación
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                icon: CheckCircle,
                label: "Identidad verificada",
                sub: "Cédula de ciudadanía confirmada",
                ok: profile.verified,
              },
              {
                icon: Shield,
                label: "Habilidades verificadas",
                sub: "Evaluación técnica aprobada",
                ok: profile.verified,
              },
              {
                icon: Star,
                label: "Tasa de completación",
                sub: `${Math.round((profile.completedJobs / (profile.completedJobs + 2)) * 100)}% de trabajos completados`,
                ok: true,
              },
              {
                icon: Award,
                label: "Certificado SENA",
                sub: "Formación técnica certificada",
                ok: profile.category === "electricidad",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-3 p-4 bg-surface rounded-xl border border-border shadow-card"
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    item.ok ? "bg-success/10" : "bg-background"
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 ${item.ok ? "text-success" : "text-border"}`}
                  />
                </div>
                <div>
                  <p
                    className={`text-sm font-semibold ${
                      item.ok ? "text-text-primary" : "text-text-secondary"
                    }`}
                  >
                    {item.label}
                  </p>
                  <p className="text-xs text-text-secondary mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Reviews ── */}
        <section>
          <h2 className="text-base font-bold text-text-primary mb-3">
            Calificaciones y reseñas
          </h2>

          <ReviewSummary reviews={reviews} className="mb-4" />

          <div className="flex flex-col gap-3">
            {reviews.length === 0 ? (
              <div className="bg-surface rounded-xl border border-dashed border-border p-8 text-center">
                <Star className="w-8 h-8 text-border mx-auto mb-2" />
                <p className="text-sm text-text-secondary">
                  Aún no hay reseñas para este trabajador
                </p>
              </div>
            ) : (
              reviews.map((review) => {
                const author = getUserById(review.authorId);
                return (
                  <ReviewCard
                    key={review.id}
                    rating={review.rating}
                    comment={review.comment}
                    createdAt={review.createdAt}
                    authorName={author?.name ?? "Empleador"}
                    authorRole="employer"
                    verified
                  />
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
