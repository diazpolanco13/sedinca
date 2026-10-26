import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Espacio reservado para una fotografía o un mapa reales, sobre la trama de
 * puntos de marca.
 * - `tile`: recuadro azul noche con icono abajo (tarjetas de sectores).
 * - `photo`: recuadro azul noche grande con el pie «[Foto] …» centrado.
 * - `map`: recuadro claro para mapas.
 */
export function Placeholder({
  label,
  icon,
  text,
  tone = "tile",
  className,
}: {
  /** Descripción accesible de lo que irá aquí. */
  label: string;
  icon?: ReactNode;
  /** Texto visible opcional, p. ej. «[Foto] Oficial en garita». */
  text?: string;
  tone?: "tile" | "photo" | "map";
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "flex gap-2",
        tone === "tile" && "dot-grid items-end rounded-md bg-azure-900 p-3 text-cyan-200",
        tone === "photo" &&
          "items-center justify-center rounded-xl bg-azure-900 [background-image:radial-gradient(rgba(144,224,239,0.35)_1.5px,transparent_1.5px)] [background-size:16px_16px] p-8 text-azure-100",
        tone === "map" &&
          "dot-grid-brand items-center justify-center rounded-lg border border-line-card bg-surface-brand text-ink-brand",
        className,
      )}
    >
      {icon}
      {text && (
        <span
          className={cn(
            tone === "tile" && "text-sm leading-5",
            tone === "photo" &&
              "max-w-[300px] text-center font-display text-[13px] leading-5 font-semibold tracking-[0.06em] uppercase",
            tone === "map" && "font-display text-[13px] font-semibold tracking-[0.06em] uppercase",
          )}
        >
          {text}
        </span>
      )}
    </div>
  );
}
