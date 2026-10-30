import { routes, serviceHref, site } from "@/config/site";

/**
 * Textos de /nosotros (propuesta 8.6). Igual que en `src/content/*`, lo que
 * SEDIN no ha confirmado va entre [CORCHETES]: en producción no se publica y
 * en modo revisión (NEXT_PUBLIC_SHOW_PENDING=1) se ve resaltado.
 *
 * Los hechos del reglamento interno SED-GC-PR-01 se publican sin marcador
 * (la Dirección los valida antes de publicar) y citan su artículo en
 * `source`, visible solo en revisión. Sin nombres de personas ni de
 * clientes: cargos y funciones.
 *
 * Solo para componentes de servidor: no importar desde un componente
 * «use client» (los marcadores viajarían en el JavaScript).
 */

const R = "Reglamento interno SED-GC-PR-01";

/** Ubicación de Umami de esta página. */
export const aboutUbicacion = "nosotros";

/** Mensajes de WhatsApp (convención de 11.6: «desde sedinca.com (…)» y dos puntos al final). */
export const aboutWhatsapp =
  "Hola, SEDIN. Les escribo desde sedinca.com (nosotros). Quiero hablar con un asesor sobre: ";
export const visitWhatsapp =
  "Hola, SEDIN. Les escribo desde sedinca.com (nosotros). Quiero coordinar una visita a la oficina. Día preferido: ";

export const aboutMeta = {
  title: "Empresa de seguridad privada no armada en Maracaibo",
  description:
    "SEDIN, C.A. (Seguridad y Defensa Integral): vigilancia privada no armada en Maracaibo y el Zulia, con supervisión y libro de novedades. RIF J-40964338-7.",
} as const;

/* Portada ------------------------------------------------------------------ */
export const aboutHero = {
  eyebrow: "Nosotros",
  /**
   * Trayectoria: va en el antetítulo («Nosotros · Desde 2015») cuando SEDIN
   * confirme el año. El titular no depende de él.
   */
  since: "Desde [AÑO DE INICIO]",
  title: { text: "La empresa detrás de cada", highlight: "puesto" },
  lead: `${site.name} (Seguridad y Defensa Integral): vigilancia privada no armada para la industria, las empresas y los condominios del Zulia, con supervisión en sitio y cada novedad por escrito.`,
  /** Franja de hechos bajo los botones (como en /empresas). */
  facts: [
    { id: "rif", text: `RIF ${site.rifDisplay}` },
    { id: "oficina", text: "Oficina en Maracaibo" },
    { id: "atencion", text: `Atención ${site.hours}` },
  ],
} as const;

/* Quiénes somos (art. 4) --------------------------------------------------- */
export const aboutIntro = {
  eyebrow: "Quiénes somos",
  title: { text: "Seguridad privada y protección preventiva", highlight: "no armada" },
  lead: "SEDIN presta el servicio de vigilancia y protección de personas y de bienes muebles e inmuebles.",
  leadSource: `${R}, art. 4`,
  /** Placa de marca: el rasgo que distingue a SEDIN, dicho una sola vez. */
  unarmed: {
    title: "Sin armas de fuego en su instalación.",
    text: "Nuestros oficiales previenen, detectan y avisan. Están entrenados en control de acceso, comunicación inmediata, defensa personal y uso progresivo de la fuerza.",
    source: "Arts. 4 y 28",
  },
  /** Foto real futura (sesión de fotos): solo se ve el hueco en revisión. */
  photo: "Oficiales con el uniforme de SEDIN en un puesto",
  body: [
    {
      text: "La prevención es el pilar de nuestro trabajo: un oficial atento, formado y supervisado actúa antes, porque una vez ocurridos los hechos es difícil revertirlos.",
      source: "Art. 32",
    },
    {
      text: "La empresa se organiza por procesos, con equipos multidisciplinarios, reglas claras y métodos compartidos, para que cada servicio se preste con la misma consistencia y calidad.",
      source: "Arts. 10 y 11",
    },
  ],
  history: {
    label: "Historia de SEDIN",
    needs: "Año de inicio de operaciones, cómo empezó la empresa y los hitos que la Dirección quiera contar (sin nombres de clientes sin autorización).",
    text: "[HISTORIA DE SEDIN: cómo empezó, desde qué año y sus hitos]",
  },
  coverage: "[ZONAS ATENDIDAS: municipios del Zulia donde SEDIN presta servicio]",
  modalitiesTitle: "Modalidades del servicio",
  modalities: [
    {
      id: "fija",
      title: "Vigilancia fija",
      text: "Oficiales de seguridad en un puesto determinado, para proteger a las personas y los bienes de un lugar concreto.",
      source: "Art. 9",
      href: serviceHref("vigilancia-privada"),
    },
    {
      id: "movil",
      title: "Vigilancia móvil",
      text: "Oficiales móviles que protegen un área o un sector delimitado.",
      source: "Art. 9",
      href: serviceHref("vigilancia-privada"),
    },
    {
      id: "consultoria",
      title: "Consultoría y asesoría",
      text: "Análisis de los riesgos de su instalación y asesoría para diseñar el esquema de seguridad.",
      source: "Art. 28",
      href: serviceHref("gestion-de-riesgos"),
    },
  ],
} as const;

