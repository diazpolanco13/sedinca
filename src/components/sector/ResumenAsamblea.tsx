import Image from "next/image";
import { CheckIcon } from "@/components/icons";
import { Pend, SourceNote } from "@/components/ui/Pending";
import { Section } from "@/components/ui/Section";
import { guideAsk, guideCopy, guideInProposal } from "@/components/trust/content";
import { phoneHref, serviceNav, showPending, site } from "@/config/site";
import {
  buyerGuide,
  contrato,
  kit,
  ningunPuestoSolo,
  noArmado,
  precio,
  proposalIncludes,
  quienProtege,
  quienResponde,
  reporte,
  supervision,
  trainingSyllabus,
  unarmedStatement,
  type AnswerPoint,
} from "@/content/answers";
import { getFaq, type FaqId } from "@/content/faq";
import { getSector } from "@/content/sectors";
import { cn } from "@/lib/cn";
import { anyPending, filterPending, isVisible, visibleSentences, type Sentences } from "@/lib/pending";
import { hurtoQuestion } from "./AnswerCard";
import { JuntaShareLink, resumenUrl } from "./JuntaShare";
import { PrintButton } from "./PrintButton";
import "./resumen-print.css";

/*
 * Resumen para la asamblea (propuesta 8.8): una hoja HTML imprimible con las
 * respuestas 4.1 a 4.8, el esquema recomendado para condominios, la guía «8
 * preguntas» y los datos de contacto. Los textos salen de answers.ts (se
 * escriben una sola vez); las frases con [MARCADOR] no se publican y los
 * puntos se renumeran solos.
 */

interface ResumenItem {
  key: string;
  question: string;
  /**
   * Respuesta corta, en negrita, antes del detalle. Si falta, se usa la
   * primera frase publicable de `body` (misma estructura en todos los puntos:
   * pregunta, respuesta en negrita, detalle).
   */
  lead?: Sentences;
  body: Sentences;
  list?: { title: string; items: readonly string[]; inline?: boolean };
  points?: readonly AnswerPoint[];
  source?: string;
  /** Preguntas frecuentes que responde (para la guía «8 preguntas»). */
  faqIds: readonly FaqId[];
}

const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/** «a, b y c» */
function enumerate(items: readonly string[]) {
  const lower = items.map(lowerFirst);
  return lower.length > 1 ? `${lower.slice(0, -1).join(", ")} y ${lower.at(-1)}` : (lower[0] ?? "");
}

const items: ResumenItem[] = [
  {
    key: "reemplazo",
    question: ningunPuestoSolo.question,
    lead: ningunPuestoSolo.title,
    body: ningunPuestoSolo.body,
    source: ningunPuestoSolo.source,
    faqIds: ["falta-oficial"],
  },
  {
    key: "supervision",
    question: "¿Quién supervisa el servicio?",
    lead: supervision.title,
    body: supervision.body,
    source: supervision.source,
    faqIds: ["supervision-noche"],
  },
  {
    key: "reporte",
    question: "¿Cómo sabrá la junta lo que pasa en el conjunto?",
    lead: "Cada novedad, por escrito.",
    body: reporte.body,
    points: reporte.points,
    source: reporte.source,
    faqIds: ["como-sabre", "junta-libro"],
  },
  {
    key: "no-armado",
    question: noArmado.question,
    lead: unarmedStatement,
    body: noArmado.body,
    source: noArmado.source,
    faqIds: ["no-armado-robo"],
  },
  {
    key: "personal",
    question: "¿Quién es el oficial que llega al conjunto?",
    lead: "Oficiales seleccionados y formados antes de su primer turno.",
    body: quienProtege.body,
    list: { title: quienProtege.list.title, items: trainingSyllabus, inline: true },
    points: quienProtege.points,
    source: quienProtege.source,
    faqIds: ["quien-entra", "mismos-oficiales", "cambio-oficial"],
  },
  {
    key: "responsabilidad",
    question: hurtoQuestion,
    // Sin la nómina confirmada, la respuesta corta es la de Asuntos Internos (art. 14).
    lead: isVisible(quienResponde.body)
      ? quienResponde.title
      : "El Supervisor de Asuntos Internos investiga cada hurto y cada queja.",
    body: quienResponde.body,
    points: quienResponde.points,
    source: quienResponde.source,
    faqIds: ["nomina", "quien-responde-hurto", "quejas"],
  },
  {
    key: "precio",
    question: precio.title,
    body: precio.body,
    list: precio.list,
    faqIds: ["precio"],
  },
  {
    key: "contrato",
    question: contrato.question,
    body: contrato.body,
    points: contrato.points,
    faqIds: ["contrato-pago", "terminar-contrato"],
  },
  {
    key: "documentos",
    question: kit.question,
    body: [...kit.body, `El RIF de SEDIN es ${site.rifDisplay}.`],
    points: kit.points,
    faqIds: ["kit-proveedor", "referencias"],
  },
];

