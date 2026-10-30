import type { ReactNode } from "react";
import { ActionLink } from "@/components/ui/ActionLink";
import type { ButtonSize } from "@/components/ui/links";
import type { CtaAction } from "@/config/site";

/**
 * Botones de la portada interior, dentro de la entradilla de `PageHero`
 * (que hoy solo admite enlaces internos sin glifo ni evento). Solo pinta
 * elementos de frase (`<span>`, `<a>`, `<button>`), así que es HTML válido
 * dentro del `<p>` de la entradilla.
 *
 * Principal: botón de marca; secundario: contorno blanco sobre la foto. Desde
 * 1024px la fila puede ser más ancha que la entradilla (620px) para que
 * etiquetas largas («Solicitar propuesta técnica y económica») quepan en una
 * sola fila; por debajo, los botones bajan de línea.
 */
export function HeroActions({
  actions,
  size = "lg",
  children,
}: {
  actions?: readonly CtaAction[];
  size?: ButtonSize;
  children?: ReactNode;
}) {
  const [primary, secondary] = actions ?? [];
  return (
    <span className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 lg:w-[720px]">
      {primary && <ActionLink action={primary} variant="primary" size={size} block />}
      {secondary && <ActionLink action={secondary} variant="onPhoto" size={size} block />}
      {children}
    </span>
  );
}

/** Entradilla de portada: mensaje que conecta, descripción y botones. */
export function HeroLead({
  hook,
  text,
  children,
}: {
  hook?: string;
  text: ReactNode;
  children?: ReactNode;
}) {
  return (
    <>
      {hook && (
        <span className="mb-3 block font-display text-[clamp(22px,2.4vw,30px)] leading-[1.2] font-semibold tracking-[-0.01em] text-white">
          {hook}
        </span>
      )}
      <span className="block">{text}</span>
      {children}
    </>
  );
}
