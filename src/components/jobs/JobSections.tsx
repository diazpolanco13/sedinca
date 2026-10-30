import {
  ArrowRightIcon,
  BookIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  FileTextIcon,
  IdCardIcon,
  MedalIcon,
  ShieldCheckIcon,
  UserCheckIcon,
  UsersIcon,
} from "@/components/icons";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { GlassCard } from "@/components/ui/GlassCard";
import { Pend, PendingPhoto, SourceNote } from "@/components/ui/Pending";
import { Reveal } from "@/components/ui/Reveal";
import { Accent, Section, SectionHeader } from "@/components/ui/Section";
import { Timeline } from "@/components/ui/Timeline";
import { CallLink, MailLink, WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { ctaLabels, routes, site, waMessages } from "@/config/site";
import { trainingSyllabus } from "@/content/answers";
import { filterPending } from "@/lib/pending";
import { JobForm } from "./JobForm";
import {
  applyCopy,
  documents,
  duties,
  jobsUbicacion,
  offerCopy,
  privacyPagePublished,
  processCopy,
  requirements,
  requirementsCopy,
  roleCopy,
  type DutyId,
  type JobItem,
  type OfferId,
} from "./jobsContent";

/*
 * Secciones de /empleo (propuesta 6.4 y 8.9). Ritmo: portada (foto) → claro
 * (el puesto) → gris (requisitos) → OSCURO (qué ofrece) → claro (proceso) →
 * marca (postulación) → pie oscuro. Sin botones de cotización.
 */

const dutyIcons: Record<DutyId, typeof ClockIcon> = {
  llegada: ClockIcon,
  accesos: IdCardIcon,
  rondas: EyeIcon,
  libro: BookIcon,
  relevo: UserCheckIcon,
};

const offerIcons: Record<OfferId, typeof ClockIcon> = {
  ascenso: MedalIcon,
  uniforme: ShieldCheckIcon,
  acompanamiento: UsersIcon,
};

/** Enlace de texto con flecha a un ancla de la misma página. */
function AnchorLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-1.5 self-start font-display text-base font-semibold text-ink-brand no-underline hover:underline"
    >
      {children}
      <ArrowRightIcon
        size={18}
        className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
      />
    </a>
  );
}

