"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileFooter } from "@/components/layout/MobileFooter";
import { cn } from "@/lib/utils";

// ─── Inline SVG icons ──────────────────────────────────────────────────────────

function IconPencil({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20l4-1 11-11-3-3L5 16l-1 4z" />
    </svg>
  );
}

function IconCamera({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7h3l2-2h8l2 2h3v12H3z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

function IconStar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3 6.5 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" />
    </svg>
  );
}

function IconShield({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function IconMapPin({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function IconClock({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

// ─── Mini UI previews ──────────────────────────────────────────────────────────

function MiniRequestForm() {
  const categories = ["Plomería", "Electricidad", "Pintura", "Limpieza"];
  return (
    <div className="bg-card border border-stone-200 rounded-2xl overflow-hidden shadow-card">
      {/* Top bar */}
      <div className="bg-paper-2 px-4 py-2.5 flex items-center justify-between border-b border-stone-200">
        <div className="flex items-center gap-2">
          <IconPencil className="w-3.5 h-3.5 text-stone-500" />
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-widest">Nueva solicitud</span>
        </div>
        <span className="text-[10px] font-mono text-stone-400">paso 1 / 3</span>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {/* Category selector */}
        <div>
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">Oficio</p>
          <div className="flex gap-1.5 flex-wrap">
            {categories.map((c, i) => (
              <span key={c} className={cn(
                "text-[11.5px] font-semibold px-2.5 py-1 rounded-full border transition-colors",
                i === 0
                  ? "bg-ink text-paper border-ink"
                  : "bg-transparent text-stone-400 border-stone-200"
              )}>{c}</span>
            ))}
          </div>
        </div>

        {/* Description fake textarea */}
        <div>
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">¿Qué necesitas?</p>
          <div className="bg-paper border border-stone-200 rounded-xl px-3 py-2.5">
            <p className="text-[13px] text-ink leading-snug">
              Sale agua por debajo del sifón. Libre el sábado en la mañana.
            </p>
          </div>
        </div>

        {/* Zone + time row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-paper border border-stone-200 rounded-xl px-3 py-2">
            <div className="flex items-center gap-1 mb-0.5">
              <IconMapPin className="w-3 h-3 text-stone-400" />
              <p className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">Zona</p>
            </div>
            <p className="text-[12.5px] font-semibold text-ink">Chapinero</p>
          </div>
          <div className="bg-paper border border-stone-200 rounded-xl px-3 py-2">
            <div className="flex items-center gap-1 mb-0.5">
              <IconClock className="w-3 h-3 text-stone-400" />
              <p className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">Cuando</p>
            </div>
            <p className="text-[12.5px] font-semibold text-ink">Sábado 10am</p>
          </div>
        </div>

        {/* Budget */}
        <div className="bg-marigold-100 border border-marigold-200 rounded-xl px-3 py-2 flex items-center justify-between">
          <span className="text-[11px] font-bold text-marigold-500 uppercase tracking-wider">Presupuesto</span>
          <span className="text-[14px] font-bold text-ink">≤ $150.000</span>
        </div>

        {/* Photos */}
        <div>
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">Fotos del problema</p>
          <div className="flex gap-2">
            <div className="w-16 h-16 rounded-xl placeholder-stripes flex items-center justify-center">
              <IconCamera className="w-4 h-4 text-stone-400" />
            </div>
            <div className="w-16 h-16 rounded-xl bg-azulejo-100 flex items-center justify-center">
              <IconCamera className="w-4 h-4 text-azulejo-400" />
            </div>
            <div className="w-16 h-16 rounded-xl border-2 border-dashed border-stone-200 flex items-center justify-center text-stone-300 text-xl leading-none">
              +
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 pb-4">
        <div className="w-full bg-ink text-paper text-[13px] font-semibold h-10 rounded-xl flex items-center justify-center">
          Publicar solicitud →
        </div>
      </div>
    </div>
  );
}

function MiniProposalList() {
  const proposals = [
    { initials: "DM", name: "Diego Marín",   rating: "4.9", reviews: 47, price: "$120.000", time: "Hoy 3:00 pm",  badge: "maestro"    },
    { initials: "SR", name: "Sandra Ruiz",   rating: "4.8", reviews: 28, price: "$135.000", time: "Sábado 10am",  badge: "verificada" },
    { initials: "OC", name: "Oscar Calle",   rating: "5.0", reviews: 12, price: "$95.000",  time: "Mañana 9am",  badge: null         },
  ];
  return (
    <div className="bg-card border border-stone-200 rounded-[14px] overflow-hidden shadow-card">
      <div className="px-4 py-3 border-b border-paper-2 flex items-center justify-between">
        <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-[0.08em]">
          3 propuestas · hace 8 min
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-forest-500">
          <span className="w-1.5 h-1.5 rounded-full bg-forest-500 softpulse" />
          en vivo
        </div>
      </div>
      {proposals.map((p, i) => (
        <div
          key={p.name}
          className={cn(
            "px-4 py-3.5 grid gap-3 items-center",
            i < proposals.length - 1 && "border-b border-paper-2"
          )}
          style={{ gridTemplateColumns: "auto 1fr auto" }}
        >
          <div className="w-9 h-9 rounded-full bg-ink text-paper flex items-center justify-center text-[13px] font-bold">
            {p.initials}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[13.5px] font-bold text-ink">{p.name}</span>
              {p.badge === "maestro" && (
                <span className="text-[9px] font-bold bg-ink text-marigold-300 px-1.5 py-0.5 rounded-lg uppercase tracking-[0.05em]">
                  Maestro
                </span>
              )}
              {p.badge === "verificada" && (
                <span className="text-[9px] font-bold bg-forest-100 text-forest-600 px-1.5 py-0.5 rounded-lg uppercase tracking-[0.05em]">
                  Verificada
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-[11.5px] text-stone-500">
              <span className="flex items-center gap-1">
                <IconStar className="w-2.5 h-2.5 text-marigold-300" />
                {p.rating}{" "}
                <span className="text-stone-300">({p.reviews})</span>
              </span>
              <span>· {p.time}</span>
            </div>
          </div>
          <div className="text-[14px] font-bold text-ink tnum">{p.price}</div>
        </div>
      ))}
    </div>
  );
}

function MiniChat() {
  return (
    <div className="bg-card border border-stone-200 rounded-[14px] p-3.5 shadow-card">
      <div className="flex items-center gap-2.5 pb-2.5 border-b border-paper-2 mb-2.5">
        <div className="w-8 h-8 rounded-full bg-ink text-paper flex items-center justify-center text-[11px] font-bold">
          DM
        </div>
        <div>
          <div className="text-[13px] font-bold">Diego Marín</div>
          <div className="text-[10.5px] text-forest-500 font-semibold flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-forest-500" />
            en línea
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="self-start max-w-[78%] bg-paper-2 px-3 py-2 text-[13px] text-ink" style={{ borderRadius: "14px 14px 14px 4px" }}>
          Hola, ¿qué tan profunda es la fuga? ¿Puedes mandar foto del sifón?
        </div>
        <div className="self-end max-w-[78%] bg-ink text-paper px-3 py-2 text-[13px]" style={{ borderRadius: "14px 14px 4px 14px" }}>
          Listo, te mando ahora. ¿Sirve sábado 10am?
        </div>
        <div className="self-start max-w-[78%] bg-marigold-100 px-3 py-2 text-[13px] text-marigold-500 font-semibold" style={{ borderRadius: "14px 14px 14px 4px" }}>
          Confirmado · sábado 10am · $120.000
        </div>
      </div>
    </div>
  );
}

function MiniReview() {
  return (
    <div className="bg-card border border-stone-200 rounded-[14px] p-4 shadow-card">
      <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-[0.08em] mb-2.5">
        Trabajo terminado · califica
      </div>
      <div className="flex gap-1 mb-2.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <IconStar key={s} className="w-5 h-5 text-marigold-300" />
        ))}
      </div>
      <div className="text-[13.5px] text-ink leading-relaxed italic mb-2.5">
        "Llegó puntual, dejó todo limpio y me explicó qué había pasado. Quedó perfecto."
      </div>
      <div className="flex items-center justify-between pt-2.5 border-t border-paper-2">
        <div className="text-[12px] text-stone-500">
          Garantía activa <strong className="text-ink">30 días</strong>
        </div>
        <button className="text-[13px] font-bold text-marigold-400 bg-transparent border-none p-0">
          Repetir con Diego →
        </button>
      </div>
    </div>
  );
}

function MiniProfile() {
  const skills = ["Plomería", "Calentadores", "Destapes", "Sifones"];
  const portfolio = [
    "bg-azulejo-100",
    "bg-marigold-100",
    "bg-forest-100",
    "placeholder-stripes",
    "bg-stone-100",
    "bg-azulejo-100",
  ];
  return (
    <div className="bg-card border border-stone-200 rounded-2xl overflow-hidden shadow-card">
      {/* Ink header */}
      <div className="bg-ink px-4 py-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-azulejo-500 text-paper flex items-center justify-center text-[16px] font-bold shrink-0 border-2 border-azulejo-400">
            CM
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[14px] font-bold text-paper">Carlos Mendoza</span>
              <span className="text-[8px] font-bold bg-marigold-300 text-ink px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                Maestro
              </span>
            </div>
            <div className="text-[11px] text-paper/60 mt-0.5">Plomero · Chapinero</div>
            <div className="flex items-center gap-3 mt-1.5">
              <div className="flex items-center gap-1">
                <IconStar className="w-3 h-3 text-marigold-300" />
                <span className="text-[12px] font-bold text-paper">4.9</span>
                <span className="text-[11px] text-paper/50">(47)</span>
              </div>
              <div className="flex items-center gap-1 text-forest-500">
                <span className="w-1.5 h-1.5 rounded-full bg-forest-500 softpulse" />
                <span className="text-[10px] font-semibold text-forest-500">Disponible hoy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="px-4 pt-3 pb-2 border-b border-stone-100">
        <p className="text-[9px] font-bold text-stone-400 uppercase tracking-wider mb-2">Especialidades</p>
        <div className="flex gap-1.5 flex-wrap">
          {skills.map((s) => (
            <span key={s} className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-paper-2 text-stone-600 border border-stone-200">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Portfolio grid */}
      <div className="px-4 pt-3 pb-2">
        <p className="text-[9px] font-bold text-stone-400 uppercase tracking-wider mb-2">Portafolio · 12 trabajos</p>
        <div className="grid grid-cols-3 gap-1.5">
          {portfolio.map((bg, i) => (
            <div key={i} className={cn("aspect-square rounded-lg", bg)} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-stone-100 flex items-center justify-between">
        <div>
          <span className="text-[15px] font-bold text-ink">$45.000</span>
          <span className="text-[11px] text-stone-400">/hora</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-stone-500">
          <IconMapPin className="w-3 h-3" />
          Radio 3 km
        </div>
      </div>
    </div>
  );
}

function MiniInbox() {
  const items = [
    { who: "Laura R.",   what: "Fuga en lavaplatos",   dist: "1.2 km", time: "hace 4 min",  price: "$120K" },
    { who: "Jorge M.",   what: "Cambio de grifería",   dist: "0.8 km", time: "hace 22 min", price: "$80K"  },
    { who: "Andrea C.",  what: "Revisión calentador",  dist: "2.4 km", time: "hace 1h",     price: "$200K" },
  ];
  return (
    <div className="bg-card border border-stone-200 rounded-[14px] overflow-hidden shadow-card">
      <div className="px-4 py-3 border-b border-paper-2 flex items-center justify-between">
        <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-[0.08em]">
          Solicitudes en tu zona
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-forest-500">
          <span className="w-1.5 h-1.5 rounded-full bg-forest-500 softpulse" />
          activo
        </div>
      </div>
      {items.map((it, i) => (
        <div
          key={it.who}
          className={cn(
            "px-4 py-3 grid gap-2.5 items-center",
            i < items.length - 1 && "border-b border-paper-2"
          )}
          style={{ gridTemplateColumns: "1fr auto" }}
        >
          <div>
            <div className="text-[13.5px] font-bold text-ink">{it.what}</div>
            <div className="text-[11.5px] text-stone-500 mt-0.5">
              {it.who} · {it.dist} · {it.time}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[13px] font-bold text-ink tnum">{it.price}</span>
            <button className="bg-marigold-300 text-ink text-[11.5px] font-bold px-3 py-1 rounded-lg border-none">
              Proponer
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}


function MiniReputation() {
  return (
    <div className="bg-card border border-stone-200 rounded-[14px] p-4 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-[0.08em]">
          Tu reputación
        </div>
        <span className="text-[9px] font-bold bg-ink text-marigold-300 px-2 py-0.5 rounded-xl uppercase tracking-[0.05em]">
          Maestro
        </span>
      </div>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-[32px] font-bold tracking-tight">4.9</span>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <IconStar key={s} className="w-3.5 h-3.5 text-marigold-300" />
          ))}
        </div>
      </div>
      <div className="text-[12px] text-stone-500 mb-3">
        47 reseñas · 38 trabajos completados
      </div>
      <div className="pt-3 border-t border-paper-2 text-[12.5px] text-ink italic leading-relaxed">
        "Carlos llegó antes de la hora, súper profesional…"
      </div>
    </div>
  );
}

// ─── Step types & data ─────────────────────────────────────────────────────────

interface Step {
  n: string;
  title: string;
  body: string;
  meta: string;
  ui: React.ReactNode;
}

const CLIENTE_STEPS: Step[] = [
  {
    n: "01",
    title: "Cuenta qué necesitas",
    body: "Describe el trabajo en tus palabras, súbele fotos del problema y dinos cuándo te queda fácil. Sin formularios largos: menos de 2 minutos.",
    meta: "Tiempo promedio: 1m 40s",
    ui: <MiniRequestForm />,
  },
  {
    n: "02",
    title: "Recibe propuestas en minutos",
    body: "Los trabajadores verificados de tu zona ven tu solicitud al instante. Te llegan propuestas con precio, hora y perfil completo para que compares sin presión.",
    meta: "78% recibe ≥ 3 propuestas en la primera hora",
    ui: <MiniProposalList />,
  },
  {
    n: "03",
    title: "Conversa y acuerda",
    body: "Habla por chat con el que más te convenza. Aclara dudas, confirma alcance y precio, y agenda. Toda la conversación queda guardada en Camellio.",
    meta: "Chat con notificaciones · sin compartir tu número",
    ui: <MiniChat />,
  },
  {
    n: "04",
    title: "Califica y queda con garantía",
    body: "Después del trabajo, califica al trabajador. Si algo no quedó bien en los 30 días siguientes, lo buscamos de nuevo sin que pagues otra vez.",
    meta: "Garantía Camellio · 30 días",
    ui: <MiniReview />,
  },
];

const TRABAJADOR_STEPS: Step[] = [
  {
    n: "01",
    title: "Arma tu perfil con tu trabajo real",
    body: "Foto, oficio, zona y fotos reales de trabajos anteriores. Tu portafolio se vuelve tu currículum: los perfiles con fotos reciben hasta 3 veces más solicitudes.",
    meta: "Verificación de identidad en 24h",
    ui: <MiniProfile />,
  },
  {
    n: "02",
    title: "Activa tu disponibilidad",
    body: "Tú decides cuándo estás activo y hasta qué distancia te mueves. Recibes solo solicitudes de tu zona y de tu oficio. Si hoy no quieres, no recibes.",
    meta: "Radio configurable · de 1 a 8 km",
    ui: <MiniInbox />,
  },
  {
    n: "03",
    title: "Propón, conversa, cierra",
    body: "Mira la solicitud, manda tu propuesta con precio y hora. Si el cliente acepta, hablan por chat, confirman alcance y a trabajar. Pago directo, sin intermediarios.",
    meta: "Comisión Camellio · 8% sobre el trabajo",
    ui: <MiniChat />,
  },
  {
    n: "04",
    title: "Construye tu reputación territorial",
    body: "Cada trabajo bien hecho suma reseñas en tu barrio. La gente de tu zona te ve primero. Llegas a 'Maestro' por trabajo cumplido, no por suscripciones.",
    meta: "Subes de nivel con 30+ trabajos y 4.8★",
    ui: <MiniReputation />,
  },
];

// ─── StepCard ──────────────────────────────────────────────────────────────────

function StepCard({ step, last }: { step: Step; last: boolean }) {
  return (
    <div
      className="grid gap-5 relative"
      style={{ gridTemplateColumns: "56px 1fr", paddingBottom: last ? 0 : 36 }}
    >
      {!last && (
        <div className="absolute left-7 top-14 bottom-3 w-px bg-stone-200" />
      )}
      <div className="w-14 h-14 rounded-2xl bg-marigold-100 flex items-center justify-center relative z-10 shrink-0">
        <span className="text-[22px] font-bold text-marigold-400 tnum">{step.n}</span>
      </div>
      <div>
        <h3 className="text-[19px] font-bold text-ink tracking-tight m-0">{step.title}</h3>
        <p className="text-[14.5px] text-stone-500 leading-relaxed mt-1.5 mb-3.5">{step.body}</p>
        {step.ui}
        <div className="flex items-center gap-2 mt-3.5 text-[12px] text-stone-400 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-forest-500 shrink-0" />
          {step.meta}
        </div>
      </div>
    </div>
  );
}

// ─── FAQ ───────────────────────────────────────────────────────────────────────

const FAQ_CLIENTE = [
  {
    q: "¿Tengo que pagar para publicar?",
    a: "No. Publicar es gratis y siempre lo será. Solo pagas directamente al trabajador por el trabajo.",
  },
  {
    q: "¿Qué pasa si no me gusta ninguna propuesta?",
    a: "No aceptes ninguna. No estás obligado a contratar. Puedes editar la solicitud o cerrarla cuando quieras.",
  },
  {
    q: "¿Cómo sé que el trabajador es real?",
    a: "Todos pasan verificación de identidad. Los 'Maestros' suman además 30+ trabajos y 4.8★ de reseñas reales.",
  },
];

const FAQ_TRAB = [
  {
    q: "¿Cuánto cobra Camellio?",
    a: "8% sobre el trabajo cerrado. Registrarte, tener perfil y recibir solicitudes es gratis.",
  },
  {
    q: "¿Puedo rechazar trabajos?",
    a: "Sí. Tú decides qué proponer y qué no. No hay penalización por no responder.",
  },
  {
    q: "¿Necesito experiencia certificada?",
    a: "No es obligatorio, pero certificados (SENA, cursos) suman puntos de verificación y te dan prioridad.",
  },
];

function FAQSection({ side }: { side: "cliente" | "trabajador" }) {
  const items = side === "cliente" ? FAQ_CLIENTE : FAQ_TRAB;
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="max-w-2xl mx-auto px-6 mt-12">
      <p className="eyebrow text-stone-500 mb-2">Lo que la gente pregunta</p>
      <h2 className="text-[22px] font-bold tracking-tight mb-5">
        Antes de empezar,{" "}
        <span className="serif">resolvamos esto.</span>
      </h2>
      <div className="flex flex-col gap-2">
        {items.map((f, i) => (
          <div
            key={i}
            className={cn(
              "bg-card border rounded-[14px] overflow-hidden transition-colors duration-150",
              open === i ? "border-ink" : "border-stone-200"
            )}
          >
            <button
              className="w-full px-5 py-4 flex items-center justify-between text-[15px] font-semibold text-ink text-left gap-4 bg-transparent border-none"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span>{f.q}</span>
              <span
                className={cn(
                  "text-stone-400 font-mono text-sm transition-transform duration-200 shrink-0",
                  open === i && "rotate-90 text-ink"
                )}
              >
                →
              </span>
            </button>
            {open === i && (
              <div className="px-5 pb-5 text-[14px] leading-relaxed text-stone-500">
                {f.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Inline guarantee band ─────────────────────────────────────────────────────

function GuaranteeBand({ side }: { side: "cliente" | "trabajador" }) {
  return (
    <div className="max-w-2xl mx-auto px-6 mt-8">
      <div
        className="bg-card border border-stone-200 rounded-[18px] p-6 grid gap-4 items-center"
        style={{ gridTemplateColumns: "auto 1fr" }}
      >
        <div className="w-[52px] h-[52px] rounded-[14px] bg-ink flex items-center justify-center text-marigold-300 shrink-0">
          <IconShield className="w-6 h-6" />
        </div>
        <div>
          <p className="eyebrow text-marigold-400 mb-1">Promesa Camellio</p>
          <p className="text-[15.5px] text-ink leading-relaxed m-0">
            {side === "cliente" ? (
              <>
                Si el trabajo no queda bien,{" "}
                <strong>lo buscamos de nuevo. Sin costo adicional.</strong> 30 días de
                garantía sobre cada trabajo cerrado en Camellio.
              </>
            ) : (
              <>
                Si un cliente no cumple,{" "}
                <strong>te cubrimos el tiempo de desplazamiento.</strong> Y mediamos
                cualquier reclamo desde Camellio.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}


// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ComoFuncionaPage() {
  const [side, setSide] = useState<"cliente" | "trabajador">("cliente");
  const steps = side === "cliente" ? CLIENTE_STEPS : TRABAJADOR_STEPS;

  return (
    <div className="bg-paper min-h-screen text-ink font-sans">
      <Header />

      {/* Hero */}
      <section className="max-w-2xl mx-auto px-6 pt-14 pb-8">
        <p className="eyebrow text-stone-500 mb-3">Cómo funciona</p>
        <h1 className="text-[44px] font-bold leading-[1.06] tracking-tight mb-4">
          De una solicitud a un trabajo bien hecho,{" "}
          <span className="serif">sin vueltas.</span>
        </h1>
        <p className="text-[16px] leading-relaxed text-stone-500 max-w-[540px] m-0">
          Camellio es el puente entre quien necesita algo resuelto y el
          trabajador que lo resuelve. Mira el camino completo desde los dos
          lados.
        </p>
      </section>

      {/* Tabs */}
      <div className="max-w-2xl mx-auto px-6">
        <div className="inline-flex p-1 bg-paper-2 rounded-[14px] gap-0.5">
          {(
            [
              { id: "cliente" as const,    label: "Necesito algo resuelto" },
              { id: "trabajador" as const, label: "Soy trabajador" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setSide(t.id)}
              className={cn(
                "px-[18px] py-2.5 rounded-[10px] text-[14px] font-semibold border-none cursor-pointer transition-all duration-200",
                side === t.id
                  ? "bg-ink text-paper"
                  : "bg-transparent text-stone-600 hover:text-ink"
              )}
              style={{ transitionTimingFunction: "cubic-bezier(.2,.7,.3,1)" }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Steps */}
      <section className="max-w-2xl mx-auto px-6 pt-10">
        <div key={side} className="animate-fade-in">
          {steps.map((s, i) => (
            <StepCard key={s.n} step={s} last={i === steps.length - 1} />
          ))}
        </div>
      </section>

      {/* Inline guarantee */}
      <GuaranteeBand side={side} />

      {/* FAQ */}
      <FAQSection key={side} side={side} />

      <div className="h-16" />

      <Footer />
      <MobileFooter />
    </div>
  );
}
