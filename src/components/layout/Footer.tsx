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
