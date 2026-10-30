import { site } from "@/config/site";

/**
 * Textos de /empleo (propuesta 6.4 y 8.9): carril propio del aspirante, con
 * usted y sin botones de cotización.
 *
 * Lo no confirmado va entre [CORCHETES] (oculto en producción, resaltado en
 * revisión). Los hechos del reglamento interno SED-GC-PR-01 se publican sin
 * marcador (la Dirección los valida antes de publicar) y citan su artículo.
 *
 * Solo para componentes de servidor: el formulario (`JobForm`, cliente)
 * tiene sus propios textos, sin marcadores.
 */

const R = "Reglamento interno SED-GC-PR-01";

/** Ubicación de Umami de esta página. */
export const jobsUbicacion = "empleo";

/**
 * ¿Existe ya /privacidad/? Mientras no se publique, el aviso de datos va sin
 * enlace (el integrador lo activa al publicar la página de privacidad).
 */
export const privacyPagePublished = false;

export const jobsMeta = {
  title: "Empleo de oficial de seguridad en Maracaibo",
  description:
    "Trabaje como oficial de seguridad en SEDIN, C.A. en Maracaibo: curso de 120 horas aprobado por el INCES. Postule por WhatsApp o con el formulario.",
} as const;

/* Portada ------------------------------------------------------------------ */
export const jobsHero = {
  eyebrow: "Empleo · Oficial de seguridad",
  title: { text: "Trabaje como oficial de seguridad en", highlight: "Maracaibo" },
  lead: "Formación de 120 horas aprobada por el INCES, uniforme y equipos, e incentivos de ascenso y capacitación.",
  /** Segunda frase de la entradilla, con «con el formulario» enlazado a #postulacion. */
  apply: { before: "Postule por WhatsApp o", link: "con el formulario", after: ": el currículum es opcional." },
  requirementsLabel: "Ver requisitos",
  /** Requisitos básicos en la franja bajo los botones (resumen de `basicRequirements`). */
  factsLabel: "Requisitos básicos",
  facts: [
    { id: "edad", text: "De 18 a 55 años" },
    { id: "estudios", text: "Sexto grado aprobado" },
    { id: "experiencia", text: "Más de un año de experiencia" },
  ],
} as const;

export interface JobItem {
  text: string;
  source?: string;
}

/** Requisitos: el ya publicado y los del art. 25. */
export const basicRequirements: readonly JobItem[] = [
  { text: site.jobRequirements },
  { text: "Venezolano o venezolana", source: "Art. 25" },
  { text: "Sexto grado aprobado", source: "Art. 25" },
  { text: "Experiencia mayor de un año", source: "Art. 25" },
];

export const requirements: readonly JobItem[] = [
  ...basicRequirements,
  {
    text: "Haber aprobado los exámenes que exige el Ministerio de Relaciones Interiores",
    source: "Art. 25",
  },
];

/** Documentos para la admisión (art. 25). */
export const documents: readonly JobItem[] = [
  { text: "Síntesis curricular", source: "Art. 25" },
  { text: "Dos fotos tipo carné", source: "Art. 25" },
  { text: "Constancia de buena conducta emitida por la prefectura", source: "Art. 25" },
  { text: "Constancia de residencia emitida por la prefectura o el consejo comunal", source: "Art. 25" },
  { text: "Certificado de la prueba psicológica", source: "Art. 25" },
  { text: "Dos referencias familiares, con dirección, teléfono fijo y celular", source: "Art. 25" },
  {
    text: "Certificado del curso del INCES [CONFIRMAR: si se pide al postular o se obtiene con el curso de SEDIN]",
    source: "Arts. 25 y 28",
  },
  { text: "Constancia de reservista [CONFIRMAR SI SE EXIGE]", source: "Art. 25" },
];

export const requirementsCopy = {
  eyebrow: "Requisitos",
  title: { text: "Requisitos y", highlight: "documentos" },
  lead: "Revise los requisitos antes de postular. Los documentos se entregan en la etapa de admisión: el currículum es opcional para postular.",
  requirementsTitle: "Requisitos",
  documentsTitle: "Documentos para la admisión",
  source: `${R}, art. 25`,
} as const;

/* El puesto ---------------------------------------------------------------- */
export type DutyId = "llegada" | "accesos" | "rondas" | "libro" | "relevo";

export const duties: readonly { id: DutyId; title: string; text: string; source: string }[] = [
  {
    id: "llegada",
    title: "Llega antes de su turno",
    text: "Se presenta con al menos 15 minutos de antelación para recibir las novedades del turno saliente.",
    source: "Art. 21",
  },
  {
    id: "accesos",
    title: "Controla los accesos",
    text: "Identifica a visitantes, proveedores y empleados, y controla la entrada y salida de vehículos y materiales con sus formularios.",
    source: "Art. 32",
  },
  {
    id: "rondas",
    title: "Hace las rondas",
    text: "Recorre el perímetro del puesto para prevenir y detectar a tiempo cualquier riesgo, como un principio de incendio.",
    source: "Art. 32",
  },
  {
    id: "libro",
    title: "Registra cada novedad",
    text: "Anota en el libro del puesto, de forma clara y precisa, todo lo ocurrido en el turno.",
    source: "Art. 32",
  },
  {
    id: "relevo",
    title: "No deja el puesto solo",
    text: "Permanece en su puesto hasta que llega su relevo.",
    source: "Arts. 21 y 32",
  },
];

