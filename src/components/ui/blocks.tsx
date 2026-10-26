import type { ComponentType, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow, SectionTitle } from "@/components/ui/SectionHeading";

type IconType = ComponentType<{ size?: number; className?: string }>;

/** Etiqueta + titular de sección (máx. 640px), como en los diseños. */
export function SectionHeader({
  eyebrow,
  title,
  id,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  /** id del titular, para `aria-labelledby` de la sección. */
  id?: string;
  /** Entradilla opcional bajo el titular. */
  children?: ReactNode;
}) {
  return (
    <div className="flex max-w-[640px] flex-col gap-3">
      <Eyebrow>{eyebrow}</Eyebrow>
      <SectionTitle>
        <span id={id}>{title}</span>
      </SectionTitle>
      {children && <p className="m-0 text-[17px] leading-[26px] text-ink-muted">{children}</p>}
    </div>
  );
}

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
