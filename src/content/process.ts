/**
 * Procesos por etapas, para `<Timeline>`. Sin horas exactas de turnos,
 * relevos ni visitas (revelarían los momentos más vulnerables del puesto):
 * solo etapas relativas.
 *
 * Frases con [MARCADOR]: ocultas en producción, resaltadas en revisión.
 */

export interface ProcessStage {
  id: string;
  title: string;
  text: readonly string[];
  /** Fuente interna (se muestra solo en modo revisión). */
  source?: string;
  /** Lo que recibe el cliente en este paso. */
  receives?: readonly string[];
  /** Plazo del paso; mientras sea un marcador, solo se ve en revisión. */
  plazo?: string;
}

/** «Así sabrá lo que pasa en su instalación» (propuesta, 4.2). */
export const reportTimeline = {
  id: "reporte",
  eyebrow: "Reporte",
  title: "Así sabrá lo que pasa en su instalación",
  caption: "Turnos y relevos según el esquema acordado con cada cliente.",
  stages: [
    {
      id: "antes-del-relevo",
      title: "Antes del relevo",
      text: [
        "El oficial llega con al menos 15 minutos de antelación para recibir las novedades del turno saliente.",
      ],
      source: "Art. 21",
    },
    {
      id: "relevo",
      title: "Relevo con entrega de novedades",
      text: [
        // «El oficial no deja el puesto hasta que llega su relevo» no se repite
        // aquí: la línea de tiempo va siempre junto a «Ningún puesto queda solo».
        "El relevo se hace en el puesto, con entrega de novedades y registro en el libro.",
      ],
      source: "Arts. 21 y 32",
    },
    {
      id: "durante-el-turno",
      title: "Durante el turno",
      text: [
        "Rondas, identificación de visitantes, proveedores y contratistas, y control de vehículos y materiales con sus formularios.",
      ],
      source: "Art. 32",
    },
    {
      id: "supervision",
      title: "Visita de supervisión",
      text: [
        "El supervisor verifica la asistencia, la puntualidad y las condiciones del puesto.",
        "[Las visitas son sin previo aviso y quedan firmadas en el libro. CONFIRMAR]",
      ],
      source: "Art. 19",
    },
    {
      id: "novedad",
      title: "Ante una novedad",
      text: [
        "Se registra en el libro con datos precisos y se informa al supervisor y, cuando corresponde, a la persona que usted designe.",
        "[Se avisa de inmediato a su contacto por teléfono o WhatsApp. CONFIRMAR REPORTE MÍNIMO]",
      ],
      source: "Arts. 14 y 32",
    },
    {
      id: "archivo",
      title: "Al completarse el libro",
      text: ["Se le entrega para su archivo, con reserva absoluta de su contenido."],
      source: "Art. 32",
    },
  ] satisfies ProcessStage[],
} as const;

/**
 * «De la inspección al primer turno» (propuesta, 4.10). Es lo que exige una
 * petrolera; sirve también para industria, servicios y /empresas. Los plazos
 * se añaden cuando SEDIN los confirme.
 */
export const onboarding = {
  id: "proceso",
  eyebrow: "Cómo empezamos",
  title: "De la inspección al primer turno",
  lead: "El camino de cada servicio nuevo, con lo que usted recibe en cada paso.",
  note: "[Los plazos de cada paso se publican cuando SEDIN los confirme.]",
  stages: [
    {
      id: "inspeccion",
      title: "Inspección del sitio",
      text: [
        "Visitamos su instalación y evaluamos accesos, perímetro y riesgos.",
        "[Sin costo y sin compromiso. CONFIRMAR]",
      ],
      receives: ["Una evaluación de lo que necesita proteger."],
      plazo: "[PLAZO PARA AGENDAR LA INSPECCIÓN]",
    },
    {
      id: "propuesta",
      title: "Propuesta escrita",
      text: [
        "Le enviamos una propuesta escrita con puestos, oficiales en rotación, supervisión, equipos y precio.",
      ],
      receives: ["Una propuesta que puede comparar punto por punto."],
      plazo: "[PLAZO DE PROPUESTA]",
    },
    {
      id: "firma",
      title: "Firma",
      text: [
        "Acordamos el esquema de turnos y relevos, los controles y los reportes, y se firma el contrato.",
      ],
      receives: ["El servicio acordado por escrito."],
    },
    {
      id: "acreditacion",
      title: "Selección y acreditación del personal",
      text: [
        "Seleccionamos al personal y lo acreditamos ante su empresa: inducción HSE, equipos de protección personal, pases y cumplimiento de sus normas internas.",
      ],
      receives: ["Personal acreditado según sus normas internas."],
      plazo: "[PLAZO DE ACREDITACIÓN]",
    },
    {
      id: "primer-turno",
      title: "Primer turno",
      text: [
        "El supervisor orienta a cada oficial en las órdenes y los procedimientos del puesto.",
        "[El supervisor está presente en el primer turno. CONFIRMAR]",
      ],
      receives: ["El libro de novedades abierto en su puesto desde el primer día."],
      source: "Arts. 14 y 19",
    },
  ] satisfies ProcessStage[],
} as const;
