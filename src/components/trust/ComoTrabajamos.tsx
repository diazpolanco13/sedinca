import Link from "next/link";
import {
  ArrowRightIcon,
  BookIcon,
  CameraIcon,
  ChevronDownIcon,
  ClipboardCheckIcon,
  IdCardIcon,
  ShieldIcon,
  UserCheckIcon,
} from "@/components/icons";
import { SitePage } from "@/components/layout/SitePage";
import { ActionLink } from "@/components/ui/ActionLink";
import { Chip } from "@/components/ui/Chip";
import { CtaBand } from "@/components/ui/CtaBand";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHero } from "@/components/ui/PageHero";
import { Pend, PendingBlock, PendingPhoto, SourceNote } from "@/components/ui/Pending";
import { Reveal } from "@/components/ui/Reveal";
import { Accent, Section, SectionHeader } from "@/components/ui/Section";
import { ArrowLink } from "@/components/ui/SectionHeading";
import { Timeline } from "@/components/ui/Timeline";
import { MailLink } from "@/components/ui/WhatsAppLink";
import { cotizarHref, ctaLabels, routes, serviceHref, showPending, waMessages, type CtaAction } from "@/config/site";
import {
  ningunPuestoSolo,
  noArmado,
  officerRequirements,
  qualitySystem,
  quienProtege,
  quienResponde,
  reporte,
  supervision,
  trainingSyllabus,
  uniform,
} from "@/content/answers";
import { onboarding, reportTimeline } from "@/content/process";
import { cn } from "@/lib/cn";
import { isVisible } from "@/lib/pending";
import {
  comoTrabajamosHero,
  controlForms,
  ledgerPreview,
  ledgerRows,
  ledgerValue,
  methodIndex,
  promise,
  qualityAboutLink,
  qualityIndexMail,
  qualityManagement,
  relevoRules,
  supervisionRoles,
  technology,
  ubicaciones,
} from "./content";
import { CardText, CardTitle, CheckList, HeroLead, IconBadge, StepNumber } from "./TrustBlocks";

/*
 * /como-trabajamos (propuesta 8.5): el método, sin fotos de IA ni horarios.
 *   portada (foto del puente)
 *   → light   #metodo       índice del método (chips en móvil, tarjetas desde 640px)
 *   → sunken  #proceso      de la inspección al primer turno (4.10)
 *   → light   #relevos      ningún puesto queda solo + línea de tiempo (4.1, 4.2)
 *   → dark    #libro        «Vigilancia que se ve y se reporta», el libro y los FO-OP (art. 32)
 *   → light   #supervision  supervisor, Jefatura de Operaciones, Asuntos Internos (4.3, 4.5)
 *   → brand   #personal     requisitos, curso de 120 h, uniforme, no armado (4.4, 4.6)
 *   → light   #calidad · #tecnologia (blanco: tras el azul pálido de #personal)
 *   → dark    cierre
 */

const UBI = ubicaciones.comoTrabajamos;

const heroActions: CtaAction[] = [
  { kind: "whatsapp", label: ctaLabels.inspeccion, message: waMessages.inspeccion, ubicacion: UBI },
  { kind: "link", label: ctaLabels.diagnostico, href: cotizarHref(), ubicacion: UBI, event: "cta-cotizar" },
];

const cardBase = "rounded-lg border border-line-card bg-surface shadow-elevation-1";

export function ComoTrabajamosPage() {
  return (
    <SitePage>
      <PageHero
        crumbs={[{ label: "Cómo trabajamos" }]}
        eyebrow={comoTrabajamosHero.eyebrow}
        title={comoTrabajamosHero.title}
        lead={<HeroLead text={comoTrabajamosHero.lead} actions={heroActions} />}
        primary={null}
      />
      <MethodIndex />
      <Proceso />
      <Relevos />
      <Libro />
      <Supervision />
      <Personal />
      <CalidadTecnologia />
      <CtaBand
        ubicacion={UBI}
        lead="Visitamos su instalación, evaluamos accesos, perímetro y riesgos, y le enviamos una propuesta escrita con este mismo método."
        footnote={
          <>
            ¿Tiene más preguntas?{" "}
            <ArrowLink href={routes.faq} className="text-[15px]">
              Vea las preguntas frecuentes
            </ArrowLink>
          </>
        }
      />
    </SitePage>
  );
}

