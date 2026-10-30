import Link from "next/link";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";
import { Card } from "@/components/ui/Card";
import { CtaBand } from "@/components/ui/CtaBand";
import { FaqList, type FaqListItem } from "@/components/ui/FaqList";
import { Pend, PendingPhoto, SourceNote } from "@/components/ui/Pending";
import { PhotoCard } from "@/components/ui/PhotoCard";
import { Reveal } from "@/components/ui/Reveal";
import { Accent, Section, SectionHeader } from "@/components/ui/Section";
import { PriceFactorsCard, RelatedServices, StartSteps } from "@/components/service/ServiceBlocks";
import { ServiceFicha, ServiceHeroActions } from "@/components/service/ServiceFicha";
import { ServiceHero } from "@/components/service/ServiceHero";
import { photoCardMobile } from "@/components/sector/sectorView";
import { absoluteUrl, knowMoreLinks, routes, sectorHref, serviceHref, showPending, site } from "@/config/site";
import { getFaqs } from "@/content/faq";
import { getSector, type SectorContent } from "@/content/sectors";
import type { ServiceContent } from "@/content/services";
import { cn } from "@/lib/cn";
import { filterPending, isVisible } from "@/lib/pending";

/* Rejillas según el número de elementos (clases estáticas, para que Tailwind las vea). */
const featureGrid: Record<number, string> = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};
const deliveryGrid: Record<number, string> = {
  1: "",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
};

