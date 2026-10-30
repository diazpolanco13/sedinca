import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  BriefcaseIcon,
  CheckIcon,
  ChevronDownIcon,
  FileTextIcon,
  MailIcon,
  PinIcon,
} from "@/components/icons";
import { SitePage } from "@/components/layout/SitePage";
import { ActionLink } from "@/components/ui/ActionLink";
import { CaseStudies } from "@/components/ui/CaseCard";
import { CtaBand } from "@/components/ui/CtaBand";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHero } from "@/components/ui/PageHero";
import { Pend, PendingBlock, SourceNote } from "@/components/ui/Pending";
import { PhotoCard } from "@/components/ui/PhotoCard";
import { Reveal } from "@/components/ui/Reveal";
import { Accent, Section, SectionHeader } from "@/components/ui/Section";
import { ArrowLink } from "@/components/ui/SectionHeading";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import {
  absoluteUrl,
  ctaLabels,
  emailHref,
  hasPending,
  kitMail,
  phoneHref,
  routes,
  sectorHref,
  showPending,
  site,
  waMessages,
  whatsappShareHref,
  type CtaAction,
} from "@/config/site";
import {
  buyerGuide,
  kit,
  precio,
  priceFactors,
  proposalIncludes,
  providerDocuments,
  qualitySystem,
} from "@/content/answers";
import { canShowCases, casesCopy } from "@/content/cases";
import { getFaq, type FaqId, type FaqItem } from "@/content/faq";
import { onboarding } from "@/content/process";
import { sectorsContent } from "@/content/sectors";
import { umami } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { anyPending, filterPending, isVisible, publishedText, visibleSentences } from "@/lib/pending";
import {
  empresasHero,
  empresasProcess,
  empresasSectors,
  fichaPublished,
  guideAsk,
  guideAskDefault,
  guideCopy,
  guideInProposal,
  guideKeyPhrase,
  guideTips,
  proposalMailAction,
  proposalMailText,
  proposalNeeds,
  providerSheet,
  providerSheetSource,
  referencesCopy,
  ubicaciones,
} from "./content";
import { CopyTextButton } from "./CopyTextButton";
import { PrintGuideButton } from "./PrintGuideButton";
import { CheckList, HeroLead, IconBadge, StepNumber } from "./TrustBlocks";

/*
 * /empresas «Para compras y proveedores» (propuesta 8.7, 4.9 y 4.10).
 *   portada (foto del puente) con propuesta · visita técnica y hechos
 *   → light   #ficha        ficha de proveedor (+ «Copiar los datos»)
 *   → sunken  #kit          kit de proveedor: en producción, solo lo confirmado
 *   → dark    #que-incluye  qué incluye cada propuesta · qué enviarnos · precio
 *   → light   #sectores     sectores que atendemos (recortes pequeños de las fotos de IA)
 *                           + casos de éxito (solo cuando existan; en producción, nada)
 *   → sunken  #guia         «8 preguntas antes de contratar…» (imprimible; desplegables en móvil)
 *   → brand   #referencias  solo en revisión mientras no haya referencias
 *   → light   #proceso      de la inspección al primer turno: solo los 5 pasos
 *   → dark    #propuesta    cierre: propuesta por correo · visita técnica · WhatsApp
 */

const UBI = ubicaciones.empresas;

const visitAction: CtaAction = {
  kind: "whatsapp",
  label: ctaLabels.visitaTecnica,
  message: waMessages.visitaTecnica,
  ubicacion: UBI,
  event: "visita-tecnica",
};

const whatsappAction: CtaAction = {
  kind: "whatsapp",
  label: ctaLabels.whatsapp,
  message: waMessages.propuesta,
  ubicacion: UBI,
};

/** Botones de empresa (11.3): propuesta por correo · visita técnica · WhatsApp. */
const companyActions: CtaAction[] = [proposalMailAction, visitAction, whatsappAction];

const cardBase = "rounded-lg border border-line-card bg-surface shadow-elevation-1";

