"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { ExternalLinkIcon, MapPinIcon } from "@/components/icons";
import { buttonClass } from "@/components/ui/links";
import { site } from "@/config/site";
import { umami } from "@/lib/analytics";

const subscribe = () => () => {};

/**
 * Oficina en un mapa «fachada» (propuesta 0.9 y 15.4): un esquema estático
 * de la esquina (Calle 82 con Avenida 14, sin terceros ni peso) con
 * «Cómo llegar» a la búsqueda por dirección en Google Maps. El mapa de Google
 * (unos 440 KB) solo se carga si el visitante pulsa «Ver el mapa aquí», que
 * existe solo con JavaScript. El botón no desaparece al cargarlo: pasa a
 * «Ocultar el mapa», así el foco del teclado no se pierde.
 */
export function OfficeMap({ ubicacion = "contacto" }: { ubicacion?: string }) {
  const [open, setOpen] = useState(false);
  const mapId = useId();
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const embed = `https://maps.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&z=17&hl=es&output=embed`;

  return (
    <figure className="m-0 overflow-hidden rounded-xl border border-line-card bg-surface shadow-elevation-1">
      <div id={mapId} className="relative h-[260px] sm:h-[300px]">
        {open ? (
          <iframe
            src={embed}
            title={`Mapa de Google: ${site.address}, ${site.city}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 block h-full w-full border-0"
          />
        ) : (
          <StreetSketch />
        )}
      </div>
      <figcaption className="flex flex-wrap items-center justify-between gap-4 border-t border-line p-5">
        <div className="flex min-w-0 items-start gap-3">
          <MapPinIcon size={22} className="mt-0.5 flex-none text-ink-brand" />
          <div className="text-[15px] leading-[22px]">
            <div className="font-medium text-ink">{site.address}</div>
            <div className="text-ink-muted">{site.city}</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {hydrated && (
            <button
              type="button"
              aria-expanded={open}
              aria-controls={mapId}
              onClick={() => setOpen((o) => !o)}
              className={buttonClass({ variant: "ghost", size: "sm" })}
            >
              {open ? "Ocultar el mapa" : "Ver el mapa aquí"}
            </button>
          )}
          <a
            href={site.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            {...umami("como-llegar", { ubicacion })}
            className={buttonClass({ variant: "secondary", size: "sm" })}
          >
            Cómo llegar
            <ExternalLinkIcon size={16} />
            <span className="sr-only"> (abre Google Maps)</span>
          </a>
        </div>
      </figcaption>
    </figure>
  );
}

/**
 * Esquema de la esquina, no a escala: en Maracaibo las calles van de este a
 * oeste y las avenidas de norte a sur. Decorativo (la dirección va en texto).
 */
function StreetSketch() {
  return (
    <div aria-hidden="true" className="dot-grid-brand absolute inset-0 overflow-hidden bg-surface-brand">
      <svg viewBox="0 0 640 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        {/* Manzanas y calles secundarias */}
        <g className="fill-surface stroke-line" strokeWidth="1">
          <rect x="-10" y="58" width="660" height="14" />
          <rect x="-10" y="232" width="660" height="14" />
          <rect x="120" y="-10" width="14" height="320" />
          <rect x="506" y="-10" width="14" height="320" />
        </g>
        {/* Calle 82 (este-oeste) y Avenida 14 (norte-sur) */}
        <g className="fill-surface stroke-line-strong" strokeWidth="1.5">
          <rect x="-10" y="134" width="660" height="34" />
          <rect x="300" y="-10" width="34" height="320" />
        </g>
        <rect x="300" y="134" width="34" height="34" className="fill-surface" />
        <g className="fill-ink-muted font-display" fontSize="12" fontWeight="600" letterSpacing="1.2">
          <text x="150" y="156">CALLE 82</text>
          <text x="0" y="0" transform="translate(323 116) rotate(-90)">
            AVENIDA 14
          </text>
        </g>
        {/* Oficina */}
        <circle cx="356" cy="122" r="26" className="fill-accent" opacity="0.14" />
        <g transform="translate(340 86)">
          <path
            d="M16 0C7.2 0 0 7 0 15.7 0 27.5 16 40 16 40s16-12.5 16-24.3C32 7 24.8 0 16 0Z"
            className="fill-brand"
          />
          <circle cx="16" cy="15.5" r="6" className="fill-on-brand" />
        </g>
      </svg>
      <span className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 font-display text-[12px] font-semibold tracking-[0.04em] text-ink shadow-elevation-1">
        <span className="h-2 w-2 rounded-full bg-brand" />
        {site.name} · Maracaibo
      </span>
    </div>
  );
}
