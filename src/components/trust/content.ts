import {
  BoltIcon,
  BookIcon,
  BriefcaseIcon,
  CalendarIcon,
  CameraIcon,
  ClipboardCheckIcon,
  ClockIcon,
  EyeIcon,
  FileTextIcon,
  HomeIcon,
  InfoIcon,
  RadioIcon,
  SearchIcon,
  ShieldCheckIcon,
  UserCheckIcon,
} from "@/components/icons";
import { ctaLabels, routes, site, type CtaAction } from "@/config/site";
import { reporte } from "@/content/answers";
import type { FaqCategory, FaqId } from "@/content/faq";

/*
 * Textos propios de las páginas de confianza: /como-trabajamos (8.5),
 * /empresas (8.7) y /preguntas-frecuentes. Las respuestas de la sección 4
 * NO se repiten aquí: se leen de src/content/answers.ts, faq.ts y process.ts.
 *
 * Reglas: usted; impersonal en las descripciones; hechos del reglamento
 * SED-GC-PR-01 con su artículo en `source` (solo visible en revisión); lo no
 * confirmado, con [MARCADOR] (oculto en producción). Sin horas exactas.
 */

export type Icon = typeof BookIcon;

const REG = "Reglamento interno SED-GC-PR-01";
const WA = "Hola, SEDIN. Les escribo desde sedinca.com";

/** Ubicaciones de Umami de estas páginas (`empresas` y `faq` son de la lista de la guía). */
export const ubicaciones = {
  comoTrabajamos: "como-trabajamos",
  empresas: "empresas",
  faq: "faq",
} as const;

/* =========================================================================
 * /como-trabajamos
 * ====================================================================== */

export const comoTrabajamosMeta = {
  title: "Cómo trabajamos: supervisión y libro de novedades",
  description:
    "Relevos sin puestos vacíos, libro de novedades foliado, supervisión en sitio y oficiales formados en un curso de 120 horas: así trabaja SEDIN en el Zulia.",
};

export const comoTrabajamosHero = {
  eyebrow: "Cómo trabajamos",
  title: { text: "Un método escrito para", highlight: "cada puesto" },
  lead: "De la inspección de su instalación al libro de novedades que se le entrega: así se organiza, se supervisa y se reporta el servicio de SEDIN.",
};

/**
 * Índice didáctico del método: cada tarjeta lleva a su ancla. `short` es la
 * etiqueta del chip de móvil (rejilla de 2 columnas).
 */
export const methodIndex: readonly { href: string; Icon: Icon; title: string; short: string; text: string }[] = [
  {
    href: "#proceso",
    Icon: CalendarIcon,
    title: "De la inspección al primer turno",
    short: "Primer turno",
    text: "Cinco pasos, con lo que usted recibe en cada uno.",
  },
  {
    href: "#relevos",
    Icon: ClockIcon,
    title: "Relevos",
    short: "Relevos",
    text: "Ningún puesto queda solo: el oficial espera a su relevo.",
  },
  {
    href: "#libro",
    Icon: BookIcon,
    title: "Libro de novedades",
    short: "Libro de novedades",
    text: "Cada novedad, por escrito, en un libro foliado que se le entrega.",
  },
  {
    href: "#supervision",
    Icon: EyeIcon,
    title: "Supervisión",
    short: "Supervisión",
    text: "Asistencia y puntualidad verificadas a diario, y riesgos de cada puesto analizados.",
  },
  {
    href: "#personal",
    Icon: UserCheckIcon,
    title: "Personal",
    short: "Personal",
    text: "Requisitos de ingreso y curso de 120 horas aprobado por el INCES.",
  },
  {
    href: "#calidad",
    Icon: ClipboardCheckIcon,
    title: "Sistema de gestión",
    short: "Sistema de gestión",
    text: "Procedimientos y formularios codificados, con control de revisiones.",
  },
  {
    href: "#tecnologia",
    Icon: CameraIcon,
    title: "Tecnología",
    short: "Tecnología",
    text: "Radios en el servicio y cámaras HD con visión nocturna.",
  },
  {
    href: routes.faq,
    Icon: InfoIcon,
    title: "Preguntas frecuentes",
    short: "Preguntas",
    text: "Las respuestas a lo que más se pregunta antes de contratar.",
  },
];

