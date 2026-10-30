"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import {
  ArrowRightIcon,
  ChevronDownIcon,
  ClockIcon,
  CloseIcon,
  MenuIcon,
  PhoneIcon,
  ShieldCheckIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { buttonClass } from "@/components/ui/links";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import {
  ctaLabels,
  headerCta,
  mobileNav,
  phoneHref,
  primaryNav,
  routes,
  secondaryNav,
  site,
  solutionsNav,
  whatsappHref,
  type NavGroup,
  type NavItem,
} from "@/config/site";
import { umami } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { diagnosticCard, logoDark, navVisual } from "./navVisuals";
import { isCurrentPath, routeContext } from "./routeContext";
import { useHydrated, usePastHero } from "./usePastHero";

/*
 * Encabezado del sitio (propuesta, 5.3 y 15.6).
 *
 * - Sobre la portada: transparente y superpuesto a la foto del puente (todas
 *   las páginas empiezan con Hero o PageHero). Alto: 64px en móvil y 128px en
 *   escritorio (barra fina de 40px + barra principal de 88px), dentro del
 *   `pt-16 lg:pt-[156px]` de las portadas.
 * - Al pasar la portada: el mismo encabezado pasa a fijo, compacto y oscuro
 *   (56px en móvil, 68px en escritorio). Un único IntersectionObserver; sin
 *   JavaScript se queda el encabezado normal. De 1024 a 1439px lleva además
 *   un icono de WhatsApp junto a «Cotizar» (ahí no hay botón flotante).
 * - «Soluciones ▾» (escritorio): panel de dos columnas. Con JavaScript se abre
 *   al pasar el ratón o al pulsar (Esc cierra y devuelve el foco); sin
 *   JavaScript se abre con :hover y :focus-within.
 * - Móvil: logo, botón de llamada y menú en <dialog> modal (foco atrapado,
 *   Esc, el resto inerte, el foco vuelve al botón). Sin JavaScript, «Menú»
 *   lleva a la navegación del pie (#pie-navegacion).
 */

const MENU_UBICACION = "menu";

// `cn` no fusiona clases: el color va aparte según el estado.
const navLinkClass =
  "relative inline-flex h-11 items-center rounded-(--radius) px-3.5 font-sans text-base leading-6 no-underline transition-colors hover:bg-white/8 hover:text-white xl:px-4";
const navIdleClass = "text-white/88";
const navCurrentClass =
  "text-white after:absolute after:inset-x-3.5 after:bottom-1 after:h-0.5 after:rounded-full after:bg-[image:var(--gradient-accent-line)] xl:after:inset-x-4";

const iconButtonClass =
  "inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/28 bg-scrim/45 text-white no-underline transition-colors hover:border-white/60 hover:bg-scrim/70 hover:text-white";

/** Encabezado compacto: entra deslizándose al pasar la portada y sale al volver. */
function useCompactHeader(past: boolean) {
  const [state, setState] = useState<"top" | "entering" | "shown" | "leaving">("top");
  useEffect(() => {
    let alive = true;
    if (past) {
      setState("entering");
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (alive) setState("shown");
        }),
      );
      return () => {
        alive = false;
      };
    }
    setState((s) => (s === "top" ? s : "leaving"));
    const t = window.setTimeout(() => setState("top"), 260);
    return () => window.clearTimeout(t);
  }, [past]);
  return { compact: state !== "top", shown: state === "shown" };
}

