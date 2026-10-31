import { ctaLabels, routes, site } from "@/config/site";
import { kit } from "@/content/answers";
import { heroFacts } from "@/content/facts";

/**
 * Textos propios de Inicio (propuesta, sección 7 y «Ajuste de la
 * Dirección»). Las respuestas de la sección 4 NO se repiten aquí: Inicio las
 * lee de `src/content/answers.ts`, `process.ts`, `faq.ts`, `sectors.ts`…
 *
 * Igual que en `src/content/*`, lo que SEDIN no ha confirmado va entre
 * [CORCHETES]: en producción no se publica y en modo revisión
 * (NEXT_PUBLIC_SHOW_PENDING=1) se ve resaltado.
 */

/* 7.1 · Portada ------------------------------------------------------------ */
export const heroCopy = {
  eyebrow: ["Seguridad privada no armada", "Maracaibo y el Zulia", `Atención ${site.hours}`],
  /** H1 sin cambios; «Integral» en azure-400 sobre la foto. */
  title: { text: "Seguridad y Defensa", highlight: "Integral" },
  /** Promesa central (11.2), con la regla de publicación de 1.2. */
  promise: "Vigilancia que se ve y se reporta.",
  /** Subtítulo de 7.1, en dos frases: en móvil solo se ve la segunda. */
  lead: [
    "Oficiales de seguridad supervisados en sitio, control de acceso y cámaras con visión nocturna para la industria, las empresas y los condominios del Zulia.",
    "Cada novedad queda registrada en el libro del puesto.",
  ],
} as const;

/**
 * Franja de hechos en móvil: los cuatro hechos cortos, en dos filas. La
 * oficina (el más largo) se ve en la tarjeta de contacto del cierre.
 */
export const heroFactsMobile = heroFacts.filter((f) => f.id !== "oficina");

/* 7.2 · ¿Qué necesita proteger? ------------------------------------------ */
export const selectorCopy = {
  eyebrow: "Por instalación",
  title: { text: "¿Qué necesita", highlight: "proteger", end: "?" },
  lead: "Cada instalación tiene sus riesgos. Elija la suya y vea el esquema de seguridad que recomendamos.",
  cta: "Ver soluciones",
  unsure: { text: "¿No lo tiene claro?", label: `${ctaLabels.diagnostico} en 4 preguntas` },
} as const;

/* 7.3 · Ningún puesto queda solo y cómo se reporta ------------------------ */
export const reportCopy = {
  /** Mensaje que conecta: «Miedo a perder» (Ajuste de la Dirección). */
  hook: {
    question: "¿Sabe quién entró anoche a su instalación?",
    answer: "Con SEDIN, queda escrito.",
  },
  record: {
    eyebrow: "Su reporte",
    title: "Lo que queda por escrito",
    /** Pedir a SEDIN (con el móvil): foto real, nunca de IA. */
    photo: "Foto real del libro de novedades foliado de un puesto, abierto y anonimizado (sin nombres, placas ni cédulas legibles)",
  },
  link: { label: "Ver cómo trabajamos", href: routes.comoTrabajamos },
} as const;

/* 7.4 · Quién protege su instalación ------------------------------------- */
export const whoCopy = {
  training: {
    value: "120",
    unit: "horas",
    text: "Curso de Formación de Oficiales de Seguridad, aprobado por el INCES.",
    source: "Art. 28",
  },
  photo: "Oficial de SEDIN en su puesto, con el uniforme reglamentario (sesión de fotos real)",
} as const;

/* 7.5 · Nuestro compromiso con usted (condicional) ------------------------ */
export interface Commitment {
  id: string;
  /** Etiqueta neutra (no afirma nada). */
  label: string;
  /** El compromiso; mientras lleve [MARCADOR], no se publica. */
  text: string;
}

/**
 * Solo los compromisos que SEDIN acepte poner en contrato, en el orden de
 * 7.5. Si no queda ninguno confirmado, la parte de compromisos no se
 * muestra (la guía gratuita sí).
 */
export const commitments: readonly Commitment[] = [
  { id: "permanencia", label: "Contrato", text: "[Sin permanencia mínima / Primer mes de prueba.]" },
  { id: "reemplazo", label: "Ausencias", text: "Si un oficial falta, cubrimos el puesto en [TIEMPO DE REEMPLAZO]." },
  {
    id: "reporte",
    label: "Reporte",
    text: "[Aviso inmediato a su contacto, por teléfono o WhatsApp, de cada novedad relevante. CONFIRMAR REPORTE MÍNIMO]",
  },
  {
    id: "inspeccion",
    label: "Inspección",
    text: "[Inspección de su instalación sin costo y sin compromiso. CONFIRMAR]",
  },
  { id: "propuesta", label: "Propuesta", text: "Propuesta escrita en [PLAZO DE PROPUESTA]." },
];

export const commitmentsCopy = {
  eyebrow: "Garantías",
  title: { text: "Nuestro compromiso", highlight: "con usted" },
  lead: "Solo lo que ponemos por escrito en su contrato.",
  needs:
    "Solo los compromisos que SEDIN acepte poner en contrato y cumpla hoy en todos sus puestos (7.5). Si no hay ninguno confirmado, en producción solo se ve la guía.",
  /** Referencias telefónicas (4.9): solo con el consentimiento del cliente. */
  references: kit.points[0].text,
} as const;

export const guideCopy = {
  eyebrow: "Guía gratuita",
  href: `${routes.empresas}#guia`,
  cta: "Ver la guía gratuita",
  /** Preguntas visibles en móvil (el resto, desde 640 px). */
  mobileCount: 4,
  more: (n: number) => `Y ${n} preguntas más en la guía.`,
} as const;

/* 7.6 · Preguntas frecuentes --------------------------------------------- */
export const faqCopy = {
  eyebrow: "Preguntas frecuentes",
  title: { text: "Lo que conviene saber", highlight: "antes de contratar" },
  lead: "Relevos, reportes, responsabilidades y precio: las respuestas a lo que más se pregunta.",
  link: { label: "Ver todas las preguntas", href: routes.faq },
} as const;

/* Clientes que confían en SEDIN ------------------------------------------- */
export const proofCopy = {
  eyebrow: "Testimonios y casos de éxito",
  title: { text: "Clientes que confían en", highlight: "SEDIN" },
} as const;

/* 7.7 · Cierre ------------------------------------------------------------ */
export const closingCopy = {
  /** /empleo no tiene lista de vacantes: se postula directamente. */
  jobs: { text: "¿Busca empleo como oficial de seguridad?", label: "Postule aquí", href: routes.jobs },
} as const;
