"use client";

import { useSyncExternalStore } from "react";
import { PrinterIcon } from "@/components/icons";
import { buttonClass, type ButtonSize, type ButtonVariant } from "@/components/ui/links";
import { umami } from "@/lib/analytics";
import "./guide-print.css";

const subscribe = () => () => {};

/**
 * «Imprimir la guía»: marca `<html data-sd-print="guia">` para que solo se
 * imprima la guía (`.sd-guia`, ver guide-print.css) y llama a
 * `window.print()`. La marca se quita al terminar (`afterprint`). Sin
 * JavaScript no se pinta: la página se imprime entera desde el navegador.
 */
export function PrintGuideButton({
  label,
  ubicacion,
  variant = "secondary",
  size = "md",
}: {
  label: string;
  ubicacion: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  if (!hydrated) return null;

  function print() {
    const root = document.documentElement;
    root.setAttribute("data-sd-print", "guia");
    window.addEventListener("afterprint", () => root.removeAttribute("data-sd-print"), { once: true });
    window.print();
  }

  return (
    <button
      type="button"
      onClick={print}
      {...umami("guia-8-preguntas", { ubicacion })}
      className={buttonClass({ variant, size })}
    >
      <PrinterIcon size={20} />
      <span>{label}</span>
    </button>
  );
}
