import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { ActionLink } from "@/components/ui/ActionLink";
import { GlassCard } from "@/components/ui/GlassCard";
import { sectorHref, type CtaAction } from "@/config/site";
import { getSector, type SectorContent } from "@/content/sectors";
import type { ServiceContent } from "@/content/services";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <dt className="eyebrow text-ink-muted">{label}</dt>
      <dd className="m-0 text-[15px] leading-[22px] text-ink">{children}</dd>
    </div>
  );
}

/**
 * «Ficha del servicio» (8.1): módulo de vidrio de la portada con las
 * modalidades, para quién (enlaces a los sectores), lo que incluye y el botón
 * contextual al diagnóstico, con WhatsApp precargado debajo. Solo desde
 * 1024px: en móvil la portada muestra los botones bajo la entradilla
 * (`ServiceHeroActions`) y lo que resume la ficha se cuenta en las dos
 * secciones siguientes («Qué incluye» y «Para quién»).
 */
export function ServiceFicha({ service }: { service: ServiceContent }) {
  const sectors = service.sectors
    .map((id) => getSector(id))
    .filter((s): s is SectorContent => Boolean(s));
  const [primary, secondary] = service.cta;
  const { Icon } = service;

  return (
    <aside aria-labelledby="ficha-titulo">
      <GlassCard tone="dark" level={2} accent className="p-6 sm:p-7">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <span className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-md border border-line-cyan bg-accent-subtle text-cyan-300">
              <Icon size={26} />
            </span>
            <div className="flex min-w-0 flex-col gap-1">
              <h2 id="ficha-titulo" className="eyebrow m-0 text-cyan-200">
                Ficha del servicio
              </h2>
              <p className="m-0 font-display text-xl leading-7 font-bold tracking-[-0.01em] text-ink">
                {service.name}
              </p>
            </div>
          </div>

          <dl className="m-0 grid gap-4 border-t border-line pt-5">
            <Row label={service.ficha.modesLabel}>{service.ficha.modes.join(" · ")}</Row>
            {sectors.length > 0 && (
              <Row label="Para quién">
                {sectors.map((s, i) => (
                  <Fragment key={s.id}>
                    {i > 0 && <span aria-hidden="true"> · </span>}
                    <Link
                      href={sectorHref(s.id)}
                      prefetch={false}
                      className="text-ink underline decoration-line-strong underline-offset-[3px] hover:text-cyan-200 hover:decoration-cyan-300"
                    >
                      {s.shortTitle}
                    </Link>
                  </Fragment>
                ))}
              </Row>
            )}
            <Row label="Incluye">{service.ficha.includes.join(" · ")}</Row>
            {service.ficha.note && <Row label="Servicio">{service.ficha.note}</Row>}
          </dl>

          {/* Botones de la portada en escritorio (en móvil van bajo la entradilla). */}
          <div className="flex flex-col gap-3" data-hero-actions="">
            {primary && <ActionLink action={primary} variant="primary" size="lg" className="w-full" />}
            {secondary && <ActionLink action={secondary} variant="onPhoto" size="md" className="w-full" />}
          </div>
        </div>
      </GlassCard>
    </aside>
  );
}

/**
 * Botones de la portada por debajo de 1024px (la ficha, con los suyos, solo
 * se ve desde 1024px): contextual al diagnóstico y WhatsApp precargado.
 */
export function ServiceHeroActions({ actions }: { actions: readonly CtaAction[] }) {
  const [primary, secondary] = actions;
  return (
    <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap sm:gap-4 lg:hidden" data-hero-actions="">
      {primary && <ActionLink action={primary} variant="primary" size="lg" block />}
      {secondary && <ActionLink action={secondary} variant="onPhoto" size="lg" block />}
    </div>
  );
}
