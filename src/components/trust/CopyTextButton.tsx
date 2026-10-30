"use client";

import { useState, useSyncExternalStore } from "react";
import { CheckIcon, CopyIcon } from "@/components/icons";
import { buttonClass, type ButtonSize, type ButtonVariant } from "@/components/ui/links";
import { umami } from "@/lib/analytics";

const subscribe = () => () => {};

/**
 * Copia un texto ya publicable (la ficha de proveedor, el correo de la
 * propuesta) al portapapeles. Solo existe con JavaScript: no se pinta en el
 * HTML estático. Reciba siempre texto sin [MARCADORES] (`publishedText`).
 */
export function CopyTextButton({
  text,
  label,
  copiedLabel = "Copiado",
  announce = "El texto se copió al portapapeles.",
  variant = "secondary",
  size = "md",
  event,
  ubicacion,
  className,
}: {
  text: string;
  label: string;
  copiedLabel?: string;
  announce?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Evento de Umami (opcional). */
  event?: string;
  ubicacion?: string;
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

  return (
    <button
      type="button"
      onClick={copy}
      {...(event ? umami(event, { ubicacion }) : {})}
      className={buttonClass({ variant, size, className })}
    >
      {copied ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
      <span>{copied ? copiedLabel : label}</span>
      <span className="sr-only" aria-live="polite">
        {copied ? announce : ""}
      </span>
    </button>
  );
}
