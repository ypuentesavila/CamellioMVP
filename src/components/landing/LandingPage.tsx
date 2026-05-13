import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  MapPin,
  Shield,
  Star,
  Award,
  Camera,
  MessageSquare,
  DollarSign,
  Calendar,
  Wrench,
  Home as HomeIcon,
  ArrowRight,
  Eye,
  CheckCircle,
  Filter,
  Target,
  Search,
  Users,
  Briefcase,
} from "lucide-react";
import type { LandingContent } from "@/data/landingContent";

type LandingPageProps = {
  content: LandingContent;
};

function Nav({ roleName }: { roleName: string }) {
  const isEmployee = roleName.toLowerCase() === "empleado";

  return (
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
            <Link
              href="/landing"
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
            >
              Inicio
            </Link>
            <Link
              href="/landing/empleado"
              className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                isEmployee ? "text-blue-600" : "text-slate-600 hover:text-blue-600"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Para Técnicos</span>
            </Link>
            <Link
              href="/landing/empleador"
              className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                !isEmployee ? "text-blue-600" : "text-slate-600 hover:text-blue-600"
              }`}
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
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all whitespace-nowrap"
            >
              Comenzar gratis
            </Link>
          </div>
        </div>

        <div className="md:hidden flex items-center space-x-2 pb-3 pt-2">
          <Link
            href="/landing/empleado"
            className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              isEmployee
                ? "bg-blue-100 text-blue-600"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Técnicos</span>
          </Link>
          <Link
            href="/landing/empleador"
            className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              !isEmployee
                ? "bg-blue-100 text-blue-600"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <HomeIcon className="w-4 h-4" />
            <span>Clientes</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export function LandingPage({ content }: LandingPageProps) {
  const isEmployee = content.roleName.toLowerCase() === "empleado";

  const heroBg = isEmployee
    ? "from-blue-50 via-indigo-50 to-slate-50"
    : "from-indigo-50 via-blue-50 to-slate-50";

  const badgeCls = "bg-blue-100 text-blue-700";

  const primaryBtn = isEmployee
    ? "from-blue-600 to-indigo-500"
    : "from-indigo-600 to-blue-500";

  const stepColor = "text-blue-600";
  const stepGradient = isEmployee
    ? "from-blue-500 to-indigo-500"
    : "from-indigo-500 to-blue-600";

  const finalGradient = isEmployee
    ? "from-blue-600 to-indigo-600"
    : "from-indigo-600 to-blue-600";

  const benefitIcons = [Star, Award, Camera, MapPin, DollarSign, Calendar];
  const employeeProcessIcons = [Wrench, Camera, MessageSquare, Eye, CheckCircle];
  const employerProcessIcons = [Search, Filter, Eye, MessageSquare, CheckCircle];
  const processIcons = isEmployee ? employeeProcessIcons : employerProcessIcons;

  return (
    <main className="bg-white">
      <Nav roleName={content.roleName} />

      {/* Hero */}
      <section
        className={`relative overflow-hidden py-12 sm:py-20 lg:py-32 bg-gradient-to-br ${heroBg}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <div
                className={`inline-flex items-center space-x-2 ${badgeCls} px-4 py-2 rounded-full text-sm font-medium mb-6`}
              >
                {isEmployee ? (
                  <Target className="w-4 h-4" />
                ) : (
                  <HomeIcon className="w-4 h-4" />
                )}
                <span>{content.roleLabel}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                {content.heroTitle}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 mb-8 leading-relaxed">
                {content.heroSubtitle}
              </p>

              <div className="space-y-4 mb-8">
                {content.highlights.slice(0, 3).map((item, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="text-slate-600 text-sm">{item}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={content.primaryHref}
                  className={`px-8 py-3 bg-gradient-to-r ${primaryBtn} text-white font-medium rounded-lg hover:shadow-xl transition-all text-center`}
                >
                  {content.primaryCta}
                </Link>
                <Link
                  href={content.secondaryHref}
                  className="px-8 py-3 bg-white text-slate-900 font-medium rounded-lg border-2 border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all text-center"
                >
                  {content.secondaryCta}
                </Link>
              </div>
            </div>

            {/* Demo card */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-slate-900 text-lg">
                    {isEmployee ? "Tu perfil de técnico" : "Técnicos cerca de ti"}
                  </h3>
                  <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                    Activo
                  </span>
                </div>

                {isEmployee ? (
                  <div>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        JR
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">Juan Ramírez</h4>
                        <p className="text-sm text-slate-600">Plomero certificado</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium text-slate-900">4.9</span>
                          <span className="text-xs text-slate-500">(47 reseñas)</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">38</div>
                        <div className="text-xs text-slate-600">Trabajos completados</div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">2.5km</div>
                        <div className="text-xs text-slate-600">Radio de servicio</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-semibold text-slate-700 mb-2">
                        Solicitudes recientes
                      </div>
                      {[
                        { service: "Reparación de fuga", location: "A 1.2km", time: "Hace 1h" },
                        { service: "Instalación de lavabo", location: "A 0.8km", time: "Hace 3h" },
                        { service: "Cambio de tubería", location: "A 2.1km", time: "Hace 5h" },
                      ].map((req, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-blue-50 transition-all cursor-pointer"
                        >
                          <div>
                            <p className="font-semibold text-sm text-slate-900">
                              {req.service}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span className="text-xs text-slate-500">{req.location}</span>
                              <span className="text-xs text-slate-400">• {req.time}</span>
                            </div>
                          </div>
                          <span className="text-xs text-blue-600 font-medium">Ver →</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[
                      { name: "Carlos Mendoza", trade: "Plomero", rating: "4.9", reviews: "52", distance: "0.8km", price: "$450/servicio" },
                      { name: "Ana Rodríguez", trade: "Electricista", rating: "4.8", reviews: "38", distance: "1.2km", price: "$380/servicio" },
                      { name: "Pedro Martínez", trade: "Carpintero", rating: "5.0", reviews: "64", distance: "1.5km", price: "$520/servicio" },
                    ].map((tech, i) => (
                      <div
                        key={i}
                        className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex items-start space-x-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {tech.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-semibold text-slate-900 text-sm">
                                {tech.name}
                              </h4>
                              <CheckCircle className="w-4 h-4 text-blue-500" />
                            </div>
                            <p className="text-xs text-slate-600">{tech.trade}</p>
                            <div className="flex items-center space-x-3 mt-2">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium text-slate-900">
                                  {tech.rating}
                                </span>
                                <span className="text-xs text-slate-500">({tech.reviews})</span>
                              </div>
                              <div className="flex items-center space-x-1 text-slate-500">
                                <MapPin className="w-3 h-3" />
                                <span className="text-xs">{tech.distance}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-blue-600">{tech.price}</span>
                          <span className="text-xs text-blue-600 font-medium">Ver perfil →</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              {content.processTitle}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {isEmployee
                ? "Pasos simples para empezar a recibir solicitudes"
                : "Encuentra el técnico perfecto en minutos"}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {content.process.map((step, i) => {
              const Icon = processIcons[i] ?? Wrench;
              return (
                <div key={i} className="text-center">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${stepGradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className={`text-sm font-bold ${stepColor} mb-2`}>
                    PASO {i + 1}
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">{step}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              {content.highlightsTitle}
            </h2>
            <p className="text-lg text-slate-600">
              {isEmployee
                ? "Todo lo que necesitas para destacar y crecer tu negocio"
                : "Todo lo que necesitas para decidir con confianza"}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.highlights.map((benefit, i) => {
              const Icon = benefitIcons[i % benefitIcons.length];
              return (
                <div
                  key={i}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100"
                >
                  <Icon className="w-10 h-10 text-blue-600 mb-4" />
                  <h3 className="font-semibold text-lg text-slate-900">{benefit}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              {content.testimonialsTitle}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.testimonials.map((t, i) => (
              <div key={i} className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <div className="flex items-center space-x-1 mb-4 text-yellow-400">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-700 mb-4 italic">&quot;{t.quote}&quot;</p>
                <p className="font-semibold text-slate-900">{t.name}</p>
                <p className="text-sm text-slate-500">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Confianza */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              {content.trustTitle}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.trust.map((item, i) => {
              const icons = [Shield, CheckCircle, Star, MapPin];
              const bgs = ["bg-blue-100", "bg-blue-100", "bg-yellow-100", "bg-green-100"];
              const colors = ["text-blue-600", "text-blue-600", "text-yellow-600", "text-green-600"];
              const Icon = icons[i % icons.length];
              return (
                <div
                  key={i}
                  className="p-6 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all"
                >
                  <div
                    className={`w-12 h-12 ${bgs[i % bgs.length]} rounded-xl flex items-center justify-center mb-4`}
                  >
                    <Icon className={`w-6 h-6 ${colors[i % colors.length]}`} />
                  </div>
                  <p className="text-slate-700 font-medium text-sm">{item}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Spotlight */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className={`p-8 rounded-2xl bg-gradient-to-br ${finalGradient} text-white`}>
              <h3 className="text-2xl font-bold mb-6">{content.spotlightTitle}</h3>
              <ul className="space-y-4">
                {content.spotlightBodyLines.map((line, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-white/70 mt-2 flex-shrink-0" />
                    <span className="text-white/90">{line}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Enfoque Práctico</h3>
              <ul className="space-y-4">
                {content.spotlightPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              {content.faqTitle}
            </h2>
          </div>
          <div className="space-y-4">
            {content.faqs.map((faq, i) => (
              <details
                key={i}
                className="p-6 rounded-xl bg-white border border-slate-200 hover:border-blue-300 transition-all group cursor-pointer"
              >
                <summary className="font-semibold text-slate-900 text-lg flex justify-between items-center list-none">
                  {faq.question}
                  <span className="text-2xl text-slate-400 transition-transform group-open:rotate-90 ml-4 flex-shrink-0">
                    ›
                  </span>
                </summary>
                <p className="text-slate-600 mt-4">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={`py-20 bg-gradient-to-r ${finalGradient}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            {content.finalTitle}
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            {isEmployee
              ? "Únete a cientos de técnicos que ya están creciendo su negocio con Camellio"
              : "Encuentra profesionales verificados cerca de ti en minutos"}
          </p>
          <Link
            href={content.finalHref}
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            {content.finalCta}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image
                  src="/camellio-logo.jpg"
                  alt="Camellio"
                  width={28}
                  height={28}
                  className="rounded-lg"
                />
                <span className="text-xl font-bold">Camellio</span>
              </div>
              <p className="text-slate-400 text-sm">Conectamos talento con oportunidades</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Producto</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="/landing/empleado" className="hover:text-white transition-colors">
                    Para Técnicos
                  </Link>
                </li>
                <li>
                  <Link href="/landing/empleador" className="hover:text-white transition-colors">
                    Para Clientes
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Compañía</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">Acerca de</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Blog</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">Privacidad</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Términos</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Contacto</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            © 2026 Camellio. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </main>
  );
}
