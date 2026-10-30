import { site } from "@/config/site";

/**
 * Hechos y cifras de la empresa para `<FactStrip>` y `<FigureStrip>`.
 * Las cifras son estáticas (sin contadores animados) y, mientras sean
 * [MARCADORES], no se publican.
 */

export interface Fact {
  id: string;
  text: string;
}

/** Franja de hechos de la portada (7.1). Sustituye a «Pilares». */
export const heroFacts: Fact[] = [
  { id: "rif", text: `RIF ${site.rifDisplay}` },
  { id: "oficina", text: "Oficina en el Centro Empresarial Grupo Assper, Maracaibo" },
  { id: "no-armado", text: "Servicio preventivo no armado" },
  { id: "supervision", text: "Supervisión en sitio" },
  { id: "libro", text: "Libro de novedades en cada puesto" },
];

export interface Figure {
  id: string;
  value: string;
  label: string;
}

/** Cifras de SEDIN: solo con confirmación escrita y fecha. */
export const companyFigures: Figure[] = [
  { id: "oficiales", value: "[Nº DE OFICIALES ACTIVOS]", label: "oficiales de seguridad" },
  { id: "puestos", value: "[Nº DE PUESTOS]", label: "puestos protegidos en el Zulia" },
  { id: "desde", value: "Desde [AÑO DE INICIO]", label: "protegiendo operaciones en el Zulia" },
];

/** Fuente de las cifras (va debajo, en pequeño). */
export const figuresSource = "Datos de SEDIN, [MES Y AÑO]";
