import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, BookIcon } from "@/components/icons";
import { SitePage } from "@/components/layout/SitePage";
import { ActionLink } from "@/components/ui/ActionLink";
import { ButtonLink } from "@/components/ui/Button";
import { CaseStudies } from "@/components/ui/CaseCard";
import { CtaBand } from "@/components/ui/CtaBand";
import { FaqList } from "@/components/ui/FaqList";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHero } from "@/components/ui/PageHero";
import { Pend, SourceNote } from "@/components/ui/Pending";
import { Reveal } from "@/components/ui/Reveal";
import { Accent, Section, SectionHeader, type SectionTone } from "@/components/ui/Section";
import { ArrowLink } from "@/components/ui/SectionHeading";
import { Testimonials } from "@/components/ui/TestimonialCard";
import { Timeline } from "@/components/ui/Timeline";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import {
  cotizarHref,
  ctaLabels,
  hasPending,
  kitMail,
  routes,
  sectorHref,
  sectorNav,
  serviceNav,
  showPending,
} from "@/config/site";
import {
  getAnswer,
  inspeccionPrimerTurno,
  kit,
  ningunPuestoSolo,
  reporte,
  type AnswerPoint,
} from "@/content/answers";
import { canShowCases, casesCopy } from "@/content/cases";
import { getFaqs, type FaqItem } from "@/content/faq";
import { onboarding, reportTimeline } from "@/content/process";
import { otherSectors, type SectorContent } from "@/content/sectors";
import { canShowTestimonials, testimonialsCopy } from "@/content/testimonials";
import { cn } from "@/lib/cn";
import { filterPending, isVisible } from "@/lib/pending";
import { AnswerCard, answerHasContent } from "./AnswerCard";
import { HeroActions, HeroLead } from "./HeroActions";
import { JuntaShareLink } from "./JuntaShare";
import {
  sectorActions,
  sectorAnswerIds,
  sectorFaqIds,
  sectorNoun,
  sectorPhoto,
  sectorThumb,
  serviceIcons,
  showsOnboarding,
} from "./sectorView";

/*
 * Plantilla de sector (propuesta 6 y 8.2). Orden:
 *   portada (H1 + mensaje que conecta + botones según audiencia)
 *   → light   foto del sector + riesgos típicos
 *   → sunken  esquema recomendado (servicios enlazados con su porqué)
 *   → brand   testimonios y casos del sector (solo cuando existan o en
 *             revisión): justo donde el visitante decide
 *   → dark    «Ningún puesto queda solo» y cómo se reporta (4.1, 4.2)
 *   → light   respuestas según la matriz 4.11 (condominios: «Preguntas que
 *             hará su asamblea» + «Enviar a la junta por WhatsApp»; kit de
 *             proveedor fuera de la rejilla)
 *   → brand   pieza propia del sector (empresas)
 *   → light   de la inspección al primer turno (empresas, 4.10)
 *   → sunken  preguntas del sector
 *   → light   otros sectores (banda baja)
 *   → dark    cierre según audiencia (la página termina en la acción y el pie)
 */

const pad = (n: number) => String(n).padStart(2, "0");

/** ¿La pregunta se publica en el modo actual? (misma regla que FaqList). */
function faqShown(item: FaqItem) {
  return (showPending || !hasPending(item.question)) && isVisible(item.answer);
}

