import { Fragment } from "react";

const values = ["Seguridad", "Orden", "Disciplina", "Control", "Responsabilidad"];

/** 07 · Valores. */
export function Values() {
  return (
    <section aria-label="Valores" className="border-y border-line bg-surface">
      <div className="mx-auto flex max-w-[1344px] flex-wrap items-center justify-between gap-x-8 gap-y-4 px-4 py-10 sm:px-8">
        <span className="font-display text-[13px] leading-[18px] font-bold tracking-[0.08em] text-ink-brand uppercase">
          Nuestros valores
        </span>
        <div className="flex flex-wrap gap-x-10 gap-y-3 font-display text-2xl leading-8 font-bold tracking-[-0.01em]">
          {values.map((v, i) => (
            <Fragment key={v}>
              {i > 0 && (
                <span aria-hidden="true" className="text-ink-subtle">
                  ·
                </span>
              )}
              <span>{v}</span>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
