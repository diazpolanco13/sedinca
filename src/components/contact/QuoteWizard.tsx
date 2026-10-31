"use client";

import {
  Suspense,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  ArrowRightIcon,
  BuildingIcon,
  CheckIcon,
  ChevronDownIcon,
  HomeIcon,
  MailIcon,
  OilRigIcon,
  StoreIcon,
  WarehouseIcon,
  WhatsAppIcon,
} from "@/components/icons";
import {
  branchSteps,
  empresaInstallations,
  installation,
  installationSector,
  serviceWhy,
  titles,
  TOTAL_STEPS,
  type Branch,
  type Group,
  type Option,
  type SectorSchemes,
  type Step,
} from "@/components/contact/diagnostico";
import {
  nameError,
  openExternal,
  PHONE_RE,
  phoneError,
  serviceLabel,
  track,
  useQuoteParams,
  WA_FROM,
  type QuoteParams,
  type ServiceSlug,
} from "@/components/contact/quoteShared";
import { MOBILE_BAR_HEIGHT } from "@/components/layout/MobileActionBar";
import { usePastHero } from "@/components/layout/usePastHero";
import { Button } from "@/components/ui/Button";
import { CopyMessageButton } from "@/components/ui/CopyMessageButton";
import { FieldError, Input } from "@/components/ui/form";
import { textLink } from "@/components/ui/links";
import { CallLink } from "@/components/ui/WhatsAppLink";
import {
  composeMessage,
  mailtoHref,
  serviceHref,
  serviceSlugs,
  site,
  whatsappHref,
} from "@/config/site";
import { cn } from "@/lib/cn";

/*
 * Diagnóstico guiado (propuesta 8.3, 10 y 15.6). Cuatro pasos con opciones
 * grandes e indicador «PASO X DE 4».
 * - Con puntero, elegir una opción en un paso de una sola respuesta avanza
 *   solo; con teclado, las flechas eligen sin avanzar y Intro o «Continuar»
 *   avanzan.
 * - Cada paso es un <form> con <fieldset> y <legend>; el foco pasa al título
 *   del paso (tabindex=-1) y el progreso se anuncia en una región aria-live.
 * - En móvil, desde el paso 2, la fila «Atrás / Continuar» queda fija por
 *   encima de la barra de contacto, para que nunca quede tapada por ella.
 * - Precarga `?sector=` (se salta el paso 1) y `?servicio=` (entra en el
 *   esquema recomendado).
 * - Resultado: titular, resumen de respuestas, servicios compactos y, enseguida,
 *   el nombre y «Enviar por WhatsApp». Lo opcional (otros datos, precio,
 *   cambiar respuestas) va después o plegado.
 * - Sin receptor: el resultado se envía por WhatsApp ya escrito; en la rama
 *   de empresa, también por correo. «Copiar el mensaje» en escritorio.
 * - El contenedor lleva `data-wizard` (lo oculta el aviso <noscript>) y
 *   `data-wizard-state` («steps» o «result»).
 */

export interface QuoteWizardProps {
  /** Ubicación para Umami: `cotizar`, `contacto`… */
  ubicacion: string;
  /** Nivel del título del diagnóstico (2 en /cotizar, 3 dentro de una sección). */
  headingLevel?: 2 | 3;
  /** Texto de cada servicio por sector (`sectorSchemes()`, en el servidor). */
  schemes?: SectorSchemes;
  /** Bloque «¿De qué depende el precio?» ya pintado en el servidor (4.7). */
  priceNote?: ReactNode;
  className?: string;
}

type Answers = Record<string, string[]>;
type Contact = { nombre: string; org: string; ubicacion: string; telefono: string; detalle: string };
type ContactErrors = Partial<Record<"nombre" | "telefono", string>>;

const emptyContact: Contact = { nombre: "", org: "", ubicacion: "", telefono: "", detalle: "" };

const optionIcons: Record<string, typeof HomeIcon> = {
  condominio: HomeIcon,
  comercio: StoreIcon,
  planta: WarehouseIcon,
  petroleo: OilRigIcon,
  otro: BuildingIcon,
};

