import Link from "next/link";
import type { ReactNode } from "react";
import { primaryLink } from "@/components/ui/links";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { routes } from "@/config/site";

/** Banda final de página (fondo hundido) con contenido a la izquierda y CTA a la derecha. */
export function CtaBand({
  label,
  eyebrow,
  children,
  cta = { label: "Solicitar cotización", href: routes.contact },
}: {
  /** Nombre accesible de la sección. */
  label: string;
  eyebrow: string;
  children: ReactNode;
  cta?: { label: string; href: string };
}) {
  return (
    <section aria-label={label} className="bg-surface-sunken">
      <div className="mx-auto flex max-w-[1344px] flex-wrap items-center justify-between gap-8 px-4 py-14 sm:px-8 lg:py-[72px]">
        <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-4">
          <Eyebrow>{eyebrow}</Eyebrow>
          {children}
        </div>
        <Link
          href={cta.href}
          className={`${primaryLink} h-[52px] px-8 text-base shadow-[var(--inset-highlight),var(--glow-cyan)]`}
        >
          {cta.label}
        </Link>
      </div>
    </section>
  );
}
