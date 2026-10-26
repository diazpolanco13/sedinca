import {
  BoltIcon,
  CameraIcon,
  ClipboardCheckIcon,
  ClockIcon,
  EyeIcon,
  HeadsetIcon,
  SearchIcon,
  ShieldCheckIcon,
  TargetIcon,
  TeamIcon,
} from "@/components/icons";

type Icon = typeof ShieldCheckIcon;

export interface ServiceContent {
  slug: "vigilancia-privada" | "control-de-acceso" | "sistemas-electronicos" | "gestion-de-riesgos";
  /** Nombre corto (ruta de navegación, enlaces relacionados). */
  name: string;
  metaDescription: string;
  /** Titular de la portada; `highlight` va en color de marca al final. */
  title: { text: string; highlight: string };
  lead: string;
  photo: { caption: string; label: string };
  /** Bloque de dos tarjetas (modalidades o líneas del servicio). */
  modes: {
    eyebrow: string;
    heading: string;
    cta: string;
    items: { chip: string; live?: boolean; title: string; text: string }[];
  };
  benefits: { Icon: Icon; title: string; text: string }[];
  steps: { title: string; text: string }[];
  stepsHeading: string;
  sectors: string[];
  related: ServiceContent["slug"][];
}

const inspection = {
  title: "Inspección del sitio",
  text: "Visitamos las instalaciones y evaluamos accesos, perímetro y riesgos.",
};

