import {
  BookIcon,
  ClipboardCheckIcon,
  FileTextIcon,
  GuardIcon,
  HeadsetIcon,
  IdCardIcon,
  MonitorIcon,
  RadioIcon,
  SearchIcon,
  ShieldCheckIcon,
  TargetIcon,
  UserCheckIcon,
  UsersIcon,
} from "@/components/icons";
import {
  cotizarHref,
  ctaLabels,
  hasPending,
  routes,
  showPending,
  waMessages,
  type CtaAction,
  type knowMoreLinks,
} from "@/config/site";
import { noArmado, ningunPuestoSolo, officerRequirements, quienResponde, trainingSyllabus } from "@/content/answers";
import type { FaqId } from "@/content/faq";
import type { SectorContent } from "@/content/sectors";
import type { Sentences } from "@/lib/pending";

/*
 * Servicios (propuesta 8.1). Una sola plantilla (ServiceTemplate) pinta los 4.
 *
 * Reglas de este archivo:
 * - Usted en el trato directo; impersonal en las descripciones; «nosotros»
 *   para la cercanía. Sin exclamaciones.
 * - Nada de «centro de control», «tiempo real», «protección total»,
 *   «máxima disuasión» ni «alta efectividad». Cámaras: «Cámaras HD con visión
 *   nocturna, instaladas y mantenidas por SEDIN; monitoreo remoto según el
 *   servicio contratado».
 * - Lo que SEDIN debe confirmar va entre [CORCHETES]: la frase no se publica
 *   en producción y se ve resaltada con NEXT_PUBLIC_SHOW_PENDING=1.
 * - Los hechos del reglamento interno SED-GC-PR-01 citan su artículo en
 *   `source` (solo visible en modo revisión).
 */

type Icon = typeof ShieldCheckIcon;
type SectorId = SectorContent["id"];
type KnowMoreKey = keyof typeof knowMoreLinks;

export type ServiceSlug =
  | "vigilancia-privada"
  | "control-de-acceso"
  | "sistemas-electronicos"
  | "gestion-de-riesgos";

/** Modalidad o línea del servicio (tarjetas de «Qué incluye»). */
export interface ServiceMode {
  /** Etiqueta corta sobre el título. */
  tag: string;
  title: string;
  text: string;
  /** Lo que lleva la modalidad (frases; las que tengan [MARCADOR] se ocultan). */
  points: readonly string[];
  source?: string;
}

/** Elemento con icono (lo que incluye, cómo lo hacemos). */
export interface ServiceFeature {
  Icon: Icon;
  title: string;
  text: Sentences;
  source?: string;
}

/** Punto de la pieza propia de cada servicio. */
export interface ServicePoint {
  title: string;
  text: Sentences;
  source?: string;
  link?: { label: string; href: string };
}

/** Pregunta propia del servicio (además de las de faq.ts). */
export interface ServiceFaq {
  id: string;
  question: string;
  answer: readonly string[];
  source?: string;
  link?: { label: string; href: string };
}

