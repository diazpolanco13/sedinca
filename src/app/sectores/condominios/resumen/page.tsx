import type { Metadata } from "next";
import { SitePage } from "@/components/layout/SitePage";
import { HeroActions, HeroLead } from "@/components/sector/HeroActions";
import { JuntaShareLink } from "@/components/sector/JuntaShare";
import { PrintButton } from "@/components/sector/PrintButton";
import { ResumenAsamblea } from "@/components/sector/ResumenAsamblea";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHero } from "@/components/ui/PageHero";
import { absoluteUrl, routes, sectorHref, waMessages } from "@/config/site";

export const metadata: Metadata = {
  title: "Resumen para la asamblea de condominio",
  description:
    "Reemplazos, supervisión, libro de novedades, vigilancia no armada, personal, responsabilidad y precio, en una página para imprimir o enviar a la junta.",
  alternates: { canonical: absoluteUrl(routes.resumen) },
};

/**
 * Resumen imprimible para la asamblea de condominio (propuesta 8.8). Al
 * imprimir solo sale la hoja (ver src/components/sector/resumen-print.css).
 */
export default function ResumenAsambleaPage() {
  return (
    <SitePage>
      <PageHero
        crumbs={[
          { label: "Sectores", href: routes.sectors },
          { label: "Condominios", href: sectorHref("condominios") },
          { label: "Resumen para la asamblea" },
        ]}
        eyebrow="Para la junta de condominio"
        title={{ text: "Resumen para la", highlight: "asamblea" }}
        lead={
          <HeroLead text="Las respuestas a lo que preguntarán los propietarios antes de contratar la vigilancia del conjunto, en una sola página para imprimir o enviar a la junta.">
            <HeroActions>
              <JuntaShareLink ubicacion="resumen" size="lg" block />
              <PrintButton variant="onPhoto" size="lg" block />
            </HeroActions>
          </HeroLead>
        }
        primary={null}
      />

      <ResumenAsamblea />

      <CtaBand
        audience="residencial"
        sector="condominios"
        whatsappMessage={waMessages.sector.condominios}
        ubicacion="resumen"
        lead="Un asesor le responde por WhatsApp y coordina con la junta la inspección del conjunto. Sin compromiso."
      />
    </SitePage>
  );
}
