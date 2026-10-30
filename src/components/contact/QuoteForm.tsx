"use client";

import { Suspense, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { MailIcon, WhatsAppIcon } from "@/components/icons";
import {
  EMAIL_RE,
  emailError,
  nameError,
  openExternal,
  PHONE_RE,
  phoneError,
  sectorLabel,
  serviceLabel,
  track,
  useQuoteParams,
  WA_FROM,
  isSectorSlug,
  type QuoteParams,
} from "@/components/contact/quoteShared";
import { Card } from "@/components/ui/Card";
import { CopyMessageButton } from "@/components/ui/CopyMessageButton";
import { Button, FieldError, Input, Radio, Select, Textarea } from "@/components/ui/form";
import { textLink } from "@/components/ui/links";
import {
  composeMessage,
  mailtoHref,
  sectorSlugs,
  serviceSlugs,
  site,
  whatsappHref,
} from "@/config/site";
import { cn } from "@/lib/cn";

/*
 * Formulario breve de cotización (propuesta 0.1, 11.4 y 15.2).
 * - Sin receptor (`NEXT_PUBLIC_CONTACT_ENDPOINT` vacío, hoy siempre), el botón
 *   es «Enviar por WhatsApp» y abre WhatsApp con todo lo escrito; debajo,
 *   «Si lo prefiere, envíelo por correo» (mismo texto) y, en escritorio,
 *   «Copiar el mensaje».
 * - Con receptor, envía el JSON de siempre; si falla, el botón pasa a ser
 *   «Enviar por WhatsApp» con lo ya escrito.
 * - Solo el nombre es obligatorio. Servicio e instalación sin valor por
 *   defecto, precargados desde `?servicio=` y `?sector=`.
 */

type Field = "nombre" | "telefono" | "correo";
type Errors = Partial<Record<Field, string>>;
type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "opened"; channel: "whatsapp" | "correo" }
  | { kind: "error"; message: string };

const ADVICE = "asesoria";
const OTHER = "otro";

const serviceOptions = [
  ...serviceSlugs.map((slug) => ({ value: slug as string, label: serviceLabel(slug) })),
  { value: ADVICE, label: "Aún no lo sé, necesito asesoría" },
];
const sectorOptions = [
  ...sectorSlugs.map((slug) => ({ value: slug as string, label: sectorLabel(slug) })),
  { value: OTHER, label: "Otra instalación" },
];

const labelOf = (options: { value: string; label: string }[], value: string) =>
  options.find((o) => o.value === value)?.label ?? "";

function text(data: FormData, key: string) {
  return String(data.get(key) ?? "").trim();
}

function validate(data: FormData): Errors {
  const errors: Errors = {};
  if (text(data, "nombre").length < 2) errors.nombre = nameError;
  if (text(data, "telefono") && !PHONE_RE.test(text(data, "telefono"))) errors.telefono = phoneError;
  if (text(data, "correo") && !EMAIL_RE.test(text(data, "correo"))) errors.correo = emailError;
  return errors;
}

/** Texto del mensaje (WhatsApp, correo y «Copiar el mensaje»). */
function buildMessage(data: FormData) {
  return composeMessage(`${WA_FROM} (formulario de contacto). Quiero solicitar una cotización.`, [
    ["Nombre", text(data, "nombre")],
    ["Empresa o conjunto", text(data, "empresa")],
    ["Teléfono", text(data, "telefono")],
    ["Correo", text(data, "correo")],
    ["Servicio", labelOf(serviceOptions, text(data, "servicio"))],
    ["Instalación", labelOf(sectorOptions, text(data, "sector"))],
    ["Qué necesito proteger", text(data, "mensaje")],
  ]);
}

function initialMessage({ sector, servicio }: QuoteParams) {
  const data = new FormData();
  if (servicio) data.set("servicio", servicio);
  if (sector) data.set("sector", sector);
  return buildMessage(data);
}

export interface QuoteFormProps {
  /** Ubicación para Umami (`contacto`…). */
  ubicacion?: string;
  title?: string;
  headingLevel?: 2 | 3;
  className?: string;
}

