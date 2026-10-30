import {
  cotizarHref,
  ctaLabels,
  routes,
  sectorSlugs,
  serviceSlugs,
  waMessages,
  type Audience,
  type CtaAction,
  type SectorSlug,
} from "@/config/site";
import { umamiEvents } from "@/lib/analytics";

type ServiceSlug = (typeof serviceSlugs)[number];

/**
 * Contexto de contacto según la ruta (propuesta, 5.3 y 11.6): qué mensaje de
 * WhatsApp se precarga y adónde lleva «Cotizar» en la barra móvil y en el
 * botón flotante. Solo usa datos de `site.ts` (sin contenidos con
 * marcadores), así que puede viajar a componentes cliente.
 */
export interface RouteContext {
  /** Tipo de página. */
  kind: "general" | "sector" | "servicio" | "empresas" | "empleo" | "cotizar";
  audience: Audience | "general";
  sector?: SectorSlug;
  servicio?: ServiceSlug;
  /** Mensaje de WhatsApp precargado. */
  whatsapp: string;
}

/** Audiencia de cada sector (coincide con `sectorsContent[].audience`). */
const sectorAudience: Record<SectorSlug, Audience> = {
  "petroleo-y-energia": "empresa",
  "industria-y-logistica": "empresa",
  "comercio-y-oficinas": "empresa",
  condominios: "residencial",
};

function isSector(value: string): value is SectorSlug {
  return (sectorSlugs as readonly string[]).includes(value);
}

function isService(value: string): value is ServiceSlug {
  return (serviceSlugs as readonly string[]).includes(value);
}

/** Ruta sin barra final («/servicios/» → «/servicios»; «/» se queda). */
export function cleanPath(pathname: string | null | undefined) {
  if (!pathname) return "/";
  const clean = pathname.split(/[?#]/)[0].replace(/\/+$/, "");
  return clean || "/";
}

/** ¿El enlace corresponde a la página actual o a una de sus hijas? */
export function isCurrentPath(pathname: string | null | undefined, href: string) {
  const path = cleanPath(pathname);
  const target = cleanPath(href);
  if (target === "/") return path === "/";
  return path === target || path.startsWith(`${target}/`);
}

export function routeContext(pathname: string | null | undefined): RouteContext {
  const path = cleanPath(pathname);
  const [, first, second] = path.split("/");

  if (first === routes.sectors.slice(1) && second && isSector(second)) {
    return {
      kind: "sector",
      audience: sectorAudience[second],
      sector: second,
      whatsapp: waMessages.sector[second],
    };
  }
  if (first === routes.services.slice(1) && second && isService(second)) {
    return {
      kind: "servicio",
      audience: "general",
      servicio: second,
      whatsapp: waMessages.servicio[second],
    };
  }
  if (path === routes.empresas || path.startsWith(`${routes.empresas}/`)) {
    return { kind: "empresas", audience: "empresa", whatsapp: waMessages.propuesta };
  }
  if (path === routes.jobs || path.startsWith(`${routes.jobs}/`)) {
    return { kind: "empleo", audience: "general", whatsapp: waMessages.empleo };
  }
  if (path === routes.cotizar) {
    return { kind: "cotizar", audience: "general", whatsapp: waMessages.general };
  }
  return { kind: "general", audience: "general", whatsapp: waMessages.general };
}

export type QuoteAction = Extract<CtaAction, { kind: "link" }>;

/**
 * Acción «Cotizar» de la barra móvil: siempre el diagnóstico con el contexto
 * de la página (`/cotizar/?sector=…`), igual que el «Cotizar» del encabezado
 * (mismo texto, mismo destino). En petróleo e industria el diagnóstico entra
 * directamente en la rama de empresa, que ofrece la propuesta por correo.
 */
export function quoteAction(ctx: RouteContext, ubicacion: string): QuoteAction {
  return {
    kind: "link",
    label: ctaLabels.cotizar,
    href: cotizarHref({ sector: ctx.sector, servicio: ctx.servicio }),
    ubicacion,
    event: umamiEvents.ctaCotizar,
  };
}
