"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";

const noop = () => () => {};

/** `true` solo en el navegador, tras hidratar (en el HTML estático es `false`). */
export function useHydrated() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

/** Selector de la portada: primer hijo de `<main id="contenido">` (Hero o PageHero). */
export const HERO_SELECTOR = "#contenido > :first-child";

/**
 * Atributo que marca, dentro de la portada, el bloque de botones principales
 * (Hero, PageHero, `HeroActions`…). Con `watch: "actions"`, la portada cuenta
 * como pasada en cuanto esos botones dejan de verse.
 */
export const HERO_ACTIONS_ATTR = "data-hero-actions";

/**
 * ¿Ya se pasó la portada? Un único IntersectionObserver sobre la portada de
 * la página (se reengancha al cambiar de ruta). Lo usan el encabezado
 * compacto fijo, la barra de móvil y el botón flotante de WhatsApp. Sin
 * JavaScript o sin soporte devuelve `false` y la página funciona igual
 * (encabezado normal; la barra y el botón flotante se muestran con una regla
 * en <noscript>).
 *
 * @param offset alto del encabezado compacto: la portada cuenta como pasada
 *   cuando su borde inferior queda por encima de esta línea.
 * @param watch `"hero"` observa la portada entera; `"actions"` observa sus
 *   botones (`[data-hero-actions]`) si existen, para que las acciones fijas
 *   (barra de móvil, botón flotante) entren justo cuando los botones de la
 *   portada salen de pantalla, también en portadas muy altas.
 */
export function usePastHero(offset = 72, watch: "hero" | "actions" = "hero") {
  const pathname = usePathname();
  const [past, setPast] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const hero = document.querySelector(HERO_SELECTOR);
    // Página sin portada: se observa el principio del contenido.
    const actions =
      watch === "actions" ? hero?.querySelectorAll(`[${HERO_ACTIONS_ATTR}]`) : undefined;
    // Si hay varios bloques (p. ej. uno para móvil y otro para escritorio),
    // vale el último que se vea.
    const visibleActions = actions
      ? Array.from(actions).filter((el) => (el as HTMLElement).offsetParent !== null)
      : [];
    const target = visibleActions.at(-1) ?? hero ?? document.getElementById("contenido");
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setPast(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { rootMargin: `-${offset}px 0px 0px 0px` },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [pathname, offset, watch]);

  return past;
}