export function SiteHeader() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const past = usePastHero();
  const { compact, shown } = useCompactHeader(past);
  const tel = phoneHref();

  return (
    <header
      className={cn(
        "on-dark inset-x-0 top-0 z-40 text-white",
        compact
          ? "fixed border-b border-white/10 bg-azure-950 shadow-elevation-2 transition-transform duration-300 ease-out"
          : "absolute",
        compact && !shown && "-translate-y-full",
      )}
    >
      {/* Barra superior fina (escritorio) */}
      <div className={cn("border-b border-white/12", compact ? "hidden" : "hidden lg:block")}>
        <div className="mx-auto flex h-10 max-w-[1344px] items-center justify-between gap-6 px-4 font-sans text-[13px] leading-5 text-white/80 sm:px-8">
          <p className="m-0 flex items-center gap-5">
            <span className="inline-flex items-center gap-2">
              <ClockIcon size={15} className="text-cyan-300" />
              Atención {site.hours}
            </span>
            {tel && (
              <a
                href={tel}
                {...umami("telefono", { ubicacion: MENU_UBICACION })}
                className="inline-flex items-center gap-2 text-white/88 no-underline transition-colors hover:text-white"
              >
                <PhoneIcon size={15} className="text-cyan-300" />
                {site.phone}
              </a>
            )}
          </p>
          <nav aria-label="Secundaria">
            <ul className="m-0 flex list-none items-center gap-5 p-0">
              {secondaryNav.map((item) => {
                const current = isCurrentPath(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      prefetch={false}
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        "transition-colors hover:text-white",
                        current
                          ? "text-white underline decoration-cyan-400 decoration-2 underline-offset-[6px]"
                          : "text-white/80 no-underline",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Barra principal */}
      <div
        className={cn(
          "relative mx-auto flex max-w-[1344px] items-center gap-4 px-4 sm:px-8",
          compact ? "h-14 lg:h-[68px]" : "h-16 lg:h-[88px]",
        )}
      >
        <Link
          href={routes.home}
          prefetch={false}
          className="-m-1 block shrink-0 rounded-(--radius) p-1"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- WebP ya optimizado (images.unoptimized) */}
          <img
            src={logoDark.src}
            width={logoDark.width}
            height={logoDark.height}
            alt="SEDIN, C.A. — Inicio"
            decoding="async"
            className={cn("block w-auto", compact ? "h-9 lg:h-11" : "h-11 lg:h-[60px]")}
          />
        </Link>

        <nav aria-label="Principal" className="hidden flex-1 justify-center lg:flex">
          <ul className="m-0 flex list-none items-center gap-1 p-0">
            {primaryNav.map((item) =>
              item.groups ? (
                <SolutionsMenu key={item.label} groups={item.groups} label={item.label} pathname={pathname} hydrated={hydrated} />
              ) : (
                item.href && (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      prefetch={false}
                      aria-current={isCurrentPath(pathname, item.href) ? "page" : undefined}
                      className={cn(navLinkClass, isCurrentPath(pathname, item.href) ? navCurrentClass : navIdleClass)}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              ),
            )}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2.5 lg:ml-0">
          {compact && <CompactWhatsApp pathname={pathname} />}
          <div className="hidden lg:block">
            <Link
              href={headerCta.href}
              prefetch={false}
              {...umami("cta-cotizar", { ubicacion: MENU_UBICACION })}
              className={buttonClass({ variant: "primary", size: compact ? "sm" : "md" })}
            >
              {headerCta.label}
            </Link>
          </div>
          {/* Llamar (móvil). En el encabezado compacto lo sustituye la barra inferior. */}
          {tel && !compact && (
            <a
              href={tel}
              aria-label={`Llamar a SEDIN: ${site.phone}`}
              {...umami("telefono", { ubicacion: MENU_UBICACION })}
              className={cn(iconButtonClass, "lg:hidden")}
            >
              <PhoneIcon size={20} />
            </a>
          )}
          <MobileMenu pathname={pathname} hydrated={hydrated} />
        </div>
      </div>
    </header>
  );
}

/**
 * WhatsApp en el encabezado compacto, de 1024 a 1439px: ahí el botón
 * flotante taparía el borde derecho del contenido (el margen lateral mide
 * menos de 80px), así que el acceso pasa aquí, junto a «Cotizar». Aparece
 * con el encabezado compacto, es decir, pasada la portada (que ya ofrece
 * WhatsApp). Mismo mensaje y evento que el flotante.
 */
function CompactWhatsApp({ pathname }: { pathname: string }) {
  const ctx = routeContext(pathname);
  const empleo = ctx.kind === "empleo";
  const href = whatsappHref(ctx.whatsapp);
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...umami(empleo ? "postulacion-whatsapp" : "whatsapp", { ubicacion: "encabezado" })}
      aria-label={empleo ? "Postular por WhatsApp" : "Escríbanos por WhatsApp"}
      title="WhatsApp"
      className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/28 bg-scrim/45 no-underline transition-colors hover:border-white/60 hover:bg-scrim/70 lg:inline-flex min-[90rem]:hidden"
    >
      <WhatsAppIcon size={22} tone="brand" />
    </a>
  );
}

