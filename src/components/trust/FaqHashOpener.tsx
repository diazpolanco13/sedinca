"use client";

import { useEffect } from "react";

/**
 * Al llegar a /preguntas-frecuentes#<id> (p. ej. desde la guía «8
 * preguntas»), abre el desplegable de esa pregunta. Sin JavaScript, el
 * enlace lleva igual a la pregunta, cerrada. No pinta nada.
 */
export function FaqHashOpener() {
  useEffect(() => {
    function open() {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const target = document.getElementById(id);
      if (target instanceof HTMLDetailsElement && !target.open) {
        target.open = true;
        target.scrollIntoView({ block: "start" });
      }
    }
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, []);
  return null;
}
