import Link from "next/link";
import type { ReactNode } from "react";
import { HeroBackdrop } from "@/components/ui/HeroBackdrop";
import { photoPrimary, photoSecondary } from "@/components/ui/links";
import { Container } from "@/components/ui/Section";
import { routes } from "@/config/site";
import { cn } from "@/lib/cn";

export type Crumb = { label: string; href?: string };
type Action = { label: string; href: string };

/*
 * Medidas comunes de las portadas sobre la foto del puente. Las exportamos
 * para que las portadas con módulo propio (ServiceHero, InteriorHero,
 * ContactHero) usen exactamente las mismas: mismo contenedor que el
 * encabezado y las secciones (1344px, px-4 sm:px-8), mismo antetítulo que
 * Inicio y el mismo resalte del titular.
 */
export const pageHeroClass = {
  /** `<section>`: el encabezado (64px en móvil, 128px en escritorio) va superpuesto. */
  section: "relative isolate flex min-h-[560px] flex-col bg-azure-950 pt-16 text-white lg:pt-32",
  /** Relleno del contenido dentro de `<Container>`. */
  inner: "on-dark relative flex flex-1 flex-col justify-center pt-10 pb-12 lg:pt-8 lg:pb-16",
  /*
   * Ancho del titular desde 1024px: el 60 % del contenedor (≈ la columna de
   * las portadas con módulo), en vw para no depender de la columna en que
   * va. Así termina antes de la radio del vigilante de la foto (≈ 65 % del
   * ancho de pantalla) en cualquier escritorio; con 900px llegaba encima de
   * ella y la palabra resaltada quedaba sobre la mano.
   */
  /** Titular de 72px (titulares cortos). */
  title:
    "m-0 max-w-[900px] lg:max-w-[min(768px,calc(60vw-38px))] font-display text-[clamp(40px,5vw,72px)] leading-[1.04] font-bold tracking-[-0.02em] text-balance text-white [text-shadow:0_2px_24px_rgba(4,13,31,0.35)]",
  /** Titular compacto (más de ~48 caracteres: sectores, por ejemplo). */
  titleCompact:
    "m-0 max-w-[920px] lg:max-w-[min(768px,calc(60vw-38px))] font-display text-[clamp(36px,4.2vw,60px)] leading-[1.06] font-bold tracking-[-0.02em] text-balance text-white [text-shadow:0_2px_24px_rgba(4,13,31,0.35)]",
  /** Palabra resaltada del titular: azure-300 (Accent en oscuro) con sombra, por contraste sobre el atardecer. */
  highlight: "text-azure-300 [text-shadow:0_2px_16px_rgba(4,13,31,0.55)]",
  lead: "m-0 max-w-[620px] font-sans text-lg leading-7 font-light text-white/92 sm:text-xl sm:leading-8",
} as const;

/** Titulares más largos que esto pasan al tamaño compacto. */
const COMPACT_TITLE_CHARS = 48;

/** Antetítulo de portada (el mismo de Inicio): Space Grotesk con la raya cian. */
export function HeroEyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "m-0 inline-flex items-center gap-3 font-display text-[11px] leading-4 font-semibold tracking-[0.14em] text-white/80 uppercase sm:text-[13px] sm:leading-5",
        className,
      )}
    >
      <span aria-hidden="true" className="h-0.5 w-8 flex-none rounded-full bg-[image:var(--gradient-accent-line)] sm:w-10" />
      {children}
    </p>
  );
}

/**
 * Ruta de navegación sobre la foto («Inicio / Servicios / …»); el último
 * elemento es la página actual. Cada enlace tiene 44px de área táctil sin
 * cambiar el aspecto (relleno y margen negativo).
 */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ label: "Inicio", href: routes.home }, ...items];
  return (
    <nav aria-label="Ruta" className="text-[15px] leading-5 text-white/72">
      <ol className="m-0 flex list-none flex-wrap gap-x-2 gap-y-1 p-0">
        {all.map((c, i) =>
          i < all.length - 1 && c.href ? (
            <li key={c.label} className="flex items-center gap-2">
              <Link
                href={c.href}
                prefetch={false}
                className="-my-3 inline-flex items-center py-3 text-white/90 no-underline hover:text-white hover:underline"
              >
                {c.label}
              </Link>
              <span aria-hidden="true">/</span>
            </li>
          ) : (
            <li key={c.label} aria-current="page">
              {c.label}
            </li>
          ),
        )}
      </ol>
    </nav>
  );
}

