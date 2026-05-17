import Link from "next/link";
import { MapPin, Instagram, Twitter, Linkedin } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const PARA_CLIENTES = [
  { label: "Cómo funciona", href: "/como-funciona" },
  { label: "Publicar solicitud", href: "/publicar" },
  { label: "Tipos de trabajo", href: "/explorar" },
  { label: "Garantía de 30 días", href: "/garantia" },
  { label: "Trabajadores verificados", href: "/verificacion" },
];

const PARA_TRABAJADORES = [
  { label: "Registrarme como trabajador", href: "/registro?rol=trabajador" },
  { label: "Cómo funciona", href: "/como-funciona#trabajadores" },
  { label: "Maestros Camellio", href: "/maestros" },
  { label: "Beneficios", href: "/beneficios" },
  { label: "Preguntas frecuentes", href: "/faq" },
];

const CONFIANZA = [
  { label: "Verificación de trabajadores", href: "/verificacion" },
  { label: "Garantía de 30 días", href: "/garantia" },
  { label: "Términos de uso", href: "/terminos" },
  { label: "Política de privacidad", href: "/privacidad" },
  { label: "Resolución de disputas", href: "/disputas" },
];

const CONTACTO = [
  { label: "Centro de soporte", href: "/soporte" },
  { label: "Reportar un problema", href: "/reporte" },
  { label: "Prensa", href: "/prensa" },
  { label: "soporte@camellio.co", href: "mailto:soporte@camellio.co" },
];

export function Footer() {
  return (
    <footer className="hidden md:block bg-ink text-paper">
      {/* CTA band */}
      <div className="border-b border-paper/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="eyebrow text-paper/50 mb-1">Para clientes</p>
              <p className="text-2xl font-bold text-paper tracking-tight">
                ¿Necesitas resolver algo hoy?
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/publicar"
                className={cn(
                  buttonVariants({ variant: "marigold", size: "lg" })
                )}
              >
                Publicar solicitud
              </Link>
              <Link
                href="/registro?rol=trabajador"
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold h-12 px-6 text-base",
                  "border border-paper/30 text-paper hover:bg-paper/10 transition-colors"
                )}
              >
                Soy trabajador
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 5-column links */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-5 gap-8">
          {/* Marca */}
          <div className="col-span-1">
            <Logo variant="horizontal" size="sm" onDark />
            <p className="text-sm text-paper/55 mt-4 leading-relaxed max-w-[180px]">
              Trabajadores locales para lo que necesitas{" "}
              <span className="serif text-marigold-300">resolver</span>.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-paper/50 hover:text-paper transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="text-paper/50 hover:text-paper transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-paper/50 hover:text-paper transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Para clientes */}
          <FooterCol title="Para clientes" links={PARA_CLIENTES} />

          {/* Para trabajadores */}
          <FooterCol title="Para trabajadores" links={PARA_TRABAJADORES} />

          {/* Confianza */}
          <FooterCol title="Confianza" links={CONFIANZA} />

          {/* Contacto */}
          <FooterCol title="Contacto" links={CONTACTO} />
        </div>
      </div>

      {/* Legal */}
      <div className="border-t border-paper/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-xs text-paper/55">
            <MapPin className="w-3 h-3" />
            <span>Bogotá, Colombia</span>
          </div>
          <p className="text-xs text-paper/40">
            © {new Date().getFullYear()} Camellio. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

interface FooterColProps {
  title: string;
  links: { label: string; href: string }[];
}

function FooterCol({ title, links }: FooterColProps) {
  return (
    <div>
      <p className="eyebrow text-paper/50 mb-4">{title}</p>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-paper/70 hover:text-paper transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
