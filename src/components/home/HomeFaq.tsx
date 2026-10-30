import Link from "next/link";
import { ArrowRightIcon, FileTextIcon } from "@/components/icons";
import { FaqList } from "@/components/ui/FaqList";
import { Reveal } from "@/components/ui/Reveal";
import { Accent, Section, SectionHeader } from "@/components/ui/Section";
import { buyerGuide } from "@/content/answers";
import { getFaqs, homeFaqIds } from "@/content/faq";
import { umami } from "@/lib/analytics";
import { faqCopy, guideCopy } from "./homeContent";

/** Enlace con flecha; 44px de área táctil sin cambiar el aspecto. Sin `display` ni tamaño: los pone cada uso. */
const arrowLinkClass =
  "group -my-3 items-center gap-1.5 self-start py-3 font-display font-semibold text-ink-brand no-underline hover:underline";

/**
 * Guía gratuita «8 preguntas antes de contratar una empresa de vigilancia»
 * (4.9), compacta: el «regalo útil» junto a las preguntas, en lugar de una
 * sección suelta que repetía preguntas. Enlaza a la guía completa de
 * /empresas#guia. Sin atacar a la competencia.
 */
function GuideLink() {
  return (
    <aside
      aria-labelledby="guia-titulo"
      className="relative flex gap-4 overflow-hidden rounded-lg border border-line-card bg-surface p-5 shadow-elevation-1 sm:p-6"
    >
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 bg-[image:var(--gradient-accent-line)]" />
      <span className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-md border border-line-cyan bg-accent-subtle text-ink-brand">
        <FileTextIcon size={22} />
      </span>
      <div className="flex min-w-0 flex-col gap-2">
        <span className="eyebrow text-ink-accent">{guideCopy.eyebrow}</span>
        <h3
          id="guia-titulo"
          className="m-0 font-display text-lg leading-6 font-bold tracking-[-0.01em] text-balance text-ink"
        >
          {buyerGuide.title}
        </h3>
        <p className="m-0 text-[15px] leading-[22px] text-ink-muted">{buyerGuide.lead}</p>
        <Link
          href={guideCopy.href}
          prefetch={false}
          {...umami("guia-8-preguntas", { ubicacion: "inicio" })}
          className={`${arrowLinkClass} mt-1 inline-flex text-[15px]`}
        >
          {guideCopy.cta}
          <ArrowRightIcon
            size={18}
            className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
          />
        </Link>
      </div>
    </aside>
  );
}

function AllQuestionsLink({ className }: { className: string }) {
  return (
    <Link href={faqCopy.link.href} prefetch={false} className={`${arrowLinkClass} text-base ${className}`}>
      {faqCopy.link.label}
      <ArrowRightIcon
        size={18}
        className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
      />
    </Link>
  );
}

/**
 * 07 · Preguntas frecuentes de Inicio (propuesta, 7.6): las 6 de
 * `homeFaqIds`, con el desplegable nativo (sin JavaScript) y los datos
 * estructurados FAQPage (única lista con `jsonLd` de la página). Las que se
 * queden sin respuesta publicable no aparecen.
 *
 * La guía «8 preguntas antes de contratar» va en la columna izquierda (en
 * móvil, tras las preguntas). Fondo con tinte de marca: tras «Quién protege»
 * (claro) y antes del cierre oscuro.
 */
export function HomeFaq() {
  return (
    <Section
      tone="brand"
      space="none"
      id="preguntas"
      labelledBy="preguntas-titulo"
      className="py-14 sm:py-20 lg:py-28"
    >
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
        {/* En móvil sus piezas se reparten (título · preguntas · guía) con `order`. */}
        <div className="max-lg:contents lg:sticky lg:top-28 lg:col-span-4 lg:flex lg:flex-col lg:gap-8 lg:self-start">
          <div className="order-1 flex flex-col gap-6">
            <Reveal as="header">
              <SectionHeader
                id="preguntas-titulo"
                eyebrow={faqCopy.eyebrow}
                size="md"
                title={
                  <>
                    {faqCopy.title.text} <Accent>{faqCopy.title.highlight}</Accent>
                  </>
                }
                lead={faqCopy.lead}
                className="max-sm:[&_p]:hidden"
              />
            </Reveal>
            <AllQuestionsLink className="hidden lg:inline-flex" />
          </div>
          <div className="order-3">
            <GuideLink />
          </div>
        </div>

        <div className="order-2 flex flex-col gap-6 lg:col-span-8">
          <FaqList items={getFaqs(homeFaqIds)} jsonLd exclusive="faq-inicio" />
          <AllQuestionsLink className="inline-flex lg:hidden" />
        </div>
      </div>
    </Section>
  );
}
