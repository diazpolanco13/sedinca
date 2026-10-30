import { CameraIcon, GuardIcon, IdCardIcon, TargetIcon } from "@/components/icons";
import { ctaLabels, routes, type CtaAction, type SectorSlug } from "@/config/site";
import { answers, noArmado, qualitySystem, type AnswerId } from "@/content/answers";
import type { FaqId } from "@/content/faq";
import type { SectorContent } from "@/content/sectors";
import type { ServiceContent } from "@/content/services";

/*
 * Decisiones de presentación de las páginas de sector (no son contenido: los
 * textos viven en src/content/*). Si la Dirección lo prefiere, los recortes y
 * las preguntas extra pueden pasar a sectors.ts.
 */

/**
 * Recorte de las fotos de IA en formatos verticales o cuadrados (tarjetas y
 * bloque grande). Se usa `sector.photo.position` cuando existe; si no, este
 * recorte, para que el oficial quede dentro del encuadre:
 * - petróleo: el oficial, de espaldas, está a la izquierda (≈12–44 % del ancho).
 * - industria: el oficial con la planilla está a la izquierda.
 * - comercio: el oficial a la izquierda y la entrega de la credencial al centro.
 * - condominios: el oficial (al 30–50 % del ancho) queda hacia el centro.
 */
const photoCrop: Partial<Record<SectorSlug, string>> = {
  "petroleo-y-energia": "object-[22%_center]",
  "industria-y-logistica": "object-[20%_center]",
  "comercio-y-oficinas": "object-[24%_center]",
  condominios: "object-[28%_center]",
};

export function sectorPhoto(sector: SectorContent) {
  return {
    src: sector.photo.src,
    position: sector.photo.position ?? photoCrop[sector.id],
    portrait: sector.photo.portrait,
  };
}

/**
 * Miniatura del sector (160×124, unos 3 KB): el mismo recorte que usa el menú
 * «Soluciones» (`public/assets/menu/`), seguro también para petróleo y comercio.
 */
export function sectorThumb(slug: SectorSlug) {
  return `/assets/menu/${slug}.webp`;
}

/**
 * Tarjetas `PhotoCard` en cuadrícula 2×2 por debajo de 640px (más verticales,
 * sin el icono, titular y texto más pequeños), como el selector de Inicio.
 * Selectores descendentes sobre la estructura de PhotoCard: si cambia, en
 * móvil la tarjeta vuelve a su aspecto por defecto, sin romperse.
 */
export const photoCardMobile = [
  // overflow-clip (no hidden): con aspect-ratio, un texto que no cabe en el 3:4
  // hace crecer la tarjeta en vez de quedar cortado.
  "max-sm:aspect-[3/4] max-sm:overflow-clip",
  "max-sm:[&>span:last-child]:gap-1.5 max-sm:[&>span:last-child]:p-3.5",
  "max-sm:[&>span:last-child>span:first-child]:hidden",
  "max-sm:[&_h3]:text-[17px] max-sm:[&_h3]:leading-[22px]",
  "max-sm:[&>span:last-child>span:nth-last-child(2)]:text-[13px] max-sm:[&>span:last-child>span:nth-last-child(2)]:leading-[18px]",
].join(" ");

/** «Lo que más expone a …» / «Lo que recomendamos para …». */
export const sectorNoun: Record<SectorSlug, string> = {
  "petroleo-y-energia": "una instalación petrolera o de energía",
  "industria-y-logistica": "una planta, un almacén o un galpón",
  "comercio-y-oficinas": "un comercio, un hotel o una oficina",
  condominios: "un conjunto residencial",
};

/** Icono de cada servicio en «Esquema recomendado». */
export const serviceIcons: Record<ServiceContent["slug"], typeof GuardIcon> = {
  "vigilancia-privada": GuardIcon,
  "control-de-acceso": IdCardIcon,
  "sistemas-electronicos": CameraIcon,
  "gestion-de-riesgos": TargetIcon,
};

/**
 * Botones según la audiencia (11.3). En las páginas de empresa, «Solicitar
 * propuesta técnica y económica» lleva a /empresas#propuesta (allí se explica
 * qué enviar y se ofrece el correo con el pliego); visita técnica y WhatsApp
 * siguen igual. Condominios: WhatsApp · Diagnóstico · Llamar.
 */
