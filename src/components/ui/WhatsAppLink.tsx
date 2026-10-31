import type { ReactNode } from "react";
import { MailIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { CopyMessageButton } from "@/components/ui/CopyMessageButton";
import { buttonClass, type ButtonSize } from "@/components/ui/links";
import {
  ctaLabels,
  mailtoHref,
  phoneHref,
  site,
  waMessages,
  whatsappHref,
} from "@/config/site";
import { umami } from "@/lib/analytics";
import { cn } from "@/lib/cn";

/**
 * Enlaces de contacto con su evento de Umami: WhatsApp (con el mensaje ya
 * escrito), llamada y correo. Son `<a>` reales: funcionan sin JavaScript.
 *
 * Variantes:
 * - primary   botón de marca (gradient-action) con el glifo verde de WhatsApp.
 * - secondary botón claro con borde (o oscuro dentro de data-theme="dark").
 * - onPhoto   contorno blanco sobre foto o sección oscura.
 * - inline    enlace de texto con glifo, para párrafos y listas.
 */
export type ContactVariant = "primary" | "secondary" | "onPhoto" | "inline";

// Enlace de texto: 44px de área táctil sin cambiar el aspecto (relleno y margen negativo).
const inlineClass =
  "-my-3 inline-flex items-center gap-2 py-3 font-semibold text-ink-brand underline decoration-1 underline-offset-[3px] transition-colors hover:decoration-2";

function classFor(variant: ContactVariant, size: ButtonSize, block: boolean, className?: string) {
  if (variant === "inline") return cn(inlineClass, className);
  return buttonClass({ variant, size, block, className });
}

const glyphSize: Record<ButtonSize, number> = { sm: 18, md: 20, lg: 22, xl: 24 };

export interface WhatsAppLinkProps {
  /** Mensaje precargado (ver `waMessages` en site.ts). */
  message?: string;
  /** Texto visible. Por defecto, «Escríbanos por WhatsApp». */
  children?: ReactNode;
  variant?: ContactVariant;
  size?: ButtonSize;
  /** Ubicación para Umami: `portada`, `cierre`, `sector-<slug>`, `servicio-<slug>`… */
  ubicacion: string;
  /** Evento de Umami. Por defecto `whatsapp` (o `visita-tecnica`, `compartir-junta`…). */
  event?: string;
  /** Añade «Copiar el mensaje» al lado (solo escritorio, solo con JS). */
  copy?: boolean;
  block?: boolean;
  className?: string;
  /** Enlace completo ya calculado (p. ej. `whatsappShareHref(...)` para compartir). */
  href?: string;
}

export function WhatsAppLink({
  message = waMessages.general,
  children = ctaLabels.whatsapp,
  variant = "primary",
  size = "md",
  ubicacion,
  event = "whatsapp",
  copy = false,
  block = false,
  className,
  href,
}: WhatsAppLinkProps) {
  const url = href ?? whatsappHref(message);
  const external = url.startsWith("http");
  // Glifo: verde del logotipo sobre marca/oscuro; verde oscuro sobre claro.
  const tone = variant === "primary" || variant === "onPhoto" ? "brand" : "deep";
  const link = (
    <a
      href={url}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...umami(event, { ubicacion })}
      className={classFor(variant, size, block, copy ? undefined : className)}
    >
      <WhatsAppIcon size={variant === "inline" ? 18 : glyphSize[size]} tone={tone} />
      <span>{children}</span>
      {external && <span className="sr-only"> (abre WhatsApp)</span>}
    </a>
  );
  if (!copy) return link;
  return (
    <span className={cn("inline-flex flex-wrap items-center gap-3", block && "w-full sm:w-auto", className)}>
      {link}
      <CopyMessageButton text={message} ubicacion={ubicacion} size={size === "xl" ? "lg" : size} />
    </span>
  );
}

/**
 * Llamar por teléfono (`tel:`), con evento `telefono`. El número no se
 * escribe en el botón (decisión del cliente): lo lleva el `title` (se ve al
 * pasar el ratón) y el lector de pantalla lo lee junto a «Llamar». El número
 * a la vista queda para el pie, /contacto y los documentos imprimibles.
 */
export function CallLink({
  phone = site.phone,
  children,
  variant = "secondary",
  size = "md",
  ubicacion,
  event = "telefono",
  block = false,
  className,
}: {
  phone?: string;
  /** Por defecto, «Llamar». */
  children?: ReactNode;
  variant?: ContactVariant;
  size?: ButtonSize;
  ubicacion: string;
  /** Evento de Umami. Por defecto `telefono` (o `cotizador-llamada`). */
  event?: string;
  block?: boolean;
  className?: string;
}) {
  const href = phoneHref(phone);
  if (!href) return null;
  return (
    <a
      href={href}
      title={`Llamar al ${phone}`}
      {...umami(event, { ubicacion })}
      className={classFor(variant, size, block, className)}
    >
      <PhoneIcon size={variant === "inline" ? 18 : glyphSize[size]} />
      <span>{children ?? ctaLabels.llamar}</span>
      {children === undefined && <span className="sr-only"> al {phone}</span>}
    </a>
  );
}

/** Correo ya redactado (`mailto:` con asunto y cuerpo). */
export function MailLink({
  to = site.salesEmail,
  subject,
  body,
  children,
  variant = "secondary",
  size = "md",
  ubicacion,
  event = "correo",
  block = false,
  className,
}: {
  to?: string;
  subject: string;
  body?: string;
  children: ReactNode;
  variant?: ContactVariant;
  size?: ButtonSize;
  ubicacion: string;
  /** `correo`, `propuesta-formal`, `kit-solicitud`… */
  event?: string;
  block?: boolean;
  className?: string;
}) {
  return (
    <a
      href={mailtoHref({ to, subject, body })}
      {...umami(event, { ubicacion })}
      className={classFor(variant, size, block, className)}
    >
      <MailIcon size={variant === "inline" ? 18 : glyphSize[size]} />
      <span>{children}</span>
    </a>
  );
}
