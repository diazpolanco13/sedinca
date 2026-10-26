import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

/** Estructura común: encabezado sobre la portada, contenido y pie. */
export function SitePage({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
