import { hasPending, routes, showPending, site } from "@/config/site";

/**
 * Respuestas a las objeciones que deciden la compra (propuesta, sección 4).
 * Se escriben UNA sola vez aquí y las páginas las reutilizan (Inicio,
 * sectores, servicios, /empresas, preguntas frecuentes, resumen para la
 * asamblea: ver 4.11).
 *
 * Cada texto es una lista de frases atómicas: la frase con un [MARCADOR] no
 * se publica en producción y se ve resaltada en modo revisión (ver
 * `src/lib/pending.ts` y `<Pend>`).
 *
 * Los hechos citan el reglamento interno SED-GC-PR-01 (estado «validar»: SEDIN
 * confirma que siguen vigentes y autoriza publicarlos). Lo que SEDIN debe
 * decidir o aportar (estado «confirmar») va siempre entre corchetes.
 */

export type AnswerStatus = "ya" | "validar" | "confirmar";

export interface AnswerPoint {
  title: string;
  text: readonly string[];
  source?: string;
}

export interface Answer {
  id: string;
  /** Apartado de la propuesta (4.1 … 4.10). */
  ref: string;
  /** Pregunta del comprador, tal como la haría. */
  question: string;
  eyebrow: string;
  /** Titular del bloque en la web. */
  title: string;
  body: readonly string[];
  points?: readonly AnswerPoint[];
  list?: { title: string; items: readonly string[] };
  /** Fuente interna (se muestra solo en modo revisión). */
  source: string;
  status: AnswerStatus;
  /** Lo que SEDIN debe confirmar o aportar (modo revisión y guía). */
  needs?: readonly string[];
  link?: { label: string; href: string };
}

const REGLAMENTO = "Reglamento interno SED-GC-PR-01";

/* 4.1 ------------------------------------------------------------------- */
export const ningunPuestoSolo = {
  id: "ningun-puesto-solo",
  ref: "4.1",
  question: "¿Qué pasa si falta el oficial?",
  eyebrow: "Continuidad del servicio",
  title: "Ningún puesto queda solo.",
  body: [
    "El oficial no deja el puesto hasta que llega su relevo.",
    "Las ausencias se avisan con 48 horas de anticipación para asignar la cobertura, y la Jefatura de Operaciones responde por la asistencia en cada puesto.",
    "[Si un oficial falta sin aviso, cubrimos el puesto en un máximo de TIEMPO DE REEMPLAZO.]",
  ],
  source: `${REGLAMENTO}, arts. 14, 20, 21 y 32`,
  status: "validar",
  needs: ["Tiempo de reemplazo que hoy se cumple en todos los puestos"],
  link: { label: "Ver cómo se hacen los relevos", href: `${routes.comoTrabajamos}#relevos` },
} as const satisfies Answer;

/* 4.2 ------------------------------------------------------------------- */
export const reporte = {
  id: "reporte",
  ref: "4.2",
  question: "¿Cómo sabré qué pasó en mi instalación?",
  eyebrow: "Reportes",
  title: "Así sabrá lo que pasa en su instalación",
  body: [
    "Todas las novedades quedan registradas en el libro foliado y rubricado del puesto, con datos de personas, vehículos y mercancías.",
    "El libro es un elemento probatorio en asuntos laborales, comerciales o judiciales.",
    "Al completarse, se le entrega para su archivo, con reserva absoluta de su contenido.",
    "[Novedades relevantes: aviso inmediato a su contacto por teléfono o WhatsApp. CONFIRMAR REPORTE MÍNIMO]",
    "[Usted puede revisar el libro en el puesto cuando lo solicite. CONFIRMAR]",
    "[Resumen mensual: asistencia, relevos, visitas de supervisión y novedades. CONFIRMAR]",
  ],
  points: [
    {
      title: "Qué se registra en el libro",
      text: [
        "El turno y el supervisor o jefe de grupo encargado, los equipos del puesto, las órdenes recibidas, las novedades con la identificación de personas, vehículos y mercancías, y los objetos hallados en las rondas.",
      ],
      source: "Art. 32",
    },
    {
      title: "Qué se considera una novedad relevante",
      text: ["[NOVEDAD RELEVANTE: por ejemplo, intrusión, hurto, daño, accidente o ausencia de un oficial]"],
    },
  ],
  source: `${REGLAMENTO}, art. 32 (y art. 19: los reportes son documentos legales de alto valor jurídico)`,
  status: "validar",
  needs: [
    "Reporte mínimo: qué es una novedad relevante, por qué canal y en cuánto tiempo se avisa",
    "Si el cliente puede consultar el libro y si habrá resumen mensual",
  ],
  link: { label: "Ver qué se registra en el libro", href: `${routes.comoTrabajamos}#libro` },
} as const satisfies Answer;

