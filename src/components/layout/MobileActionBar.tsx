"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ClipboardCheckIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { ctaLabels, phoneHref, whatsappHref } from "@/config/site";
import { umami } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { quoteAction, routeContext, type QuoteAction } from "./routeContext";
import { usePastHero } from "./usePastHero";

/** Alto de la barra (sin la zona segura). El pie añade este espacio abajo en móvil. */
export const MOBILE_BAR_HEIGHT = 56;

const UBICACION = "barra-movil";

/*
 * Barra fija inferior de móvil (propuesta, 0.5 y 5.3): «Llamar · WhatsApp ·
 * Cotizar», azure-950 opaca al 96 % y sin desenfoque (los Android de gama
 * baja dan tirones con backdrop-filter), 56px más la zona segura del iPhone.
 *
 * - Aparece al pasar los botones de la portada (IntersectionObserver sobre
 *   `[data-hero-actions]`, o la portada entera si no los hay). Sin JavaScript se ve
 *   siempre (regla en <noscript>), para no dejar al visitante sin contacto.
 * - El mensaje de WhatsApp depende de la ruta (waMessages). «Cotizar» lleva
 *   siempre al diagnóstico con el contexto de la página (`/cotizar/?sector=…`),
 *   como el «Cotizar» del encabezado: en petróleo e industria el diagnóstico
 *   entra en la rama de empresa, que termina en la propuesta por correo.
 * - En /empleo cambia a «Postular por WhatsApp · Requisitos».
 * - Solo por debajo de 1024px; en escritorio está el botón flotante.
 */
export function MobileActionBar() {
  const pathname = usePathname();
  // Entra en cuanto los botones de la portada dejan de verse (no al pasar
  // la portada entera): en portadas altas no queda un tramo sin acciones.
  const past = usePastHero(72, "actions");
  const ctx = routeContext(pathname);
  const tel = phoneHref();

  let items: ReactNode;
  if (ctx.kind === "empleo") {
    items = (
      <>
        <BarLink
          href={whatsappHref(ctx.whatsapp)}
          event="postulacion-whatsapp"
          tone="primary"
          icon={<WhatsAppIcon size={20} tone="brand" />}
        >
          {ctaLabels.postular}
        </BarLink>
        <BarLink href="#requisitos" icon={<ClipboardCheckIcon size={20} />} px="px-3">
          Requisitos
        </BarLink>
      </>
    );
  } else {
    const quote = ctx.kind === "cotizar" ? null : quoteAction(ctx, UBICACION);
    items = (
      <>
        {tel && (
          <BarLink href={tel} event="telefono" icon={<PhoneIcon size={20} />}>
            {ctaLabels.llamar}
          </BarLink>
        )}
        <BarLink
          href={whatsappHref(ctx.whatsapp)}
          event="whatsapp"
          icon={<WhatsAppIcon size={20} tone="brand" />}
          className={cn(!quote && "col-span-2")}
        >
          WhatsApp
        </BarLink>
        {quote && <QuoteLink action={quote} />}
      </>
    );
  }

  return (
    <>
      <noscript>
        <style>{".sd-mobile-bar{visibility:visible!important;translate:none!important}"}</style>
      </noscript>
      <nav
        aria-label="Contacto rápido"
        className={cn(
          "sd-mobile-bar fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-azure-950/96 pb-[env(safe-area-inset-bottom)] text-white shadow-[0_-8px_24px_color-mix(in_srgb,var(--azure-950)_30%,transparent)] transition-[translate,visibility] duration-300 ease-out lg:hidden",
          past ? "visible translate-y-0" : "invisible translate-y-full",
        )}
      >
        <div
          className={cn(
            "on-dark grid h-14 gap-1.5 px-2 py-1.5",
            ctx.kind === "empleo" ? "grid-cols-[minmax(0,1fr)_auto]" : "grid-cols-3",
          )}
        >
          {items}
        </div>
      </nav>
    </>
  );
}

/*
 * Por debajo de 380px (Android de 360px, iPhone SE y mini a 375px) cada
 * columna mide unos 111–116px: relleno y hueco mínimos y texto de 14px para
 * que «WhatsApp» y «Postular por WhatsApp» quepan sin cortarse.
 */
const itemClass =
  "flex h-full min-w-0 items-center justify-center gap-1.5 rounded-(--radius) font-display text-[15px] leading-5 font-semibold tracking-normal no-underline transition-[filter,background-color] active:scale-[0.98] max-[379px]:text-sm";
const toneClass = {
  plain: "text-white hover:bg-white/8 hover:text-white",
  primary:
    "bg-[image:var(--gradient-action)] text-on-brand shadow-inset-highlight hover:text-on-brand hover:brightness-110",
} as const;

function BarLink({
  href,
  event,
  icon,
  tone = "plain",
  px = "px-1",
  className,
  children,
}: {
  href: string;
  /** Evento de Umami (si no, solo navega). */
  event?: string;
  icon: ReactNode;
  tone?: keyof typeof toneClass;
  /** Relleno lateral (aparte de `className`: `cn` no fusiona clases). */
  px?: string;
  className?: string;
  children: ReactNode;
}) {
  const cls = cn(itemClass, px, toneClass[tone], className);
  const tracking = event ? umami(event, { ubicacion: UBICACION }) : {};
  if (/^(https?:|tel:|mailto:|#)/.test(href)) {
    const external = /^https?:/.test(href);
    return (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...tracking}
        className={cls}
      >
        {icon}
        <span className="truncate">{children}</span>
        {external && <span className="sr-only"> (abre WhatsApp)</span>}
      </a>
    );
  }
  return (
    <Link href={href} prefetch={false} {...tracking} className={cls}>
      {icon}
      <span className="truncate">{children}</span>
    </Link>
  );
}

function QuoteLink({ action }: { action: QuoteAction }) {
  return (
    <BarLink href={action.href} event={action.event} tone="primary" icon={null}>
      {action.label}
    </BarLink>
  );
}
