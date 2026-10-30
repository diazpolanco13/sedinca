import { Fragment, type ReactNode } from "react";
import { hasPending, showPending } from "@/config/site";
import { cn } from "@/lib/cn";
import { splitMarkers, visibleSentences, type Sentences } from "@/lib/pending";

/*
 * Sistema de pendientes.
 * - Producción (sin NEXT_PUBLIC_SHOW_PENDING): lo que tenga [MARCADORES] no
 *   se publica.
 * - Revisión (NEXT_PUBLIC_SHOW_PENDING=1): se ve resaltado, con borde
 *   discontinuo cian y la etiqueta «PENDIENTE DE CONFIRMAR».
 */

type TextTag = "span" | "p" | "li" | "div" | "strong" | "em" | "h2" | "h3" | "h4" | "dd" | "dt";

function Sentence({ text }: { text: string }) {
  if (!hasPending(text)) return <>{text}</>;
  return (
    <span className="pending-sentence" title="Pendiente de confirmar">
      {splitMarkers(text).map((part, i) =>
        part.marker ? (
          <mark key={i} className="pending-mark">
            {part.text}
          </mark>
        ) : (
          <Fragment key={i}>{part.text}</Fragment>
        ),
      )}
    </span>
  );
}

/**
 * Texto con pendientes. `text` es una cadena o una lista de frases; en
 * producción se omiten las frases con [MARCADOR] y, si no queda ninguna, no
 * se pinta nada (tampoco la etiqueta `as`).
 *
 *   <Pend as="p" className="text-ink-muted" text={answer.body} />
 */
export function Pend({ text, as, className }: { text: Sentences; as?: TextTag; className?: string }) {
  const parts = visibleSentences(text);
  if (parts.length === 0) return null;
  const content = parts.map((sentence, i) => (
    <Fragment key={i}>
      {i > 0 && " "}
      <Sentence text={sentence} />
    </Fragment>
  ));
  if (!as) return <>{content}</>;
  const Tag = as;
  return <Tag className={className}>{content}</Tag>;
}

/**
 * Bloque entero que depende de un dato de SEDIN (compromisos, testimonios,
 * mapa de cobertura…). Si `pending` es falso, pinta el contenido tal cual; si
 * es verdadero, en producción no pinta nada y en revisión lo enmarca con la
 * etiqueta «PENDIENTE DE CONFIRMAR · {label}».
 *
 *   <PendingBlock label="Compromisos" needs="Tiempo de reemplazo" pending={hasPending(site.guardPhone)}>…</PendingBlock>
 */
export function PendingBlock({
  label,
  needs,
  pending = true,
  className,
  children,
}: {
  label?: string;
  /** Qué debe confirmar o aportar SEDIN (solo visible en revisión). */
  needs?: ReactNode;
  pending?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  if (!pending) return <>{children}</>;
  if (!showPending) return null;
  return (
    <div className={cn("pending-block", className)} data-pending="">
      <span className="pending-label">
        Pendiente de confirmar{label ? ` · ${label}` : ""}
      </span>
      {needs && <p className="m-0 mb-3 text-sm leading-5 text-ink-muted">{needs}</p>}
      {children}
    </div>
  );
}

/**
 * Hueco para una foto real que aún no existe (sesión de fotos). En
 * producción no se pinta; en revisión se ve el recuadro con la descripción.
 */
export function PendingPhoto({
  label,
  className,
}: {
  /** Qué foto va aquí: «Supervisor revisando el libro de novedades». */
  label: string;
  /** Tamaño o proporción, p. ej. `aspect-[4/3]`. */
  className?: string;
}) {
  if (!showPending) return null;
  return (
    <div
      role="img"
      aria-label={`Foto pendiente: ${label}`}
      className={cn(
        "pending-block dot-grid-brand flex min-h-48 w-full max-w-full min-w-0 items-center justify-center bg-surface-brand text-ink-brand",
        className,
      )}
    >
      <span className="pending-label">Pendiente de confirmar · Foto real</span>
      <span className="max-w-[320px] text-center font-display text-[13px] leading-5 font-semibold tracking-[0.06em] uppercase">
        [Foto real] {label}
      </span>
    </div>
  );
}

/**
 * Fuente interna de un dato (artículo del reglamento). Solo se ve en modo
 * revisión, para que SEDIN valide cada hecho.
 */
export function SourceNote({ source, className }: { source?: string; className?: string }) {
  if (!showPending || !source) return null;
  return (
    <span
      className={cn(
        "inline-block font-display text-[11px] leading-4 font-semibold tracking-[0.06em] text-ink-accent uppercase",
        className,
      )}
    >
      Fuente: {source}
    </span>
  );
}

/**
 * Aviso fijo del modo revisión (para el layout). En producción no se pinta.
 * En escritorio va centrado en la barra fina del encabezado; por debajo de
 * 1024px, en una sola línea y con texto corto, justo bajo el encabezado de
 * 64px (en el hueco antes de la ruta de la portada), para no tapar el logo
 * ni el botón de llamar.
 */
export function PendingModeBadge() {
  if (!showPending) return null;
  return (
    <div
      role="status"
      className="pointer-events-none fixed top-3 left-1/2 z-[60] -translate-x-1/2 rounded-full border-2 border-dashed border-accent bg-azure-950 px-4 py-1.5 font-display text-[11px] leading-4 font-bold tracking-[0.08em] whitespace-nowrap text-cyan-200 uppercase shadow-elevation-2 max-lg:top-[68px] max-lg:px-3 max-lg:py-1"
    >
      <span className="lg:hidden">Revisión · pendientes visibles</span>
      <span className="max-lg:hidden">Modo revisión · se muestran los pendientes</span>
    </div>
  );
}
