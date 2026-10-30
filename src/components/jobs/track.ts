/**
 * Evento de Umami lanzado desde el código (15.5: `postulacion-whatsapp`,
 * `postulacion-enviada`…), para acciones que no son un simple clic en un
 * enlace: solo cuentan si el formulario pasó la validación. Mientras el
 * script de Umami no esté cargado (o sin `NEXT_PUBLIC_UMAMI_ID`), no hace
 * nada.
 */
type UmamiWindow = Window & {
  umami?: { track: (event: string, data?: Record<string, string>) => void };
};

export function trackEvent(event: string, data?: Record<string, string>) {
  if (typeof window === "undefined") return;
  try {
    (window as UmamiWindow).umami?.track(event, data);
  } catch {
    // La analítica nunca debe romper el envío.
  }
}
