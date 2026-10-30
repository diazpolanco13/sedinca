import type { ReactNode } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { HeroBackdrop } from "@/components/ui/HeroBackdrop";
import { Breadcrumb, HeroEyebrow, pageHeroClass, type Crumb } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Section";
import { absoluteUrl, routes } from "@/config/site";

export type HeroCrumb = Crumb;

/**
 * Portada de /nosotros y /empleo (propuesta 8.10): la foto del puente con el
 * encabezado transparente encima, con las medidas de `PageHero` (mismo
 * contenedor que el logo y las secciones, mismo antetítulo y resalte en
 * azure-300). Sin módulo lateral: el vigilante de la foto, modelo de la
 * marca, queda libre a la derecha. Bajo los botones, una franja corta de
 * hechos o requisitos (`facts`). Emite el BreadcrumbList (15.3).
 *
 * Difiere de `PageHero` en que admite un antetítulo con pendientes, botones
 * con glifo y evento (`actions`) y la franja de hechos fuera del bloque de
 * botones.
 */
export function InteriorHero({
  crumbs,
  path,
  eyebrow,
  title,
  lead,
  actions,
  facts,
}: {
  /** Sin «Inicio» (se añade solo). */
  crumbs: HeroCrumb[];
  /** Ruta de la página actual (para el BreadcrumbList). */
  path: string;
  eyebrow: ReactNode;
  /** Titular; `highlight` va resaltado al final. */
  title: { text: string; highlight?: string };
  lead: ReactNode;
  /** Botones bajo la entradilla (llevan `data-hero-actions` para la barra móvil). */
  actions?: ReactNode;
  /** Franja de hechos bajo los botones (`<FactStrip tone="photo" />`). */
  facts?: ReactNode;
}) {
  const all: HeroCrumb[] = [{ label: "Inicio", href: routes.home }, ...crumbs];
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

  return (
    <section aria-labelledby="pagina-titulo" className={pageHeroClass.section}>
      <HeroBackdrop />
      <Container className={pageHeroClass.inner}>
        <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
          <Breadcrumb items={crumbs} />
          <HeroEyebrow>{eyebrow}</HeroEyebrow>
          <h1 id="pagina-titulo" className={pageHeroClass.title}>
            {title.text}
            {title.highlight && (
              <>
                {" "}
                <span className={pageHeroClass.highlight}>{title.highlight}</span>
              </>
            )}
          </h1>
          <p className={pageHeroClass.lead}>{lead}</p>
          {actions && (
            <div
              data-hero-actions=""
              className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
            >
              {actions}
            </div>
          )}
          {facts && <div className="pt-2 sm:pt-3">{facts}</div>}
        </div>
      </Container>
      <JsonLd data={breadcrumbLd} />
    </section>
  );
}