export interface ServiceContent {
  slug: ServiceSlug;
  /** Nombre corto (menú, ruta de navegación, enlaces). */
  name: string;
  /** Nombre completo (tarjetas del índice). */
  title: string;
  Icon: Icon;
  /** Resumen de una o dos líneas (tarjetas). */
  summary: string;
  /** Título y descripción de la página (SEO local, 15.3). Sin marcadores. */
  meta: { title: string; description: string };
  /** Titular de la portada (8.1); `highlight` va resaltado al final. */
  h1: { text: string; highlight?: string };
  lead: string;
  /** Mensaje que conecta (tabla «Mensajes que conectan»): abre «Qué incluye». */
  hook: { title: string; text: string };
  /** «Ficha del servicio» en vidrio, en la portada. */
  ficha: {
    modesLabel: string;
    modes: readonly string[];
    includes: readonly string[];
    note?: string;
  };
  /** «Qué incluye»: modalidades y lo que trae cada puesto o sistema. */
  includes: {
    modes: readonly ServiceMode[];
    /** Fila de iconos bajo las modalidades; vacía, no se pinta. */
    features: readonly ServiceFeature[];
  };
  /** «Para quién»: sectores donde se aplica (tarjetas enlazadas). */
  sectors: readonly SectorId[];
  /**
   * Texto de cada tarjeta de «Para quién». Por defecto, el porqué del
   * esquema del sector (`sector.scheme[].why`); aquí se sustituye cuando, en
   * la página del propio servicio, repetiría lo que ya dice la portada.
   */
  sectorWhy?: Partial<Record<SectorId, string>>;
  /** «Cómo lo hacemos y qué recibe» (libro, supervisión, reporte). */
  delivery: {
    title: string;
    lead: string;
    points: readonly ServiceFeature[];
  };
  /** Pieza propia del servicio (8.1). */
  spotlight: {
    eyebrow: string;
    title: string;
    lead?: Sentences;
    /** Fuente de la entradilla (solo en revisión). */
    source?: string;
    points?: readonly ServicePoint[];
    lists?: readonly { title: string; items: readonly string[]; source?: string }[];
    /** Fotos reales pendientes (solo se ven en revisión). */
    photos?: readonly string[];
    link?: { label: string; href: string };
  };
  /** Entradilla del bloque «¿Se imagina este servicio en su instalación?». */
  dimension: string;
  /** Pasos para empezar (por defecto, los de «De la inspección al primer turno»). */
  start?: readonly string[];
  /**
   * «¿De qué depende el precio?» propio del servicio. Por defecto, los
   * factores de 4.7 (pensados para la vigilancia: horas, puestos, oficiales).
   * `factors: []` oculta la lista; `notes` son frases de SEDIN pendientes.
   */
  price?: { factors?: readonly string[]; notes?: readonly string[]; closing?: string };
  /** Preguntas del servicio (faq.ts), en orden. */
  faqIds: readonly FaqId[];
  /** Preguntas propias del servicio, tras las de faq.ts. */
  faqs?: readonly ServiceFaq[];
  /** «Combínelo con». */
  related: readonly { slug: ServiceSlug; why: string }[];
  /** Tarjetas «Siga conociendo SEDIN» del siguiente paso. */
  nextLinks: readonly [KnowMoreKey, KnowMoreKey];
  /** Texto del botón contextual (8.1), que lleva a /cotizar/?servicio=<slug>. */
  ctaLabel: string;
  /** Botones: contextual (al diagnóstico) y WhatsApp precargado (11.3). */
  cta: CtaAction[];
  /** Mensaje precargado de WhatsApp (11.6). */
  whatsapp: string;
  /** Ubicación para los eventos de Umami («servicio-<slug>»). */
  ubicacion: string;
}

const ubicacion = (slug: ServiceSlug) => `servicio-${slug}`;

/** Botón contextual (al diagnóstico con el servicio) y WhatsApp precargado. */
function serviceActions(slug: ServiceSlug, label: string): CtaAction[] {
  return [
    {
      kind: "link",
      label,
      href: cotizarHref({ servicio: slug }),
      ubicacion: ubicacion(slug),
      event: "cta-cotizar",
    },
    {
      kind: "whatsapp",
      label: ctaLabels.whatsapp,
      message: waMessages.servicio[slug],
      ubicacion: ubicacion(slug),
    },
  ];
}

/** Frases comunes del libro y del reporte (art. 32; aviso: pendiente, 4.2). */
const LIBRO =
  "Foliado y rubricado: turno, supervisor, equipos del puesto, órdenes recibidas y cada novedad con datos de personas, vehículos y mercancías.";
const AVISO = "[Novedades relevantes: aviso inmediato a su contacto por teléfono o WhatsApp. CONFIRMAR REPORTE MÍNIMO]";

type ServiceData = Omit<ServiceContent, "cta" | "whatsapp" | "ubicacion">;

