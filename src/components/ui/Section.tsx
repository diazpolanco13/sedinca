import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/*
 * Ritmo de secciones (dirección de arte, fase 1):
 *   portada (foto) → light → sunken → dark → light → brand → dark (cierre)
 * Nunca dos secciones seguidas del mismo tono, salvo light/sunken alternos.
 */

export type SectionTone = "light" | "page" | "sunken" | "brand" | "dark";
export type SectionSpace = "default" | "tight" | "none";

const tones: Record<SectionTone, string> = {
  /** Blanco (surface). */
  light: "bg-surface text-ink",
  /** Fondo de página (bg, azul muy pálido). */
  page: "bg-bg text-ink",
  /** Gris hundido (surface-sunken). */
  sunken: "bg-surface-sunken text-ink",
  /** Tinte de marca (surface-brand, azure-50). */
  brand: "bg-surface-brand text-ink",
  /** Azul medianoche con trama y luz cian; activa data-theme="dark". */
  dark: "section-dark text-ink",
};

const spaces: Record<SectionSpace, string> = {
  default: "py-20 lg:py-28",
  tight: "py-14 lg:py-20",
  none: "",
};

/** Contenedor del sitio: 1280px de contenido + 32px de margen (16px en móvil). */
export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-[1344px] px-4 sm:px-8", className)}>{children}</div>;
}

/**
 * Sección de página con fondo, espaciado vertical y contenedor.
 * `tone="dark"` pone `data-theme="dark"`: dentro, `text-ink`, `text-ink-muted`,
 * `border-line`, `bg-surface`, Card, FaqList, Timeline… adoptan solos sus
 * valores oscuros, y el foco pasa a cian.
 */
export function Section({
  tone = "light",
  space = "default",
  id,
  labelledBy,
  label,
  contained = true,
  className,
  containerClassName,
  children,
}: {
  tone?: SectionTone;
  space?: SectionSpace;
  id?: string;
  /** id del titular (aria-labelledby). */
  labelledBy?: string;
  /** Nombre accesible si no hay titular visible. */
  label?: string;
  /** false = sin contenedor (secciones a sangre). */
  contained?: boolean;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={label ? undefined : labelledBy}
      aria-label={label}
      data-theme={tone === "dark" ? "dark" : undefined}
      className={cn("relative scroll-mt-24", tones[tone], spaces[space], className)}
    >
      {contained ? <Container className={containerClassName}>{children}</Container> : children}
    </section>
  );
}

/** Resalte de una palabra del titular (azure-700 en claro, azure-300 en oscuro). */
export function Accent({ children }: { children: ReactNode }) {
  return <span className="text-ink-brand">{children}</span>;
}

/**
 * Antetítulo + titular grande + entradilla.
 * - `size="lg"` (por defecto): clamp(32px, 4.4vw, 56px), para secciones.
 * - `size="md"`: clamp(26px, 3vw, 40px), para bloques secundarios.
 * Compatible con el SectionHeader anterior de blocks.tsx (`children` = entradilla).
 */
export function SectionHeader({
  eyebrow,
  title,
  lead,
  id,
  align = "start",
  size = "lg",
  as: Tag = "h2",
  actions,
  className,
  children,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  /** id del titular, para `aria-labelledby` de la sección. */
  id?: string;
  align?: "start" | "center";
  size?: "lg" | "md";
  as?: "h1" | "h2" | "h3";
  /** Botones o enlace bajo la entradilla. */
  actions?: ReactNode;
  className?: string;
  /** Entradilla (compatibilidad). */
  children?: ReactNode;
}) {
  const body = lead ?? children;
  return (
    <div
      className={cn(
        "flex max-w-[760px] flex-col gap-4",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      {eyebrow && (
        <span className="eyebrow inline-flex items-center gap-3 text-ink-brand">
          <span aria-hidden="true" className="h-0.5 w-8 rounded-full bg-[image:var(--gradient-accent-line)]" />
          {eyebrow}
        </span>
      )}
      <Tag
        id={id}
        className={cn(
          "m-0 font-display font-bold text-balance text-ink",
          size === "lg"
            ? "text-[clamp(32px,4.4vw,56px)] leading-[1.06] tracking-[-0.025em]"
            : "text-[clamp(26px,3vw,40px)] leading-[1.12] tracking-[-0.015em]",
        )}
      >
        {title}
      </Tag>
      {body && (
        <p
          className={cn(
            "m-0 max-w-[640px] text-lg leading-7 text-ink-muted sm:text-[19px] sm:leading-[30px]",
            align === "center" && "mx-auto",
          )}
        >
          {body}
        </p>
      )}
      {actions && <div className="pt-2">{actions}</div>}
    </div>
  );
}
