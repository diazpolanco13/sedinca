import { useSearchParams } from "next/navigation";
import {
  sectorNav,
  sectorSlugs,
  serviceNav,
  serviceSlugs,
  type SectorSlug,
} from "@/config/site";

/*
 * Utilidades comunes del formulario de cotización (QuoteForm) y del
 * diagnóstico (QuoteWizard). Solo dependen de `site.ts`: pueden ir en el
 * paquete de cliente sin arrastrar contenidos con [MARCADORES].
 */

export type ServiceSlug = (typeof serviceSlugs)[number];

/** Inicio común de los mensajes (propuesta, 11.6). */
export const WA_FROM = "Hola, SEDIN. Les escribo desde sedinca.com";

export const PHONE_RE = /^\+?[\d\s().-]{7,20}$/;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const nameError = "Escriba su nombre y apellido.";
export const phoneError = "Escriba un teléfono válido, por ejemplo 0414 123 4567.";
export const emailError = "Revise el correo, por ejemplo nombre@empresa.com.";

export function isSectorSlug(value: string | null | undefined): value is SectorSlug {
  return !!value && (sectorSlugs as readonly string[]).includes(value);
}

export function isServiceSlug(value: string | null | undefined): value is ServiceSlug {
  return !!value && (serviceSlugs as readonly string[]).includes(value);
}

export const serviceLabel = (slug: ServiceSlug) => serviceNav[slug].label;
export const sectorLabel = (slug: SectorSlug) => sectorNav[slug].label;

export interface QuoteParams {
  sector?: SectorSlug;
  servicio?: ServiceSlug;
}

/**
 * `?sector=` y `?servicio=` de la URL (los pone `cotizarHref`). Usa
 * `useSearchParams`, así que el componente que lo llame debe ir dentro de un
 * `<Suspense>`: en la exportación estática se pinta el `fallback` (sin
 * parámetros) y en el navegador se vuelve a pintar con ellos.
 */
export function useQuoteParams(): QuoteParams & { key: string } {
  const params = useSearchParams();
  const sector = params.get("sector");
  const servicio = params.get("servicio");
  const result: QuoteParams = {
    sector: isSectorSlug(sector) ? sector : undefined,
    servicio: isServiceSlug(servicio) ? servicio : undefined,
  };
  return { ...result, key: `${result.sector ?? ""}|${result.servicio ?? ""}` };
}

/**
 * Abre WhatsApp en otra pestaña (o en la app, en el teléfono). Si el
 * navegador bloquea la ventana, navega en la misma.
 */
export function openExternal(url: string) {
  const win = window.open(url, "_blank");
  if (win) win.opener = null;
  else window.location.href = url;
}

type UmamiWindow = Window & {
  umami?: { track: (event: string, data?: Record<string, string>) => void };
};

/** Evento de Umami desde el código (15.5); no hace nada sin el script. */
export function track(event: string, data?: Record<string, string | undefined>) {
  try {
    const clean = Object.fromEntries(
      Object.entries(data ?? {}).filter((entry): entry is [string, string] => !!entry[1]),
    );
    (window as UmamiWindow).umami?.track(event, clean);
  } catch {
    /* La medición nunca debe romper el envío. */
  }
}
