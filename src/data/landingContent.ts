export type LandingContent = {
  roleLabel: string;
  roleName: string;
  heroTitle: string;
  heroSubtitle: string;
  primaryCta: string;
  primaryHref: string;
  secondaryCta: string;
  secondaryHref: string;
  appLinkText: string;
  introTitle: string;
  introBody: string;
  highlightsTitle: string;
  highlights: string[];
  processTitle: string;
  process: string[];
  trustTitle: string;
  trust: string[];
  testimonialsTitle: string;
  testimonials: Array<{ name: string; role: string; quote: string }>;
  spotlightTitle: string;
  spotlightBodyLines: string[];
  spotlightPoints: string[];
  faqTitle: string;
  faqs: Array<{ question: string; answer: string }>;
  finalTitle: string;
  finalCta: string;
  finalHref: string;
};

// Internal app entry point (replaces external Netlify link)
const appHref = "/registro";

export const employeeLanding: LandingContent = {
  roleLabel: "Para trabajadores",
  roleName: "Empleado",
  heroTitle: "Gana dinero con tus habilidades, en tu zona",
  heroSubtitle:
    "Camellio es un uber hiperlocal de servicios técnicos con reputación territorial, donde arrendamos tu disponibilidad para conectarte con clientes reales cerca de ti.",
  primaryCta: "Empieza a trabajar hoy",
  primaryHref: "#como-funciona",
  secondaryCta: "Ver cómo funciona",
  secondaryHref: "#faq",
  appLinkText: "Abrir la aplicación de Camellio",
  introTitle: "Qué es Camellio para ti",
  introBody:
    "Camellio es un mercado informal local que te permite ofrecer tus servicios técnicos sin intermediarios complicados. Tú decides cuándo trabajar, cuánto cobrar y hasta dónde moverte. Nosotros nos encargamos de darte visibilidad, reputación verificable y clientes reales.",
  highlightsTitle: "Beneficios clave",
  highlights: [
    "Trabaja en tu propia zona con búsqueda por ubicación.",
    "Recibe solicitudes de clientes cercanos.",
    "Construye una reputación verificable.",
    "Arrendamos tu disponibilidad: tú eliges cuándo estar activo.",
    "Accede a más clientes sin depender del voz a voz.",
    "Publica fotos reales de tus trabajos.",
  ],
  processTitle: "Cómo funciona",
  process: [
    "Te registras y completas tu perfil.",
    "Validamos tu identidad y experiencia.",
    "Publicas tus servicios con fotos reales.",
    "Activas tu disponibilidad.",
    "Empiezas a recibir solicitudes en tu zona.",
  ],
  trustTitle: "Confianza y verificación",
  trust: [
    "Verificación de identidad de trabajadores.",
    "Perfiles con historial real de trabajos.",
    "Sistema de reputación verificable.",
    "Reseñas visibles por zona.",
  ],
  testimonialsTitle: "Reseñas de trabajadores",
  testimonials: [
    {
      name: "Carlos",
      role: "técnico eléctrico",
      quote:
        "Antes dependía de recomendaciones. Ahora tengo trabajo casi todos los días en mi barrio.",
    },
    {
      name: "Diana",
      role: "plomera",
      quote: "Me gusta que los clientes ven mis fotos y confían más rápido.",
    },
    {
      name: "Andrés",
      role: "técnico en computadores",
      quote: "La reputación sí importa aquí. Me ha ayudado a cobrar mejor.",
    },
  ],
  spotlightTitle: "Importancia de mostrar tu trabajo",
  spotlightBodyLines: [
    "Sube fotos reales de tus trabajos.",
    "Destaca frente a otros técnicos.",
    "Los perfiles con imágenes reciben hasta 3 veces más solicitudes.",
  ],
  spotlightPoints: [
    "Tú defines tus precios.",
    "Tú eliges tu disponibilidad.",
    "Tú decides qué trabajos aceptar.",
  ],
  faqTitle: "Preguntas frecuentes",
  faqs: [
    {
      question: "¿Tengo que pagar para usar Camellio?",
      answer:
        "No pagas por registrarte. Solo se cobra una pequeña comisión cuando consigues trabajo.",
    },
    {
      question: "¿Puedo rechazar trabajos?",
      answer: "Sí. Tú decides qué aceptar.",
    },
    {
      question: "¿Necesito experiencia certificada?",
      answer:
        "No necesariamente, pero la verificación aumenta tu credibilidad.",
    },
  ],
  finalTitle: "Empieza a generar ingresos con lo que ya sabes hacer",
  finalCta: "Crear mi perfil ahora",
  finalHref: appHref,
};

