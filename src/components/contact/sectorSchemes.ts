import type { SectorSchemes } from "@/components/contact/diagnostico";
import { sectorsContent } from "@/content/sectors";
import { publishedText } from "@/lib/pending";

/**
 * «Por qué» de cada servicio en cada sector (`sector.scheme`), ya sin frases
 * pendientes. Solo para componentes de servidor: el resultado (cadenas
 * limpias) se pasa como prop al diagnóstico, que es de cliente.
 */
export function sectorSchemes(): SectorSchemes {
  const out: SectorSchemes = {};
  for (const sector of sectorsContent) {
    const byService: Record<string, string> = {};
    for (const item of sector.scheme) {
      const why = publishedText(item.why);
      if (why) byService[item.service] = why;
    }
    out[sector.id] = byService;
  }
  return out;
}