const branchOf = (a: Answers): Branch =>
  empresaInstallations.includes(a.instalacion?.[0] ?? "") ? "empresa" : "diagnostico";

const stepsOf = (a: Answers): readonly Step[] => [installation, ...branchSteps[branchOf(a)]];

const optionLabel = (g: Group, id: string) => g.options.find((o) => o.id === id)?.label;

/** Servicios recomendados (1 a 3) con las respuestas que los justifican. */
function recommend(a: Answers, servicio?: ServiceSlug) {
  const scores = new Map<ServiceSlug, number>();
  // Cada «por qué» con los servicios que puede justificar; al final se cita
  // en uno solo: el mejor situado de ellos en la recomendación (así un empate
  // de puntos no repite el mismo motivo en dos tarjetas).
  const why: { text: string; slugs: ServiceSlug[] }[] = [];
  const cite = (text: string | undefined, slugs: ServiceSlug[]) => {
    if (!text || !slugs.length) return;
    const same = why.find((w) => w.text === text);
    if (same) same.slugs.push(...slugs.filter((slug) => !same.slugs.includes(slug)));
    else why.push({ text, slugs });
  };
  if (servicio) {
    scores.set(servicio, 4);
    cite("Es el servicio que consultó", [servicio]);
  }
  for (const step of stepsOf(a)) {
    for (const g of step.groups) {
      for (const id of a[g.id] ?? []) {
        const o = g.options.find((x) => x.id === id);
        if (!o) continue;
        for (const [key, points] of Object.entries(o.score ?? {})) {
          const slug = key as ServiceSlug;
          scores.set(slug, (scores.get(slug) ?? 0) + (points ?? 0));
        }
        // Motivo propio de cada servicio (una cadena vacía: puntos sin motivo).
        for (const [key, text] of Object.entries(o.reasons ?? {})) cite(text, [key as ServiceSlug]);
        // El tipo de instalación ya está en el resumen y en el texto de cada
        // servicio: como «por qué» solo cuentan las respuestas de los pasos 2-4,
        // y solo en los servicios a los que más aportan.
        if (g.id === "instalacion") continue;
        const top = Math.max(0, ...Object.values(o.score ?? {}).map((n) => n ?? 0));
        const best = Object.entries(o.score ?? {})
          .filter(([key, n]) => (n ?? 0) === top && !(o.reasons && key in o.reasons))
          .map(([key]) => key as ServiceSlug);
        cite(o.reason ?? o.label, best);
      }
    }
  }
  // Quien ya tiene cámaras (sin nadie que las revise) no necesita que le
  // recomendemos cámaras, salvo que lo pida el perímetro o lo haya consultado.
  const worries = a.preocupa ?? [];
  if (worries.includes("camaras") && !worries.includes("perimetro") && servicio !== "sistemas-electronicos") {
    scores.delete("sistemas-electronicos");
  }
  const order = (slug: ServiceSlug) => serviceSlugs.indexOf(slug);
  const ranked = [...scores.entries()]
    .filter(([, score]) => score >= 2)
    .sort(([sa, a1], [sb, b1]) => b1 - a1 || order(sa) - order(sb))
    .slice(0, 3)
    .map(([slug]) => slug);
  return ranked.map((slug) => ({
    slug,
    reasons: why
      .filter((w) => ranked.find((s) => w.slugs.includes(s)) === slug)
      .map((w) => w.text)
      .slice(0, 3),
  }));
}

/** Con `?sector=`/`?servicio=` en la URL (dentro de Suspense). */
function WizardFromUrl(props: QuoteWizardProps) {
  const { key, ...params } = useQuoteParams();
  return <Wizard key={key} {...props} {...params} />;
}

/**
 * Diagnóstico de seguridad. En la exportación estática se pinta sin
 * parámetros (paso 1); en el navegador lee `?sector=` y `?servicio=`.
 */
export function QuoteWizard(props: QuoteWizardProps) {
  return (
    <Suspense fallback={<Wizard {...props} />}>
      <WizardFromUrl {...props} />
    </Suspense>
  );
}

