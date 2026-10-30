import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Aparición suave al desplazar, SOLO con CSS (`animation-timeline: view()`,
 * clases `.reveal` y `.reveal-fade` de globals.css). Sin soporte, sin
 * JavaScript o con «reducir movimiento», el contenido está visible desde el
 * principio.
 *
 * Úselo en piezas más bajas que la pantalla (titulares, tarjetas, filas),
 * nunca en una sección entera ni en la portada.
 */
export function Reveal({
  as: Tag = "div",
  variant = "up",
  className,
  children,
  ...props
}: HTMLAttributes<HTMLElement> & {
  as?: "div" | "li" | "article" | "span" | "figure" | "header";
  /** `up`: sube y aparece · `fade`: solo aparece. */
  variant?: "up" | "fade";
  children: ReactNode;
}) {
  return (
    <Tag className={cn(variant === "fade" ? "reveal-fade" : "reveal", className)} {...props}>
      {children}
    </Tag>
  );
}
