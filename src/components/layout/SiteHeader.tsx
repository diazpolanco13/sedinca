"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { CloseIcon, MenuIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import { mainNav, phoneHref, routes, sectionNav, site } from "@/config/site";

type NavItem = { label: string; href: string };

// Sin `display`: cada uso decide si es inline-flex o `hidden lg:inline-flex`.
const ctaClass =
  "items-center rounded-(--radius) bg-[image:var(--gradient-action)] text-on-brand no-underline transition-[filter,box-shadow,transform] hover:text-on-brand hover:brightness-110 active:scale-[0.98]";

function isCurrent(pathname: string, href: string) {
  const clean = pathname.replace(/\/$/, "") || "/";
  return href === "/" ? clean === "/" : clean.startsWith(href);
}

/**
 * Encabezado del sitio.
 * - `overlay`: transparente sobre la portada fotográfica (Inicio).
 * - `solid`: barra clara de una fila (páginas interiores).
 */
export function SiteHeader({ variant = "overlay" }: { variant?: "overlay" | "solid" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const menuButton = (
    <button
      type="button"
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center rounded-(--radius) border lg:hidden",
        variant === "overlay"
          ? "border-white/30 bg-scrim/40 text-white backdrop-blur-sm"
          : "border-line-strong bg-surface text-ink",
      )}
      aria-expanded={open}
      aria-controls={menuId}
      aria-label={open ? "Cerrar menú" : "Abrir menú"}
      onClick={() => setOpen((v) => !v)}
    >
      {open ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
    </button>
  );

  const mobileMenu = (
    <MobileMenu
      id={menuId}
      open={open}
      onNavigate={() => setOpen(false)}
      pathname={pathname}
      items={
        variant === "overlay"
          ? [...mainNav, { label: "Trabaja con nosotros", href: routes.jobs }]
          : sectionNav
      }
      dark={variant === "overlay"}
    />
  );

  if (variant === "solid") {
    const showCta = !isCurrent(pathname, routes.contact);
    return (
      <header className="relative z-20 border-b border-line bg-surface">
        <div className="relative mx-auto flex max-w-[1344px] flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-8">
          <Link href={routes.home} className="block">
            <Image
              src="/assets/logo-sedin-fondo-claro.png"
              alt="SEDIN, C.A — inicio"
              width={650}
              height={320}
              priority
              className="block h-12 w-auto mix-blend-multiply lg:h-14"
            />
          </Link>
          <nav
            aria-label="Principal"
            className="hidden flex-wrap items-center gap-x-7 gap-y-1 font-display text-[15px] leading-5 font-semibold lg:flex"
          >
            {sectionNav.map((item) => {
              const current = isCurrent(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  className={cn(
                    "py-3 no-underline transition-colors",
                    current
                      ? "border-b-2 border-brand text-ink-brand hover:text-brand-deep"
                      : "text-ink hover:text-ink-brand",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          {showCta && (
            <Link
              href={routes.contact}
              className={cn(
                ctaClass,
                "hidden h-11 px-6 font-display text-sm font-bold tracking-[0.04em] shadow-inset-highlight hover:shadow-[var(--inset-highlight),var(--glow-cyan)] lg:inline-flex",
              )}
            >
              Solicitar cotización
            </Link>
          )}
          {menuButton}
          {mobileMenu}
        </div>
      </header>
    );
  }

  const tel = phoneHref();
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
              className="py-2.5 text-white/90 no-underline transition-colors hover:text-white"
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
            <Link
              href={routes.contact}
              className={cn(
                ctaClass,
                "inline-flex h-[52px] px-[30px] text-[17px] tracking-[0.02em] shadow-cta hover:shadow-cta-hover",
              )}
            >
              Solicitar cotización
            </Link>
          </div>

          {menuButton}
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

        {mobileMenu}
      </div>
    </header>
  );
}

function MobileMenu({
  id,
  open,
  onNavigate,
  pathname,
  items,
  dark,
}: {
  id: string;
  open: boolean;
  onNavigate: () => void;
  pathname: string;
  items: readonly NavItem[];
  dark: boolean;
}) {
  return (
    <div
      id={id}
      hidden={!open}
      className={cn(
        "absolute inset-x-4 top-full mt-2 rounded-lg border p-4 shadow-elevation-3 sm:inset-x-6 lg:hidden",
        dark
          ? "border-white/16 bg-scrim/95 backdrop-blur-md"
          : "border-line-modal bg-surface-raised",
      )}
    >
      <nav aria-label="Principal (móvil)" className="flex flex-col">
        {items.map((item) => {
          const current = isCurrent(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={current ? "page" : undefined}
              onClick={onNavigate}
              className={cn(
                "border-b py-3.5 text-lg no-underline",
                dark ? "border-white/12" : "border-line",
                current
                  ? dark
                    ? "text-azure-400"
                    : "font-semibold text-ink-brand"
                  : dark
                    ? "text-white/90"
                    : "text-ink",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="flex flex-col gap-4 pt-4">
        <span className={dark ? "text-white/75" : "text-ink-muted"}>{site.phone}</span>
        <Link
          href={routes.contact}
          onClick={onNavigate}
          className={cn(
            ctaClass,
            "inline-flex h-[52px] justify-center px-[30px] text-[17px] shadow-cta",
          )}
        >
          Solicitar cotización
        </Link>
      </div>
    </div>
  );
}