/* 1 · El puesto ------------------------------------------------------------ */
export function RoleSection() {
  return (
    <Section tone="light" id="el-puesto" labelledBy="el-puesto-titulo">
      {/* En móvil: titular → funciones → supervisor; desde 1024px, funciones a la derecha. */}
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-10">
        <Reveal as="header" className="flex flex-col gap-3 lg:col-span-5 lg:row-start-1">
          <SectionHeader
            id="el-puesto-titulo"
            eyebrow={roleCopy.eyebrow}
            title={
              <>
                {roleCopy.title.text} <Accent>{roleCopy.title.highlight}</Accent>
              </>
            }
            lead={roleCopy.lead}
          />
          <SourceNote source={roleCopy.leadSource} />
        </Reveal>

        <ol
          aria-label="Funciones del oficial de seguridad"
          className="m-0 flex list-none flex-col p-0 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1"
        >
          {duties.map((duty) => {
            const Icon = dutyIcons[duty.id];
            return (
              <Reveal
                as="li"
                key={duty.id}
                className="flex gap-5 border-t border-line py-6 first:border-t-0 first:pt-0 last:pb-0"
              >
                <span
                  aria-hidden="true"
                  className="grid h-12 w-12 flex-none place-items-center rounded-lg bg-surface-brand text-ink-brand"
                >
                  <Icon size={24} />
                </span>
                <div className="flex min-w-0 flex-col gap-1.5">
                  <h3 className="m-0 font-display text-lg leading-6 font-bold tracking-[-0.01em] text-ink sm:text-xl sm:leading-7">
                    {duty.title}
                  </h3>
                  <p className="m-0 text-[15px] leading-6 text-ink-muted sm:text-base sm:leading-[26px]">{duty.text}</p>
                  <SourceNote source={duty.source} />
                </div>
              </Reveal>
            );
          })}
        </ol>

        <Reveal className="lg:col-span-5 lg:row-start-2 lg:self-start">
          <Card elevation={1} accent className="flex flex-col gap-3 sm:p-8">
            <h3 className="m-0 font-display text-xl leading-7 font-bold tracking-[-0.01em] text-ink">
              {roleCopy.supervisor.title}
            </h3>
            <p className="m-0 text-[15px] leading-6 text-ink-muted">{roleCopy.supervisor.text}</p>
            <SourceNote source={roleCopy.supervisor.source} />
            <AnchorLink href="#postulacion">{roleCopy.supervisor.link}</AnchorLink>
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}

/* 2 · Requisitos y documentos (art. 25) ------------------------------------ */
function ItemList({
  items,
  icon: Icon,
}: {
  items: readonly JobItem[];
  icon: typeof ClockIcon;
}) {
  const visible = filterPending(items, (item) => item.text);
  return (
    <ul className="m-0 flex list-none flex-col p-0">
      {visible.map((item) => (
        <li key={item.text} className="flex gap-3 border-t border-line py-3.5 first:border-t-0 first:pt-0 last:pb-0">
          <Icon size={20} className="mt-0.5 flex-none text-ink-accent" />
          <span className="text-[15px] leading-6 text-ink sm:text-base">
            <Pend text={item.text} />
          </span>
        </li>
      ))}
    </ul>
  );
}

export function RequirementsSection() {
  return (
    <Section tone="sunken" id="requisitos" labelledBy="requisitos-titulo">
      <Reveal as="header" className="flex flex-col gap-3">
        <SectionHeader
          id="requisitos-titulo"
          eyebrow={requirementsCopy.eyebrow}
          title={
            <>
              {requirementsCopy.title.text} <Accent>{requirementsCopy.title.highlight}</Accent>
            </>
          }
          lead={requirementsCopy.lead}
        />
        <SourceNote source={requirementsCopy.source} />
      </Reveal>
      <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-2">
        <Reveal>
          <Card elevation={1} accent className="flex h-full flex-col gap-5 sm:p-8">
            <h3 className="m-0 font-display text-2xl leading-8 font-bold tracking-[-0.01em] text-ink">
              {requirementsCopy.requirementsTitle}
            </h3>
            <ItemList items={requirements} icon={CheckCircleIcon} />
          </Card>
        </Reveal>
        <Reveal>
          <Card elevation={1} accent className="flex h-full flex-col gap-5 sm:p-8">
            <h3 className="m-0 font-display text-2xl leading-8 font-bold tracking-[-0.01em] text-ink">
              {requirementsCopy.documentsTitle}
            </h3>
            <ItemList items={documents} icon={FileTextIcon} />
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}

/* 3 · Qué ofrece SEDIN ------------------------------------------------------ */
export function OfferSection() {
  const t = offerCopy.training;
  return (
    <Section tone="dark" id="que-ofrece" labelledBy="que-ofrece-titulo">
      <Reveal as="header">
        <SectionHeader
          id="que-ofrece-titulo"
          eyebrow={offerCopy.eyebrow}
          title={
            <>
              {offerCopy.title.text} <Accent>{offerCopy.title.highlight}</Accent>
            </>
          }
          lead={offerCopy.lead}
        />
      </Reveal>

      <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-12">
        <Reveal className="min-w-0 lg:col-span-7">
          <GlassCard tone="dark" level={2} accent className="flex h-full flex-col gap-6 sm:p-10">
            <PendingPhoto label={t.photo} className="aspect-[16/7]" />
            <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
              <p className="m-0 flex items-baseline gap-2 font-display leading-none font-bold tracking-[-0.03em] text-ink-brand">
                <span className="text-[clamp(72px,8vw,112px)]">{t.value}</span>
                <span className="text-2xl tracking-[-0.01em] sm:text-3xl">{t.unit}</span>
              </p>
              <h3 className="m-0 max-w-[340px] pb-2 font-display text-lg leading-6 font-semibold text-ink sm:text-xl sm:leading-7">
                {t.title}
              </h3>
            </div>
            <p className="m-0 text-base leading-[26px] text-ink-muted">{t.text}</p>
            <SourceNote source={t.source} />
            <div className="mt-auto flex flex-col gap-3 border-t border-line pt-6">
              <h4 className="eyebrow m-0 text-ink-muted">{t.syllabusTitle}</h4>
              <div
                role="region"
                aria-label={t.syllabusTitle}
                tabIndex={0}
                className="-mx-6 overflow-x-auto px-6 pb-1 [scrollbar-width:thin] sm:mx-0 sm:overflow-visible sm:px-0"
              >
                <ul className="m-0 flex w-max list-none gap-2 p-0 sm:w-auto sm:flex-wrap">
                  {trainingSyllabus.map((topic) => (
                    <li key={topic} className="flex-none">
                      <Chip className="whitespace-nowrap">{topic}</Chip>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </GlassCard>
        </Reveal>

        <ul className="m-0 flex list-none flex-col gap-6 p-0 lg:col-span-5">
          {offerCopy.items.map((item) => {
            const Icon = offerIcons[item.id];
            return (
              <Reveal as="li" key={item.id} className="flex">
                <Card elevation={1} className="flex w-full gap-4 sm:p-7">
                  <span
                    aria-hidden="true"
                    className="grid h-11 w-11 flex-none place-items-center rounded-full border border-line-cyan text-ink-accent"
                  >
                    <Icon size={22} />
                  </span>
                  <div className="flex min-w-0 flex-col gap-1.5">
                    <h3 className="m-0 font-display text-lg leading-6 font-bold tracking-[-0.01em] text-ink">
                      {item.title}
                    </h3>
                    <Pend as="p" className="m-0 text-[15px] leading-6 text-ink-muted" text={item.text} />
                    <SourceNote source={item.source} />
                  </div>
                </Card>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}

/* 4 · Proceso de selección -------------------------------------------------- */
export function ProcessSection() {
  return (
    <Section tone="light" id="proceso" labelledBy="proceso-titulo">
      <Reveal as="header">
        <SectionHeader
          id="proceso-titulo"
          eyebrow={processCopy.eyebrow}
          title={
            <>
              {processCopy.title.text} <Accent>{processCopy.title.highlight}</Accent>
            </>
          }
          lead={processCopy.lead}
        />
      </Reveal>
      <div className="mt-12 lg:mt-16">
        <Timeline items={processCopy.steps} variant="steps" label={processCopy.eyebrow} />
      </div>
    </Section>
  );
}

/* 5 · Postulación ----------------------------------------------------------- */
export function ApplySection() {
  return (
    <Section tone="brand" id="postulacion" labelledBy="postulacion-titulo">
      <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="flex flex-col gap-8 lg:col-span-5">
          <SectionHeader
            id="postulacion-titulo"
            eyebrow={applyCopy.eyebrow}
            title={
              <>
                {applyCopy.title.text} <Accent>{applyCopy.title.highlight}</Accent>
              </>
            }
            lead={applyCopy.lead}
          />

          <div className="flex flex-col gap-4">
            <Card elevation="card" accent className="flex flex-col gap-3 sm:p-7">
              <h3 className="m-0 font-display text-lg leading-6 font-bold text-ink">{applyCopy.whatsapp.title}</h3>
              <p className="m-0 text-[15px] leading-6 text-ink-muted">{applyCopy.whatsapp.text}</p>
              <WhatsAppLink
                message={waMessages.empleo}
                ubicacion={jobsUbicacion}
                event="postulacion-whatsapp"
                variant="primary"
                size="lg"
                block
                copy
                className="pt-1"
              >
                {ctaLabels.postular}
              </WhatsAppLink>
              <Pend as="p" className="m-0 text-sm leading-5 text-ink-muted" text={applyCopy.channelNote} />
            </Card>

            <Card elevation="card" className="flex flex-col gap-3 sm:p-7">
              <h3 className="m-0 font-display text-lg leading-6 font-bold text-ink">{applyCopy.mail.title}</h3>
              <p className="m-0 text-[15px] leading-6 text-ink-muted">{applyCopy.mail.text}</p>
              <MailLink
                to={site.jobsEmail}
                subject={applyCopy.mail.subject}
                body={applyCopy.mail.body}
                ubicacion={jobsUbicacion}
                variant="inline"
              >
                {site.jobsEmail}
              </MailLink>
            </Card>

            <div className="flex flex-col gap-1 px-1 text-[15px] leading-6">
              <span className="field-label">{applyCopy.questions}</span>
              <CallLink ubicacion={jobsUbicacion} variant="inline">
                {site.phone}
              </CallLink>
            </div>
          </div>
        </div>

        <JobForm
          ubicacion={jobsUbicacion}
          privacyHref={privacyPagePublished ? routes.privacidad : undefined}
          className="lg:col-span-7"
        />
      </div>
    </Section>
  );
}
