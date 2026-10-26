import Link from "next/link";
import type { ReactNode } from "react";
import { HeroBackdrop } from "@/components/ui/HeroBackdrop";
import { photoPrimary, photoSecondary } from "@/components/ui/links";
import { routes } from "@/config/site";

export type Crumb = { label: string; href?: string };
type Action = { label: string; href: string };

/** Ruta de navegación sobre la foto («Inicio / Servicios / …»); el último elemento es la página actual. */
function Breadcrumb({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ label: "Inicio", href: routes.home }, ...items];
  return (
    <nav aria-label="Ruta" className="text-[15px] leading-5 text-white/72">
      <ol className="m-0 flex list-none flex-wrap gap-2 p-0">
        {all.map((c, i) =>
          i < all.length - 1 && c.href ? (
            <li key={c.label} className="flex gap-2">
              <Link href={c.href} className="text-white/90 no-underline hover:text-white">
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
 */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  lead,
  primary = { label: "Solicitar cotización", href: routes.contact },
  secondary,
}: {
  crumbs: Crumb[];
  eyebrow: string;
  title: { text: string; highlight?: string };
  lead: ReactNode;
  /** `null` oculta el botón primario. */
  primary?: Action | null;
  secondary?: Action;
}) {
  const SecondaryTag = secondary?.href.startsWith("#") ? "a" : Link;
  return (
    <section
      aria-labelledby="pagina-titulo"
      className="relative flex min-h-[560px] flex-col bg-azure-950 pt-16 text-white lg:min-h-[640px] lg:pt-[156px]"
    >
      <HeroBackdrop />
      <div className="on-dark relative mx-auto box-border flex w-full max-w-[1440px] flex-1 flex-col justify-center gap-6 px-4 pt-10 pb-12 sm:px-6 lg:px-14 lg:pt-14 lg:pb-16">
        <Breadcrumb items={crumbs} />
        <span className="font-sans text-[13px] leading-5 font-normal tracking-[0.14em] text-white/72 uppercase sm:text-[15px]">
          {eyebrow}
        </span>
        <h1
          id="pagina-titulo"
          className="m-0 max-w-[760px] font-display text-[clamp(40px,5vw,72px)] leading-[1.04] font-bold tracking-[-0.02em] text-white [text-shadow:0_2px_24px_rgba(4,13,31,0.35)]"
        >
          {title.text}
          {title.highlight && (
            <>
              {" "}
              <span className="text-azure-500">{title.highlight}</span>
            </>
          )}
        </h1>
        <p className="m-0 max-w-[620px] font-sans text-lg leading-7 font-light text-white/92 sm:text-xl sm:leading-8">
          {lead}
        </p>
        {(primary || secondary) && (
          <div className="flex flex-wrap gap-4 pt-1">
            {primary && (
              <Link href={primary.href} className={photoPrimary}>
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
      </div>
    </section>
  );
}
