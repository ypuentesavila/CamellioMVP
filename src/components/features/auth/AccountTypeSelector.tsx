"use client";

import Link from "next/link";
import { User, Wrench, ArrowRight } from "lucide-react";
import { AuthLayout } from "./AuthLayout";
import { copy } from "@/data/copy";

const OPTIONS = [
  {
    href: "/registro/cliente",
    icon: User,
    label: copy.auth.register.asClient,
    description: copy.auth.register.asClientDesc,
    accent: "bg-azulejo-100 text-azulejo-600",
  },
  {
    href: "/registro/trabajador",
    icon: Wrench,
    label: copy.auth.register.asWorker,
    description: copy.auth.register.asWorkerDesc,
    accent: "bg-marigold-100 text-marigold-400",
  },
];

export function AccountTypeSelector() {
  return (
    <AuthLayout
      footer={
        <p className="text-xs text-stone-500 text-center">
          {copy.auth.register.hasAccount}{" "}
          <Link
            href="/login"
            className="text-ink font-semibold underline underline-offset-2"
          >
            {copy.auth.register.login}
          </Link>
        </p>
      }
    >
      <div className="mb-8">
        <p className="eyebrow text-stone-500 mb-2">
          {copy.auth.register.eyebrow}
        </p>
        <h1 className="text-2xl font-bold text-ink tracking-tight">
          {copy.auth.register.selectRole}
        </h1>
      </div>

      <div className="flex flex-col gap-3">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          return (
            <Link
              key={opt.href}
              href={opt.href}
              className="group flex items-start gap-4 p-5 bg-card rounded-[16px] border border-stone-200 hover:border-ink transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${opt.accent}`}
              >
                <Icon className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-ink">{opt.label}</p>
                <p className="text-sm text-stone-500 mt-0.5 leading-snug">
                  {opt.description}
                </p>
              </div>
              <ArrowRight
                className="w-4 h-4 text-stone-300 shrink-0 mt-0.5 group-hover:text-ink transition-colors"
                strokeWidth={2}
              />
            </Link>
          );
        })}
      </div>
    </AuthLayout>
  );
}
