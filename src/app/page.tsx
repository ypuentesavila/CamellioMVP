"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, Award, Quote, MapPin } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileFooter } from "@/components/layout/MobileFooter";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { Stars } from "@/components/ui/Stars";
import { Mosaico } from "@/components/brand/Mosaico";
import { categories } from "@/data/categories";
import { workers } from "@/data/users";
import { copy } from "@/data/copy";
import { cn } from "@/lib/utils";

// ─── Local data ───────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  plomeria: "Plomería",
  electricidad: "Electricidad",
  carpinteria: "Carpintería",
  pintura: "Pintura",
  limpieza: "Limpieza",
  mudanzas: "Mudanzas",
  cerrajeria: "Cerrajería",
  fumigacion: "Fumigación",
};

const STEPS = [
  {
    n: "1",
    title: "Publica lo que necesitas",
    body: "Describe el trabajo, agrega fotos si quieres y fija tu presupuesto. Tarda menos de 2 minutos.",
  },
  {
    n: "2",
    title: "Recibe propuestas",
    body: "Trabajadores verificados en tu zona envían propuestas. Puedes ver su perfil, reseñas y tarifa antes de responder.",
  },
  {
    n: "3",
    title: "Elige y resuelve",
    body: "Acepta la propuesta que más te convenza. Si el trabajo no queda bien, lo buscamos de nuevo sin costo adicional.",
  },
];

const TESTIMONIALS = [
  {
    quote: "Encontré un plomero en menos de 15 minutos, en mi barrio. No tuve que llamar a nadie ni esperar días.",
    name: "Laura R.",
    role: "Chapinero",
  },
  {
    quote: "Pude ver las fotos de trabajos anteriores y las reseñas antes de contratar. Eso da mucha más confianza que el voz a voz.",
    name: "Jorge M.",
    role: "Negocio local · Engativá",
  },
  {
    quote: "El electricista llegó al otro día. Rápido, limpio y con garantía. No sabía que podía ser tan fácil.",
    name: "Camila V.",
    role: "Teusaquillo",
  },
];

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    color: "text-forest-500",
    bg: "bg-forest-100",
    label: copy.trust.verification,
    desc: copy.trust.verificationDesc,
  },
  {
    icon: ShieldCheck,
    color: "text-marigold-400",
    bg: "bg-marigold-100",
    label: copy.trust.guarantee,
    desc: copy.trust.guaranteeDesc,
  },
  {
    icon: Award,
    color: "text-marigold-300",
    bg: "bg-ink",
    label: copy.trust.maestro,
    desc: copy.trust.maestroDesc,
  },
];