export function EmpresasPage() {
  return (
    <SitePage>
      <PageHero
        crumbs={[{ label: "Para empresas" }]}
        eyebrow={empresasHero.eyebrow}
        title={empresasHero.title}
        lead={<HeroLead text={empresasHero.lead} actions={companyActions} facts={empresasHero.facts} />}
        primary={null}
      />
      <Ficha />
      <Kit />
      <QueIncluye />
      <Sectores />
      <Guia />
      <Referencias />
      <Proceso />
      <CtaBand
        id="propuesta"
        eyebrow="Propuesta formal"
        title={
          <>
            Solicite su propuesta <Accent>técnica y económica</Accent>
          </>
        }
        lead="Envíenos el pliego o el alcance desde su correo: el mensaje ya va redactado para que solo complete los datos. También coordinamos una visita técnica a su instalación."
        actions={companyActions}
        ubicacion={UBI}
        whatsappMessage={waMessages.propuesta}
        footnote={
          <>
            ¿No se abre su correo? Escriba a{" "}
            <a
              href={emailHref(site.salesEmail)}
              {...umami("correo", { ubicacion: UBI })}
              className="font-semibold break-all text-cyan-200 underline underline-offset-[3px]"
            >
              {site.salesEmail}
            </a>{" "}
            con el asunto «Solicitud de propuesta – nombre de su empresa».
            <span className="mt-3 block">
              <CopyTextButton
                text={proposalMailText}
                label="Copiar el texto del correo"
                copiedLabel="Texto copiado"
                variant="secondary"
                size="sm"
              />
            </span>
          </>
        }
      />
    </SitePage>
  );
}

/* Ficha de proveedor ------------------------------------------------------ */

type SheetRow = (typeof providerSheet)[number];

/** Filas que ocupan las dos columnas de la ficha. */
const isLong = (row?: SheetRow) => !row || row.kind === "address" || row.label === "Razón social" || row.label === "Objeto";

/** Diseño de la ficha: las filas largas, y la media fila que se quedaría sola, van a lo ancho. */
function sheetLayout(rows: readonly SheetRow[]) {
  let col = 0;
  return rows.map((row, i) => {
    if (isLong(row)) {
      col = 0;
      return { row, wide: true };
    }
    const wide = col === 0 && isLong(rows[i + 1]);
    col = wide ? 0 : 1 - col;
    return { row, wide };
  });
}

function Ficha() {
  const layout = sheetLayout(filterPending(providerSheet, (row) => row.value));
  const copyText = [
    `Ficha de proveedor · ${site.name}`,
    ...providerSheet
      .filter((row) => !hasPending(row.value))
      .map((row) => `${row.label}: ${publishedText(row.value)}`),
  ].join("\n");

  return (
    <Section tone="light" id="ficha" labelledBy="ficha-titulo">
      <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-16">
        <div className="flex flex-col gap-8 lg:col-span-5 lg:sticky lg:top-28">
          <SectionHeader
            id="ficha-titulo"
            eyebrow="Ficha de proveedor"
            title={
              <>
                Los datos para su <Accent>registro de proveedores</Accent>
              </>
            }
            lead="Cópielos en su sistema de compras. Los documentos vigentes van en el kit de proveedor."
          />
          <div className="flex flex-col items-start gap-4">
            <CopyTextButton
              text={copyText}
              label="Copiar los datos"
              copiedLabel="Datos copiados"
              announce="Los datos de la ficha se copiaron al portapapeles."
              variant="primary"
              size="lg"
            />
            <a
              href="#kit"
              className="group inline-flex items-center gap-1.5 font-display text-base font-semibold text-ink-brand no-underline hover:underline"
            >
              Ver el kit de documentos
              <ArrowRightIcon
                size={16}
                className="rotate-90 transition-transform group-hover:translate-y-0.5 motion-reduce:transition-none"
              />
            </a>
          </div>
          {fichaPublished && (
            <ArrowLink href={routes.empresasFicha} className="self-start">
              {ctaLabels.ficha}
            </ArrowLink>
          )}
        </div>

        <Reveal className="lg:col-span-7">
          <article
            aria-label={`Ficha de proveedor de ${site.name}`}
            className="relative overflow-hidden rounded-xl border border-line-card bg-surface shadow-elevation-2"
          >
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 bg-[image:var(--gradient-accent-line)]" />
            <header className="flex items-center gap-4 border-b border-line bg-surface-brand px-6 py-5 sm:px-8">
              <Image
                src="/assets/marca/escudo-sedin-96.webp"
                alt=""
                width={48}
                height={48}
                className="h-12 w-12 flex-none object-contain"
              />
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="eyebrow text-ink-brand">Ficha de proveedor</span>
                <span className="font-display text-xl leading-7 font-bold tracking-[-0.01em] text-ink">
                  {site.name}
                </span>
              </div>
            </header>
            <dl className="m-0 grid sm:grid-cols-2">
              {layout.map(({ row, wide }) => (
                <div
                  key={row.label}
                  className={cn("flex flex-col gap-1 border-b border-line px-6 py-4 sm:px-8", wide && "sm:col-span-2")}
                >
                  <dt className="field-label">{row.label}</dt>
                  <dd className="m-0 text-base leading-6 text-ink">
                    <SheetValue row={row} />
                  </dd>
                </div>
              ))}
            </dl>
            {showPending && (
              <div className="px-6 py-4 sm:px-8">
                <SourceNote source={providerSheetSource} />
              </div>
            )}
          </article>
        </Reveal>
      </div>
    </Section>
  );
}

