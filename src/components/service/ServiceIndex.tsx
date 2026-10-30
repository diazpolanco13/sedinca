import Image from "next/image";
import Link from "next/link";
import { AlertIcon, ArrowRightIcon, CheckIcon, ChevronRightIcon } from "@/components/icons";
import { sectorPhoto } from "@/components/sector/sectorView";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";
import { serviceHref, serviceNav, type SectorSlug } from "@/config/site";
import { getSector } from "@/content/sectors";
import { getService, serviceConcerns, servicesContent, type ServiceSlug } from "@/content/services";

/**
 * Selector de servicios de la portada de /servicios (módulo de vidrio, 8.10):
 * los 4 servicios con su línea de apoyo, enlazados. Solo desde 1024px (en
 * móvil, `ServiceQuickLinks`).
 */
export function ServicePicker() {
  return (
    <aside aria-labelledby="selector-titulo">
      <GlassCard tone="dark" level={2} accent className="p-3 sm:p-4">
        <h2 id="selector-titulo" className="eyebrow m-0 px-3 pt-3 pb-2 text-cyan-200">
          Elija un servicio
        </h2>
        <ul className="m-0 grid list-none p-0">
          {servicesContent.map((s) => {
            const Icon = s.Icon;
            return (
              <li key={s.slug} className="border-t border-line first:border-t-0">
                <Link
                  href={serviceHref(s.slug)}
                  prefetch={false}
                  className="group flex items-center gap-4 rounded-md px-3 py-3.5 text-ink no-underline transition-colors hover:bg-white/5 hover:text-ink"
                >
                  <span className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-md border border-line-cyan bg-accent-subtle text-cyan-300">
                    <Icon size={24} />
                  </span>
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="font-display text-[17px] leading-6 font-semibold">{s.name}</span>
                    <span className="text-sm leading-5 text-ink-muted">{serviceNav[s.slug].description}</span>
                  </span>
                  <ChevronRightIcon
                    size={20}
                    className="ml-auto flex-none text-cyan-300 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </GlassCard>
    </aside>
  );
}

/**
 * Los 4 servicios como enlaces compactos en la portada por debajo de 1024px
 * (allí no se ve el selector de vidrio): 2×2, icono y nombre.
 */
export function ServiceQuickLinks() {
  return (
    <nav aria-label="Elija un servicio" className="lg:hidden">
      <ul className="m-0 grid list-none grid-cols-2 gap-2.5 p-0 sm:gap-3">
        {servicesContent.map((s) => {
          const Icon = s.Icon;
          return (
            <li key={s.slug} className="flex">
              <Link
                href={serviceHref(s.slug)}
                prefetch={false}
                className="flex min-h-12 w-full items-center gap-2.5 rounded-md border border-white/20 bg-azure-950/45 px-3 py-2 font-display text-sm leading-5 font-semibold text-white no-underline backdrop-blur-glass-1 hover:border-cyan-300 hover:text-white"
              >
                <Icon size={20} className="flex-none text-cyan-200" />
                {s.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/**
 * «Lo que le preocupa, resuelto» (8.1): 6 tarjetas pulsables, del problema
 * del cliente al servicio que lo resuelve. Se presentan como problema y
 * solución (sin comillas: no son citas de clientes, y no deben confundirse
 * con los testimonios reales cuando existan). Por debajo de 768px, versión
 * compacta: problema y servicio, sin el bloque intermedio.
 */
export function ConcernGrid() {
  return (
    <ul className="m-0 grid list-none gap-3 p-0 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
      {serviceConcerns.map((concern) => {
        const service = getService(concern.service);
        if (!service) return null;
        const Icon = service.Icon;
        return (
          <Reveal as="li" key={concern.worry} className="flex">
            <Link
              href={serviceHref(service.slug)}
              prefetch={false}
              className="card-interactive group flex w-full flex-col gap-3 rounded-lg border border-line-card bg-surface p-5 text-ink no-underline shadow-elevation-1 hover:text-ink md:gap-5 md:p-7"
            >
              <span className="eyebrow inline-flex items-center gap-2 text-ink-muted">
                <AlertIcon size={16} className="flex-none text-ink-accent" />
                Problema
              </span>
              <h3 className="m-0 font-display text-xl leading-7 font-bold tracking-[-0.01em] text-balance md:text-[22px]">
                {concern.worry}
              </h3>
              <div className="hidden flex-col gap-2 border-t border-line pt-4 md:flex">
                <span className="eyebrow text-ink-accent">Lo resolvemos con</span>
                <p className="m-0 text-[15px] leading-[22px] text-ink-muted">{concern.solution}</p>
              </div>
              <span className="mt-auto inline-flex items-center gap-2 pt-1 font-display text-[15px] font-semibold text-ink-brand">
                <Icon size={20} className="flex-none" />
                <span>
                  <span className="md:sr-only">Lo resolvemos con </span>
                  {service.name}
                </span>
                <ArrowRightIcon
                  size={16}
                  className="flex-none transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                />
              </span>
            </Link>
          </Reveal>
        );
      })}
    </ul>
  );
}

/**
 * Foto de ambientación de cada servicio (fotos de IA de los sectores, nunca
 * «nuestro equipo»). Siempre en recorte vertical con `sectorPhoto()`, centrado
 * en el oficial.
 */
const servicePhoto: Record<ServiceSlug, SectorSlug> = {
  "vigilancia-privada": "condominios",
  "control-de-acceso": "comercio-y-oficinas",
  "sistemas-electronicos": "industria-y-logistica",
  "gestion-de-riesgos": "petroleo-y-energia",
};

/**
 * Los 4 servicios en tarjetas de vidrio con foto (para una sección oscura):
 * foto vertical a la izquierda, modalidades, título, resumen, lo que incluye
 * (desde 640px) y enlace.
 */
export function ServiceCatalogGrid() {
  return (
    <ul className="m-0 grid list-none gap-4 p-0 sm:gap-6 lg:grid-cols-2">
      {servicesContent.map((s) => {
        const Icon = s.Icon;
        const sector = getSector(servicePhoto[s.slug]);
        const photo = sector ? sectorPhoto(sector) : undefined;
        return (
          <Reveal as="li" key={s.slug} className="flex">
            <Link
              href={serviceHref(s.slug)}
              prefetch={false}
              className="card-interactive group relative grid w-full grid-cols-[112px_minmax(0,1fr)] overflow-hidden rounded-xl border border-line-card bg-glass-1 text-ink no-underline shadow-elevation-1 backdrop-blur-glass-1 hover:text-ink sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 z-10 h-0.5 bg-[image:var(--gradient-accent-line)]"
              />
              <span className="relative isolate block min-h-[176px] overflow-hidden bg-azure-950">
                {photo && (
                  <Image
                    src={photo.src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 250px, (min-width: 640px) 40vw, 112px"
                    className={`-z-10 object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${photo.position ?? ""}`}
                  />
                )}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 bg-linear-to-t from-azure-950/80 via-azure-950/10 to-azure-950/0"
                />
                <span className="absolute bottom-3 left-3 inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/15 bg-azure-950/60 text-cyan-200 sm:bottom-5 sm:left-5 sm:h-12 sm:w-12">
                  <Icon size={24} />
                </span>
              </span>
              <span className="flex min-w-0 flex-col gap-2.5 p-4 sm:gap-4 sm:p-7">
                <span className="eyebrow hidden text-cyan-200 sm:block">{s.ficha.modes.join(" · ")}</span>
                <h3 className="m-0 font-display text-lg leading-6 font-bold tracking-[-0.01em] sm:text-2xl sm:leading-8">
                  {s.title}
                </h3>
                <span className="text-[15px] leading-[22px] text-ink-muted sm:text-base sm:leading-[26px]">
                  {s.summary}
                </span>
                <span className="hidden flex-col gap-2 sm:flex">
                  {s.ficha.includes.slice(0, 2).map((item) => (
                    <span key={item} className="flex gap-2.5 text-[15px] leading-[22px] text-ink">
                      <CheckIcon size={18} className="mt-0.5 flex-none text-cyan-300" />
                      {item}
                    </span>
                  ))}
                </span>
                <span className="mt-auto inline-flex items-center gap-2 pt-1 font-display text-[15px] font-semibold text-cyan-200">
                  Ver el servicio
                  <ArrowRightIcon
                    size={16}
                    className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                  />
                </span>
              </span>
            </Link>
          </Reveal>
        );
      })}
    </ul>
  );
}