/**
 * Reglas del relevo (4.1) que NO están en la línea de tiempo «Así sabrá lo
 * que pasa…» (la llegada anticipada y «no deja el puesto» ya van en sus
 * pasos 01 y 02). Hechos del reglamento, sin horas de turno.
 */
export const relevoRules: readonly { Icon: Icon; title: string; text: string; source: string }[] = [
  {
    Icon: CalendarIcon,
    title: "Ausencias con aviso",
    text: "Las ausencias se avisan con 48 horas de anticipación para asignar la cobertura.",
    source: "Art. 32",
  },
  {
    Icon: BriefcaseIcon,
    title: "Responde la Jefatura",
    text: "La Jefatura de Operaciones garantiza la asistencia del personal en cada servicio.",
    source: "Art. 14",
  },
];

/** La promesa central (1.2, 11.2): «Vigilancia que se ve y se reporta». */
export const promise = {
  eyebrow: "Nuestra promesa",
  title: { text: "Vigilancia que se ve y", highlight: "se reporta." },
  lead: "Lo que pasa en su instalación no se queda en el puesto: queda por escrito y llega a quien debe saberlo.",
  source: `${REG}, arts. 14, 19, 31 y 32`,
  pillars: [
    {
      Icon: EyeIcon,
      label: "Se ve",
      text: [
        "Oficiales con el uniforme de la empresa, identificados con el cargo, el logo y el RIF, y supervisores que verifican el puesto en sitio.",
      ],
      source: "Arts. 19 y 31",
    },
    {
      Icon: BookIcon,
      label: "Se registra",
      text: [
        "Un libro de novedades foliado en cada puesto, donde se anota lo ocurrido en cada turno y que se rubrica al cierre de cada uno.",
      ],
      source: "Art. 32",
    },
    {
      Icon: FileTextIcon,
      label: "Se reporta",
      text: [
        "Cada novedad se anota con datos precisos y se informa al supervisor y, cuando corresponde, a la persona que usted designe.",
        "La Jefatura de Operaciones asiste a las reuniones con usted para revisar el servicio.",
        "Al completarse, el libro se reemplaza por uno nuevo y el completo se le entrega para su archivo.",
        "[Novedades relevantes: aviso inmediato a su contacto por teléfono o WhatsApp. CONFIRMAR REPORTE MÍNIMO]",
      ],
      source: "Arts. 14 y 32",
    },
  ],
} as const;

/** Qué se asienta en el libro de novedades (art. 32), como renglones de un libro. */
export const ledgerRows: readonly string[] = [
  "Turno de vigilancia y supervisor o jefe de grupo encargado",
  "Equipos del puesto: linternas, radios de comunicación y el propio libro",
  "Órdenes recibidas antes de tomar el servicio",
  "Novedades del turno, sin omitir datos, con la identificación de personas, vehículos y mercancías",
  "Identificaciones recogidas en el control de acceso",
  "Objetos o valores hallados en las rondas",
  "Puertas verificadas y luces que quedan encendidas",
  "Entregas de objetos o valores, con fórmula de recibo y firma",
];

/** Filas del libro visibles antes de «Ver los otros puntos». */
export const ledgerPreview = 4;

/**
 * Por qué importa el libro (art. 32). Reutiliza las frases de answers.ts
 * (4.2). La entrega del libro completo ya va en «Se reporta».
 */
export const ledgerValue: readonly { title: string; text: readonly string[] }[] = [
  {
    title: "Valor probatorio",
    text: [reporte.body[1], "Es de suma utilidad en la investigación de cualquier ilícito."],
  },
  {
    title: "Reserva absoluta",
    text: ["Fuera de usted, su contenido solo se muestra a las autoridades de fiscalización y control o por orden judicial."],
  },
];