function QuoteFormFromUrl(props: QuoteFormProps) {
  const { key, ...params } = useQuoteParams();
  return <Form key={key} {...props} {...params} />;
}

/**
 * Formulario de cotización. En la exportación estática se pinta sin
 * parámetros; en el navegador lee `?servicio=` y `?sector=`.
 */
export function QuoteForm(props: QuoteFormProps) {
  return (
    <Suspense fallback={<Form {...props} />}>
      <QuoteFormFromUrl {...props} />
    </Suspense>
  );
}

function Form({
  ubicacion = "contacto",
  title = "Cuéntenos qué necesita proteger",
  headingLevel = 2,
  className,
  sector,
  servicio,
}: QuoteFormProps & QuoteParams) {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [message, setMessage] = useState(() => initialMessage({ sector, servicio }));
  /** Sin receptor, o tras un envío fallido: todo sale por WhatsApp. */
  const [viaWhatsApp, setViaWhatsApp] = useState(!site.contactEndpoint);

  const id = (name: string) => `${uid}-${name}`;
  const fieldProps = (name: Field) => ({
    id: id(name),
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${id(name)}-error` : undefined,
  });

  /** Valida; si hay errores, lleva el foco al primero. */
  function check(form: HTMLFormElement) {
    const data = new FormData(form);
    const found = validate(data);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(id(first))?.focus();
      setStatus({ kind: "idle" });
      return null;
    }
    return data;
  }

  function sendByMail() {
    const form = formRef.current;
    const data = form && check(form);
    if (!data) return;
    const nombre = text(data, "nombre");
    track("correo", { ubicacion, origen: "formulario" });
    window.location.href = mailtoHref({
      to: site.salesEmail,
      subject: `Solicitud de cotización desde sedinca.com · ${nombre}`,
      body: buildMessage(data),
    });
    setStatus({ kind: "opened", channel: "correo" });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = check(event.currentTarget);
    if (!data) return;

    if (viaWhatsApp || !site.contactEndpoint) {
      track("whatsapp", { ubicacion, origen: "formulario" });
      openExternal(whatsappHref(buildMessage(data)));
      setStatus({ kind: "opened", channel: "whatsapp" });
      return;
    }

    setStatus({ kind: "sending" });
    try {
      const res = await fetch(site.contactEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(data.entries()),
          consentimiento: true,
          origen: "web/contacto",
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      formRef.current?.reset();
      setMessage(initialMessage({}));
      setStatus({ kind: "sent" });
    } catch {
      setViaWhatsApp(true);
      setStatus({
        kind: "error",
        message:
          "No fue posible enviar la solicitud. Envíela por WhatsApp con lo que ya escribió, o por correo.",
      });
    }
  }

  const H = `h${headingLevel}` as "h2" | "h3";

  return (
    <Card elevation={2} accent className={cn("p-5 sm:p-8 lg:p-10", className)}>
      <form
        ref={formRef}
        noValidate
        onSubmit={onSubmit}
        onChange={(e) => {
          setMessage(buildMessage(new FormData(e.currentTarget)));
          const name = (e.target as EventTarget as HTMLInputElement).name as Field;
          if (errors[name]) setErrors((x) => ({ ...x, [name]: undefined }));
        }}
        aria-labelledby={id("titulo")}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-2">
          <H id={id("titulo")} className="m-0 font-display text-2xl leading-8 font-bold tracking-[-0.01em] text-ink">
            {title}
          </H>
          <p className="m-0 text-[15px] leading-[22px] text-ink-muted">
            Solo su nombre es obligatorio. Lo demás nos ayuda a orientarle mejor.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id={id("nombre")} label="Nombre y apellido" error={errors.nombre}>
            <Input {...fieldProps("nombre")} required autoComplete="name" />
          </FormField>
          <FormField id={id("empresa")} label="Empresa o conjunto (opcional)">
            <Input id={id("empresa")} name="empresa" autoComplete="organization" />
          </FormField>
          <FormField id={id("telefono")} label="Teléfono (opcional)" error={errors.telefono}>
            <Input {...fieldProps("telefono")} type="tel" inputMode="tel" autoComplete="tel" placeholder="0414 123 4567" />
          </FormField>
          <FormField id={id("correo")} label="Correo (opcional)" error={errors.correo}>
            <Input {...fieldProps("correo")} type="email" autoComplete="email" placeholder="nombre@empresa.com" />
          </FormField>
        </div>

        <FormField id={id("servicio")} label="Servicio de interés (opcional)">
          <Select id={id("servicio")} name="servicio" defaultValue={servicio ?? ""}>
            <option value="">Elija un servicio</option>
            {serviceOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </FormField>

        <fieldset className="m-0 flex min-w-0 flex-col gap-2.5 border-0 p-0">
          <legend className="field-label mb-2.5 p-0">Tipo de instalación (opcional)</legend>
          <div className="grid gap-x-5 gap-y-3 sm:grid-cols-2">
            {sectorOptions.map((o) => (
              <Radio
                key={o.value}
                name="sector"
                value={o.value}
                label={o.label}
                defaultChecked={isSectorSlug(sector) && o.value === sector}
              />
            ))}
          </div>
        </fieldset>

        <FormField id={id("mensaje")} label="¿Qué necesita proteger? (opcional)">
          <Textarea
            id={id("mensaje")}
            name="mensaje"
            rows={4}
            maxLength={1000}
            placeholder="Tipo de instalación, horario que necesita cubrir, número de accesos…"
          />
        </FormField>

        <p className="m-0 text-sm leading-5 text-ink-muted">
          Al enviar, acepta que SEDIN le contacte sobre esta solicitud.
        </p>

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={status.kind === "sending"} className="w-full sm:w-auto">
              {viaWhatsApp ? (
                <>
                  <WhatsAppIcon size={20} tone="brand" />
                  Enviar por WhatsApp
                </>
              ) : status.kind === "sending" ? (
                "Enviando…"
              ) : (
                "Enviar solicitud"
              )}
            </Button>
            {viaWhatsApp && <CopyMessageButton text={message} ubicacion={ubicacion} size="sm" />}
          </div>
          <p className="m-0 text-[15px] leading-[22px] text-ink-muted">
            {viaWhatsApp && "Su mensaje se abre en WhatsApp ya escrito; solo tiene que enviarlo. "}
            Si lo prefiere,{" "}
            <a
              href={mailtoHref({ to: site.salesEmail, subject: "Solicitud de cotización desde sedinca.com", body: message })}
              onClick={(e) => {
                e.preventDefault();
                sendByMail();
              }}
              className={cn(textLink, "inline-flex items-center gap-1.5")}
            >
              <MailIcon size={18} />
              {viaWhatsApp ? "envíelo por correo" : "envíe la solicitud por correo"}
            </a>
            .
          </p>
        </div>

        <div role="status" aria-live="polite">
          {status.kind === "sent" && (
            <p className={cn(statusBox, "border-success/40 bg-success-subtle text-ink-success")}>
              Recibimos su solicitud. Un asesor de SEDIN se comunicará con usted para coordinar la inspección del
              sitio.
            </p>
          )}
          {status.kind === "opened" && (
            <p className={cn(statusBox, "border-success/40 bg-success-subtle text-ink-success")}>
              {status.channel === "whatsapp"
                ? `Abrimos WhatsApp con su mensaje; solo tiene que enviarlo. Si no se abrió, escríbanos al ${site.whatsappNumber}.`
                : `Abrimos su correo con la solicitud ya redactada. Si no se abrió, escríbanos a ${site.salesEmail}.`}
            </p>
          )}
          {status.kind === "error" && (
            <p className={cn(statusBox, "border-warning/50 bg-warning-subtle text-ink-warning")}>{status.message}</p>
          )}
        </div>
      </form>
    </Card>
  );
}

function FormField({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      {children}
      <FieldError id={`${id}-error`}>{error}</FieldError>
    </div>
  );
}

const statusBox = "m-0 rounded-(--radius) border px-4 py-3 text-sm leading-5";
