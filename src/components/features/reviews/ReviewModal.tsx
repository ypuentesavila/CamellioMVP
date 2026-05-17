"use client";

import { useState } from "react";
import { X, CheckCircle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { StarPicker, StarDisplay } from "@/components/ui/StarRating";
import { useJobs } from "@/context";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
  offerId: string;
  targetId: string;
  targetName: string;
  authorId: string;
}

export function ReviewModal({
  isOpen,
  onClose,
  jobId,
  jobTitle,
  offerId,
  targetId,
  targetName,
  authorId,
}: ReviewModalProps) {
  const { submitReview } = useJobs();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (rating === 0) errs.rating = "Selecciona una calificación";
    if (comment.trim().length < 20)
      errs.comment = "Escribe al menos 20 caracteres";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);

    await new Promise((r) => setTimeout(r, 700));

    submitReview({
      jobId,
      offerId,
      authorId,
      targetId,
      rating,
      comment: comment.trim(),
    });

    setSubmitting(false);
    setSuccess(true);
    setTimeout(onClose, 1800);
  }

  function handleClose() {
    if (submitting || success) return;
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      {success ? (
        /* ── Success ── */
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
          <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-forest-500" strokeWidth={2} />
          </div>
          <h2 className="text-xl font-bold text-ink mb-1">
            ¡Reseña enviada!
          </h2>
          <div className="my-3">
            <StarDisplay value={rating} size="md" showValue />
          </div>
          <p className="text-sm text-stone-500 leading-relaxed max-w-xs">
            Tu reseña ayuda a construir confianza en la comunidad de Camellio.
          </p>
        </div>
      ) : (
        <>
          {/* ── Header ── */}
          <div className="flex items-start justify-between p-5 border-b border-stone-200">
            <div className="min-w-0 pr-3">
              <h2 className="font-bold text-ink text-lg">
                Calificar trabajador
              </h2>
              <p className="text-sm text-stone-500 mt-0.5 line-clamp-1">
                {jobTitle}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="shrink-0 -m-1 p-2.5 rounded-xl hover:bg-stone-100 transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5 text-stone-500" />
            </button>
          </div>

          {/* ── Worker info ── */}
          <div className="px-5 pt-5">
            <div className="flex items-center gap-3 bg-stone-100 rounded-xl p-3">
              <Avatar name={targetName} size="md" />
              <div>
                <p className="font-semibold text-ink text-sm">
                  {targetName}
                </p>
                <p className="text-xs text-stone-500">Trabajador</p>
              </div>
            </div>
          </div>

          {/* ── Form ── */}
          <div className="p-5 flex flex-col gap-5">
            {/* Stars */}
            <div>
              <p className="text-sm font-semibold text-ink mb-3 text-center">
                ¿Cómo calificarías el trabajo?
              </p>
              <StarPicker
                value={rating}
                onChange={(v) => {
                  setRating(v);
                  setErrors((e) => ({ ...e, rating: "" }));
                }}
                size="lg"
              />
              {errors.rating && (
                <p className="text-xs text-danger text-center mt-2">
                  {errors.rating}
                </p>
              )}
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">
                Cuéntanos más
              </label>
              <textarea
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                  setErrors((err) => ({ ...err, comment: "" }));
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-ink bg-card focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink transition-colors resize-none leading-relaxed ${
                  errors.comment ? "border-danger" : "border-stone-200"
                }`}
                placeholder="¿Fue puntual? ¿Dejó todo limpio? ¿Lo recomendarías? Sé específico para ayudar a otros empleadores..."
                rows={4}
              />
              <div className="flex items-start justify-between mt-1">
                <p className="text-xs text-danger">{errors.comment ?? ""}</p>
                <p
                  className={`text-xs ml-auto ${
                    comment.length >= 20 ? "text-forest-500" : "text-stone-400"
                  }`}
                >
                  {comment.length} / 20 mín
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleSubmit}
              loading={submitting}
              disabled={submitting}
              className="w-full"
            >
              {submitting ? "Publicando reseña..." : "Publicar reseña"}
            </Button>

            <p className="text-xs text-stone-400 text-center -mt-2">
              Las reseñas son públicas y no se pueden eliminar después de 48h.
            </p>
          </div>
        </>
      )}
    </Modal>
  );
}