export function sectorActions(sector: SectorContent): CtaAction[] {
  if (sector.audience !== "empresa") return sector.cta;
  return sector.cta.map((action) =>
    action.kind === "mail" && action.event === "propuesta-formal"
      ? {
          kind: "link",
          label: ctaLabels.propuesta,
          href: `${routes.empresas}#propuesta`,
          ubicacion: sector.ubicacion,
          event: "propuesta-formal",
        }
      : action,
  );
}

/** ¿La página muestra «De la inspección al primer turno»? (4.10: empresas). */
export function showsOnboarding(sector: SectorContent) {
  return sector.audience === "empresa" || sector.answerIds.includes("inspeccion-primer-turno");
}

/** Respuestas que se pintan en el bloque oscuro (4.1 y 4.2), en todos los sectores. */
const promiseIds = ["ningun-puesto-solo", "reporte"] as const satisfies readonly AnswerId[];

/** Orden de las tarjetas de respuesta (las que el sector tenga en `answerIds`). */
const cardOrder = [
  "supervision",
  "no-armado",
  "quien-responde",
  "quien-protege",
  "precio",
  "contrato",
  "kit",
] as const satisfies readonly AnswerId[];

/**
 * Tarjetas de respuesta del sector según la matriz 4.11 (`answerIds`), sin
 * repetir lo que ya cuenta la pieza propia (p. ej. «no armado» en Comercio).
 */
export function sectorAnswerIds(sector: SectorContent): AnswerId[] {
  const spotlightTitles = new Set(sector.spotlight.points.map((p) => p.title));
  return cardOrder.filter(
    (id) => sector.answerIds.includes(id) && !spotlightTitles.has(answers[id].title),
  );
}

/** Pregunta frecuente → respuesta de la que repite el texto. */
const faqSource: Partial<Record<FaqId, AnswerId>> = {
  "falta-oficial": "ningun-puesto-solo",
  relevo: "ningun-puesto-solo",
  "como-sabre": "reporte",
  // «¿Cuándo recibe la junta el libro…?» repite la tarjeta «Cada novedad, por escrito».
  "junta-libro": "reporte",
  "supervision-noche": "supervision",
  "no-armado-robo": "no-armado",
  "por-que-no-armado": "no-armado",
  nomina: "quien-responde",
  "quien-responde-hurto": "quien-responde",
  quejas: "quien-responde",
  "quien-entra": "quien-protege",
  formacion: "quien-protege",
  "mismos-oficiales": "quien-protege",
  "cambio-oficial": "quien-protege",
  precio: "precio",
  "inspeccion-costo": "precio",
  "contrato-pago": "contrato",
  "terminar-contrato": "contrato",
  facturacion: "contrato",
  "ajuste-precio": "contrato",
  referencias: "kit",
  "inspeccion-primer-turno": "inspeccion-primer-turno",
  "acreditacion-hse": "inspeccion-primer-turno",
};

/** Preguntas que completan la lista del sector sin repetir los bloques. */
const faqExtras: Record<SectorContent["audience"], readonly FaqId[]> = {
  residencial: ["junta-libro", "uniforme", "zonas", "respuesta"],
  empresa: ["kit-proveedor", "propuesta-incluye", "sistema-gestion", "uniforme", "zonas", "respuesta"],
};

/**
 * «Preguntas del sector»: las del sector (`faqIds`) más las de su audiencia,
 * sin las que ya responde un bloque de la página (así no se lee dos veces la
 * misma respuesta). `FaqList` quita después las que sigan pendientes.
 */
export function sectorFaqIds(sector: SectorContent): FaqId[] {
  const shown = new Set<AnswerId>([...promiseIds, ...sectorAnswerIds(sector)]);
  if (showsOnboarding(sector)) shown.add("inspeccion-primer-turno");
  const spotlightTitles = new Set(sector.spotlight.points.map((p) => p.title));
  if (spotlightTitles.has(noArmado.title)) shown.add("no-armado");

  const ids = [...new Set<FaqId>([...sector.faqIds, ...faqExtras[sector.audience]])];
  return ids.filter((id) => {
    if (id === "sistema-gestion" && spotlightTitles.has(qualitySystem.title)) return false;
    const source = faqSource[id];
    return !source || !shown.has(source);
  });
}