/* Índice del método ------------------------------------------------------- */

function MethodIndex() {
  return (
    <Section tone="light" id="metodo" labelledBy="metodo-titulo" space="tight">
      <SectionHeader
        id="metodo-titulo"
        eyebrow="El método"
        title={
          <>
            El servicio, <Accent>pieza por pieza</Accent>
          </>
        }
        lead="Cada servicio de SEDIN sigue los mismos pasos, escritos en el reglamento interno de la empresa. Elija por dónde empezar."
      />
      <nav aria-label="En esta página" className="mt-8 sm:mt-12 lg:mt-16">
        {/* Móvil: chips de 44px en 2 columnas. Desde 640px: tarjetas con texto. */}
        <ol className="m-0 grid list-none grid-cols-2 gap-2 p-0 sm:gap-4 lg:grid-cols-4 lg:gap-6">
          {methodIndex.map((item, i) => {
            const inPage = item.href.startsWith("#");
            const className =
              "card-interactive group flex min-h-11 w-full items-center gap-2.5 rounded-md border border-line-card bg-surface px-3 py-2 text-ink no-underline shadow-elevation-1 hover:text-ink sm:flex-col sm:items-stretch sm:gap-4 sm:rounded-lg sm:p-6";
            const body = (
              <>
                <item.Icon size={18} className="flex-none text-ink-brand sm:hidden" />
                <span className="hidden flex-none items-center justify-between sm:flex">
                  <IconBadge Icon={item.Icon} />
                  <StepNumber n={i + 1} />
                </span>
                <span className="font-display text-[14px] leading-[18px] font-semibold sm:hidden">{item.short}</span>
                <span className="hidden font-display text-xl leading-7 font-bold tracking-[-0.01em] sm:block">
                  {item.title}
                </span>
                <span className="hidden text-[15px] leading-[22px] text-ink-muted sm:block">{item.text}</span>
                <ArrowRightIcon
                  size={18}
                  className={cn(
                    "hidden flex-none text-ink-brand transition-transform motion-reduce:transition-none sm:mt-auto sm:block",
                    inPage ? "rotate-90 group-hover:translate-y-0.5" : "group-hover:translate-x-1",
                  )}
                />
              </>
            );
            return (
              <Reveal as="li" key={item.href} className="flex">
                {inPage ? (
                  <a href={item.href} className={className}>
                    {body}
                  </a>
                ) : (
                  <Link href={item.href} prefetch={false} className={className}>
                    {body}
                  </Link>
                )}
              </Reveal>
            );
          })}
        </ol>
      </nav>
    </Section>
  );
}

/* De la inspección al primer turno (4.10) -------------------------------- */

function Proceso() {
  return (
    <Section tone="sunken" id="proceso" labelledBy="proceso-titulo">
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
      <div className="mt-12 lg:mt-16">
        <Timeline items={onboarding.stages} variant="steps" label={onboarding.title} />
      </div>
      <Pend as="p" className="m-0 mt-10 text-[15px] leading-6 text-ink-muted" text={onboarding.note} />
      <p className="m-0 mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-line pt-8 text-base leading-6 text-ink-muted">
        Todo empieza con una visita a su instalación.
        <ActionLink
          variant="inline"
          action={{ kind: "whatsapp", label: ctaLabels.inspeccion, message: waMessages.inspeccion, ubicacion: UBI }}
        />
      </p>
    </Section>
  );
}

/* Relevos (4.1) y línea de tiempo (4.2) ---------------------------------- */

