import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { buttonClass, type ButtonSize, type ButtonVariant } from "@/components/ui/links";

export type { ButtonSize, ButtonVariant } from "@/components/ui/links";

interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** A lo ancho en móvil. */
  block?: boolean;
}

/** ¿Enlace que no gestiona el enrutador de Next? (externo, tel:, mailto:, ancla). */
export function isExternalHref(href: string) {
  return /^(https?:|mailto:|tel:|#)/.test(href);
}

/**
 * Enlace con aspecto de botón. Rutas internas con `next/link` y
 * `prefetch={false}` (regla de rendimiento: menú, pie y tarjetas no
 * precargan). Enlaces http(s) en ventana nueva; `tel:`, `mailto:` y anclas
 * como `<a>` normal.
 */
export function ButtonLink({
  href,
  variant,
  size,
  block,
  className,
  children,
  ...props
}: ButtonStyleProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string; children: ReactNode }) {
  const cls = buttonClass({ variant, size, block, className });
  if (isExternalHref(href)) {
    const newTab = /^https?:/.test(href);
    return (
      <a
        href={href}
        className={cls}
        {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...props}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} prefetch={false} className={cls} {...props}>
      {children}
    </Link>
  );
}

/** Botón real (`<button>`), con las mismas variantes. */
export function Button({
  variant,
  size,
  block,
  className,
  type = "button",
  ...props
}: ButtonStyleProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={buttonClass({ variant, size, block, className })} {...props} />;
}