/* -------------------------------------------------------------------------
 * «Soluciones ▾» (escritorio)
 * ---------------------------------------------------------------------- */

function SolutionsMenu({
  label,
  groups,
  pathname,
  hydrated,
}: {
  label: string;
  groups: NavGroup[];
  pathname: string;
  hydrated: boolean;
}) {
  const panelId = useId();
  const liRef = useRef<HTMLLIElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const via = useRef<"hover" | "click">("click");
  // El menú se abre «en» una ruta: al navegar queda cerrado sin efectos.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = hydrated && openAt === pathname;
  const current = groups.some((g) => isCurrentPath(pathname, g.index.href));

  const show = (how: "hover" | "click") => {
    via.current = how;
    setOpenAt(pathname);
  };
  const hide = () => setOpenAt(null);
  const clearTimer = () => window.clearTimeout(timer.current);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: globalThis.PointerEvent) => {
      if (!liRef.current?.contains(e.target as Node)) setOpenAt(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    const t = timer;
    return () => window.clearTimeout(t.current);
  }, []);

  const onPointerEnter = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    clearTimer();
    if (!open) timer.current = window.setTimeout(() => show("hover"), 70);
  };
  const onPointerLeave = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    clearTimer();
    timer.current = window.setTimeout(hide, 220);
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && open) {
      e.stopPropagation();
      hide();
      buttonRef.current?.focus();
    }
  };
  const onBlur = (e: FocusEvent) => {
    if (!liRef.current?.contains(e.relatedTarget as Node | null)) hide();
  };

  return (
    <li
      ref={liRef}
      className="group/sol"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          clearTimer();
          if (open && via.current === "hover") via.current = "click";
          else if (open) hide();
          else show("click");
        }}
        className={cn(
          navLinkClass,
          "group/btn cursor-pointer gap-1.5 border-0 bg-transparent",
          current ? navCurrentClass : navIdleClass,
        )}
      >
        {label}
        <ChevronDownIcon
          size={16}
          className="text-white/70 transition-transform duration-200 group-aria-expanded/btn:rotate-180"
        />
      </button>

      <div
        id={panelId}
        className={cn(
          "absolute top-full left-1/2 z-30 w-[min(880px,calc(100vw-4rem))] -translate-x-1/2 pt-2 transition-[opacity,translate,visibility] duration-200 ease-out",
          hydrated
            ? open
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-1 opacity-0"
            : "invisible -translate-y-1 opacity-0 group-focus-within/sol:visible group-focus-within/sol:translate-y-0 group-focus-within/sol:opacity-100 group-hover/sol:visible group-hover/sol:translate-y-0 group-hover/sol:opacity-100",
        )}
      >
        <SolutionsPanel groups={groups} pathname={pathname} onNavigate={hide} />
      </div>
    </li>
  );
}

