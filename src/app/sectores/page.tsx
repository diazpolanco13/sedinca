import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SitePage } from "@/components/layout/SitePage";
import { SectionHeader } from "@/components/ui/blocks";
import { Chip } from "@/components/ui/Chip";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHero } from "@/components/ui/PageHero";
import { cn } from "@/lib/cn";
import { sectorsContent } from "@/content/sectors";
import { getService } from "@/content/services";
import { routes } from "@/config/site";

export const metadata: Metadata = {
  title: "Sectores",
  description:
    "Seguridad privada para la industria petrolera, empresas e industria, corporaciones y conjuntos residenciales y condominios.",
};

export default function SectorsPage() {
  return (
    <SitePage>
      <PageHero
        crumbs={[{ label: "Sectores" }]}
        eyebrow="Sectores"
        title={{ text: "Servicios especializados para cada", highlight: "entorno" }}
        lead="Cada instalación tiene riesgos distintos. SEDIN adapta la vigilancia, el control de acceso y los sistemas electrónicos a la operación de cada sector."
        secondary={{ label: "Ver sectores", href: "#sectores" }}
      />

      <section id="sectores" aria-labelledby="sectores-titulo" className="scroll-mt-4">
        <div className="mx-auto flex max-w-[1344px] flex-col gap-12 px-4 py-16 sm:px-8 lg:gap-16 lg:py-[88px]">
          <SectionHeader
            eyebrow="Dónde trabajamos"
            title="Industria, empresas, corporaciones y residencias"
            id="sectores-titulo"
          />
          {sectorsContent.map((sector, i) => (
            <article
              key={sector.id}
              id={sector.id}
              aria-labelledby={`${sector.id}-titulo`}
              className={cn(
                "flex scroll-mt-4 flex-wrap items-center gap-8 lg:gap-12",
                i % 2 === 1 && "lg:flex-row-reverse",
              )}
            >
              <div className="relative h-[240px] min-w-0 flex-[1_1_420px] overflow-hidden rounded-xl sm:h-[320px]">
                <Image
                  src={sector.photo.src}
                  alt={sector.photo.alt}
                  fill
                  sizes="(min-width: 1024px) 616px, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-surface-brand text-ink-brand">
                  <sector.Icon size={26} />
                </div>
                <h3
                  id={`${sector.id}-titulo`}
                  className="m-0 font-display text-[28px] leading-9 font-bold tracking-[-0.01em]"
                >
                  {sector.title}
                </h3>
                <p className="m-0 text-[17px] leading-[26px] text-ink-muted">{sector.text}</p>
                <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[15px] leading-[22px]">
                  {sector.focus.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col gap-2 pt-2">
                  <span className="field-label">Servicios recomendados</span>
                  <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                    {sector.services.map((slug) => (
                      <li key={slug}>
                        <Link
                          href={`${routes.services}/${slug}`}
                          className="rounded-full no-underline transition-opacity hover:opacity-80"
                        >
                          <Chip>{getService(slug)!.name}</Chip>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CtaBand label="Cotización por sector" eyebrow="Cotización por sector">
        <p className="m-0 max-w-[560px] text-[17px] leading-[26px] text-ink-muted">
          Indica tu sector en el formulario y un asesor de SEDIN coordinará la inspección del sitio.
        </p>
      </CtaBand>
    </SitePage>
  );
}
