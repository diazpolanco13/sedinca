import { hasPending, showPending, site } from "@/config/site";
import {
  contrato,
  kit,
  ningunPuestoSolo,
  noArmado,
  precio,
  qualitySystem,
  quienProtege,
  quienResponde,
  reporte,
  showsNightSupervision,
  supervision,
  trainingSyllabus,
  unarmedStatement,
  uniform,
  type AnswerId,
} from "@/content/answers";
import { onboarding, reportTimeline } from "@/content/process";

/**
 * Preguntas frecuentes (propuesta 4.x y 7.6). Las respuestas reutilizan los
 * textos de `answers.ts` (se escriben una sola vez).
 *
 * Cada respuesta es una lista de frases: en producción se publican solo las
 * que no tienen [MARCADOR]; si no queda ninguna, la pregunta no se muestra
 * (`<FaqList>` lo hace solo). Los `id` sirven de ancla:
 * /preguntas-frecuentes#<id>.
 */

export type FaqCategory = "general" | "condominios" | "empresas" | "precio-contrato" | "personal";

/** ¿Se publica alguna frase sobre el contrato (duración, preaviso, factura…)? */
const contractVisible =
  showPending || [contrato.body, ...contrato.points.map((p) => p.text)].some((t) => t.some((s) => !hasPending(s)));

/**
 * Título de pregunta según lo que su respuesta dice en el modo actual: la
 * versión completa solo si la frase que la responde se publica (o en modo
 * revisión); si no, una pregunta que la respuesta visible sí cubre.
 */
function questionFor(sentence: string, full: string, fallback: string) {
  return showPending || !hasPending(sentence) ? full : fallback;
}

export const faqCategories: Record<FaqCategory, { label: string; description: string }> = {
  general: {
    label: "El servicio",
    description: "Relevos, reportes, supervisión y vigilancia no armada.",
  },
  condominios: {
    label: "Condominios",
    description: "Lo que suele preguntar la junta y la asamblea.",
  },
  empresas: {
    label: "Empresas y proveedores",
    description: "Documentos, propuesta, acreditación y sistema de gestión.",
  },
  "precio-contrato": {
    label: "Precio y contrato",
    // Solo promete lo que se publica: hasta tener los datos del contrato, el precio.
    description: contractVisible
      ? "De qué depende el precio, duración, facturación y preaviso."
      : "De qué depende el precio de su servicio.",
  },
  personal: {
    label: "El personal",
    description: "Quién entra en su instalación y cómo se forma.",
  },
};

export interface FaqItem {
  id: string;
  category: FaqCategory;
  question: string;
  answer: readonly string[];
  /** Bloque de `answers.ts` del que sale la respuesta. */
  answerId?: AnswerId;
  /** Fuente interna (solo en modo revisión). */
  source?: string;
  link?: { label: string; href: string };
}

/** «El temario incluye a, b y c.» (minúscula inicial en cada elemento). */
function enumerate(intro: string, items: readonly string[]) {
  const lower = items.map((s) => s.charAt(0).toLowerCase() + s.slice(1));
  const body = lower.length > 1 ? `${lower.slice(0, -1).join(", ")} y ${lower.at(-1)}` : lower[0];
  return `${intro} ${body}.`;
}

const numberWords = ["cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho"];

/** Consulta del libro por la junta (pendiente de confirmar). */
const juntaLibroConsulta = "[La junta puede revisarlo en el puesto cuando lo solicite. CONFIRMAR]";

