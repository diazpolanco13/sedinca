import Image from "next/image";
import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";
import { GlassCard } from "@/components/ui/GlassCard";
import { sectorHref, sectorNav } from "@/config/site";
import { sectorsContent } from "@/content/sectors";
import { sectorThumb } from "./sectorView";

/**
 * Selector de sectores de la portada de /sectores (módulo de vidrio, 8.10):
 * los 4 sectores como enlaces directos, con miniatura (recorte del menú,
 * 160×124), nombre (el mismo del menú, la ruta y las tarjetas) y una línea.
 * Solo desde 1024px: en móvil, las tarjetas con foto de la sección siguiente
 * hacen de selector. Las fotos son de IA: solo ambientación.
 */
export function SectorPicker() {
  return (
    <aside aria-labelledby="selector-sectores-titulo">
      <GlassCard tone="dark" level={2} accent className="p-2.5 sm:p-4">
        <h2 id="selector-sectores-titulo" className="eyebrow m-0 px-2.5 pt-2.5 pb-2 text-cyan-200 sm:px-3 sm:pt-3">
          Elija su instalación
        </h2>
        <ul className="m-0 grid list-none p-0">
          {sectorsContent.map((sector) => (
            <li key={sector.id} className="border-t border-line first:border-t-0">
              <Link
                href={sectorHref(sector.id)}
                prefetch={false}
                className="group flex items-center gap-3.5 rounded-md px-2.5 py-2.5 text-ink no-underline transition-colors hover:bg-white/5 hover:text-ink sm:gap-4 sm:px-3 sm:py-3"
              >
                <Image
                  src={sectorThumb(sector.id)}
                  alt=""
                  width={160}
                  height={124}
                  priority
                  className="h-12 w-[62px] flex-none rounded-md object-cover ring-1 ring-white/10 sm:h-[54px] sm:w-[70px]"
                />
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="font-display text-base leading-6 font-semibold sm:text-[17px]">
                    {sectorNav[sector.id].label}
                  </span>
                  <span className="hidden text-sm leading-5 text-ink-muted sm:block">
                    {sectorNav[sector.id].description}
                  </span>
                </span>
                <ChevronRightIcon
                  size={20}
                  className="ml-auto flex-none text-cyan-300 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                />
              </Link>
            </li>
          ))}
        </ul>
      </GlassCard>
    </aside>
  );
}