function SheetValue({ row }: { row: SheetRow }) {
  if (row.kind === "tel") {
    const href = phoneHref(row.value);
    return href ? (
      <a href={href} {...umami("telefono", { ubicacion: UBI })} className="font-semibold text-ink-brand no-underline hover:underline">
        {row.value}
      </a>
    ) : (
      <Pend text={row.value} />
    );
  }
  if (row.kind === "mail") {
    const href = emailHref(row.value);
    return href ? (
      <a
        href={href}
        {...umami("correo", { ubicacion: UBI })}
        className="font-semibold break-all text-ink-brand no-underline hover:underline"
      >
        {row.value}
      </a>
    ) : (
      <Pend text={row.value} />
    );
  }
  if (row.kind === "address") {
    return (
      <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span>{row.value}</span>
        <a
          href={site.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          {...umami("como-llegar", { ubicacion: UBI })}
          className="inline-flex items-center gap-1 text-[15px] font-semibold whitespace-nowrap text-ink-brand no-underline hover:underline"
        >
          <PinIcon size={16} />
          Cómo llegar
          <span className="sr-only"> (abre Google Maps)</span>
        </a>
      </span>
    );
  }
  return <Pend text={row.value} />;
}

/* Kit de proveedor (4.9) -------------------------------------------------- */

function Kit() {
  const docs = filterPending(providerDocuments, (d) => [d.name, d.note]);
  return (
    <Section tone="sunken" id="kit" labelledBy="kit-titulo">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="flex flex-col gap-8 lg:col-span-5">
          <SectionHeader
            id="kit-titulo"
            eyebrow="Documentos de proveedor"
            title={
              <>
                Kit de <Accent>proveedor</Accent>
              </>
            }
            lead={<Pend text={kit.body} />}
          />
          <SourceNote source={kit.source} />
          <div className="flex flex-col gap-4">
            <ActionLink action={kitMail(UBI)} variant="primary" size="lg" block className="self-start" />
            <WhatsAppLink message={waMessages.kit} ubicacion={UBI} variant="inline">
              Pedir el kit por WhatsApp
            </WhatsAppLink>
          </div>
        </div>

        <div className="lg:col-span-7">
          <ul className={cn(cardBase, "m-0 list-none divide-y divide-line overflow-hidden p-0")}>
            {docs.map((doc) => {
              const indexDoc = doc.name.startsWith("Índice de procedimientos");
              return (
                <li key={doc.name} className="flex items-start gap-4 px-5 py-4 sm:px-6">
                  <FileTextIcon size={22} className="mt-0.5 flex-none text-ink-brand" />
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="text-base leading-6 font-medium text-ink">
                      <Pend text={doc.name} />
                    </span>
                    {indexDoc && (
                      <Link
                        href={qualitySystem.link.href}
                        prefetch={false}
                        className="self-start text-[14px] leading-5 font-semibold text-ink-brand no-underline hover:underline"
                      >
                        {qualitySystem.link.label}
                      </Link>
                    )}
                  </div>
                  <DocStatus note={doc.note} />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Section>
  );
}

function DocStatus({ note }: { note: string }) {
  const valid = note === "Vigente";
  const pending = hasPending(note);
  return (
    <span
      className={cn(
        "inline-flex flex-none items-center gap-1.5 rounded-full border px-3 py-1 font-display text-[11px] leading-4 font-semibold tracking-[0.06em] uppercase",
        valid
          ? "border-success bg-success-subtle text-ink-success"
          : pending
            ? "border-line-cyan bg-accent-subtle text-ink"
            : "border-line bg-surface-sunken text-ink-muted",
      )}
    >
      {valid && <CheckIcon size={14} />}
      <Pend text={note} />
    </span>
  );
}

/* Qué incluye cada propuesta, qué enviarnos y de qué depende el precio ---- */

function QueIncluye() {
  const includes = filterPending(proposalIncludes, (item) => item);
  return (
    <Section tone="dark" id="que-incluye" labelledBy="incluye-titulo">
      <SectionHeader
        id="incluye-titulo"
        eyebrow="Propuesta comparable"
        title={
          <>
            Qué incluye cada propuesta <Accent>de SEDIN</Accent>
          </>
        }
        lead="Una propuesta escrita que su comité de compras puede comparar punto por punto con las demás."
      />

      <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-12">
        <GlassCard tone="dark" level={2} accent className="p-6 sm:p-8 lg:col-span-7">
          <span className="eyebrow text-cyan-200">Usted recibe</span>
          <ol className="m-0 mt-5 grid list-none gap-x-8 gap-y-0 p-0 sm:grid-cols-2">
            {includes.map((item, i) => (
              <li key={item} className="flex items-start gap-3 border-b border-line py-3">
                <StepNumber n={i + 1} className="leading-[22px] text-cyan-300" />
                <span className="text-[15px] leading-[22px] text-ink">
                  <Pend text={item} />
                </span>
              </li>
            ))}
          </ol>
        </GlassCard>

        <GlassCard tone="dark" level={1} className="flex flex-col gap-5 p-6 sm:p-8 lg:col-span-5">
          <span className="flex items-center gap-3">
            <IconBadge Icon={MailIcon} tone="dark" size="sm" />
            <span className="eyebrow text-cyan-200">Para prepararla, envíenos</span>
          </span>
          <CheckList items={proposalNeeds} itemClassName="text-ink" />
          <a
            href="#propuesta"
            className="group mt-auto inline-flex items-center gap-1.5 self-start font-display text-[15px] font-semibold text-cyan-200 no-underline hover:underline"
          >
            Cómo solicitarla
            <ArrowRightIcon
              size={16}
              className="rotate-90 transition-transform group-hover:translate-y-0.5 motion-reduce:transition-none"
            />
          </a>
        </GlassCard>
      </div>

      <div className="mt-6 flex flex-col gap-4 rounded-lg border border-line px-6 py-6 sm:px-8 lg:flex-row lg:items-center lg:gap-10">
        <div className="flex flex-col gap-1 lg:w-[300px] lg:flex-none">
          <span className="eyebrow text-ink-brand">{precio.eyebrow}</span>
          <h3 className="m-0 font-display text-xl leading-7 font-bold tracking-[-0.01em] text-ink">{precio.title}</h3>
          <Pend as="p" className="m-0 text-[15px] leading-6 text-ink-muted" text={precio.body.slice(0, 1)} />
        </div>
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {priceFactors.map((factor) => (
            <li
              key={factor}
              className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-[14px] leading-5 text-ink-muted"
            >
              {factor}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/* Sectores que atendemos (y casos de éxito cuando existan) -------------- */

/**
 * Velo de las tarjetas cuadradas. Por debajo de 640px y entre 1024 y 1279px
 * miden ~160–240px y «Comercio, hoteles y oficinas» ocupa tres líneas: el
 * título sube a la zona clara de la foto (ventanal, cielo), así que el velo es
 * más denso y llega arriba. En el resto de anchos (640–1023 y desde 1280px),
 * el de serie; rangos sin solaparse para que el orden del CSS no importe.
 */
const squareScrim =
  "bg-linear-to-t from-azure-950 via-azure-950/75 to-azure-950/35 sm:max-lg:from-azure-950/95 sm:max-lg:via-azure-950/45 sm:max-lg:to-azure-950/5 xl:from-azure-950/95 xl:via-azure-950/45 xl:to-azure-950/5";

function Sectores() {
  return (
    <Section tone="light" id="sectores" labelledBy="sectores-titulo">
      <SectionHeader
        id="sectores-titulo"
        eyebrow={empresasSectors.eyebrow}
        title={
          <>
            {empresasSectors.title.text} <Accent>{empresasSectors.title.highlight}</Accent>
          </>
        }
        lead={empresasSectors.lead}
      />
      {/* Recortes cuadrados y pequeños: la foto de petróleo, con su recorte a la derecha. */}
      <ul className="m-0 mt-10 grid list-none grid-cols-2 gap-3 p-0 sm:gap-4 lg:mt-12 lg:grid-cols-4 lg:gap-6">
        {sectorsContent.map((sector) => (
          <Reveal as="li" key={sector.id}>
            <PhotoCard
              href={sectorHref(sector.id)}
              title={sector.title}
              cta={empresasSectors.cta}
              photo={sector.photo}
              aspect="square"
              sizes="(min-width: 1344px) 302px, (min-width: 1024px) 23vw, 50vw"
              scrimClassName={squareScrim}
              ubicacion={UBI}
            />
          </Reveal>
        ))}
      </ul>

      {canShowCases() && (
        <div className="mt-16 flex flex-col gap-10 border-t border-line pt-16 lg:mt-20 lg:pt-20">
          <SectionHeader as="h3" size="md" eyebrow={casesCopy.eyebrow} title={casesCopy.title} lead={casesCopy.lead} />
          <CaseStudies />
        </div>
      )}
    </Section>
  );
}

/* Guía «8 preguntas antes de contratar una empresa de vigilancia» -------- */

/** ¿La pregunta se publica en /preguntas-frecuentes? (misma regla que FaqList). */
function faqShown(item: FaqItem) {
  return (showPending || !hasPending(item.question)) && isVisible(item.answer);
}

/**
 * «La respuesta de SEDIN» solo si la frase que contesta la pregunta de frente
 * se publica (si no, la respuesta la esquivaría: p. ej. «¿Tienen solvencias
 * vigentes?» con solo el RIF). Esa frase va primero.
 */
function guideAnswer(faqId: FaqId) {
  const faq = getFaq(faqId);
  if (!faqShown(faq)) return null;
  const phrase = guideKeyPhrase[faqId];
  const key = phrase ? faq.answer.find((s) => s.toLowerCase().includes(phrase)) : faq.answer[0];
  if (!key || (!showPending && hasPending(key))) return null;
  const rest = visibleSentences(faq.answer).filter((s) => s !== key);
  return { faq, sentences: [key, ...rest].slice(0, 2) };
}

type GuideItem = (typeof buyerGuide.items)[number];

/** Número de la pregunta en un círculo (decorativo). */
function GuideNumber({ n }: { n: number }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-full border-2 border-accent font-display text-sm font-bold text-ink-brand shadow-[var(--glow-cyan)]"
    >
      {String(n).padStart(2, "0")}
    </span>
  );
}

const guideLink =
  "group/link inline-flex items-center gap-1.5 self-start font-display text-[15px] font-semibold text-ink-brand no-underline hover:underline";

/** Consejo y respuesta (o, sin respuesta publicable, a dónde ir). */
function GuideBody({ item, includes }: { item: GuideItem; includes: readonly string[] }) {
  const tip = guideTips[item.faqId];
  const answer = guideAnswer(item.faqId);
  const inProposal = guideInProposal[item.faqId];
  const point = inProposal ? includes.indexOf(inProposal) + 1 : 0;
  const ask = guideAsk[item.faqId] ?? guideAskDefault;
  const arrow = (
    <ArrowRightIcon
      size={16}
      className="flex-none transition-transform group-hover/link:translate-x-0.5 motion-reduce:transition-none"
    />
  );
  return (
    <>
      {tip && (
        <p className="m-0 text-[15px] leading-6 text-ink-muted">
          <span className="font-semibold text-ink">{guideCopy.tip}: </span>
          {tip}
        </p>
      )}
      <div className="mt-auto flex flex-col gap-2 border-t border-line pt-4">
        {answer ? (
          <>
            <span className="eyebrow text-ink-brand">{guideCopy.answer}</span>
            <Pend as="p" className="m-0 text-[15px] leading-6 text-ink" text={answer.sentences} />
            <Link href={`${routes.faq}#${answer.faq.id}`} prefetch={false} data-print="hide" className={guideLink}>
              {guideCopy.more}
              <span className="sr-only">: {item.question}</span>
              {arrow}
            </Link>
          </>
        ) : point > 0 ? (
          <>
            <span className="eyebrow text-ink-brand">{guideCopy.inProposal}</span>
            <a href="#que-incluye" className={guideLink}>
              {guideCopy.point(point)}: {inProposal}
              {arrow}
            </a>
          </>
        ) : (
          <a href={ask.href} className={guideLink}>
            {ask.label}
            {arrow}
          </a>
        )}
      </div>
    </>
  );
}

function Guia() {
  const shareUrl = absoluteUrl(`${routes.empresas}#guia`);
  // Misma lista y numeración que «Qué incluye cada propuesta».
  const includes = filterPending(proposalIncludes, (item) => item);
  return (
    <Section tone="sunken" id="guia" labelledBy="guia-titulo" className="sd-guia">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-16">
        <SectionHeader
          id="guia-titulo"
          eyebrow={guideCopy.eyebrow}
          title={buyerGuide.title}
          lead={buyerGuide.lead}
          className="lg:col-span-8"
        />
        <div data-print="hide" className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:col-span-4 lg:justify-end">
          <PrintGuideButton label={guideCopy.print} ubicacion={UBI} />
          <WhatsAppLink
            href={whatsappShareHref(guideCopy.shareText(shareUrl))}
            message={guideCopy.shareText(shareUrl)}
            event="guia-8-preguntas"
            ubicacion={UBI}
            variant="secondary"
          >
            {guideCopy.share}
          </WhatsAppLink>
        </div>
      </div>

      <ol className="m-0 mt-10 grid list-none gap-3 p-0 md:mt-12 md:grid-cols-2 md:gap-6 lg:mt-16">
        {buyerGuide.items.map((item, i) => (
          <Reveal as="li" key={item.faqId} className={cn(cardBase, "flex flex-col")}>
            {/* Móvil: la pregunta, y el consejo y la respuesta al abrirla. */}
            <details className="group md:hidden print:hidden">
              <summary className="flex cursor-pointer list-none items-center gap-4 p-4 text-ink [&::-webkit-details-marker]:hidden">
                <GuideNumber n={i + 1} />
                <h3 className="m-0 flex-1 font-display text-lg leading-6 font-bold tracking-[-0.01em]">
                  {item.question}
                </h3>
                <span
                  aria-hidden="true"
                  className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-full border border-line text-ink-brand transition-[transform,border-color] group-open:rotate-180 group-open:border-accent motion-reduce:transition-none"
                >
                  <ChevronDownIcon size={18} />
                </span>
              </summary>
              <div className="flex flex-col gap-4 px-4 pb-5">
                <GuideBody item={item} includes={includes} />
              </div>
            </details>
            {/* Desde 768px y al imprimir: la tarjeta abierta. */}
            <div className="hidden flex-1 flex-col gap-4 p-6 sm:p-8 md:flex print:flex">
              <span className="flex items-start gap-4">
                <GuideNumber n={i + 1} />
                <h3 className="m-0 pt-1.5 font-display text-xl leading-7 font-bold tracking-[-0.01em] text-ink">
                  {item.question}
                </h3>
              </span>
              <GuideBody item={item} includes={includes} />
            </div>
          </Reveal>
        ))}
      </ol>

      <p data-print="hide" className="m-0 mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-base leading-6 text-ink-muted">
        Más respuestas para su comité:
        <ArrowLink href={`${routes.faq}#empresas`}>Empresas y proveedores</ArrowLink>
        <ArrowLink href={`${routes.faq}#precio`}>De qué depende el precio</ArrowLink>
      </p>
      <p className="m-0 mt-8 hidden text-sm leading-5 text-ink-muted print:block">{guideCopy.printFooter}</p>
    </Section>
  );
}

/* Referencias telefónicas (4.9): solo cuando SEDIN las confirme ---------- */

function Referencias() {
  const text = kit.points[0].text;
  if (!isVisible(text)) return null;
  return (
    <Section tone="brand" id="referencias" labelledBy="referencias-titulo" space="tight">
      <PendingBlock label="Referencias telefónicas" needs={referencesCopy.needs} pending={anyPending(text)}>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-center lg:gap-12">
          <div className="flex flex-col gap-3 lg:col-span-8">
            <span className="flex items-center gap-3">
              <IconBadge Icon={BriefcaseIcon} size="sm" />
              <span className="eyebrow text-ink-brand">{referencesCopy.eyebrow}</span>
            </span>
            <h2
              id="referencias-titulo"
              className="m-0 font-display text-[clamp(26px,3vw,40px)] leading-[1.12] font-bold tracking-[-0.015em] text-ink"
            >
              {referencesCopy.title}
            </h2>
            <Pend as="p" className="m-0 text-lg leading-7 text-ink-muted" text={text} />
            <p className="m-0 text-[15px] leading-6 text-ink-muted">{referencesCopy.note}</p>
          </div>
          <div className="lg:col-span-4 lg:justify-self-end">
            <WhatsAppLink
              message={referencesCopy.message}
              event="referencia-solicitud"
              ubicacion={UBI}
              variant="primary"
              size="lg"
              block
            >
              {referencesCopy.cta}
            </WhatsAppLink>
          </div>
        </div>
      </PendingBlock>
    </Section>
  );
}

/* De la inspección al primer turno (4.10): solo los pasos ---------------- */

function Proceso() {
  return (
    <Section tone="light" id="proceso" labelledBy="proceso-titulo" space="tight">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-16">
        <SectionHeader
          id="proceso-titulo"
          eyebrow={empresasProcess.eyebrow}
          title={
            <>
              De la inspección al <Accent>primer turno</Accent>
            </>
          }
          lead={empresasProcess.lead}
          size="md"
          className="lg:col-span-8"
        />
        <ArrowLink href={`${routes.comoTrabajamos}#proceso`} className="self-start lg:col-span-4 lg:self-end lg:justify-self-end">
          {empresasProcess.more}
        </ArrowLink>
      </div>
      <ol aria-label={onboarding.title} className="m-0 mt-10 grid list-none gap-3 p-0 lg:mt-12 lg:grid-cols-5 lg:gap-4">
        {onboarding.stages.map((stage, i) => (
          <Reveal
            as="li"
            key={stage.id}
            className="flex items-center gap-3 rounded-lg border border-line-card bg-surface-sunken px-4 py-3.5 lg:flex-col lg:items-start lg:gap-2 lg:px-5 lg:py-5"
          >
            <StepNumber n={i + 1} />
            <span className="font-display text-base leading-6 font-semibold text-ink">{stage.title}</span>
          </Reveal>
        ))}
      </ol>
      <Pend as="p" className="m-0 mt-8 text-[15px] leading-6 text-ink-muted" text={onboarding.note} />
    </Section>
  );
}
