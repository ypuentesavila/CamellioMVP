"use client";

import Link from "next/link";
import {
  MapPin,
  CheckCircle,
  Building2,
  Briefcase,
  Users,
  Calendar,
  Star,
  MessageSquare,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ReviewCard } from "@/components/features/reviews/ReviewCard";
import { JobCard } from "@/components/features/jobs/JobCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { useJobs } from "@/context";
import { useAuth } from "@/context";
import { getUserById } from "@/data/users";
import type { User } from "@/types";

interface EmployerProfileViewProps {
  user: User;
}

export function EmployerProfileView({ user }: EmployerProfileViewProps) {
  const { jobs, getReviewsByJob, offers } = useJobs();
  const { user: viewer } = useAuth();

  const profile = user.employerProfile!;
  const isOwnProfile = viewer?.id === user.id;

  const memberYear = new Date(user.createdAt).getFullYear();

  // Jobs belonging to this employer
  const employerJobs = jobs.filter((j) => j.employerId === user.id);
  const openJobs = employerJobs.filter((j) => j.status === "open");
  const completedJobs = employerJobs.filter((j) => j.status === "completed");
  const activeJobs = employerJobs.filter((j) => j.status === "in_progress");

  // Reviews this employer has given
  const reviewsGiven = completedJobs.flatMap((j) => getReviewsByJob(j.id));

  // Hiring rate (how often they follow through)
  const hiringRate =
    employerJobs.length > 0
      ? Math.round(
          ((completedJobs.length + activeJobs.length) / employerJobs.length) *
            100
        )
      : 0;

  return (
    <div className="max-w-3xl mx-auto">
      {/* ── Header ── */}
      <div className="bg-card border-b border-stone-200 px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
          <Avatar
            name={user.name}
            size="xl"
            className="ring-4 ring-paper shadow-card-hover"
          />

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-ink">
                {user.name}
              </h1>
              {profile.verified && (
                <CheckCircle className="w-5 h-5 text-forest-500 shrink-0" />
              )}
            </div>

            {profile.companyName && (
              <div className="flex items-center gap-1.5 text-stone-500 text-sm mb-1">
                <Building2 className="w-4 h-4" />
                <span className="font-medium">{profile.companyName}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-stone-500 text-sm mb-2">
              <MapPin className="w-3.5 h-3.5" />
              {user.location}
            </div>

            <div className="flex flex-wrap gap-2">
              {profile.verified && (
                <Badge variant="default" size="sm">
                  <CheckCircle className="w-3 h-3" />
                  Verificado
                </Badge>
              )}
              <Badge variant="neutral" size="sm">
                Empleador
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
              <Link href="/mensajes">
                <Button variant="primary" size="md">
                  <MessageSquare className="w-4 h-4" />
                  Contactar
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="bg-paper border-b border-stone-200 px-4 sm:px-6 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              icon: Briefcase,
              value: String(profile.jobsPosted),
              label: "Trabajos publicados",
              color: "text-azulejo-500",
            },
            {
              icon: Users,
              value: String(completedJobs.length + activeJobs.length),
              label: "Contrataciones",
              color: "text-forest-500",
            },
            {
              icon: Star,
              value: `${hiringRate}%`,
              label: "Tasa de contratación",
              color: "text-marigold-400",
            },
            {
              icon: Calendar,
              value: `Desde ${memberYear}`,
              label: "Miembro",
              color: "text-ink",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center p-3 rounded-xl bg-card border border-stone-200"
            >
              <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
              <p className="text-base font-bold text-ink tnum">
                {stat.value}
              </p>
              <p className="text-xs text-stone-500 leading-tight">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6 flex flex-col gap-8">
        {/* ── About ── */}
        {user.bio && (
          <section>
            <h2 className="text-base font-bold text-ink mb-3">
              Sobre mí
            </h2>
            <div className="bg-card rounded-[16px] p-5 border border-stone-200">
              <p className="text-sm text-stone-500 leading-relaxed">
                {user.bio}
              </p>
            </div>
          </section>
        )}

        {/* ── Trust ── */}
        <section>
          <h2 className="text-base font-bold text-ink mb-3">
            Confianza
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                icon: CheckCircle,
                label: "Identidad verificada",
                sub: "Datos de contacto confirmados",
                ok: profile.verified,
              },
              {
                icon: Briefcase,
                label: "Historial de publicaciones",
                sub: `${profile.jobsPosted} trabajos publicados en Camellio`,
                ok: profile.jobsPosted > 0,
              },
              {
                icon: Users,
                label: "Contrataciones activas",
                sub:
                  activeJobs.length > 0
                    ? `${activeJobs.length} trabajador${activeJobs.length > 1 ? "es" : ""} activo${activeJobs.length > 1 ? "s" : ""}`
                    : "Sin contrataciones activas",
                ok: activeJobs.length > 0,
              },
              {
                icon: Star,
                label: "Reseñas verificadas",
                sub:
                  reviewsGiven.length > 0
                    ? `Ha calificado ${reviewsGiven.length} trabajador${reviewsGiven.length > 1 ? "es" : ""}`
                    : "Aún no ha dejado reseñas",
                ok: reviewsGiven.length > 0,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-3 p-4 bg-card rounded-[16px] border border-stone-200"
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    item.ok ? "bg-forest-100" : "bg-stone-100"
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 ${
                      item.ok ? "text-forest-500" : "text-stone-300"
                    }`}
                  />
                </div>
                <div>
                  <p
                    className={`text-sm font-semibold ${
                      item.ok ? "text-ink" : "text-stone-500"
                    }`}
                  >
                    {item.label}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {item.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Open jobs ── */}
        {openJobs.length > 0 && (
          <section>
            <SectionHeader
              title="Trabajos abiertos"
              count={openJobs.length}
            />
            <div className="flex flex-col gap-3">
              {openJobs.map((job) => (
                <JobCard key={job.id} job={job} variant="full" />
              ))}
            </div>
          </section>
        )}

        {/* ── Reviews given ── */}
        <section>
          <SectionHeader
            title="Reseñas que ha dejado"
            count={reviewsGiven.length}
          />
          {reviewsGiven.length === 0 ? (
            <div className="bg-card rounded-[16px] border border-dashed border-stone-200 p-8 text-center">
              <Star className="w-8 h-8 text-stone-200 mx-auto mb-2" />
              <p className="text-sm text-stone-500">
                Aún no ha dejado reseñas
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {reviewsGiven.map((review) => {
                const target = getUserById(review.targetId);
                return (
                  <ReviewCard
                    key={review.id}
                    rating={review.rating}
                    comment={review.comment}
                    createdAt={review.createdAt}
                    authorName={user.name}
                    authorRole="employer"
                    jobTitle={
                      jobs.find((j) => j.id === review.jobId)?.title
                    }
                    verified={profile.verified}
                  />
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
