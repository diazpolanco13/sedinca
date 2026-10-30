import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { SitePage } from "@/components/layout/SitePage";
import { PriceFactorsList } from "@/components/service/ServiceBlocks";
import { ServiceHero } from "@/components/service/ServiceHero";
import {
  ConcernGrid,
  ServiceCatalogGrid,
  ServicePicker,
  ServiceQuickLinks,
} from "@/components/service/ServiceIndex";
import { CtaBand } from "@/components/ui/CtaBand";
import { Accent, Section, SectionHeader } from "@/components/ui/Section";
import { Timeline } from "@/components/ui/Timeline";
import { Pend } from "@/components/ui/Pending";
import { absoluteUrl, cotizarHref, ctaLabels, routes } from "@/config/site";
import { precio } from "@/content/answers";
import { onboarding } from "@/content/process";
import { umami } from "@/lib/analytics";

export const metadata: Metadata = {
  title: "Servicios de seguridad privada en Maracaibo",
  description:
    "Vigilancia privada no armada, control de acceso, cámaras HD con visión nocturna, cercado eléctrico y gestión de riesgos en Maracaibo y el Zulia.",
  alternates: { canonical: absoluteUrl(routes.services) },
};

/**
 * /servicios (propuesta 8.1): índice por problema («Lo que le preocupa,
 * resuelto»), los 4 servicios con foto, «¿De qué depende el precio?» (4.7)
 * con «De la inspección al primer turno» (4.10) y el cierre. En móvil, la
 * portada lleva los 4 servicios como enlaces compactos en lugar del selector
 * de vidrio.
 * Ritmo: portada → light → dark → light → dark (cierre).
 */
export default function ServicesPage() {
  return (
    <SitePage>
      <ServiceHero
        crumbs={[{ label: "Servicios" }]}
        path={routes.services}
        eyebrow="Servicios · Maracaibo y el Zulia"
        title={{ text: "Servicios de seguridad privada en Maracaibo y el", highlight: "Zulia" }}
        lead="Vigilancia privada no armada, control de acceso, cámaras con visión nocturna, cercado eléctrico y gestión de riesgos para la industria, las empresas y los condominios del Zulia."
        aside={<ServicePicker />}
      >
        <Link
          href={cotizarHref()}
          prefetch={false}
          {...umami("cta-cotizar", { ubicacion: "portada" })}
          className="group inline-flex items-center gap-2 self-start pt-1 font-display text-base font-semibold text-cyan-200 no-underline hover:text-white hover:underline"
        >
          ¿No sabe cuál necesita? {ctaLabels.diagnostico} en 4 preguntas
          <ArrowRightIcon
            size={18}
            className="flex-none transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
          />
        </Link>
        <ServiceQuickLinks />
      </ServiceHero>

      {/* Lo que le preocupa, resuelto ------------------------------------ */}
      <Section tone="light" id="lo-que-le-preocupa" labelledBy="preocupa-titulo">
        <SectionHeader
          eyebrow="Por dónde empezar"
          title={
            <>
              Lo que le preocupa, <Accent>resuelto</Accent>
            </>
          }
          lead="Empiece por el problema. Cada respuesta le lleva al servicio que lo resuelve."
          id="preocupa-titulo"
        />
        <div className="mt-12 lg:mt-16">
          <ConcernGrid />
        </div>
      </Section>

      {/* Los 4 servicios ------------------------------------------------- */}
      <Section tone="dark" id="catalogo" labelledBy="catalogo-titulo">
        <SectionHeader
          eyebrow="Los servicios"
          title="Cuatro servicios que se combinan según su instalación"
          lead="Oficiales, controles y tecnología en una sola propuesta, con supervisión en sitio y un libro de novedades en cada puesto."
          id="catalogo-titulo"
        />
        <div className="mt-12 lg:mt-16">
          <ServiceCatalogGrid />
        </div>
      </Section>

      {/* Precio y cómo empezamos ----------------------------------------- */}
      <Section tone="light" id="precio" labelledBy="precio-titulo">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          <div className="flex flex-col gap-10 lg:col-span-5">
            <SectionHeader
              eyebrow={precio.eyebrow}
              title={precio.title}
              lead={precio.body[0]}
              size="md"
              id="precio-titulo"
            />
            <PriceFactorsList />
          </div>
          <div className="flex flex-col gap-10 lg:col-span-7">
            <SectionHeader
              eyebrow={onboarding.eyebrow}
              title={onboarding.title}
              lead={onboarding.lead}
              size="md"
              id="proceso-titulo"
            />
            <Timeline items={onboarding.stages} label={onboarding.title} />
            <Pend
              as="p"
              className="m-0 text-[15px] leading-6 text-ink-muted"
              text={onboarding.note}
            />
          </div>
        </div>
      </Section>

      <CtaBand
        eyebrow="Asesoría"
        title="¿No sabe qué servicio necesita?"
        lead="Cuéntenos qué necesita proteger: un asesor evalúa su instalación y le propone la combinación adecuada. Sin compromiso."
        audience="general"
      />
    </SitePage>
  );
}
