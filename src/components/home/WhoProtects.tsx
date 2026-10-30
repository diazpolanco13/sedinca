import Link from "next/link";
import { ArrowRightIcon, CheckCircleIcon } from "@/components/icons";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { PendingPhoto, SourceNote } from "@/components/ui/Pending";
import { Reveal } from "@/components/ui/Reveal";
import { Accent, Section, SectionHeader } from "@/components/ui/Section";
import { officerRequirements, officerRequirementsIntro, quienProtege, trainingSyllabus } from "@/content/answers";
import { whoCopy } from "./homeContent";

/**
 * 04 · «Quién protege su instalación» (propuesta, 7.4): requisitos de
 * ingreso (art. 25) como lista con marcas de verificación (la frase larga
 * queda para la pregunta frecuente), el curso de 120 horas aprobado por el
 * INCES (art. 28) y su temario en chips (deslizables en móvil, con un
 * desvanecido que indica que hay más). La foto real llega con la sesión de
 * fotos: mientras tanto, hueco pendiente (solo en revisión).
 */
export function WhoProtects() {
  return (
    <Section
      tone="light"
      space="none"
      id="quien-protege"
      labelledBy="quien-protege-titulo"
      className="py-14 sm:py-20 lg:py-28"
    >
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="flex flex-col gap-6 lg:col-span-6">
          <Reveal as="header" className="flex flex-col gap-3">
            <SectionHeader
              id="quien-protege-titulo"
              eyebrow={quienProtege.eyebrow}
              title={
                <>
                  Quién protege su <Accent>instalación</Accent>
                </>
              }
              lead={officerRequirementsIntro}
              className="max-sm:[&_p]:text-base max-sm:[&_p]:leading-[26px]"
            />
          </Reveal>
          <ul className="m-0 grid list-none gap-x-6 gap-y-3 p-0 sm:grid-cols-2">
            {officerRequirements.map((item) => (
              <li key={item} className="flex gap-3 text-base leading-6 font-medium text-ink sm:last:col-span-2">
                <CheckCircleIcon size={22} className="mt-px flex-none text-ink-brand" />
                {item}
              </li>
            ))}
          </ul>
          <SourceNote source={quienProtege.source} />
          {quienProtege.link && (
            <Link
              href={quienProtege.link.href}
              prefetch={false}
              className="group -my-3 inline-flex items-center gap-1.5 self-start py-3 font-display text-base font-semibold text-ink-brand no-underline hover:underline"
            >
              {quienProtege.link.label}
              <ArrowRightIcon
                size={18}
                className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
              />
            </Link>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-6 lg:col-span-6">
          <PendingPhoto label={whoCopy.photo} className="aspect-[16/10]" />

          <Reveal>
            {/* Relleno de serie de Card (24px) y sm:p-8: la fila de chips sangra exactamente eso. */}
            <Card elevation={2} accent className="sm:p-8">
              <div className="flex flex-col gap-5 sm:gap-6">
                <div className="flex flex-wrap items-end gap-x-5 gap-y-3">
                  <p className="m-0 flex items-baseline gap-2 font-display leading-none font-bold tracking-[-0.03em] text-ink-brand">
                    <span className="text-[clamp(64px,7vw,96px)]">{whoCopy.training.value}</span>
                    <span className="text-2xl tracking-[-0.01em] sm:text-3xl">{whoCopy.training.unit}</span>
                  </p>
                  <p className="m-0 max-w-[360px] pb-1.5 font-display text-base leading-6 font-semibold text-ink sm:text-lg">
                    {whoCopy.training.text}
                  </p>
                </div>

                <div className="flex flex-col gap-3 border-t border-line pt-5">
                  <h3 className="eyebrow m-0 text-ink-muted">{quienProtege.list.title}</h3>
                  {/* Móvil: fila deslizable de borde a borde de la tarjeta, con desvanecido a la derecha. */}
                  <div
                    role="region"
                    aria-label={quienProtege.list.title}
                    tabIndex={0}
                    className="-mx-6 snap-x overflow-x-auto scroll-px-6 px-6 pb-1 [mask-image:linear-gradient(90deg,black_calc(100%-56px),transparent)] [scrollbar-width:thin] sm:mx-0 sm:overflow-visible sm:px-0 sm:[mask-image:none]"
                  >
                    <ul className="m-0 flex w-max list-none gap-2 p-0 sm:w-auto sm:flex-wrap">
                      {trainingSyllabus.map((topic) => (
                        <li key={topic} className="flex-none snap-start">
                          <Chip className="whitespace-nowrap">{topic}</Chip>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <SourceNote source={whoCopy.training.source} />
                </div>
              </div>
            </Card>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
