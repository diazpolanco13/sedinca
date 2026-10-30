import type { ButtonSize } from "@/components/ui/links";
import { WhatsAppLink, type ContactVariant } from "@/components/ui/WhatsAppLink";
import { absoluteUrl, ctaLabels, routes, waShareJunta, whatsappShareHref } from "@/config/site";

/** Enlace del resumen para la asamblea (con barra final, para compartir). */
export const resumenUrl = absoluteUrl(routes.resumen);

/**
 * «Enviar a la junta por WhatsApp»: abre WhatsApp sin destinatario con el
 * texto «Les comparto esta propuesta de vigilancia para el conjunto: <url>»
 * (8.8). Evento `compartir-junta`.
 */
export function JuntaShareLink({
  ubicacion,
  variant = "primary",
  size = "lg",
  block = false,
  className,
  children = ctaLabels.compartirJunta,
}: {
  ubicacion: string;
  variant?: ContactVariant;
  size?: ButtonSize;
  block?: boolean;
  className?: string;
  children?: string;
}) {
  return (
    <WhatsAppLink
      href={whatsappShareHref(waShareJunta(resumenUrl))}
      message={waShareJunta(resumenUrl)}
      event="compartir-junta"
      ubicacion={ubicacion}
      variant={variant}
      size={size}
      block={block}
      className={className}
    >
      {children}
    </WhatsAppLink>
  );
}