/**
 * Portada de página interior: la misma foto, velos y encabezado transparente
 * que Inicio (01-inicio), más baja y con ruta de navegación. El SiteHeader
 * se superpone arriba, igual que en Inicio.
 *
 * - Contenedor alineado con el logo y las secciones (`<Container>`).
 * - Titular de 72px; si es largo (más de ~48 caracteres) pasa solo al tamaño
 *   compacto, para que los botones queden en la primera pantalla de un
 *   portátil (1366×768). `titleSize` lo fuerza.
 * - `actions`: botones propios (fuera de la entradilla). `aside`: módulo a la
 *   derecha desde 1024px (selector, ficha…).
 * - El último bloque de botones lleva `data-hero-actions`: la barra de móvil
 *   y el botón flotante de WhatsApp aparecen cuando sale de pantalla. Si los
 *   botones van dentro de la entradilla (`lead`), se marca la entradilla.
 */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  lead,
  primary = null,
  secondary,
  actions,
  aside,
  titleSize,
}: {
  crumbs: Crumb[];
  eyebrow: string;
  title: { text: string; highlight?: string };
  lead: ReactNode;
  /** Botón principal (enlace interno). `null` u omitido: sin botón. */
  primary?: Action | null;
  secondary?: Action;
  /** Botones propios (p. ej. `<ActionGroup tone="photo" />`), tras la entradilla. */
  actions?: ReactNode;
  /** Módulo a la derecha desde 1024px. */
  aside?: ReactNode;
  /** Tamaño del titular; por defecto, según su longitud. */
  titleSize?: "default" | "compact";
}) {
  const SecondaryTag = secondary?.href.startsWith("#") ? "a" : Link;
  const hasButtons = Boolean(primary || secondary || actions);
  const hasAside = Boolean(aside);
  const length = title.text.length + (title.highlight ? title.highlight.length + 1 : 0);
  const compact = titleSize ? titleSize === "compact" : length > COMPACT_TITLE_CHARS;
  const actionsAttr = { "data-hero-actions": "" };

  return (
    <section aria-labelledby="pagina-titulo" className={pageHeroClass.section}>
      <HeroBackdrop />
      <Container className={pageHeroClass.inner}>
        <div className={cn("grid gap-10", hasAside && "lg:grid-cols-12 lg:items-center lg:gap-10")}>
          <div className={cn("flex min-w-0 flex-col gap-4 sm:gap-5", hasAside && "lg:col-span-7")}>
            <Breadcrumb items={crumbs} />
            <HeroEyebrow>{eyebrow}</HeroEyebrow>
            <h1 id="pagina-titulo" className={compact ? pageHeroClass.titleCompact : pageHeroClass.title}>
              {title.text}
              {title.highlight && (
                <>
                  {" "}
                  <span className={pageHeroClass.highlight}>{title.highlight}</span>
                </>
              )}
            </h1>
            <p className={pageHeroClass.lead} {...(hasButtons ? {} : actionsAttr)}>
              {lead}
            </p>
            {hasButtons && (
              <div className="flex flex-col gap-4 pt-1" {...actionsAttr}>
                {(primary || secondary) && (
                  <div className="flex flex-wrap gap-4">
                    {primary && (
                      <Link href={primary.href} prefetch={false} className={photoPrimary}>
                        {primary.label}
                      </Link>
                    )}
                    {secondary && (
                      <SecondaryTag href={secondary.href} className={photoSecondary}>
                        {secondary.label}
                      </SecondaryTag>
                    )}
                  </div>
                )}
                {actions}
              </div>
            )}
          </div>
          {hasAside && <div className="min-w-0 lg:col-span-5">{aside}</div>}
        </div>
      </Container>
    </section>
  );
}
