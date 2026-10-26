import Link from "next/link";
import { emailHref, phoneHref, routes, services, site } from "@/config/site";

const linkClass = "text-titanium-300 no-underline transition-colors hover:text-white";
const headingClass =
  "font-display text-xs leading-5 font-bold tracking-[0.08em] text-white uppercase";

export function SiteFooter() {
  const tel = phoneHref();
  return (
    <footer className="on-dark bg-azure-950 text-titanium-300">
      <div className="mx-auto flex max-w-[1344px] flex-col gap-10 px-4 pt-16 pb-8 sm:px-8">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8">
          <div className="flex flex-col gap-3">
            <span className="font-display text-[28px] leading-8 font-bold text-white">
              {site.name}
            </span>
            <span className="text-sm leading-5">{site.legalName}.</span>
          </div>
          <nav aria-label="Servicios" className="flex flex-col gap-2 text-sm leading-5">
            <span className={headingClass}>Servicios</span>
            {Object.values(services).map((s) => (
              <Link key={s.href} href={s.href} className={linkClass}>
                {s.label}
              </Link>
            ))}
          </nav>
          <nav aria-label="Empresa" className="flex flex-col gap-2 text-sm leading-5">
            <span className={headingClass}>Empresa</span>
            <Link href={routes.about} className={linkClass}>
              Nosotros
            </Link>
            <Link href={routes.sectors} className={linkClass}>
              Sectores
            </Link>
            <Link href={routes.jobs} className={linkClass}>
              Trabaja con nosotros
            </Link>
          </nav>
          <div className="flex flex-col gap-2 text-sm leading-5">
            <span className={headingClass}>Contacto</span>
            {tel ? (
              <a href={tel} className={linkClass}>
                {site.phone}
              </a>
            ) : (
              <span>{site.phone}</span>
            )}
            <a href={emailHref()} className={linkClass}>
              {site.email}
            </a>
            <span>Atención {site.hours}</span>
            <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {site.address}, {site.city}
            </a>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-3 border-t border-azure-200/16 pt-6 text-[13px] leading-[18px]">
          <span>
            © {site.name} · RIF {site.rif}
          </span>
          <span>Aviso legal · Privacidad</span>
        </div>
      </div>
    </footer>
  );
}
