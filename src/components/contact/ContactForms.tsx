"use client";

import { useState, type ReactNode } from "react";
import type { SectorSchemes } from "@/components/contact/diagnostico";
import { QuoteForm } from "@/components/contact/QuoteForm";
import { QuoteWizard } from "@/components/contact/QuoteWizard";
import { cn } from "@/lib/cn";

/* Etiquetas cortas: en móvil caben en una línea cada una. */
const modes = [
  { id: "diagnostico", label: "Diagnóstico" },
  { id: "formulario", label: "Mensaje libre" },
] as const;

type Mode = (typeof modes)[number]["id"];

/**
 * Contacto (8.3): el diagnóstico guiado insertado y, a un toque, el
 * formulario breve para quien prefiere escribirlo con sus palabras. Ambos
 * terminan en WhatsApp con el mensaje ya escrito. Sin JavaScript no
 * funcionan: `data-wizard` deja que el aviso <noscript> los oculte.
 */
export function ContactForms({
  schemes,
  priceNote,
}: {
  schemes?: SectorSchemes;
  priceNote?: ReactNode;
}) {
  const [mode, setMode] = useState<Mode>("diagnostico");
  return (
    <div data-wizard="" className="flex flex-col gap-5">
      <div
        role="group"
        aria-label="Cómo prefiere contarnos lo que necesita"
        className="flex w-full rounded-xl border border-line bg-surface-sunken p-1 sm:w-fit"
      >
        {modes.map((m) => (
          <button
            key={m.id}
            type="button"
            aria-pressed={mode === m.id}
            onClick={() => setMode(m.id)}
            className={cn(
              "min-h-11 flex-1 cursor-pointer rounded-lg border-0 px-4 py-2 font-display text-sm leading-5 font-semibold tracking-[0.02em] whitespace-nowrap transition-[background-color,color,box-shadow] sm:flex-none sm:px-6",
              mode === m.id
                ? "bg-surface text-ink shadow-elevation-1"
                : "bg-transparent text-ink-muted hover:text-ink",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>
      {mode === "diagnostico" ? (
        <QuoteWizard ubicacion="contacto" headingLevel={3} schemes={schemes} priceNote={priceNote} />
      ) : (
        <QuoteForm ubicacion="contacto" headingLevel={3} title="Escríbalo con sus palabras" />
      )}
    </div>
  );
}