const serviceData: Record<ServiceSlug, ServiceData> = {
  /* ------------------------------------------------------------------ */
  "vigilancia-privada": {
    slug: "vigilancia-privada",
    name: "Vigilancia privada",
    title: "Vigilancia privada fija y móvil",
    Icon: GuardIcon,
    summary:
      "Oficiales de seguridad en puesto fijo o en rondas, supervisados en sitio y con libro de novedades en cada puesto.",
    meta: {
      title: "Vigilancia privada fija y móvil en Maracaibo",
      description:
        "Oficiales no armados en puesto fijo o en rondas para condominios, comercios, industria y petroleras del Zulia, con supervisión y libro de novedades.",
    },
    h1: { text: "Vigilancia privada fija y móvil en Maracaibo y el", highlight: "Zulia" },
    lead: "Oficiales de seguridad en puesto fijo o en rondas para condominios, comercios, industria e instalaciones petroleras. Servicio preventivo no armado, supervisado en sitio, con cada novedad en el libro del puesto.",
    hook: {
      title: "Presencia que se nota. Novedades que quedan por escrito.",
      text: "Oficiales uniformados en su instalación, que no dejan el puesto hasta que llega su relevo y anotan cada novedad en un libro que usted recibe para su archivo.",
    },
    ficha: {
      modesLabel: "Modalidades",
      modes: ["Vigilancia fija", "Vigilancia móvil"],
      includes: ["Libro de novedades foliado", "Radio de comunicación", "Supervisión en sitio"],
      note: "Preventivo, no armado",
    },
    includes: {
      modes: [
        {
          tag: "Puesto permanente",
          title: "Vigilancia fija",
          text: "Oficiales de seguridad asignados a un lugar determinado para proteger a las personas y los bienes que allí se encuentran: garitas, recepciones, accesos y áreas críticas.",
          points: [
            "Relevo en el puesto, con entrega de novedades y registro en el libro",
            "Identificación de visitantes, proveedores y contratistas",
            "Libro de novedades y formularios de control en el puesto",
          ],
          source: "Arts. 9, 21 y 32",
        },
        {
          tag: "Rondas y recorridos",
          title: "Vigilancia móvil",
          text: "Oficiales que protegen personas y bienes en un área o sector delimitado, con rondas por el perímetro y las áreas comunes para prevenir y detectar a tiempo.",
          points: [
            "Rondas por el perímetro, accesos y áreas comunes",
            "Verificación de puertas, luces y objetos hallados, anotados en el libro",
            "Comunicación por radio con el supervisor",
          ],
          source: "Arts. 9 y 32",
        },
      ],
      features: [
        {
          Icon: UserCheckIcon,
          title: "Oficiales formados",
          text: "Curso de Formación de Oficiales de Seguridad de 120 horas, aprobado por el INCES.",
          source: "Art. 28",
        },
        {
          Icon: ShieldCheckIcon,
          title: "Servicio no armado",
          text: "Protección preventiva: prevenir, detectar y avisar, sin armas de fuego en su instalación.",
          source: "Art. 4",
        },
        {
          Icon: RadioIcon,
          title: "Radio y formularios",
          text: "Equipos de comunicación, formularios de control y libro de novedades en cada puesto.",
          source: "Art. 14",
        },
        {
          Icon: IdCardIcon,
          title: "Uniforme de SEDIN",
          text: "Con el cargo, el logo, el nombre y el RIF de la empresa, fácil de reconocer.",
          source: "Art. 31",
        },
      ],
    },
    sectors: ["condominios", "comercio-y-oficinas", "industria-y-logistica", "petroleo-y-energia"],
    delivery: {
      title: "Cada turno, supervisado y por escrito",
      lead: "Lo que usted recibe en cada puesto, desde el primer turno.",
      points: [
        {
          Icon: BookIcon,
          title: "Libro de novedades",
          text: [LIBRO, "Al completarse, se le entrega para su archivo, con reserva absoluta de su contenido."],
          source: "Art. 32",
        },
        {
          Icon: UserCheckIcon,
          title: "Supervisión en sitio",
          text: [
            "Los supervisores verifican a diario la asistencia y la puntualidad, inspeccionan el servicio y analizan los riesgos del puesto.",
            "[Visitas sin previo aviso, también de noche y los fines de semana. CONFIRMAR]",
          ],
          source: "Art. 19",
        },
        {
          Icon: FileTextIcon,
          title: "Reporte de novedades",
          text: [
            "Cada novedad queda escrita con datos precisos, y el libro es un elemento probatorio en asuntos laborales, comerciales o judiciales.",
            AVISO,
            "[Resumen mensual: asistencia, relevos, visitas de supervisión y novedades. CONFIRMAR]",
          ],
          source: "Art. 32",
        },
      ],
    },
    /* La supervisión ya está en «Cómo lo hacemos»: aquí, las otras dudas que deciden la compra. */
    spotlight: {
      eyebrow: "Antes de contratar",
      title: "Lo que más se pregunta antes de contratar vigilancia",
      lead: "Las respuestas de SEDIN a las dudas que más pesan al elegir una empresa de vigilancia.",
      points: [
        {
          title: ningunPuestoSolo.question,
          text: ningunPuestoSolo.body,
          source: ningunPuestoSolo.source,
          link: ningunPuestoSolo.link,
        },
        {
          title: noArmado.question,
          text: noArmado.body,
          source: noArmado.source,
        },
        {
          // «¿Quién responde…?» solo con la póliza publicada (como en faq.ts): si no, la respuesta solo cuenta la investigación.
          title:
            showPending || !hasPending(quienResponde.points[0].text[0])
              ? "¿Quién responde si hay un hurto?"
              : "¿Qué pasa si hay un hurto?",
          text: quienResponde.points[0].text,
          source: quienResponde.points[0].source,
        },
      ],
    },
    dimension: "Un asesor lo dimensiona con usted: puestos, oficiales y controles.",
    /* Sin las que ya responden la pieza propia, «Cómo lo hacemos» y la tarjeta de precio. */
    faqIds: ["relevo", "uniforme", "mismos-oficiales", "cambio-oficial", "zonas"],
    related: [
      {
        slug: "control-de-acceso",
        why: "Registro de personas, vehículos y materiales en cada ingreso y cada salida.",
      },
      {
        slug: "sistemas-electronicos",
        why: "Cámaras con visión nocturna, cercado eléctrico y concertinas para reforzar el perímetro.",
      },
      {
        slug: "gestion-de-riesgos",
        why: "Una evaluación previa para saber cuántos puestos necesita y dónde.",
      },
    ],
    nextLinks: ["comoTrabajamos", "sectores"],
    ctaLabel: "Cotizar oficiales para mi instalación",
  },

  /* ------------------------------------------------------------------ */
  "control-de-acceso": {
    slug: "control-de-acceso",
    name: "Control de acceso",
    title: "Control de acceso y salida de personal",
    Icon: IdCardIcon,
    summary:
      "Identificación y registro en cada ingreso, e inspección de personal, equipos y materiales en cada salida.",
    meta: {
      title: "Control de acceso y salida de personal en Maracaibo",
      description:
        "Control de acceso de personas, visitantes, contratistas y vehículos, e inspección de la salida de personal, equipos y materiales en Maracaibo y el Zulia.",
    },
    h1: { text: "Control de acceso y salida de personal en", highlight: "Maracaibo" },
    lead: "Identificación y registro de personas y vehículos en cada ingreso, e inspección del personal, los equipos y los materiales que salen de su instalación, según los procedimientos de su empresa.",
    hook: {
      title: "Cada ingreso controlado es un riesgo menos para su empresa.",
      text: "¿Sabe quién entró anoche a su instalación? Con SEDIN, queda escrito: personas, vehículos y materiales, en cada entrada y en cada salida.",
    },
    ficha: {
      modesLabel: "Modalidades",
      modes: ["Control de ingreso", "Control de salida"],
      includes: ["Formularios de control", "Detector de metales", "Libro de novedades"],
      note: "Según los procedimientos de su empresa",
    },
    includes: {
      modes: [
        {
          tag: "Personas y vehículos",
          title: "Control de ingreso",
          text: "Identificación y registro de empleados, visitantes, proveedores, contratistas y vehículos en cada ingreso, conforme a los procedimientos de acceso de su empresa.",
          points: [
            "Carnet o credencial por categoría, cuando su empresa los use",
            "Registro de entrada y salida de personal, visitantes y vehículos",
            "Revisión de los vehículos de carga con su formulario de control",
          ],
          source: "Art. 32",
        },
        {
          tag: "Personal, equipos y materiales",
          title: "Control de salida",
          text: "Inspección del personal y de los bienes que salen de sus instalaciones, con apoyo de detector de metales y según los protocolos acordados con su empresa.",
          points: [
            "Notas de entrada o salida de materiales",
            "Control de entrada y salida de herramientas y equipos",
            "Resguardo y registro de cualquier salida sin autorización",
          ],
          source: "Art. 32",
        },
      ],
      features: [
        {
          Icon: SearchIcon,
          title: "Inspección ordenada",
          text: "Revisión de personas, vehículos y bienes con los criterios acordados con su empresa.",
        },
        {
          Icon: ClipboardCheckIcon,
          title: "Formularios de control",
          text: "Entrada y salida de personal, visitantes, vehículos, herramientas y equipos.",
          source: "Art. 32",
        },
        {
          Icon: ShieldCheckIcon,
          title: "Detector de metales",
          text: "Apoyo para la inspección del personal en la salida.",
        },
        {
          Icon: UsersIcon,
          title: "Trato profesional",
          text: "Atención cortés a su personal, visitantes y contratistas, sin discusiones en la puerta.",
          source: "Art. 32",
        },
      ],
    },
    sectors: ["petroleo-y-energia", "industria-y-logistica", "comercio-y-oficinas", "condominios"],
    delivery: {
      title: "Cada ingreso y cada salida, por escrito",
      lead: "Lo que queda registrado en su puesto de control y lo que usted recibe.",
      points: [
        {
          Icon: BookIcon,
          title: "Formularios y libro",
          text: [
            "Formularios de entrada y salida de personal, visitantes, vehículos, herramientas y equipos, y notas de entrada o salida de materiales.",
            "Las novedades quedan en el libro foliado del puesto, que se le entrega al completarse.",
          ],
          source: "Art. 32",
        },
        {
          Icon: UserCheckIcon,
          title: "Supervisión",
          text: "El supervisor entrena a los oficiales en las órdenes de servicio del puesto y verifica que las conocen y las cumplen.",
          source: "Art. 19",
        },
        {
          Icon: FileTextIcon,
          title: "Reporte",
          text: [
            "Una salida sin autorización se resguarda, se describe en el libro con los datos de la persona y se informa al supervisor y a quien su empresa designe.",
            AVISO,
          ],
          source: "Art. 32",
        },
      ],
    },
    spotlight: {
      eyebrow: "Quién controla su acceso",
      title: "Oficiales seleccionados y formados para controlar accesos",
      lead: "Antes de entrar a su instalación, cada oficial cumple estos requisitos. El curso incluye el control de acceso de personas y la recepción y salida de materiales.",
      lists: [
        { title: "Requisitos de ingreso de cada oficial", items: officerRequirements, source: "Art. 25" },
        { title: "Temario del curso de 120 horas", items: trainingSyllabus, source: "Art. 28" },
      ],
      link: { label: "Conozca a SEDIN", href: routes.about },
    },
    dimension: "Un asesor lo dimensiona con usted: accesos, horarios, formularios y equipos de inspección.",
    /*
     * Sin las que ya responden la pieza propia (requisitos y temario), «Cómo
     * lo hacemos» (libro y salida sin autorización) y la tarjeta de precio.
     */
    faqIds: ["acreditacion-hse", "quien-responde-hurto", "zonas"],
    faqs: [
      {
        id: "procedimientos-acceso",
        question: "¿Se adaptan a nuestros procedimientos de acceso?",
        answer: [
          "Sí. Antes de empezar, se acuerdan con su empresa los controles de ingreso, salida e inspección, y con su personal de despacho, los criterios para los vehículos de carga.",
        ],
        source: "Art. 32",
      },
    ],
    related: [
      {
        slug: "vigilancia-privada",
        why: "Oficiales en el resto de la instalación y rondas por el perímetro.",
      },
      {
        slug: "sistemas-electronicos",
        why: "Cámaras HD con visión nocturna en accesos y andenes, para completar el registro.",
      },
    ],
    nextLinks: ["comoTrabajamos", "empresas"],
    ctaLabel: "Diseñar mi control de acceso",
  },

  /* ------------------------------------------------------------------ */
  "sistemas-electronicos": {
    slug: "sistemas-electronicos",
    name: "Sistemas electrónicos",
    title: "Sistemas de seguridad electrónica",
    Icon: MonitorIcon,
    summary: "Cámaras HD con visión nocturna, cercado eléctrico y concertinas para su perímetro.",
    meta: {
      title: "Cámaras, cercado eléctrico y concertinas en el Zulia",
      description:
        "Cámaras HD con visión nocturna instaladas y mantenidas por SEDIN, cercado eléctrico y concertinas para el perímetro, en Maracaibo y el Zulia.",
    },
    h1: { text: "Cámaras, cercado eléctrico y concertinas en el", highlight: "Zulia" },
    lead: "Cámaras HD con visión nocturna, instaladas y mantenidas por SEDIN; monitoreo remoto según el servicio contratado. Cercado eléctrico y concertinas para los tramos más expuestos de su perímetro.",
    hook: {
      title: "Lo que pasa de noche también se ve.",
      text: "Cámaras que distinguen de día y de noche, y un perímetro reforzado donde más se necesita. Cada equipo, ubicado según la inspección de su instalación.",
    },
    ficha: {
      modesLabel: "Soluciones",
      modes: ["Cámaras HD con visión nocturna", "Cercado eléctrico y concertinas"],
      /* El monitoreo remoto ya se dice en la entradilla de la portada (una sola vez). */
      includes: ["Instalación y mantenimiento por SEDIN", "Ubicación definida en la inspección del sitio"],
    },
    includes: {
      modes: [
        {
          tag: "Videovigilancia",
          title: "Cámaras HD con visión nocturna",
          text: "En accesos, perímetro y áreas críticas, para ver lo que pasa en su instalación de día y de noche.",
          points: [
            "Ubicación de cada cámara definida en la inspección del sitio",
            "Instaladas y mantenidas por SEDIN",
            "[Grabación y tiempo de conservación de las imágenes. CONFIRMAR]",
          ],
        },
        {
          tag: "Perímetro",
          title: "Cercado eléctrico y concertinas",
          text: "Cercado eléctrico y concertinas en los tramos más expuestos de muros y cercas, para dificultar el paso por el perímetro.",
          points: [
            "Tramos definidos en la inspección del sitio",
            "Refuerzo de muros, cercas y portones",
            "[Mantenimiento y revisión del cercado eléctrico. CONFIRMAR]",
          ],
        },
      ],
      /* Sin fila de iconos: repetía las modalidades y la frase del monitoreo. */
      features: [],
    },
    sectors: ["industria-y-logistica", "petroleo-y-energia", "comercio-y-oficinas", "condominios"],
    /* Sin repetir «Cámaras HD con visión nocturna» en cada tarjeta: solo dónde se aplica. */
    sectorWhy: {
      "industria-y-logistica": "En accesos, andenes y perímetro, con cercado eléctrico y concertinas donde haga falta.",
      "petroleo-y-energia": "Cercado eléctrico y concertinas en los tramos más expuestos del perímetro.",
      "comercio-y-oficinas": "En accesos, estacionamientos y áreas comunes.",
      condominios: "Cercado eléctrico y concertinas para reforzar el perímetro del conjunto.",
    },
    delivery: {
      title: "Instalados y mantenidos por SEDIN",
      lead: "Los equipos apoyan el trabajo del servicio de vigilancia: la base de control está en el propio servicio.",
      points: [
        {
          Icon: TargetIcon,
          title: "Instalación a la medida",
          text: "Cámaras y tramos de cercado o concertina ubicados según la inspección de su instalación, donde más se necesitan.",
        },
        {
          Icon: BookIcon,
          title: "Atendido en el puesto",
          text: "Cuando el servicio incluye oficiales, lo que muestran los equipos se atiende en el puesto y las novedades quedan escritas en el libro.",
          source: "Arts. 32 y 36",
        },
        {
          Icon: RadioIcon,
          title: "Aviso al supervisor",
          text: "Cada puesto cuenta con equipos de radiocomunicación para avisar al supervisor.",
          source: "Arts. 14 y 36",
        },
        {
          Icon: ShieldCheckIcon,
          title: "Mantenimiento y avisos",
          text: [
            "[Frecuencia del mantenimiento preventivo y garantía de los equipos. CONFIRMAR]",
            "[Cómo se avisa una novedad detectada por las cámaras y acceso del cliente a las grabaciones. CONFIRMAR]",
          ],
        },
      ],
    },
    /* Solo fotos reales pendientes: en producción la pieza no se pinta. */
    spotlight: {
      eyebrow: "En su instalación",
      title: "Así se ven los equipos instalados",
      photos: [
        "Cámaras instaladas por SEDIN en la instalación de un cliente (con su permiso)",
        "Tramo de cercado eléctrico y concertina instalado por SEDIN",
      ],
    },
    dimension: "Un asesor lo dimensiona con usted: cuántas cámaras, dónde y qué tramos del perímetro reforzar.",
    start: ["Inspección del sitio", "Propuesta escrita", "Firma", "Instalación de los equipos", "Puesta en marcha"],
    /* Los factores de 4.7 (puestos, oficiales en rotación) son de la vigilancia. */
    price: {
      factors: [
        "Cuántas cámaras y dónde se ubican",
        "Qué tramos del perímetro se refuerzan con cercado eléctrico o concertinas",
        "Forma de pago",
      ],
      notes: ["[La inspección y la propuesta no tienen costo. CONFIRMAR]", "[Propuesta escrita con precio cerrado por VIGENCIA DE LA OFERTA.]"],
    },
    faqIds: ["inspeccion-costo", "zonas"],
    faqs: [
      {
        id: "camaras-quien-revisa",
        question: "¿Quién revisa las cámaras?",
        answer: [
          "Cuando el servicio incluye oficiales, lo que muestran las cámaras se atiende en el puesto y se anota en el libro.",
          "El monitoreo remoto se define según el servicio contratado.",
          "[Quién revisa las cámaras, en qué horario y cómo se avisa una novedad. CONFIRMAR]",
        ],
        source: "Arts. 32 y 36",
      },
      {
        id: "camaras-grabaciones",
        question: "¿Puedo ver las grabaciones?",
        answer: ["[Acceso del cliente a las imágenes y tiempo de conservación de las grabaciones. CONFIRMAR]"],
      },
      {
        id: "cercado-normas",
        question: "¿Qué normas cumple el cercado eléctrico?",
        answer: ["[Señalización y normas que cumple la instalación del cercado eléctrico. CONFIRMAR]"],
      },
    ],
    related: [
      {
        slug: "vigilancia-privada",
        why: "Oficiales en sitio que atienden lo que muestran los equipos y lo anotan en el libro.",
      },
      {
        slug: "gestion-de-riesgos",
        why: "Una evaluación para ubicar cámaras y tramos de cercado donde más se necesitan.",
      },
    ],
    nextLinks: ["sectores", "faq"],
    ctaLabel: "Evaluar mis cámaras y mi perímetro",
  },

  /* ------------------------------------------------------------------ */
  "gestion-de-riesgos": {
    slug: "gestion-de-riesgos",
    name: "Gestión de riesgos",
    title: "Gestión de riesgos y consultoría",
    Icon: TargetIcon,
    summary: "Evaluación de riesgos en sitio y asesoría para definir puestos, controles y equipos.",
    meta: {
      title: "Gestión de riesgos de seguridad en el Zulia",
      description:
        "Evaluación de riesgos en sitio y consultoría de seguridad para empresas e instalaciones petroleras del Zulia, con un esquema de puestos, controles y equipos.",
    },
    h1: { text: "Gestión de riesgos y consultoría de seguridad en el", highlight: "Zulia" },
    lead: "Evaluación de riesgos de su instalación y asesoría para definir el esquema de seguridad que necesita: puestos, controles de acceso y sistemas electrónicos.",
    hook: {
      title: "Antes de contratar, sepa qué necesita proteger.",
      text: "Una evaluación en sitio para invertir en los puestos, controles y equipos que su instalación necesita, y no en los que sobran.",
    },
    ficha: {
      modesLabel: "Servicios",
      modes: ["Análisis de riesgos", "Consultoría y asesoría"],
      includes: ["Evaluación en sitio", "Riesgos priorizados", "Esquema recomendado"],
    },
    includes: {
      modes: [
        {
          tag: "Diagnóstico",
          title: "Análisis de riesgos",
          text: "Evaluación de instalaciones, accesos, perímetro y operación para identificar riesgos y priorizar las medidas de prevención.",
          points: [
            "Recorrido de la instalación con su responsable",
            "Accesos, perímetro, iluminación y puntos de pérdida",
            "Riesgos ordenados según su impacto",
          ],
        },
        {
          tag: "Plan de seguridad",
          title: "Consultoría y asesoría",
          text: "Asesoría para definir el esquema de seguridad adecuado: modalidades de vigilancia, control de acceso y sistemas electrónicos.",
          points: [
            "Esquema de puestos, controles y equipos",
            "Órdenes de servicio y procedimientos escritos",
            "Acompañamiento en la puesta en marcha",
          ],
          source: "Art. 1 (consultoría y asesoría)",
        },
      ],
      /* Sin fila de iconos: repetía «Cómo lo hacemos» y «Qué recibe tras la evaluación». */
      features: [],
    },
    sectors: ["petroleo-y-energia", "industria-y-logistica", "comercio-y-oficinas"],
    delivery: {
      title: "Una evaluación que termina en decisiones",
      lead: "Cómo se hace la evaluación y quién la respalda.",
      points: [
        {
          Icon: SearchIcon,
          title: "Evaluación en sitio",
          text: [
            "Recorremos su instalación: accesos, perímetro, iluminación y operación, y escuchamos lo que le preocupa.",
            "[Quién hace la evaluación (cargo) y cuánto dura la visita. CONFIRMAR]",
          ],
        },
        {
          Icon: UserCheckIcon,
          title: "Criterio operativo",
          text: "El análisis de los riesgos de cada puesto es parte del trabajo diario de nuestros supervisores.",
          source: "Art. 19",
        },
        {
          Icon: HeadsetIcon,
          title: "Acompañamiento y seguimiento",
          text: [
            "Le acompañamos en la puesta en marcha y revisamos los resultados con usted.",
            "[Frecuencia de las reuniones de seguimiento. CONFIRMAR]",
          ],
        },
      ],
    },
    spotlight: {
      eyebrow: "Qué recibe",
      title: "Qué recibe tras la evaluación",
      lead: "Una evaluación sirve si termina en un plan. Esto es lo que usted se lleva.",
      points: [
        {
          title: "Riesgos priorizados",
          text: [
            "Los riesgos identificados en su instalación, ordenados según su impacto en la operación.",
            "[Se entregan en un informe escrito. CONFIRMAR ENTREGABLE]",
          ],
        },
        {
          title: "Un esquema recomendado",
          text: "Puestos, controles de acceso y sistemas electrónicos, con el porqué de cada uno.",
        },
        {
          title: "Procedimientos por escrito",
          text: "Si contrata el servicio, cada puesto recibe sus órdenes de servicio y los procedimientos para actuar en casos específicos.",
          source: "Art. 19",
        },
        {
          title: "¿Tiene costo la evaluación?",
          text: "[COSTO DE LA EVALUACIÓN: sin costo o incluido en la propuesta. CONFIRMAR]",
        },
      ],
    },
    dimension: "Un asesor coordina con usted la visita a su instalación y le explica qué incluye la evaluación.",
    start: ["Primer contacto", "Visita a su instalación", "Análisis de riesgos", "Recomendaciones", "Seguimiento"],
    /* Una consultoría no se cotiza por puestos ni por horas de cobertura: sin lista ni cifras. */
    price: { factors: [], notes: [], closing: "Todo se define en la visita a su instalación." },
    /* «¿Qué recibo tras la evaluación?» ya lo responde la pieza propia. */
    faqIds: ["inspeccion-costo", "propuesta-incluye", "sistema-gestion", "zonas"],
    faqs: [
      {
        id: "evaluacion-compromiso",
        question: "¿Tengo que contratar a SEDIN después de la evaluación?",
        answer: ["[La evaluación no le obliga a contratar. CONFIRMAR]"],
      },
    ],
    related: [
      {
        slug: "vigilancia-privada",
        why: "Oficiales en puesto fijo o en rondas donde la evaluación lo indique.",
      },
      {
        slug: "control-de-acceso",
        why: "Control de ingreso y salida de personas, vehículos y materiales.",
      },
      {
        slug: "sistemas-electronicos",
        why: "Cámaras, cercado eléctrico y concertinas en los puntos críticos.",
      },
    ],
    nextLinks: ["empresas", "comoTrabajamos"],
    ctaLabel: "Solicitar evaluación de riesgos",
  },
};

