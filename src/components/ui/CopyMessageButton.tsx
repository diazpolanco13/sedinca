"use client";

import { useState, useSyncExternalStore } from "react";
import { CheckIcon, CopyIcon } from "@/components/icons";
import { buttonClass, type ButtonSize, type ButtonVariant } from "@/components/ui/links";
import { umami } from "@/lib/analytics";

const subscribe = () => () => {};

/**
 * «Copiar el mensaje»: alternativa en escritorio sin WhatsApp Web (15.1). Copia
 * el texto al portapapeles para pegarlo en el teléfono o en un correo.
 * Solo existe con JavaScript (no se pinta en el HTML estático) y, por defecto,
 * solo desde 1024px.
 */
export function CopyMessageButton({
  text,
  ubicacion,
  label = "Copiar el mensaje",
  variant = "ghost",
  size = "md",
  desktopOnly = true,
  className,
}: {
  text: string;
  ubicacion: string;
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  desktopOnly?: boolean;
  className?: string;
}) {
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const [copied, setCopied] = useState(false);
  if (!hydrated) return null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "absolute";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  }

  const button = (
    <button
      type="button"
      onClick={copy}
      {...umami("whatsapp-copiar", { ubicacion })}
      className={buttonClass({ variant, size, className })}
    >
      {copied ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
      {copied ? "Mensaje copiado" : label}
      <span className="sr-only" aria-live="polite">
        {copied ? "El mensaje se copió al portapapeles." : ""}
      </span>
    </button>
  );
  return desktopOnly ? <span className="hidden lg:inline-flex">{button}</span> : button;
}