/** Formularios de control que acompañan al libro (art. 32, referencias). */
export const controlForms: readonly { code: string; name: string }[] = [
  { code: "FO-OP-05", name: "Nota de entrada o salida de materiales" },
  { code: "FO-OP-07", name: "Control de entrada y salida de herramientas y equipos" },
  { code: "FO-OP-10", name: "Control de entrada y salida de visitantes" },
  { code: "FO-OP-11", name: "Control de entrada y salida de personal" },
  { code: "FO-OP-12", name: "Control de entrada y salida de vehículos" },
];

/** Las tres funciones que supervisan el servicio (por funciones, sin nombres). */
export const supervisionRoles = {
  supervisor: {
    Icon: EyeIcon,
    role: "Supervisor de seguridad",
    extra: [
      "Cada vez que se reemplaza a un oficial, el supervisor orienta al nuevo en las órdenes y los procedimientos del puesto.",
    ],
    source: "Art. 19",
  },
  jefatura: {
    Icon: BriefcaseIcon,
    role: "Jefatura de Operaciones",
    text: [
      "Garantiza la asistencia del personal en cada servicio y dota los puestos de radios, libros de novedades y formularios de control.",
      "Asiste a las reuniones con usted para revisar el servicio.",
    ],
    source: "Art. 14",
  },
  /** Mismos hechos que answers.ts (4.5), redactados para la tarjeta (el título ya nombra la función). */
  asuntosInternos: {
    Icon: SearchIcon,
    role: "Asuntos Internos",
    text: [
      "Recibe e investiga las quejas sobre el servicio y determina su procedencia.",
      "También da seguimiento a cada hurto o robo: investiga en sitio, determina la causa y elabora un informe por escrito.",
    ],
    source: "Art. 14",
  },
} as const;

/** #calidad: la ficha del reglamento y sus formularios están en /nosotros#calidad. */
export const qualityAboutLink = { label: "Ver la ficha del reglamento", href: `${routes.about}#calidad` };

/** Gerencia de Calidad y SSO: consta en el reglamento, pero no en el HRMS (9.1). */
export const qualityManagement = [
  "La Gerencia de Calidad y Seguridad y Salud Ocupacional (SSO) dirige la mejora continua de los procedimientos y asegura el cumplimiento del Programa de Seguridad Industrial y Salud Ocupacional. [VALIDAR GERENCIA DE CALIDAD Y SSO VIGENTE]",
] as const;

export const qualityIndexMail = {
  subject: "Solicitud del índice de procedimientos del sistema de gestión",
  body: [
    "Buenos días, SEDIN.",
    "Les escribo desde sedinca.com (cómo trabajamos). Quisiéramos recibir el índice de procedimientos de su sistema de gestión.",
    "",
    "Empresa: ",
    "Persona de contacto y cargo: ",
  ].join("\n"),
};

/** #tecnologia: frase permitida de cámaras (sin «centro de control» ni «tiempo real»). */
export const technology = {
  cameras: "Cámaras HD con visión nocturna, instaladas y mantenidas por SEDIN; monitoreo remoto según el servicio contratado.",
  items: [
    {
      Icon: RadioIcon,
      title: "Radios de comunicación",
      text: "Para mantener el puesto comunicado con su supervisor durante el turno.",
      source: "Arts. 14 y 36",
    },
    {
      Icon: ShieldCheckIcon,
      title: "La base de control, en el puesto",
      text: "Los equipos se controlan desde el propio servicio de vigilancia: lo que detectan se atiende en el puesto y, si es una novedad, queda escrito en el libro.",
      source: "Arts. 32 y 36",
    },
    {
      Icon: BoltIcon,
      title: "Cercado eléctrico y concertinas",
      text: "Para los perímetros fáciles de saltar, según la evaluación de su instalación.",
    },
  ],
  sts: "SEDIN se mantiene abierta a nuevas tecnologías y actualiza sus equipos para apoyar mejor la tarea de vigilancia.",
  stsSource: `${REG}, art. 36`,
  controlCenterNeeds:
    "Solo si SEDIN lo confirma (propuesta 9.2): si hay una central propia de operaciones o de radio, si las cámaras se monitorean desde una sala propia o con un aliado, y qué recibe el cliente. Nunca un panel simulado.",
  controlCenter: "[CENTRO DE CONTROL: describir con exactitud, con foto real y protocolo, solo si SEDIN lo confirma]",
} as const;

