import type { SectorSlug } from "@/config/site";
import type { ServiceSlug } from "@/components/contact/quoteShared";

/*
 * Preguntas del diagnóstico guiado (propuesta, 8.3). Ramificado tras el
 * paso 1:
 * - «diagnostico» (condominio, comercio, otro): preocupaciones, horario y
 *   accesos, zona y plazo.
 * - «empresa» (planta, instalación petrolera): puestos, pliego, proveedor
 *   actual y vencimiento del contrato.
 *
 * Cada opción suma puntos a los servicios que responden a ella (`score`); el
 * resultado muestra los 1 a 3 servicios con más puntos y, como «por qué», las
 * respuestas de los pasos 2 a 4 que los sumaron, redactadas de usted
 * (`reason`, o `reasons` por servicio). Encima, una línea con las respuestas
 * (`short`). Sin precios ni dotaciones: el número de oficiales y de puestos
 * se define en la inspección.
 */

export type Branch = "diagnostico" | "empresa";
type Score = Partial<Record<ServiceSlug, number>>;

export interface Option {
  id: string;
  label: string;
  /** Texto breve en el resumen de respuestas del resultado (si no, `label`). */
  short?: string;
  /** Texto del «por qué» si la etiqueta no sirve tal cual. */
  reason?: string;
  /**
   * «Por qué» distinto para cada servicio. Una cadena vacía suma los puntos
   * sin motivo; un servicio que solo aparece aquí recibe el motivo sin puntos.
   */
  reasons?: Partial<Record<ServiceSlug, string>>;
  score?: Score;
}

export interface Group {
  id: string;
  /** Etiqueta del grupo cuando el paso tiene más de uno. */
  label?: string;
  /** Etiqueta en el resumen de WhatsApp («• Me preocupa: …»). */
  summary: string;
  multi?: boolean;
  /** Opciones cortas: botones de ancho automático en lugar de tarjetas. */
  compact?: boolean;
  options: readonly Option[];
}

export interface Step {
  title: string;
  note?: string;
  groups: readonly Group[];
}

export const TOTAL_STEPS = 4;

/** Título de la tarjeta: un solo nombre en las dos ramas (como los enlaces). */
export const titles: Record<Branch, string> = {
  diagnostico: "Diagnóstico de seguridad",
  empresa: "Diagnóstico de seguridad",
};

export const installation: Step = {
  title: "¿Qué necesita proteger?",
  groups: [
    {
      id: "instalacion",
      summary: "Instalación",
      options: [
        {
          id: "condominio",
          label: "Condominio o conjunto residencial",
          score: { "vigilancia-privada": 2, "control-de-acceso": 1 },
        },
        {
          id: "comercio",
          label: "Comercio, hotel u oficina",
          score: { "vigilancia-privada": 2, "control-de-acceso": 1 },
        },
        {
          id: "planta",
          label: "Planta, almacén o galpón",
          score: { "control-de-acceso": 2, "vigilancia-privada": 2, "sistemas-electronicos": 1 },
        },
        {
          id: "petroleo",
          label: "Instalación petrolera o de energía",
          score: { "control-de-acceso": 2, "vigilancia-privada": 2, "sistemas-electronicos": 1 },
        },
        {
          id: "otro",
          label: "Otro tipo de instalación",
          score: { "gestion-de-riesgos": 2, "vigilancia-privada": 1 },
        },
      ],
    },
  ],
};

/** Opción del paso 1 → sector (para el texto de cada servicio y `?sector=`). */
export const installationSector: Record<string, SectorSlug> = {
  condominio: "condominios",
  comercio: "comercio-y-oficinas",
  planta: "industria-y-logistica",
  petroleo: "petroleo-y-energia",
};

export const empresaInstallations = ["planta", "petroleo"];

