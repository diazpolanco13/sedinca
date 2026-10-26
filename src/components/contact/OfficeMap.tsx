import { PinIcon } from "@/components/icons";
import { site } from "@/config/site";

/** Mapa de la oficina (Google Maps incrustado) con enlace «Cómo llegar». */
export function OfficeMap() {
  const embed = `https://maps.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&z=17&hl=es&output=embed`;
  return (
    <div className="overflow-hidden rounded-lg border border-line-card bg-surface">
      <iframe
        src={embed}
        title={`Mapa: ${site.address}, ${site.city}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="block h-[240px] w-full border-0"
      />
      <div className="flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="flex min-w-0 items-start gap-3">
          <PinIcon size={22} className="mt-0.5 flex-none text-ink-brand" />
          <div className="text-[15px] leading-[22px]">
            <div className="font-medium">{site.address}</div>
            <div className="text-ink-muted">{site.city}</div>
          </div>
        </div>
        <a
          href={site.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center rounded-(--radius) border-[1.5px] border-line bg-surface px-4 font-display text-[13px] font-semibold tracking-[0.04em] text-ink no-underline transition-colors hover:border-brand hover:bg-surface-brand hover:text-ink"
        >
          Cómo llegar <span aria-hidden="true">&nbsp;→</span>
        </a>
      </div>
    </div>
  );
}
