import {
  BuildingIcon,
  FactoryIcon,
  HomeIcon,
  OilRigIcon,
} from "@/components/icons";
import {
  audienceActions,
  routes,
  sectorNav,
  sectorSlugs,
  waMessages,
  type Audience,
  type CtaAction,
  type SectorSlug,
} from "@/config/site";
import { qualitySystem, unarmedStatement, noArmado, type AnswerId } from "@/content/answers";
import type { FaqId } from "@/content/faq";
import type { ServiceContent } from "@/content/services";

type Icon = typeof FactoryIcon;
type ServiceSlug = ServiceContent["slug"];

export interface SectorPoint {
  title: string;
  text: readonly string[];
  /** Fuente interna (solo en modo revisión). */
  source?: string;
  link?: { label: string; href: string };
}

export interface SectorContent {
  /** Slug de la ruta (/sectores/<id>) y ancla. */
  id: SectorSlug;
  /** Nombre completo (menú, ruta de navegación, títulos). */
  title: string;
  /** Nombre corto para espacios estrechos (chips, barra móvil). */
  shortTitle: string;
  /** Tarjeta del selector «¿Qué necesita proteger?» de Inicio (7.2). */
  selector: { label: string; services: string };
  Icon: Icon;
  audience: Audience;
  /** Título y descripción de la página (SEO, 15.3). */
  meta: { title: string; description: string };
  /** Titular de la portada; `highlight` va en color al final. */
  h1: { text: string; highlight?: string };
  lead: string;
  /** Mensaje que conecta (tabla «Mensajes que conectan»). */
  hook: { title: string; text: string };
  /** Resumen de una línea (tarjetas). */
  text: string;
  /** Riesgos típicos del sector. */
  pains: readonly { title: string; text: string }[];
  /** Esquema recomendado: servicios enlazados y por qué. */
  scheme: readonly { service: ServiceSlug; why: string }[];
  /** @deprecated Derivado de `scheme`; se mantiene por compatibilidad. */
  services: ServiceSlug[];
  /** Instalaciones típicas (lista corta). */
  focus: readonly string[];
  /** Pieza propia del sector (propuesta, 8.2). */
  spotlight: {
    eyebrow: string;
    title: string;
    lead?: string;
    points: readonly SectorPoint[];
  };
  /** Respuestas de la sección 4 que aparecen en este sector (4.11). */
  answerIds: readonly AnswerId[];
  /** Preguntas del sector (en orden). */
  faqIds: readonly FaqId[];
  /** Botones según la audiencia: principal, secundario y tercero (11.3). */
  cta: CtaAction[];
  /** Mensaje precargado de WhatsApp (11.6). */
  whatsapp: string;
  /** Ubicación para los eventos de Umami («sector-<slug>»). */
  ubicacion: string;
  /**
   * Foto generada con IA, solo como ambientación (nunca «nuestro equipo»).
   * `position`: clase `object-[…]` para recortes. `portrait`: recorte vertical
   * 3:4 centrado en el oficial, para las tarjetas 2×2 del móvil. `review`:
   * nota para el modo revisión.
   */
  photo: { src: string; alt: string; position?: string; portrait?: string; review?: string };
}

const ubicacion = (slug: SectorSlug) => `sector-${slug}`;

/** Ningún puesto queda solo, reporte y personal: en todos los sectores (4.11). */
const commonAnswers = ["ningun-puesto-solo", "reporte", "quien-protege", "precio", "contrato", "kit"] as const;

