import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRightIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/Button";
import type { ButtonSize } from "@/components/ui/links";
import { CallLink, MailLink, WhatsAppLink, type ContactVariant } from "@/components/ui/WhatsAppLink";
import type { CtaAction } from "@/config/site";
import { umami } from "@/lib/analytics";
import { cn } from "@/lib/cn";

/**
 * Pinta una `CtaAction` (dato de site.ts / sectors.ts) con el componente que
 * le toca: WhatsApp, llamada, correo o enlace interno.
 */
export function ActionLink({
  action,
  variant = "primary",
  size = "md",
  block = false,
  className,
}: {
  action: CtaAction;
  variant?: ContactVariant;
  size?: ButtonSize;
  block?: boolean;
  className?: string;
}) {
  switch (action.kind) {
    case "whatsapp":
      return (
        <WhatsAppLink
          message={action.message}
          ubicacion={action.ubicacion}
          event={action.event}
          variant={variant}
          size={size}
          block={block}
          className={className}
        >
          {action.label}
        </WhatsAppLink>
      );
    case "call":
      return (
        <CallLink
          phone={action.phone}
          ubicacion={action.ubicacion}
          variant={variant}
          size={size}
          block={block}
          className={className}
        >
          {action.label}
        </CallLink>
      );
    case "mail":
      return (
        <MailLink
          to={action.to}
          subject={action.subject}
          body={action.body}
          ubicacion={action.ubicacion}
          event={action.event}
          variant={variant}
          size={size}
          block={block}
          className={className}
        >
          {action.label}
        </MailLink>
      );
    case "link": {
      const tracking = action.event ? umami(action.event, { ubicacion: action.ubicacion }) : {};
      if (variant === "inline") {
        return (
          <Link
            href={action.href}
            prefetch={false}
            {...tracking}
            className={cn(
              // 44px de área táctil sin cambiar el aspecto (relleno y margen negativo).
              "group -my-3 inline-flex items-center gap-1.5 py-3 font-display font-semibold text-ink-brand no-underline hover:underline",
              className,
            )}
          >
            {action.label}
            <ArrowRightIcon
              size={16}
              className="flex-none transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
            />
          </Link>
        );
      }
      return (
        <ButtonLink
          href={action.href}
          variant={variant}
          size={size}
          block={block}
          className={className}
          {...tracking}
        >
          {action.label}
        </ButtonLink>
      );
    }
  }
}

/**
 * Grupo de acciones en orden de importancia: la primera como botón
 * principal, la segunda como secundario y el resto como enlaces de texto
 * («Llamar», como botón pequeño con icono).
 * `tone` adapta el secundario: `light` (borde), `dark` y `photo` (contorno
 * blanco). Si un botón trae `note` (p. ej. el diagnóstico: «4 preguntas ·
 * sin compromiso»), se pinta debajo, centrada.
 */
export function ActionGroup({
  actions,
  tone = "light",
  size = "md",
  block = true,
  className,
}: {
  actions: readonly CtaAction[];
  tone?: "light" | "dark" | "photo";
  size?: ButtonSize;
  /** Botones a lo ancho en móvil. */
  block?: boolean;
  className?: string;
}) {
  const [primary, secondary, ...rest] = actions;
  const secondaryVariant: ContactVariant = tone === "light" ? "secondary" : "onPhoto";
  const noteClass = tone === "photo" ? "text-white/75" : "text-ink-muted";
  const withNote = (action: CtaAction, button: ReactNode) => {
    const note = action.kind === "link" ? action.note : undefined;
    if (!note) return button;
    return (
      <span className={cn("flex flex-col items-center gap-1.5", block && "w-full sm:w-auto")}>
        {button}
        <span className={cn("text-[13px] leading-[18px]", noteClass)}>{note}</span>
      </span>
    );
  };
  const hasNote = [primary, secondary].some((a) => a?.kind === "link" && a.note);
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className={cn("flex flex-wrap gap-3 sm:gap-4", hasNote ? "items-start" : "items-center")}>
        {primary && withNote(primary, <ActionLink action={primary} variant="primary" size={size} block={block} />)}
        {secondary &&
          withNote(secondary, <ActionLink action={secondary} variant={secondaryVariant} size={size} block={block} />)}
      </div>
      {rest.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[15px]">
          {rest.map((action) =>
            // Llamar: botón pequeño con icono, sin el número escrito.
            action.kind === "call" ? (
              <ActionLink key={action.label} action={action} variant={secondaryVariant} size="sm" />
            ) : (
              <span key={action.label} className={cn(tone !== "light" && "[&_a]:text-cyan-200")}>
                <ActionLink action={action} variant="inline" />
              </span>
            ),
          )}
        </div>
      )}
    </div>
  );
}
