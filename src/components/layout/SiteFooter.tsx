import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRightIcon, ArrowUpRightIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { CallLink, WhatsAppLink } from "@/components/ui/WhatsAppLink";
import {
  ctaLabels,
  footerNav,
  legalNav,
  phoneHref,
  routes,
  site,
  waMessages,
  whatsappHref,
} from "@/config/site";
import { umami } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { logoDark, shield } from "./navVisuals";

/**
 * Enlaces legales (Aviso legal · Privacidad) en la línea inferior. Se activan
 * cuando existan /aviso-legal/ y /privacidad/; mientras, solo «Empleo».
 */
const SHOW_LEGAL_LINKS = false;

const UBICACION = "pie";

// Objetivos táctiles de 44px en móvil (15.6); compactos desde 1024px.
// `cn` no fusiona clases: el color va aparte.
const linkBase =
  "inline-flex min-h-11 items-center text-[15px] leading-5 no-underline transition-colors hover:text-ink lg:min-h-0 lg:py-1.5";
const linkClass = `${linkBase} text-ink-muted`;
const headingClass = "eyebrow m-0 text-ink-accent";

/**
 * Pie del sitio (propuesta, 5.3): oscuro, con trama de puntos, luz cian y el
 * escudo como marca de agua. Cuatro columnas (Por instalación · Servicios ·
 * Conozca SEDIN · Contacto 24/7) y línea inferior con razón social, RIF y
 * Empleo. Suele ir tras el cierre oscuro (CtaBand): lo separa una línea y un
 * fondo un punto más profundo.
 *
 * Móvil (<640px), para que no ocupe dos pantallas: los enlaces van en dos
 * columnas (Por instalación junto a Servicios; Conozca SEDIN en dos
 * columnas), con filas de 44px para el toque; el contacto se reduce a
 * «Llamar · WhatsApp» en una fila y la dirección con «Cómo llegar»; el
 * párrafo de razón social se omite (está en la línea legal).
 *
 * El correo no va en el pie: está en /contacto y /empresas, donde se explica
 * su uso (hasta tener el correo corporativo, propuesta 15.7).
 *
 * `#pie-navegacion` es también el destino de «Menú» en móvil sin JavaScript.
 */
