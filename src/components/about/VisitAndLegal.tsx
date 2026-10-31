import Link from "next/link";
import { ArrowRightIcon, ClockIcon } from "@/components/icons";
import { OfficeMap } from "@/components/contact/OfficeMap";
import { ActionLink } from "@/components/ui/ActionLink";
import { Pend, PendingPhoto, SourceNote } from "@/components/ui/Pending";
import { Reveal } from "@/components/ui/Reveal";
import { Accent, Section, SectionHeader } from "@/components/ui/Section";
import { CallLink, WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { kitMail, site } from "@/config/site";
import { filterPending } from "@/lib/pending";
import { aboutUbicacion, legal, visit, visitWhatsapp } from "./aboutContent";

/**
 * 6-7 · «Visítenos» con el plano de la esquina (el mismo `OfficeMap` de
 * /contacto: Calle 82 con Avenida 14, «Cómo llegar» y el mapa de Google a
 * demanda) y el hueco de la foto real de la oficina (solo en revisión), y la
 * ficha legal (RIF y autorización vigente de la DIGESERVISP publicados;
 * Registro Mercantil y número de la autorización como pendientes), con enlace
 * al kit de proveedor de /empresas.
 */
export function VisitAndLegal() {
  const rows = filterPending(legal.rows, (r) => r.value);
  return (
    <Section tone="brand" id="visitenos" labelledBy="visitenos-titulo">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        {/* Visítenos */}
        <div className="flex min-w-0 flex-col gap-8 lg:col-span-7 lg:pr-8">
          <Reveal as="header">
            <SectionHeader
              id="visitenos-titulo"
              eyebrow={visit.eyebrow}
              title={
                <>
                  {visit.title.text} <Accent>{visit.title.highlight}</Accent>
                </>
              }
              size="md"
            />
          </Reveal>

          <PendingPhoto label={visit.photo} className="aspect-[16/7]" />
          <Reveal>
            <OfficeMap ubicacion={aboutUbicacion} />
          </Reveal>

          <ul className="m-0 flex list-none flex-col gap-3 p-0 text-[15px] leading-6 text-ink-muted">
            <li className="flex gap-3">
              <ClockIcon size={20} className="mt-0.5 flex-none text-ink-brand" />
              <span>
                Atención {site.hours} por teléfono y WhatsApp: {site.responseTime.toLowerCase()}.
              </span>
            </li>
            <Pend as="li" className="pl-8" text={visit.officeHours} />
            <li className="pl-8">{visit.note}</li>
          </ul>

          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
            <WhatsAppLink message={visitWhatsapp} ubicacion={aboutUbicacion} variant="primary" size="md" block>
              {visit.whatsappLabel}
            </WhatsAppLink>
            <CallLink ubicacion={aboutUbicacion} variant="secondary" size="md" block />
          </div>
        </div>

        {/* Ficha legal */}
        <Reveal
          id="ficha"
          className="flex scroll-mt-28 flex-col gap-6 rounded-xl border border-line-card bg-surface p-6 shadow-elevation-1 sm:p-10 lg:col-span-5"
        >
          <span className="eyebrow inline-flex items-center gap-3 text-ink-brand">
            <span aria-hidden="true" className="h-0.5 w-8 rounded-full bg-[image:var(--gradient-accent-line)]" />
            {legal.eyebrow}
          </span>
          <h2 className="m-0 font-display text-[clamp(26px,3vw,36px)] leading-[1.12] font-bold tracking-[-0.015em] text-ink">
            {legal.title}
          </h2>
          <dl className="m-0 flex flex-col">
            {rows.map((row, i) => (
              <div key={row.term} className={i > 0 ? "border-t border-line py-4" : "pb-4"}>
                <dt className="field-label">{row.term}</dt>
                <dd className="m-0 pt-1 text-base leading-6 font-medium text-ink">
                  <Pend text={row.value} />
                  {"source" in row && <SourceNote source={row.source} className="mt-1 block" />}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-auto flex flex-col gap-3 border-t border-line pt-5 text-[15px] leading-6">
            <p className="m-0 text-ink-muted">{legal.more}</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
              <Link
                href={legal.moreLink.href}
                prefetch={false}
                className="group inline-flex items-center gap-1.5 font-display font-semibold text-ink-brand no-underline hover:underline"
              >
                {legal.moreLink.label}
                <ArrowRightIcon
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                />
              </Link>
              <ActionLink action={kitMail(aboutUbicacion)} variant="inline" />
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
