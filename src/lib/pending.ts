import { hasPending, showPending } from "@/config/site";

/**
 * Textos con pendientes.
 *
 * Un texto puede ser una cadena o una lista de frases. Cada frase es atómica:
 * si contiene un [MARCADOR], en producción se omite la frase entera (nunca se
 * publica a medias) y en modo revisión (`NEXT_PUBLIC_SHOW_PENDING=1`) se
 * muestra resaltada. Así, «Ningún puesto queda solo. […] [Si un oficial falta
 * sin aviso, cubrimos el puesto en TIEMPO DE REEMPLAZO.]» publica las frases
 * confirmadas y oculta la condicional.
 *
 * Para un dato sin confirmar que no tiene hueco (p. ej. «visitas sin previo
 * aviso»), se añade al final de la frase un marcador descriptivo:
 * «… con visitas sin previo aviso. [CONFIRMAR VISITAS SIN AVISO]».
 */
export type Sentences = string | readonly string[];

function toList(text: Sentences): readonly string[] {
  return typeof text === "string" ? [text] : text;
}

/** Frases que se muestran en el modo actual (producción o revisión). */
export function visibleSentences(text: Sentences): string[] {
  const list = toList(text).filter((s) => s.trim() !== "");
  return showPending ? [...list] : list.filter((s) => !hasPending(s));
}

/** Frases publicables, sea cual sea el modo (metadatos, JSON-LD, mensajes). */
export function publishedSentences(text: Sentences): string[] {
  return toList(text).filter((s) => s.trim() !== "" && !hasPending(s));
}

/** Texto plano visible en el modo actual. */
export function visibleText(text: Sentences): string {
  return visibleSentences(text).join(" ");
}

/** Texto plano publicable (sin frases pendientes), en cualquier modo. */
export function publishedText(text: Sentences): string {
  return publishedSentences(text).join(" ");
}

/** ¿Queda algo que mostrar en el modo actual? */
export function isVisible(text: Sentences): boolean {
  return visibleSentences(text).length > 0;
}

/** ¿Alguna frase del texto tiene marcadores? */
export function anyPending(text: Sentences | readonly Sentences[]): boolean {
  const flat = (typeof text === "string" ? [text] : text).flatMap((t) => toList(t));
  return flat.some(hasPending);
}

/**
 * Filtra una lista: en producción quita los elementos cuyos campos elegidos
 * tengan algún [MARCADOR]; en modo revisión los deja todos (y el componente
 * los pinta resaltados).
 *
 * `filterPending(focus, (f) => f)` · `filterPending(docs, (d) => [d.name, d.note])`
 */
export function filterPending<T>(
  items: readonly T[],
  pick: (item: T) => Sentences | readonly Sentences[],
): T[] {
  if (showPending) return [...items];
  return items.filter((item) => !anyPending(pick(item)));
}

/** Divide un texto en trozos normales y [MARCADORES] (para resaltarlos). */
export function splitMarkers(sentence: string): { text: string; marker: boolean }[] {
  return sentence
    .split(/(\[[^\]\n]+\])/g)
    .filter((part) => part !== "")
    .map((part) => ({ text: part, marker: /^\[[^\]\n]+\]$/.test(part) }));
}
