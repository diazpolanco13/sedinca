import Image from "next/image";
import { Pend, PendingBlock } from "@/components/ui/Pending";
import { cn } from "@/lib/cn";
import { sectorNav, type SectorSlug } from "@/config/site";
import { caseSlots, publishedCases, type CaseStudy } from "@/content/cases";

const steps = [
  { key: "challenge", label: "Reto" },
  { key: "solution", label: "Solución" },
  { key: "result", label: "Resultado" },
] as const;

const cardClass =
  "relative flex h-full flex-col overflow-hidden rounded-lg border border-line-card bg-surface shadow-elevation-1";

function Steps({ data }: { data: { challenge: string; solution: string; result: string } }) {
  return (
    <ol className="m-0 flex list-none flex-col gap-4 p-0">
      {steps.map((step, i) => (
        <li key={step.key} className="flex gap-4">
          <span
            aria-hidden="true"
            className={cn(
              "mt-0.5 h-2.5 w-2.5 flex-none rounded-full",
              i === steps.length - 1 ? "bg-accent shadow-glow-cyan" : "bg-line-strong",
            )}
          />
          <span className="flex flex-col gap-1">
            <span className="eyebrow text-ink-brand">{step.label}</span>
            <Pend as="span" className="text-[15px] leading-[22px] text-ink-muted" text={data[step.key]} />
          </span>
        </li>
      ))}
    </ol>
  );
}

/** Caso de éxito real «Reto → Solución → Resultado», con foto real opcional. */
export function CaseCard({ item, className }: { item: CaseStudy; className?: string }) {
  return (
    <article className={cn(cardClass, className)}>
      {item.photo && (
        <div className="relative aspect-[16/9]">
          <Image
            src={item.photo.src}
            alt={item.photo.alt}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-5 p-6 sm:p-8">
        <span className="eyebrow text-ink-muted">
          {sectorNav[item.sector].label} · {item.clientLabel}
        </span>
        <h3 className="m-0 font-display text-xl leading-7 font-bold tracking-[-0.01em] text-ink">{item.title}</h3>
        <Steps data={item} />
      </div>
    </article>
  );
}

/** Hueco de caso para el modo revisión (solo marcadores). */
export function CaseSlotCard({ slot, className }: { slot: (typeof caseSlots)[number]; className?: string }) {
  return (
    <div className={cn(cardClass, "border-dashed", className)}>
      <div className="flex flex-1 flex-col gap-5 p-6 sm:p-8">
        <Pend as="span" className="eyebrow text-ink-muted" text={slot.clientLabel} />
        <Steps data={slot} />
      </div>
    </div>
  );
}

/**
 * Rejilla de casos con su lógica: con casos autorizados los muestra; si no,
 * en revisión enseña los huecos y en producción no pinta nada. Para ocultar
 * el encabezado, use `canShowCases()` de src/content/cases.ts.
 */
export function CaseStudies({ sector, className }: { sector?: SectorSlug; className?: string }) {
  const items = publishedCases(sector);
  const grid = "grid gap-6 md:grid-cols-2 lg:grid-cols-3";
  if (items.length > 0) {
    return (
      <div className={cn(grid, className)}>
        {items.map((c) => (
          <CaseCard key={c.id} item={c} />
        ))}
      </div>
    );
  }
  return (
    <PendingBlock
      label="Casos de éxito"
      needs="Se publican con lo que cuente cada cliente y su autorización escrita; anonimizados si lo pide. Sin cifras que el cliente no confirme."
      className={className}
    >
      <div className={grid}>
        {caseSlots.map((slot, i) => (
          <CaseSlotCard key={i} slot={slot} />
        ))}
      </div>
    </PendingBlock>
  );
}
