import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, BookIcon, ShieldCheckIcon, ShieldIcon, UserCheckIcon } from "@/components/icons";
import { SitePage } from "@/components/layout/SitePage";
import { SectorPicker } from "@/components/sector/SectorPicker";
import { photoCardMobile, sectorPhoto } from "@/components/sector/sectorView";
import { ServiceHero } from "@/components/service/ServiceHero";
import { ActionLink } from "@/components/ui/ActionLink";
import { CtaBand } from "@/components/ui/CtaBand";
import { Pend, SourceNote } from "@/components/ui/Pending";
import { PhotoCard } from "@/components/ui/PhotoCard";
import { Reveal } from "@/components/ui/Reveal";
import { Accent, Section, SectionHeader } from "@/components/ui/Section";
import { ArrowLink } from "@/components/ui/SectionHeading";
import { absoluteUrl, cotizarHref, ctaLabels, routes, sectorHref } from "@/config/site";
import { ningunPuestoSolo, noArmado, reporte, supervision, unarmedStatement } from "@/content/answers";
import { sectorsContent } from "@/content/sectors";
import { umami } from "@/lib/analytics";

export const metadata: Metadata = {
  title: "Vigilancia privada por sector en Maracaibo y el Zulia",
  description:
    "Vigilancia privada no armada para instalaciones petroleras, plantas y almacenes, comercios y oficinas, y condominios de Maracaibo y el Zulia.",
  alternates: { canonical: absoluteUrl(routes.sectors) },
};

/** Lo que no cambia de un sector a otro (textos de answers.ts; fuentes solo en revisión). */
const constants = [
  {
    Icon: ShieldCheckIcon,
    title: ningunPuestoSolo.title.replace(/\.$/, ""),
    text: ningunPuestoSolo.body[0],
    source: "Arts. 20 y 21",
  },
  { Icon: BookIcon, title: "Libro de novedades en cada puesto", text: reporte.body[0], source: "Art. 32" },
  { Icon: UserCheckIcon, title: supervision.title, text: supervision.body[0], source: "Art. 19" },
  { Icon: ShieldIcon, title: noArmado.eyebrow, text: unarmedStatement, source: "Art. 4" },
];

/**
 * /sectores: índice por instalación. La portada lleva el selector de vidrio
 * con los 4 sectores (desde 1024px; en móvil, las tarjetas con foto que siguen
 * hacen de selector, sin elegir dos veces lo mismo); después, las tarjetas y
 * lo que no cambia de un sector a otro. Selector, tarjetas, menú y ruta usan
 * el mismo nombre de sector. Ritmo: portada → light → sunken → dark (cierre).
 */
export default function SectorsPage() {
  return (
    <SitePage>
      <ServiceHero
        crumbs={[{ label: "Sectores" }]}
        path={routes.sectors}
        eyebrow="Soluciones por instalación"
        title={{ text: "Seguridad privada según su", highlight: "instalación" }}
        lead="Cada instalación tiene riesgos distintos. Elija la suya y vea el esquema que recomendamos, las respuestas a lo que más se pregunta antes de contratar y cómo empezar."
        aside={<SectorPicker />}
      >
        <Link
          href={cotizarHref()}
          prefetch={false}
          {...umami("cta-cotizar", { ubicacion: "portada" })}
          className="group inline-flex items-center gap-2 self-start pt-1 font-display text-base font-semibold text-cyan-200 no-underline hover:text-white hover:underline"
        >
          ¿No lo tiene claro? {ctaLabels.diagnostico} en 4 preguntas
          <ArrowRightIcon
            size={18}
            className="flex-none transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
          />
        </Link>
      </ServiceHero>

      <Section tone="light" id="sectores" labelledBy="sectores-titulo">
        <SectionHeader
          id="sectores-titulo"
          eyebrow="Los sectores"
          title={
            <>
              Cuatro puertas de entrada, <Accent>un mismo método</Accent>
            </>
          }
          lead="Cada página reúne los riesgos típicos, el esquema que recomendamos y las respuestas a lo que se pregunta antes de contratar."
        />
        <ul className="mt-8 grid list-none grid-cols-2 gap-3 p-0 sm:mt-12 sm:gap-6 lg:mt-16 lg:grid-cols-4">
          {sectorsContent.map((sector) => (
            <Reveal as="li" key={sector.id}>
              <PhotoCard
                href={sectorHref(sector.id)}
                title={sector.title}
                text={sector.hook.title}
                photo={sectorPhoto(sector)}
                Icon={sector.Icon}
                cta="Ver el sector"
                aspect="portrait"
                className={photoCardMobile}
                sizes="(min-width: 1344px) 310px, (min-width: 1024px) 25vw, 50vw"
              />
            </Reveal>
          ))}
        </ul>
        <p className="m-0 mt-10 flex flex-wrap items-center gap-x-2 gap-y-1 text-base leading-6 text-ink-muted">
          ¿No lo tiene claro?
          <ActionLink
            variant="inline"
            action={{
              kind: "link",
              label: ctaLabels.diagnostico,
              href: cotizarHref(),
              event: "cta-cotizar",
            }}
          />
        </p>
      </Section>

      <Section tone="sunken" space="tight" id="en-todos" labelledBy="en-todos-titulo">
        <SectionHeader
          id="en-todos-titulo"
          eyebrow="En cualquier instalación"
          title="Lo que no cambia de un sector a otro"
          size="md"
          actions={<ArrowLink href={routes.comoTrabajamos}>Ver cómo trabajamos</ArrowLink>}
        />
        <ul className="mt-10 grid list-none gap-8 p-0 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {constants.map(({ Icon, title, text, source }) => (
            <Reveal as="li" key={title} className="flex flex-col gap-3 border-t-2 border-accent pt-6">
              <Icon size={28} className="text-ink-brand" />
              <h3 className="m-0 font-display text-lg leading-6 font-bold tracking-[-0.01em] text-ink">{title}</h3>
              <Pend as="p" className="m-0 text-[15px] leading-[22px] text-ink-muted" text={text} />
              <SourceNote source={source} />
            </Reveal>
          ))}
        </ul>
      </Section>

      <CtaBand />
    </SitePage>
  );
}
