import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRightIcon, CheckIcon, ChevronDownIcon } from "@/components/icons";
import { Pend, SourceNote } from "@/components/ui/Pending";
import { hasPending, showPending } from "@/config/site";
import { quienResponde, type Answer } from "@/content/answers";
import { cn } from "@/lib/cn";
import { isVisible } from "@/lib/pending";

/**
 * «¿Quién responde…?» solo cuando se publica la póliza (o en revisión), como
 * en Inicio y /preguntas-frecuentes (faq.ts): sin ella, la respuesta visible
 * solo explica la investigación de Asuntos Internos, y «quién responde» se lee
 * como «quién paga».
 */
const polizaShown = showPending || !hasPending(quienResponde.points[0].text[0]);
export const hurtoQuestion = polizaShown
  ? "¿Quién responde si hay un hurto o una queja?"
  : "¿Qué pasa si hay un hurto o una queja?";

/** Titular de respaldo cuando la frase principal de la respuesta está pendiente. */
const fallbackHeading: Partial<Record<string, string>> = {
  "quien-responde": hurtoQuestion,
};

/** ¿Queda algo publicable de la respuesta en el modo actual? */
export function answerHasContent(answer: Answer) {
  return isVisible(answer.body) || (answer.points ?? []).some((p) => isVisible(p.text));
}

/**
 * Titular de la respuesta: su título si la frase principal se publica; si
 * no (p. ej. «Usted contrata un servicio, no personal» mientras la nómina no
 * esté confirmada), un titular que solo promete lo que sí se responde.
 */
export function answerHeading(answer: Answer) {
  if (isVisible(answer.body)) return answer.title;
  return fallbackHeading[answer.id] ?? answer.question;
}

/**
 * Respuesta de la sección 4 como tarjeta: antetítulo, titular, frases
 * publicables, lista (el temario, plegado en «Ver el temario»; viñetas para
 * el resto), puntos, fuente (solo en revisión) y enlace. No pinta nada si no
 * queda contenido publicable.
 */
export function AnswerCard({
  answer,
  headingLevel = "h3",
  className,
  children,
}: {
  answer: Answer;
  headingLevel?: "h3" | "h4";
  className?: string;
  /** Acción extra al pie (p. ej. «Solicitar kit por correo»). */
  children?: ReactNode;
}) {
  if (!answerHasContent(answer)) return null;
  const Heading = headingLevel;
  const points = (answer.points ?? []).filter((p) => isVisible(p.text));
  const chips = answer.id === "quien-protege";

  return (
    <article
      className={cn(
        "flex h-full flex-col gap-4 rounded-lg border border-line-card bg-surface p-6 shadow-elevation-1 sm:p-8",
        className,
      )}
    >
      <span className="eyebrow text-ink-brand">{answer.eyebrow}</span>
      <Heading className="m-0 font-display text-xl leading-7 font-bold tracking-[-0.01em] text-ink sm:text-2xl sm:leading-8">
        {answerHeading(answer)}
      </Heading>
      <Pend as="p" className="m-0 text-[15px] leading-6 text-ink-muted sm:text-base sm:leading-[26px]" text={answer.body} />

      {answer.list &&
        (chips ? (
          /* El temario (10 módulos) fijaba el alto de toda la fila: plegado. */
          <details className="group/temario border-t border-line pt-3">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-1 font-display text-[15px] leading-6 font-semibold text-ink-brand [&::-webkit-details-marker]:hidden">
              Ver el temario del curso ({answer.list.items.length} módulos)
              <ChevronDownIcon
                size={18}
                className="flex-none transition-transform group-open/temario:rotate-180 motion-reduce:transition-none"
              />
            </summary>
            <ul className="m-0 mt-3 flex list-none flex-wrap gap-2 p-0">
              {answer.list.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-line bg-surface-sunken px-3 py-1 text-[13px] leading-5 text-ink-muted"
                >
                  {item}
                </li>
              ))}
            </ul>
          </details>
        ) : (
          <div className="flex flex-col gap-3">
            <span className="field-label">{answer.list.title}</span>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              {answer.list.items.map((item) => (
                <li key={item} className="flex gap-3 text-[15px] leading-[22px] text-ink">
                  <CheckIcon size={18} className="mt-0.5 flex-none text-ink-accent" />
                  <span>
                    <Pend text={item} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}

      {points.length > 0 && (
        <dl className="m-0 flex flex-col gap-4 border-t border-line pt-4">
          {points.map((point) => (
            <div key={point.title} className="flex flex-col gap-1">
              <dt className="font-display text-[15px] leading-[22px] font-semibold text-ink">{point.title}</dt>
              <dd className="m-0 flex flex-col gap-1">
                <Pend as="span" className="text-[15px] leading-[22px] text-ink-muted" text={point.text} />
                <SourceNote source={point.source} />
              </dd>
            </div>
          ))}
        </dl>
      )}

      <SourceNote source={answer.source} />

      {(answer.link || children) && (
        <div className="mt-auto flex flex-col items-start gap-3 pt-2">
          {children}
          {answer.link && (
            <Link
              href={answer.link.href}
              prefetch={false}
              className="group inline-flex items-center gap-1.5 font-display text-[15px] font-semibold text-ink-brand no-underline hover:underline"
            >
              {answer.link.label}
              <ArrowRightIcon
                size={16}
                className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
              />
            </Link>
          )}
        </div>
      )}
    </article>
  );
}