export const servicesContent: ServiceContent[] = [
  {
    slug: "vigilancia-privada",
    name: "Vigilancia privada",
    metaDescription:
      "Vigilancia privada fija y móvil para conjuntos residenciales, condominios, empresas e industria: presencia disuasiva, vigilancia 24/7 y atención inmediata.",
    title: { text: "Servicio de vigilancia", highlight: "privada" },
    lead: "Protegemos lo que más te importa. Oficiales de seguridad para conjuntos residenciales, condominios, empresas e industria, con presencia disuasiva y respuesta inmediata.",
    photo: {
      caption: "[Foto] Oficial en garita de conjunto residencial, de noche",
      label:
        "Espacio para fotografía: oficial de seguridad en la garita de un conjunto residencial de noche",
    },
    modes: {
      eyebrow: "Modalidades",
      heading: "Fija o móvil, según lo que necesitas proteger",
      cta: "Ver modalidades",
      items: [
        {
          chip: "Puesto permanente",
          live: true,
          title: "Vigilancia fija",
          text: "Oficiales de seguridad asignados a un lugar determinado para proteger a las personas y los bienes muebles e inmuebles que allí se encuentran.",
        },
        {
          chip: "Rondas y patrullaje",
          title: "Vigilancia móvil",
          text: "Oficiales móviles que protegen personas y bienes en un área o sector delimitado, con recorridos y supervisión constante.",
        },
      ],
    },
    benefits: [
      {
        Icon: ShieldCheckIcon,
        title: "Seguridad confiable",
        text: "Personal altamente capacitado y comprometido con tu tranquilidad.",
      },
      {
        Icon: ClockIcon,
        title: "Vigilancia 24/7",
        text: "Monitoreo constante y control de accesos para mayor protección.",
      },
      {
        Icon: TeamIcon,
        title: "Presencia disuasiva",
        text: "Prevención efectiva ante cualquier situación de riesgo.",
      },
      {
        Icon: HeadsetIcon,
        title: "Atención inmediata",
        text: "Respuesta rápida y coordinada ante cualquier novedad.",
      },
    ],
    stepsHeading: "Del primer recorrido al reporte de novedades",
    steps: [
      inspection,
      {
        title: "Propuesta a la medida",
        text: "Definimos modalidad, turnos y número de oficiales.",
      },
      {
        title: "Puesta en servicio",
        text: "Oficiales uniformados y equipados con radio, libro de novedades y controles de entrada y salida.",
      },
      {
        title: "Supervisión continua",
        text: "Supervisores verifican el servicio y te informan cada novedad.",
      },
    ],
    sectors: [
      "Conjuntos residenciales",
      "Condominios",
      "Oficinas",
      "Plantas y almacenes",
      "Industria petrolera",
    ],
    related: ["control-de-acceso", "sistemas-electronicos"],
  },
  {
    slug: "control-de-acceso",
    name: "Control de acceso",
    metaDescription:
      "Control de acceso y salida de personal: procedimientos de acceso, inspección y control, protocolos de seguridad y trato respetuoso y profesional.",
    title: { text: "Control de acceso y salida de", highlight: "personal" },
    lead: "Cada ingreso controlado es un riesgo menos para tu empresa. Oficiales capacitados para garantizar el control y la seguridad en cada ingreso y salida de tus instalaciones.",
    photo: {
      caption: "[Foto] Oficial verificando la identificación en el acceso de una planta",
      label:
        "Espacio para fotografía: oficial de seguridad verificando la identificación del personal en el acceso de una planta",
    },
    modes: {
      eyebrow: "Modalidades",
      heading: "Control en la entrada y en la salida",
      cta: "Ver modalidades",
      items: [
        {
          chip: "Identificación y registro",
          live: true,
          title: "Control de ingreso",
          text: "Verificación de identidad y registro de personal y visitantes en cada ingreso, conforme a los procedimientos de acceso de la empresa.",
        },
        {
          chip: "Inspección",
          title: "Control de salida de personal",
          text: "Inspección y control del personal y de los bienes que salen de las instalaciones, con apoyo de detector de metales y según los protocolos acordados.",
        },
      ],
    },
    benefits: [
      {
        Icon: SearchIcon,
        title: "Inspección y control",
        text: "Revisión ordenada de personas y bienes en cada ingreso y salida.",
      },
      {
        Icon: ClipboardCheckIcon,
        title: "Protocolos de seguridad",
        text: "Procedimientos de acceso definidos y aplicados en cada turno.",
      },
      {
        Icon: ShieldCheckIcon,
        title: "Prevención y comunicación",
        text: "Detección temprana y reporte inmediato de cualquier novedad.",
      },
      {
        Icon: TeamIcon,
        title: "Trato respetuoso",
        text: "Atención profesional y cortés al personal, visitantes y contratistas.",
      },
    ],
    stepsHeading: "Del primer recorrido al reporte de novedades",
    steps: [
      inspection,
      {
        title: "Procedimientos de acceso",
        text: "Definimos con tu empresa los controles de ingreso, salida e inspección.",
      },
      {
        title: "Puesta en servicio",
        text: "Oficiales uniformados y equipados con radio, libro de novedades y registro de entradas y salidas.",
      },
      {
        title: "Supervisión continua",
        text: "Supervisores verifican el cumplimiento de los protocolos y te informan cada novedad.",
      },
    ],
    sectors: [
      "Empresas e industria",
      "Plantas y almacenes",
      "Centros de distribución",
      "Industria petrolera",
      "Corporaciones",
    ],
    related: ["vigilancia-privada", "sistemas-electronicos"],
  },
  {
    slug: "sistemas-electronicos",
    name: "Sistemas electrónicos",
    metaDescription:
      "Sistemas de seguridad electrónica: cámaras de alta definición con visión nocturna, vigilancia remota 24/7 desde centro de control, cercado eléctrico y concertinas.",
    title: { text: "Sistemas de seguridad", highlight: "electrónica" },
    lead: "Tecnología, experiencia y protección para lo que más valoras. Cámaras de alta definición, vigilancia remota 24/7 desde nuestro centro de control, cercado eléctrico y concertinas.",
    photo: {
      caption: "[Foto] Centro de control con monitores de videovigilancia",
      label: "Espacio para fotografía: centro de control de SEDIN con monitores de videovigilancia",
    },
    modes: {
      eyebrow: "Soluciones",
      heading: "Monitoreo en tiempo real y protección perimetral",
      cta: "Ver soluciones",
      items: [
        {
          chip: "Monitoreo 24/7",
          live: true,
          title: "Cámaras y vigilancia remota",
          text: "Cámaras de alta definición con visión nocturna y monitoreo en tiempo real, supervisadas de forma remota desde nuestro centro de control.",
        },
        {
          chip: "Perímetro",
          title: "Cercado eléctrico y concertinas",
          text: "Seguridad perimetral de alta efectividad, con máxima disuasión ante intentos de intrusión.",
        },
      ],
    },
    benefits: [
      {
        Icon: CameraIcon,
        title: "Alta definición",
        text: "Imágenes nítidas de día y de noche gracias a la visión nocturna.",
      },
      {
        Icon: EyeIcon,
        title: "Monitoreo en tiempo real",
        text: "Supervisión profesional desde nuestro centro de control.",
      },
      {
        Icon: ClockIcon,
        title: "Vigilancia remota 24/7",
        text: "Monitoreo constante, protección total.",
      },
      {
        Icon: BoltIcon,
        title: "Protección perimetral",
        text: "Cercado eléctrico y concertinas para máxima disuasión.",
      },
    ],
    stepsHeading: "Del primer recorrido al monitoreo constante",
    steps: [
      inspection,
      {
        title: "Diseño de la solución",
        text: "Definimos la ubicación de cámaras y los tramos de cercado o concertina.",
      },
      {
        title: "Puesta en servicio",
        text: "Instalación de los equipos y enlace con nuestro centro de control.",
      },
      {
        title: "Monitoreo continuo",
        text: "Supervisión 24/7 en tiempo real y aviso inmediato de cada novedad.",
      },
    ],
    sectors: [
      "Industria petrolera",
      "Plantas y almacenes",
      "Corporaciones",
      "Conjuntos residenciales",
      "Condominios",
    ],
    related: ["vigilancia-privada", "control-de-acceso"],
  },
  {
    slug: "gestion-de-riesgos",
    name: "Gestión de riesgos",
    metaDescription:
      "Gestión de riesgos y consultoría en seguridad: prevención, análisis y respuesta efectiva, con asesoría para diseñar el esquema de seguridad de cada operación.",
    title: { text: "Gestión de riesgos y", highlight: "consultoría" },
    lead: "Prevención, análisis y respuesta efectiva. Asesoría para diseñar el esquema de seguridad que tu operación necesita.",
    photo: {
      caption: "[Foto] Supervisor revisando un plan de seguridad con el cliente",
      label:
        "Espacio para fotografía: supervisor de SEDIN revisando un plan de seguridad con el cliente",
    },
    modes: {
      eyebrow: "Servicios",
      heading: "Análisis y asesoría para decidir con criterio",
      cta: "Ver servicios",
      items: [
        {
          chip: "Diagnóstico",
          title: "Análisis de riesgos",
          text: "Evaluación de instalaciones, accesos, perímetro y operación para identificar riesgos y priorizar medidas de prevención.",
        },
        {
          chip: "Plan de seguridad",
          title: "Consultoría y asesoría",
          text: "Asesoría para definir el esquema de seguridad adecuado: modalidades de vigilancia, control de acceso y sistemas electrónicos.",
        },
      ],
    },
    benefits: [
      {
        Icon: ShieldCheckIcon,
        title: "Prevención",
        text: "Medidas que se anticipan a los riesgos antes de que ocurran.",
      },
      {
        Icon: SearchIcon,
        title: "Análisis",
        text: "Evaluación objetiva de accesos, perímetro y operación.",
      },
      {
        Icon: TargetIcon,
        title: "Respuesta efectiva",
        text: "Protocolos claros para actuar ante cualquier novedad.",
      },
      {
        Icon: HeadsetIcon,
        title: "Asesoría profesional",
        text: "Acompañamiento para implementar y ajustar el esquema de seguridad.",
      },
    ],
    stepsHeading: "Del primer recorrido al plan de seguridad",
    steps: [
      inspection,
      {
        title: "Análisis de riesgos",
        text: "Identificamos vulnerabilidades y las priorizamos según su impacto.",
      },
      {
        title: "Recomendaciones",
        text: "Proponemos el esquema de seguridad y los protocolos de respuesta.",
      },
      {
        title: "Seguimiento",
        text: "Acompañamos la implementación y revisamos los resultados contigo.",
      },
    ],
    sectors: [
      "Industria petrolera",
      "Empresas e industria",
      "Corporaciones",
      "Residencial y condominios",
    ],
    related: ["vigilancia-privada", "control-de-acceso", "sistemas-electronicos"],
  },
];

export function getService(slug: string) {
  return servicesContent.find((s) => s.slug === slug);
}
