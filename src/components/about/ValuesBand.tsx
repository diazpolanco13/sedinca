import Image from "next/image";
import { QuoteIcon } from "@/components/icons";
import { SourceNote } from "@/components/ui/Pending";
import { Reveal } from "@/components/ui/Reveal";
import { Accent, Section, SectionHeader } from "@/components/ui/Section";
import { values } from "./aboutContent";

/** Escudo de la marca (sin redibujar ni recolorear), como marca de agua. */
const SHIELD = { src: "/assets/marca/escudo-sedin-320.webp", width: 320, height: 368 } as const;

/**
 * 8 · Valores (Seguridad · Orden · Disciplina · Control · Responsabilidad),
 * en filas editoriales de tipografía grande, junto a una cita del
 * reglamento (art. 17) con el escudo como marca de agua. Sustituye a la
 * franja `home/Values`.
 */
export function ValuesBand() {
  return (
    <Section tone="light" id="valores" labelledBy="valores-titulo">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="flex flex-col gap-8 lg:sticky lg:top-28">
            <SectionHeader
              id="valores-titulo"
              eyebrow={values.eyebrow}
              title={
                <>
                  {values.title.text} <Accent>{values.title.highlight}</Accent>
                </>
              }
              lead={values.lead}
            />
            <figure className="relative isolate m-0 overflow-hidden rounded-xl border border-line-cyan bg-surface-brand p-6 sm:p-8">
              <Image
                src={SHIELD.src}
                width={SHIELD.width}
                height={SHIELD.height}
                alt=""
                sizes="192px"
                className="pointer-events-none absolute -right-8 -bottom-10 -z-10 h-auto w-44 opacity-15 sm:w-48"
              />
              <QuoteIcon size={30} className="text-ink-brand" />
              <blockquote className="m-0 mt-4 max-w-[380px] font-display text-[clamp(22px,2.2vw,28px)] leading-[1.25] font-semibold tracking-[-0.01em] text-brand-deep">
                {values.quote.text}
              </blockquote>
              <figcaption className="mt-4 flex flex-col gap-1">
                <span className="eyebrow text-ink-muted">{values.quote.caption}</span>
                <SourceNote source={values.quote.source} />
              </figcaption>
            </figure>
          </div>
        </div>

        <ol aria-label="Valores de SEDIN" className="m-0 flex list-none flex-col p-0 lg:col-span-7">
          {values.items.map((value, i) => (
            <Reveal
              as="li"
              key={value.name}
              className="group relative grid grid-cols-[40px_minmax(0,1fr)] gap-x-4 border-t border-line py-7 last:border-b sm:grid-cols-[56px_minmax(0,1fr)] lg:py-9"
            >
              {/* Línea cian que se extiende al pasar el cursor (solo transformación). */}
              <span
                aria-hidden="true"
                className="absolute -top-px left-0 h-0.5 w-full origin-left scale-x-0 bg-[image:var(--gradient-accent-line)] transition-transform duration-500 group-hover:scale-x-100 motion-reduce:transition-none"
              />
              <span aria-hidden="true" className="pt-1.5 font-display text-sm font-bold tracking-[0.08em] text-ink-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex min-w-0 flex-col gap-3">
                <h3 className="m-0 font-display text-[clamp(30px,3.8vw,50px)] leading-none font-bold tracking-[-0.025em] break-words text-ink">
                  {value.name}
                </h3>
                <p className="m-0 max-w-[520px] text-base leading-[26px] text-ink-muted sm:text-[17px] sm:leading-7">
                  {value.text}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}