const faqData = [
  /* --- El servicio --------------------------------------------------- */
  {
    id: "falta-oficial",
    category: "general",
    question: "¿Qué pasa si falta el oficial?",
    answer: [ningunPuestoSolo.title, ...ningunPuestoSolo.body],
    answerId: "ningun-puesto-solo",
    source: ningunPuestoSolo.source,
    link: ningunPuestoSolo.link,
  },
  {
    id: "como-sabre",
    category: "general",
    question: "¿Cómo sabré qué pasó en mi instalación?",
    answer: reporte.body,
    answerId: "reporte",
    source: reporte.source,
    link: reporte.link,
  },
  {
    id: "no-armado-robo",
    category: "general",
    question: "¿Qué hace un oficial no armado ante un robo?",
    answer: noArmado.body,
    answerId: "no-armado",
    source: noArmado.source,
  },
  {
    id: "quien-responde-hurto",
    category: "general",
    // Mientras la póliza no esté confirmada, la respuesta solo explica la investigación.
    question: questionFor(quienResponde.points[0].text[0], "¿Quién responde si hay un hurto?", "¿Qué pasa si hay un hurto?"),
    answer: quienResponde.points[0].text,
    answerId: "quien-responde",
    source: quienResponde.source,
  },
  {
    id: "relevo",
    category: "general",
    question: "¿Cómo se hace el relevo?",
    answer: [...reportTimeline.stages[0].text, ...reportTimeline.stages[1].text],
    answerId: "ningun-puesto-solo",
    source: "Arts. 21 y 32",
  },
  {
    id: "por-que-no-armado",
    category: "general",
    question: "¿Qué significa vigilancia no armada?",
    answer: [
      unarmedStatement,
      "SEDIN presta vigilancia y protección de personas y bienes en la modalidad no armada: su función es prevenir, detectar y avisar.",
    ],
    answerId: "no-armado",
    source: "Art. 4",
  },
  {
    id: "zonas",
    category: "general",
    question: "¿En qué zonas trabajan?",
    answer: [
      "SEDIN tiene su oficina en Maracaibo, en el Centro Empresarial Grupo Assper.",
      "[ZONAS ATENDIDAS: Maracaibo, San Francisco, … CONFIRMAR]",
      "Escríbanos y confirmamos la cobertura en su zona.",
    ],
  },
  {
    id: "respuesta",
    category: "general",
    question: "¿Cuánto tardan en responder?",
    answer: [`Por WhatsApp y por teléfono: ${site.responseTime.charAt(0).toLowerCase()}${site.responseTime.slice(1)}.`],
  },

  /* --- Condominios --------------------------------------------------- */
  {
    id: "supervision-noche",
    category: "condominios",
    // El id y el ancla se mantienen; la pregunta solo nombra la noche si la respuesta lo dice.
    question: showsNightSupervision ? "¿Quién supervisa el servicio, también de noche?" : "¿Quién supervisa el servicio?",
    answer: supervision.body,
    answerId: "supervision",
    source: supervision.source,
    link: supervision.link,
  },
  {
    id: "mismos-oficiales",
    category: "condominios",
    question: "¿Son siempre los mismos oficiales en nuestro conjunto?",
    answer: quienProtege.points[0].text,
    answerId: "quien-protege",
  },
  {
    id: "cambio-oficial",
    category: "condominios",
    question: "¿Podemos pedir el cambio de un oficial?",
    answer: quienProtege.points[1].text,
    answerId: "quien-protege",
  },
  {
    id: "junta-libro",
    category: "condominios",
    question: questionFor(
      juntaLibroConsulta,
      "¿La junta puede ver el libro de novedades?",
      "¿Cuándo recibe la junta el libro de novedades?",
    ),
    answer: [
      "El libro de novedades se entrega al cliente para su archivo al completarse, con reserva absoluta de su contenido.",
      juntaLibroConsulta,
    ],
    answerId: "reporte",
    source: "Art. 32",
  },

  /* --- Empresas y proveedores ---------------------------------------- */
  {
    id: "kit-proveedor",
    category: "empresas",
    question: "¿Qué documentos de proveedor pueden enviarnos?",
    answer: [
      `El RIF de SEDIN es ${site.rifDisplay}.`,
      ...kit.body,
      "[Registro Mercantil, solvencias (laboral, IVSS, INCES y BANAVIH/FAOV), RNC y pólizas, cada uno con su fecha de vigencia. CONFIRMAR]",
    ],
    answerId: "kit",
    link: kit.link,
  },
  {
    id: "propuesta-incluye",
    category: "empresas",
    question: "¿Qué incluye cada propuesta de SEDIN?",
    answer: [
      "Puestos y horarios, número de oficiales en rotación, supervisión, equipos incluidos (radio, libro de novedades, controles de acceso, detector de metales), uniformes, cobertura de ausencias, reportes, precio, moneda, IVA y forma de pago, vigencia de la oferta y ajuste de precios, y duración y rescisión del contrato.",
      "[También las pólizas. CONFIRMAR]",
    ],
    answerId: "kit",
  },
  {
    id: "inspeccion-primer-turno",
    category: "empresas",
    question: "¿Cómo es el proceso desde la inspección hasta el primer turno?",
    answer: [
      enumerate(`Son ${numberWords[onboarding.stages.length] ?? onboarding.stages.length} pasos:`, onboarding.stages.map((s) => s.title)),
      "[Plazos de cada paso: PLAZOS DEL PROCESO.]",
    ],
    answerId: "inspeccion-primer-turno",
    link: { label: "Ver el proceso completo", href: "/como-trabajamos#proceso" },
  },
  {
    id: "acreditacion-hse",
    category: "empresas",
    question: "¿El personal cumple nuestras normas de HSE y de acceso?",
    answer: [
      "Antes del primer turno, el personal se acredita ante su empresa: inducción HSE, equipos de protección personal, pases y cumplimiento de sus normas internas.",
    ],
    answerId: "inspeccion-primer-turno",
  },
  {
    id: "sistema-gestion",
    category: "empresas",
    question: "¿Tienen un sistema de gestión de calidad?",
    answer: [qualitySystem.text, qualitySystem.onRequest],
    link: qualitySystem.link,
  },
  {
    id: "referencias",
    category: "empresas",
    question: "¿Podemos hablar con un cliente actual?",
    answer: kit.points[0].text,
    answerId: "kit",
  },

  /* --- Precio y contrato --------------------------------------------- */
  {
    id: "precio",
    category: "precio-contrato",
    question: "¿De qué depende el precio?",
    answer: [
      "El precio depende de las horas de cobertura (solo de día, solo de noche o 24 horas; fines de semana y feriados), del número de puestos y de oficiales en rotación, de la supervisión y los equipos incluidos (radio, libro de novedades, detector de metales), de la tecnología (cámaras, cercado eléctrico) y de la forma de pago.",
      ...precio.body,
    ],
    answerId: "precio",
  },
  {
    id: "contrato-pago",
    category: "precio-contrato",
    question: "¿Cuánto dura el contrato y cómo se paga?",
    answer: [...contrato.points[0].text, ...contrato.points[2].text, ...contrato.body],
    answerId: "contrato",
  },
  {
    id: "terminar-contrato",
    category: "precio-contrato",
    question: "¿Puedo terminar el contrato?",
    answer: contrato.points[1].text,
    answerId: "contrato",
  },
  {
    id: "facturacion",
    category: "precio-contrato",
    question: "¿Cómo se factura y se aplican retenciones?",
    answer: [...contrato.points[2].text, ...contrato.points[3].text],
    answerId: "contrato",
  },
  {
    id: "ajuste-precio",
    category: "precio-contrato",
    question: "¿Cada cuánto se ajusta el precio?",
    answer: contrato.points[4].text,
    answerId: "contrato",
  },
  {
    id: "inspeccion-costo",
    category: "precio-contrato",
    question: "¿La inspección tiene costo?",
    answer: ["[La inspección y la propuesta no tienen costo. CONFIRMAR]"],
    answerId: "precio",
  },

  /* --- El personal --------------------------------------------------- */
  {
    id: "quien-entra",
    category: "personal",
    question: quienProtege.question,
    answer: quienProtege.body,
    answerId: "quien-protege",
    source: quienProtege.source,
  },
  {
    id: "formacion",
    category: "personal",
    question: "¿Qué formación tienen los oficiales?",
    answer: [
      "Cada oficial completa el curso de Formación de Oficiales de Seguridad de 120 horas, aprobado por el INCES.",
      enumerate("El temario incluye", trainingSyllabus),
    ],
    answerId: "quien-protege",
    source: "Art. 28",
  },
  {
    id: "nomina",
    category: "personal",
    question: "Si el proveedor no paga los beneficios, ¿me demandan a mí?",
    answer: [
      "[Usted contrata un servicio, no personal: todos los oficiales son trabajadores de SEDIN, en nómina e inscritos en el Seguro Social, con sus beneficios de ley. CONFIRMAR]",
    ],
    answerId: "quien-responde",
  },
  {
    id: "uniforme",
    category: "personal",
    question: "¿Cómo se identifican los oficiales?",
    answer: [`Con el uniforme de SEDIN: ${uniform.charAt(0).toLowerCase()}${uniform.slice(1)}`],
    source: "Art. 31",
  },
  {
    id: "quejas",
    category: "personal",
    // «Cómo» solo cuando el canal de quejas esté confirmado.
    question: questionFor(
      quienResponde.points[1].text[1],
      "¿Cómo presento una queja sobre el servicio?",
      "¿Quién atiende las quejas sobre el servicio?",
    ),
    answer: quienResponde.points[1].text,
    answerId: "quien-responde",
    source: "Art. 14",
  },
] as const satisfies readonly FaqItem[];

