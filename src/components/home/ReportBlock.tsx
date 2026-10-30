import Link from "next/link";
import { ArrowRightIcon, BookIcon, CheckCircleIcon } from "@/components/icons";
import { GlassCard } from "@/components/ui/GlassCard";
import { Pend, PendingPhoto, SourceNote } from "@/components/ui/Pending";
import { Reveal } from "@/components/ui/Reveal";
import { Accent, Section, SectionHeader } from "@/components/ui/Section";
import { Timeline } from "@/components/ui/Timeline";
import { ningunPuestoSolo, reporte } from "@/content/answers";
import { reportTimeline } from "@/content/process";
import { filterPending } from "@/lib/pending";
import { reportCopy } from "./homeContent";

/**
 * Lo que queda por escrito (reporte mínimo, 4.2), bajo el mensaje
 * «¿Sabe quién entró anoche…?». La entrega del libro al
 * completarse ya es la última etapa de la línea de tiempo: no se repite.
 * Las frases con [MARCADOR] (aviso inmediato, consulta del libro, resumen
 * mensual) solo se ven en modo revisión.
 */
const recordItems = filterPending(
  reporte.body.filter((sentence) => !sentence.startsWith("Al completarse")),
  (sentence) => sentence,
);

/**
 * 03 · Bloque oscuro (propuesta, 7.3): «Ningún puesto queda solo» (4.1) con
 * el mensaje «¿Sabe quién entró anoche…?» y lo que queda por escrito en una
 * tarjeta de vidrio, y «Así sabrá lo que pasa en su instalación»: la línea de
 * tiempo por etapas de 4.2 (se rellena en cian al desplazar, solo CSS).
 * En escritorio la columna izquierda queda fija mientras se recorre la línea
 * de tiempo (solo si la ventana es alta).
 *
 * La línea de tiempo y los `Reveal` no van dentro de GlassCard: su
 * `overflow: hidden` lo convierte en contenedor de desplazamiento y
 * congelaría las animaciones por desplazamiento.
 */
export function ReportBlock() {
  return (
    <Section
      tone="dark"
      space="none"
      id="ningun-puesto-solo"
      labelledBy="ningun-puesto-titulo"
      className="py-14 sm:py-20 lg:py-28"
    >
      <div className="grid gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Columna fija en escritorio: la promesa y el mensaje. */}
        <div className="flex flex-col gap-7 sm:gap-8 lg:col-span-5 lg:self-start lg:[@media(min-height:820px)]:sticky lg:[@media(min-height:820px)]:top-28">
          <Reveal as="header" className="flex flex-col gap-3">
            <SectionHeader
              id="ningun-puesto-titulo"
              eyebrow={ningunPuestoSolo.eyebrow}
              title={
                <>
                  Ningún puesto <Accent>queda solo</Accent>.
                </>
              }
              lead={<Pend text={ningunPuestoSolo.body} />}
              className="max-sm:[&_p]:text-base max-sm:[&_p]:leading-[26px]"
            />
            <SourceNote source={ningunPuestoSolo.source} />
          </Reveal>

          <Reveal>
            <GlassCard tone="dark" level={2} accent className="p-5 sm:p-8">
              <div className="flex flex-col gap-5 sm:gap-6">
                <div className="flex gap-4">
                  <span className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-md border border-line-cyan bg-accent-subtle text-cyan-300 shadow-glow-cyan">
                    <BookIcon size={22} />
                  </span>
                  <div className="flex flex-col gap-2">
                    <p className="m-0 font-display text-[clamp(22px,2.4vw,30px)] leading-[1.15] font-bold tracking-[-0.02em] text-balance text-ink">
                      {reportCopy.hook.question}
                    </p>
                    <p className="m-0 font-display text-lg leading-7 font-semibold text-cyan-300 sm:text-xl">
                      {reportCopy.hook.answer}
                    </p>
                  </div>
                </div>

                {recordItems.length > 0 && (
                  <div className="flex flex-col gap-3 border-t border-line pt-5">
                    <h3 className="eyebrow m-0 text-ink-accent">{reportCopy.record.title}</h3>
                    <ul className="m-0 flex list-none flex-col gap-3 p-0">
                      {recordItems.map((sentence) => (
                        <li key={sentence} className="flex gap-3 text-[14px] leading-[21px] text-ink-muted sm:text-[15px] sm:leading-6">
                          <CheckCircleIcon size={20} className="mt-px flex-none text-cyan-300" />
                          <Pend text={sentence} />
                        </li>
                      ))}
                    </ul>
                    <SourceNote source={reporte.source} />
                  </div>
                )}

                {/* Foto real pendiente (solo en revisión): da prueba visual a «queda escrito». */}
                <PendingPhoto label={reportCopy.record.photo} className="aspect-[4/3]" />
              </div>
            </GlassCard>
          </Reveal>
        </div>

        {/* Así sabrá lo que pasa en su instalación (4.2). */}
        <div className="flex flex-col gap-8 sm:gap-10 lg:col-span-7">
          <Reveal as="header" className="flex flex-col gap-3">
            <span className="eyebrow inline-flex items-center gap-3 text-ink-accent">
              <span aria-hidden="true" className="h-0.5 w-8 rounded-full bg-[image:var(--gradient-accent-line)]" />
              {reportTimeline.eyebrow}
            </span>
            <h3 className="m-0 font-display text-[clamp(26px,3vw,40px)] leading-[1.12] font-bold tracking-[-0.015em] text-balance text-ink">
              {reportTimeline.title}
            </h3>
            <p className="m-0 text-[15px] leading-6 text-ink-muted sm:text-base">{reportTimeline.caption}</p>
          </Reveal>

          <Timeline
            items={reportTimeline.stages}
            label={reportTimeline.title}
            headingLevel="h4"
            className="max-sm:gap-6 max-sm:[&_.timeline-item_p]:text-[14px] max-sm:[&_.timeline-item_p]:leading-[21px]"
          />

          <Link
            href={reportCopy.link.href}
            prefetch={false}
            className="group inline-flex items-center gap-1.5 self-start font-display text-base font-semibold text-cyan-200 no-underline hover:text-cyan-200 hover:underline"
          >
            {reportCopy.link.label}
            <ArrowRightIcon
              size={18}
              className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
            />
          </Link>
        </div>
      </div>
    </Section>
  );
}
