import {
  BuildingIcon,
  CameraIcon,
  FactoryIcon,
  GuardIcon,
  HomeIcon,
  IdCardIcon,
  OilRigIcon,
  TargetIcon,
} from "@/components/icons";
import { ctaLabels, routes, sectorNav, serviceNav, type SectorSlug } from "@/config/site";

type Icon = typeof GuardIcon;

/**
 * Apoyos visuales del menú «Soluciones» y del pie: miniatura de cada sector
 * (recorte de su foto en `public/assets/menu/`, 160×124, unos 3 KB) e icono
 * de cada servicio. Las fotos de sector son de IA: solo ambientación.
 */
export const sectorThumbs: Record<SectorSlug, string> = {
  "petroleo-y-energia": "/assets/menu/petroleo-y-energia.webp",
  "industria-y-logistica": "/assets/menu/industria-y-logistica.webp",
  "comercio-y-oficinas": "/assets/menu/comercio-y-oficinas.webp",
  condominios: "/assets/menu/condominios.webp",
};

export const sectorIcons: Record<SectorSlug, Icon> = {
  "petroleo-y-energia": OilRigIcon,
  "industria-y-logistica": FactoryIcon,
  "comercio-y-oficinas": BuildingIcon,
  condominios: HomeIcon,
};

export const serviceIcons: Record<keyof typeof serviceNav, Icon> = {
  "vigilancia-privada": GuardIcon,
  "control-de-acceso": IdCardIcon,
  "sistemas-electronicos": CameraIcon,
  "gestion-de-riesgos": TargetIcon,
};

/** Busca la miniatura o el icono de un enlace del menú por su `href`. */
export function navVisual(href: string): { thumb?: string; Icon?: Icon } {
  for (const [slug, item] of Object.entries(sectorNav) as [SectorSlug, (typeof sectorNav)[SectorSlug]][]) {
    if (item.href === href) return { thumb: sectorThumbs[slug], Icon: sectorIcons[slug] };
  }
  for (const [slug, item] of Object.entries(serviceNav) as [keyof typeof serviceNav, (typeof serviceNav)[keyof typeof serviceNav]][]) {
    if (item.href === href) return { Icon: serviceIcons[slug] };
  }
  return {};
}

/** Logo para fondo oscuro, 280×133 (13 KB; el PNG original pesa 202 KB). */
export const logoDark = {
  src: "/assets/marca/logo-sedin-fondo-oscuro-280.webp",
  width: 280,
  height: 133,
} as const;

/** Escudo (sello del pie y marca de agua). */
export const shield = {
  small: { src: "/assets/marca/escudo-sedin-96.webp", width: 96, height: 110 },
  large: { src: "/assets/marca/escudo-sedin-320.webp", width: 320, height: 368 },
} as const;

/** Diagnóstico (tarjeta al pie del menú «Soluciones»). */
export const diagnosticCard = {
  href: routes.cotizar,
  title: ctaLabels.diagnostico,
  text: "Cuatro preguntas para recomendarle un esquema para su instalación. Sin compromiso.",
} as const;