const order: readonly ServiceSlug[] = [
  "vigilancia-privada",
  "control-de-acceso",
  "sistemas-electronicos",
  "gestion-de-riesgos",
];

/** Los 4 servicios, en el orden del menú. */
export const servicesContent: ServiceContent[] = order.map((slug) => ({
  ...serviceData[slug],
  cta: serviceActions(slug, serviceData[slug].ctaLabel),
  whatsapp: waMessages.servicio[slug],
  ubicacion: ubicacion(slug),
}));

export function getService(slug: string): ServiceContent | undefined {
  return servicesContent.find((s) => s.slug === slug);
}

/**
 * «Lo que le preocupa, resuelto» (8.1): el índice por problema de
 * /servicios. Cada tarjeta lleva al servicio que lo resuelve.
 */
export const serviceConcerns: readonly { worry: string; solution: string; service: ServiceSlug }[] = [
  {
    worry: "Entra quien no debe",
    solution: "Control de acceso de personas, visitantes, contratistas y vehículos, con registro en cada ingreso.",
    service: "control-de-acceso",
  },
  {
    worry: "Salen materiales sin revisar",
    solution: "Control de salida de personal, equipos y materiales, con detector de metales y formularios.",
    service: "control-de-acceso",
  },
  {
    worry: "El perímetro es fácil de saltar",
    solution: "Cercado eléctrico y concertinas en los tramos más expuestos de muros y cercas.",
    service: "sistemas-electronicos",
  },
  {
    worry: "No sé qué pasa de noche",
    solution: "Cámaras HD con visión nocturna; monitoreo remoto según el servicio contratado.",
    service: "sistemas-electronicos",
  },
  {
    worry: "Necesito oficiales en sitio",
    solution: "Vigilancia fija o móvil, supervisada en sitio y con libro de novedades en cada puesto.",
    service: "vigilancia-privada",
  },
  {
    worry: "No sé por dónde empezar",
    solution: "Evaluación de riesgos de su instalación y un esquema recomendado de puestos, controles y equipos.",
    service: "gestion-de-riesgos",
  },
];

/**
 * @deprecated Resumen anterior del catálogo; se mantiene por compatibilidad.
 * Use `servicesContent` (`title`, `Icon`, `summary`, `ficha.includes`).
 */
export const serviceCatalog = Object.fromEntries(
  servicesContent.map((s) => [
    s.slug,
    { title: s.title, Icon: s.Icon, summary: s.summary, includes: [...s.ficha.includes] },
  ]),
) as Record<ServiceSlug, { title: string; Icon: Icon; summary: string; includes: string[] }>;