/* =========================================================================
 * /empresas
 * ====================================================================== */

export const empresasMeta = {
  title: "Proveedor de vigilancia privada: documentos y propuesta",
  description: `Ficha de proveedor de ${site.name} (RIF ${site.rifDisplay}), kit de documentos, qué incluye cada propuesta y una guía para evaluar empresas de vigilancia en Maracaibo.`,
};

export const empresasHero = {
  eyebrow: "Para compras y proveedores",
  title: { text: "Registre a SEDIN como proveedor:", highlight: "ficha, kit y propuesta formal" },
  lead: "Los datos de la ficha listos para copiar, el kit de documentos a solicitud, una propuesta técnica y económica que se compara punto por punto y una guía para evaluar empresas de vigilancia.",
  facts: [`RIF ${site.rifDisplay}`, "Oficina en Maracaibo", `Atención ${site.hours}`],
};

/**
 * Ficha de proveedor. Las filas con [MARCADOR] solo se ven en revisión; las
 * publicables se copian también con «Copiar los datos».
 */
export const providerSheet: readonly { label: string; value: string; kind?: "tel" | "mail" | "address" }[] = [
  { label: "Razón social", value: site.legalName },
  { label: "Nombre comercial", value: site.name },
  { label: "RIF", value: site.rifDisplay },
  {
    label: "Objeto",
    value: "Vigilancia privada y protección de personas y bienes, en la modalidad no armada",
  },
  { label: "Oficina", value: `${site.address}, ${site.city}`, kind: "address" },
  { label: "Dirección fiscal", value: "[DIRECCIÓN FISCAL: CONFIRMAR SI COINCIDE CON LA OFICINA]" },
  { label: "Registro Mercantil", value: "[DATOS DEL REGISTRO MERCANTIL]" },
  { label: "Teléfono y WhatsApp", value: site.phone, kind: "tel" },
  { label: "Correo", value: site.salesEmail, kind: "mail" },
  { label: "Atención", value: site.hours },
];

export const providerSheetSource = `${REG}, art. 4 (objeto); datos de site.ts`;

/** ¿Está publicada la ficha imprimible /empresas/ficha/? (no es de este encargo). */
export const fichaPublished = false;

/** «Para prepararla, envíenos» (lo que facilita una propuesta comparable). */
export const proposalNeeds = [
  "Empresa y RIF",
  "Instalación y ubicación",
  "Servicios que necesita",
  "Puestos y horario de cobertura",
  "Pliego o alcance, si lo tiene",
  "Fecha límite para recibir la propuesta",
  "Persona de contacto y cargo",
] as const;

/** Correo «Solicitud de propuesta – [empresa]», con el cuerpo guía para completar. */
const proposalSubject = "Solicitud de propuesta – [empresa]";
const proposalBody = [
  "Buenos días, SEDIN.",
  "Les escribo desde sedinca.com (empresas). Solicitamos una propuesta técnica y económica.",
  "",
  "Empresa y RIF: ",
  "Instalación y ubicación: ",
  "Servicios que necesitamos (vigilancia, control de acceso, cámaras, cercado…): ",
  "Puestos y horario de cobertura: ",
  "Fecha límite para recibir la propuesta: ",
  "Persona de contacto, cargo y teléfono: ",
  "",
  "Adjuntamos el pliego o alcance, si lo tenemos.",
].join("\n");

export const proposalMailAction: CtaAction = {
  kind: "mail",
  label: "Solicitar propuesta técnica y económica",
  subject: proposalSubject,
  body: proposalBody,
  ubicacion: ubicaciones.empresas,
  event: "propuesta-formal",
};

/** Texto completo del correo, para «Copiar el texto del correo». */
export const proposalMailText = `Para: ${site.salesEmail}\nAsunto: ${proposalSubject}\n\n${proposalBody}`;