export function SectorTemplate({ sector }: { sector: SectorContent }) {
  const actions = sectorActions(sector);
  const residential = sector.audience === "residencial";
  const spotlightPoints = residential ? [] : sector.spotlight.points.filter((p) => isVisible(p.text));
  const faqItems = getFaqs(sectorFaqIds(sector));
  const showFaq = faqItems.some(faqShown);
  const onboardingShown = showsOnboarding(sector);
  const onboardingTone: SectionTone = spotlightPoints.length > 0 ? "light" : "brand";
  const proof = canShowTestimonials(sector.id) || canShowCases(sector.id);
  // «Otros sectores» va en claro tras las preguntas (gris); si no las hay, alterna con lo anterior.
  const othersTone: SectionTone = showFaq || (onboardingShown && onboardingTone === "brand") ? "light" : "sunken";

  return (
    <SitePage>
      <PageHero
        crumbs={[{ label: "Sectores", href: routes.sectors }, { label: sector.title }]}
        eyebrow={sector.title}
        title={sector.h1}
        lead={
          <HeroLead hook={sector.hook.title} text={sector.lead}>
            <HeroActions actions={actions} />
          </HeroLead>
        }
        primary={null}
      />

      <SectorIntro sector={sector} />
      <SectorScheme sector={sector} />
      {proof && <SectorProof sector={sector} />}
      <SectorPromise />
      <SectorAnswers sector={sector} empresasLink={spotlightPoints.length === 0} />
      {spotlightPoints.length > 0 && <SectorSpotlight sector={sector} points={spotlightPoints} />}
      {onboardingShown && <SectorOnboarding tone={onboardingTone} />}
      {showFaq && <SectorFaq sector={sector} items={faqItems} />}
      <OtherSectors sector={sector} tone={othersTone} />

      <CtaBand
        actions={actions}
        whatsappMessage={sector.whatsapp}
        ubicacion={sector.ubicacion}
        lead={
          residential
            ? "Un asesor le responde por WhatsApp y coordina con usted la inspección del conjunto. Sin compromiso."
            : "Envíenos el pliego o el alcance y le preparamos una propuesta técnica y económica. También coordinamos una visita técnica a su instalación."
        }
        footnote={
          residential ? (
            <>
              ¿Lo decide la asamblea?{" "}
              <JuntaShareLink ubicacion={sector.ubicacion} variant="inline">
                Envíe el resumen a la junta por WhatsApp
              </JuntaShareLink>
            </>
          ) : (
            <>
              ¿Necesita registrar a SEDIN como proveedor?{" "}
              <ActionLink action={kitMail(sector.ubicacion)} variant="inline" />
            </>
          )
        }
      />
    </SitePage>
  );
}

/* Foto del sector + riesgos típicos -------------------------------------- */

