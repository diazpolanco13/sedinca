import { AboutIntro } from "@/components/about/AboutIntro";
import { aboutHero, aboutMeta, aboutUbicacion, aboutWhatsapp } from "@/components/about/aboutContent";
import { InteriorHero } from "@/components/about/InteriorHero";
import { QualitySystem } from "@/components/about/QualitySystem";
import { StructureChain } from "@/components/about/StructureChain";
import { ValuesBand } from "@/components/about/ValuesBand";
import { VisitAndLegal } from "@/components/about/VisitAndLegal";
import { SitePage } from "@/components/layout/SitePage";
import { ActionGroup } from "@/components/ui/ActionLink";
import { CtaBand } from "@/components/ui/CtaBand";
import { FactStrip } from "@/components/ui/FactStrip";
import { Pend } from "@/components/ui/Pending";
import { ArrowLink } from "@/components/ui/SectionHeading";
import { audienceActions, knowMoreLinks, routes } from "@/config/site";
import { isVisible } from "@/lib/pending";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ ...aboutMeta, path: routes.about });

/** Orden canónico (11.3): WhatsApp · Diagnóstico · Llamar. La portada usa los dos primeros. */
const actions = audienceActions("residencial", { ubicacion: aboutUbicacion, whatsapp: aboutWhatsapp });

/**
 * /nosotros (propuesta 8.6). Ritmo: portada (foto) → claro (quiénes somos)
 * → gris (estructura) → OSCURO (calidad) → claro (valores) → marca
 * (visítenos y ficha legal) → cierre oscuro «Hablemos» (CtaBand, como el
 * resto de páginas; «Siga conociendo SEDIN» va en su línea final) → pie.
 */
export default function AboutPage() {
  return (
    <SitePage>
      <InteriorHero
        crumbs={[{ label: "Nosotros" }]}
        path={routes.about}
        eyebrow={
          <span>
            {aboutHero.eyebrow}
            {/* «Desde [AÑO DE INICIO]» solo cuando SEDIN confirme el año (o en revisión). */}
            {isVisible(aboutHero.since) && (
              <>
                {" · "}
                <Pend text={aboutHero.since} />
              </>
            )}
          </span>
        }
        title={aboutHero.title}
        lead={aboutHero.lead}
        actions={<ActionGroup actions={actions.slice(0, 2)} tone="photo" size="lg" />}
        facts={<FactStrip items={aboutHero.facts} tone="photo" />}
      />

      <AboutIntro />
      <StructureChain />
      <QualitySystem />
      <ValuesBand />
      <VisitAndLegal />

      <CtaBand
        actions={actions}
        whatsappMessage={aboutWhatsapp}
        ubicacion={aboutUbicacion}
        footnote={
          <>
            Siga conociendo SEDIN:{" "}
            <ArrowLink href={knowMoreLinks.comoTrabajamos.href} className="mr-4 text-[15px]">
              {knowMoreLinks.comoTrabajamos.title}
            </ArrowLink>{" "}
            <ArrowLink href={knowMoreLinks.empresas.href} className="text-[15px]">
              {knowMoreLinks.empresas.title}
            </ArrowLink>
          </>
        }
      />
    </SitePage>
  );
}