/* Estructura por cargos (sin nombres) ------------------------------------- */
export type RoleId =
  | "gerencia-general"
  | "calidad-sso"
  | "jefatura-operaciones"
  | "supervision"
  | "jefes-de-grupo"
  | "oficiales";

export interface Role {
  id: RoleId;
  title: string;
  text: string;
  source: string;
}

export const structure = {
  eyebrow: "Organización",
  title: { text: "Una cadena de responsabilidad hasta su", highlight: "puesto" },
  lead: "Detrás de cada oficial hay una estructura por cargos. Así se reparte la responsabilidad, de la Gerencia General al puesto de su instalación.",
  /** La propuesta (8.6) pide no presentarla como organigrama vigente hasta que SEDIN lo confirme. */
  review: "[VALIDAR: estructura de cargos vigente, sin nombres]",
  source: `${R}, arts. 10, 14, 19, 20, 21, 32 y 33`,
  /** Foto real futura (sesión de fotos): solo se ve el hueco en revisión. */
  photo: "Equipo de supervisión en la oficina de Maracaibo",
  link: { label: "Ver cómo supervisamos", href: `${routes.comoTrabajamos}#supervision` },
  groups: [
    {
      id: "direccion",
      label: "Dirección",
      roles: [
        {
          id: "gerencia-general",
          title: "Gerencia General",
          text: "Dirige la empresa, planifica y controla el trabajo en todas sus fases, y coordina con gerentes y supervisores la atención del servicio y las novedades de cada cliente.",
          source: "Art. 14",
        },
        {
          id: "calidad-sso",
          title: "Gerencia de Calidad y SSO",
          text: "Impulsa la mejora continua de procedimientos, instrucciones y normas, asegura el Programa de Seguridad Industrial y Salud Ocupacional e induce al personal en su cargo.",
          source: "Arts. 14 y 33",
        },
      ],
    },
    {
      id: "operaciones",
      label: "Operaciones",
      roles: [
        {
          id: "jefatura-operaciones",
          title: "Jefatura de Operaciones",
          text: "Planifica turnos y puestos, garantiza la asistencia del personal en cada servicio, entrega uniformes, radios, libros de novedades y formularios, y asiste a las reuniones con los clientes.",
          source: "Art. 14",
        },
        {
          id: "supervision",
          title: "Supervisores y Asuntos Internos",
          text: "Los supervisores verifican a diario la asistencia y la puntualidad, inspeccionan el servicio y analizan los riesgos de cada puesto. Asuntos Internos investiga las quejas y novedades, da seguimiento a cada hurto o robo y elabora un informe en sitio.",
          source: "Arts. 14 y 19",
        },
      ],
    },
    {
      id: "instalacion",
      label: "En su instalación",
      roles: [
        {
          id: "jefes-de-grupo",
          title: "Jefes de grupo",
          text: "Encargados del turno en el puesto: llevan el libro de novedades, foliado y rubricado, con el registro de cada turno.",
          source: "Art. 32",
        },
        {
          id: "oficiales",
          title: "Oficiales de seguridad",
          text: "Llegan con al menos 15 minutos de antelación para recibir las novedades y no dejan el puesto hasta que llega su relevo.",
          source: "Arts. 20, 21 y 32",
        },
      ],
    },
  ] satisfies readonly { id: string; label: string; roles: readonly Role[] }[],
  endpoint: { label: "Su instalación", text: "Personas y bienes protegidos, con cada novedad registrada." },
} as const;

