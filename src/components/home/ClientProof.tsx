import { CaseStudies } from "@/components/ui/CaseCard";
import { Reveal } from "@/components/ui/Reveal";
import { Accent, Section, SectionHeader } from "@/components/ui/Section";
import { Testimonials } from "@/components/ui/TestimonialCard";
import { canShowCases, casesCopy } from "@/content/cases";
import { canShowTestimonials, testimonialsCopy } from "@/content/testimonials";
import { proofCopy } from "./homeContent";

/**
 * 05 · «Clientes que confían en SEDIN» (Ajuste de la Dirección): testimonios
 * y casos de éxito reales, publicados con autorización escrita
 * (`src/content/testimonials.ts` y `cases.ts`). Nunca se inventan.
 *
 * Producción: mientras no haya ni 2 testimonios ni 1 caso autorizados, la
 * sección entera (encabezado incluido) no aparece. Revisión: se ven las
 * tarjetas pendientes con marcadores honestos.
 */
export function ClientProof() {
  const testimonials = canShowTestimonials();
  const cases = canShowCases();
  if (!testimonials && !cases) return null;

  return (
    <Section
      tone="sunken"
      space="none"
      id="clientes"
      labelledBy="clientes-titulo"
      className="py-14 sm:py-20 lg:py-28"
    >
      <Reveal as="header">
        <SectionHeader
          id="clientes-titulo"
          eyebrow={proofCopy.eyebrow}
          title={
            <>
              {proofCopy.title.text} <Accent>{proofCopy.title.highlight}</Accent>
            </>
          }
          lead={testimonials ? testimonialsCopy.lead : casesCopy.lead}
        />
      </Reveal>

      {testimonials && <Testimonials className="mt-10 lg:mt-14" />}

      {cases && (
        <div className="mt-14 flex flex-col gap-8 lg:mt-20">
          {testimonials && (
            <Reveal as="header">
              <SectionHeader as="h3" size="md" eyebrow={casesCopy.eyebrow} title={casesCopy.title} lead={casesCopy.lead} />
            </Reveal>
          )}
          <CaseStudies />
        </div>
      )}
    </Section>
  );
}