export type FaqId = (typeof faqData)[number]["id"];

export const faqs: readonly FaqItem[] = faqData;

/**
 * Las 6 preguntas de Inicio (7.6). Sin «¿Qué pasa si falta el oficial?» ni
 * «¿Cómo sabré qué pasó…?»: Inicio ya las responde en «Ningún puesto queda
 * solo» y en la línea de tiempo del reporte.
 */
export const homeFaqIds = [
  "no-armado-robo",
  "zonas",
  "quien-responde-hurto",
  "uniforme",
  "precio",
  "contrato-pago",
] as const satisfies readonly FaqId[];

/** «Preguntas que hará su asamblea» (condominios, 6.2 y 8.8). */
export const assemblyFaqIds = [
  "falta-oficial",
  "supervision-noche",
  "no-armado-robo",
  "nomina",
  "quien-responde-hurto",
  "mismos-oficiales",
  "cambio-oficial",
  "precio",
  "contrato-pago",
] as const satisfies readonly FaqId[];

export function getFaq(id: FaqId): FaqItem {
  return faqs.find((f) => f.id === id)!;
}

/** Preguntas en el orden de `ids`. */
export function getFaqs(ids: readonly FaqId[]): FaqItem[] {
  return ids.map(getFaq);
}

export function faqsByCategory(category: FaqCategory): FaqItem[] {
  return faqs.filter((f) => f.category === category);
}