/* 4.3 ------------------------------------------------------------------- */
/** Supervisión nocturna: mientras SEDIN no la confirme, ninguna pregunta promete «de noche». */
const nightSupervision =
  "[Supervisión en todos los turnos, también de noche y los fines de semana, con visitas sin previo aviso. CONFIRMAR]";

/**
 * ¿Se ve la frase de la supervisión nocturna? Las preguntas que hablan de la
 * noche (aquí y en faq.ts) solo la mencionan si su respuesta lo dice; si no,
 * se quedan en «¿Quién supervisa el servicio?».
 */
export const showsNightSupervision = showPending || !hasPending(nightSupervision);

export const supervision = {
  id: "supervision",
  ref: "4.3",
  question: showsNightSupervision ? "¿Quién supervisa, también de noche?" : "¿Quién supervisa el servicio?",
  eyebrow: "Supervisión",
  title: "Supervisión en sitio, en cada puesto",
  body: [
    "Los supervisores verifican a diario la asistencia y la puntualidad de los oficiales, inspeccionan el servicio y analizan los riesgos de cada puesto.",
    "La Jefatura de Operaciones asiste a las reuniones con usted para revisar el servicio.",
    nightSupervision,
    "[Cada visita de supervisión queda firmada en el libro del puesto. CONFIRMAR]",
    "[La Jefatura de Operaciones se reúne con usted FRECUENCIA DE REUNIÓN.]",
  ],
  source: `${REGLAMENTO}, arts. 14 y 19`,
  status: "validar",
  needs: [
    "Si las visitas son sin previo aviso, en horarios variables, también de noche y los fines de semana",
    "Si cada visita se firma en el libro",
    "Frecuencia de las reuniones de la Jefatura de Operaciones con el cliente",
  ],
  link: { label: "Ver cómo supervisamos", href: `${routes.comoTrabajamos}#supervision` },
} as const satisfies Answer;

/* 4.4 ------------------------------------------------------------------- */
/** Temario del curso (art. 28), sin «Teoría del uso de armas» ni «Defensa de la Soberanía». */
export const trainingSyllabus = [
  "Control de acceso de personas",
  "Recepción y salida de materiales",
  "Medios para reportar novedades",
  "Órdenes y funciones en el puesto",
  "Defensa personal y uso progresivo de la fuerza",
  "Primeros auxilios",
  "Prevención y extinción de incendios",
  "Relaciones interpersonales",
  "Ética profesional",
  "Normas de higiene y seguridad industrial",
] as const;

/** Requisitos de ingreso de cada oficial (art. 25). */
export const officerRequirements = [
  "Constancia de buena conducta",
  "Constancia de residencia",
  "Prueba psicológica aprobada",
  "Más de un año de experiencia",
  "Referencias",
  "Curso de Formación de Oficiales de Seguridad de 120 horas, aprobado por el INCES",
] as const;

/** Entradilla de la lista de requisitos (Inicio y sectores la pintan como lista). */
export const officerRequirementsIntro = "Antes de entrar a su instalación, cada oficial cumple estos requisitos:";

export const quienProtege = {
  id: "quien-protege",
  ref: "4.4",
  question: "¿Quién es el oficial que llega a mi instalación?",
  eyebrow: "Personal",
  title: "Quién protege su instalación",
  body: [
    "Antes de entrar a su instalación, cada oficial presenta constancia de buena conducta y de residencia, aprueba una prueba psicológica, acredita más de un año de experiencia, presenta referencias y completa el curso de Formación de Oficiales de Seguridad de 120 horas aprobado por el INCES.",
  ],
  list: { title: "Temario del curso de 120 horas", items: trainingSyllabus },
  points: [
    {
      title: "¿Son siempre los mismos oficiales?",
      text: ["[POLÍTICA DE ROTACIÓN DE OFICIALES]"],
    },
    {
      title: "¿Se puede pedir el cambio de un oficial?",
      text: ["[POLÍTICA DE CAMBIO DE OFICIAL]"],
    },
  ],
  source: `${REGLAMENTO}, arts. 25 y 28`,
  status: "validar",
  needs: ["Política de rotación y de cambio de oficial"],
  link: { label: "Conozca a SEDIN", href: routes.about },
} as const satisfies Answer;

