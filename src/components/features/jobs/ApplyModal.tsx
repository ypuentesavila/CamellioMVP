"use client";

import { useState } from "react";
import { X, CheckCircle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { formatCOP, formatCOPShort } from "@/lib/format";
import { useAuth } from "@/context";
import { useJobs } from "@/context";
import type { Job } from "@/types";

const durationOptions = [
  "1-2 horas",
  "Medio día (3-4 horas)",
  "1 día completo",
  "2-3 días",
  "Más de 3 días",
];

interface ApplyModalProps {
  job: Job | null;
  onClose: () => void;
}

export function ApplyModal({ job, onClose }: ApplyModalProps) {
  const { user } = useAuth();
  const { submitOffer } = useJobs();

  const [price, setPrice] = useState(() => String(job?.budget.min ?? ""));
  const [duration, setDuration] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  function clearError(field: string) {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    const priceNum = Number(price);

    if (!price || priceNum <= 0) {
      errs.price = "Ingresa un precio válido";
    } else if (job && priceNum > job.budget.max * 2.5) {
      errs.price = "El precio está muy por encima del rango del empleador";
    }

    if (!duration) {
      errs.duration = "Selecciona una duración estimada";
    }

    if (message.trim().length < 30) {
      errs.message = "Escribe al menos 30 caracteres";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    if (!validate() || !user || !job) return;

    setSubmitting(true);

    // Simulate async call
    await new Promise((r) => setTimeout(r, 900));

    submitOffer({
      jobId: job.id,
      workerId: user.id,
      employerId: job.employerId,
      proposedPrice: Number(price),
      estimatedDuration: duration,
      message: message.trim(),
    });

    setSubmitting(false);
    setSuccess(true);

    setTimeout(onClose, 1800);
  }

  function handleClose() {
    if (success || submitting) return;
    onClose();
  }

  return (
    <Modal isOpen={job !== null} onClose={handleClose}>
      {success ? (
        /* ── Success state ── */
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-success" strokeWidth={2} />
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">
            ¡Postulación enviada!
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
            El empleador verá tu propuesta y podrá aceptarla, negociar o contactarte.
          </p>
        </div>
      ) : (
        <>
          {/* ── Header ── */}
          <div className="flex items-start justify-between p-5 border-b border-border">
            <div className="min-w-0 pr-3">
              <h2 className="font-bold text-text-primary text-lg leading-tight">
                Enviar propuesta
              </h2>
              {job && (
                <p className="text-sm text-text-secondary mt-0.5 line-clamp-1">
                  {job.title}
                </p>
              )}
            </div>
            <button
              onClick={handleClose}
              className="shrink-0 p-1.5 rounded-lg hover:bg-background transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>

          {/* ── Budget hint ── */}
          {job && (
            <div className="px-5 pt-4">
              <div className="bg-primary-light rounded-xl px-4 py-3 flex items-center justify-between">
                <span className="text-sm text-primary font-medium">
                  Rango del empleador
                </span>
                <span className="text-sm font-bold text-primary">
                  {formatCOPShort(job.budget.min)} – {formatCOPShort(job.budget.max)}
                </span>
              </div>
            </div>
          )}

          {/* ── Form ── */}
          <div className="p-5 flex flex-col gap-5">
            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1.5">
                Tu precio propuesto
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary font-semibold text-sm pointer-events-none">
                  $
                </span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => { setPrice(e.target.value); clearError("price"); }}
                  className={`w-full pl-8 pr-4 py-2.5 rounded-xl border text-sm font-semibold text-text-primary bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors ${
                    errors.price ? "border-danger" : "border-border focus:border-primary"
                  }`}
                  placeholder={job ? String(job.budget.min) : "0"}
                  min={1}
                />
              </div>
              {errors.price ? (
                <p className="text-xs text-danger mt-1">{errors.price}</p>
              ) : price && Number(price) > 0 ? (
                <p className="text-xs text-text-secondary mt-1">
                  {formatCOP(Number(price))} COP
                </p>
              ) : null}
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1.5">
                Duración estimada
              </label>
              <select
                value={duration}
                onChange={(e) => { setDuration(e.target.value); clearError("duration"); }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-text-primary bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors ${
                  errors.duration ? "border-danger" : "border-border focus:border-primary"
                }`}
              >
                <option value="">Selecciona una opción...</option>
                {durationOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {errors.duration && (
                <p className="text-xs text-danger mt-1">{errors.duration}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1.5">
                Mensaje al empleador
              </label>
              <textarea
                value={message}
                onChange={(e) => { setMessage(e.target.value); clearError("message"); }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-text-primary bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors resize-none leading-relaxed ${
                  errors.message ? "border-danger" : "border-border focus:border-primary"
                }`}
                placeholder="Describe tu experiencia, herramientas y disponibilidad. Cuéntale por qué eres la mejor opción..."
                rows={4}
              />
              <div className="flex items-start justify-between mt-1 gap-2">
                <p className="text-xs text-danger">{errors.message ?? ""}</p>
                <p
                  className={`text-xs shrink-0 ${
                    message.length >= 30 ? "text-success" : "text-text-secondary"
                  }`}
                >
                  {message.length} / 30 mín
                </p>
              </div>
            </div>

            {/* Submit */}
            <Button
              variant="primary"
              size="lg"
              onClick={handleSubmit}
              loading={submitting}
              disabled={submitting}
              className="w-full"
            >
              {submitting ? "Enviando propuesta..." : "Enviar propuesta"}
            </Button>

            <p className="text-xs text-text-secondary text-center -mt-2">
              El empleador verá tu calificación y perfil junto con esta propuesta.
            </p>
          </div>
        </>
      )}
    </Modal>
  );
}
