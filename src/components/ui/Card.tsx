import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/** Contenedor de vidrio del sistema de diseño (Sedin.Card). */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevation?: "card" | 1 | 2 | 3;
  accent?: boolean;
}

const elevations = {
  card: "bg-glass-card backdrop-blur-glass-1 border border-line-card",
  1: "bg-glass-1 backdrop-blur-glass-1 border border-line-glass shadow-elevation-1",
  2: "bg-glass-2 backdrop-blur-glass-2 border border-line-cyan shadow-elevation-2",
  3: "bg-surface-raised border border-line-modal shadow-elevation-3",
} as const;

export function Card({ elevation = "card", accent = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg p-6",
        elevations[elevation],
        accent &&
          "before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-[image:var(--gradient-accent-line)] before:content-['']",
        className,
      )}
      {...props}
    />
  );
}
