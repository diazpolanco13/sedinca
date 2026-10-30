import { showPending, type SectorSlug } from "@/config/site";

/**
 * Testimonios de clientes. NUNCA se inventan: cada uno se redacta a partir de
 * lo que cuente el cliente y se publica con su aprobación escrita
 * (`authorizedOn`). Nombre, empresa y logo, solo si el cliente lo autoriza;
 * por defecto, cargo y sector.
 *
 * La sección «Clientes que confían en SEDIN» aparece en cuanto haya
 * `MIN_TESTIMONIALS` publicados. Mientras tanto, en modo revisión se ven
 * tarjetas de «pendiente» con marcadores (`testimonialSlots`).
 */

export interface Testimonial {
  id: string;
  /** Texto aprobado por el cliente, sin retoques de fondo. */
  quote: string;
  /** Cargo de quien firma (siempre). */
  role: string;
  sector: SectorSlug;
  /** Contexto anónimo: «Conjunto residencial en el norte de Maracaibo». */
  context?: string;
  /** Solo con autorización escrita. */
  name?: string;
  /** Solo con autorización escrita. */
  company?: string;
  /** Solo con autorización escrita para usar el logo. */
  logo?: { src: string; alt: string };
  /** Fecha de la autorización escrita (AAAA-MM-DD). Sin ella, no se publica. */
  authorizedOn: string;
}

/** Vacío hasta tener testimonios reales y autorizados. */
export const testimonials: Testimonial[] = [];

/** La sección se muestra a partir de este número de testimonios. */
export const MIN_TESTIMONIALS = 2;

export const testimonialsCopy = {
  eyebrow: "Clientes que confían en SEDIN",
  title: "Lo que dicen quienes ya nos confían su seguridad",
  lead: "Testimonios publicados con la autorización escrita de cada cliente.",
} as const;

/** Huecos para el modo revisión: marcadores honestos, nunca textos de cliente. */
export const testimonialSlots: { role: string; context: string; quote: string }[] = [
  {
    role: "[CARGO DEL CLIENTE]",
    context: "[CONDOMINIO · ZONA]",
    quote: "[TESTIMONIO AUTORIZADO POR ESCRITO: cómo estaba la seguridad antes, qué cambió con SEDIN y si nos recomendaría]",
  },
  {
    role: "[CARGO DEL CLIENTE]",
    context: "[EMPRESA O INDUSTRIA · ZONA]",
    quote: "[TESTIMONIO AUTORIZADO POR ESCRITO]",
  },
  {
    role: "[CARGO DEL CLIENTE]",
    context: "[COMERCIO U OFICINA · ZONA]",
    quote: "[TESTIMONIO AUTORIZADO POR ESCRITO]",
  },
];

/** Testimonios publicables (con autorización), opcionalmente de un sector. */
export function publishedTestimonials(sector?: SectorSlug): Testimonial[] {
  return testimonials.filter((t) => t.authorizedOn && (!sector || t.sector === sector));
}

/**
 * ¿Se muestra la sección de testimonios? Sí con suficientes testimonios
 * publicados, o en modo revisión (con los huecos pendientes). Úselo para
 * ocultar también el encabezado de la sección.
 */
export function canShowTestimonials(sector?: SectorSlug): boolean {
  const count = publishedTestimonials(sector).length;
  return count >= (sector ? 1 : MIN_TESTIMONIALS) || showPending;
}
