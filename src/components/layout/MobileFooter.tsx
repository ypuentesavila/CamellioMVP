"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const SECTIONS = [
  {
    title: "Para clientes",
    defaultOpen: true,
    links: [
      { label: "Cómo funciona", href: "/como-funciona" },
      { label: "Publicar solicitud", href: "/publicar" },
      { label: "Tipos de trabajo", href: "/explorar" },
      { label: "Garantía de 30 días", href: "/garantia" },
    ],
  },
  {
    title: "Para trabajadores",
    defaultOpen: false,
    links: [
      { label: "Registrarme", href: "/registro?rol=trabajador" },
      { label: "Maestros Camellio", href: "/maestros" },
      { label: "Preguntas frecuentes", href: "/faq" },
    ],
  },
  {
    title: "Confianza",
    defaultOpen: false,
    links: [
      { label: "Verificación", href: "/verificacion" },
      { label: "Términos de uso", href: "/terminos" },
      { label: "Privacidad", href: "/privacidad" },
    ],
  },
];

export function MobileFooter() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    Object.fromEntries(SECTIONS.map((s) => [s.title, s.defaultOpen]))
  );

  function toggle(title: string) {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  }

  return (
    <footer className="md:hidden bg-ink text-paper">
      {/* Accordions */}
      <div className="border-t border-paper/10">
        {SECTIONS.map((section) => {
          const isOpen = openSections[section.title];
          return (
            <div key={section.title} className="border-b border-paper/10">
              <button
                onClick={() => toggle(section.title)}
                className="flex items-center justify-between w-full px-4 py-4 text-left"
                aria-expanded={isOpen}
              >
                <span className="text-sm font-semibold text-paper">
                  {section.title}
                </span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-paper/50 transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-200",
                  isOpen ? "max-h-64" : "max-h-0"
                )}
                style={{ transitionTimingFunction: "cubic-bezier(.2,.7,.3,1)" }}
              >
                <ul className="px-4 pb-4 flex flex-col gap-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-paper/65 hover:text-paper transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Brand + location + legal */}
      <div className="px-4 py-6 flex flex-col gap-4">
        <Logo variant="compact" size="sm" onDark />
        <div className="flex items-center gap-1.5 text-xs text-paper/50">
          <MapPin className="w-3 h-3" />
          <span>Bogotá, Colombia</span>
        </div>
        <p className="text-xs text-paper/35">
          © {new Date().getFullYear()} Camellio. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
