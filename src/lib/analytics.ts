/**
 * Eventos de Umami (propuesta, 15.5). Se miden con atributos `data-umami-*`
 * en el propio enlace o botón: no hace falta JavaScript propio y, mientras el
 * script de Umami no esté cargado, los atributos no hacen nada.
 */
export const umamiEvents = {
  whatsapp: "whatsapp",
  whatsappCopiar: "whatsapp-copiar",
  telefono: "telefono",
  correo: "correo",
  comoLlegar: "como-llegar",
  ctaCotizar: "cta-cotizar",
  propuestaFormal: "propuesta-formal",
  visitaTecnica: "visita-tecnica",
  kitSolicitud: "kit-solicitud",
  compartirJunta: "compartir-junta",
  resumenImprimir: "resumen-imprimir",
  guia8Preguntas: "guia-8-preguntas",
  referenciaSolicitud: "referencia-solicitud",
  vcardDescarga: "vcard-descarga",
  postulacionWhatsapp: "postulacion-whatsapp",
  postulacionEnviada: "postulacion-enviada",
  cotizadorResultado: "cotizador-resultado",
  cotizadorWhatsapp: "cotizador-whatsapp",
  cotizadorPropuesta: "cotizador-propuesta",
  cotizadorLlamada: "cotizador-llamada",
  cotizadorError: "cotizador-error",
} as const;

export type UmamiEvent = (typeof umamiEvents)[keyof typeof umamiEvents];

export type UmamiAttributes = { "data-umami-event": string } & {
  [key: `data-umami-event-${string}`]: string;
};

/**
 * Atributos de Umami para esparcir en un `<a>` o `<button>`:
 * `<a {...umami("whatsapp", { ubicacion: "sector-condominios" })}>`.
 * La propiedad `ubicacion` sigue la convención de 15.5: `barra-movil`,
 * `flotante`, `portada`, `servicio-<slug>`, `sector-<slug>`, `contacto`,
 * `cierre`…
 */
export function umami(
  event: string,
  data?: Record<string, string | undefined>,
): UmamiAttributes {
  const attrs: UmamiAttributes = { "data-umami-event": event };
  for (const [key, value] of Object.entries(data ?? {})) {
    if (value) attrs[`data-umami-event-${key}`] = value;
  }
  return attrs;
}