/**
 * Preguntas de la guía «8 preguntas» que solo se dan por respondidas con su
 * dato confirmado: solvencias vigentes, supervisión de noche y póliza.
 */
const strictGuide = new Set<FaqId>(["kit-proveedor", "supervision-noche", "quien-responde-hurto"]);

function visiblePoints(points?: readonly AnswerPoint[]) {
  return (points ?? []).filter((p) => isVisible(p.text));
}

function itemVisible(item: ResumenItem) {
  return isVisible(item.body) || visiblePoints(item.points).length > 0;
}

/** Respuesta corta y detalle: sin `lead`, la primera frase publicable pasa a ser la respuesta corta. */
function splitLead(item: ResumenItem): { lead?: Sentences; body: Sentences } {
  if (item.lead && isVisible(item.lead)) return { lead: item.lead, body: item.body };
  const [first, ...rest] = visibleSentences(item.body);
  return first ? { lead: first, body: rest } : { body: item.body };
}

/** Texto de la guía cuando el resumen no responde (aún) esa pregunta. */
const askInWriting = "Pida la respuesta por escrito en la propuesta.";

/** Puntos de «Qué incluye cada propuesta» que se publican (los mismos que en /empresas). */
const proposalPoints = new Set<string>(filterPending(proposalIncludes, (item) => item));

/**
 * Sin respuesta publicable en el resumen, lo mismo que la guía de /empresas:
 * el punto de la propuesta que la cubre o qué pedir (p. ej. las solvencias con
 * el kit). El texto genérico queda para lo que aún no tiene ni lo uno ni lo otro.
 */
function guideFallback(faqId: FaqId) {
  const inProposal = guideInProposal[faqId];
  if (inProposal && proposalPoints.has(inProposal)) return `${guideCopy.inProposal} · ${inProposal}`;
  return guideAsk[faqId]?.label ?? askInWriting;
}

