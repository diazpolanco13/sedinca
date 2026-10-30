import Link from "next/link";
import { ArrowRightIcon, BookIcon, CheckCircleIcon, FileTextIcon } from "@/components/icons";
import { Chip } from "@/components/ui/Chip";
import { GlassCard } from "@/components/ui/GlassCard";
import { SourceNote } from "@/components/ui/Pending";
import { Reveal } from "@/components/ui/Reveal";
import { Accent, Section, SectionHeader } from "@/components/ui/Section";
import { MailLink } from "@/components/ui/WhatsAppLink";
import { qualitySystem } from "@/content/answers";
import { aboutUbicacion, quality } from "./aboutContent";

/**
 * 4 · Sistema de gestión (8.6 y 11.5), en sección oscura. El texto correcto
 * de `qualitySystem` (nunca «certificado ISO»), tres hechos del reglamento
 * y, a la derecha, la «ficha» del procedimiento SED-GC-PR-01 con los
 * formularios codificados de cada puesto (art. 32) como prueba concreta.
 */
export function QualitySystem() {
  return (
    <Section tone="dark" id="calidad" labelledBy="calidad-titulo">
      <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="flex flex-col gap-8 lg:col-span-6">
          <SectionHeader
            id="calidad-titulo"
            eyebrow={quality.eyebrow}
            title={
              <>
                {quality.title.text} <Accent>{quality.title.highlight}</Accent>
              </>
            }
            lead={qualitySystem.text}
          />

          <ul className="m-0 flex list-none flex-col gap-5 p-0">
            {quality.points.map((point) => (
              <Reveal as="li" key={point.title} className="flex gap-4">
                <CheckCircleIcon size={22} className="mt-0.5 flex-none text-ink-accent" />
                <div className="flex flex-col gap-1">
                  <h3 className="m-0 font-display text-lg leading-6 font-semibold text-ink">{point.title}</h3>
                  <p className="m-0 text-[15px] leading-6 text-ink-muted">{point.text}</p>
                  <SourceNote source={point.source} />
                </div>
              </Reveal>
            ))}
          </ul>

          <div className="flex flex-col gap-4 border-t border-line pt-6">
            <p className="m-0 text-[15px] leading-6 text-ink-muted">{qualitySystem.onRequest}</p>
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
              <MailLink
                subject={quality.indexMail.subject}
                body={quality.indexMail.body}
                ubicacion={aboutUbicacion}
                variant="secondary"
                size="md"
                block
              >
                {quality.indexMail.label}
              </MailLink>
              <Link
                href={qualitySystem.link.href}
                prefetch={false}
                className="group inline-flex items-center gap-1.5 font-display text-base font-semibold text-ink-brand no-underline hover:underline"
              >
                {qualitySystem.link.label}
                <ArrowRightIcon
                  size={18}
                  className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Ficha del procedimiento: código, nombre y formularios del puesto. */}
        <Reveal className="lg:col-span-6">
          <GlassCard tone="dark" level={2} accent className="sm:p-8">
            <div className="flex flex-col gap-4 pb-6">
              <div className="flex items-center gap-3 text-ink-muted">
                <FileTextIcon size={20} className="text-ink-accent" />
                <span className="eyebrow">{quality.document.label}</span>
              </div>
              <p className="m-0 font-display text-[clamp(34px,4vw,52px)] leading-none font-bold tracking-[-0.02em] text-ink">
                {quality.document.code}
              </p>
              <p className="m-0 text-base leading-6 text-ink-muted">{quality.document.name}</p>
              <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                {quality.document.tags.map((tag) => (
                  <li key={tag}>
                    <Chip>{tag}</Chip>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4 border-t border-line pt-6">
              <h3 className="eyebrow m-0 text-ink-muted">{quality.formsTitle}</h3>
              <ul className="m-0 flex list-none flex-col p-0">
                {quality.forms.map((form) => (
                  <li
                    key={form.code}
                    className="grid grid-cols-[88px_minmax(0,1fr)] items-baseline gap-3 border-t border-line py-3 first:border-t-0 first:pt-0"
                  >
                    <span className="font-display text-[13px] leading-5 font-bold tracking-[0.06em] text-ink-accent tabular-nums">
                      {form.code}
                    </span>
                    <span className="text-[15px] leading-[22px] text-ink">{form.name}</span>
                  </li>
                ))}
                <li className="grid grid-cols-[88px_minmax(0,1fr)] items-center gap-3 border-t border-line pt-3">
                  <BookIcon size={20} className="text-ink-accent" />
                  <span className="text-[15px] leading-[22px] font-semibold text-ink">{quality.book}</span>
                </li>
              </ul>
              <SourceNote source={quality.formsSource} />
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </Section>
  );
}