function verificationLevel(w: typeof workers[0]) {
  if ((w.workerProfile?.rating ?? 0) >= 4.8 && (w.workerProfile?.reviewCount ?? 0) >= 30) return 3;
  if (w.workerProfile?.verified) return 2;
  return 1;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const router = useRouter();

  const featured = workers.slice(0, 5);

  return (
    <div className="min-h-screen bg-paper">
      <Header />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="pt-28 pb-16 px-4 max-w-2xl mx-auto text-left sm:text-center sm:mx-auto">
        {/* AI chip */}
        <div className="inline-flex items-center gap-1.5 bg-azulejo-100 text-azulejo-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
          Trabajo local, confianza real
        </div>

        <h1 className="text-[2.5rem] sm:text-5xl font-bold text-ink tracking-tight leading-[1.08] mb-4">
          Lo que necesitas,{" "}
          <span className="serif">resuelto.</span>
        </h1>

        <p className="text-base sm:text-lg text-stone-500 leading-relaxed max-w-md sm:mx-auto mb-8">
          {copy.brand.tagline}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={() => router.push("/registro/cliente")}
          >
            {copy.cta.publishRequest}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push("/registro/trabajador")}
          >
            {copy.cta.imAWorker}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-xs text-stone-400 mt-5 sm:text-center">
          Trabajadores en 19 localidades de Bogotá
        </p>
      </section>

      {/* ── Categories ─────────────────────────────────────────────────────── */}
      <section className="px-4 pb-16 max-w-2xl mx-auto">
        <p className="eyebrow text-stone-500 mb-4">Oficios disponibles</p>
        <div className="grid grid-cols-4 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/explorar?categoria=${cat.slug}`}
              className="flex flex-col items-center gap-2 py-4 rounded-[16px] bg-card border border-stone-200 hover:border-ink transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink group"
            >
              <CategoryIcon slug={cat.slug} size="md" />
              <span className="text-[11px] font-semibold text-stone-600 text-center leading-tight px-1 group-hover:text-ink transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured workers ───────────────────────────────────────────────── */}
      <section className="pb-16">
        <div className="px-4 max-w-2xl mx-auto mb-4">
          <p className="eyebrow text-stone-500 mb-1">Disponibles en tu zona</p>
          <h2 className="text-xl font-bold text-ink tracking-tight">
            Trabajadores verificados
          </h2>
        </div>

        <div className="max-w-2xl mx-auto flex gap-3 px-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2">
          {featured.map((w) => {
            const level = verificationLevel(w);
            return (
              <Link
                key={w.id}
                href={`/perfil/${w.id}`}
                className="shrink-0 w-52 snap-start bg-card rounded-[16px] border border-stone-200 hover:border-ink transition-all duration-150 p-4 flex flex-col gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
              >
                <div className="flex items-start justify-between">
                  <Avatar name={w.name} size="md" />
                  {level === 3 ? (
                    <span className="text-[10px] font-bold bg-ink text-marigold-300 px-2 py-0.5 rounded-full">
                      Maestro
                    </span>
                  ) : level === 2 ? (
                    <span className="text-[10px] font-bold bg-forest-100 text-forest-600 px-2 py-0.5 rounded-full">
                      Verificado
                    </span>
                  ) : null}
                </div>
                <div>
                  <p className="text-sm font-bold text-ink leading-tight">{w.name}</p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {CATEGORY_LABELS[w.workerProfile?.category ?? ""] ?? "Trabajador"}
                  </p>
                </div>
                {w.workerProfile && (
                  <Stars
                    rating={w.workerProfile.rating}
                    count={w.workerProfile.reviewCount}
                    size="sm"
                  />
                )}
              </Link>
            );
          })}
          <Link
            href="/explorar"
            className="shrink-0 w-36 snap-start bg-stone-100 rounded-[16px] border border-stone-200 hover:border-ink transition-all duration-150 flex flex-col items-center justify-center gap-2 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink group"
          >
            <div className="w-10 h-10 rounded-xl bg-stone-200 flex items-center justify-center group-hover:bg-ink transition-colors">
              <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-paper transition-colors" />
            </div>
            <span className="text-xs font-semibold text-stone-500 text-center group-hover:text-ink transition-colors">
              Ver todos
            </span>
          </Link>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────────────── */}
      <section className="px-4 pb-16 max-w-2xl mx-auto">
        <p className="eyebrow text-stone-500 mb-1">Cómo funciona</p>
        <h2 className="text-xl font-bold text-ink tracking-tight mb-8">
          Tres pasos para <span className="serif">resolver.</span>
        </h2>

        <div className="relative flex flex-col gap-0">
          {/* Connecting line */}
          <div className="absolute left-[22px] top-11 bottom-11 w-px bg-stone-200" aria-hidden="true" />

          {STEPS.map((step, i) => (
            <div key={i} className="flex gap-5 relative pb-8 last:pb-0">
              <div className="shrink-0 w-11 h-11 rounded-xl bg-marigold-100 flex items-center justify-center z-10">
                <span className="text-base font-bold text-marigold-400 tnum">{step.n}</span>
              </div>
              <div className="flex-1 pt-2">
                <p className="text-base font-bold text-ink mb-1">{step.title}</p>
                <p className="text-sm text-stone-500 leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trust band ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ink px-4 py-14 mb-0">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <Mosaico density="dense" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="eyebrow text-marigold-300 mb-2">Confianza que importa</p>
          <h2 className="text-xl font-bold text-paper tracking-tight mb-8">
            Construido para que confíes.
          </h2>
          <div className="flex flex-col gap-4">
            {TRUST_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-start gap-4 bg-paper/[0.06] rounded-[16px] p-4 border border-paper/10"
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl shrink-0 flex items-center justify-center",
                      item.bg === "bg-ink" ? "bg-paper/10" : item.bg
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5",
                        item.bg === "bg-ink" ? "text-marigold-300" : item.color
                      )}
                      strokeWidth={1.75}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-paper leading-tight">{item.label}</p>
                    <p className="text-xs text-paper/60 mt-0.5 leading-snug">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────────────────────── */}
      <section className="px-4 py-14 max-w-2xl mx-auto">
        <p className="eyebrow text-stone-500 mb-2">Lo que dicen</p>
        <h2 className="text-xl font-bold text-ink tracking-tight mb-8">
          Clientes en Bogotá.
        </h2>
        <div className="flex flex-col gap-4">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="bg-card border border-stone-200 rounded-[16px] p-5"
            >
              <Quote
                className="w-5 h-5 text-marigold-300 mb-3"
                strokeWidth={1.5}
              />
              <p className="text-sm text-ink leading-relaxed mb-4">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <Avatar name={t.name} size="sm" />
                <div>
                  <p className="text-xs font-bold text-ink">{t.name}</p>
                  <p className="text-xs text-stone-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Garantía band ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ink px-4 py-14">
        <div className="absolute inset-0 opacity-[0.12] pointer-events-none">
          <Mosaico density="dense" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="eyebrow text-marigold-300 mb-3">La promesa</p>
          <h2 className="text-2xl font-bold text-paper tracking-tight mb-3">
            Si no queda bien,{" "}
            <span className="serif text-marigold-300">lo resolvemos.</span>
          </h2>
          <p className="text-sm text-paper/60 mb-8 leading-relaxed">
            Cuando contratas un trabajador desde Camellio, queda con garantía de 30 días. Si algo no sale bien, te conectamos con otro sin costo adicional.
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { k: "30 días",   v: "garantía por trabajo" },
              { k: "100%",      v: "identidad verificada" },
              { k: "Sin costo", v: "si re-asignamos" },
              { k: "Mediación", v: "ante cualquier reclamo" },
            ].map((s) => (
              <div key={s.k} className="bg-paper/[0.07] border border-paper/[0.12] rounded-2xl p-4">
                <div className="text-xl font-bold text-marigold-300 tracking-tight mb-1">{s.k}</div>
                <div className="text-xs text-paper/60 leading-snug">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Demo access ─────────────────────────────────────────────────────── */}
      <section className="px-4 py-8 max-w-2xl mx-auto">
        <details className="group">
          <summary className="flex items-center gap-2 text-xs font-semibold text-stone-400 cursor-pointer hover:text-ink transition-colors list-none select-none">
            <div className="w-1.5 h-1.5 rounded-full bg-forest-500" />
            Prototipo · Acceso rápido
            <ArrowRight className="w-3 h-3 ml-auto transition-transform group-open:rotate-90" />
          </summary>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              { label: "Login", href: "/login" },
              { label: "Registro", href: "/registro" },
            ].map((u) => (
              <Link
                key={u.href}
                href={u.href}
                className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 bg-card hover:border-ink transition-colors text-left"
              >
                <div className="min-w-0">
                  <p className="text-xs font-bold text-ink truncate">{u.label}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {[
              ["/explorar", "Explorar"],
              ["/publicar", "Publicar"],
              ["/mensajes", "Mensajes"],
              ["/registro", "Registro"],
              ["/login", "Login"],
              ["/perfil/u1", "Perfil u1"],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="text-[10px] font-mono text-stone-400 hover:text-ink px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 transition-colors"
              >
                {href}
              </Link>
            ))}
          </div>
        </details>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <Footer />
      <MobileFooter />
    </div>
  );
}