/* 4.5 ------------------------------------------------------------------- */
export const quienResponde = {
  id: "quien-responde",
  ref: "4.5",
  question: "Si el proveedor no paga los beneficios, ¿me demandan a mí? ¿Quién responde si hay un hurto?",
  eyebrow: "Responsabilidad",
  title: "Usted contrata un servicio, no personal",
  body: [
    "[Todos los oficiales son trabajadores de SEDIN, en nómina e inscritos en el Seguro Social, con sus beneficios de ley. CONFIRMAR]",
  ],
  points: [
    {
      // Subtítulo bajo «¿Quién responde…?» / «¿Qué pasa si hay un hurto o una queja?» (AnswerCard.hurtoQuestion): no repite la pregunta.
      title: "Daños o hurtos",
      text: [
        "[PÓLIZA DE RESPONSABILIDAD CIVIL]",
        "El Supervisor de Asuntos Internos da seguimiento a cada hurto o robo en el servicio: investiga en sitio, determina la causa y elabora un informe por escrito.",
        "[El informe se le entrega a usted. CONFIRMAR]",
      ],
      source: "Art. 14",
    },
    {
      title: "Quejas sobre el servicio",
      text: [
        "El Supervisor de Asuntos Internos recibe e investiga las quejas sobre el servicio y determina su procedencia.",
        "[Para cualquier queja: CANAL DE QUEJAS. Le respondemos por escrito.]",
      ],
      source: "Art. 14",
    },
  ],
  source: `${REGLAMENTO}, art. 14`,
  status: "confirmar",
  needs: [
    "Personal en nómina e inscrito en el IVSS",
    "Póliza de responsabilidad civil y póliza de accidentes del personal",
    "Canal de quejas y si el informe de Asuntos Internos se entrega al cliente",
  ],
} as const satisfies Answer;

/* 4.6 ------------------------------------------------------------------- */
export const noArmado = {
  id: "no-armado",
  ref: "4.6",
  question: "¿Qué hace un oficial no armado ante un robo?",
  eyebrow: "Vigilancia no armada",
  title: "¿Qué hace un oficial no armado ante un robo?",
  body: [
    "Su función es prevenir, detectar y avisar.",
    "[Pone a salvo a las personas, alerta de inmediato al supervisor y a los cuerpos de seguridad del Estado y deja constancia de todo en el libro del puesto. VALIDAR PROTOCOLO]",
    "Está entrenado en defensa personal y uso progresivo de la fuerza.",
  ],
  source: `${REGLAMENTO}, arts. 4 y 28`,
  status: "validar",
  needs: ["Protocolo del oficial no armado ante un robo o un hecho violento"],
} as const satisfies Answer;

/** Texto común de Comercio y Condominios (4.6). Sin atacar a la competencia. */
export const unarmedStatement =
  "Protección preventiva no armada: oficiales entrenados en prevención, control de acceso y comunicación inmediata, sin armas de fuego en su instalación.";

/* 4.7 ------------------------------------------------------------------- */
export const priceFactors = [
  "Horas de cobertura: solo de día, solo de noche o 24 horas; fines de semana y feriados",
  "Número de puestos y de oficiales en rotación",
  "Supervisión y equipos incluidos: radio, libro de novedades, detector de metales",
  "Tecnología: cámaras, cercado eléctrico",
  "Forma de pago",
] as const;

