import type { ServiceContent } from "@/content/services";

/**
 * Datos centrales del sitio. Los valores entre corchetes son marcadores
 * pendientes: se rellenan aquí y se propagan a todas las páginas. Con el
 * sistema de pendientes (`showPending`, `hasPending`, `<Pend>`), un texto con
 * [MARCADOR] no se publica en producción y se ve resaltado en modo revisión.
 *
 * Este archivo no importa contenidos (solo tipos) para evitar ciclos:
 * `src/content/*` sí puede importar de aquí.
 */

type ServiceSlug = ServiceContent["slug"];

const MAP_QUERY =
  "Calle 82 con Avenida 14, Centro Empresarial Grupo Assper, Maracaibo, Zulia, Venezuela";

export const site = {
  shortName: "SEDIN",
  name: "SEDIN, C.A.",
  legalName: "Seguridad y Defensa Integral, Compañía Anónima",
  /** Dominio y URL pública (sin barra final). */
  domain: "sedinca.com",
  url: "https://sedinca.com",
  /** RIF con su formato oficial (propuesta, 0.13). */
  rif: "J-40964338-7",
  rifDisplay: "J-40964338-7",
  phone: "+58 414 164 2505",
  /**
   * Correo de contacto. Se mantiene el Gmail hasta que exista el correo
   * corporativo: no inventar direcciones @sedinca.com.
   */
  email: "sedin.ca.seguridad@gmail.com",
  /** Buzón comercial (propuestas, kit). Hoy, el mismo correo de contacto. */
  salesEmail: "sedin.ca.seguridad@gmail.com",
  /** Buzón de empleo. Hoy, el mismo correo de contacto. */
  jobsEmail: "sedin.ca.seguridad@gmail.com",
  /** Número de guardia 24/7 para clientes (distinto del comercial). */
  guardPhone: "[NÚMERO DE GUARDIA 24/7]",
  address: "Calle 82 con Avenida 14, Centro Empresarial Grupo Assper, oficina 4",
  city: "Maracaibo, estado Zulia",
  /**
   * «Cómo llegar»: búsqueda por la dirección en Google Maps (no la ficha de
   * otra empresa). Cuando exista la ficha propia de SEDIN, apuntar a ella.
   */
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`,
  /** Búsqueda usada para el mapa incrustado de Contacto. */
  mapQuery: MAP_QUERY,
  hours: "24/7",
  whatsappNumber: "+58 414 164 2505",
  /** Solo junto a WhatsApp o al teléfono, nunca bajo un formulario. */
  responseTime: "Respuesta inmediata, en tiempo real",
  jobRequirements: "Masculino y femenino, de 18 a 55 años",
  /** Endpoint que recibe el formulario de cotización (POST JSON). Vacío = sin envío. */
  contactEndpoint: process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? "",
  /** Endpoint que recibe las postulaciones (POST multipart con el CV). Vacío = sin envío. */
  jobsEndpoint: process.env.NEXT_PUBLIC_JOBS_ENDPOINT ?? "",
} as const;

/* -------------------------------------------------------------------------
 * Pendientes
 * ---------------------------------------------------------------------- */

/**
 * Modo revisión: con `NEXT_PUBLIC_SHOW_PENDING=1` en el build, los textos con
 * [MARCADORES] se muestran resaltados («PENDIENTE DE CONFIRMAR»). Sin la
 * variable (producción), esos textos no se publican.
 */
export const showPending = process.env.NEXT_PUBLIC_SHOW_PENDING === "1";

/** ¿El texto contiene algún [MARCADOR]? */
export function hasPending(value: string) {
  return /\[[^\]\n]+\]/.test(value);
}

/** ¿El valor entero es un marcador? (p. ej. `[NÚMERO DE GUARDIA 24/7]`). */
export function isPlaceholder(value: string) {
  return /^\[.*\]$/.test(value);
}

/* -------------------------------------------------------------------------
 * Rutas
 * ---------------------------------------------------------------------- */

export const sectorSlugs = [
  "petroleo-y-energia",
  "industria-y-logistica",
  "comercio-y-oficinas",
  "condominios",
] as const;
export type SectorSlug = (typeof sectorSlugs)[number];

export const serviceSlugs = [
  "vigilancia-privada",
  "control-de-acceso",
  "sistemas-electronicos",
  "gestion-de-riesgos",
] as const satisfies readonly ServiceSlug[];

/** Audiencia de una página: decide el botón principal (propuesta, 11.3). */
export type Audience = "residencial" | "empresa";

export const routes = {
  home: "/",
  services: "/servicios",
  sectors: "/sectores",
  about: "/nosotros",
  jobs: "/empleo",
  contact: "/contacto",
  comoTrabajamos: "/como-trabajamos",
  empresas: "/empresas",
  empresasFicha: "/empresas/ficha",
  faq: "/preguntas-frecuentes",
  cotizar: "/cotizar",
  gracias: "/gracias",
  /** Resumen imprimible para la asamblea de condominio. */
  resumen: "/sectores/condominios/resumen",
  privacidad: "/privacidad",
  avisoLegal: "/aviso-legal",
} as const;

export function sectorHref(slug: SectorSlug) {
  return `${routes.sectors}/${slug}`;
}

export function serviceHref(slug: ServiceSlug) {
  return `${routes.services}/${slug}`;
}

/**
 * Enlace al diagnóstico con el contexto de la página (`/cotizar/?sector=…`).
 * Con barra final porque es un enlace con consulta en un sitio con
 * `trailingSlash`.
 */
export function cotizarHref(params: { sector?: SectorSlug; servicio?: ServiceSlug } = {}) {
  const query = new URLSearchParams();
  if (params.servicio) query.set("servicio", params.servicio);
  if (params.sector) query.set("sector", params.sector);
  const qs = query.toString();
  return qs ? `${routes.cotizar}/?${qs}` : routes.cotizar;
}

/** URL absoluta con barra final (compartir, datos estructurados). */
export function absoluteUrl(path: string) {
  if (path === "/") return `${site.url}/`;
  const [pathname, hash] = path.split("#");
  const withSlash = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return `${site.url}${withSlash}${hash ? `#${hash}` : ""}`;
}

/* -------------------------------------------------------------------------
 * Enlaces de contacto
 * ---------------------------------------------------------------------- */

/**
 * Enlace de WhatsApp con el mensaje ya escrito (`?text=` codificado).
 * Mientras no haya número, lleva a la página de contacto.
 */
export function whatsappHref(text?: string) {
  if (isPlaceholder(site.whatsappNumber)) return routes.contact;
  const base = `https://wa.me/${site.whatsappNumber.replace(/\D/g, "")}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** Compartir un texto por WhatsApp sin destinatario (p. ej. con la junta). */
export function whatsappShareHref(text: string) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function phoneHref(phone: string = site.phone) {
  if (isPlaceholder(phone)) return undefined;
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function emailHref(email: string = site.email) {
  if (isPlaceholder(email)) return undefined;
  return `mailto:${email}`;
}

/** `mailto:` con asunto y cuerpo ya redactados. */
export function mailtoHref({
  to = site.salesEmail,
  subject,
  body,
}: {
  to?: string;
  subject: string;
  body?: string;
}) {
  const params = [`subject=${encodeURIComponent(subject)}`];
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${to}?${params.join("&")}`;
}

/* -------------------------------------------------------------------------
 * Mensajes de WhatsApp (propuesta, 11.6)
 * Todos empiezan por «Les escribo desde sedinca.com (…)» para saber desde qué
 * página llega cada contacto, y terminan en dos puntos para que la persona
 * complete.
 * ---------------------------------------------------------------------- */

const WA = "Hola, SEDIN. Les escribo desde sedinca.com";

export const waMessages = {
  /** General, Inicio y Contacto. */
  general: `${WA}. Quiero proteger mi instalación y necesito asesoría. Se trata de: `,
  inspeccion: `${WA}. Quiero agendar una inspección del sitio. Dirección y día preferido: `,
  visitaTecnica: `${WA} (empresas). Quiero agendar una visita técnica. Empresa, dirección y día preferido: `,
  propuesta: `${WA} (empresas). Quiero solicitar una propuesta técnica y económica. Empresa: `,
  kit: `${WA}. Quiero recibir el kit de proveedor. Empresa: `,
  empleo:
    "POSTULACIÓN – Oficial de seguridad. Les escribo desde sedinca.com (empleo). Mi nombre es: \nZona donde vivo: ",
  sector: {
    "petroleo-y-energia": `${WA} (petróleo y energía). Represento a la empresa: `,
    "industria-y-logistica": `${WA} (industria). Nuestra planta o almacén está en: `,
    "comercio-y-oficinas": `${WA} (comercio y oficinas). Queremos evaluar la seguridad de nuestra sede en: `,
    condominios: `${WA} (condominios). Escribo por el conjunto residencial: `,
  } satisfies Record<SectorSlug, string>,
  servicio: {
    "vigilancia-privada": `${WA} (vigilancia privada). Necesito oficiales de seguridad para: `,
    "control-de-acceso": `${WA} (control de acceso). Necesito controlar el acceso y la salida de personal en: `,
    "sistemas-electronicos": `${WA} (sistemas electrónicos). Necesito cámaras, cercado eléctrico o concertinas para: `,
    "gestion-de-riesgos": `${WA} (gestión de riesgos). Necesito una evaluación de riesgos para: `,
  } satisfies Record<ServiceSlug, string>,
} as const;

/** Texto para «Enviar a la junta por WhatsApp» (resumen para la asamblea, 8.8). */
export function waShareJunta(url: string = absoluteUrl(routes.resumen)) {
  return `Les comparto esta propuesta de vigilancia para el conjunto: ${url}`;
}

/**
 * Mensaje con campos («• Instalación: …»), para enviar un formulario o el
 * diagnóstico por WhatsApp o por correo. Los campos vacíos se omiten.
 */
export function composeMessage(
  intro: string,
  fields: ReadonlyArray<readonly [label: string, value: string | undefined | null]>,
  closing?: string,
) {
  const lines = fields
    .filter(([, value]) => value && value.trim())
    .map(([label, value]) => `• ${label}: ${value!.trim()}`);
  return [intro.trim(), ...lines, closing?.trim()].filter(Boolean).join("\n");
}

/** Resumen del diagnóstico guiado para WhatsApp (8.3). */
export function waDiagnostico(answers: {
  instalacion?: string;
  preocupa?: string;
  cobertura?: string;
  zonaPlazo?: string;
}) {
  return composeMessage(
    `${WA} (diagnóstico de seguridad).`,
    [
      ["Instalación", answers.instalacion],
      ["Me preocupa", answers.preocupa],
      ["Cobertura", answers.cobertura],
      ["Zona y plazo", answers.zonaPlazo],
    ],
    "Mi nombre es: ",
  );
}

/* -------------------------------------------------------------------------
 * Botones según la audiencia (propuesta, 11.3)
 * ---------------------------------------------------------------------- */

/*
 * Una sola familia de nombres para /cotizar: «Cotizar» en el encabezado y la
 * barra móvil; «Diagnóstico y cotización» en los botones grandes, con la
 * microlínea `diagnosticoNote` debajo cuando hay sitio. Los botones
 * contextuales de servicio conservan el verbo («Cotizar oficiales…»).
 */
export const ctaLabels = {
  whatsapp: "Escríbanos por WhatsApp",
  diagnostico: "Diagnóstico y cotización",
  /** Microlínea bajo el botón de diagnóstico (portada y cierre). */
  diagnosticoNote: "4 preguntas · sin compromiso",
  inspeccion: "Solicite una inspección del sitio",
  llamar: "Llamar",
  propuesta: "Solicitar propuesta técnica y económica",
  visitaTecnica: "Agendar visita técnica",
  kit: "Solicitar kit por correo",
  ficha: "Ver la ficha corporativa",
  compartirJunta: "Enviar a la junta por WhatsApp",
  postular: "Postular por WhatsApp",
  cotizar: "Cotizar",
  asesor: "Hablar con un asesor",
  empresaLink: "¿Compra para una empresa? Solicite una propuesta técnica y económica",
} as const;

/** Acción de llamada a la acción, como dato (la pinta `<ActionLink>`). */
export type CtaAction =
  | { kind: "whatsapp"; label: string; message: string; ubicacion: string; event?: string }
  | { kind: "call"; label: string; ubicacion: string; phone?: string }
  | {
      kind: "mail";
      label: string;
      subject: string;
      body?: string;
      to?: string;
      ubicacion: string;
      event: string;
    }
  | {
      kind: "link";
      label: string;
      href: string;
      ubicacion?: string;
      event?: string;
      /** Microlínea bajo el botón (p. ej. «4 preguntas · sin compromiso»); la pinta `ActionGroup`. */
      note?: string;
    };

const sectorPhrase: Record<SectorSlug, string> = {
  "petroleo-y-energia": "petróleo y energía",
  "industria-y-logistica": "industria y logística",
  "comercio-y-oficinas": "comercio y oficinas",
  condominios: "condominios",
};

/** Correo de «Solicitar propuesta técnica y económica» (para adjuntar el pliego). */
export function proposalMail(ubicacion: string, sector?: SectorSlug): CtaAction {
  const origin = sector ? ` (${sectorPhrase[sector]})` : "";
  return {
    kind: "mail",
    label: ctaLabels.propuesta,
    subject: `Solicitud de propuesta técnica y económica${origin}`,
    body: [
      "Buenos días, SEDIN.",
      `Les escribo desde sedinca.com${origin}. Solicitamos una propuesta técnica y económica.`,
      "",
      "Empresa: ",
      "Instalación y ubicación: ",
      "Servicios que necesitamos: ",
      "Persona de contacto y teléfono: ",
      "",
      "Adjuntamos el pliego o alcance, si lo tenemos.",
    ].join("\n"),
    ubicacion,
    event: "propuesta-formal",
  };
}

/** Correo de «Solicitar kit por correo». */
export function kitMail(ubicacion: string): CtaAction {
  return {
    kind: "mail",
    label: ctaLabels.kit,
    subject: "Solicitud de kit de proveedor",
    body: [
      "Buenos días, SEDIN.",
      "Les escribo desde sedinca.com. Queremos recibir el kit de proveedor con los documentos vigentes.",
      "",
      "Empresa: ",
      "Persona de contacto y cargo: ",
      "Teléfono: ",
    ].join("\n"),
    ubicacion,
    event: "kit-solicitud",
  };
}

/**
 * Botones de una página según su audiencia, en orden (principal, secundario,
 * tercero):
 * - `residencial`: WhatsApp · Diagnóstico y cotización · Llamar.
 * - `empresa`: propuesta técnica y económica (correo) · visita técnica
 *   (WhatsApp) · WhatsApp.
 * - `general` (Inicio): WhatsApp · Diagnóstico · «¿Compra para una empresa?…».
 */
export function audienceActions(
  audience: Audience | "general",
  options: {
    ubicacion: string;
    whatsapp?: string;
    sector?: SectorSlug;
    servicio?: ServiceSlug;
  },
): CtaAction[] {
  const { ubicacion, sector, servicio } = options;
  const message =
    options.whatsapp ??
    (sector ? waMessages.sector[sector] : servicio ? waMessages.servicio[servicio] : waMessages.general);
  const whatsapp: CtaAction = { kind: "whatsapp", label: ctaLabels.whatsapp, message, ubicacion };

  if (audience === "empresa") {
    return [
      proposalMail(ubicacion, sector),
      {
        kind: "whatsapp",
        label: ctaLabels.visitaTecnica,
        message: waMessages.visitaTecnica,
        ubicacion,
        event: "visita-tecnica",
      },
      whatsapp,
    ];
  }

  const diagnostico: CtaAction = {
    kind: "link",
    label: ctaLabels.diagnostico,
    href: cotizarHref({ sector, servicio }),
    ubicacion,
    event: "cta-cotizar",
    note: ctaLabels.diagnosticoNote,
  };

  if (audience === "residencial") {
    return [whatsapp, diagnostico, { kind: "call", label: `${ctaLabels.llamar}: ${site.phone}`, ubicacion }];
  }

  return [
    whatsapp,
    diagnostico,
    { kind: "link", label: ctaLabels.empresaLink, href: routes.empresas, ubicacion, event: "propuesta-formal" },
  ];
}

/* -------------------------------------------------------------------------
 * Navegación (propuesta, 5.3)
 * ---------------------------------------------------------------------- */

export interface NavItem {
  label: string;
  href: string;
  /** Línea de apoyo para el menú «Soluciones» y el pie. */
  description?: string;
}

export interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
  /** Enlace al índice del grupo («Ver todos…»). */
  index: NavItem;
}

export interface PrimaryNavItem {
  label: string;
  /** Sin `href`, el elemento abre un menú con `groups`. */
  href?: string;
  groups?: NavGroup[];
}

export const sectorNav: Record<SectorSlug, NavItem> = {
  "petroleo-y-energia": {
    label: "Petróleo y energía",
    href: sectorHref("petroleo-y-energia"),
    description: "Campos, estaciones y plantas de energía",
  },
  "industria-y-logistica": {
    label: "Industria y logística",
    href: sectorHref("industria-y-logistica"),
    description: "Plantas, almacenes y galpones",
  },
  "comercio-y-oficinas": {
    label: "Comercio, hoteles y oficinas",
    href: sectorHref("comercio-y-oficinas"),
    description: "Comercios, hoteles y sedes corporativas",
  },
  condominios: {
    label: "Condominios",
    href: sectorHref("condominios"),
    description: "Conjuntos residenciales y edificios",
  },
};

export const serviceNav: Record<ServiceSlug, NavItem> = {
  "vigilancia-privada": {
    label: "Vigilancia privada",
    href: serviceHref("vigilancia-privada"),
    description: "Oficiales en puesto fijo o en rondas",
  },
  "control-de-acceso": {
    label: "Control de acceso",
    href: serviceHref("control-de-acceso"),
    description: "Entrada y salida de personal y materiales",
  },
  "sistemas-electronicos": {
    label: "Sistemas electrónicos",
    href: serviceHref("sistemas-electronicos"),
    description: "Cámaras, cercado eléctrico y concertinas",
  },
  "gestion-de-riesgos": {
    label: "Gestión de riesgos",
    href: serviceHref("gestion-de-riesgos"),
    description: "Evaluación y asesoría de seguridad",
  },
};

/** Menú «Soluciones»: por instalación (4 sectores) y por servicio (4 servicios). */
export const solutionsNav: PrimaryNavItem = {
  label: "Soluciones",
  groups: [
    {
      id: "por-instalacion",
      label: "Por instalación",
      items: sectorSlugs.map((slug) => sectorNav[slug]),
      index: { label: "¿Qué necesita proteger?", href: routes.sectors },
    },
    {
      id: "por-servicio",
      label: "Por servicio",
      items: serviceSlugs.map((slug) => serviceNav[slug]),
      index: { label: "Ver todos los servicios", href: routes.services },
    },
  ],
};

/** Menú principal de escritorio: Soluciones ▾ · Cómo trabajamos · Nosotros · Contacto. */
export const primaryNav: PrimaryNavItem[] = [
  solutionsNav,
  { label: "Cómo trabajamos", href: routes.comoTrabajamos },
  { label: "Nosotros", href: routes.about },
  { label: "Contacto", href: routes.contact },
];

/** Enlaces secundarios (barra superior fina): Para empresas · Empleo. */
export const secondaryNav: NavItem[] = [
  { label: "Para empresas", href: routes.empresas },
  { label: "Empleo", href: routes.jobs },
];

/** Botón del encabezado de escritorio. */
export const headerCta: NavItem = { label: ctaLabels.cotizar, href: routes.cotizar };

/**
 * Menú móvil (acordeón), en este orden: Soluciones, Para empresas, Cómo
 * trabajamos, Nosotros, Contacto y, separado por una línea, Empleo.
 */
export const mobileNav: { main: PrimaryNavItem[]; after: NavItem[] } = {
  main: [
    solutionsNav,
    { label: "Para empresas", href: routes.empresas },
    { label: "Cómo trabajamos", href: routes.comoTrabajamos },
    { label: "Nosotros", href: routes.about },
    { label: "Contacto", href: routes.contact },
  ],
  after: [{ label: "Empleo", href: routes.jobs }],
};

/** Pie en 4 columnas (la cuarta, «Contacto 24/7», se arma con `site`). */
export const footerNav: { label: string; items: NavItem[] }[] = [
  { label: "Por instalación", items: sectorSlugs.map((slug) => sectorNav[slug]) },
  { label: "Servicios", items: serviceSlugs.map((slug) => serviceNav[slug]) },
  {
    label: "Conozca SEDIN",
    items: [
      { label: "Cómo trabajamos", href: routes.comoTrabajamos },
      { label: "Nosotros", href: routes.about },
      { label: "Preguntas frecuentes", href: routes.faq },
      { label: "Para empresas", href: routes.empresas },
    ],
  },
];

/** Línea inferior del pie: Empleo · Aviso legal · Privacidad. */
export const legalNav: NavItem[] = [
  { label: "Empleo", href: routes.jobs },
  { label: "Aviso legal", href: routes.avisoLegal },
  { label: "Privacidad", href: routes.privacidad },
];

/** Tarjetas «Siga conociendo SEDIN». */
export const knowMoreLinks = {
  comoTrabajamos: {
    eyebrow: "El método",
    title: "Cómo trabajamos",
    text: "Relevos, libro de novedades y supervisión, paso a paso.",
    href: routes.comoTrabajamos,
  },
  empresas: {
    eyebrow: "Compras y proveedores",
    title: "Para empresas",
    text: "Ficha de proveedor, kit de documentos y propuesta formal.",
    href: routes.empresas,
  },
  faq: {
    eyebrow: "Dudas",
    title: "Preguntas frecuentes",
    text: "Las respuestas a lo que más se pregunta antes de contratar.",
    href: routes.faq,
  },
  nosotros: {
    eyebrow: "Quiénes somos",
    title: "Nosotros",
    text: "Seguridad privada y protección preventiva no armada en Maracaibo.",
    href: routes.about,
  },
  sectores: {
    eyebrow: "Por instalación",
    title: "Seguridad según su instalación",
    text: "Petróleo y energía, industria, comercio y condominios.",
    href: routes.sectors,
  },
  servicios: {
    eyebrow: "Por servicio",
    title: "Servicios",
    text: "Vigilancia, control de acceso, sistemas electrónicos y gestión de riesgos.",
    href: routes.services,
  },
  resumenAsamblea: {
    eyebrow: "Para la junta",
    title: "Resumen para la asamblea",
    text: "Una página para imprimir o compartir con los propietarios.",
    href: routes.resumen,
  },
  contacto: {
    eyebrow: "Contacto",
    title: "Hable con un asesor",
    text: "WhatsApp, teléfono y oficina en Maracaibo.",
    href: routes.contact,
  },
} satisfies Record<string, { eyebrow: string; title: string; text: string; href: string }>;

/* -------------------------------------------------------------------------
 * Compatibilidad (exports anteriores; no usar en código nuevo)
 * ---------------------------------------------------------------------- */

/** @deprecated Menú plano anterior. Usar `primaryNav`, `secondaryNav` y `mobileNav`. */
export const mainNav = [
  { label: "Inicio", href: "/" },
  { label: "Servicios", href: "/servicios" },
  { label: "Sectores", href: "/sectores" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Contacto", href: "/contacto" },
] as const;

/** @deprecated Usar `serviceNav` (con slug) o `serviceHref(slug)`. */
export const services = {
  vigilancia: { label: "Vigilancia privada", href: "/servicios/vigilancia-privada" },
  acceso: { label: "Control de acceso", href: "/servicios/control-de-acceso" },
  electronicos: { label: "Sistemas electrónicos", href: "/servicios/sistemas-electronicos" },
  riesgos: { label: "Gestión de riesgos", href: "/servicios/gestion-de-riesgos" },
} as const;
