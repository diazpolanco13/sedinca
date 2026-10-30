"use client";

import { useSyncExternalStore } from "react";
import { PrinterIcon } from "@/components/icons";
import { buttonClass, type ButtonSize, type ButtonVariant } from "@/components/ui/links";
import { umami } from "@/lib/analytics";

const subscribe = () => () => {};

/**
 * «Imprimir o guardar en PDF» (`window.print()`, evento `resumen-imprimir`).
 * Solo existe con JavaScript: sin él, el resumen se imprime igual desde el
 * menú del navegador.
 */
export function PrintButton({
  label = "Imprimir o guardar en PDF",
  ubicacion = "resumen",
  variant = "secondary",
  size = "md",
  block = false,
}: {
  label?: string;
  ubicacion?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
}) {
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  if (!hydrated) return null;
  return (
    <button
      type="button"
      onClick={() => window.print()}
      {...umami("resumen-imprimir", { ubicacion })}
      className={buttonClass({ variant, size, block })}
    >
      <PrinterIcon size={20} />
      <span>{label}</span>
    </button>
  );
}
