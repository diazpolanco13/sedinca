"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { whatsappHref } from "@/config/site";
import { umami } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { CONTACT_ZONE_CLASS } from "./contactZone";
import { routeContext } from "./routeContext";
import { usePastHero } from "./usePastHero";

/** Zonas que ya ofrecen WhatsApp a la vista: el cierre (CtaBand) y el pie. */
const CONTACT_ZONES = `.${CONTACT_ZONE_CLASS}, footer`;

/** ¿Hay en pantalla alguna zona que ya ofrece WhatsApp (cierre, pie)? */
function useContactZoneVisible() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const zones = document.querySelectorAll(CONTACT_ZONES);
    if (zones.length === 0) return;
    const onScreen = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) onScreen.add(entry.target);
        else onScreen.delete(entry.target);
      }
      setVisible(onScreen.size > 0);
    });
    zones.forEach((zone) => observer.observe(zone));
    return () => {
      observer.disconnect();
      setVisible(false);
    };
  }, [pathname]);

  return visible;
}

/**
 * Botón flotante de WhatsApp, solo desde 1440px, con el mensaje de la página
 * (11.6). La ruta ya se conoce al exportar, así que el enlace funciona sin
 * JavaScript.
 *
 * - Desde 1440px el margen lateral del contenido mide 80px y el botón (56px
 *   a 24px del borde) cabe en él. Entre 1024 y 1439px taparía el borde
 *   derecho del contenido (acordeones, flechas de tarjetas, campos): ahí lo
 *   sustituye el icono del encabezado compacto (SiteHeader) y, en móvil, la
 *   barra inferior.
 * - Aparece al pasar los botones de la portada (que ya ofrecen WhatsApp) y
 *   se retira mientras se ve el cierre (CtaBand) o el pie: nunca tapa la
 *   franja de hechos ni duplica un botón que está en pantalla.
 * - Círculo de 56px con el glifo oficial sobre botón de marca (excepción
 *   documentada en BRAND.md); la etiqueta «WhatsApp» aparece al pasar el
 *   ratón o con el foco, para no tapar los controles del borde derecho.
 * - Sin JavaScript se ve siempre (regla en <noscript>); con «reducir
 *   movimiento», aparece sin desplazarse.
 */
export function WhatsAppButton() {
  const pathname = usePathname();
  const past = usePastHero(72, "actions");
  const covered = useContactZoneVisible();
  const shown = past && !covered;
  const ctx = routeContext(pathname);
  const empleo = ctx.kind === "empleo";
  const href = whatsappHref(ctx.whatsapp);
  const external = href.startsWith("http");

  return (
    <>
      <noscript>
        <style>{".sd-wa-float{visibility:visible!important;opacity:1!important;translate:none!important}"}</style>
      </noscript>
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...umami(empleo ? "postulacion-whatsapp" : "whatsapp", { ubicacion: "flotante" })}
        aria-label={empleo ? "Postular por WhatsApp" : "Escríbanos por WhatsApp"}
        className={cn(
          "sd-wa-float on-dark group fixed right-6 bottom-6 z-40 hidden h-14 min-w-14 items-center justify-center rounded-full bg-[image:var(--gradient-action)] p-1.5 font-display text-base leading-6 font-semibold tracking-[0.02em] text-on-brand no-underline shadow-cta transition-[opacity,translate,visibility,filter,box-shadow] duration-300 ease-out hover:text-on-brand hover:brightness-110 hover:shadow-cta-hover focus-visible:text-on-brand motion-reduce:transition-none min-[90rem]:inline-flex",
          shown ? "visible translate-y-0 opacity-100" : "invisible translate-y-4 opacity-0",
        )}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-azure-950/40">
          <WhatsAppIcon size={24} tone="brand" />
        </span>
        <span aria-hidden="true" className="hidden pr-4 pl-2.5 group-hover:inline group-focus-visible:inline">
          WhatsApp
        </span>
      </a>
    </>
  );
}