function Relevos() {
  // Entradilla: la promesa en una línea. El detalle va en las reglas y en la
  // línea de tiempo (llegada anticipada y relevo: pasos 01 y 02).
  const lead = [ningunPuestoSolo.body[0], ningunPuestoSolo.body[2]];
  return (
    <Section tone="light" id="relevos" labelledBy="relevos-titulo">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="flex flex-col gap-8 lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          <SectionHeader
            id="relevos-titulo"
            eyebrow={ningunPuestoSolo.eyebrow}
            title={
              <>
                Ningún puesto <Accent>queda solo.</Accent>
              </>
            }
            lead={<Pend text={lead} />}
          />
          <SourceNote source={ningunPuestoSolo.source} />
          <ul className="m-0 flex list-none flex-col gap-6 border-t border-line p-0 pt-8">
            {relevoRules.map((rule) => (
              <Reveal as="li" key={rule.title} className="flex gap-4">
                <IconBadge Icon={rule.Icon} size="sm" />
                <div className="flex flex-col gap-1">
                  <h3 className="m-0 font-display text-lg leading-6 font-semibold tracking-[-0.01em] text-ink">
                    {rule.title}
                  </h3>
                  <CardText text={rule.text} source={rule.source} size="sm" />
                </div>
              </Reveal>
            ))}
          </ul>
          <PendingPhoto
            label="Relevo en el puesto, con entrega de novedades y registro en el libro"
            className="aspect-[4/3]"
          />
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-xl border border-line-card bg-surface-sunken p-6 sm:p-10">
            <div className="flex flex-col gap-3">
              <span className="eyebrow text-ink-brand">{reportTimeline.eyebrow}</span>
              <h3 className="m-0 font-display text-[clamp(24px,2.4vw,32px)] leading-[1.15] font-bold tracking-[-0.015em] text-ink">
                {reportTimeline.title}
              </h3>
              <p className="m-0 text-[15px] leading-6 text-ink-muted">{reportTimeline.caption}</p>
            </div>
            <div className="mt-10">
              <Timeline items={reportTimeline.stages} label={reportTimeline.title} headingLevel="h4" />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* La promesa y el libro de novedades (art. 32) --------------------------- */

function LedgerRow({ n, text }: { n: number; text: string }) {
  return (
    <li className="grid grid-cols-[2.25rem_1fr] items-baseline gap-3 border-b border-dashed border-line py-3.5 last:border-b-0">
      <span aria-hidden="true" className="font-display text-xs font-bold tracking-[0.08em] text-cyan-300">
        {String(n).padStart(2, "0")}
      </span>
      <span className="text-[15px] leading-[22px] text-ink">{text}</span>
    </li>
  );
}

function Libro() {
  const extraReport = [reporte.body[4], reporte.body[5], ...reporte.points[1].text];
  const firstRows = ledgerRows.slice(0, ledgerPreview);
  const moreRows = ledgerRows.slice(ledgerPreview);
  return (
    <Section tone="dark" id="libro" labelledBy="libro-titulo">
      <SectionHeader
        id="libro-titulo"
        eyebrow={promise.eyebrow}
        title={
          <>
            {promise.title.text} <Accent>{promise.title.highlight}</Accent>
          </>
        }
        lead={promise.lead}
      />
      <SourceNote source={promise.source} className="mt-4" />

      {/* Las tres piezas de la promesa: filas en móvil, columnas desde 768px. */}
      <Reveal className="mt-12 lg:mt-16">
        <GlassCard tone="dark" level={2} accent className="sm:p-8">
          <ul className="m-0 grid list-none divide-y divide-line p-0 md:grid-cols-3 md:divide-x md:divide-y-0">
            {promise.pillars.map((pillar) => (
              <li
                key={pillar.label}
                className="flex flex-col gap-3 py-6 first:pt-0 last:pb-0 md:px-8 md:py-0 md:first:pl-0 md:last:pr-0"
              >
                <span className="flex items-center gap-3">
                  <IconBadge Icon={pillar.Icon} tone="dark" size="sm" />
                  <h3 className="m-0 font-display text-2xl leading-8 font-bold tracking-[-0.02em] text-ink sm:text-[28px]">
                    {pillar.label}
                  </h3>
                </span>
                <CardText text={pillar.text} source={pillar.source} />
              </li>
            ))}
          </ul>
        </GlassCard>
      </Reveal>

      <div className="mt-16 grid gap-10 border-t border-line pt-16 lg:mt-20 lg:grid-cols-12 lg:gap-16 lg:pt-20">
        <div className="lg:col-span-7">
          <div className="relative overflow-hidden rounded-lg border border-line-cyan bg-glass-2 shadow-elevation-2 backdrop-blur-glass-2 before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-[image:var(--gradient-accent-line)] before:content-['']">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-5 sm:px-8">
              <span className="flex items-center gap-3 text-ink-muted">
                <BookIcon size={22} className="text-cyan-300" />
                <span className="eyebrow">Libro de novedades</span>
              </span>
              <span className="eyebrow text-cyan-200">Foliado y rubricado</span>
            </div>
            <div className="px-6 pt-6 pb-2 sm:px-8 sm:pt-8">
              <h3 className="m-0 font-display text-2xl leading-8 font-bold tracking-[-0.01em] text-ink">
                Qué se anota en cada turno
              </h3>
            </div>
            <ol className="m-0 list-none px-6 sm:px-8">
              {firstRows.map((row, i) => (
                <LedgerRow key={row} n={i + 1} text={row} />
              ))}
            </ol>
            {moreRows.length > 0 && (
              <details className="group border-t border-dashed border-line">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-6 py-3 font-display text-[15px] font-semibold text-cyan-200 hover:text-ink sm:px-8 [&::-webkit-details-marker]:hidden">
                  Ver los otros {moreRows.length} puntos
                  <ChevronDownIcon
                    size={18}
                    className="flex-none transition-transform group-open:rotate-180 motion-reduce:transition-none"
                  />
                </summary>
                <ol start={ledgerPreview + 1} className="m-0 list-none border-t border-dashed border-line px-6 pb-2 sm:px-8">
                  {moreRows.map((row, i) => (
                    <LedgerRow key={row} n={ledgerPreview + i + 1} text={row} />
                  ))}
                </ol>
              </details>
            )}
            {showPending && (
              <div className="px-6 pt-2 pb-6 sm:px-8">
                <SourceNote source="Art. 32" />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:col-span-5">
          <SectionHeader
            as="h3"
            size="md"
            eyebrow="Por qué importa"
            title="Un documento que le sirve a usted"
            lead="El libro no es un trámite interno: es la memoria escrita de su instalación."
          />
          <dl className="m-0 flex flex-col gap-6">
            {ledgerValue.map((item) => (
              <div key={item.title} className="flex gap-4">
                <span aria-hidden="true" className="mt-2 h-2 w-2 flex-none rounded-full bg-accent shadow-[var(--glow-cyan)]" />
                <div className="flex flex-col gap-1">
                  <dt className="font-display text-lg leading-6 font-semibold text-ink">{item.title}</dt>
                  <dd className="m-0">
                    <Pend as="span" className="text-[15px] leading-6 text-ink-muted" text={item.text} />
                  </dd>
                </div>
              </div>
            ))}
          </dl>
          <CheckList items={extraReport} itemClassName="text-ink-muted" />
          <SourceNote source={reporte.source} />
        </div>
      </div>

      {/* Formularios de control: filas código + nombre, como en /nosotros. */}
      <div className="mt-16 grid gap-6 lg:mt-20 lg:grid-cols-12 lg:gap-16">
        <div className="flex flex-col gap-2 lg:col-span-5">
          <span className="eyebrow text-ink-brand">Junto al libro</span>
          <h3 className="m-0 font-display text-xl leading-7 font-bold tracking-[-0.01em] text-ink sm:text-2xl sm:leading-8">
            Formularios de control codificados
          </h3>
          <p className="m-0 text-[15px] leading-6 text-ink-muted">
            Cada entrada y salida de personas, vehículos, materiales y equipos queda en su formulario.
          </p>
          <SourceNote source="Art. 32 (referencias del procedimiento operativo)" />
        </div>
        <ul className="m-0 flex list-none flex-col p-0 lg:col-span-7">
          {controlForms.map((form) => (
            <li
              key={form.code}
              className="grid grid-cols-[88px_minmax(0,1fr)] items-baseline gap-3 border-t border-line py-3 first:border-t-0 first:pt-0"
            >
              <span className="font-display text-[13px] leading-5 font-bold tracking-[0.06em] text-cyan-300 tabular-nums">
                {form.code}
              </span>
              <span className="text-[15px] leading-[22px] text-ink">{form.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/* Supervisión (4.3) y Asuntos Internos (4.5) ----------------------------- */

function Supervision() {
  const { supervisor, jefatura, asuntosInternos } = supervisionRoles;
  const night = [supervision.body[2], supervision.body[3]];
  const roles = [
    {
      ...supervisor,
      text: [supervision.body[0], ...supervisor.extra],
    },
    {
      ...jefatura,
      // jefatura.text ya incluye la reunión con el cliente (supervision.body[1]).
      text: [...jefatura.text, supervision.body[4]],
    },
    {
      ...asuntosInternos,
      // Hechos de quienResponde (4.5) sin repetir el sujeto, más sus pendientes.
      text: [...asuntosInternos.text, quienResponde.points[0].text[2], quienResponde.points[1].text[1]],
    },
  ];
  return (
    <Section tone="light" id="supervision" labelledBy="supervision-titulo">
      <SectionHeader
        id="supervision-titulo"
        eyebrow={supervision.eyebrow}
        title={
          <>
            Supervisión en sitio, <Accent>en cada puesto</Accent>
          </>
        }
        lead="Tres funciones vigilan que el servicio se cumpla como se acordó con usted."
      />
      <SourceNote source={supervision.source} className="mt-4" />
      <ul className="m-0 mt-12 grid list-none gap-6 p-0 lg:mt-16 lg:grid-cols-3">
        {roles.map((role, i) => (
          <Reveal as="li" key={role.role} className={cn(cardBase, "flex flex-col gap-4 p-6 sm:p-8")}>
            <span className="flex items-center justify-between">
              <IconBadge Icon={role.Icon} />
              <StepNumber n={i + 1} />
            </span>
            <CardTitle>{role.role}</CardTitle>
            <CardText text={role.text} source={role.source} />
          </Reveal>
        ))}
      </ul>

      {isVisible(night) && (
        <div className="mt-6 grid gap-4 rounded-xl border border-line-cyan bg-surface-brand p-6 sm:p-8 lg:grid-cols-12 lg:items-center lg:gap-12">
          <div className="flex flex-col gap-2 lg:col-span-5">
            <span className="eyebrow text-ink-brand">De noche y sin previo aviso</span>
            <h3 className="m-0 font-display text-xl leading-7 font-bold tracking-[-0.01em] text-ink sm:text-2xl sm:leading-8">
              {supervision.question}
            </h3>
          </div>
          <Pend as="p" className="m-0 text-base leading-[26px] text-ink-muted lg:col-span-7" text={night} />
        </div>
      )}

      <PendingPhoto label="Supervisor revisando el libro de novedades en el puesto" className="mt-6 aspect-[4/3] sm:aspect-[21/9]" />

      <p className="m-0 mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-base leading-6 text-ink-muted">
        ¿Algo no le convence del servicio?
        <ArrowLink href={`${routes.faq}#quejas`}>Quién atiende las quejas</ArrowLink>
      </p>
    </Section>
  );
}

/* Quién protege su instalación (4.4) y vigilancia no armada (4.6) -------- */

function Personal() {
  const policies = quienProtege.points.filter((p) => isVisible(p.text));
  return (
    <Section tone="brand" id="personal" labelledBy="personal-titulo">
      <SectionHeader
        id="personal-titulo"
        eyebrow={quienProtege.eyebrow}
        title={
          <>
            Quién protege <Accent>su instalación</Accent>
          </>
        }
        lead="Antes de entrar a su instalación, cada oficial cumple los requisitos de ingreso y completa un curso de 120 horas aprobado por el INCES."
      />
      <SourceNote source={quienProtege.source} className="mt-4" />

      <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-12">
        <Reveal className={cn(cardBase, "flex flex-col gap-5 p-6 sm:p-8 lg:col-span-5")}>
          <IconBadge Icon={UserCheckIcon} />
          <div className="flex flex-col gap-2">
            <span className="eyebrow text-ink-brand">Antes de entrar</span>
            <CardTitle>Requisitos de ingreso</CardTitle>
          </div>
          <CheckList items={officerRequirements} />
          <SourceNote source="Art. 25" />
        </Reveal>

        <Reveal className={cn(cardBase, "relative isolate flex flex-col gap-6 overflow-hidden p-6 sm:p-8 lg:col-span-7")}>
          <span
            aria-hidden="true"
            className="dot-grid-brand absolute inset-y-0 right-0 -z-10 w-1/2 [mask-image:linear-gradient(90deg,transparent,black)]"
          />
          <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
            <p className="m-0 flex items-baseline gap-2 font-display text-ink-brand">
              <span className="text-[clamp(56px,7vw,88px)] leading-[0.9] font-bold tracking-[-0.04em]">120</span>
              <span className="text-xl font-semibold">horas</span>
            </p>
            <div className="flex max-w-[340px] flex-col gap-1 pb-1">
              <span className="eyebrow text-ink-accent">Aprobado por el INCES</span>
              <CardTitle className="sm:text-xl sm:leading-7">Curso de Formación de Oficiales de Seguridad</CardTitle>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <span className="field-label">Temario</span>
            {/* Mismo patrón que /empleo: chips en una fila desplazable en móvil, nube desde 640px. */}
            <div className="-mx-6 overflow-x-auto px-6 pb-1 [scrollbar-width:thin] sm:mx-0 sm:overflow-visible sm:px-0">
              <ul className="m-0 flex w-max list-none gap-2 p-0 sm:w-auto sm:flex-wrap">
                {trainingSyllabus.map((topic) => (
                  <li key={topic} className="flex-none">
                    <Chip className="whitespace-nowrap">{topic}</Chip>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <SourceNote source="Art. 28" />
        </Reveal>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Reveal className={cn(cardBase, "flex flex-col gap-4 p-6 sm:p-8")}>
          <IconBadge Icon={IdCardIcon} />
          <span className="eyebrow text-ink-brand">Cómo identificarlo</span>
          <CardTitle>Uniforme reglamentario</CardTitle>
          <CardText text={uniform} source="Art. 31" />
        </Reveal>
        <Reveal className={cn(cardBase, "flex flex-col gap-4 p-6 sm:p-8")}>
          <IconBadge Icon={ShieldIcon} />
          <span className="eyebrow text-ink-brand">{noArmado.eyebrow}</span>
          <CardTitle>{noArmado.title}</CardTitle>
          <CardText text={noArmado.body} source={noArmado.source} />
        </Reveal>
      </div>

      {policies.length > 0 && (
        <dl className="m-0 mt-6 grid gap-6 md:grid-cols-2">
          {policies.map((point) => (
            <div key={point.title} className={cn(cardBase, "flex flex-col gap-2 p-6")}>
              <dt className="font-display text-lg leading-6 font-semibold text-ink">{point.title}</dt>
              <dd className="m-0">
                <Pend as="span" className="text-[15px] leading-6 text-ink-muted" text={point.text} />
              </dd>
            </div>
          ))}
        </dl>
      )}

      <PendingPhoto label="Oficiales de SEDIN con el uniforme reglamentario, en un puesto" className="mt-6 aspect-[4/3] sm:aspect-[21/9]" />
    </Section>
  );
}

/* Sistema de gestión (11.5) y tecnología (art. 36) ----------------------- */

function CalidadTecnologia() {
  return (
    <Section tone="light" label="Sistema de gestión y tecnología">
      {/* 5 + 7 columnas: el sistema de gestión (sin la ficha, que está en /nosotros) es más corto. */}
      <div className="grid gap-6 lg:grid-cols-12">
        <article
          id="calidad"
          aria-labelledby="calidad-titulo"
          className="flex scroll-mt-24 flex-col gap-8 rounded-xl border border-line-card bg-surface p-6 shadow-elevation-1 sm:p-10 lg:col-span-5"
        >
          <IconBadge Icon={ClipboardCheckIcon} size="lg" />
          <SectionHeader
            id="calidad-titulo"
            size="md"
            eyebrow={qualitySystem.title}
            title={
              <>
                Procedimientos escritos, <Accent>con control de revisiones</Accent>
              </>
            }
            lead={qualitySystem.text}
          />

          <Pend as="p" className="m-0 text-[15px] leading-6 text-ink-muted" text={qualityManagement} />

          <div className="mt-auto flex flex-col gap-4 border-t border-line pt-6">
            <p className="m-0 flex flex-wrap items-center gap-x-3 gap-y-2 text-[15px] leading-6 text-ink-muted">
              {qualitySystem.onRequest}
              <MailLink
                subject={qualityIndexMail.subject}
                body={qualityIndexMail.body}
                ubicacion={UBI}
                variant="inline"
              >
                Solicitarlo por correo
              </MailLink>
            </p>
            {/* La ficha del SED-GC-PR-01 y sus formularios están en /nosotros. */}
            <ArrowLink href={qualityAboutLink.href} className="self-start">
              {qualityAboutLink.label}
            </ArrowLink>
          </div>
        </article>

        <article
          id="tecnologia"
          aria-labelledby="tecnologia-titulo"
          className="flex scroll-mt-24 flex-col gap-8 rounded-xl border border-line-card bg-surface p-6 shadow-elevation-1 sm:p-10 lg:col-span-7"
        >
          <IconBadge Icon={CameraIcon} size="lg" />
          <SectionHeader
            id="tecnologia-titulo"
            size="md"
            eyebrow="Tecnología"
            title={
              <>
                Tecnología que <Accent>apoya al oficial</Accent>
              </>
            }
            lead={technology.cameras}
          />
          <ul className="m-0 flex list-none flex-col gap-5 p-0">
            {technology.items.map((item) => (
              <li key={item.title} className="flex gap-4">
                <IconBadge Icon={item.Icon} size="sm" />
                <div className="flex flex-col gap-1">
                  <h3 className="m-0 font-display text-lg leading-6 font-semibold text-ink">{item.title}</h3>
                  <p className="m-0 text-[15px] leading-6 text-ink-muted">{item.text}</p>
                  {"source" in item && <SourceNote source={item.source} />}
                </div>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-1 border-t border-line pt-6">
            <p className="m-0 text-[15px] leading-6 text-ink-muted">{technology.sts}</p>
            <SourceNote source={technology.stsSource} />
          </div>
          <PendingBlock label="Centro de control" needs={technology.controlCenterNeeds}>
            <Pend as="p" className="m-0 text-[15px] leading-6 text-ink" text={technology.controlCenter} />
          </PendingBlock>
          <ArrowLink href={serviceHref("sistemas-electronicos")} className="mt-auto self-start">
            Ver sistemas electrónicos
          </ArrowLink>
        </article>
      </div>
    </Section>
  );
}