export const employerLanding: LandingContent = {
  roleLabel: "Para clientes",
  roleName: "Empleador",
  heroTitle: "Encuentra técnicos confiables en tu zona, sin perder tiempo",
  heroSubtitle:
    "Camellio es un uber hiperlocal de servicios técnicos con reputación territorial, donde encuentras trabajadores verificados cerca de ti.",
  primaryCta: "Buscar técnico ahora",
  primaryHref: "#como-funciona",
  secondaryCta: "Publicar solicitud",
  secondaryHref: "#faq",
  appLinkText: "Abrir la aplicación de Camellio",
  introTitle: "Qué es Camellio para ti",
  introBody:
    "Camellio es un mercado informal local donde puedes encontrar técnicos confiables cerca de tu ubicación, con reputación verificable y trabajos reales publicados. Sin intermediarios, sin procesos complicados.",
  highlightsTitle: "Beneficios clave",
  highlights: [
    "Búsqueda por zona para encontrar técnicos cerca.",
    "Trabajadores verificados.",
    "Reputación basada en trabajos reales.",
    "Perfiles con fotos de trabajos anteriores.",
    "Respuesta rápida de técnicos disponibles.",
    "Compara opciones antes de elegir.",
  ],
  processTitle: "Cómo funciona",
  process: [
    "Buscas el servicio que necesitas.",
    "Filtras por zona.",
    "Revisas perfiles, fotos y reseñas.",
    "Contactas al técnico.",
    "Acuerdas el trabajo directamente.",
  ],
  trustTitle: "Confianza y transparencia",
  trust: [
    "Verificación de trabajadores.",
    "Reseñas reales de otros clientes.",
    "Historial visible de trabajos.",
    "Sistema de reputación territorial.",
  ],
  testimonialsTitle: "Reseñas de clientes",
  testimonials: [
    {
      name: "Laura",
      role: "hogar",
      quote: "Encontré un plomero en menos de 15 minutos cerca de mi casa.",
    },
    {
      name: "Jorge",
      role: "negocio local",
      quote:
        "Pude comparar varios técnicos antes de elegir. Eso no lo tenía antes.",
    },
    {
      name: "Camila",
      role: "apartamento",
      quote: "Las fotos ayudan mucho. Sabes a quién estás contratando.",
    },
  ],
  spotlightTitle: "Enfocado en tu zona",
  spotlightBodyLines: [
    "Camellio no es una plataforma masiva sin control.",
    "Funciona por territorio.",
    "Eso significa técnicos cercanos, respuesta más rápida y mejor conocimiento del área.",
  ],
  spotlightPoints: [
    "Ver fotos reales de trabajos.",
    "Revisar resultados anteriores.",
    "Comparar calidad antes de contratar.",
  ],
  faqTitle: "Preguntas frecuentes",
  faqs: [
    {
      question: "¿Cómo sé si un técnico es confiable?",
      answer:
        "Todos los perfiles tienen reputación verificable, reseñas y verificación de identidad.",
    },
    {
      question: "¿Camellio cobra por buscar técnicos?",
      answer: "No, puedes explorar y contactar libremente.",
    },
    {
      question: "¿Qué pasa si no me gusta el servicio?",
      answer:
        "Puedes dejar tu reseña y afectar la reputación del trabajador.",
    },
  ],
  finalTitle: "Encuentra el técnico que necesitas, cuando lo necesitas",
  finalCta: "Buscar ahora",
  finalHref: appHref,
};