const sectorData: Record<SectorSlug, Omit<SectorContent, "services">> = {
  "petroleo-y-energia": {
    id: "petroleo-y-energia",
    title: sectorNav["petroleo-y-energia"].label,
    shortTitle: "Petróleo",
    selector: {
      label: "Instalación petrolera o de energía",
      services: "Control de acceso y salida, vigilancia fija y perímetro",
    },
    Icon: OilRigIcon,
    audience: "empresa",
    meta: {
      title: "Vigilancia para instalaciones petroleras en el Zulia",
      description:
        "Control de acceso y salida de personal, equipos y materiales, vigilancia fija y protección perimetral no armada para instalaciones petroleras del Zulia.",
    },
    h1: { text: "Seguridad para instalaciones petroleras y de energía del", highlight: "Zulia" },
    lead: "Control de acceso y salida de personal, equipos y materiales, vigilancia fija y protección perimetral, con procedimientos escritos y supervisión en sitio.",
    hook: {
      title: "Su operación no se detiene. Su seguridad tampoco.",
      text: "Cada turno empieza con un relevo en el puesto y cada novedad queda escrita en el libro. Mientras su equipo produce, SEDIN controla quién y qué entra y sale de su instalación.",
    },
    text: "Control de acceso y salida de personal, equipos y materiales, vigilancia fija y protección perimetral.",
    pains: [
      {
        title: "Salida de equipos y materiales",
        text: "Herramientas, repuestos y materiales que salen sin revisión ni registro.",
      },
      {
        title: "Contratistas en cada turno",
        text: "Personal externo que entra y sale, y que debe identificarse, registrarse y cumplir sus normas internas.",
      },
      {
        title: "Perímetros extensos",
        text: "Patios, estaciones y cercos largos, con zonas poco iluminadas de noche.",
      },
      {
        title: "Exigencias del contratante",
        text: "Procedimientos, inducciones y documentos que HSE y compras piden a cada proveedor.",
      },
    ],
    scheme: [
      {
        service: "control-de-acceso",
        why: "Identificación y registro de personal, contratistas y vehículos, y control de salida de herramientas, equipos y materiales con sus formularios.",
      },
      {
        service: "vigilancia-privada",
        why: "Oficiales en puestos fijos en accesos, patios y áreas críticas, con rondas por el perímetro.",
      },
      {
        service: "sistemas-electronicos",
        why: "Cámaras HD con visión nocturna, cercado eléctrico y concertinas en los tramos más expuestos; monitoreo remoto según el servicio contratado.",
      },
      {
        service: "gestion-de-riesgos",
        why: "Evaluación de riesgos de la instalación para definir puestos, controles y prioridades.",
      },
    ],
    focus: ["Campos, estaciones y patios de equipos", "Plantas e instalaciones de energía"],
    spotlight: {
      eyebrow: "Procedimientos y cumplimiento",
      title: "Lo que su departamento de HSE y compras va a pedir",
      lead: "Procedimientos escritos, personal acreditado y documentos de proveedor.",
      points: [
        {
          title: "Control de salida con formularios",
          text: [
            "Formularios de control de entrada y salida de materiales, herramientas y equipos en cada puesto, y control de vehículos de carga desde su llegada hasta su salida.",
          ],
          source: "Art. 32",
        },
        {
          title: "Acreditación ante su empresa",
          text: [
            "Inducción HSE, equipos de protección personal, pases y cumplimiento de sus normas internas antes del primer turno.",
          ],
          link: { label: "Ver de la inspección al primer turno", href: `${routes.comoTrabajamos}#proceso` },
        },
        {
          title: qualitySystem.title,
          text: [qualitySystem.text],
          link: qualitySystem.link,
        },
        {
          title: "Supervisión en la Costa Oriental del Lago",
          text: ["[CONFIRMAR COBERTURA Y SUPERVISIÓN EN LA COSTA ORIENTAL DEL LAGO]"],
        },
      ],
    },
    answerIds: [...commonAnswers, "inspeccion-primer-turno"],
    faqIds: [
      "falta-oficial",
      "como-sabre",
      "quien-entra",
      "acreditacion-hse",
      "inspeccion-primer-turno",
      "kit-proveedor",
      "sistema-gestion",
      "precio",
      "contrato-pago",
    ],
    cta: audienceActions("empresa", {
      ubicacion: ubicacion("petroleo-y-energia"),
      sector: "petroleo-y-energia",
    }),
    whatsapp: waMessages.sector["petroleo-y-energia"],
    ubicacion: ubicacion("petroleo-y-energia"),
    photo: {
      src: "/assets/sectores/petroleo-y-energia.webp",
      portrait: "/assets/sectores/petroleo-y-energia-3x4.webp",
      alt: "Imagen ilustrativa: oficial de seguridad junto al cerco perimetral de un campo petrolero a orillas del Lago de Maracaibo, con balancines y torres al atardecer.",
    },
  },

  "industria-y-logistica": {
    id: "industria-y-logistica",
    title: sectorNav["industria-y-logistica"].label,
    shortTitle: "Industria",
    selector: {
      label: "Planta, almacén o galpón",
      services: "Control de salida de mercancía, accesos y cámaras",
    },
    Icon: FactoryIcon,
    audience: "empresa",
    meta: {
      title: "Seguridad para plantas, almacenes y galpones en el Zulia",
      description:
        "Control de salida de materiales y mercancía, accesos de proveedores y contratistas, vigilancia y cámaras con visión nocturna para plantas y almacenes del Zulia.",
    },
    h1: { text: "Seguridad para plantas, almacenes y galpones del", highlight: "Zulia" },
    lead: "Control de salida de materiales y mercancía, accesos de proveedores y contratistas, perímetro y cámaras con visión nocturna.",
    hook: {
      title: "Cada ingreso controlado es un riesgo menos para su empresa.",
      text: "Proveedores, camiones y contratistas se identifican y se registran, y lo que sale se revisa con su formulario. Cada novedad queda escrita en el libro del puesto, con datos de personas, vehículos y mercancías.",
    },
    text: "Control de salida de materiales y mercancía, accesos de proveedores y contratistas, y cámaras con visión nocturna.",
    pains: [
      {
        title: "Mercancía que sale sin revisar",
        text: "Materiales y productos que salen sin nota de salida ni conteo.",
      },
      {
        title: "Camiones, proveedores y contratistas",
        text: "Ingresos constantes que hay que identificar y registrar sin frenar la operación.",
      },
      {
        title: "Galpones y patios de noche",
        text: "Áreas amplias, poco transitadas y con poca luz fuera del horario laboral.",
      },
      {
        title: "Pérdidas sin explicación",
        text: "Sin registro, nadie puede reconstruir qué pasó ni cuándo.",
      },
    ],
    scheme: [
      {
        service: "control-de-acceso",
        why: "Control de salida de materiales y mercancía con formularios y detector de metales, y registro de proveedores, contratistas y vehículos.",
      },
      {
        service: "vigilancia-privada",
        why: "Oficiales en accesos y andenes, y rondas por galpones y patios.",
      },
      {
        service: "sistemas-electronicos",
        why: "Cámaras HD con visión nocturna en accesos, andenes y perímetro; cercado eléctrico y concertinas donde haga falta.",
      },
      {
        service: "gestion-de-riesgos",
        why: "Evaluación de los puntos de pérdida para ubicar puestos y controles.",
      },
    ],
    focus: ["Plantas, almacenes y galpones", "Centros de distribución y patios de carga"],
    spotlight: {
      eyebrow: "Control de salida",
      title: "Control de salida con formularios",
      lead: "Lo que entra y sale de su planta, revisado y registrado en el puesto.",
      points: [
        {
          title: "Formularios de control",
          text: [
            "Notas de entrada o salida de materiales y control de entrada y salida de herramientas y equipos, en cada puesto.",
          ],
          source: "Art. 32",
        },
        {
          title: "Vehículos de carga",
          text: [
            "Cada vehículo de carga lleva su formulario de control, con la información desde su llegada hasta su salida y el conteo de la revisión.",
          ],
          source: "Art. 32",
        },
        {
          title: "Detector de metales",
          text: ["Revisión del personal en el control de salida, según los protocolos acordados con su empresa."],
        },
      ],
    },
    answerIds: [...commonAnswers, "inspeccion-primer-turno"],
    faqIds: [
      "falta-oficial",
      "como-sabre",
      "quien-entra",
      "inspeccion-primer-turno",
      "acreditacion-hse",
      "kit-proveedor",
      "precio",
      "contrato-pago",
    ],
    cta: audienceActions("empresa", {
      ubicacion: ubicacion("industria-y-logistica"),
      sector: "industria-y-logistica",
    }),
    whatsapp: waMessages.sector["industria-y-logistica"],
    ubicacion: ubicacion("industria-y-logistica"),
    photo: {
      src: "/assets/sectores/industria-y-logistica.webp",
      portrait: "/assets/sectores/industria-y-logistica-3x4.webp",
      alt: "Imagen ilustrativa: oficial de seguridad, con su planilla, atiende al conductor de un camión en la barrera de acceso de un centro de distribución.",
    },
  },

  "comercio-y-oficinas": {
    id: "comercio-y-oficinas",
    title: sectorNav["comercio-y-oficinas"].label,
    shortTitle: "Comercio",
    selector: {
      label: "Comercio, hotel u oficina",
      services: "Recepción, control de visitantes y vigilancia fija",
    },
    Icon: BuildingIcon,
    audience: "empresa",
    meta: {
      title: "Seguridad para comercios, hoteles y oficinas en Maracaibo",
      description:
        "Recepción y control de visitantes con trato profesional, vigilancia fija y cámaras con visión nocturna para comercios, hoteles y oficinas de Maracaibo.",
    },
    h1: { text: "Seguridad para comercios, hoteles y oficinas en", highlight: "Maracaibo" },
    lead: "Recepción y control de visitantes con trato profesional y protección preventiva no armada.",
    // «¿Sabe quién entró anoche…?» queda reservado a Inicio y a Control de acceso.
    hook: {
      title: "La seguridad es lo primero que ve su cliente.",
      text: "Visitantes, proveedores y vehículos se identifican al llegar y cada novedad se registra en el libro del puesto, con un trato profesional que cuida la imagen de su negocio.",
    },
    text: "Recepción y control de visitantes con trato profesional, vigilancia fija y protección preventiva no armada.",
    pains: [
      {
        title: "Visitantes sin identificar",
        text: "Personas que llegan a oficinas y áreas internas sin registro ni autorización.",
      },
      {
        title: "Cierre y horario nocturno",
        text: "Locales y oficinas vacíos fuera del horario de atención.",
      },
      {
        title: "Hurtos internos y externos",
        text: "Mercancía, equipos y pertenencias que desaparecen sin dejar rastro.",
      },
      {
        title: "La primera impresión",
        text: "El trato en la entrada habla de su negocio: tiene que ser profesional.",
      },
    ],
    scheme: [
      {
        service: "vigilancia-privada",
        why: "Oficiales en recepción, accesos y áreas comunes, con rondas fuera del horario de atención.",
      },
      {
        service: "control-de-acceso",
        why: "Identificación y registro de visitantes, proveedores y contratistas, con credencial cuando su sede la use.",
      },
      {
        service: "sistemas-electronicos",
        why: "Cámaras HD con visión nocturna en accesos, estacionamientos y áreas comunes.",
      },
      {
        service: "gestion-de-riesgos",
        why: "Evaluación de riesgos de su sede antes de definir puestos y horarios.",
      },
    ],
    focus: [
      "Comercios y locales",
      "Hoteles",
      "Oficinas y sedes corporativas",
      "[CENTROS COMERCIALES: CONFIRMAR SI SEDIN LOS ATIENDE]",
    ],
    spotlight: {
      eyebrow: "Protección preventiva no armada",
      title: "Seguridad pensada para espacios con público",
      lead: unarmedStatement,
      points: [
        {
          title: noArmado.title,
          text: noArmado.body,
          source: "Arts. 4 y 28",
        },
        {
          title: "Refuerzo para temporada alta o eventos",
          text: ["[CONFIRMAR SI SEDIN OFRECE REFUERZO TEMPORAL PARA TEMPORADA ALTA O EVENTOS]"],
        },
      ],
    },
    answerIds: [...commonAnswers, "supervision", "quien-responde", "no-armado"],
    faqIds: [
      "falta-oficial",
      "supervision-noche",
      "no-armado-robo",
      "quien-responde-hurto",
      "nomina",
      "quien-entra",
      "precio",
      "contrato-pago",
    ],
    cta: audienceActions("empresa", {
      ubicacion: ubicacion("comercio-y-oficinas"),
      sector: "comercio-y-oficinas",
    }),
    whatsapp: waMessages.sector["comercio-y-oficinas"],
    ubicacion: ubicacion("comercio-y-oficinas"),
    photo: {
      src: "/assets/sectores/comercio-y-oficinas.webp",
      portrait: "/assets/sectores/comercio-y-oficinas-3x4.webp",
      alt: "Imagen ilustrativa: oficial de seguridad entrega una credencial de visitante a un ejecutivo en la recepción de una sede corporativa con vista al Lago de Maracaibo.",
    },
  },

  condominios: {
    id: "condominios",
    title: sectorNav.condominios.label,
    shortTitle: "Condominios",
    selector: {
      label: "Condominio o conjunto residencial",
      services: "Garita, control de visitantes y vehículos, rondas",
    },
    Icon: HomeIcon,
    audience: "residencial",
    meta: {
      title: "Vigilancia para condominios en Maracaibo",
      description:
        "Oficiales de seguridad para conjuntos residenciales y condominios de Maracaibo: control de visitantes y vehículos, rondas y libro de novedades en cada puesto.",
    },
    h1: { text: "Vigilancia para condominios en", highlight: "Maracaibo" },
    lead: "Oficiales de seguridad (vigilantes) para el control de visitantes y vehículos, rondas y un libro de novedades en cada puesto.",
    hook: {
      title: "Mientras su conjunto descansa, SEDIN vigila.",
      text: "El oficial no deja la garita hasta que llega su relevo, cada visitante y cada vehículo se registra, y lo que pasa de noche queda escrito en el libro del puesto.",
    },
    text: "Oficiales de seguridad en la garita, control de visitantes y vehículos, rondas y libro de novedades.",
    pains: [
      {
        title: "Visitantes y repartidores sin control",
        text: "Personas que entran al conjunto sin que nadie sepa a qué casa van.",
      },
      {
        title: "Vehículos sin registro",
        text: "Carros y motos que entran y salen sin identificación.",
      },
      {
        title: "Noches y fines de semana",
        text: "Las horas en que el conjunto está más expuesto y menos gente lo nota.",
      },
      {
        title: "Una garita que queda sola",
        text: "Cuando falta el vigilante y nadie cubre el puesto.",
      },
    ],
    scheme: [
      {
        service: "vigilancia-privada",
        why: "Oficiales de seguridad en la garita y rondas por las áreas comunes y el perímetro.",
      },
      {
        service: "control-de-acceso",
        why: "Registro de visitantes, repartidores y vehículos en cada ingreso.",
      },
      {
        service: "sistemas-electronicos",
        why: "Cámaras HD con visión nocturna, cercado eléctrico y concertinas para reforzar el perímetro.",
      },
    ],
    focus: ["Conjuntos residenciales", "Edificios y condominios", "Urbanizaciones con garita"],
    spotlight: {
      eyebrow: "Para la junta de condominio",
      title: "Lo que preguntará su asamblea",
      lead: "Quién supervisa, qué pasa si falta el vigilante y de qué depende el precio: las respuestas, en una sola página para imprimir o compartir con los propietarios.",
      points: [
        {
          title: "Resumen para imprimir",
          text: [
            "Reemplazos, supervisión, libro de novedades, vigilancia no armada, personal, responsabilidad y precio, en una página.",
          ],
          link: { label: "Ver el resumen", href: routes.resumen },
        },
      ],
    },
    answerIds: [...commonAnswers, "supervision", "quien-responde", "no-armado"],
    faqIds: [
      "falta-oficial",
      "supervision-noche",
      "no-armado-robo",
      "nomina",
      "quien-responde-hurto",
      "mismos-oficiales",
      "cambio-oficial",
      "junta-libro",
      "precio",
      "contrato-pago",
    ],
    cta: audienceActions("residencial", {
      ubicacion: ubicacion("condominios"),
      sector: "condominios",
    }),
    whatsapp: waMessages.sector.condominios,
    ubicacion: ubicacion("condominios"),
    photo: {
      src: "/assets/sectores/condominios.webp",
      portrait: "/assets/sectores/condominios-3x4.webp",
      alt: "Imagen ilustrativa: oficial de seguridad atiende con su radio a un conductor en la garita de acceso de un conjunto residencial al anochecer.",
    },
  },
};

/** Los 4 sectores, en el orden del menú. */
export const sectorsContent: SectorContent[] = sectorSlugs.map((slug) => ({
  ...sectorData[slug],
  services: sectorData[slug].scheme.map((s) => s.service),
}));

export function getSector(slug: string): SectorContent | undefined {
  return sectorsContent.find((s) => s.id === slug);
}

/** Los otros sectores (bloque «Otros sectores» al final de cada página). */
export function otherSectors(slug: SectorSlug): SectorContent[] {
  return sectorsContent.filter((s) => s.id !== slug);
}