/** «Qué pedir» a cualquier proveedor, para cada pregunta de la guía (consejo neutro, sin datos). */
export const guideTips: Partial<Record<FaqId, string>> = {
  nomina:
    "Pida que le confirmen por escrito quién es el patrono de los oficiales y si están inscritos en el Seguro Social.",
  "kit-proveedor":
    "Pida copia de las solvencias laboral, del IVSS, del INCES y de BANAVIH/FAOV, cada una con su fecha de vigencia.",
  "supervision-noche":
    "Pregunte quién visita el puesto de noche y los fines de semana, y cómo queda constancia de cada visita.",
  "falta-oficial": "Pregunte quién cubre el puesto, en cuánto tiempo y si ese compromiso queda en el contrato.",
  "como-sabre": "Pregunte dónde se registran las novedades, por qué canal le avisan y qué documentos recibe.",
  "quien-responde-hurto":
    "Pida la póliza de responsabilidad civil vigente y pregunte quién investiga si hay un daño o un hurto.",
  "cambio-oficial": "Pregunte cómo se pide el cambio de un oficial y en cuánto tiempo se atiende.",
  "terminar-contrato": "Revise la duración, el preaviso y las condiciones para terminar el contrato antes de firmarlo.",
};

/**
 * Frase de la respuesta que contesta la pregunta de frente. Si está
 * pendiente, «La respuesta de SEDIN» no se publica (sin ella la respuesta
 * esquivaría la pregunta). Sin entrada: la primera frase de la respuesta.
 */
export const guideKeyPhrase: Partial<Record<FaqId, string>> = {
  "kit-proveedor": "solvencias",
  "supervision-noche": "noche",
};

/**
 * Sin respuesta publicable: punto de «Qué incluye cada propuesta» que cubre
 * la pregunta (texto exacto de `proposalIncludes`). Si ese punto también
 * está pendiente, se usa `guideAsk`.
 */
export const guideInProposal: Partial<Record<FaqId, string>> = {
  "supervision-noche": "Supervisión: frecuencia y turnos",
  "terminar-contrato": "Duración y rescisión del contrato",
};

/** Sin respuesta publicable ni punto de la propuesta: qué hacer (consejo neutro). */
export const guideAsk: Partial<Record<FaqId, { label: string; href: string }>> = {
  "kit-proveedor": { label: "Pida las solvencias con el kit de proveedor", href: "#kit" },
};

export const guideAskDefault = { label: "Pida la respuesta por escrito en su solicitud de propuesta", href: "#propuesta" };

export const guideCopy = {
  eyebrow: "Guía gratuita",
  print: "Imprimir la guía",
  share: "Compartir la guía por WhatsApp",
  shareText: (url: string) => `Les comparto esta guía para comparar empresas de vigilancia: ${url}`,
  tip: "Qué pedir",
  answer: "La respuesta de SEDIN",
  more: "Ver la respuesta completa",
  inProposal: "Incluido en cada propuesta de SEDIN",
  point: (n: number) => `Punto ${n}`,
  printFooter: `${site.name} · ${site.domain}/empresas · ${site.phone}`,
};

/** Franja de sectores (fotos de IA solo como ambientación, en recortes pequeños). */
export const empresasSectors = {
  eyebrow: "Sectores",
  title: { text: "Sectores que", highlight: "atendemos" },
  lead: "Cada sector tiene su página, con sus riesgos y el esquema de servicio que le corresponde.",
  cta: "Ver sector",
};

/** «De la inspección al primer turno» en /empresas: solo los pasos (el detalle está en /como-trabajamos). */
export const empresasProcess = {
  eyebrow: "Cómo empezamos",
  lead: "Cinco pasos desde la visita a su instalación. Lo que usted recibe en cada uno está en el método completo.",
  more: "Ver el método completo",
};

/** Referencias telefónicas (4.9): solo con el consentimiento del cliente. */
export const referencesCopy = {
  eyebrow: "Referencias",
  title: "Hable con un cliente de su mismo sector",
  note: "Solo con el consentimiento del cliente para la llamada; su nombre no se publica.",
  needs: "2 o 3 clientes que acepten ser llamados (propuesta 4.9).",
  cta: "Solicitar una referencia",
  message: `${WA} (empresas). Quisiéramos hablar con un cliente actual de nuestro sector. Empresa y sector: `,
};

