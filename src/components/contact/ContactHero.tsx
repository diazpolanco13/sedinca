import type { ReactNode } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { HeroBackdrop } from "@/components/ui/HeroBackdrop";
import { Breadcrumb, HeroEyebrow, pageHeroClass, type Crumb } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Section";
import { absoluteUrl, routes } from "@/config/site";
import { cn } from "@/lib/cn";

export type ContactCrumb = Crumb;

/** La sección de `PageHero` sin su alto mínimo: esta portada es compacta. */
const sectionClass = pageHeroClass.section.replace(/\bmin-h-\S+\s*/, "");

/**
 * Portada compacta de /contacto y /cotizar (propuesta 8.3): la misma foto del
 * puente, el mismo encabezado transparente y las mismas piezas que el resto
 * de portadas (`pageHeroClass`, `Breadcrumb`, `HeroEyebrow`), pero sin alto
 * mínimo, para que en el teléfono los botones de contacto y el diagnóstico
 * queden a la vista enseguida. Emite el BreadcrumbList (15.3).
 */
export function ContactHero({
  crumbs,
  path,
  eyebrow,
  title,
  titleSize = "default",
  lead,
  leadClassName,
  children,
}: {
  /** Sin «Inicio» (se añade solo); el último es la página actual. */
  crumbs: ContactCrumb[];
  /** Ruta de la página actual (para el BreadcrumbList). */
  path: string;
  eyebrow: string;
  title: { text: string; highlight?: string };
  /** Tamaño del titular (los de `PageHero`): 72px o compacto de 60px. */
  titleSize?: "default" | "compact";
  lead: ReactNode;
  /** Clases extra de la entradilla (p. ej. ocultarla en escritorio). */
  leadClassName?: string;
  /** Botones y notas bajo la entradilla. */
  children?: ReactNode;
}) {
  const all: ContactCrumb[] = [{ label: "Inicio", href: routes.home }, ...crumbs];
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
    <section aria-labelledby="pagina-titulo" className={sectionClass}>
      <HeroBackdrop />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-azure-950/60 to-transparent"
      />
      <Container className={pageHeroClass.inner}>
        <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
          <Breadcrumb items={crumbs} />
          <HeroEyebrow>{eyebrow}</HeroEyebrow>
          <h1
            id="pagina-titulo"
            className={titleSize === "compact" ? pageHeroClass.titleCompact : pageHeroClass.title}
          >
            {title.text}
            {title.highlight && (
              <>
                {" "}
                <span className={pageHeroClass.highlight}>{title.highlight}</span>
              </>
            )}
          </h1>
          <p className={cn(pageHeroClass.lead, leadClassName)}>{lead}</p>
          {children}
        </div>
      </Container>
      <JsonLd data={breadcrumbLd} />
    </section>
  );
}
