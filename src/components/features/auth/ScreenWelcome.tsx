"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { AuthLayout } from "./AuthLayout";
import { Mosaico } from "@/components/brand/Mosaico";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context";
import { copy } from "@/data/copy";
import { cn } from "@/lib/utils";

export function ScreenWelcome() {
  const router = useRouter();
  const { user, isWorker } = useAuth();

  const items = isWorker
    ? [
        { label: "Perfil creado", done: true },
        { label: "Identidad en verificación", done: false, current: true },
        { label: "Recibe tu primera solicitud", done: false },
      ]
    : [
        { label: "Cuenta activada", done: true },
        { label: "Publica tu primera solicitud", done: false, current: true },
      ];

  const next = isWorker
    ? { label: "Ir a mi perfil", href: `/perfil/${user?.id ?? ""}` }
    : { label: copy.cta.publishRequest, href: "/publicar" };

  return (
    <AuthLayout>
      {/* Mosaico hero */}
      <div className="relative h-40 -mx-4 mb-8 overflow-hidden bg-ink rounded-b-[24px] flex items-center justify-center">
        <Mosaico density="med" className="absolute inset-0 opacity-30" />
        <div className="relative z-10 text-center px-6">
          <p className="eyebrow text-marigold-300 mb-1">{copy.auth.welcome.eyebrow}</p>
          <h1 className="text-2xl font-bold text-paper tracking-tight">
            {copy.auth.welcome.title}
          </h1>
        </div>
      </div>

      {/* Greeting */}
      <div className="mb-6">
        <p className="text-base text-stone-500 leading-snug">
          {isWorker
            ? "Tu cuenta está activa. Verificamos tu identidad y te avisamos en menos de 24 horas."
            : copy.auth.welcome.subtitle}
        </p>
        {user?.name && (
          <p className="text-sm text-stone-400 mt-1">Hola, <span className="font-semibold text-ink">{user.name.split(" ")[0]}</span>.</p>
        )}
      </div>

      {/* Checklist */}
      <div className="flex flex-col gap-2 mb-8">
        {items.map((item, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-3 p-4 rounded-[16px] border",
              item.done && "bg-forest-100 border-forest-100",
              item.current && !item.done && "bg-azulejo-100 border-azulejo-200",
              !item.done && !item.current && "bg-card border-stone-200"
            )}
          >
            {item.done ? (
              <CheckCircle2 className="w-5 h-5 text-forest-500 shrink-0" strokeWidth={2} />
            ) : item.current ? (
              <div className="w-5 h-5 rounded-full border-2 border-azulejo-400 shrink-0 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-azulejo-400 softpulse" />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-stone-200 shrink-0" />
            )}
            <span
              className={cn(
                "text-sm font-semibold flex-1",
                item.done && "text-forest-600",
                item.current && !item.done && "text-azulejo-600",
                !item.done && !item.current && "text-stone-400"
              )}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Next action */}
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={() => router.push(next.href)}
      >
        {next.label}
        <ArrowRight className="w-4 h-4 ml-1" />
      </Button>

      <button
        type="button"
        onClick={() => router.push(isWorker ? "/dashboard/worker" : "/dashboard/employer")}
        className="w-full mt-3 py-2 text-sm text-stone-400 hover:text-ink transition-colors"
      >
        Ir al inicio
      </button>
    </AuthLayout>
  );
}
