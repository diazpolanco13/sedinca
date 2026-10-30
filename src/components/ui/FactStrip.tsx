import { CheckCircleIcon } from "@/components/icons";
import { Pend } from "@/components/ui/Pending";
import { cn } from "@/lib/cn";
import { filterPending } from "@/lib/pending";

const facts = {
  /** Sobre la foto de portada. */
  photo: { list: "text-white/88", icon: "text-cyan-300" },
  /** Sobre fondo claro. */
  light: { list: "text-ink-muted", icon: "text-ink-accent" },
  /** Dentro de una sección oscura (data-theme="dark"). */
  dark: { list: "text-ink-muted", icon: "text-cyan-300" },
} as const;

/**
 * Franja de hechos verificables («RIF J-40964338-7 · Oficina en… · Servicio
 * preventivo no armado…»). Etiquetas en mayúsculas con icono de
 * verificación. Los hechos con [MARCADOR] no se publican.
 */
export function FactStrip({
  items,
  tone = "light",
  label = "Datos de SEDIN",
  className,
}: {
  items: readonly { id?: string; text: string }[];
  tone?: keyof typeof facts;
  /** Nombre accesible de la lista. */
  label?: string;
  className?: string;
}) {
  const visible = filterPending(items, (f) => f.text);
  if (visible.length === 0) return null;
  const t = facts[tone];
  return (
    <ul
      aria-label={label}
      className={cn(
        "m-0 flex list-none flex-wrap items-center gap-x-6 gap-y-3 p-0 font-display text-[12px] leading-4 font-semibold tracking-[0.08em] uppercase sm:text-[13px]",
        t.list,
        className,
      )}
    >
      {visible.map((fact) => (
        <li key={fact.id ?? fact.text} className="inline-flex items-center gap-2">
          <CheckCircleIcon size={18} className={cn("flex-none", t.icon)} />
          <Pend text={fact.text} />
        </li>
      ))}
    </ul>
  );
}

/**
 * Cifras estáticas de SEDIN (nunca contadores animados). Cada cifra con
 * [MARCADOR] no se publica; si no queda ninguna, no se pinta nada (tampoco
 * la fuente).
 */
export function FigureStrip({
  items,
  source,
  className,
}: {
  items: readonly { id?: string; value: string; label: string }[];
  /** «Datos de SEDIN, [MES Y AÑO]». */
  source?: string;
  className?: string;
}) {
  const visible = filterPending(items, (f) => [f.value, f.label]);
  if (visible.length === 0) return null;
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-6">
        {visible.map((figure) => (
          <div key={figure.id ?? figure.label} className="flex flex-col gap-1 border-l-2 border-accent pl-4">
            <dt className="order-2 text-[15px] leading-[22px] text-ink-muted">
              <Pend text={figure.label} />
            </dt>
            <dd className="order-1 m-0 font-display text-[clamp(32px,4vw,48px)] leading-none font-bold tracking-[-0.02em] break-words text-ink">
              <Pend text={figure.value} />
            </dd>
          </div>
        ))}
      </dl>
      {source && <Pend as="p" className="m-0 text-xs leading-4 text-ink-subtle" text={source} />}
    </div>
  );
}