export const roleCopy = {
  eyebrow: "El puesto",
  title: { text: "Lo que hace un oficial de seguridad de", highlight: "SEDIN" },
  lead: "Protege a personas y bienes con prevención, sin armas de fuego: SEDIN presta vigilancia no armada.",
  leadSource: "Art. 4",
  supervisor: {
    title: "¿Tiene experiencia como supervisor?",
    text: "También recibimos postulaciones para supervisor de seguridad: inspecciona los puestos, verifica a diario la asistencia y la puntualidad, entrena a los oficiales en las órdenes de servicio y analiza los riesgos de cada puesto.",
    source: "Art. 19",
    link: "Postular como supervisor",
  },
} as const;

/* Qué ofrece SEDIN --------------------------------------------------------- */
export type OfferId = "ascenso" | "uniforme" | "acompanamiento";

export const offerCopy = {
  eyebrow: "Qué ofrece SEDIN",
  title: { text: "Formación, equipos y la posibilidad de", highlight: "ascender" },
  lead: "Lo que recibe al formar parte del equipo de oficiales de seguridad de SEDIN.",
  training: {
    value: "120",
    unit: "horas",
    title: "Curso de Formación de Oficiales de Seguridad",
    text: "SEDIN capacita a los aspirantes seleccionados con talleres y el curso de Formación de Oficiales de Seguridad, de 120 horas, aprobado por el INCES.",
    source: "Art. 28",
    syllabusTitle: "Lo que aprenderá",
    /** Foto real futura (sesión de fotos): solo se ve el hueco en revisión. */
    photo: "Formación de oficiales: una clase del curso de 120 horas",
  },
  items: [
    {
      id: "ascenso",
      title: "Ascenso y reconocimiento",
      text: [
        "Su desempeño se evalúa con criterios claros, como la puntualidad, la responsabilidad, el trabajo en equipo y la presentación.",
        "Se reconoce con placas o certificados, botones y postulaciones, y la evaluación apoya las decisiones de ascenso y de nuevas responsabilidades.",
      ],
      source: "Art. 26",
    },
    {
      id: "uniforme",
      title: "Uniforme y equipos",
      text: [
        "La Jefatura de Operaciones le entrega el uniforme, los zapatos de seguridad y los equipos del puesto: radio, libro de novedades y formularios.",
      ],
      source: "Arts. 14 y 31",
    },
    {
      id: "acompanamiento",
      title: "Acompañamiento en el puesto",
      text: [
        "Su supervisor le entrena en las órdenes de servicio y, cuando llega a un puesto nuevo, le dedica el tiempo necesario para orientarle.",
      ],
      source: "Art. 19",
    },
  ] satisfies readonly { id: OfferId; title: string; text: readonly string[]; source: string }[],
} as const;

/* Proceso (el ya publicado, en usted) -------------------------------------- */
export const processCopy = {
  eyebrow: "Proceso de selección",
  title: { text: "De la postulación a la", highlight: "inducción" },
  lead: "Así avanza su postulación, paso a paso.",
  steps: [
    {
      id: "postulacion",
      title: "Postulación en línea",
      text: "Envíe sus datos por WhatsApp o con el formulario de esta página. El currículum es opcional.",
    },
    {
      id: "seleccion",
      title: "Reclutamiento y selección",
      text: "El equipo de selección revisa su perfil y contacta a los candidatos preseleccionados.",
    },
    {
      id: "admision",
      title: "Admisión",
      text: "Entrega de documentos y asignación de cargo, turno y puesto.",
    },
    {
      id: "induccion",
      title: "Inducción",
      text: "Formación en procedimientos, normas y órdenes de servicio antes de iniciar.",
    },
  ],
} as const;

/* Postulación -------------------------------------------------------------- */
export const applyCopy = {
  eyebrow: "Postulación",
  title: { text: "Postule", highlight: "hoy" },
  lead: "Elija el canal que prefiera. Solo le pedimos sus datos básicos.",
  whatsapp: {
    title: "Por WhatsApp",
    text: "Se abre un chat con el mensaje de postulación ya escrito: complete su nombre y la zona donde vive.",
  },
  mail: {
    title: "Por correo",
    text: "Escríbanos con sus datos y, si lo tiene, adjunte su currículum.",
    label: "Escribir un correo",
    subject: "Postulación: Oficial de seguridad",
    body: [
      "Buenos días, SEDIN.",
      "Les escribo desde sedinca.com (empleo). Quiero postular como oficial de seguridad.",
      "",
      "Nombre y apellido: ",
      "Teléfono: ",
      "Zona donde vivo: ",
      "Experiencia en seguridad: ",
      "",
      "Adjunto mi currículum (opcional).",
    ].join("\n"),
  },
  questions: "Consultas sobre el proceso",
  /** El WhatsApp de empleo es hoy el comercial (8.9), con el texto «POSTULACIÓN…». */
  channelNote: "[CONFIRMAR: número o canal de RR. HH. para postulaciones, distinto del comercial]",
} as const;
