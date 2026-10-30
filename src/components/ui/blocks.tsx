import type { ComponentType } from "react";
import { cn } from "@/lib/cn";

type IconType = ComponentType<{ size?: number; className?: string }>;

/**
 * Etiqueta + titular de sección. Ahora es el SectionHeader de Section.tsx
 * (misma API: `eyebrow`, `title`, `id`, `children` como entradilla; más
 * `lead`, `align`, `size`, `actions`).
 */
export { SectionHeader } from "@/components/ui/Section";

/** Banda blanca de 4 columnas con icono, título y texto (Beneficios). */
export function FeatureBand({
  label,
  items,
}: {
  label: string;
  items: { Icon: IconType; title: string; text: string }[];
}) {
  return (
    <section aria-label={label} className="border-y border-line bg-surface">
      <div className="mx-auto grid max-w-[1344px] grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-8 px-4 py-12 sm:px-8 sm:py-14">
        {items.map(({ Icon, title, text }) => (
          <div key={title} className="flex flex-col gap-2.5">
            <Icon size={32} className="text-ink-brand" />
            <div className="font-display text-lg leading-6 font-bold">{title}</div>
            <div className="text-[15px] leading-[22px] text-ink-muted">{text}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Pasos numerados con línea superior de marca («Cómo trabajamos»). */
export function StepList({
  steps,
  className,
}: {
  steps: { title: string; text: string }[];
  className?: string;
}) {
  return (
    <ol
      className={cn(
        "m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6 p-0",
        className,
      )}
    >
      {steps.map((step, i) => (
        <li key={step.title} className="flex flex-col gap-2.5 border-t-2 border-brand pt-5">
          <span
            aria-hidden="true"
            className="font-display text-[32px] leading-9 font-bold text-brand"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="font-display text-lg leading-6 font-semibold">{step.title}</span>
          <span className="text-[15px] leading-[22px] text-ink-muted">{step.text}</span>
        </li>
      ))}
    </ol>
  );
}