/* Gestión de calidad -------------------------------------------------------- */
export const quality = {
  eyebrow: "Gestión de calidad",
  title: { text: "Un sistema de gestión", highlight: "propio" },
  points: [
    {
      title: "Mejora continua",
      text: "La Gerencia de Calidad y SSO dirige la mejora continua de procedimientos, instrucciones y normas, y asegura el Programa de Seguridad Industrial y Salud Ocupacional.",
      source: "Arts. 14 y 33",
    },
    {
      title: "Inducción del personal",
      text: "El personal administrativo y operativo recibe inducción sobre los procedimientos de su cargo.",
      source: "Art. 14",
    },
    {
      title: "Todo queda registrado",
      text: "Cada entrada y salida de personas, vehículos y materiales se asienta en su formulario, y cada novedad en el libro del puesto, que es un elemento probatorio.",
      source: "Art. 32",
    },
  ],
  document: {
    label: "Procedimiento Nº",
    code: "SED-GC-PR-01",
    name: "Reglamento interno",
    tags: ["Procedimientos codificados", "Control de revisiones"],
  },
  formsTitle: "Formularios de cada puesto",
  forms: [
    { code: "FO-OP-05", name: "Nota de entrada o salida de materiales" },
    { code: "FO-OP-07", name: "Control de entrada y salida de herramientas y equipos" },
    { code: "FO-OP-10", name: "Control de entrada y salida de visitantes" },
    { code: "FO-OP-11", name: "Control de entrada y salida de personal" },
    { code: "FO-OP-12", name: "Control de entrada y salida de vehículos" },
  ],
  book: "Libro de novedades foliado y rubricado",
  formsSource: `${R}, art. 32 (referencias)`,
  indexMail: {
    label: "Solicitar el índice por correo",
    subject: "Solicitud del índice de procedimientos",
    body: [
      "Buenos días, SEDIN.",
      "Les escribo desde sedinca.com (nosotros). Quisiera recibir el índice de procedimientos de su sistema de gestión.",
      "",
      "Empresa: ",
      "Persona de contacto y cargo: ",
      "Teléfono: ",
    ].join("\n"),
  },
} as const;

/* Valores ------------------------------------------------------------------- */
export const values = {
  eyebrow: "Valores",
  title: { text: "Lo que nos exigimos en cada", highlight: "turno" },
  lead: "Cinco valores que ordenan el trabajo diario de cada oficial, cada supervisor y cada gerencia.",
  /** Cita del reglamento (el lema ya está en el pie de todas las páginas). */
  quote: {
    text: "La autoridad de un buen supervisor nace de su propio ejemplo y de la disciplina que se exige a sí mismo.",
    caption: "Reglamento interno de SEDIN",
    source: "Art. 17",
  },
  items: [
    {
      name: "Seguridad",
      text: "Proteger a las personas y los bienes que se nos confían, con prevención y sin armas de fuego.",
    },
    {
      name: "Orden",
      text: "Mantener el orden en cada puesto, con órdenes de servicio claras y archivos al día.",
    },
    {
      name: "Disciplina",
      text: "Cumplir órdenes y procedimientos con un alto nivel de exigencia, empezando por el ejemplo de quien supervisa.",
    },
    {
      name: "Control",
      text: "Identificar y registrar a cada persona, vehículo y material que entra o sale.",
    },
    {
      name: "Responsabilidad",
      text: "Responder por cada turno, cada novedad y cada decisión.",
    },
  ],
} as const;

/* Visítenos y ficha legal --------------------------------------------------- */
export const visit = {
  eyebrow: "Visítenos",
  title: { text: "Nuestra oficina en", highlight: "Maracaibo" },
  /** Horario de la oficina (distinto de la atención 24/7 por teléfono y WhatsApp). */
  officeHours: "Horario de oficina: [HORARIO DE ATENCIÓN EN OFICINA]",
  note: "Le recomendamos coordinar su visita por WhatsApp o por teléfono.",
  photo: "Fachada y recepción de la oficina en el Centro Empresarial Grupo Assper",
  whatsappLabel: "Coordinar la visita por WhatsApp",
} as const;

export interface LegalRow {
  term: string;
  value: string;
  source?: string;
}

export const legal = {
  eyebrow: "Ficha legal",
  title: "Datos de la empresa",
  rows: [
    { term: "Razón social", value: site.legalName },
    { term: "Nombre comercial", value: site.name },
    { term: "RIF", value: site.rifDisplay },
    { term: "Oficina", value: `${site.address}, ${site.city}` },
    { term: "Objeto", value: "Vigilancia y protección no armada de personas y bienes", source: "Art. 4" },
    { term: "Modalidades", value: "Vigilancia fija · Vigilancia móvil · Consultoría y asesoría", source: "Arts. 9 y 28" },
    { term: "Registro Mercantil", value: "[DATOS DEL REGISTRO MERCANTIL]" },
    {
      term: "Autorización de funcionamiento (DIGESERVISP)",
      value: "[NÚMERO Y VIGENCIA DE LA AUTORIZACIÓN]",
    },
  ] satisfies readonly LegalRow[],
  more: "¿Necesita registrar a SEDIN como proveedor?",
  moreLink: { label: "Ver el kit de proveedor", href: routes.empresas },
} as const;