export function SiteFooter() {
  const tel = phoneHref();
  const legal = SHOW_LEGAL_LINKS ? legalNav : legalNav.filter((item) => item.href === routes.jobs);

  return (
    <footer
      data-theme="dark"
      className="on-dark relative isolate overflow-hidden border-t border-line bg-surface-sunken text-ink"
    >
      {/* Trama, luz y escudo (decorativos) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="dot-grid absolute inset-0 opacity-45 [mask-image:radial-gradient(ellipse_70%_60%_at_0%_0%,black,transparent_72%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(45%_60%_at_100%_100%,color-mix(in_srgb,var(--azure-600)_22%,transparent),transparent_70%),radial-gradient(40%_45%_at_0%_0%,color-mix(in_srgb,var(--cyan-400)_10%,transparent),transparent_70%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-[image:var(--gradient-accent-line)] opacity-60" />
        {/* eslint-disable-next-line @next/next/no-img-element -- marca de agua decorativa */}
        <img
          src={shield.large.src}
          width={shield.large.width}
          height={shield.large.height}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute -right-16 -bottom-20 w-[300px] opacity-[0.07] sm:w-[380px] lg:right-[4%] lg:-bottom-24 lg:w-[440px]"
        />
      </div>

      <div className="mx-auto max-w-[1344px] px-4 sm:px-8">
        {/* Marca */}
        <div className="flex flex-col gap-6 border-b border-line pt-10 pb-8 sm:pt-16 sm:pb-10 lg:flex-row lg:items-end lg:justify-between lg:pt-20 lg:pb-12">
          <div className="flex flex-col gap-4 sm:gap-5">
            <Link href={routes.home} prefetch={false} className="-m-1 self-start rounded-(--radius) p-1">
              {/* eslint-disable-next-line @next/next/no-img-element -- WebP ya optimizado */}
              <img
                src={logoDark.src}
                width={logoDark.width}
                height={logoDark.height}
                alt="SEDIN, C.A. — Inicio"
                loading="lazy"
                decoding="async"
                className="block h-12 w-auto sm:h-14 lg:h-16"
              />
            </Link>
            <p className="m-0 max-w-[460px] font-display text-[clamp(22px,2.4vw,30px)] leading-[1.2] font-bold tracking-[-0.02em] text-ink">
              Atentos siempre, protegiendo lo que más importa.
            </p>
          </div>
          <p className="m-0 hidden max-w-[420px] text-[15px] leading-[22px] text-ink-muted sm:block lg:text-right">
            {site.legalName} ({site.name}). Seguridad privada y protección preventiva no armada en Maracaibo y el
            Zulia.
          </p>
        </div>

        {/* Cuatro columnas */}
        <div
          id="pie-navegacion"
          className="grid scroll-mt-24 grid-cols-2 gap-x-6 gap-y-8 py-10 sm:gap-x-8 sm:gap-y-10 sm:py-12 lg:grid-cols-[1fr_1fr_1fr_1.35fr] lg:py-14"
        >
          {footerNav.map((column, i) => {
            // En móvil, el tercer grupo (Conozca SEDIN) ocupa el ancho, en dos columnas.
            const wide = i === footerNav.length - 1 && footerNav.length % 2 === 1;
            return (
              <nav key={column.label} aria-labelledby={`pie-col-${i}`} className={cn("min-w-0", wide && "max-sm:col-span-2")}>
                <h2 id={`pie-col-${i}`} className={headingClass}>
                  {column.label}
                </h2>
                <ul className={cn("m-0 mt-3 list-none p-0 sm:mt-4", wide && "max-sm:grid max-sm:grid-cols-2 max-sm:gap-x-6")}>
                  {column.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} prefetch={false} className={linkClass}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            );
          })}

          <section aria-labelledby="pie-contacto" className="col-span-2 min-w-0 sm:col-span-1">
            <h2 id="pie-contacto" className={headingClass}>
              Contacto {site.hours}
            </h2>
            {/* Móvil: llamar y WhatsApp como dos botones en una fila. */}
            <div className="mt-4 grid grid-cols-2 gap-3 sm:hidden">
              <CallLink ubicacion={UBICACION} variant="secondary" size="md" className="w-full">
                {ctaLabels.llamar}
              </CallLink>
              <WhatsAppLink
                message={waMessages.general}
                ubicacion={UBICACION}
                variant="secondary"
                size="md"
                className="w-full"
              >
                WhatsApp
              </WhatsAppLink>
            </div>
            <ul className="m-0 mt-3 grid list-none gap-1 p-0 sm:mt-4">
              {tel && (
                <ContactItem icon={<PhoneIcon size={18} />} className="max-sm:hidden">
                  <a href={tel} {...umami("telefono", { ubicacion: UBICACION })} className={cn(linkBase, "font-semibold text-ink")}>
                    {site.phone}
                  </a>
                </ContactItem>
              )}
              <ContactItem icon={<WhatsAppIcon size={18} tone="brand" />} className="max-sm:hidden">
                <a
                  href={whatsappHref(waMessages.general)}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...umami("whatsapp", { ubicacion: UBICACION })}
                  className={linkClass}
                >
                  Escríbanos por WhatsApp<span className="sr-only"> (abre WhatsApp)</span>
                </a>
              </ContactItem>
              <ContactItem icon={<MapPinIcon size={18} />}>
                {/* «Cómo llegar» al final de la dirección, con 44px de área táctil sin fila propia. */}
                <span className="block py-2.5 text-[15px] leading-[22px] text-ink-muted lg:py-1.5">
                  {site.address}, {site.city}.{" "}
                  <a
                    href={site.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...umami("como-llegar", { ubicacion: UBICACION })}
                    className="-my-3 inline-flex items-center gap-1.5 py-3 font-semibold whitespace-nowrap text-ink-brand no-underline hover:text-ink"
                  >
                    Cómo llegar
                    <ArrowUpRightIcon size={16} />
                    <span className="sr-only"> (abre Google Maps)</span>
                  </a>
                </span>
              </ContactItem>
            </ul>
            <p className="m-0 text-[13px] leading-5 text-ink-subtle sm:mt-3">
              {site.responseTime}, por WhatsApp y teléfono.
            </p>
            <Link
              href={routes.contact}
              prefetch={false}
              className="group/pc mt-1 inline-flex min-h-11 items-center gap-2 font-display text-sm font-semibold tracking-[0.02em] text-ink-brand no-underline hover:text-ink sm:mt-3"
            >
              Todas las formas de contacto
              <ArrowRightIcon size={16} className="transition-transform group-hover/pc:translate-x-1" />
            </Link>
          </section>
        </div>

        {/* Línea inferior. En móvil deja sitio a la barra fija de contacto. */}
        <div className="flex flex-col gap-x-8 gap-y-2 border-t border-line pt-6 pb-[calc(1.75rem+56px+env(safe-area-inset-bottom))] text-[13px] leading-5 text-ink-muted sm:flex-row sm:flex-wrap sm:items-center lg:pb-8">
          <p className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1">
            {/* eslint-disable-next-line @next/next/no-img-element -- sello de 5 KB */}
            <img
              src={shield.small.src}
              width={shield.small.width}
              height={shield.small.height}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-6 w-auto"
            />
            <span>
              © {new Date().getFullYear()} {site.name}
            </span>
            <span aria-hidden="true" className="text-line-strong">
              ·
            </span>
            <span>RIF {site.rifDisplay}</span>
          </p>
          <nav aria-label="Enlaces legales y empleo">
            <ul className="m-0 flex list-none flex-wrap items-center gap-x-6 p-0">
              {legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    prefetch={false}
                    className="inline-flex min-h-11 items-center text-ink-muted no-underline hover:text-ink lg:min-h-0"
                  >
                    {item.href === routes.jobs ? "Empleo: trabaje con nosotros" : item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}

function ContactItem({ icon, className, children }: { icon: ReactNode; className?: string; children: ReactNode }) {
  return (
    <li className={cn("flex items-start gap-3", className)}>
      <span className="mt-3 flex h-5 w-5 shrink-0 items-center justify-center text-ink-accent lg:mt-1.5">{icon}</span>
      <span className="min-w-0">{children}</span>
    </li>
  );
}
