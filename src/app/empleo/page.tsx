import { InteriorHero } from "@/components/about/InteriorHero";
import {
  ApplySection,
  OfferSection,
  ProcessSection,
  RequirementsSection,
  RoleSection,
} from "@/components/jobs/JobSections";
import { jobsHero, jobsMeta, jobsUbicacion } from "@/components/jobs/jobsContent";
import { SitePage } from "@/components/layout/SitePage";
import { ButtonLink } from "@/components/ui/Button";
import { FactStrip } from "@/components/ui/FactStrip";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { ctaLabels, routes, waMessages } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ ...jobsMeta, path: routes.jobs });

/**
 * /empleo (propuesta 6.4 y 8.9): carril propio del aspirante. Botón
 * principal «Postular por WhatsApp» con el mensaje POSTULACIÓN (11.6),
 * requisitos básicos en la franja de la portada y completos con los
 * documentos (art. 25), qué ofrece SEDIN (arts. 14, 19, 26, 28 y 31), el
 * proceso ya publicado y el formulario corto con CV opcional. Nunca botones
 * de cotización. Sin `JobPosting`: solo con vacantes reales y fechadas.
 */
export default function JobsPage() {
  return (
    <SitePage>
      <InteriorHero
        crumbs={[{ label: "Empleo" }]}
        path={routes.jobs}
        eyebrow={jobsHero.eyebrow}
        title={jobsHero.title}
        lead={
          <>
            {jobsHero.lead} {jobsHero.apply.before}{" "}
            <a
              href="#postulacion"
              className="font-normal text-white underline decoration-white/50 underline-offset-[3px] hover:decoration-white"
            >
              {jobsHero.apply.link}
            </a>
            {jobsHero.apply.after}
          </>
        }
        actions={
          <>
            <WhatsAppLink
              message={waMessages.empleo}
              ubicacion={jobsUbicacion}
              event="postulacion-whatsapp"
              variant="primary"
              size="lg"
              block
            >
              {ctaLabels.postular}
            </WhatsAppLink>
            <ButtonLink href="#requisitos" variant="onPhoto" size="lg" block>
              {jobsHero.requirementsLabel}
            </ButtonLink>
          </>
        }
        facts={<FactStrip items={jobsHero.facts} tone="photo" label={jobsHero.factsLabel} />}
      />

      <RoleSection />
      <RequirementsSection />
      <OfferSection />
      <ProcessSection />
      <ApplySection />
    </SitePage>
  );
}
