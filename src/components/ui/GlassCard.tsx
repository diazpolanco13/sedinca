import type { HTMLAttributes } from "react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

/**
 * Tarjeta de vidrio (BRAND.md, «Elevación»), sobre el Card del sistema.
 * - `level={1}` placa (glass-1, borde line-glass) · `level={2}` módulo activo
 *   (glass-2, borde line-cyan).
 * - `tone="dark"`: vidrio azul noche (data-theme="dark"), para ir sobre la
 *   foto de portada o en una sección oscura con texto claro.
 * - `interactive`: elevación y brillo cian al pasar el cursor.
 */
export function GlassCard({
  tone = "light",
  level = 1,
  accent = false,
  interactive = false,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  tone?: "light" | "dark";
  level?: 1 | 2;
  accent?: boolean;
  interactive?: boolean;
}) {
  return (
    <Card
      elevation={level}
      accent={accent}
      data-theme={tone === "dark" ? "dark" : undefined}
      className={cn(tone === "dark" && "text-ink", interactive && "card-interactive", className)}
      {...props}
    />
  );
}
