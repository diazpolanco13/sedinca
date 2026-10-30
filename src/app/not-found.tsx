import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { SitePage } from "@/components/layout/SitePage";
import { ActionGroup } from "@/components/ui/ActionLink";
import { HeroBackdrop } from "@/components/ui/HeroBackdrop";
import { Section, SectionHeader } from "@/components/ui/Section";
import { audienceActions, knowMoreLinks, routes } from "@/config/site";

// Next añade por sí mismo <meta name="robots" content="noindex"> en la 404.
export const metadata: Metadata = {
  title: "Página no encontrada",
  description: "La página que busca no existe o cambió de dirección. Le dejamos los caminos más útiles de sedinca.com.",
};

const exits = [
  knowMoreLinks.sectores,
  knowMoreLinks.servicios,
  knowMoreLinks.comoTrabajamos,
  knowMoreLinks.contacto,
] as const;

/** 404 en español con salidas (propuesta, 0.6). Se exporta como out/404.html. */
export default function NotFound() {
  return (
    <SitePage>
      <section
        aria-labelledby="error-titulo"
        className="relative flex min-h-[520px] flex-col bg-azure-950 pt-16 text-white lg:min-h-[600px] lg:pt-[128px]"
      >
        <HeroBackdrop />
        <div className="on-dark relative mx-auto flex w-full max-w-[1344px] flex-1 flex-col justify-center gap-6 px-4 pt-10 pb-14 sm:px-8 lg:pb-20">
          <span className="font-display text-[13px] leading-5 font-semibold tracking-[0.14em] text-cyan-200 uppercase sm:text-sm">
            Error 404
          </span>
          <h1
            id="error-titulo"
            className="m-0 max-w-[760px] font-display text-[clamp(40px,5vw,72px)] leading-[1.04] font-bold tracking-[-0.02em] text-balance text-white [text-shadow:0_2px_24px_color-mix(in_srgb,var(--azure-950)_35%,transparent)]"
          >
            No encontramos <span className="text-azure-300">esta página</span>
          </h1>
          <p className="m-0 max-w-[620px] font-sans text-lg leading-7 font-light text-white/92 sm:text-xl sm:leading-8">
            Puede que el enlace haya cambiado con la nueva web. Abajo tiene los caminos más útiles; si busca algo
            concreto, escríbanos y le orientamos.
          </p>
          <ActionGroup
            actions={[
              ...audienceActions("residencial", { ubicacion: "404" }).slice(0, 1),
              { kind: "link", label: "Ir al inicio", href: routes.home },
            ]}
            tone="photo"
            size="lg"
            className="pt-2"
          />
        </div>
      </section>

      <Section tone="light" labelledBy="salidas-titulo">
        <SectionHeader id="salidas-titulo" eyebrow="Por dónde seguir" title="Lo que más se consulta" size="md" />
        <ul className="m-0 mt-12 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {exits.map((link) => (
            <li key={link.href} className="flex">
              <Link
                href={link.href}
                prefetch={false}
                className="card-interactive group flex w-full flex-col gap-3 rounded-lg border border-line-card bg-surface p-6 text-ink no-underline shadow-elevation-1 hover:text-ink"
              >
                <span className="eyebrow text-ink-brand">{link.eyebrow}</span>
                <span className="font-display text-xl leading-7 font-bold tracking-[-0.01em]">{link.title}</span>
                <span className="text-[15px] leading-[22px] text-ink-muted">{link.text}</span>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-2 font-display text-sm font-semibold text-ink-brand">
                  Ver
                  <ArrowRightIcon size={16} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </SitePage>
  );
}