function SolutionsPanel({
  groups,
  pathname,
  onNavigate,
}: {
  groups: NavGroup[];
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <div
      data-theme="dark"
      className="relative overflow-hidden rounded-xl border border-line-glass bg-azure-950 text-ink shadow-elevation-3 before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-[image:var(--gradient-accent-line)]"
    >
      <div
        aria-hidden="true"
        className="dot-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_60%_80%_at_100%_0%,black,transparent_70%)]"
      />
      <div className="relative grid grid-cols-2 divide-x divide-line">
        {groups.map((group) => (
          <div key={group.id} className="p-6 xl:p-7">
            <p id={`menu-${group.id}`} className="eyebrow m-0 text-ink-accent">
              {group.label}
            </p>
            <ul aria-labelledby={`menu-${group.id}`} className="m-0 mt-4 grid list-none gap-1 p-0">
              {group.items.map((item) => (
                <li key={item.href}>
                  <PanelLink item={item} pathname={pathname} onNavigate={onNavigate} />
                </li>
              ))}
            </ul>
            <Link
              href={group.index.href}
              prefetch={false}
              onClick={onNavigate}
              className="group/idx mt-4 inline-flex min-h-11 items-center gap-2 rounded-(--radius) px-2.5 font-display text-sm font-semibold tracking-[0.02em] text-ink-brand no-underline hover:text-white"
            >
              {group.index.label}
              <ArrowRightIcon size={16} className="transition-transform group-hover/idx:translate-x-1" />
            </Link>
          </div>
        ))}
      </div>
      <Link
        href={diagnosticCard.href}
        prefetch={false}
        onClick={onNavigate}
        {...umami("cta-cotizar", { ubicacion: MENU_UBICACION })}
        className="group/diag relative flex items-center gap-5 border-t border-line bg-white/4 px-6 py-5 no-underline transition-colors hover:bg-white/8 xl:px-7"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[image:var(--gradient-shield)] text-white shadow-glow-cyan">
          <ShieldCheckIcon size={24} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-lg leading-6 font-bold tracking-[-0.01em] text-ink">
            {diagnosticCard.title}
          </span>
          <span className="mt-0.5 block text-sm leading-5 text-ink-muted">{diagnosticCard.text}</span>
        </span>
        <ArrowRightIcon size={22} className="shrink-0 text-ink-accent transition-transform group-hover/diag:translate-x-1" />
      </Link>
    </div>
  );
}

function PanelLink({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  onNavigate: () => void;
}) {
  const { thumb, Icon } = navVisual(item.href);
  const current = isCurrentPath(pathname, item.href);
  return (
    <Link
      href={item.href}
      prefetch={false}
      onClick={onNavigate}
      aria-current={current ? "page" : undefined}
      className={cn(
        "group/item flex items-center gap-4 rounded-lg p-2.5 no-underline transition-colors hover:bg-white/6",
        current && "bg-white/6",
      )}
    >
      {thumb ? (
        // eslint-disable-next-line @next/next/no-img-element -- miniatura de 3 KB
        <img
          src={thumb}
          width={160}
          height={124}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-14 w-[72px] shrink-0 rounded-md object-cover ring-1 ring-white/12 transition-[filter] group-hover/item:brightness-110"
        />
      ) : Icon ? (
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-line-cyan bg-accent-subtle text-ink-accent">
          <Icon size={24} />
        </span>
      ) : null}
      <span className="min-w-0">
        <span className="block font-display text-[15px] leading-5 font-semibold text-ink group-hover/item:text-white">
          {item.label}
        </span>
        {item.description && (
          <span className="mt-0.5 block text-[13px] leading-[18px] text-ink-muted">{item.description}</span>
        )}
      </span>
    </Link>
  );
}

/* -------------------------------------------------------------------------
 * Menú móvil: <dialog> modal con acordeón
 * ---------------------------------------------------------------------- */

