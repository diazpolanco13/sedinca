import { Pend, SourceNote } from "@/components/ui/Pending";
import { hasPending, showPending } from "@/config/site";
import { cn } from "@/lib/cn";
import { isVisible, type Sentences } from "@/lib/pending";

export interface TimelineItem {
  id?: string;
  title: string;
  text?: Sentences;
  /** Fuente interna (art. del reglamento): solo en modo revisión. */
  source?: string;
  /** «Usted recibe: …». */
  receives?: Sentences;
  /** Plazo; con [MARCADOR] solo se ve en revisión. */
  plazo?: string;
}

/**
 * Línea de tiempo por etapas, sin horas. La línea se rellena en cian al
 * desplazar (solo CSS, `.timeline` de globals.css); sin soporte o con
 * «reducir movimiento» se ve rellena y quieta.
 *
 * - `variant="vertical"` (por defecto): siempre vertical.
 * - `variant="steps"`: horizontal desde 1024px, vertical en móvil (para 4-5
 *   pasos cortos como «De la inspección al primer turno»).
 *
 * Acepta directamente `reportTimeline.stages` y `onboarding.stages`
 * (src/content/process.ts). En producción se omiten las frases con
 * [MARCADOR] y las etapas que se queden sin texto ni título publicable.
 */
export function Timeline({
  items,
  variant = "vertical",
  label,
  numbered = true,
  headingLevel = "h3",
  className,
}: {
  items: readonly TimelineItem[];
  variant?: "vertical" | "steps";
  /** Nombre accesible de la lista. */
  label?: string;
  numbered?: boolean;
  /** Nivel del título de cada etapa (h3 bajo un h2 de sección). */
  headingLevel?: "h3" | "h4";
  className?: string;
}) {
  const Heading = headingLevel;
  const visible = items.filter((item) => showPending || !hasPending(item.title));
  return (
    <ol aria-label={label} className={cn("timeline", variant === "steps" && "timeline--h", className)}>
      {visible.map((item, i) => (
        <li key={item.id ?? item.title} className="timeline-item">
          <span aria-hidden="true" className="timeline-dot">
            {numbered ? String(i + 1).padStart(2, "0") : null}
          </span>
          <div className="flex flex-col gap-2">
            <Heading className="m-0 font-display text-lg leading-6 font-semibold text-ink sm:text-xl sm:leading-7">
              <Pend text={item.title} />
            </Heading>
            {item.text && (
              <Pend as="p" className="m-0 text-[15px] leading-6 text-ink-muted sm:text-base" text={item.text} />
            )}
            {item.receives && isVisible(item.receives) && (
              <p className="m-0 text-[15px] leading-6 text-ink">
                <span className="font-semibold text-ink-brand">Usted recibe: </span>
                <Pend text={item.receives} />
              </p>
            )}
            {item.plazo && isVisible(item.plazo) && (
              <p className="m-0 font-display text-xs leading-4 font-semibold tracking-[0.06em] text-ink-muted uppercase">
                Plazo: <Pend text={item.plazo} />
              </p>
            )}
            <SourceNote source={item.source} />
          </div>
        </li>
      ))}
    </ol>
  );
}
