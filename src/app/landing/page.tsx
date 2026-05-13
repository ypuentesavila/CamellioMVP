import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  MapPin,
  Shield,
  TrendingUp,
  Wrench,
  Home as HomeIcon,
  ArrowRight,
  Users,
  Briefcase,
} from "lucide-react";

export default function LandingHomePage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/camellio-logo.jpg"
                alt="Camellio"
                width={36}
                height={36}
                className="rounded-xl"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-slate-900">Camellio</span>
                <span className="text-xs text-slate-500 hidden lg:block">
                  Servicios técnicos hiperlocales
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/landing" className="text-sm font-medium text-blue-600">
                Inicio
              </Link>
              <Link
                href="/landing/empleado"
                className="flex items-center space-x-1 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                <Users className="w-4 h-4" />
                <span>Para Técnicos</span>
              </Link>
              <Link
                href="/landing/empleador"
                className="flex items-center space-x-1 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                <Briefcase className="w-4 h-4" />
                <span>Para Clientes</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="hidden md:block px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/registro"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all"
              >
                Comenzar gratis
              </Link>
            </div>
          </div>

          <div className="md:hidden flex items-center space-x-2 pb-3 pt-2">
            <Link
              href="/landing/empleado"
              className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Wrench className="w-4 h-4" />
              <span>Técnicos</span>
            </Link>
            <Link
              href="/landing/empleador"
              className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <HomeIcon className="w-4 h-4" />
              <span>Clientes</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-50 opacity-60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Bienvenido a Camellio</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 max-w-4xl mx-auto">
              Servicios técnicos
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                {" "}hiperlocales
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
              Conectamos técnicos confiables con clientes cerca de ti. Encuentra el
              servicio que necesitas o ofrece tu trabajo.
            </p>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-3">¿Soy un?</h2>
              <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
                Elige tu perfil para ver cómo Camellio te puede ayudar.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-white p-8 rounded-2xl border-2 border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Wrench className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Empleado</h3>
                <p className="text-slate-600 mb-6">
                  Crea tu perfil, muestra tu trabajo y recibe solicitudes de clientes cerca
                  de ti.
                </p>
                <Link
                  href="/landing/empleado"
                  className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-medium rounded-lg hover:shadow-lg transition-all"
                >
                  Ir a empleado
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>

              <div className="bg-white p-8 rounded-2xl border-2 border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <HomeIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Empleador</h3>
                <p className="text-slate-600 mb-6">
                  Encuentra técnicos confiables, compara perfiles y contacta al trabajador
                  adecuado.
                </p>
                <Link
                  href="/landing/empleador"
                  className="inline-flex items-center justify-center w-full px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all"
                >
                  Ir a empleador
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { value: "500+", label: "Técnicos verificados" },
              { value: "2K+", label: "Servicios completados" },
              { value: "4.8/5", label: "Calificación promedio" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center p-6 bg-white rounded-xl shadow-sm border border-slate-100"
              >
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Una propuesta local pensada para que la confianza crezca por zona
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Conectamos personas en la misma zona para crear relaciones de confianza duraderas
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: MapPin, bg: "bg-blue-100", color: "text-blue-600", title: "Hiperlocal", desc: "Encuentra técnicos y clientes en tu zona para servicio rápido y confiable" },
              { icon: Shield, bg: "bg-blue-100", color: "text-blue-600", title: "Perfiles verificados", desc: "Todos los técnicos pasan verificación de identidad y habilidades" },
              { icon: TrendingUp, bg: "bg-green-100", color: "text-green-600", title: "Calificaciones reales", desc: "Sistema de reseñas y calificaciones para crear reputación sólida" },
              { icon: Sparkles, bg: "bg-indigo-100", color: "text-indigo-600", title: "Experiencia simple", desc: "Interfaz limpia, rápida y orientada a resultados" },
            ].map(({ icon: Icon, bg, color, title, desc }) => (
              <div key={title} className="p-6 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all">
                <div className={`w-12 h-12 ${bg} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className="font-semibold text-lg text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-600 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Únete a cientos de técnicos y clientes que ya confían en Camellio
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/landing/empleado"
              className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 font-medium rounded-lg hover:shadow-xl transition-all text-center"
            >
              Crear perfil como técnico
            </Link>
            <Link
              href="/landing/empleador"
              className="w-full sm:w-auto px-8 py-4 bg-blue-700 text-white font-medium rounded-lg border-2 border-white/20 hover:bg-blue-800 transition-all text-center"
            >
              Buscar un técnico
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image src="/camellio-logo.jpg" alt="Camellio" width={28} height={28} className="rounded-lg" />
                <span className="text-xl font-bold">Camellio</span>
              </div>
              <p className="text-slate-400 text-sm">Conectamos talento con oportunidades</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Producto</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/landing/empleado" className="hover:text-white transition-colors">Para Técnicos</Link></li>
                <li><Link href="/landing/empleador" className="hover:text-white transition-colors">Para Clientes</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">App</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/login" className="hover:text-white transition-colors">Iniciar sesión</Link></li>
                <li><Link href="/registro" className="hover:text-white transition-colors">Registrarse</Link></li>
                <li><Link href="/" className="hover:text-white transition-colors">Demo Hub</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Términos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            © 2026 Camellio. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
