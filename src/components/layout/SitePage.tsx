import type { ReactNode } from "react";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

/**
 * Estructura común: «Saltar al contenido», encabezado sobre la portada,
 * contenido (`<main id="contenido">`, cuyo primer hijo debe ser la portada:
 * Hero o PageHero), pie y barra de contacto de móvil. El hueco inferior para
 * la barra lo deja el propio pie.
 */
export function SitePage({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:rounded-(--radius) focus:bg-surface focus:px-4 focus:py-3 focus:font-display focus:text-sm focus:font-semibold focus:text-ink-brand focus:shadow-elevation-3"
      >
        Saltar al contenido
      </a>
      <SiteHeader />
      <main id="contenido" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <SiteFooter />
      <MobileActionBar />
    </div>
  );
}