/* =========================================================================
 * /preguntas-frecuentes
 * ====================================================================== */

export const faqMeta = {
  title: "Preguntas frecuentes sobre vigilancia privada",
  description:
    "Qué pasa si falta el oficial, cómo se reporta, quién supervisa, quién entra en su instalación y de qué depende el precio: las respuestas de SEDIN en Maracaibo.",
};

export const faqHero = {
  eyebrow: "Preguntas frecuentes",
  title: { text: "Lo que se pregunta", highlight: "antes de contratar" },
  lead: "Relevos, reportes, supervisión, personal y precio: las respuestas de SEDIN, en un solo lugar.",
};

export const faqWhatsapp = `${WA} (preguntas frecuentes). Tengo una pregunta: `;

/**
 * Orden, icono y enlace de apoyo de cada tema. Un tema con menos de
 * `faqMinPerTopic` preguntas publicadas se funde con su `mergeInto` (sus
 * preguntas van al final de ese tema y su ancla se conserva).
 */
export const faqTopics: readonly {
  id: FaqCategory;
  Icon: Icon;
  link?: { label: string; href: string };
  mergeInto?: FaqCategory;
}[] = [
  { id: "general", Icon: ShieldCheckIcon, link: { label: "Ver cómo trabajamos", href: routes.comoTrabajamos } },
  {
    id: "condominios",
    Icon: HomeIcon,
    link: { label: "Ver el resumen para la asamblea", href: routes.resumen },
    mergeInto: "general",
  },
  { id: "empresas", Icon: BriefcaseIcon, link: { label: "Ver la página para empresas", href: routes.empresas } },
  {
    id: "precio-contrato",
    Icon: FileTextIcon,
    link: { label: `${ctaLabels.diagnostico} en 4 preguntas`, href: routes.cotizar },
    mergeInto: "empresas",
  },
  {
    id: "personal",
    Icon: UserCheckIcon,
    link: { label: "Ver requisitos y formación", href: `${routes.comoTrabajamos}#personal` },
  },
];

export const faqMinPerTopic = 3;

/**
 * Preguntas que en /preguntas-frecuentes solo se publican si su frase propia
 * (la que contiene este texto, en minúsculas) se publica: sin ella, la
 * respuesta repite la de otra pregunta de la página. «junta-libro» sin la
 * consulta del libro en el puesto solo repite «¿Cómo sabré qué pasó en mi
 * instalación?» (entrega al completarse, con reserva).
 */
export const faqOwnPhrase: Partial<Record<FaqId, string>> = {
  "junta-libro": "puede revisarlo",
};

/**
 * Palabra clave de cada pregunta: la entradilla de cada tema se arma con las
 * de sus preguntas publicadas (así nunca promete lo que no se publica). Las
 * preguntas sin palabra clave no la amplían.
 */
export const faqKeywords: Partial<Record<FaqId, string>> = {
  "falta-oficial": "relevos",
  "como-sabre": "reportes",
  "no-armado-robo": "vigilancia no armada",
  "quien-responde-hurto": "hurtos",
  relevo: "relevos",
  "por-que-no-armado": "vigilancia no armada",
  zonas: "zonas",
  "supervision-noche": "supervisión",
  "mismos-oficiales": "rotación de oficiales",
  "cambio-oficial": "cambio de oficial",
  "junta-libro": "reportes",
  "kit-proveedor": "documentos",
  "propuesta-incluye": "propuesta",
  "inspeccion-primer-turno": "primeros pasos",
  "acreditacion-hse": "acreditación",
  "sistema-gestion": "sistema de gestión",
  referencias: "referencias",
  precio: "precio",
  "contrato-pago": "duración y pago",
  "terminar-contrato": "terminación",
  facturacion: "facturación",
  "ajuste-precio": "ajuste de precios",
  "inspeccion-costo": "costo de la inspección",
  "quien-entra": "requisitos de ingreso",
  formacion: "formación",
  nomina: "nómina",
  uniforme: "uniforme",
  quejas: "quejas",
};
