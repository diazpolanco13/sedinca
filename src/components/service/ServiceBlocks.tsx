import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { Card } from "@/components/ui/Card";
import { Pend } from "@/components/ui/Pending";
import { Reveal } from "@/components/ui/Reveal";
import { routes, serviceHref } from "@/config/site";
import { precio, priceFactors } from "@/content/answers";
import { onboarding } from "@/content/process";
import { getService, type ServiceContent } from "@/content/services";

/** Frases de 4.7 que dependen de SEDIN (inspección sin costo, vigencia, precio referencial…). */
const priceNotes = precio.body.slice(1);

/** Nota común: el dimensionamiento se cierra en la inspección. */
const priceClosing = "Todo se define en la inspección del sitio, antes de la propuesta escrita.";

/** Factores de precio de un servicio (por defecto, los de 4.7, pensados para la vigilancia). */
export interface PriceFactorsOptions {
  /** Lista de factores; vacía, la tarjeta no la muestra. */
  factors?: readonly string[];
  /** Frases de SEDIN pendientes de confirmar (solo en revisión). */
  notes?: readonly string[];
  /** Frase final. */
  closing?: string;
}

/**
 * «¿De qué depende el precio?» (4.7), en tarjeta. Sin cifras inventadas: los
 * datos de SEDIN (precio referencial, vigencia, inspección sin costo) van con
 * marcador y solo se ven en revisión. Cada servicio puede pasar sus propios
 * factores (`ServiceContent.price`): las cámaras no dependen de los puestos ni
 * de los oficiales en rotación.
 */
export function PriceFactorsCard({
  headingId,
  factors = priceFactors,
  notes = priceNotes,
  closing = priceClosing,
}: { headingId: string } & PriceFactorsOptions) {
  return (
    <Card elevation={3} accent className="p-7 sm:p-8">
      <div className="flex flex-col gap-5">
        <span className="eyebrow text-ink-accent">{precio.eyebrow}</span>
        <h3 id={headingId} className="m-0 font-display text-2xl leading-8 font-bold tracking-[-0.01em] text-ink">
          {precio.title}
        </h3>
        {factors.length > 0 && (
          <ol className="m-0 grid list-none gap-0 p-0">
            {factors.map((factor, i) => (
              <li key={factor} className="flex gap-4 border-t border-line py-3.5 first:border-t-0 first:pt-0">
                <span
                  aria-hidden="true"
                  className="w-6 flex-none pt-0.5 font-display text-sm font-bold text-ink-brand tabular-nums"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[15px] leading-[22px] text-ink">{factor}</span>
              </li>
            ))}
          </ol>
        )}
        {notes.length > 0 && (
          <Pend as="p" className="m-0 text-[15px] leading-[22px] text-ink-muted" text={notes} />
        )}
        <p
          className={
            factors.length > 0
              ? "m-0 border-t border-line pt-4 text-[15px] leading-[22px] text-ink-muted"
              : "m-0 text-base leading-[26px] text-ink"
          }
        >
          {closing}
        </p>
      </div>
    </Card>
  );
}

/**
 * «¿De qué depende el precio?» en formato de sección (índice de /servicios):
 * filas grandes numeradas.
 */
export function PriceFactorsList() {
  return (
    <div className="flex flex-col gap-6">
      <ol className="m-0 grid list-none p-0">
        {priceFactors.map((factor, i) => (
          <Reveal
            as="li"
            key={factor}
            className="flex items-baseline gap-5 border-b border-line py-5 first:border-t"
          >
            <span
              aria-hidden="true"
              className="w-10 flex-none font-display text-[28px] leading-none font-bold tracking-[-0.02em] text-ink-brand tabular-nums"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-[17px] leading-[26px] text-ink">{factor}</span>
          </Reveal>
        ))}
      </ol>
      <Pend as="p" className="m-0 text-base leading-[26px] text-ink-muted" text={priceNotes} />
      <p className="m-0 text-base leading-[26px] text-ink-muted">{priceClosing}</p>
    </div>
  );
}

/**
 * Pasos para empezar, en una lista numerada compacta (resumen de 4.10): una
 * columna en móvil y dos desde 640px (1-3 a la izquierda, 4-5 a la derecha).
 * Por defecto, los de «De la inspección al primer turno», con enlace al
 * proceso completo.
 */
export function StartSteps({ steps }: { steps?: readonly string[] }) {
  const list = steps ?? onboarding.stages.map((s) => s.title);
  return (
    <div className="flex flex-col gap-4 border-t border-line pt-7">
      <h3 className="eyebrow m-0 text-ink-muted">Cómo empezamos</h3>
      <ol className="m-0 grid list-none gap-3 p-0 sm:grid-flow-col sm:grid-rows-3 sm:gap-x-8">
        {list.map((step, i) => (
          <li key={step} className="flex items-center gap-3 text-[15px] leading-[22px] text-ink">
            <span
              aria-hidden="true"
              className="inline-flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[image:var(--gradient-action)] font-display text-xs font-bold text-on-brand"
            >
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>
      {!steps && (
        <Link
          href={`${routes.comoTrabajamos}#proceso`}
          prefetch={false}
          className="group inline-flex items-center gap-1.5 self-start font-display text-[15px] font-semibold text-ink-brand no-underline hover:underline"
        >
          Ver el proceso completo
          <ArrowRightIcon
            size={16}
            className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
          />
        </Link>
      )}
    </div>
  );
}

/** «Combínelo con»: tarjetas de los servicios que completan este. */
export function RelatedServices({ service, headingId }: { service: ServiceContent; headingId: string }) {
  const related = service.related
    .map((r) => ({ ...r, s: getService(r.slug) }))
    .filter((r): r is typeof r & { s: ServiceContent } => Boolean(r.s));
  if (related.length === 0) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <span className="eyebrow inline-flex items-center gap-3 text-ink-brand">
          <span aria-hidden="true" className="h-0.5 w-8 rounded-full bg-[image:var(--gradient-accent-line)]" />
          Servicios que se complementan
        </span>
        <h2
          id={headingId}
          className="m-0 font-display text-[clamp(26px,3vw,40px)] leading-[1.12] font-bold tracking-[-0.015em] text-ink"
        >
          Combínelo con
        </h2>
      </div>
      <ul className="m-0 grid list-none gap-4 p-0">
        {related.map(({ s, why }) => {
          const Icon = s.Icon;
          return (
            <Reveal as="li" key={s.slug} className="flex">
              <Link
                href={serviceHref(s.slug)}
                prefetch={false}
                className="card-interactive group flex w-full items-start gap-4 rounded-lg border border-line-card bg-surface p-5 text-ink no-underline shadow-elevation-1 hover:text-ink sm:p-6"
              >
                <span className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-md bg-surface-brand text-ink-brand">
                  <Icon size={24} />
                </span>
                <span className="flex min-w-0 flex-col gap-1.5">
                  <span className="font-display text-lg leading-6 font-bold tracking-[-0.01em]">{s.name}</span>
                  <span className="text-[15px] leading-[22px] text-ink-muted">{why}</span>
                </span>
                <ArrowRightIcon
                  size={18}
                  className="mt-1 ml-auto flex-none text-ink-brand transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                />
              </Link>
            </Reveal>
          );
        })}
      </ul>
    </div>
  );
}