export const precio = {
  id: "precio",
  ref: "4.7",
  question: "¿Cuánto cuesta?",
  eyebrow: "Precio",
  title: "¿De qué depende el precio?",
  body: [
    "Un asesor lo dimensiona con usted: puestos, oficiales y controles.",
    "[La inspección y la propuesta no tienen costo. CONFIRMAR]",
    "[Propuesta escrita con precio cerrado por VIGENCIA DE LA OFERTA.]",
    "[Desde PRECIO REFERENCIAL por puesto.]",
    "[Un puesto de 24 horas requiere N oficiales en rotación.]",
  ],
  list: { title: "El precio depende de", items: priceFactors },
  source: "Propuesta 4.7 (sin datos nuevos); precio y dotación: datos de SEDIN",
  status: "ya",
  needs: [
    "Si se publica un precio orientativo o la regla de dotación",
    "Si la inspección y la propuesta son sin costo, y en qué zonas",
    "Vigencia de la oferta",
  ],
} as const satisfies Answer;

/* 4.8 ------------------------------------------------------------------- */
export const contrato = {
  id: "contrato",
  ref: "4.8",
  question: "¿Cuánto dura el contrato y cómo se paga?",
  eyebrow: "Contrato y pagos",
  title: "Contrato y pagos",
  body: ["[SIN PERMANENCIA MÍNIMA / PRIMER MES DE PRUEBA]"],
  points: [
    { title: "¿Cuánto dura el contrato?", text: ["[DURACIÓN DEL CONTRATO]"] },
    { title: "¿Puedo terminarlo?", text: ["[Sí, con PREAVISO de aviso.]"] },
    { title: "¿Cómo se factura?", text: ["[Factura fiscal mensual con IVA, en MONEDA Y FORMA DE PAGO.]"] },
    { title: "¿Se aplican retenciones?", text: ["[RETENCIONES]"] },
    { title: "¿Cada cuánto se ajusta el precio?", text: ["[POLÍTICA DE AJUSTE DE PRECIOS]"] },
  ],
  source: "Datos de SEDIN",
  status: "confirmar",
  needs: [
    "Duración, preaviso, permanencia mínima o primer mes de prueba",
    "Factura, moneda, forma de pago, retenciones y ajuste de precios",
  ],
} as const satisfies Answer;

/* 4.9 ------------------------------------------------------------------- */
export interface ProviderDocument {
  name: string;
  /** Vigencia o estado. Con [MARCADOR], el documento no se publica. */
  note: string;
}

/** Kit de proveedor: cada documento aparece SOLO si existe, con su vigencia. */
export const providerDocuments: readonly ProviderDocument[] = [
  { name: `RIF ${site.rifDisplay}`, note: "Vigente" },
  { name: "Registro Mercantil", note: "[VIGENTE AL FECHA]" },
  { name: "Autorización de funcionamiento ante la DIGESERVISP", note: "Vigente" },
  { name: "Solvencia laboral", note: "[VIGENTE AL FECHA]" },
  { name: "Solvencias del IVSS, INCES y BANAVIH/FAOV", note: "[VIGENTES AL FECHA]" },
  { name: "Registro Nacional de Contratistas (RNC)", note: "[VIGENTE AL FECHA]" },
  { name: "Registro ante el INPSASEL y Comité de Seguridad y Salud Laboral", note: "[VIGENTE AL FECHA]" },
  { name: "Programa de Seguridad y Salud en el Trabajo", note: "[VIGENTE AL FECHA]" },
  { name: "Póliza de responsabilidad civil", note: "[VIGENTE AL FECHA]" },
  { name: "Póliza de accidentes del personal", note: "[VIGENTE AL FECHA]" },
  { name: "Índice de procedimientos del sistema de gestión", note: "A solicitud" },
];

/** «Qué incluye cada propuesta de SEDIN». */
export const proposalIncludes = [
  "Puestos y horarios",
  "Número de oficiales en rotación",
  "Supervisión: frecuencia y turnos",
  "Equipos incluidos: radio, libro de novedades, controles de acceso, detector de metales",
  "Uniformes",
  "Cobertura de ausencias",
  "Reportes",
  "Pólizas [CONFIRMAR]",
  "Precio, moneda, IVA y forma de pago",
  "Vigencia de la oferta y ajuste de precios",
  "Duración y rescisión del contrato",
] as const;

/**
 * Guía «8 preguntas antes de contratar una empresa de vigilancia». Cada
 * pregunta enlaza a la respuesta de SEDIN en /preguntas-frecuentes#<faqId>.
 * Sin atacar a la competencia.
 */