function MobileMenu({ pathname, hydrated }: { pathname: string; hydrated: boolean }) {
  const dialogId = useId();
  const titleId = useId();
  const solutionsId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  // El acordeón abre siempre plegado (también desde Soluciones): así se ven
  // todas las entradas y los botones de contacto sin desplazar. La página
  // actual queda marcada dentro al desplegarlo.
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const currentSolution = solutionsNav.groups
    ?.flatMap((g) => g.items)
    .find((link) => isCurrentPath(pathname, link.href));
  const ctx = routeContext(pathname);
  const tel = phoneHref();

  const openMenu = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    setSolutionsOpen(false);
    dialog.showModal();
    // showModal() enfoca el primer enlace (el logo): el foco va a «Cerrar menú».
    closeRef.current?.focus();
    setOpen(true);
  };
  const closeMenu = () => dialogRef.current?.close();

  // Al cambiar de ruta, el menú se cierra.
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  // Mientras está abierto: sin desplazamiento de fondo y cierre si la ventana
  // pasa a escritorio.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && dialogRef.current?.close();
    mq.addEventListener("change", onChange);
    return () => {
      root.style.overflow = previous;
      mq.removeEventListener("change", onChange);
    };
  }, [open]);

  const trigger = hydrated ? (
    <button
      ref={triggerRef}
      type="button"
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls={dialogId}
      aria-label="Abrir menú"
      onClick={openMenu}
      className={cn(iconButtonClass, "lg:hidden")}
    >
      <MenuIcon size={22} />
    </button>
  ) : (
    // Sin JavaScript: el menú lleva a la navegación completa del pie.
    <a href="#pie-navegacion" aria-label="Menú: ir a la navegación del sitio" className={cn(iconButtonClass, "lg:hidden")}>
      <MenuIcon size={22} />
    </a>
  );

  return (
    <>
      {trigger}
      <dialog
        ref={dialogRef}
        id={dialogId}
        aria-labelledby={titleId}
        data-theme="dark"
        onClose={() => {
          setOpen(false);
          triggerRef.current?.focus();
        }}
        className="section-dark on-dark fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-hidden border-0 p-0 text-ink backdrop:bg-scrim/80 open:flex open:flex-col lg:hidden"
      >
        <h2 id={titleId} className="sr-only">
          Menú
        </h2>
        {/* Cabecera y pie fijos; solo la navegación se desplaza (los botones de contacto siempre a la vista). */}
        <div className="z-10 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-line bg-azure-950 px-4 sm:px-8">
          <Link href={routes.home} prefetch={false} onClick={closeMenu} className="-m-1 block rounded-(--radius) p-1">
            {/* eslint-disable-next-line @next/next/no-img-element -- WebP ya optimizado */}
            <img
              src={logoDark.src}
              width={logoDark.width}
              height={logoDark.height}
              alt="SEDIN, C.A. — Inicio"
              className="block h-11 w-auto"
            />
          </Link>
          <button ref={closeRef} type="button" onClick={closeMenu} aria-label="Cerrar menú" className={iconButtonClass}>
            <CloseIcon size={22} />
          </button>
        </div>

        <nav aria-label="Principal" className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-3 pb-6 sm:px-8">
          <ul className="m-0 list-none p-0">
            {mobileNav.main.map((item) =>
              item.groups ? (
                <li key={item.label} className="border-b border-line">
                  <button
                    type="button"
                    aria-expanded={solutionsOpen}
                    aria-controls={solutionsId}
                    onClick={() => setSolutionsOpen((v) => !v)}
                    className="group/acc flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent px-0 py-3 text-left font-display text-xl font-semibold tracking-[-0.01em] text-ink"
                  >
                    <span className="flex min-w-0 flex-col">
                      {item.label}
                      {/* Plegado: indica en qué solución está la página actual. */}
                      {currentSolution && (
                        <span className="font-sans text-sm leading-5 font-normal tracking-normal text-ink-accent">
                          {currentSolution.label}
                        </span>
                      )}
                    </span>
                    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-line-strong text-ink-muted">
                      <ChevronDownIcon size={18} className="transition-transform duration-200 group-aria-expanded/acc:rotate-180" />
                    </span>
                  </button>
                  <div id={solutionsId} hidden={!solutionsOpen} className="pb-5">
                    {item.groups.map((group) => (
                      <div key={group.id} className="mt-2 first:mt-0">
                        <p id={`movil-${group.id}`} className="eyebrow m-0 py-2 text-ink-accent">
                          {group.label}
                        </p>
                        <ul aria-labelledby={`movil-${group.id}`} className="m-0 grid list-none gap-0.5 p-0">
                          {group.items.map((link) => (
                            <li key={link.href}>
                              <MobilePanelLink item={link} pathname={pathname} onNavigate={closeMenu} />
                            </li>
                          ))}
                        </ul>
                        <Link
                          href={group.index.href}
                          prefetch={false}
                          onClick={closeMenu}
                          className="mt-1 inline-flex min-h-11 items-center gap-2 font-display text-sm font-semibold tracking-[0.02em] text-ink-brand no-underline"
                        >
                          {group.index.label}
                          <ArrowRightIcon size={16} />
                        </Link>
                      </div>
                    ))}
                  </div>
                </li>
              ) : (
                item.href && (
                  <li key={item.href} className="border-b border-line">
                    <MobileTopLink href={item.href} label={item.label} pathname={pathname} onNavigate={closeMenu} />
                  </li>
                )
              ),
            )}
          </ul>
          <ul className="m-0 mt-6 list-none border-t border-line-strong/60 p-0 pt-2">
            {mobileNav.after.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  prefetch={false}
                  onClick={closeMenu}
                  aria-current={isCurrentPath(pathname, item.href) ? "page" : undefined}
                  className="flex min-h-12 items-center justify-between gap-4 text-base text-ink-muted no-underline aria-[current=page]:text-ink"
                >
                  <span>
                    {item.label}
                    <span className="ml-2 text-sm text-ink-subtle">· Trabaje como oficial de seguridad</span>
                  </span>
                  <ArrowRightIcon size={18} />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="shrink-0 border-t border-line bg-azure-950/90 px-4 pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:px-8">
          {ctx.kind === "empleo" ? (
            <WhatsAppLink
              message={ctx.whatsapp}
              ubicacion={MENU_UBICACION}
              event="postulacion-whatsapp"
              size="lg"
              block
              className="w-full"
            >
              {ctaLabels.postular}
            </WhatsAppLink>
          ) : (
            <div className="grid gap-3">
              <WhatsAppLink message={ctx.whatsapp} ubicacion={MENU_UBICACION} size="lg" block className="w-full" />
              <Link
                href={routes.cotizar}
                prefetch={false}
                onClick={closeMenu}
                {...umami("cta-cotizar", { ubicacion: MENU_UBICACION })}
                className={buttonClass({ variant: "secondary", size: "lg", className: "w-full" })}
              >
                {ctaLabels.diagnostico}
              </Link>
            </div>
          )}
          <p className="m-0 mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-sm leading-5 text-ink-muted">
            <span>Atención {site.hours}</span>
            {tel && (
              <>
                <span aria-hidden="true">·</span>
                <a
                  href={tel}
                  {...umami("telefono", { ubicacion: MENU_UBICACION })}
                  className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-ink no-underline"
                >
                  <PhoneIcon size={16} className="text-ink-accent" />
                  {site.phone}
                </a>
              </>
            )}
            <span className="basis-full text-xs text-ink-subtle">{site.responseTime}</span>
          </p>
        </div>
      </dialog>
    </>
  );
}

