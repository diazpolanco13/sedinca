import { showPending, type SectorSlug } from "@/config/site";
import type { ServiceContent } from "@/content/services";

/**
 * Casos de éxito «Reto → Solución → Resultado». NUNCA se inventan: se
 * redactan con lo que cuente cada cliente, anonimizados si así lo pide, y se
 * publican con su aprobación escrita (`authorizedOn`). Sin cifras que el
 * cliente no haya confirmado.
 *
 * Vacío hasta tenerlos; en modo revisión se ven huecos con marcadores
 * (`caseSlots`).
 */

export interface CaseStudy {
  id: string;
  sector: SectorSlug;
  /** Cliente tal como se puede nombrar: «Planta industrial en San Francisco». */
  clientLabel: string;
  title: string;
  challenge: string;
  solution: string;
  result: string;
  services: ServiceContent["slug"][];
  /** Foto real con permiso del cliente (nunca IA). */
  photo?: { src: string; alt: string };
  /** Fecha de la autorización escrita (AAAA-MM-DD). Sin ella, no se publica. */
  authorizedOn: string;
}

/** Vacío hasta tener casos reales y autorizados. */
export const caseStudies: CaseStudy[] = [];

export const casesCopy = {
  eyebrow: "Casos de éxito",
  title: "Del reto al resultado",
  lead: "Casos reales de clientes de SEDIN, publicados con su autorización.",
} as const;

/** Huecos para el modo revisión. */
export const caseSlots: { clientLabel: string; challenge: string; solution: string; result: string }[] = [
  {
    clientLabel: "[TIPO DE INSTALACIÓN · ZONA]",
    challenge: "[RETO: cómo estaba la seguridad antes, contado por el cliente]",
    solution: "[SOLUCIÓN: qué servicio puso SEDIN y cómo]",
    result: "[RESULTADO: qué cambió, con datos que el cliente confirme]",
  },
  {
    clientLabel: "[TIPO DE INSTALACIÓN · ZONA]",
    challenge: "[RETO]",
    solution: "[SOLUCIÓN]",
    result: "[RESULTADO]",
  },
  {
    clientLabel: "[TIPO DE INSTALACIÓN · ZONA]",
    challenge: "[RETO]",
    solution: "[SOLUCIÓN]",
    result: "[RESULTADO]",
  },
];

export function publishedCases(sector?: SectorSlug): CaseStudy[] {
  return caseStudies.filter((c) => c.authorizedOn && (!sector || c.sector === sector));
}

/** ¿Se muestra la sección de casos? (con casos publicados o en modo revisión). */
export function canShowCases(sector?: SectorSlug): boolean {
  return publishedCases(sector).length > 0 || showPending;
}
