import Link from "next/link";
import { ArrowRightIcon, ShieldCheckIcon } from "@/components/icons";
import { FigureStrip } from "@/components/ui/FactStrip";
import { Pend, PendingBlock, PendingPhoto, SourceNote } from "@/components/ui/Pending";
import { Reveal } from "@/components/ui/Reveal";
import { Accent, Section, SectionHeader } from "@/components/ui/Section";
import { hasPending } from "@/config/site";
import { companyFigures, figuresSource } from "@/content/facts";
import { aboutIntro } from "./aboutContent";

/**
 * 1-2 · Quiénes somos (8.6): qué es SEDIN (art. 4), la prevención como
 * pilar, la historia y las cifras (ocultas mientras sean marcadores), el
 * hueco de la foto real de los oficiales (solo en revisión) y las tres
 * modalidades del servicio, cada una enlazada a su servicio. «Sin armas de
 * fuego» se dice una sola vez, en la placa.
 */
export function AboutIntro() {
  const c = aboutIntro;
  return (
    <Section tone="light" id="quienes-somos" labelledBy="quienes-somos-titulo">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="flex flex-col gap-8 lg:col-span-7">
          <Reveal as="header" className="flex flex-col gap-3">
            <SectionHeader
              id="quienes-somos-titulo"
              eyebrow={c.eyebrow}
              title={
                <>
                  {c.title.text} <Accent>{c.title.highlight}</Accent>
                </>
              }
              lead={c.lead}
            />
            <SourceNote source={c.leadSource} />
          </Reveal>

          <div className="flex max-w-[640px] flex-col gap-5">
            {c.body.map((p) => (
              <div key={p.source} className="flex flex-col gap-1">
                <p className="m-0 text-base leading-[26px] text-ink-muted sm:text-[17px] sm:leading-7">{p.text}</p>
                <SourceNote source={p.source} />
              </div>
            ))}
            <Pend as="p" className="m-0 text-base leading-[26px] text-ink-muted" text={c.coverage} />
          </div>

          <PendingBlock label={c.history.label} needs={c.history.needs} pending={hasPending(c.history.text)}>
            <Pend as="p" className="m-0 text-base leading-[26px] text-ink" text={c.history.text} />
          </PendingBlock>

          <FigureStrip items={companyFigures} source={figuresSource} />

          <PendingPhoto label={c.photo} className="aspect-[16/9]" />
        </div>

        <div className="flex flex-col gap-6 lg:col-span-5">
          {/* Sin armas de fuego: el rasgo que distingue a SEDIN, en una placa de marca. */}
          <Reveal
            data-theme="dark"
            className="relative isolate overflow-hidden rounded-xl bg-bg p-6 text-ink shadow-elevation-2 sm:p-8"
          >
            <div
              aria-hidden="true"
              className="dot-grid absolute inset-0 -z-10 opacity-50 [mask-image:radial-gradient(ellipse_80%_70%_at_100%_0%,black,transparent_75%)]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_100%_0%,color-mix(in_srgb,var(--cyan-400)_22%,transparent),transparent_70%)]"
            />
            <ShieldCheckIcon size={36} className="text-ink-accent" />
            <p className="mt-5 mb-0 font-display text-[clamp(22px,2.2vw,28px)] leading-[1.2] font-bold tracking-[-0.01em] text-ink">
              {c.unarmed.title}
            </p>
            <p className="mt-3 mb-0 text-[15px] leading-6 text-ink-muted">{c.unarmed.text}</p>
            <SourceNote source={c.unarmed.source} className="mt-3" />
          </Reveal>

          <div className="flex flex-col gap-3">
            <h3 className="eyebrow m-0 text-ink-muted">{c.modalitiesTitle}</h3>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {c.modalities.map((m, i) => (
                <Reveal as="li" key={m.id} className="flex">
                  <Link
                    href={m.href}
                    prefetch={false}
                    className="card-interactive group flex w-full items-start gap-4 rounded-lg border border-line-card bg-surface p-5 text-ink no-underline shadow-elevation-1 hover:text-ink"
                  >
                    <span
                      aria-hidden="true"
                      className="pt-0.5 font-display text-sm font-bold tracking-[0.08em] text-ink-accent"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className="font-display text-lg leading-6 font-bold tracking-[-0.01em]">{m.title}</span>
                      <span className="text-[15px] leading-[22px] text-ink-muted">{m.text}</span>
                      <SourceNote source={m.source} />
                    </span>
                    <ArrowRightIcon
                      size={18}
                      className="mt-1 flex-none text-ink-brand transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                    />
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
