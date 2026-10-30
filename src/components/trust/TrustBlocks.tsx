import type { ReactNode } from "react";
import { CheckCircleIcon, CheckIcon } from "@/components/icons";
import { ActionLink } from "@/components/ui/ActionLink";
import { Pend, SourceNote } from "@/components/ui/Pending";
import type { CtaAction } from "@/config/site";
import { cn } from "@/lib/cn";
import { filterPending, type Sentences } from "@/lib/pending";
import type { Icon } from "./content";

/*
 * Piezas comunes de las páginas de confianza (/como-trabajamos, /empresas,
 * /preguntas-frecuentes). Solo componentes de servidor: nada con
 * [MARCADORES] viaja a un componente cliente.
 */

/**
 * Entradilla de portada con botones (y, opcional, franja de hechos), para el
 * `lead` de `<PageHero>`. Solo pinta elementos de frase (`<span>`, `<a>`):
 * es HTML válido dentro del `<p>` de la entradilla.
 */
export function HeroLead({
  text,
  actions,
  facts,
}: {
  text: ReactNode;
  actions?: readonly CtaAction[];
  facts?: readonly string[];
}) {
  const [primary, secondary] = actions ?? [];
  return (
    <>
      <span className="block">{text}</span>
      {(primary || secondary) && (
        // Desde 1024px, en una fila aunque pasen del ancho de la entradilla (620px).
        <span className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 lg:w-max lg:flex-nowrap">
          {primary && <ActionLink action={primary} variant="primary" size="lg" block />}
          {secondary && <ActionLink action={secondary} variant="onPhoto" size="lg" block />}
        </span>
      )}
      {facts && facts.length > 0 && (
        <span className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-display text-[12px] leading-4 font-semibold tracking-[0.08em] text-white/88 uppercase sm:text-[13px]">
          {facts.map((fact) => (
            <span key={fact} className="inline-flex items-center gap-2">
              <CheckCircleIcon size={18} className="flex-none text-cyan-300" />
              {fact}
            </span>
          ))}
        </span>
      )}
    </>
  );
}

/** Icono de trazo en una placa (claro: tinte de marca; oscuro: vidrio con borde cian). */
export function IconBadge({
  Icon,
  size = "md",
  tone = "light",
  className,
}: {
  Icon: Icon;
  size?: "sm" | "md" | "lg";
  tone?: "light" | "dark";
  className?: string;
}) {
  const box = { sm: "h-10 w-10", md: "h-12 w-12", lg: "h-14 w-14" }[size];
  const glyph = { sm: 20, md: 24, lg: 28 }[size];
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex flex-none items-center justify-center rounded-md",
        box,
        tone === "dark"
          ? "border border-line-cyan bg-accent-subtle text-cyan-300"
          : "bg-surface-brand text-ink-brand",
        className,
      )}
    >
      <Icon size={glyph} />
    </span>
  );
}

/** Número de dos cifras en Space Grotesk («01»), decorativo. */
export function StepNumber({ n, className }: { n: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("font-display text-sm leading-5 font-bold tracking-[0.08em] text-ink-accent", className)}
    >
      {String(n).padStart(2, "0")}
    </span>
  );
}

/**
 * Lista con marcas de verificación. En producción quita los elementos con
 * [MARCADOR]; en revisión los resalta.
 */
export function CheckList({
  items,
  columns = 1,
  className,
  itemClassName,
}: {
  items: readonly Sentences[];
  columns?: 1 | 2;
  className?: string;
  itemClassName?: string;
}) {
  const visible = filterPending(items, (item) => item);
  if (visible.length === 0) return null;
  return (
    <ul
      className={cn(
        "m-0 grid list-none gap-x-8 gap-y-3 p-0",
        columns === 2 && "sm:grid-cols-2",
        className,
      )}
    >
      {visible.map((item, i) => (
        <li key={i} className={cn("flex gap-3 text-[15px] leading-[22px] text-ink", itemClassName)}>
          <CheckIcon size={18} className="mt-0.5 flex-none text-ink-accent" />
          <span>
            <Pend text={item} />
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Título de tarjeta (h3 por defecto). */
export function CardTitle({
  as: Tag = "h3",
  className,
  children,
}: {
  as?: "h2" | "h3" | "h4";
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      className={cn(
        "m-0 font-display text-xl leading-7 font-bold tracking-[-0.01em] text-ink sm:text-2xl sm:leading-8",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** Texto de tarjeta con pendientes y su fuente (la fuente, solo en revisión). */
export function CardText({
  text,
  source,
  size = "md",
  className,
}: {
  text: Sentences;
  source?: string;
  /** `sm`: 15/22 · `md`: 15/24, 16/26 desde 640px. */
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <>
      <Pend
        as="p"
        className={cn(
          "m-0 text-ink-muted",
          size === "sm" ? "text-[15px] leading-[22px]" : "text-[15px] leading-6 sm:text-base sm:leading-[26px]",
          className,
        )}
        text={text}
      />
      <SourceNote source={source} />
    </>
  );
}
