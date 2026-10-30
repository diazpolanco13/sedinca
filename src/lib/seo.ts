import type { Metadata } from "next";
import { absoluteUrl, routes, sectorHref, sectorSlugs, serviceHref, serviceSlugs, site } from "@/config/site";

/*
 * SEO técnico (propuesta, 15.3): plantilla de título, descripción por
 * defecto, imagen para compartir, metadatos por página, datos estructurados
 * y lista de URL del sitemap. Nada de esto lleva [MARCADORES]: los datos sin
 * confirmar (zonas atendidas, geo, ficha de Google) no se publican.
 */

export const titleTemplate = `%s | ${site.name}`;

/** Título de Inicio (absoluto) y por defecto. */
export const defaultTitle = `Empresa de vigilancia privada en Maracaibo | ${site.name}`;

/** Descripción de Inicio y por defecto (15.3). */
export const defaultDescription =
  "Vigilancia privada no armada, control de acceso, cámaras con visión nocturna y cercado eléctrico en Maracaibo y el Zulia. Escríbanos por WhatsApp o pida una propuesta.";

/**
 * Imagen para compartir: 1200×630, JPG de 80 KB (límite práctico de WhatsApp:
 * 300 KB), con la foto del puente, el logo y «Vigilancia privada en
 * Maracaibo · 24/7».
 */
export const ogImage = {
  url: "/assets/og-sedin.jpg",
  width: 1200,
  height: 630,
  alt: "SEDIN, C.A. — Vigilancia privada en Maracaibo, 24/7",
  type: "image/jpeg",
} as const;

/** Ruta con barra final, como la exporta el sitio (`trailingSlash`). */
export function canonicalPath(path: string) {
  if (path === "/" || path === "") return "/";
  const [pathname] = path.split(/[?#]/);
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

/**
 * Metadatos de una página con canónica y vista previa al compartir.
 *
 *   export const metadata = pageMetadata({
 *     title: "Vigilancia para condominios en Maracaibo",
 *     description: "…",
 *     path: sectorHref("condominios"),
 *   });
 *
 * Importante: si una página define su propio `openGraph`, Next sustituye el
 * del layout entero (se perderían imagen, idioma y nombre del sitio). Use
 * este helper, que los repite.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  noindex = false,
  absoluteTitle = false,
}: {
  /** Sin « | SEDIN, C.A.» (lo añade la plantilla). */
  title: string;
  description: string;
  path: string;
  /** Imagen propia para compartir (1200×630); por defecto la general. */
  image?: { url: string; width: number; height: number; alt: string };
  /** Para /gracias/ y páginas de uso interno. */
  noindex?: boolean;
  /** `true` si `title` ya es el título completo (Inicio). */
  absoluteTitle?: boolean;
}): Metadata {
  const url = canonicalPath(path);
  const images = [image ?? ogImage];
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "es_VE",
      siteName: site.name,
      url,
      description,
      images,
    },
    twitter: { card: "summary_large_image", description, images },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

/* -------------------------------------------------------------------------
 * Datos estructurados
 * ---------------------------------------------------------------------- */

export const organizationId = `${site.url}/#empresa`;
export const websiteId = `${site.url}/#sitio`;

/**
 * Ficha de empresa (LocalBusiness) y sitio web, en un único @graph. Nombre,
 * dirección y teléfono deben coincidir con la ficha de Google cuando exista.
 * Pendiente de SEDIN: `geo` (coordenadas), `sameAs` (redes y ficha), código
 * postal y zonas atendidas exactas; se añaden al confirmarse.
 */
export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": organizationId,
        name: site.name,
        legalName: site.legalName,
        alternateName: [site.shortName, "Seguridad y Defensa Integral"],
        taxID: site.rif,
        description: defaultDescription,
        url: absoluteUrl(routes.home),
        logo: `${site.url}/assets/logo-sedin-fondo-claro.png`,
        image: `${site.url}${ogImage.url}`,
        telephone: site.phone,
        email: site.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: site.address,
          addressLocality: "Maracaibo",
          addressRegion: "Zulia",
          addressCountry: "VE",
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            opens: "00:00",
            closes: "23:59",
          },
        ],
        areaServed: [
          { "@type": "City", name: "Maracaibo" },
          { "@type": "State", name: "Zulia" },
        ],
        knowsLanguage: "es",
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: absoluteUrl(routes.home),
        name: site.name,
        inLanguage: "es-VE",
        publisher: { "@id": organizationId },
      },
    ],
  };
}

/* -------------------------------------------------------------------------
 * Sitemap
 * ---------------------------------------------------------------------- */

/**
 * Rutas publicadas e indexables. No incluye /gracias/ (no se indexa) ni
 * /empresas/ficha/, /privacidad/ y /aviso-legal/ mientras no existan:
 * añádalas aquí cuando se publiquen.
 */
export const sitemapPaths: string[] = [
  routes.home,
  routes.sectors,
  ...sectorSlugs.map((slug) => sectorHref(slug)),
  routes.resumen,
  routes.services,
  ...serviceSlugs.map((slug) => serviceHref(slug)),
  routes.comoTrabajamos,
  routes.empresas,
  routes.about,
  routes.faq,
  routes.cotizar,
  routes.contact,
  routes.jobs,
];
