import { cn } from "@/lib/cn";

/*
 * Clases de botón unificadas (Button, ButtonLink, WhatsAppLink, CallLink,
 * MailLink, ActionLink y el Button de form.tsx salen de aquí).
 *
 * Variantes:
 * - primary   gradient-action con on-brand (acción principal).
 * - secondary superficie con borde line-strong; hover borde brand y fondo
 *             surface-brand. Funciona en claro y dentro de data-theme="dark".
 * - onPhoto   contorno blanco sobre foto o sección oscura.
 * - ghost     solo texto ink-brand; hover con ghost-hover.
 *
 * Tamaños: sm (40px) · md (48px) · lg (56px) · xl (60px, portadas, como el
 * diseño aprobado de Inicio). La altura es mínima: las etiquetas largas
 * («Solicitar propuesta técnica y económica») pasan a dos líneas en móvil.
 *
 * Ojo: `cn` no fusiona clases de Tailwind. No pase en `className` utilidades
 * que choquen con las de la variante o el tamaño (otra altura, otro color,
 * `hidden`…): envuelva el botón o pida una variante nueva.
 */

export type ButtonVariant = "primary" | "secondary" | "onPhoto" | "ghost";
export type ButtonSize = "sm" | "md" | "lg" | "xl";
/** `form`: medida compacta de los formularios (44px), solo para form.tsx. */
type InternalSize = ButtonSize | "form";

const base =
  "inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-(--radius) text-center no-underline transition-[filter,box-shadow,background-color,border-color,color,transform] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 aria-disabled:cursor-not-allowed aria-disabled:opacity-45";

const variants: Record<ButtonVariant, string> = {
  primary:
    "border-0 bg-[image:var(--gradient-action)] text-on-brand shadow-cta hover:text-on-brand hover:brightness-110 hover:shadow-cta-hover",
  secondary:
    "border-[1.5px] border-line-strong bg-surface text-ink hover:border-brand hover:bg-surface-brand hover:text-ink",
  onPhoto:
    "border-2 border-white/85 bg-transparent text-white hover:border-white hover:bg-white/10 hover:text-white",
  ghost: "border-0 bg-transparent text-ink-brand hover:bg-[var(--ghost-hover)] hover:text-ink-brand",
};

const sizes: Record<InternalSize, string> = {
  sm: "min-h-10 px-4 py-2 font-display text-sm leading-5 font-semibold tracking-[0.02em]",
  md: "min-h-12 px-6 py-2.5 font-display text-[15px] leading-5 font-semibold tracking-[0.02em]",
  lg: "min-h-14 px-7 py-3 font-display text-base leading-6 font-semibold tracking-[0.02em]",
  xl: "min-h-[60px] px-8 py-3 font-sans text-[19px] leading-6 font-normal tracking-[0.02em]",
  form: "min-h-11 px-6 py-2 font-display text-sm leading-5 font-semibold tracking-[0.04em]",
};

export function buttonClass({
  variant = "primary",
  size = "md",
  block = false,
  className,
}: {
  variant?: ButtonVariant;
  size?: InternalSize;
  /** A lo ancho en móvil (y automático desde 640px). */
  block?: boolean;
  className?: string;
} = {}) {
  return cn(base, variants[variant], sizes[size], block && "w-full sm:w-auto", className);
}

/** Clases de los enlaces con aspecto de botón primario (sin altura ni padding). */
export const primaryLink =
  "inline-flex items-center rounded-(--radius) bg-[image:var(--gradient-action)] font-display font-bold tracking-[0.04em] text-on-brand no-underline transition-[filter,box-shadow,transform] hover:text-on-brand hover:brightness-[1.08] active:scale-[0.98]";

/** Botones sobre la foto de portada (Inicio y páginas interiores). Equivalen a `buttonClass({ size: "xl" })` y `buttonClass({ variant: "onPhoto", size: "xl" })`. */
export const photoPrimary =
  "inline-flex h-[60px] items-center rounded-(--radius) bg-[image:var(--gradient-action)] px-8 font-sans text-[19px] font-normal tracking-[0.02em] text-on-brand no-underline shadow-cta transition-[filter,box-shadow,transform] hover:text-on-brand hover:brightness-110 hover:shadow-cta-hover active:scale-[0.98]";
export const photoSecondary =
  "inline-flex h-16 items-center rounded-(--radius) border-2 border-white/90 px-[38px] font-sans text-[19px] font-normal tracking-[0.02em] text-white no-underline transition-colors hover:bg-white/10 hover:text-white active:scale-[0.98]";

/** Enlace de texto de marca (dentro de párrafos y tarjetas). */
export const textLink =
  "font-semibold text-ink-brand underline decoration-1 underline-offset-[3px] transition-colors hover:decoration-2";
