import type { ReactNode } from "react";
import { HeroBackdrop } from "@/components/ui/HeroBackdrop";
import { Breadcrumb, HeroEyebrow, pageHeroClass, type Crumb } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Section";
import { absoluteUrl, routes } from "@/config/site";
import { cn } from "@/lib/cn";

export type ServiceCrumb = Crumb;

/** Titulares más largos que esto van en el tamaño compacto (mismo criterio que PageHero). */
const COMPACT_TITLE_CHARS = 48;

/**
 * Portada de /servicios, de cada servicio y del índice de sectores (propuesta
 * 8.1 y 8.10): la misma foto del puente, el mismo contenedor, antetítulo,
 * titular y resalte que `PageHero`, con un módulo de vidrio a la derecha (la
 * «Ficha del servicio» o un selector). Emite también el BreadcrumbList (15.3).
 *
 * En móvil el módulo se oculta por defecto (`asideOnMobile` lo muestra bajo
 * la entradilla): la portada queda en una pantalla, con los botones de
 * `children` a la vista. Los bloques de botones llevan `data-hero-actions`
 * (ver `usePastHero`): la barra de móvil entra cuando dejan de verse.
 */
export function ServiceHero({
  crumbs,
  path,
  eyebrow,
  title,
  lead,
  aside,
  asideOnMobile = false,
  children,
}: {
  /** Sin «Inicio» (se añade solo). */
  crumbs: ServiceCrumb[];
  /** Ruta de la página actual (para el BreadcrumbList). */
  path: string;
  eyebrow: string;
  title: { text: string; highlight?: string };
  lead: ReactNode;
  /** Módulo de vidrio de la derecha. */
  aside?: ReactNode;
  /** Mostrar el módulo también por debajo de 1024px (bajo la entradilla). */
  asideOnMobile?: boolean;
  /** Bajo la entradilla (enlace o botones). */
  children?: ReactNode;
}) {
  const all: ServiceCrumb[] = [{ label: "Inicio", href: routes.home }, ...crumbs];
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: absoluteUrl(c.href ?? path),
    })),
  };
  const length = title.text.length + (title.highlight ? title.highlight.length + 1 : 0);

  return (
    <section aria-labelledby="pagina-titulo" className={pageHeroClass.section}>
      <HeroBackdrop />
      {/* Velo inferior: asienta el módulo de vidrio y el corte con la sección siguiente. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-azure-950/70 to-transparent"
      />
      <Container className={pageHeroClass.inner}>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          {/* Texto arriba (no centrado): la ruta empieza a la misma altura que en las demás portadas. */}
          <div className="flex min-w-0 flex-col gap-4 sm:gap-5 lg:col-span-7 lg:self-start">
            <Breadcrumb items={crumbs} />
            <HeroEyebrow>{eyebrow}</HeroEyebrow>
            <h1
              id="pagina-titulo"
              className={length > COMPACT_TITLE_CHARS ? pageHeroClass.titleCompact : pageHeroClass.title}
            >
              {title.text}
              {title.highlight && (
                <>
                  {" "}
                  <span className={pageHeroClass.highlight}>{title.highlight}</span>
                </>
              )}
            </h1>
            <p className={pageHeroClass.lead}>{lead}</p>
            {children}
          </div>
          {aside && (
            <div
              className={cn(
                "w-full min-w-0 max-w-[480px] lg:col-span-5 lg:justify-self-end",
                !asideOnMobile && "hidden lg:block",
              )}
            >
              {aside}
            </div>
          )}
        </div>
      </Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/</g, "\\u003c") }}
      />
    </section>
  );
}
