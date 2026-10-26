import Image from "next/image";
import Link from "next/link";
import { routes, services } from "@/config/site";

const quickLinks = [
  { label: "Vigilancia privada", href: services.vigilancia.href },
  { label: "Control de acceso", href: services.acceso.href },
  { label: "Cámaras de seguridad", href: services.electronicos.href },
  { label: "Cercado eléctrico y concertinas", href: services.electronicos.href },
];

const chipClass =
  "inline-flex h-[58px] items-center rounded-(--radius) border border-white/16 bg-scrim/78 px-[27px] font-sans text-[17px] text-white/92 no-underline backdrop-blur-[8px] transition-colors hover:border-white/40 hover:text-white";

/** 01 · Portada: foto a sangre; el encabezado (SiteHeader) se superpone arriba. */
export function Hero() {
  return (
    <section
      id="inicio"
      aria-labelledby="portada-titulo"
      className="relative flex min-h-[760px] flex-col bg-azure-950 pt-16 text-white lg:pt-[156px]"
    >
      <Image
        src="/assets/hero-puente-vigilante.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[78%_center] min-[901px]:object-[70%_center]"
      />
      <div aria-hidden="true" className="hero-scrim absolute inset-0" />

      <div className="on-dark relative mx-auto box-border flex w-full max-w-[1440px] flex-1 flex-col justify-center gap-7 px-4 pt-12 pb-10 sm:px-6 lg:px-14 lg:pt-[72px]">
        <span className="font-sans text-[13px] leading-5 font-normal tracking-[0.14em] text-white/72 uppercase sm:text-[15px]">
          Protegemos lo que mueve tu mundo
        </span>
        <h1
          id="portada-titulo"
          className="m-0 max-w-[680px] font-display text-[clamp(44px,6vw,92px)] leading-[1.02] font-bold tracking-[-0.02em] text-white [text-shadow:0_2px_24px_rgba(4,13,31,0.35)]"
        >
          Soluciones de seguridad <span className="text-azure-500">integral</span>
        </h1>
        <p className="m-0 max-w-[620px] font-sans text-lg leading-7 font-light text-white/92 sm:text-xl sm:leading-8">
          Vigilancia privada, control de acceso y sistemas electrónicos para industrias, empresas,
          corporaciones y conjuntos residenciales.
        </p>
        <div className="flex flex-wrap gap-4 pt-1">
          <Link
            href={routes.contact}
            className="inline-flex h-[60px] items-center rounded-(--radius) bg-[image:var(--gradient-action)] px-8 font-sans text-[19px] font-normal tracking-[0.02em] text-on-brand no-underline shadow-cta transition-[filter,box-shadow,transform] hover:text-on-brand hover:brightness-110 hover:shadow-cta-hover active:scale-[0.98]"
          >
            Solicitar cotización
          </Link>
          <Link
            href={routes.services}
            className="inline-flex h-16 items-center rounded-(--radius) border-2 border-white/90 px-[38px] font-sans text-[19px] font-normal tracking-[0.02em] text-white no-underline transition-colors hover:bg-white/10 hover:text-white active:scale-[0.98]"
          >
            Ver servicios
          </Link>
        </div>
        <nav aria-label="Servicios destacados" className="flex flex-wrap gap-3.5 pt-5">
          {quickLinks.map((l) => (
            <Link key={l.label} href={l.href} className={chipClass}>
              {l.label}
            </Link>
          ))}
          <Link href={services.electronicos.href} className={`${chipClass} gap-3`}>
            <span
              aria-hidden="true"
              className="h-3 w-3 rounded-full bg-azure-600 shadow-[0_0_0_4px_rgba(0,114,206,0.35)]"
            />
            Monitoreo 24/7
          </Link>
        </nav>
      </div>
    </section>
  );
}
