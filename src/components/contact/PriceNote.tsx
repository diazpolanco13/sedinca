import { CheckIcon, ChevronDownIcon } from "@/components/icons";
import { Pend } from "@/components/ui/Pending";
import { precio } from "@/content/answers";

/**
 * Bloque «¿De qué depende el precio?» (propuesta 4.7) para el resultado del
 * diagnóstico, plegado (`<details>`) para no alejar el envío por WhatsApp.
 * Componente de servidor: se pasa ya pintado al diagnóstico (cliente), así
 * las frases con [MARCADORES] no viajan al navegador en producción. Sin
 * precios ni dotaciones.
 */
export function PriceNote() {
  return (
    <details className="group/price rounded-lg border border-line bg-surface-sunken">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-lg px-5 py-4 transition-colors hover:text-ink-brand sm:px-6 [&::-webkit-details-marker]:hidden">
        <span className="flex flex-col gap-1">
          <span className="eyebrow text-ink-brand">{precio.eyebrow}</span>
          <span className="font-display text-lg leading-6 font-bold text-ink">{precio.title}</span>
        </span>
        <span
          aria-hidden="true"
          className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-full border border-line text-ink-brand transition-[transform,border-color] group-open/price:rotate-180 group-open/price:border-accent motion-reduce:transition-none"
        >
          <ChevronDownIcon size={18} />
        </span>
      </summary>
      <div className="px-5 pb-5 sm:px-6 sm:pb-6">
        <Pend as="p" text={precio.body} className="m-0 text-[15px] leading-[22px] text-ink-muted" />
        <ul className="mt-4 mb-0 grid list-none gap-2 p-0 text-[15px] leading-[22px] text-ink sm:grid-cols-2 sm:gap-x-6">
          {precio.list.items.map((item) => (
            <li key={item} className="flex gap-2">
              <CheckIcon size={18} className="mt-0.5 flex-none text-ink-brand" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