function SectorIntro({ sector }: { sector: SectorContent }) {
  const photo = sectorPhoto(sector);
  const focus = filterPending(sector.focus, (f) => f);
  return (
    <Section tone="light" id="riesgos" labelledBy="riesgos-titulo">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        {/* Foto de IA, solo ambientación (nunca «nuestro equipo»). Recorte
            vertical o cuadrado: nunca más ancho que 1:1 (ver sectorView). */}
        <div className="relative isolate flex aspect-square overflow-hidden rounded-xl bg-azure-950 shadow-elevation-2 lg:col-span-5 lg:aspect-auto lg:min-h-[560px]">
          <Image
            src={photo.src}
            alt={sector.photo.alt}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className={cn("-z-10 object-cover", photo.position)}
          />
          {/* Velo más denso a media altura: el antetítulo cae a veces sobre cielo claro.
              Desde 1024px (tarjeta alta, gancho más corto), solo en la mitad
              inferior: el oficial de la foto queda a la vista. */}
          <span
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-linear-to-t from-azure-950/95 via-azure-950/70 to-azure-950/0 lg:from-20% lg:via-azure-950/60 lg:via-45% lg:to-65%"
          />
          <div className="mt-auto flex flex-col gap-3 p-6 sm:p-8">
            <span className="eyebrow inline-flex items-center gap-3 text-cyan-200 [text-shadow:0_1px_8px_rgba(4,13,31,0.6)]">
              <span aria-hidden="true" className="h-0.5 w-8 rounded-full bg-[image:var(--gradient-accent-line)]" />
              {sector.shortTitle}
            </span>
            <Pend
              as="p"
              className="m-0 font-display text-lg leading-7 font-semibold tracking-[-0.01em] text-white sm:text-xl sm:leading-8 lg:text-lg lg:leading-7"
              text={sector.hook.text}
            />
          </div>
        </div>

        <div className="flex flex-col gap-10 lg:col-span-7 lg:py-2">
          <SectionHeader
            id="riesgos-titulo"
            eyebrow="Riesgos típicos"
            title={
              <>
                Lo que más expone a <Accent>{sectorNoun[sector.id]}</Accent>
              </>
            }
            lead="En la inspección del sitio revisamos cada uno de estos puntos y diseñamos el esquema para cubrirlos."
            size="md"
          />
          <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 sm:gap-6">
            {sector.pains.map((pain, i) => (
              <Reveal
                as="li"
                key={pain.title}
                className="flex flex-col gap-2 rounded-lg border border-line-card bg-surface p-6 shadow-elevation-1"
              >
                <span aria-hidden="true" className="font-display text-sm font-bold tracking-[0.08em] text-ink-accent">
                  {pad(i + 1)}
                </span>
                <h3 className="m-0 font-display text-lg leading-6 font-bold tracking-[-0.01em] text-ink sm:text-xl sm:leading-7">
                  {pain.title}
                </h3>
                <Pend as="p" className="m-0 text-[15px] leading-[22px] text-ink-muted" text={pain.text} />
              </Reveal>
            ))}
          </ul>
          {focus.length > 0 && (
            <div className="flex flex-col gap-3">
              <span className="field-label">Instalaciones típicas</span>
              <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                {focus.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm leading-5 text-ink-muted"
                  >
                    <Pend text={item} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}

/* Esquema recomendado ----------------------------------------------------- */

function SectorScheme({ sector }: { sector: SectorContent }) {
  return (
    <Section tone="sunken" id="esquema" labelledBy="esquema-titulo">
      <SectionHeader
        id="esquema-titulo"
        eyebrow="Esquema recomendado"
        title={
          <>
            Lo que recomendamos para <Accent>{sectorNoun[sector.id]}</Accent>
          </>
        }
        lead="Es el punto de partida. En la inspección del sitio se definen con usted los puestos, los oficiales y los controles."
      />
      <ol
        className={cn(
          "mt-12 grid list-none gap-6 p-0 sm:grid-cols-2 lg:mt-16",
          sector.scheme.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
        )}
      >
        {sector.scheme.map((item, i) => {
          const Icon = serviceIcons[item.service];
          const service = serviceNav[item.service];
          return (
            <Reveal as="li" key={item.service} className="flex">
              <Link
                href={service.href}
                prefetch={false}
                className="card-interactive group flex w-full flex-col gap-4 rounded-lg border border-line-card bg-surface p-6 text-ink no-underline shadow-elevation-1 hover:text-ink sm:p-7"
              >
                <span className="flex items-center justify-between">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-surface-brand text-ink-brand">
                    <Icon size={24} />
                  </span>
                  <span aria-hidden="true" className="font-display text-sm font-bold tracking-[0.08em] text-ink-accent">
                    {pad(i + 1)}
                  </span>
                </span>
                <h3 className="m-0 font-display text-xl leading-7 font-bold tracking-[-0.01em]">{service.label}</h3>
                <Pend as="p" className="m-0 text-[15px] leading-[22px] text-ink-muted" text={item.why} />
                <span className="mt-auto inline-flex items-center gap-1.5 pt-2 font-display text-sm font-semibold text-ink-brand">
                  Ver el servicio
                  <ArrowRightIcon
                    size={16}
                    className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                  />
                </span>
              </Link>
            </Reveal>
          );
        })}
      </ol>
      <p className="m-0 mt-10 flex flex-wrap items-center gap-x-2 gap-y-1 text-base leading-6 text-ink-muted">
        ¿Su caso es distinto?
        <ActionLink
          variant="inline"
          action={{
            kind: "link",
            label: ctaLabels.diagnostico,
            href: cotizarHref({ sector: sector.id }),
            ubicacion: sector.ubicacion,
            event: "cta-cotizar",
          }}
        />
      </p>
    </Section>
  );
}

/* «Ningún puesto queda solo» y cómo se reporta (4.1 y 4.2) --------------- */

function SectorPromise() {
  const points = (reporte.points as readonly AnswerPoint[]).filter((p) => isVisible(p.text));
  return (
    <Section tone="dark" id="reporte" labelledBy="promesa-titulo">
      <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-16">
        <div className="flex flex-col gap-6 lg:col-span-6">
          <SectionHeader
            id="promesa-titulo"
            eyebrow={ningunPuestoSolo.eyebrow}
            title={ningunPuestoSolo.title}
            lead={<Pend text={ningunPuestoSolo.body} />}
          />
          <SourceNote source={ningunPuestoSolo.source} />
          <ArrowLink href={ningunPuestoSolo.link.href} className="self-start">
            {ningunPuestoSolo.link.label}
          </ArrowLink>
        </div>

        <GlassCard tone="dark" level={2} accent className="p-6 sm:p-8 lg:col-span-6">
          <div className="flex flex-col gap-5">
            <span className="flex items-center gap-3 text-ink-muted">
              <BookIcon size={22} className="text-cyan-300" />
              <span className="eyebrow">Libro de novedades</span>
            </span>
            <h3 className="m-0 font-display text-2xl leading-8 font-bold tracking-[-0.01em] text-ink">
              Cada novedad, por escrito
            </h3>
            <Pend as="p" className="m-0 text-base leading-[26px] text-ink-muted" text={reporte.body} />
            {points.length > 0 && (
              <dl className="m-0 flex flex-col gap-4 border-t border-line pt-5">
                {points.map((point) => (
                  <div key={point.title} className="flex flex-col gap-1">
                    <dt className="font-display text-[15px] font-semibold text-ink">{point.title}</dt>
                    <dd className="m-0 flex flex-col gap-1">
                      <Pend as="span" className="text-[15px] leading-[22px] text-ink-muted" text={point.text} />
                      <SourceNote source={point.source} />
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            <SourceNote source={reporte.source} />
            <ArrowLink href={reporte.link.href} className="self-start">
              {reporte.link.label}
            </ArrowLink>
          </div>
        </GlassCard>
      </div>

      {/* Los 6 pasos del reporte, solo desde 1024px: en móvil alargaban la
          ficha y ya están en Inicio y en /como-trabajamos (enlace «Ver cómo se
          hacen los relevos», arriba). */}
      <div className="mt-16 hidden gap-10 border-t border-line pt-16 lg:mt-20 lg:grid lg:grid-cols-12 lg:gap-16 lg:pt-20">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionHeader
              as="h3"
              size="md"
              eyebrow={reportTimeline.eyebrow}
              title={reportTimeline.title}
              lead={reportTimeline.caption}
            />
          </div>
        </div>
        <div className="lg:col-span-7">
          <Timeline items={reportTimeline.stages} label={reportTimeline.title} headingLevel="h4" />
        </div>
      </div>
    </Section>
  );
}

/* Respuestas de la sección 4 según la matriz 4.11 ------------------------ */

/**
 * Ancho de cada tarjeta de respuesta en la rejilla de 6 columnas (lg) y de 2
 * (md): filas de 3, y la última fila de 2 tarjetas a media anchura, para que
 * no queden huecos (5 tarjetas: 3 + 2; 4: 2 + 2).
 */
function answerSpan(i: number, n: number) {
  const md = n % 2 === 1 && i === n - 1 ? "md:col-span-2" : "";
  let lg = "lg:col-span-2";
  if (n === 1) lg = "lg:col-span-6";
  else if (n % 3 === 2 && i >= n - 2) lg = "lg:col-span-3";
  else if (n % 3 === 1 && i >= n - 4) lg = "lg:col-span-3";
  return cn(md, lg);
}

/** `empresasLink`: el enlace a /empresas del kit, solo si la pieza propia (que lo lleva justo después) no se pinta. */
function SectorAnswers({ sector, empresasLink }: { sector: SectorContent; empresasLink: boolean }) {
  const residential = sector.audience === "residencial";
  const ids = sectorAnswerIds(sector);
  // El kit de proveedor va fuera de la rejilla (es una acción, no una respuesta larga).
  const cards = ids.filter((id) => id !== "kit").map(getAnswer).filter(answerHasContent);
  const showKit = ids.includes("kit") && answerHasContent(kit);
  return (
    <Section tone="light" id="respuestas" labelledBy="respuestas-titulo">
      <SectionHeader
        id="respuestas-titulo"
        eyebrow="Antes de contratar"
        title={
          residential ? (
            <>
              Preguntas que hará su <Accent>asamblea</Accent>
            </>
          ) : (
            <>
              Lo que su empresa <Accent>necesita saber</Accent>
            </>
          )
        }
        lead={
          residential
            ? "Lo que suelen preguntar los propietarios antes de contratar la vigilancia del conjunto, respondido por SEDIN."
            : "Personal, precio, contrato y documentos: las respuestas que se piden antes de aprobar un proveedor de vigilancia."
        }
      />
      <ul className="mt-12 grid list-none gap-6 p-0 md:grid-cols-2 lg:mt-16 lg:grid-cols-6">
        {cards.map((answer, i) => (
          <Reveal as="li" key={answer.id} className={cn("flex", answerSpan(i, cards.length))}>
            <AnswerCard answer={answer} className="w-full" />
          </Reveal>
        ))}
      </ul>
      {showKit && <KitStrip sector={sector} empresasLink={empresasLink} />}
      {residential && <JuntaPanel sector={sector} />}
    </Section>
  );
}

/**
 * Kit de proveedor (4.9) fuera de la rejilla: en condominios, una línea con
 * el enlace; en empresas, una banda a todo el ancho con sus dos enlaces.
 */
function KitStrip({ sector, empresasLink }: { sector: SectorContent; empresasLink: boolean }) {
  const points = (kit.points as readonly AnswerPoint[]).filter((p) => isVisible(p.text));
  if (sector.audience === "residencial") {
    return (
      <p className="m-0 mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-base leading-6 text-ink-muted">
        <span className="font-semibold text-ink">¿La administración pide documentos de proveedor?</span>
        <Pend as="span" text={kit.body} />
        <ActionLink action={kitMail(sector.ubicacion)} variant="inline" />
      </p>
    );
  }
  return (
    <div className="mt-6 flex flex-col gap-6 rounded-lg border border-line-card bg-surface-sunken p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
      <div className="flex max-w-[720px] flex-col gap-2">
        <span className="eyebrow text-ink-brand">{kit.eyebrow}</span>
        <h3 className="m-0 font-display text-xl leading-7 font-bold tracking-[-0.01em] text-ink sm:text-2xl sm:leading-8">
          {kit.title}
        </h3>
        <Pend as="p" className="m-0 text-[15px] leading-6 text-ink-muted sm:text-base sm:leading-[26px]" text={kit.body} />
        {points.map((point) => (
          <Pend
            key={point.title}
            as="p"
            className="m-0 text-[15px] leading-6 text-ink-muted"
            text={point.text}
          />
        ))}
        <SourceNote source={kit.source} />
      </div>
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center lg:flex-none lg:flex-col lg:items-end">
        <ActionLink action={kitMail(sector.ubicacion)} variant="secondary" size="md" />
        {empresasLink && (
          <ArrowLink href={kit.link.href} className="text-[15px]">
            {kit.link.label}
          </ArrowLink>
        )}
      </div>
    </div>
  );
}

/**
 * «Para la junta de condominio»: la acción de la sección (6.2, 8.8), con el
 * resumen imprimible y «Enviar a la junta por WhatsApp». Titular propio: no
 * repite el de la sección.
 */
function JuntaPanel({ sector }: { sector: SectorContent }) {
  const { spotlight } = sector;
  return (
    <div className="relative isolate mt-12 grid gap-8 overflow-hidden rounded-xl border border-line-cyan bg-surface-brand p-6 shadow-elevation-1 sm:p-10 lg:mt-16 lg:grid-cols-12 lg:items-center lg:gap-12">
      <span
        aria-hidden="true"
        className="dot-grid-brand absolute inset-y-0 right-0 -z-10 w-1/2 [mask-image:linear-gradient(90deg,transparent,black)]"
      />
      <div className="flex flex-col gap-3 lg:col-span-7">
        <span className="eyebrow inline-flex items-center gap-3 text-ink-brand">
          <span aria-hidden="true" className="h-0.5 w-8 rounded-full bg-[image:var(--gradient-accent-line)]" />
          {spotlight.eyebrow}
        </span>
        <h3 className="m-0 font-display text-[clamp(24px,2.6vw,34px)] leading-[1.15] font-bold tracking-[-0.015em] text-ink">
          Compártalas con la junta
        </h3>
        {/* Solo la entradilla: el punto «Resumen para imprimir» decía lo mismo. */}
        {spotlight.lead && <Pend as="p" className="m-0 text-base leading-[26px] text-ink-muted" text={spotlight.lead} />}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:col-span-5 lg:flex-col lg:items-stretch">
        <JuntaShareLink ubicacion={sector.ubicacion} size="lg" block />
        <ButtonLink href={routes.resumen} variant="secondary" size="lg" block>
          Ver el resumen para imprimir
        </ButtonLink>
      </div>
    </div>
  );
}

/* Pieza propia del sector (empresas) -------------------------------------- */

function SectorSpotlight({
  sector,
  points,
}: {
  sector: SectorContent;
  points: SectorContent["spotlight"]["points"];
}) {
  const { spotlight } = sector;
  return (
    <Section tone="brand" id="cumplimiento" labelledBy="cumplimiento-titulo">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="flex flex-col gap-8 lg:col-span-5">
          <SectionHeader
            id="cumplimiento-titulo"
            eyebrow={spotlight.eyebrow}
            title={spotlight.title}
            lead={spotlight.lead ? <Pend text={spotlight.lead} /> : undefined}
            size="md"
          />
          <div className="flex flex-col items-start gap-4 border-t border-line pt-6">
            <p className="m-0 text-[15px] leading-6 text-ink-muted">
              Ficha de proveedor, kit de documentos y propuesta formal, en una sola página.
            </p>
            <ButtonLink href={routes.empresas} variant="secondary" size="md">
              Ir a la página para empresas
            </ButtonLink>
          </div>
        </div>
        <ul className="m-0 grid list-none content-start gap-6 p-0 sm:grid-cols-2 lg:col-span-7">
          {points.map((point, i) => (
            <Reveal
              as="li"
              key={point.title}
              className={cn(
                "flex flex-col gap-3 rounded-lg border border-line-card bg-surface p-6 shadow-elevation-1",
                // Con un número impar de puntos, el último ocupa la fila entera (sin hueco).
                points.length % 2 === 1 && i === points.length - 1 && "sm:col-span-2",
              )}
            >
              <h3 className="m-0 font-display text-lg leading-6 font-bold tracking-[-0.01em] text-ink sm:text-xl sm:leading-7">
                {point.title}
              </h3>
              <Pend as="p" className="m-0 text-[15px] leading-[22px] text-ink-muted" text={point.text} />
              <SourceNote source={point.source} />
              {point.link && (
                <ArrowLink href={point.link.href} className="mt-auto self-start pt-1 text-[15px]">
                  {point.link.label}
                </ArrowLink>
              )}
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/* De la inspección al primer turno (4.10) --------------------------------- */

function SectorOnboarding({ tone }: { tone: SectionTone }) {
  return (
    <Section tone={tone} id="proceso" labelledBy="proceso-titulo">
      <SectionHeader
        id="proceso-titulo"
        eyebrow={onboarding.eyebrow}
        title={
          <>
            De la inspección al <Accent>primer turno</Accent>
          </>
        }
        lead={onboarding.lead}
      />
      {/* En móvil, la lista compacta de pasos (como /empresas); el detalle de
          cada paso está en «Ver el proceso completo». */}
      <ol aria-label={onboarding.title} className="m-0 mt-8 grid list-none gap-3 p-0 lg:hidden">
        {onboarding.stages.map((stage, i) => (
          <li
            key={stage.id}
            className="flex items-center gap-3 rounded-lg border border-line-card bg-surface px-4 py-3.5 shadow-elevation-1"
          >
            <span
              aria-hidden="true"
              className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-full border-2 border-accent font-display text-sm font-bold text-ink-brand"
            >
              {pad(i + 1)}
            </span>
            <span className="font-display text-base leading-6 font-semibold text-ink">{stage.title}</span>
          </li>
        ))}
      </ol>
      <div className="hidden lg:block">
        <Timeline items={onboarding.stages} variant="steps" label={onboarding.title} className="mt-16" />
      </div>
      <div className="mt-10 flex flex-col gap-3">
        <Pend as="p" className="m-0 text-sm leading-5 text-ink-muted" text={onboarding.note} />
        <ArrowLink href={inspeccionPrimerTurno.link.href} className="self-start">
          {inspeccionPrimerTurno.link.label}
        </ArrowLink>
      </div>
    </Section>
  );
}

/* Preguntas del sector ---------------------------------------------------- */

function SectorFaq({ sector, items }: { sector: SectorContent; items: FaqItem[] }) {
  const residential = sector.audience === "residencial";
  return (
    <Section tone="sunken" id="preguntas" labelledBy="preguntas-titulo">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="flex flex-col gap-6 lg:col-span-4">
          <SectionHeader
            id="preguntas-titulo"
            eyebrow="Preguntas del sector"
            title={residential ? "Otras preguntas de la junta" : "Otras preguntas frecuentes"}
            lead="¿No encuentra su duda? Escríbanos y le respondemos."
            size="md"
          />
          <div className="flex flex-col items-start gap-4">
            <WhatsAppLink message={sector.whatsapp} ubicacion={sector.ubicacion} variant="inline">
              Preguntar por WhatsApp
            </WhatsAppLink>
            <ArrowLink href={routes.faq}>Ver todas las preguntas frecuentes</ArrowLink>
          </div>
        </div>
        <div className="lg:col-span-8">
          <FaqList items={items} jsonLd exclusive="faq-sector" />
        </div>
      </div>
    </Section>
  );
}

/* Testimonios y casos del sector (pendientes hasta tenerlos) ------------- */

function SectorProof({ sector }: { sector: SectorContent }) {
  const testimonials = canShowTestimonials(sector.id);
  const cases = canShowCases(sector.id);
  return (
    <Section tone="brand" id="clientes" labelledBy="clientes-titulo">
      {testimonials && (
        <>
          <SectionHeader
            id="clientes-titulo"
            eyebrow={testimonialsCopy.eyebrow}
            title={testimonialsCopy.title}
            lead={testimonialsCopy.lead}
          />
          <Testimonials sector={sector.id} className="mt-12" />
        </>
      )}
      {cases && (
        <div className={cn(testimonials && "mt-16 lg:mt-20")}>
          <SectionHeader
            id={testimonials ? undefined : "clientes-titulo"}
            as={testimonials ? "h3" : "h2"}
            size={testimonials ? "md" : "lg"}
            eyebrow={casesCopy.eyebrow}
            title={casesCopy.title}
            lead={casesCopy.lead}
          />
          <CaseStudies sector={sector.id} className="mt-10" />
        </div>
      )}
    </Section>
  );
}

/* Otros sectores (banda baja, antes del cierre) -------------------------- */

function OtherSectors({ sector, tone }: { sector: SectorContent; tone: SectionTone }) {
  return (
    <Section tone={tone} space="tight" id="otros-sectores" labelledBy="otros-sectores-titulo">
      <SectionHeader
        id="otros-sectores-titulo"
        eyebrow="Otros sectores"
        title="¿Protege otro tipo de instalación?"
        size="md"
        actions={<ArrowLink href={routes.sectors}>Ver todos los sectores</ArrowLink>}
      />
      <ul className="m-0 mt-8 grid list-none gap-3 p-0 sm:grid-cols-3 sm:gap-6 lg:mt-10">
        {otherSectors(sector.id).map((other) => (
          <Reveal as="li" key={other.id} className="flex">
            <Link
              href={sectorHref(other.id)}
              prefetch={false}
              className="card-interactive group flex w-full items-center gap-4 rounded-lg border border-line-card bg-surface p-3 pr-4 text-ink no-underline shadow-elevation-1 hover:text-ink sm:pr-5"
            >
              {/* Miniatura de la foto (IA, solo ambientación): recorte de 160×124. */}
              <Image
                src={sectorThumb(other.id)}
                alt=""
                width={160}
                height={124}
                className="h-[62px] w-20 flex-none rounded-md object-cover sm:h-[74px] sm:w-24"
              />
              <span className="flex min-w-0 flex-col gap-0.5">
                {/* Mismo nombre que el menú, /sectores y la ruta (la línea de abajo ya dice qué instalaciones). */}
                <span className="font-display text-[17px] leading-6 font-bold tracking-[-0.01em]">{other.title}</span>
                <span className="text-sm leading-5 text-ink-muted">{sectorNav[other.id].description}</span>
              </span>
              <ArrowRightIcon
                size={18}
                className="ml-auto flex-none text-ink-brand transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
              />
            </Link>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