function MobileTopLink({
  href,
  label,
  pathname,
  onNavigate,
}: {
  href: string;
  label: string;
  pathname: string;
  onNavigate: () => void;
}) {
  const current = isCurrentPath(pathname, href);
  return (
    <Link
      href={href}
      prefetch={false}
      onClick={onNavigate}
      aria-current={current ? "page" : undefined}
      className={cn(
        "flex min-h-14 items-center justify-between gap-4 py-3 font-display text-xl font-semibold tracking-[-0.01em] no-underline",
        current ? "text-ink-accent" : "text-ink",
      )}
    >
      {label}
      <ArrowRightIcon size={18} className="text-ink-subtle" />
    </Link>
  );
}

function MobilePanelLink({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  onNavigate: () => void;
}) {
  const { thumb, Icon } = navVisual(item.href);
  const current = isCurrentPath(pathname, item.href);
  return (
    <Link
      href={item.href}
      prefetch={false}
      onClick={onNavigate}
      aria-current={current ? "page" : undefined}
      className={cn(
        "flex min-h-14 items-center gap-3.5 rounded-lg py-1.5 pr-2 no-underline",
        current ? "text-ink-accent" : "text-ink",
      )}
    >
      {thumb ? (
        // eslint-disable-next-line @next/next/no-img-element -- miniatura de 3 KB
        <img
          src={thumb}
          width={160}
          height={124}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-11 w-14 shrink-0 rounded-md object-cover ring-1 ring-white/12"
        />
      ) : Icon ? (
        <span className="flex h-11 w-14 shrink-0 items-center justify-center rounded-md border border-line-cyan bg-accent-subtle text-ink-accent">
          <Icon size={22} />
        </span>
      ) : null}
      <span className="min-w-0">
        <span className="block text-base leading-5 font-semibold">{item.label}</span>
        {item.description && <span className="block text-[13px] leading-[18px] text-ink-muted">{item.description}</span>}
      </span>
    </Link>
  );
}
