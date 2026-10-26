import Link from "next/link";
import { Fragment } from "react";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Placeholder } from "@/components/ui/Placeholder";
import { Eyebrow, SectionTitle } from "@/components/ui/SectionHeading";
import { getService, type ServiceContent } from "@/content/services";
import { routes } from "@/config/site";

const primaryLink =
  "inline-flex items-center rounded-(--radius) bg-[image:var(--gradient-action)] font-display font-bold tracking-[0.04em] text-on-brand no-underline transition-[filter,box-shadow,transform] hover:text-on-brand hover:brightness-[1.08] active:scale-[0.98]";

/** Plantilla de página de servicio (02-plantilla-servicio). */
export function ServiceTemplate({ service }: { service: ServiceContent }) {
  const related = service.related.map((slug) => getService(slug)!);

  return (
    <>
      {/* Portada del servicio */}
      <section
        aria-labelledby="servicio-titulo"
        className="border-b border-line bg-[image:var(--gradient-atmosphere)]"
      >
        <div className="mx-auto flex max-w-[1344px] flex-col gap-8 px-4 pt-6 pb-14 sm:px-8 sm:pt-8 sm:pb-[72px]">
          <nav aria-label="Ruta" className="text-sm leading-5 text-ink-muted">
            <ol className="m-0 flex list-none flex-wrap gap-2 p-0">
              <li className="flex gap-2">
                <Link
                  href={routes.home}
                  className="text-ink-brand no-underline hover:text-brand-deep"
                >
                  Inicio
                </Link>
                <span aria-hidden="true">/</span>
              </li>
              <li className="flex gap-2">
                <Link
                  href={routes.services}
                  className="text-ink-brand no-underline hover:text-brand-deep"
                >
                  Servicios
                </Link>
                <span aria-hidden="true">/</span>
              </li>
              <li aria-current="page">{service.name}</li>
            </ol>
          </nav>
          <div className="flex flex-wrap items-center gap-12">
            <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-5">
              <Eyebrow>Servicio</Eyebrow>
              <h1
                id="servicio-titulo"
                className="m-0 font-display text-[clamp(40px,5vw,60px)] leading-[1.05] font-bold tracking-[-0.02em]"
              >
                {service.title.text} <span className="text-brand">{service.title.highlight}</span>
              </h1>
              <p className="m-0 max-w-[540px] text-lg leading-7 text-ink-muted">{service.lead}</p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={routes.contact}
                  className={`${primaryLink} h-12 px-7 text-[15px] shadow-inset-highlight hover:shadow-[var(--inset-highlight),var(--glow-cyan)]`}
                >
                  Cotizar este servicio
                </Link>
                <a
                  href="#modalidades"
                  className="inline-flex h-[51px] items-center rounded-(--radius) border-[1.5px] border-line bg-surface px-7 font-display text-[15px] font-semibold tracking-[0.04em] text-ink no-underline transition-colors hover:border-brand hover:bg-surface-brand hover:text-ink active:scale-[0.98]"
                >
                  {service.modes.cta}
                </a>
              </div>
            </div>
            <Placeholder
              tone="photo"
              label={service.photo.label}
              text={service.photo.caption}
              className="h-[280px] min-w-0 flex-[1_1_440px] sm:h-[400px]"
            />
          </div>
        </div>
      </section>

      {/* Modalidades */}
      <section id="modalidades" aria-labelledby="modalidades-titulo" className="scroll-mt-4">
        <div className="mx-auto flex max-w-[1344px] flex-col gap-8 px-4 pt-16 pb-12 sm:px-8 lg:pt-[88px] lg:pb-14">
          <div className="flex max-w-[640px] flex-col gap-3">
            <Eyebrow>{service.modes.eyebrow}</Eyebrow>
            <SectionTitle>
              <span id="modalidades-titulo">{service.modes.heading}</span>
            </SectionTitle>
          </div>
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

      {/* Beneficios */}
      <section aria-label="Beneficios" className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-[1344px] grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-8 px-4 py-12 sm:px-8 sm:py-14">
          {service.benefits.map(({ Icon, title, text }) => (
            <div key={title} className="flex flex-col gap-2.5">
              <Icon size={32} className="text-ink-brand" />
              <div className="font-display text-lg leading-6 font-bold">{title}</div>
              <div className="text-[15px] leading-[22px] text-ink-muted">{text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Cómo trabajamos */}
      <section aria-labelledby="proceso-titulo">
        <div className="mx-auto flex max-w-[1344px] flex-col gap-8 px-4 py-16 sm:px-8 lg:py-[88px]">
          <div className="flex max-w-[640px] flex-col gap-3">
            <Eyebrow>Cómo trabajamos</Eyebrow>
            <SectionTitle>
              <span id="proceso-titulo">{service.stepsHeading}</span>
            </SectionTitle>
          </div>
          <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6 p-0">
            {service.steps.map((step, i) => (
              <li key={step.title} className="flex flex-col gap-2.5 border-t-2 border-brand pt-5">
                <span
                  aria-hidden="true"
                  className="font-display text-[32px] leading-9 font-bold text-brand"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-lg leading-6 font-semibold">{step.title}</span>
                <span className="text-[15px] leading-[22px] text-ink-muted">{step.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Dónde aplica + CTA */}
      <section aria-label="Dónde aplica" className="bg-surface-sunken">
        <div className="mx-auto flex max-w-[1344px] flex-wrap items-center justify-between gap-8 px-4 py-14 sm:px-8 lg:py-[72px]">
          <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-4">
            <Eyebrow>Dónde aplica</Eyebrow>
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
                  <Link href={`${routes.services}/${r.slug}`} className="underline hover:text-brand-deep">
                    {r.name}
                  </Link>
                </Fragment>
              ))}
            </span>
          </div>
          <Link
            href={routes.contact}
            className={`${primaryLink} h-[52px] px-8 text-base shadow-[var(--inset-highlight),var(--glow-cyan)]`}
          >
            Solicitar cotización
          </Link>
        </div>
      </section>
    </>
  );
}
