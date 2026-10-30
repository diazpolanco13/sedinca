import Link from "next/link";
import { ArrowRightIcon, ChevronDownIcon } from "@/components/icons";
import { Pend, SourceNote } from "@/components/ui/Pending";
import { hasPending, showPending } from "@/config/site";
import { cn } from "@/lib/cn";
import { isVisible, publishedText, type Sentences } from "@/lib/pending";

export interface FaqListItem {
  id: string;
  question: string;
  answer: Sentences;
  source?: string;
  link?: { label: string; href: string };
}

/** Pregunta publicable en el modo actual (ni pregunta pendiente ni respuesta vacía). */
function shown(item: FaqListItem) {
  return (showPending || !hasPending(item.question)) && isVisible(item.answer);
}

/**
 * Preguntas frecuentes con el desplegable nativo (`<details>`): sin
 * JavaScript, accesible con teclado. Cada pregunta lleva `id` (ancla
 * /preguntas-frecuentes#<id>). En producción se omiten las frases con
 * [MARCADOR] y las preguntas que se queden sin respuesta.
 *
 * `jsonLd` añade los datos estructurados FAQPage (solo con el texto
 * publicable). Póngalo en UNA sola lista por página.
 */
export function FaqList({
  items,
  jsonLd = false,
  exclusive,
  headingLevel = "h3",
  openFirst = false,
  className,
}: {
  items: readonly FaqListItem[];
  jsonLd?: boolean;
  /** Nombre de grupo: abrir una cierra las demás (atributo `name`). */
  exclusive?: string;
  headingLevel?: "h2" | "h3" | "h4";
  openFirst?: boolean;
  className?: string;
}) {
  const visible = items.filter(shown);
  if (visible.length === 0) return null;
  const Heading = headingLevel;

  const structured = jsonLd
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: visible
          .filter((f) => !hasPending(f.question) && publishedText(f.answer))
          .map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: publishedText(f.answer) },
          })),
      }
    : null;

  return (
    <div className={cn("border-t border-line", className)}>
      {visible.map((item, i) => (
        <details
          key={item.id}
          id={item.id}
          name={exclusive}
          open={openFirst && i === 0 ? true : undefined}
          className="group scroll-mt-24 border-b border-line"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-ink transition-colors hover:text-ink-brand [&::-webkit-details-marker]:hidden">
            <Heading className="m-0 font-display text-[17px] leading-6 font-semibold sm:text-lg sm:leading-7">
              <Pend text={item.question} />
            </Heading>
            <span
              aria-hidden="true"
              className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-full border border-line text-ink-brand transition-[transform,border-color] group-open:rotate-180 group-open:border-accent motion-reduce:transition-none"
            >
              <ChevronDownIcon size={18} />
            </span>
          </summary>
          <div className="flex max-w-[720px] flex-col gap-3 pb-6">
            <Pend as="p" className="m-0 text-base leading-[26px] text-ink-muted" text={item.answer} />
            {item.link && (
              <Link
                href={item.link.href}
                prefetch={false}
                className="group/link inline-flex items-center gap-1.5 self-start font-display text-[15px] font-semibold text-ink-brand no-underline hover:underline"
              >
                {item.link.label}
                <ArrowRightIcon
                  size={16}
                  className="transition-transform group-hover/link:translate-x-0.5 motion-reduce:transition-none"
                />
              </Link>
            )}
            <SourceNote source={item.source} />
          </div>
        </details>
      ))}
      {structured && structured.mainEntity.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }}
        />
      )}
    </div>
  );
}