export function ResumenAsamblea() {
  const condominios = getSector("condominios")!;
  const shown = items.filter(itemVisible).map((item, i) => ({ ...item, ...splitLead(item), n: i + 1 }));

  /**
   * Punto del resumen que responde a una pregunta de la guía, solo si la
   * respuesta se publica. Las preguntas de `strictGuide` exigen la respuesta
   * completa (p. ej. «¿Tienen póliza?» no se da por respondida con el informe
   * de Asuntos Internos mientras la póliza siga pendiente).
   */
  function pointFor(faqId: FaqId) {
    const answer = getFaq(faqId).answer;
    if (!isVisible(answer)) return undefined;
    if (strictGuide.has(faqId) && !showPending && anyPending(answer)) return undefined;
    return shown.find((item) => item.faqIds.includes(faqId));
  }

  const tel = phoneHref();

  return (
    <Section tone="sunken" id="resumen" labelledBy="resumen-titulo">
      {/* En móvil, la hoja va a sangre (sin borde, sombra ni margen lateral): más ancho para el texto. */}
      <article className="sd-resumen -mx-4 flex flex-col gap-12 border-y border-line-card bg-surface px-4 py-8 text-ink sm:mx-auto sm:max-w-[920px] sm:rounded-xl sm:border-x sm:p-10 sm:shadow-elevation-2 lg:p-14 print:gap-8">
        {/* Membrete */}
        <header className="flex flex-col gap-6 border-b border-line pb-8 sm:flex-row sm:items-center sm:justify-between print:pb-5">
          <div className="flex items-center gap-4">
            <Image
              src="/assets/marca/escudo-sedin-96.webp"
              alt=""
              width={96}
              height={110}
              loading="eager"
              className="h-14 w-auto"
            />
            <span className="flex flex-col gap-0.5">
              <span className="font-display text-2xl leading-7 font-bold tracking-[-0.01em] text-ink">{site.name}</span>
              <span className="text-sm leading-5 text-ink-muted">
                Seguridad y Defensa Integral · <span className="whitespace-nowrap">RIF {site.rifDisplay}</span>
              </span>
            </span>
          </div>
          <p className="m-0 flex flex-col gap-0.5 text-sm leading-5 text-ink-muted sm:text-right">
            <span>
              WhatsApp y teléfono: <span className="font-semibold whitespace-nowrap text-ink">{site.phone}</span>
            </span>
            <span>{site.email}</span>
            <span>{site.domain}</span>
          </p>
        </header>

        {/* Título y presentación */}
        <div className="flex flex-col gap-4">
          <span className="eyebrow text-ink-brand">Resumen para la asamblea</span>
          <h2
            id="resumen-titulo"
            className="m-0 font-display text-[clamp(28px,3.4vw,44px)] leading-[1.1] font-bold tracking-[-0.02em] text-balance text-ink print:text-[22pt]"
          >
            Vigilancia para el conjunto: las respuestas que pedirá la asamblea
          </h2>
          <p className="m-0 max-w-[720px] text-lg leading-7 text-ink-muted print:text-[11pt] print:leading-normal">
            {site.legalName} ({site.name}) presta vigilancia privada no armada en Maracaibo. Para condominios:{" "}
            {lowerFirst(condominios.lead)}
          </p>
        </div>

        {/* Esquema recomendado */}
        <section data-print-block="" aria-labelledby="resumen-esquema" className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <h3 id="resumen-esquema" className="m-0 font-display text-xl leading-7 font-bold tracking-[-0.01em] text-ink">
              El esquema que recomendamos
            </h3>
            <p className="m-0 text-[15px] leading-6 text-ink-muted">
              Los puestos, los oficiales y los controles se definen con la junta en la inspección del sitio.
            </p>
          </div>
          <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-3 print:grid-cols-3">
            {condominios.scheme.map((item) => (
              <li key={item.service} className="flex flex-col gap-1.5 border-t-2 border-accent pt-3">
                <span className="font-display text-base font-semibold text-ink">{serviceNav[item.service].label}</span>
                <Pend as="span" className="text-[15px] leading-[22px] text-ink-muted" text={item.why} />
              </li>
            ))}
          </ul>
        </section>

        {/* Preguntas y respuestas */}
        <section aria-labelledby="resumen-respuestas" className="flex flex-col gap-6">
          <h3
            id="resumen-respuestas"
            className="m-0 border-b border-line pb-3 font-display text-xl leading-7 font-bold tracking-[-0.01em] text-ink"
          >
            Las preguntas de la asamblea, respondidas
          </h3>
          <ol className="m-0 flex list-none flex-col gap-8 p-0 print:gap-5">
            {shown.map((item) => {
              const points = visiblePoints(item.points);
              return (
                <li
                  key={item.key}
                  id={`punto-${item.key}`}
                  data-print-block=""
                  className="grid scroll-mt-28 grid-cols-[2.25rem_1fr] gap-x-3 gap-y-2 sm:grid-cols-[2.75rem_1fr] sm:gap-x-4"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-accent font-display text-sm font-bold text-ink-brand sm:row-span-2 sm:h-11 sm:w-11 sm:text-base"
                  >
                    {item.n}
                  </span>
                  <h4 className="m-0 self-center font-display text-lg leading-6 font-bold tracking-[-0.01em] text-ink sm:text-xl sm:leading-7">
                    <span className="sr-only">{item.n}. </span>
                    {item.question}
                  </h4>
                  {/* En móvil, el detalle ocupa todo el ancho (sin la sangría del número). */}
                  <div className="col-span-2 flex flex-col gap-3 sm:col-span-1 sm:col-start-2">
                    {item.lead && (
                      <Pend as="p" className="m-0 text-base leading-[26px] font-semibold text-ink" text={item.lead} />
                    )}
                    <Pend as="p" className="m-0 text-base leading-[26px] text-ink-muted" text={item.body} />
                    {item.list &&
                      (item.list.inline ? (
                        <p className="m-0 text-[15px] leading-[22px] text-ink-muted">
                          <span className="font-semibold text-ink">{item.list.title}: </span>
                          {enumerate(item.list.items)}.
                        </p>
                      ) : (
                        <ul className="m-0 flex list-none flex-col gap-2 p-0">
                          {item.list.items.map((entry) => (
                            <li key={entry} className="flex gap-3 text-[15px] leading-[22px] text-ink">
                              <CheckIcon size={18} className="mt-0.5 flex-none text-ink-accent" />
                              <span>
                                <Pend text={entry} />
                              </span>
                            </li>
                          ))}
                        </ul>
                      ))}
                    {points.length > 0 && (
                      <dl className="m-0 flex flex-col gap-3">
                        {points.map((point) => (
                          <div key={point.title} className="flex flex-col gap-0.5">
                            <dt className="text-[15px] leading-[22px] font-semibold text-ink">{point.title}</dt>
                            <dd className="m-0">
                              <Pend as="span" className="text-[15px] leading-[22px] text-ink-muted" text={point.text} />
                            </dd>
                          </div>
                        ))}
                      </dl>
                    )}
                    <SourceNote source={item.source} />
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Guía «8 preguntas» */}
        <section
          data-print-block=""
          aria-labelledby="resumen-guia"
          className="flex flex-col gap-5 rounded-lg border border-line bg-surface-sunken p-6 sm:p-8 print:border-line-strong print:bg-transparent print:p-5"
        >
          <div className="flex flex-col gap-2">
            <h3 id="resumen-guia" className="m-0 font-display text-xl leading-7 font-bold tracking-[-0.01em] text-ink">
              {buyerGuide.title}
            </h3>
            <p className="m-0 text-[15px] leading-6 text-ink-muted">
              {buyerGuide.lead} Marque las que cada proveedor responde por escrito.
            </p>
          </div>
          <ul className="m-0 grid list-none gap-x-8 gap-y-3 p-0 sm:grid-cols-2 print:grid-cols-2">
            {buyerGuide.items.map((entry) => {
              const point = pointFor(entry.faqId);
              return (
                <li key={entry.faqId} className="flex gap-3 text-[15px] leading-[22px]">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 h-[18px] w-[18px] flex-none rounded-[4px] border-[1.5px] border-line-strong bg-surface"
                  />
                  <span className="flex flex-col">
                    <span className="text-ink">{entry.question}</span>
                    {point ? (
                      <a
                        href={`#punto-${point.key}`}
                        className="text-sm leading-5 text-ink-brand no-underline hover:underline"
                      >
                        Respuesta de SEDIN: punto {point.n}
                      </a>
                    ) : (
                      <span className="text-sm leading-5 text-ink-muted">{guideFallback(entry.faqId)}</span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Contacto */}
        <footer data-print-block="" className="flex flex-col gap-5 border-t border-line pt-8 print:pt-5">
          <h3 className="m-0 font-display text-xl leading-7 font-bold tracking-[-0.01em] text-ink">
            Para coordinar la inspección del conjunto
          </h3>
          <dl className="m-0 grid gap-x-8 gap-y-4 text-[15px] leading-[22px] sm:grid-cols-2 print:grid-cols-2">
            <div className="flex flex-col gap-0.5">
              <dt className="field-label">WhatsApp y teléfono · atención {site.hours}</dt>
              <dd className="m-0 text-ink">
                {tel ? (
                  <a href={tel} className="font-semibold text-ink no-underline hover:underline">
                    {site.phone}
                  </a>
                ) : (
                  site.phone
                )}
              </dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="field-label">Correo</dt>
              <dd className="m-0 break-words text-ink">{site.email}</dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="field-label">Oficina</dt>
              <dd className="m-0 text-ink">
                {site.address}, {site.city}
              </dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="field-label">Este resumen en línea</dt>
              <dd className="m-0 break-words text-ink">{resumenUrl.replace(/^https:\/\//, "")}</dd>
            </div>
          </dl>
          <p className="m-0 text-sm leading-5 text-ink-muted">
            Documento informativo. Las condiciones del servicio se fijan en la propuesta escrita y en el contrato.
          </p>
        </footer>

        {/* Compartir (solo en pantalla) */}
        <div
          className={cn(
            "flex flex-col gap-5 rounded-lg border border-line-cyan bg-surface-brand p-6 sm:p-8 print:hidden",
            "lg:flex-row lg:items-center lg:justify-between",
          )}
        >
          <div className="flex flex-col gap-1">
            <span className="font-display text-lg leading-6 font-bold text-ink">Compártalo con la junta</span>
            <span className="text-[15px] leading-[22px] text-ink-muted">
              Envíe el enlace por WhatsApp o imprímalo para la asamblea.
            </span>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <JuntaShareLink ubicacion="resumen" size="md" block />
            <PrintButton block />
          </div>
        </div>
      </article>
    </Section>
  );
}