export const buyerGuide = {
  title: "8 preguntas antes de contratar una empresa de vigilancia",
  lead: "Una guía para comparar proveedores, y también para la asamblea de su condominio.",
  items: [
    { question: "¿Los oficiales están en nómina?", faqId: "nomina" },
    { question: "¿Tienen solvencias vigentes?", faqId: "kit-proveedor" },
    { question: "¿Quién supervisa de noche?", faqId: "supervision-noche" },
    { question: "¿Qué pasa si falta el oficial?", faqId: "falta-oficial" },
    { question: "¿Cómo me reportan?", faqId: "como-sabre" },
    { question: "¿Tienen póliza?", faqId: "quien-responde-hurto" },
    { question: "¿Puedo pedir el cambio de un oficial?", faqId: "cambio-oficial" },
    { question: "¿Cómo termino el contrato?", faqId: "terminar-contrato" },
  ],
} as const;

export const kit = {
  id: "kit",
  ref: "4.9",
  question: "¿Qué documentos de proveedor tienen?",
  eyebrow: "Compras y proveedores",
  title: "Kit de proveedor",
  body: [
    "Solicite el kit de proveedor por correo y le enviamos los documentos vigentes.",
    "[Plazo de envío del kit: PLAZO DE ENVÍO.]",
  ],
  points: [
    {
      title: "Referencias de clientes",
      text: [
        "[¿Quiere hablar con un cliente actual de su mismo sector? Le ponemos en contacto. CONFIRMAR REFERENCIAS]",
      ],
    },
  ],
  source: "Propuesta 4.9; documentos: datos de SEDIN",
  status: "confirmar",
  needs: ["Qué documentos existen hoy y la vigencia de cada uno", "2 o 3 clientes que acepten ser llamados"],
  link: { label: "Ver la página para empresas", href: routes.empresas },
} as const satisfies Answer;

/* 4.10 ------------------------------------------------------------------ */
export const inspeccionPrimerTurno = {
  id: "inspeccion-primer-turno",
  ref: "4.10",
  question: "¿Cómo es el proceso desde la inspección hasta el primer turno?",
  eyebrow: "Cómo empezamos",
  title: "De la inspección al primer turno",
  body: [
    "Inspección del sitio, propuesta escrita, firma, selección y acreditación del personal ante su empresa, y primer turno.",
    "[Plazos de cada paso: PLAZOS DEL PROCESO.]",
  ],
  source: "Propuesta 4.10 (los pasos están en src/content/process.ts)",
  status: "ya",
  needs: ["Plazo de cada paso"],
  link: { label: "Ver el proceso completo", href: `${routes.comoTrabajamos}#proceso` },
} as const satisfies Answer;

/* Sistema de gestión (11.5) ---------------------------------------------- */
/**
 * Texto del sistema de gestión. Nunca «certificado ISO». Según la propuesta,
 * va completo solo en Nosotros y Cómo trabajamos; el kit y el sector petrolero
 * enlazan a /como-trabajamos#calidad.
 */
export const qualitySystem = {
  title: "Sistema de gestión propio",
  text: "Sistema de gestión propio (SED-GC-PR-01) con procedimientos codificados y control de revisiones, tomando como referencia la norma ISO 9001.",
  onRequest: "Índice de procedimientos disponible a solicitud.",
  link: { label: "Ver el sistema de gestión", href: `${routes.comoTrabajamos}#calidad` },
} as const;

/** Uniforme del oficial (art. 31). */
export const uniform =
  "Camisa azul celeste con el cargo, el logo, el nombre y el RIF de la empresa, el escudo en la manga derecha, pantalón azul oscuro, correaje negro y botas negras, según el uniforme autorizado por la Dirección General de los Servicios de Vigilancia y Seguridad Privada.";

export const answers = {
  "ningun-puesto-solo": ningunPuestoSolo,
  reporte,
  supervision,
  "quien-protege": quienProtege,
  "quien-responde": quienResponde,
  "no-armado": noArmado,
  precio,
  contrato,
  kit,
  "inspeccion-primer-turno": inspeccionPrimerTurno,
} as const;

export type AnswerId = keyof typeof answers;

export function getAnswer(id: AnswerId): Answer {
  return answers[id];
}