function Wizard({
  ubicacion,
  headingLevel = 2,
  schemes,
  priceNote,
  className,
  sector,
  servicio,
}: QuoteWizardProps & QuoteParams) {
  const uid = useId();
  const presetOption = Object.keys(installationSector).find((k) => installationSector[k] === sector);
  const [answers, setAnswers] = useState<Answers>(presetOption ? { instalacion: [presetOption] } : {});
  const [step, setStep] = useState(presetOption ? 1 : 0);
  const [missing, setMissing] = useState<string | null>(null);
  const [announce, setAnnounce] = useState("");
  const [contact, setContact] = useState<Contact>(emptyContact);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [sent, setSent] = useState<"whatsapp" | "correo" | null>(null);
  // La barra de contacto de móvil: exactamente el mismo criterio que usa
  // MobileActionBar (los botones de la portada, o la portada entera).
  const barShown = usePastHero(72, "actions");

  const rootRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moreRef = useRef<HTMLDetailsElement>(null);
  const moved = useRef(false);
  const pointer = useRef(false);
  const timer = useRef<number | undefined>(undefined);

  const branch = branchOf(answers);
  const steps = stepsOf(answers);
  const isResult = step >= TOTAL_STEPS;
  const rama = branch === "empresa" ? "empresa" : "condominio";

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Al cambiar de paso (no al cargar): el título del paso recibe el foco y,
  // si el diagnóstico quedó por encima de la pantalla, vuelve a verse.
  useEffect(() => {
    if (!moved.current) return;
    const root = rootRef.current;
    if (root && root.getBoundingClientRect().top < 0) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      root.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
    }
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  function move(next: number, a: Answers = answers) {
    window.clearTimeout(timer.current);
    moved.current = true;
    setMissing(null);
    setStep(next);
    setAnnounce(
      next >= TOTAL_STEPS
        ? "Diagnóstico completado"
        : `Paso ${next + 1} de ${TOTAL_STEPS}: ${stepsOf(a)[next].title}`,
    );
  }

  function goNext(a: Answers = answers) {
    const current = stepsOf(a)[step];
    const empty = current.groups.find((g) => !a[g.id]?.length);
    if (empty) {
      setMissing(empty.id);
      rootRef.current?.querySelector<HTMLInputElement>(`[data-group="${empty.id}"] input`)?.focus();
      return;
    }
    const data = { rama: branchOf(a) === "empresa" ? "empresa" : "condominio", ubicacion };
    track(`cotizador-paso-${step + 1}`, data);
    if (step + 1 >= TOTAL_STEPS) track("cotizador-resultado", data);
    move(step + 1, a);
  }

  function choose(g: Group, o: Option, checked: boolean) {
    const current = answers[g.id] ?? [];
    const value = g.multi
      ? checked
        ? [...current.filter((id) => id !== o.id), o.id]
        : current.filter((id) => id !== o.id)
      : [o.id];
    const next = { ...answers, [g.id]: value };
    setAnswers(next);
    if (missing === g.id) setMissing(null);
    return next;
  }

  /** Con puntero, en un paso de una sola respuesta, elegir = avanzar. */
  function maybeAdvance(g: Group, o: Option) {
    if (!pointer.current || g.multi || steps[step].groups.length > 1) return;
    const next = { ...answers, [g.id]: [o.id] };
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => goNext(next), 200);
  }

  function restart() {
    setAnswers({});
    setContact(emptyContact);
    setErrors({});
    setSent(null);
    move(0, {});
  }

  /* ---------------------------------------------------------------------
   * Resultado y envío
   * ------------------------------------------------------------------ */

  const recs = isResult ? recommend(answers, servicio) : [];
  const instalacionId = answers.instalacion?.[0] ?? "";
  const instalacionLabel = optionLabel(installation.groups[0], instalacionId) ?? "";
  const sectorId = installationSector[instalacionId];

  // Una línea con lo contestado (sin las preocupaciones, que van como «por qué»).
  const summary: string[] = [];
  const fields: [string, string | undefined][] = [];
  for (const s of steps) {
    for (const g of s.groups) {
      const chosen = (answers[g.id] ?? [])
        .map((id) => g.options.find((o) => o.id === id))
        .filter((o): o is Option => !!o);
      fields.push([g.summary, chosen.map((o) => o.label).join(", ")]);
      if (!g.multi) summary.push(...chosen.map((o) => o.short ?? o.label));
    }
  }
  if (servicio) fields.push(["Servicio consultado", serviceLabel(servicio)]);
  if (recs.length) fields.push(["Esquema recomendado", recs.map((r) => serviceLabel(r.slug)).join(", ")]);
  fields.push(
    ["Nombre", contact.nombre],
    [branch === "empresa" ? "Empresa" : "Conjunto, comercio o empresa", contact.org],
    ["Ubicación de la instalación", contact.ubicacion],
    ["Teléfono", contact.telefono],
    ["Detalle", contact.detalle],
  );
  const message = composeMessage(
    `${WA_FROM} (${branch === "empresa" ? "solicitud de empresa" : "diagnóstico de seguridad"}).`,
    fields,
  );
  const hasPliego = answers.pliego?.[0] === "si";

  function validate() {
    const found: ContactErrors = {};
    if (contact.nombre.trim().length < 2) found.nombre = nameError;
    if (contact.telefono.trim() && !PHONE_RE.test(contact.telefono.trim())) found.telefono = phoneError;
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      // El teléfono está en «Añadir datos»: se abre antes de llevar el foco.
      if (first === "telefono" && moreRef.current) moreRef.current.open = true;
      document.getElementById(`${uid}-${first}`)?.focus();
      track("cotizador-error", { motivo: first, rama, ubicacion });
      return false;
    }
    return true;
  }

  function sendWhatsApp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;
    track("cotizador-whatsapp", { rama, ubicacion });
    openExternal(whatsappHref(message));
    setSent("whatsapp");
  }

  function sendMail() {
    if (!validate()) return;
    track("cotizador-propuesta", { rama, ubicacion });
    const org = contact.org.trim();
    window.location.href = mailtoHref({
      to: site.salesEmail,
      subject: `Solicitud de propuesta técnica y económica (${instalacionLabel})${org ? ` · ${org}` : ""}`,
      body: composeMessage(
        "Buenos días, SEDIN.\n\nLes escribo desde sedinca.com. Solicitamos una propuesta técnica y económica con estos datos:",
        fields,
        hasPliego ? "Adjuntamos el pliego o alcance." : undefined,
      ),
    });
    setSent("correo");
  }

  /** Atajo del resultado: lleva al formulario de envío y al campo del nombre. */
  function goToSend() {
    const input = document.getElementById(`${uid}-nombre`);
    if (!input) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    input.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
    input.focus({ preventScroll: true });
  }

  const setField = (name: keyof Contact) => (e: { target: { value: string } }) => {
    setContact((c) => ({ ...c, [name]: e.target.value }));
    if (name in errors) setErrors((x) => ({ ...x, [name]: undefined }));
  };

  /* ---------------------------------------------------------------------
   * Pintado
   * ------------------------------------------------------------------ */

  const T = `h${headingLevel}` as "h2" | "h3";
  const Q = `h${headingLevel + 1}` as "h3" | "h4";
  const R = `h${headingLevel + 2}` as "h4" | "h5";
  const qClass =
    "m-0 font-display text-[clamp(24px,3vw,34px)] leading-[1.15] font-bold tracking-[-0.015em] text-balance text-ink outline-none";
  const current = isResult ? null : steps[step];

  const heading = (text: string) => (
    <Q ref={headingRef} tabIndex={-1} className={qClass}>
      {text}
    </Q>
  );

  // Desde el paso 2 la fila «Atrás / Continuar» se fija abajo en móvil, por
  // encima de la barra de contacto (56px + borde + zona segura) cuando se ve.
  const stickyNav = step > 0;
  const navOffset = barShown ? `calc(${MOBILE_BAR_HEIGHT + 1}px + env(safe-area-inset-bottom))` : "0px";

  return (
    <div
      ref={rootRef}
      data-wizard=""
      data-wizard-state={isResult ? "result" : "steps"}
      className={cn("scroll-mt-24", className)}
    >
      {/* Como <Card elevation={2} accent>, pero con overflow: clip (hidden
          rompería la fila fija de móvil). */}
      <div className="relative overflow-clip rounded-lg border border-line-cyan bg-glass-2 p-5 shadow-elevation-2 backdrop-blur-glass-2 before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-[image:var(--gradient-accent-line)] before:content-[''] sm:p-8 lg:p-10">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <T className="m-0 font-display text-lg leading-6 font-bold tracking-[-0.01em] text-ink-brand sm:text-xl">
              {titles[branch]}
            </T>
            <span className="eyebrow text-ink-muted">
              {isResult ? "Resultado" : `Paso ${step + 1} de ${TOTAL_STEPS}`}
            </span>
          </div>
          <div aria-hidden="true" className="flex gap-1.5">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors duration-300",
                  i <= step ? "bg-[image:var(--gradient-accent-line)]" : "bg-line",
                )}
              />
            ))}
          </div>
        </div>
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {announce}
        </p>

        {current ? (
          <>
            <form
              id={`${uid}-paso`}
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                goNext();
              }}
              onPointerDown={() => (pointer.current = true)}
              onKeyDown={() => (pointer.current = false)}
              className="mt-8 mb-7 flex flex-col gap-7"
            >
              {current.groups.length === 1 ? (
                <ChoiceGroup
                  uid={uid}
                  group={current.groups[0]}
                  legend={heading(current.title)}
                  titled
                  note={current.note}
                  answers={answers}
                  missing={missing}
                  onChoose={choose}
                  onPick={maybeAdvance}
                />
              ) : (
                <>
                  <div className="flex flex-col gap-2">
                    {heading(current.title)}
                    {current.note && <p className="m-0 text-[15px] leading-[22px] text-ink-muted">{current.note}</p>}
                  </div>
                  {current.groups.map((g) => (
                    <ChoiceGroup
                      key={g.id}
                      uid={uid}
                      group={g}
                      legend={<span className="field-label">{g.label}</span>}
                      answers={answers}
                      missing={missing}
                      onChoose={choose}
                      onPick={maybeAdvance}
                    />
                  ))}
                </>
              )}
            </form>

            {/* Fuera del <form> (el botón se asocia con `form`) y sin margen
                propio: así la fila fija puede subir por toda la tarjeta y no
                solo hasta el principio del paso, que en móvil puede quedar
                bajo la barra de contacto. */}
            <div
              className={cn(
                "flex items-center gap-3 border-t border-line",
                stickyNav
                  ? "sticky z-10 -mx-5 bg-surface px-5 py-3 shadow-[0_-10px_20px_-14px_color-mix(in_srgb,var(--azure-950)_35%,transparent)] transition-[bottom] duration-300 ease-out motion-reduce:transition-none sm:-mx-8 sm:px-8 lg:static lg:mx-0 lg:bg-transparent lg:px-0 lg:pt-6 lg:pb-0 lg:shadow-none"
                  : "pt-6",
              )}
              style={stickyNav ? { bottom: navOffset } : undefined}
            >
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => move(step - 1)}
                  className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-(--radius) border-0 bg-transparent px-3 font-display text-[15px] leading-5 font-semibold tracking-[0.02em] text-ink-brand transition-colors hover:bg-[var(--ghost-hover)] sm:px-5"
                >
                  <ArrowRightIcon size={18} className="rotate-180" />
                  Atrás
                </button>
              )}
              <Button type="submit" form={`${uid}-paso`} className="flex-1 sm:ml-auto sm:flex-none">
                {step + 1 >= TOTAL_STEPS ? "Ver su esquema" : "Continuar"}
                {step + 1 < TOTAL_STEPS && <ArrowRightIcon size={18} />}
              </Button>
            </div>
          </>
        ) : (
          <div className="mt-8 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <Q
                ref={headingRef}
                tabIndex={-1}
                className="m-0 font-display text-[clamp(30px,3.8vw,44px)] leading-[1.08] font-bold tracking-[-0.02em] text-balance text-ink outline-none"
              >
                Su esquema <span className="text-ink-brand">recomendado</span>
              </Q>
              {summary.length > 0 && (
                <p className="m-0 text-[15px] leading-[22px] font-medium text-ink sm:text-base sm:leading-6">
                  <span className="sr-only">Sus respuestas: </span>
                  {summary.map((item, i) => (
                    <span key={`${i}-${item}`}>
                      {i > 0 && (
                        <span aria-hidden="true" className="px-2 text-accent">
                          ·
                        </span>
                      )}
                      {item}
                    </span>
                  ))}
                </p>
              )}
              <p className="m-0 max-w-[640px] text-[15px] leading-[22px] text-ink-muted">
                Es un punto de partida: el número de oficiales y de puestos se define en la inspección.
              </p>
              {/* En móvil el envío queda a una pantalla: atajo que lleva al nombre. */}
              <div className="lg:hidden">
                <Button block onClick={goToSend}>
                  <WhatsAppIcon size={20} tone="brand" />
                  Enviar este esquema
                </Button>
              </div>
            </div>

            <ol
              aria-label="Servicios recomendados"
              className={cn(
                "m-0 grid list-none gap-3 p-0",
                recs.length > 1 && "sm:grid-cols-2",
                recs.length > 2 && "lg:grid-cols-3",
              )}
            >
              {recs.map((r, i) => (
                <li key={r.slug} className="rounded-lg border border-line-card bg-surface p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="grid h-7 w-7 flex-none place-items-center rounded-full border-2 border-accent font-display text-[13px] font-bold text-ink-brand"
                    >
                      {i + 1}
                    </span>
                    <R className="m-0 font-display text-lg leading-7 font-bold tracking-[-0.01em] text-ink sm:text-xl">
                      {serviceLabel(r.slug)}
                    </R>
                  </div>
                  <p className="mt-2 mb-0 text-[15px] leading-[22px] text-ink-muted sm:pl-10">
                    {(sectorId && schemes?.[sectorId]?.[r.slug]) || serviceWhy[r.slug]}{" "}
                    <a
                      href={`${serviceHref(r.slug)}/`}
                      target="_blank"
                      rel="noopener"
                      className={cn(textLink, "whitespace-nowrap")}
                    >
                      Ver el servicio
                      <span className="sr-only">
                        {" "}
                        {serviceLabel(r.slug)} (se abre en una pestaña nueva)
                      </span>
                    </a>
                  </p>
                  {r.reasons.length > 0 && (
                    <ul
                      aria-label="Por qué se lo recomendamos"
                      className="mt-3 mb-0 flex list-none flex-col gap-1 p-0 text-[15px] leading-[22px] font-medium text-ink sm:pl-10"
                    >
                      {r.reasons.map((reason) => (
                        <li key={reason} className="flex gap-2">
                          <CheckIcon size={18} className="mt-0.5 flex-none text-ink-brand" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>

            <form
              noValidate
              onSubmit={sendWhatsApp}
              aria-labelledby={`${uid}-enviar`}
              className="flex flex-col gap-5 rounded-lg border border-line-cyan bg-surface-brand p-5 sm:p-7"
            >
              <div className="flex flex-col gap-1.5">
                <R
                  id={`${uid}-enviar`}
                  className="m-0 font-display text-xl leading-7 font-bold tracking-[-0.01em] text-ink sm:text-2xl sm:leading-8"
                >
                  Reciba este esquema y hable con un asesor
                </R>
                <p className="m-0 text-[15px] leading-[22px] text-ink-muted">
                  {answers.plazo?.[0] === "comparando" &&
                    "Le enviamos una propuesta escrita con el desglose completo para que la compare punto por punto. "}
                  El resumen se abre en WhatsApp ya escrito; usted decide si lo envía.
                </p>
              </div>

              <Field id={`${uid}-nombre`} label="Nombre y apellido" error={errors.nombre} className="sm:max-w-[440px]">
                <Input
                  id={`${uid}-nombre`}
                  autoComplete="name"
                  required
                  value={contact.nombre}
                  onChange={setField("nombre")}
                  aria-invalid={errors.nombre ? true : undefined}
                  aria-describedby={errors.nombre ? `${uid}-nombre-error` : undefined}
                />
              </Field>

              <details ref={moreRef} className="group/more rounded-lg border border-line bg-surface">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 rounded-lg px-4 py-3 font-display text-[15px] leading-5 font-semibold text-ink-brand transition-colors hover:bg-[var(--ghost-hover)] [&::-webkit-details-marker]:hidden">
                  <span>
                    Añadir teléfono y otros datos{" "}
                    <span className="font-sans font-normal text-ink-muted">(opcional)</span>
                  </span>
                  <ChevronDownIcon
                    size={18}
                    className="flex-none transition-transform group-open/more:rotate-180 motion-reduce:transition-none"
                  />
                </summary>
                <div className="grid gap-5 border-t border-line p-4 sm:grid-cols-2 sm:p-5">
                  <Field id={`${uid}-telefono`} label="Teléfono" error={errors.telefono}>
                    <Input
                      id={`${uid}-telefono`}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="0414 123 4567"
                      value={contact.telefono}
                      onChange={setField("telefono")}
                      aria-invalid={errors.telefono ? true : undefined}
                      aria-describedby={errors.telefono ? `${uid}-telefono-error` : undefined}
                    />
                  </Field>
                  <Field id={`${uid}-org`} label={branch === "empresa" ? "Empresa" : "Conjunto, comercio o empresa"}>
                    <Input id={`${uid}-org`} autoComplete="organization" value={contact.org} onChange={setField("org")} />
                  </Field>
                  {branch === "empresa" && (
                    <Field id={`${uid}-ubicacion`} label="Ubicación de la instalación">
                      <Input id={`${uid}-ubicacion`} value={contact.ubicacion} onChange={setField("ubicacion")} />
                    </Field>
                  )}
                  <Field
                    id={`${uid}-detalle`}
                    label="Algo más que debamos saber"
                    className={branch === "empresa" ? undefined : "sm:col-span-2"}
                  >
                    <Input id={`${uid}-detalle`} maxLength={500} value={contact.detalle} onChange={setField("detalle")} />
                  </Field>
                </div>
              </details>

              {hasPliego && (
                <p className="m-0 text-[15px] leading-[22px] text-ink">
                  Si envía la solicitud por correo, adjunte el pliego o alcance: así la propuesta responde punto por
                  punto.
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <Button type="submit" size="lg" block>
                  <WhatsAppIcon size={22} tone="brand" />
                  Enviar por WhatsApp
                </Button>
                {branch === "empresa" && (
                  <Button variant="secondary" size="lg" block onClick={sendMail}>
                    <MailIcon size={22} />
                    Solicitar propuesta por correo
                  </Button>
                )}
                <CopyMessageButton text={message} ubicacion={ubicacion} />
              </div>
              <div className="-mt-2">
                <p className="m-0 text-sm leading-5 text-ink-muted">
                  Al enviar, acepta que SEDIN le contacte sobre esta solicitud.
                </p>
                <div role="status">
                  {sent && (
                    <p className="mt-3 mb-0 rounded-(--radius) border border-success/40 bg-success-subtle px-4 py-3 text-sm leading-5 text-ink-success">
                      {sent === "whatsapp"
                        ? `Abrimos WhatsApp con su resumen; solo tiene que enviarlo. Si no se abrió, escríbanos al ${site.whatsappNumber} y pegue el mensaje.`
                        : `Abrimos su correo con la solicitud ya redactada. Si no se abrió, escríbanos a ${site.salesEmail}.`}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <p className="m-0 text-[15px] leading-[22px] text-ink-muted">
                  ¿Prefiere hablar ahora? Atención {site.hours}.
                </p>
                <CallLink ubicacion={ubicacion} event="cotizador-llamada" variant="secondary" size="sm" />
              </div>
            </form>

            {priceNote}

            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm leading-5">
              <button
                type="button"
                onClick={() => move(TOTAL_STEPS - 1)}
                className={cn(textLink, "inline-flex min-h-10 cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0")}
              >
                <ArrowRightIcon size={16} className="rotate-180" />
                Cambiar respuestas
              </button>
              <button
                type="button"
                onClick={restart}
                className={cn(textLink, "inline-flex min-h-10 cursor-pointer items-center border-0 bg-transparent p-0")}
              >
                Empezar de nuevo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      {children}
      <FieldError id={`${id}-error`}>{error}</FieldError>
    </div>
  );
}

function ChoiceGroup({
  uid,
  group,
  legend,
  titled = false,
  note,
  answers,
  missing,
  onChoose,
  onPick,
}: {
  uid: string;
  group: Group;
  legend: ReactNode;
  /** La leyenda es el título del paso (más aire debajo). */
  titled?: boolean;
  note?: string;
  answers: Answers;
  missing: string | null;
  onChoose: (g: Group, o: Option, checked: boolean) => void;
  onPick: (g: Group, o: Option) => void;
}) {
  const name = `${uid}-${group.id}`;
  const errorId = `${name}-error`;
  const noteId = `${name}-note`;
  const selected = answers[group.id] ?? [];
  const describedBy = [note && noteId, missing === group.id && errorId].filter(Boolean).join(" ");
  // La <legend> no es un elemento flex del <fieldset>: el `gap` no la separa.
  const legendSpace = titled ? (note ? "mb-2" : "mb-5") : "mb-3";
  return (
    <fieldset
      data-group={group.id}
      aria-describedby={describedBy || undefined}
      className="m-0 flex min-w-0 flex-col gap-4 border-0 p-0"
    >
      <legend className={cn("w-full p-0", legendSpace)}>{legend}</legend>
      {note && (
        <p id={noteId} className="m-0 text-[15px] leading-[22px] text-ink-muted">
          {note}
        </p>
      )}
      <div className={group.compact ? "flex flex-wrap gap-2.5" : "grid gap-2.5 sm:grid-cols-2"}>
        {group.options.map((o) => {
          const Icon = group.id === "instalacion" ? optionIcons[o.id] : undefined;
          const checked = selected.includes(o.id);
          const indicator = (
            <span
              aria-hidden="true"
              className={cn(
                "grid h-5 w-5 flex-none place-items-center border-[1.5px] border-line-strong bg-surface text-on-brand transition-colors group-has-[:checked]:border-brand group-has-[:checked]:bg-brand",
                group.multi ? "rounded-sm" : "rounded-full",
              )}
            >
              <CheckIcon size={14} strokeWidth={2.5} className="opacity-0 group-has-[:checked]:opacity-100" />
            </span>
          );
          return (
            <label
              key={o.id}
              className={cn(
                "group relative flex cursor-pointer items-center border-[1.5px] border-line-strong bg-surface text-ink transition-[border-color,background-color,box-shadow] duration-200",
                "hover:border-brand has-[:checked]:border-brand has-[:checked]:bg-surface-brand has-[:checked]:shadow-[0_0_0_3px_var(--focus-halo)]",
                "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus-ring",
                // Opciones cortas: botones de ancho automático que se reparten
                // en filas (no columnas estrechas que parten el texto).
                group.compact
                  ? "min-h-12 max-w-full gap-2 rounded-full py-2.5 pr-4 pl-3 text-[15px] leading-5"
                  : "min-h-16 gap-3 rounded-lg px-4 py-3 text-base leading-6",
              )}
            >
              {group.compact && indicator}
              {Icon && (
                <span
                  aria-hidden="true"
                  className="grid h-11 w-11 flex-none place-items-center rounded-md bg-surface-brand text-ink-brand transition-colors group-has-[:checked]:bg-brand group-has-[:checked]:text-on-brand"
                >
                  <Icon size={24} />
                </span>
              )}
              <span className={cn("min-w-0 font-medium", !group.compact && "flex-1")}>{o.label}</span>
              {!group.compact && indicator}
              <input
                type={group.multi ? "checkbox" : "radio"}
                name={name}
                value={o.id}
                checked={checked}
                onChange={(e) => onChoose(group, o, e.target.checked)}
                onClick={() => onPick(group, o)}
                className="absolute inset-0 m-0 h-full w-full cursor-pointer opacity-0"
              />
            </label>
          );
        })}
      </div>
      {missing === group.id && (
        <p id={errorId} className="m-0 text-sm leading-5 text-ink-danger">
          {group.multi ? "Marque al menos una opción para continuar." : "Elija una opción para continuar."}
        </p>
      )}
    </fieldset>
  );
}