const zonaPlazo: Step = {
  title: "¿Dónde y para cuándo?",
  note: "Confirmamos la cobertura en su zona.",
  groups: [
    {
      id: "zona",
      label: "Zona",
      summary: "Zona",
      compact: true,
      options: [
        { id: "maracaibo", label: "Maracaibo" },
        { id: "san-francisco", label: "San Francisco" },
        { id: "col", label: "Costa Oriental del Lago" },
        { id: "zulia", label: "Otro municipio del Zulia" },
        { id: "fuera", label: "Fuera del Zulia" },
      ],
    },
    {
      id: "plazo",
      label: "Plazo",
      summary: "Plazo",
      compact: true,
      options: [
        { id: "pronto", label: "Lo antes posible" },
        { id: "semanas", label: "En las próximas semanas" },
        { id: "comparando", label: "Estoy comparando opciones", short: "Comparando opciones" },
      ],
    },
  ],
};

export const branchSteps: Record<Branch, readonly Step[]> = {
  diagnostico: [
    {
      title: "¿Qué le preocupa hoy?",
      note: "Marque todo lo que aplique.",
      groups: [
        {
          id: "preocupa",
          summary: "Me preocupa",
          multi: true,
          options: [
            {
              id: "intrusos",
              label: "Entran personas sin autorización",
              score: { "control-de-acceso": 3, "vigilancia-privada": 1 },
            },
            {
              id: "salida",
              label: "Salida de materiales o mercancía",
              reason: "Le preocupa la salida de materiales o mercancía",
              score: { "control-de-acceso": 3 },
            },
            {
              id: "perimetro",
              label: "Un perímetro fácil de saltar",
              reason: "Su perímetro es fácil de saltar",
              score: { "sistemas-electronicos": 3, "vigilancia-privada": 1 },
            },
            {
              id: "noche",
              label: "No saber qué pasa de noche",
              reason: "Quiere saber qué pasa de noche",
              score: { "vigilancia-privada": 2, "sistemas-electronicos": 2 },
            },
            {
              id: "oficiales",
              label: "Necesito oficiales en sitio",
              reason: "Necesita oficiales en sitio",
              score: { "vigilancia-privada": 3 },
            },
            {
              id: "camaras",
              label: "Tengo cámaras, pero nadie las revisa",
              // No recomendar comprar lo que ya tiene ni prometer que SEDIN
              // revisará sus cámaras (sin confirmar): oficiales en sitio y
              // libro del puesto (art. 36).
              reasons: {
                "vigilancia-privada":
                  "Nadie revisa sus cámaras: un oficial en sitio ve lo que pasa y lo anota en el libro del puesto",
                "sistemas-electronicos": "",
              },
              score: { "vigilancia-privada": 3, "sistemas-electronicos": 1 },
            },
            {
              id: "actual",
              label: "Mi servicio actual no me convence",
              reason: "Su servicio actual no le convence",
              score: { "vigilancia-privada": 2, "gestion-de-riesgos": 1 },
            },
            {
              id: "empezar",
              label: "No sé por dónde empezar",
              reason: "No sabe por dónde empezar",
              score: { "gestion-de-riesgos": 3, "vigilancia-privada": 1 },
            },
          ],
        },
      ],
    },
    {
      title: "¿Qué horario necesita cubrir y cuántos accesos tiene?",
      groups: [
        {
          id: "horario",
          label: "Horario",
          summary: "Horario",
          compact: true,
          options: [
            {
              id: "24h",
              label: "24 horas",
              short: "Cobertura de 24 horas",
              reason: "Necesita cobertura las 24 horas",
              score: { "vigilancia-privada": 1 },
            },
            { id: "dia", label: "Solo de día", short: "Cobertura de día" },
            {
              id: "noche",
              label: "Solo de noche",
              short: "Cobertura de noche",
              reason: "Necesita cobertura de noche",
              score: { "vigilancia-privada": 1 },
            },
            { id: "fines", label: "Fines de semana y feriados" },
            { id: "ns", label: "No lo sé todavía", short: "Horario por definir" },
          ],
        },
        {
          id: "accesos",
          label: "Accesos o entradas",
          summary: "Accesos",
          compact: true,
          options: [
            { id: "1", label: "Uno", short: "Un acceso" },
            {
              id: "2-3",
              label: "2 o 3",
              short: "2 o 3 accesos",
              reason: "Tiene 2 o 3 accesos",
              score: { "control-de-acceso": 1 },
            },
            {
              id: "4",
              label: "4 o más",
              short: "4 o más accesos",
              reason: "Tiene 4 o más accesos",
              score: { "control-de-acceso": 2 },
            },
            { id: "ns", label: "No lo sé", short: "Accesos por definir" },
          ],
        },
      ],
    },
    zonaPlazo,
  ],
  empresa: [
    {
      title: "¿Cuántos puestos necesita cubrir?",
      note: "Si aún no lo sabe, lo definimos en la inspección.",
      groups: [
        {
          id: "puestos",
          summary: "Puestos a cubrir",
          options: [
            {
              id: "1",
              label: "Un puesto",
              reasons: { "vigilancia-privada": "Tiene un puesto que cubrir" },
            },
            {
              id: "2-5",
              label: "De 2 a 5 puestos",
              reason: "Tiene de 2 a 5 puestos",
              score: { "vigilancia-privada": 1 },
            },
            {
              id: "6",
              label: "6 puestos o más",
              reason: "Tiene 6 puestos o más",
              score: { "vigilancia-privada": 1 },
            },
            {
              id: "ns",
              label: "No lo sé todavía",
              short: "Puestos por definir",
              reason: "Aún no sabe cuántos puestos necesita",
              score: { "gestion-de-riesgos": 2 },
            },
          ],
        },
      ],
    },
    {
      title: "¿Tiene un pliego o alcance definido?",
      groups: [
        {
          id: "pliego",
          summary: "Pliego o alcance",
          options: [
            { id: "si", label: "Sí, tengo un pliego o alcance", short: "Con pliego o alcance" },
            {
              id: "no",
              label: "No, necesito ayuda para definirlo",
              short: "Alcance por definir",
              reason: "Necesita ayuda para definir el alcance",
              score: { "gestion-de-riesgos": 2 },
            },
          ],
        },
      ],
    },
    {
      title: "¿Tiene proveedor actual? ¿Cuándo vence su contrato?",
      groups: [
        {
          id: "proveedor",
          summary: "Proveedor actual",
          options: [
            {
              id: "trimestre",
              label: "Sí, el contrato vence este trimestre",
              short: "Su contrato vence este trimestre",
            },
            { id: "anio", label: "Sí, el contrato vence este año", short: "Su contrato vence este año" },
            { id: "despues", label: "Sí, vence más adelante", short: "Su contrato vence más adelante" },
            { id: "no", label: "No aplica: no tengo proveedor actual", short: "Sin proveedor actual" },
          ],
        },
      ],
    },
  ],
};

/** Descripción de cada servicio si no hay texto del sector. */
export const serviceWhy: Record<ServiceSlug, string> = {
  "vigilancia-privada":
    "Oficiales de seguridad en puesto fijo o en rondas, con cada novedad anotada en el libro del puesto.",
  "control-de-acceso":
    "Registro de visitantes, proveedores y vehículos en cada ingreso, y control de salida de personal y materiales.",
  "sistemas-electronicos":
    "Cámaras HD con visión nocturna, cercado eléctrico y concertinas, instalados y mantenidos por SEDIN; monitoreo remoto según el servicio contratado.",
  "gestion-de-riesgos":
    "Evaluación de riesgos de su instalación para definir puestos, controles y prioridades.",
};

/** Texto de cada servicio según el sector (de `sectors.ts`, ya sin marcadores). */
export type SectorSchemes = Partial<Record<SectorSlug, Partial<Record<ServiceSlug, string>>>>;
