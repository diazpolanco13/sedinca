"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { CloseIcon, MenuIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import { mainNav, phoneHref, routes, site } from "@/config/site";

const mobileItems = [...mainNav, { label: "Trabaja con nosotros", href: routes.jobs }];

const ctaClass =
  "inline-flex items-center rounded-(--radius) bg-[image:var(--gradient-action)] text-on-brand no-underline tracking-[0.02em] shadow-cta transition-[filter,box-shadow,transform] hover:text-on-brand hover:brightness-110 hover:shadow-cta-hover active:scale-[0.98]";

function isCurrent(pathname: string, href: string) {
  const clean = pathname.replace(/\/$/, "") || "/";
  return href === "/" ? clean === "/" : clean.startsWith(href);
}

/**
 * Encabezado transparente superpuesto a la foto de portada (Inicio y páginas
 * interiores). La página debe empezar con Hero o PageHero.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const tel = phoneHref();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="on-dark absolute inset-x-0 top-0 z-20">
      <div className="relative mx-auto box-border w-full max-w-[1440px] px-4 pt-4 sm:px-6 lg:px-14 lg:pt-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href={routes.home} className="block">
            <Image
              src="/assets/logo-sedin-fondo-oscuro.png"
              alt="SEDIN, C.A — inicio"
              width={1200}
              height={571}
              priority
              className="block h-12 w-auto lg:h-16"
            />
          </Link>

          <div className="hidden flex-wrap items-center gap-x-8 gap-y-2 font-sans text-[17px] leading-6 font-normal lg:flex">
            <Link
              href={routes.jobs}
              aria-current={isCurrent(pathname, routes.jobs) ? "page" : undefined}
              className={cn(
                "py-2.5 no-underline transition-colors",
                isCurrent(pathname, routes.jobs)
                  ? "text-azure-400 hover:text-azure-300"
                  : "text-white/90 hover:text-white",
              )}
            >
              Trabaja con nosotros
            </Link>
            {tel ? (
              <a href={tel} className="text-white/75 no-underline hover:text-white">
                {site.phone}
              </a>
            ) : (
              <span className="text-white/75">{site.phone}</span>
            )}
            <Link href={routes.contact} className={cn(ctaClass, "h-[52px] px-[30px] text-[17px]")}>
              Solicitar cotización
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-(--radius) border border-white/30 bg-scrim/40 text-white backdrop-blur-sm lg:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>

        <nav
          aria-label="Principal"
          className="mt-3 hidden max-w-[760px] flex-wrap items-center gap-x-11 border-b border-white/28 font-sans text-lg leading-6 font-normal lg:flex"
        >
          {mainNav.map((item) => {
            const current = isCurrent(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "no-underline transition-colors",
                  current
                    ? "-mb-px border-b-[3px] border-azure-500 pt-[18px] pb-4 text-azure-400 hover:text-azure-300"
                    : "py-[18px] text-white/90 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Menú móvil */}
        <div
          id={menuId}
          hidden={!open}
          className="absolute inset-x-4 top-full mt-2 rounded-lg border border-white/16 bg-scrim/95 p-4 shadow-elevation-3 backdrop-blur-md sm:inset-x-6 lg:hidden"
        >
          <nav aria-label="Principal (móvil)" className="flex flex-col">
            {mobileItems.map((item) => {
              const current = isCurrent(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "border-b border-white/12 py-3.5 text-lg no-underline",
                    current ? "text-azure-400" : "text-white/90",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex flex-col gap-4 pt-4">
            {tel ? (
              <a href={tel} className="text-white/90 no-underline">
                {site.phone}
              </a>
            ) : (
              <span className="text-white/75">{site.phone}</span>
            )}
            <Link
              href={routes.contact}
              onClick={() => setOpen(false)}
              className={cn(ctaClass, "h-[52px] justify-center px-[30px] text-[17px]")}
            >
              Solicitar cotización
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
