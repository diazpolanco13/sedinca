import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { PhotoCard } from "@/components/ui/PhotoCard";
import { Reveal } from "@/components/ui/Reveal";
import { Accent, Section, SectionHeader } from "@/components/ui/Section";
import { cotizarHref, sectorHref, type SectorSlug } from "@/config/site";
import { sectorsContent } from "@/content/sectors";
import { umami } from "@/lib/analytics";
import { selectorCopy } from "./homeContent";

/**
 * Recorte de cada foto en las tarjetas verticales de Inicio, para que el
 * oficial quede dentro del encuadre.
 */
const homeCrop: Partial<Record<SectorSlug, string>> = {
  "petroleo-y-energia": "object-[22%_center]",
  "industria-y-logistica": "object-[24%_center]",
  "comercio-y-oficinas": "object-[24%_center]",
  condominios: "object-[28%_center]",
};

/**
 * Ajustes de la tarjeta en la cuadrícula 2×2 del móvil (más vertical, sin el
 * icono, titular y texto más pequeños). Selectores descendentes sobre la
 * estructura de PhotoCard: si cambia, en móvil la tarjeta vuelve a su
 * aspecto por defecto, sin romperse.
 */
const mobileCard = [
  // overflow-clip (no hidden): con aspect-ratio, un texto que no cabe en el 3:4
  // hace crecer la tarjeta en vez de quedar cortado.
  "max-sm:aspect-[3/4] max-sm:overflow-clip",
  "max-sm:[&>span:last-child]:gap-1.5 max-sm:[&>span:last-child]:p-3.5",
  "max-sm:[&>span:last-child>span:first-child]:hidden",
  "max-sm:[&_h3]:text-[17px] max-sm:[&_h3]:leading-[22px]",
  "max-sm:[&>span:last-child>span:nth-last-child(2)]:text-[13px] max-sm:[&>span:last-child>span:nth-last-child(2)]:leading-[18px]",
].join(" ");

/**
 * Degradado de la tarjeta: en la cuadrícula 2×2 del móvil (≈173px de ancho)
 * el título ocupa 3 líneas y sube a la zona clara de la foto (cielo del
 * atardecer, vestíbulo): ahí el velo es más alto y denso para mantener el
 * contraste AA. Desde 640px, el de serie.
 */
const mobileScrim =
  "bg-linear-to-t from-azure-950 via-azure-950/80 via-55% to-azure-950/0 sm:from-azure-950/95 sm:via-azure-950/45 sm:via-50% sm:to-azure-950/5";

/**
 * 02 · «¿Qué necesita proteger?» (propuesta, 7.2): cuatro tarjetas
 * fotográficas grandes, una por sector, con el mensaje que conecta con cada
 * cliente (`sector.hook`) dentro de la foto y, debajo, la línea de servicios
 * habituales. En móvil, cuadrícula 2×2 sin la línea de servicios (la ve en la
 * página del sector). Las fotos son de IA: solo ambientación.
 */
export function ProtectSelector() {
  return (
    <Section
      tone="light"
      space="none"
      id="que-proteger"
      labelledBy="que-proteger-titulo"
      className="py-14 sm:py-20 lg:py-28"
    >
      <Reveal as="header">
        <SectionHeader
          id="que-proteger-titulo"
          eyebrow={selectorCopy.eyebrow}
          title={
            <>
              {selectorCopy.title.text} <Accent>{selectorCopy.title.highlight}</Accent>
              {selectorCopy.title.end}
            </>
          }
          lead={selectorCopy.lead}
          className="max-sm:[&_p]:hidden"
        />
      </Reveal>

      <ul className="m-0 mt-8 grid list-none grid-cols-2 gap-x-3 gap-y-6 p-0 sm:mt-12 sm:gap-x-5 sm:gap-y-8 lg:mt-16 lg:grid-cols-4 lg:gap-6">
        {sectorsContent.map((sector) => (
          <Reveal as="li" key={sector.id} className="flex flex-col gap-3 sm:gap-4">
            <PhotoCard
              href={sectorHref(sector.id)}
              title={sector.selector.label}
              text={sector.hook.title}
              cta={selectorCopy.cta}
              photo={{
                src: sector.photo.src,
                position: homeCrop[sector.id] ?? sector.photo.position,
                portrait: sector.photo.portrait,
              }}
              Icon={sector.Icon}
              aspect="portrait"
              sizes="(min-width: 1344px) 304px, (min-width: 1024px) 23vw, 50vw"
              scrimClassName={mobileScrim}
              className={mobileCard}
            />
            <p className="m-0 hidden gap-3 text-[15px] leading-[22px] text-ink-muted sm:flex">
              <span aria-hidden="true" className="mt-0.5 h-[18px] w-0.5 flex-none rounded-full bg-accent" />
              <span>
                <span className="sr-only">Servicios habituales: </span>
                {sector.selector.services}
              </span>
            </p>
          </Reveal>
        ))}
      </ul>

      <p className="m-0 mt-10 flex flex-wrap items-center gap-x-2 gap-y-1 text-base leading-6 text-ink-muted sm:mt-12 sm:text-lg">
        {selectorCopy.unsure.text}{" "}
        <Link
          href={cotizarHref()}
          prefetch={false}
          {...umami("cta-cotizar", { ubicacion: "inicio" })}
          className="group inline-flex items-center gap-1.5 font-display font-semibold text-ink-brand no-underline hover:underline"
        >
          {selectorCopy.unsure.label}
          <ArrowRightIcon
            size={18}
            className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
          />
        </Link>
      </p>
    </Section>
  );
}