/* Rejilla de «Para quién» según el número de sectores (clases estáticas). */
const sectorGrid = {
  3: {
    list: "sm:grid-cols-2 lg:grid-cols-3",
    card: "sm:aspect-[4/5] lg:aspect-square",
    sizes: "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  },
  /* 2×2 también en móvil (como el selector de Inicio): la sección medía casi dos pantallas. */
  4: {
    list: "grid-cols-2 lg:grid-cols-4",
    card: cn("sm:aspect-[4/5]", photoCardMobile),
    sizes: "(min-width: 1024px) 25vw, 50vw",
  },
} as const;

/**
 * Encuadre de las fotos de sector en tarjetas verticales o cuadradas, para que
 * el oficial quede dentro del recorte. Solo para las fotos sin `position`
 * propia (la de petróleo trae la suya: recorta el texto inventado).
 */
const portraitFocus: Partial<Record<SectorContent["id"], string>> = {
  "industria-y-logistica": "object-[15%_center]",
  "comercio-y-oficinas": "object-[28%_center]",
  condominios: "object-[30%_center]",
};

/**
 * Plantilla de servicio (propuesta 8.1). Ritmo de secciones:
 * portada (foto + ficha; en móvil, los botones bajo la entradilla) → light
 * «Qué incluye» → sunken «Para quién» → dark «Cómo lo hacemos y qué recibe» →
 * brand «¿Se imagina este servicio en su instalación?» (precio y primeros
 * pasos, sin botones) → light «Preguntas», «Combínelo con» y «Siga
 * conociendo» → dark cierre (CtaBand), como Inicio y los sectores. Los
 * botones (portada y cierre) son siempre los de `service.cta`: contextual al
 * diagnóstico y WhatsApp precargado.
 */
export function ServiceTemplate({ service }: { service: ServiceContent }) {
  const { slug, includes, delivery, spotlight } = service;
  const path = serviceHref(slug);

  const sectors = service.sectors
    .map((id) => getSector(id))
    .filter((s): s is SectorContent => Boolean(s));
  const grid = sectorGrid[sectors.length >= 4 ? 4 : 3];

  const features = includes.features.filter((f) => isVisible(f.text));
  const deliveryPoints = delivery.points.filter((p) => isVisible(p.text));
  const faqItems: FaqListItem[] = [...getFaqs(service.faqIds), ...(service.faqs ?? [])];

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.name,
    description: service.meta.description,
    url: absoluteUrl(path),
    provider: { "@type": "LocalBusiness", "@id": `${site.url}/#empresa`, name: site.name },
  };

  return (
    <>
      <ServiceHero
        crumbs={[{ label: "Servicios", href: routes.services }, { label: service.name }]}
        path={path}
        eyebrow="Servicio · Maracaibo y el Zulia"
        title={service.h1}
        lead={service.lead}
        aside={<ServiceFicha service={service} />}
      >
        <ServiceHeroActions actions={service.cta} />
      </ServiceHero>

      {/* Qué incluye ---------------------------------------------------- */}
      <Section tone="light" id="incluye" labelledBy="incluye-titulo">
        <SectionHeader
          eyebrow="Qué incluye"
          title={service.hook.title}
          lead={service.hook.text}
          id="incluye-titulo"
        />

        <ul className="m-0 mt-12 grid list-none gap-6 p-0 md:grid-cols-2 lg:mt-16">
          {includes.modes.map((mode, i) => {
            const points = filterPending(mode.points, (p) => p);
            return (
              <Reveal as="li" key={mode.title} className="flex">
                <Card elevation={1} accent className="flex w-full flex-col gap-5 p-7 sm:p-9">
                  <div className="flex items-start justify-between gap-4">
                    <span className="eyebrow text-ink-accent">{mode.tag}</span>
                    <span
                      aria-hidden="true"
                      className="font-display text-[34px] leading-none font-bold tracking-[-0.03em] text-line-strong"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="m-0 font-display text-[26px] leading-8 font-bold tracking-[-0.015em] text-ink sm:text-[28px] sm:leading-9">
                    {mode.title}
                  </h3>
                  <p className="m-0 text-base leading-[26px] text-ink-muted">{mode.text}</p>
                  {points.length > 0 && (
                    <ul className="m-0 grid list-none gap-3 border-t border-line p-0 pt-5">
                      {points.map((point) => (
                        <li key={point} className="flex gap-3 text-[15px] leading-[22px] text-ink">
                          <CheckIcon size={18} className="mt-0.5 flex-none text-ink-brand" />
                          <Pend text={point} />
                        </li>
                      ))}
                    </ul>
                  )}
                  <SourceNote source={mode.source} className="mt-auto" />
                </Card>
              </Reveal>
            );
          })}
        </ul>

        {features.length > 0 && (
          <ul
            className={cn(
              "m-0 mt-14 grid list-none grid-cols-2 gap-x-5 gap-y-9 border-t border-line p-0 pt-12 sm:gap-x-8 sm:gap-y-10",
              featureGrid[features.length] ?? "lg:grid-cols-4",
            )}
          >
            {features.map(({ Icon, title, text, source }) => (
              <Reveal as="li" key={title} className="flex flex-col gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-surface-brand text-ink-brand">
                  <Icon size={26} />
                </span>
                <h3 className="m-0 font-display text-lg leading-6 font-bold tracking-[-0.01em] text-ink">{title}</h3>
                <Pend as="p" className="m-0 text-sm leading-5 text-ink-muted sm:text-[15px] sm:leading-[22px]" text={text} />
                <SourceNote source={source} />
              </Reveal>
            ))}
          </ul>
        )}
      </Section>

      {/* Para quién ----------------------------------------------------- */}
      {sectors.length > 0 && (
        <Section tone="sunken" id="para-quien" labelledBy="para-quien-titulo">
          <SectionHeader
            eyebrow="Para quién"
            title={
              <>
                Así lo aplicamos en <Accent>su instalación</Accent>
              </>
            }
            lead="Cada instalación tiene riesgos distintos. Elija la suya y vea el esquema completo que recomendamos."
            id="para-quien-titulo"
          />
          <ul className={cn("m-0 mt-8 grid list-none gap-3 p-0 sm:mt-12 sm:gap-6 lg:mt-16", grid.list)}>
            {sectors.map((sector) => {
              const why =
                service.sectorWhy?.[sector.id] ??
                sector.scheme.find((item) => item.service === slug)?.why ??
                sector.text;
              return (
                <Reveal as="li" key={sector.id} className="flex">
                  <PhotoCard
                    href={sectorHref(sector.id)}
                    title={sector.title}
                    text={why}
                    cta="Ver el esquema"
                    photo={{
                      src: sector.photo.src,
                      position: sector.photo.position ?? portraitFocus[sector.id],
                    }}
                    Icon={sector.Icon}
                    aspect="square"
                    sizes={grid.sizes}
                    className={cn("w-full", grid.card)}
                  />
                </Reveal>
              );
            })}
          </ul>
        </Section>
      )}

      {/* Cómo lo hacemos y qué recibe ------------------------------------ */}
      <Section tone="dark" id="como-lo-hacemos" labelledBy="como-titulo">
        <SectionHeader
          eyebrow="Cómo lo hacemos y qué recibe"
          title={delivery.title}
          lead={delivery.lead}
          id="como-titulo"
        />
        <ul
          className={cn(
            "m-0 mt-12 grid list-none gap-6 p-0 lg:mt-16",
            deliveryGrid[deliveryPoints.length] ?? "md:grid-cols-3",
          )}
        >
          {deliveryPoints.map(({ Icon, title, text, source }) => (
            <Reveal as="li" key={title} className="flex">
              <Card elevation={1} accent className="flex w-full flex-col gap-4 p-7">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-md border border-line-cyan bg-accent-subtle text-cyan-300">
                  <Icon size={26} />
                </span>
                <h3 className="m-0 font-display text-xl leading-7 font-bold tracking-[-0.01em] text-ink">{title}</h3>
                <Pend as="p" className="m-0 text-[15px] leading-6 text-ink-muted" text={text} />
                <SourceNote source={source} className="mt-auto" />
              </Card>
            </Reveal>
          ))}
        </ul>

        <Spotlight spotlight={spotlight} />
      </Section>

      {/* ¿Se imagina este servicio en su instalación? -------------------- */}
      <Section tone="brand" id="su-instalacion" labelledBy="su-instalacion-titulo">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col gap-8 lg:col-span-7">
            <SectionHeader
              eyebrow="Su caso"
              title={
                <>
                  ¿Se imagina este servicio en <Accent>su instalación</Accent>?
                </>
              }
              lead={`${service.dimension} Sin compromiso.`}
              id="su-instalacion-titulo"
            />
            {/* Sin botones: los mismos dos están en la portada y en el cierre, poco más abajo. */}
            <StartSteps steps={service.start} />
          </div>
          <div className="lg:col-span-5">
            <PriceFactorsCard headingId="precio-titulo" {...service.price} />
          </div>
        </div>
      </Section>

      {/* Preguntas del servicio + Combínelo con -------------------------- */}
      <Section tone="light" id="preguntas" labelledBy="preguntas-titulo">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="flex flex-col lg:col-span-7">
            <SectionHeader
              eyebrow="Preguntas"
              title={`Preguntas sobre ${service.name.toLowerCase()}`}
              size="md"
              id="preguntas-titulo"
            />
            <FaqList items={faqItems} jsonLd exclusive={`faq-${slug}`} className="mt-10" />
            <Link
              href={routes.faq}
              prefetch={false}
              className="group mt-6 inline-flex items-center gap-1.5 self-start font-display text-[15px] font-semibold text-ink-brand no-underline hover:underline"
            >
              Ver todas las preguntas
              <ArrowRightIcon
                size={16}
                className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
              />
            </Link>
          </div>
          <div className="flex flex-col gap-14 lg:col-span-5">
            <aside aria-labelledby="combinelo-titulo">
              <RelatedServices service={service} headingId="combinelo-titulo" />
            </aside>
            <KeepExploring links={service.nextLinks.map((key) => knowMoreLinks[key])} />
          </div>
        </div>
      </Section>

      {/* Cierre --------------------------------------------------------- */}
      <CtaBand actions={service.cta} whatsappMessage={service.whatsapp} ubicacion={service.ubicacion} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}

/** Pieza propia del servicio (8.1), dentro de la sección oscura. */
function Spotlight({ spotlight }: { spotlight: ServiceContent["spotlight"] }) {
  const points = (spotlight.points ?? []).filter((p) => isVisible(p.text));
  const lists = (spotlight.lists ?? [])
    .map((l) => ({ ...l, items: filterPending(l.items, (item) => item) }))
    .filter((l) => l.items.length > 0);
  const photos = showPending ? (spotlight.photos ?? []) : [];
  // En producción, una pieza que solo tenía fotos pendientes no se pinta.
  if (points.length === 0 && lists.length === 0 && photos.length === 0) return null;

  return (
    <div className="mt-16 grid gap-10 border-t border-line pt-12 lg:mt-20 lg:grid-cols-12 lg:gap-16 lg:pt-16">
      <div className="flex flex-col gap-4 lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
        <span className="eyebrow inline-flex items-center gap-3 text-ink-accent">
          <span aria-hidden="true" className="h-0.5 w-8 rounded-full bg-[image:var(--gradient-accent-line)]" />
          {spotlight.eyebrow}
        </span>
        <h3 className="m-0 font-display text-[clamp(26px,3vw,40px)] leading-[1.12] font-bold tracking-[-0.015em] text-balance text-ink">
          {spotlight.title}
        </h3>
        {spotlight.lead && (
          <Pend as="p" className="m-0 text-lg leading-7 text-ink-muted" text={spotlight.lead} />
        )}
        <SourceNote source={spotlight.source} />
        {spotlight.link && (
          <Link
            href={spotlight.link.href}
            prefetch={false}
            className="group mt-2 inline-flex items-center gap-1.5 self-start font-display text-[15px] font-semibold text-ink-brand no-underline hover:underline"
          >
            {spotlight.link.label}
            <ArrowRightIcon
              size={16}
              className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
            />
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-8 lg:col-span-7">
        {points.length > 0 && (
          <div className="flex flex-col">
            {points.map((point) => (
              <div key={point.title} className="flex flex-col gap-2 border-b border-line py-6 first:pt-0 last:border-b-0">
                <h4 className="m-0 font-display text-lg leading-7 font-semibold text-ink sm:text-xl">
                  {point.title}
                </h4>
                <Pend as="p" className="m-0 text-base leading-[26px] text-ink-muted" text={point.text} />
                {point.link && (
                  <Link
                    href={point.link.href}
                    prefetch={false}
                    className="group inline-flex items-center gap-1.5 self-start font-display text-[15px] font-semibold text-ink-brand no-underline hover:underline"
                  >
                    {point.link.label}
                    <ArrowRightIcon
                      size={16}
                      className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                    />
                  </Link>
                )}
                <SourceNote source={point.source} />
              </div>
            ))}
          </div>
        )}

        {lists.map((list) => (
          <div key={list.title} className="flex flex-col gap-4">
            <h4 className="m-0 font-display text-lg leading-7 font-semibold text-ink">{list.title}</h4>
            <ul className="m-0 flex list-none flex-wrap gap-2.5 p-0">
              {list.items.map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-line-cyan bg-accent-subtle px-3.5 py-2 text-[14px] leading-5 text-ink"
                >
                  <CheckIcon size={16} className="flex-none text-cyan-300" />
                  <Pend text={item} />
                </li>
              ))}
            </ul>
            <SourceNote source={list.source} />
          </div>
        ))}

        {photos.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {photos.map((label) => (
              <PendingPhoto key={label} label={label} className="aspect-[4/3]" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** «Siga conociendo SEDIN»: dos enlaces antes del cierre. */
function KeepExploring({ links }: { links: readonly { eyebrow: string; title: string; text: string; href: string }[] }) {
  if (links.length === 0) return null;
  return (
    <nav aria-labelledby="siga-conociendo-titulo" className="flex flex-col gap-5">
      <h2 id="siga-conociendo-titulo" className="eyebrow m-0 inline-flex items-center gap-3 text-ink-brand">
        <span aria-hidden="true" className="h-0.5 w-8 rounded-full bg-[image:var(--gradient-accent-line)]" />
        Siga conociendo SEDIN
      </h2>
      <ul className="m-0 grid list-none border-t border-line p-0">
        {links.map((link) => (
          <li key={link.href} className="border-b border-line">
            <Link
              href={link.href}
              prefetch={false}
              className="group flex items-center gap-4 py-4 text-ink no-underline hover:text-ink"
            >
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="font-display text-[17px] leading-6 font-semibold group-hover:text-ink-brand">
                  {link.title}
                </span>
                <span className="text-[15px] leading-[22px] text-ink-muted">{link.text}</span>
              </span>
              <ArrowRightIcon
                size={18}
                className="ml-auto flex-none text-ink-brand transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
              />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
