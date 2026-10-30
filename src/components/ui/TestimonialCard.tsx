import Image from "next/image";
import { QuoteIcon } from "@/components/icons";
import { Pend, PendingBlock } from "@/components/ui/Pending";
import { cn } from "@/lib/cn";
import type { SectorSlug } from "@/config/site";
import {
  MIN_TESTIMONIALS,
  publishedTestimonials,
  testimonialSlots,
  type Testimonial,
} from "@/content/testimonials";

const cardClass =
  "relative flex h-full flex-col gap-5 rounded-lg border border-line-card bg-surface p-6 shadow-elevation-1 sm:p-8";

/** Testimonio real y autorizado (cita, cargo, contexto; nombre y logo solo con permiso). */
export function TestimonialCard({ testimonial, className }: { testimonial: Testimonial; className?: string }) {
  const { quote, role, context, name, company, logo } = testimonial;
  return (
    <figure className={cn(cardClass, "m-0", className)}>
      <QuoteIcon size={32} className="text-ink-accent" />
      <blockquote className="m-0 flex-1 font-sans text-lg leading-7 text-ink">{quote}</blockquote>
      <figcaption className="flex items-center gap-4 border-t border-line pt-5">
        {logo && (
          <Image
            src={logo.src}
            alt={logo.alt}
            width={96}
            height={40}
            className="h-10 w-auto object-contain"
          />
        )}
        <span className="flex flex-col">
          <span className="font-display text-[15px] font-semibold text-ink">
            {name ? `${name}, ${role}` : role}
          </span>
          <span className="text-sm leading-5 text-ink-muted">{[company, context].filter(Boolean).join(" · ")}</span>
        </span>
      </figcaption>
    </figure>
  );
}

/** Hueco de testimonio para el modo revisión (solo marcadores). */
export function TestimonialSlotCard({
  slot,
  className,
}: {
  slot: { role: string; context: string; quote: string };
  className?: string;
}) {
  return (
    <div className={cn(cardClass, "border-dashed", className)}>
      <QuoteIcon size={32} className="text-ink-subtle" />
      <Pend as="p" className="m-0 flex-1 text-lg leading-7 text-ink-muted" text={slot.quote} />
      <div className="flex flex-col border-t border-line pt-5">
        <Pend as="span" className="font-display text-[15px] font-semibold text-ink" text={slot.role} />
        <Pend as="span" className="text-sm leading-5 text-ink-muted" text={slot.context} />
      </div>
    </div>
  );
}

/**
 * Rejilla de testimonios con su lógica: con suficientes testimonios
 * autorizados los muestra; si no, en revisión enseña los huecos pendientes y
 * en producción no pinta nada. Para ocultar también el encabezado de la
 * sección, use `canShowTestimonials()` de src/content/testimonials.ts.
 */
export function Testimonials({ sector, className }: { sector?: SectorSlug; className?: string }) {
  const items = publishedTestimonials(sector);
  const min = sector ? 1 : MIN_TESTIMONIALS;
  const grid = "grid gap-6 md:grid-cols-2 lg:grid-cols-3";
  if (items.length >= min) {
    return (
      <div className={cn(grid, className)}>
        {items.map((t) => (
          <TestimonialCard key={t.id} testimonial={t} />
        ))}
      </div>
    );
  }
  return (
    <PendingBlock
      label="Testimonios"
      needs="Se publican en cuanto haya 2 o 3 testimonios con autorización escrita del cliente (cargo y sector; nombre, empresa y logo solo si lo autoriza)."
      className={className}
    >
      <div className={grid}>
        {testimonialSlots.map((slot, i) => (
          <TestimonialSlotCard key={i} slot={slot} />
        ))}
      </div>
    </PendingBlock>
  );
}
