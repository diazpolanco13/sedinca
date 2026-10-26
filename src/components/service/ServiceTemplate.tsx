import Link from "next/link";
import { Fragment } from "react";
import { FeatureBand, SectionHeader, StepList } from "@/components/ui/blocks";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHero } from "@/components/ui/PageHero";
import { getService, type ServiceContent } from "@/content/services";
import { routes } from "@/config/site";

/** Plantilla de página de servicio (02-plantilla-servicio). */
export function ServiceTemplate({ service }: { service: ServiceContent }) {
  const related = service.related.map((slug) => getService(slug)!);

  return (
    <>
      <PageHero
        crumbs={[{ label: "Servicios", href: routes.services }, { label: service.name }]}
        eyebrow="Servicio"
        title={service.title}
        lead={service.lead}
        primary={{ label: "Cotizar este servicio", href: routes.contact }}
        secondary={{ label: service.modes.cta, href: "#modalidades" }}
      />

      {/* Modalidades */}
      <section id="modalidades" aria-labelledby="modalidades-titulo" className="scroll-mt-4">
        <div className="mx-auto flex max-w-[1344px] flex-col gap-8 px-4 pt-16 pb-12 sm:px-8 lg:pt-[88px] lg:pb-14">
          <SectionHeader
            eyebrow={service.modes.eyebrow}
            title={service.modes.heading}
            id="modalidades-titulo"
          />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-6">
            {service.modes.items.map((m) => (
              <Card key={m.title} elevation={1} accent>
                <div className="flex flex-col gap-3 p-2">
                  <Chip live={m.live} className="self-start">
                    {m.chip}
                  </Chip>
                  <h3 className="m-0 font-display text-2xl leading-8 font-semibold">{m.title}</h3>
                  <p className="m-0 text-base leading-6 text-ink-muted">{m.text}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <FeatureBand label="Beneficios" items={service.benefits} />

      {/* Cómo trabajamos */}
      <section aria-labelledby="proceso-titulo">
        <div className="mx-auto flex max-w-[1344px] flex-col gap-8 px-4 py-16 sm:px-8 lg:py-[88px]">
          <SectionHeader
            eyebrow="Cómo trabajamos"
            title={service.stepsHeading}
            id="proceso-titulo"
          />
          <StepList steps={service.steps} />
        </div>
      </section>

      <CtaBand label="Dónde aplica" eyebrow="Dónde aplica">
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {service.sectors.map((s) => (
            <li key={s}>
              <Chip>{s}</Chip>
            </li>
          ))}
        </ul>
        <span className="text-sm leading-5 text-ink-muted">
          Servicios relacionados:{" "}
          {related.map((r, i) => (
            <Fragment key={r.slug}>
              {i > 0 && " · "}
              <Link
                href={`${routes.services}/${r.slug}`}
                className="underline hover:text-brand-deep"
              >
                {r.name}
              </Link>
            </Fragment>
          ))}
        </span>
      </CtaBand>
    </>
  );
}
