import type { Review } from "@/types";

export const reviews: Review[] = [
  {
    id: "r1",
    jobId: "j4",
    offerId: "o4",
    authorId: "u10",
    targetId: "u3",
    rating: 5,
    comment: "Luisa es increíble. Dejó la casa impecable, fue muy puntual y trabajó con mucho cuidado. Sin duda la volvería a contratar para la próxima limpieza.",
    createdAt: "2026-04-22T18:00:00Z",
  },
  {
    id: "r2",
    jobId: "j9",
    offerId: "o9",
    authorId: "u7",
    targetId: "u2",
    rating: 4,
    comment: "Andrés resolvió el problema del breaker rápidamente. Muy profesional y explicó bien qué estaba pasando. Le quito una estrella porque llegó 20 minutos tarde, pero el trabajo fue excelente.",
    createdAt: "2026-04-08T16:30:00Z",
  },
  {
    id: "r3",
    jobId: "j10",
    offerId: "o10",
    authorId: "u8",
    targetId: "u1",
    rating: 5,
    comment: "Carlos es el mejor plomero que he contratado. Identificó el problema enseguida, lo reparó bien y dejó todo limpio. El precio fue justo. Lo recomiendo totalmente.",
    createdAt: "2026-04-14T18:00:00Z",
  },
  {
    id: "r4",
    jobId: "j4",
    offerId: "o4",
    authorId: "u3",
    targetId: "u10",
    rating: 5,
    comment: "Tomás fue muy amable y la casa estaba en buen estado. Pagó puntual y me facilitó el acceso sin problemas. Empleador recomendado.",
    createdAt: "2026-04-22T19:00:00Z",
  },
  {
    id: "r5",
    jobId: "j10",
    offerId: "o10",
    authorId: "u1",
    targetId: "u8",
    rating: 5,
    comment: "Juan Pablo explicó muy bien el problema desde el inicio, pagó el precio acordado sin regatear y fue muy amable durante todo el trabajo. Lo recomiendo totalmente como empleador.",
    createdAt: "2026-04-14T19:30:00Z",
  },
];

export function getReviewsByWorker(workerId: string): Review[] {
  return reviews.filter((r) => r.targetId === workerId);
}

export function getReviewsByJob(jobId: string): Review[] {
  return reviews.filter((r) => r.jobId === jobId);
}

export function getAverageRating(workerId: string): number {
  const workerReviews = getReviewsByWorker(workerId);
  if (workerReviews.length === 0) return 0;
  return workerReviews.reduce((sum, r) => sum + r.rating, 0) / workerReviews.length;
}
