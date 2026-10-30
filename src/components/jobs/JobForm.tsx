"use client";

import { useRef, useState, type FormEvent } from "react";
import { CheckCircleIcon, MailIcon, WhatsAppIcon } from "@/components/icons";
import { CopyMessageButton } from "@/components/ui/CopyMessageButton";
import { Button, FieldError, FileInput, Input, Select, Textarea } from "@/components/ui/form";
import { buttonClass } from "@/components/ui/links";
import { composeMessage, mailtoHref, site, waMessages, whatsappHref } from "@/config/site";
import { cn } from "@/lib/cn";
import { trackEvent } from "./track";

/*
 * Formulario corto de postulación (propuesta 0.2, 8.9 y 11.4), con usted.
 *
 * - Sin receptor (`NEXT_PUBLIC_JOBS_ENDPOINT` vacío, como hoy): «Enviar por
 *   WhatsApp» abre WhatsApp con la postulación ya escrita («POSTULACIÓN –
 *   Oficial de seguridad…», 11.6) y «Enviar por correo» abre un correo a
 *   `site.jobsEmail` con el asunto «Postulación: Oficial de seguridad». Tras
 *   enviar quedan a mano «Abrir WhatsApp», «Enviar por correo» y «Copiar el
 *   mensaje», por si el navegador bloquea la ventana.
 * - Con receptor: «Enviar postulación» hace POST multipart (con el CV, que es
 *   opcional) y, si falla, ofrece las mismas salidas por WhatsApp o correo.
 *
 * Solo el nombre, el teléfono y la zona son obligatorios. Todos los textos
 * de este archivo son publicables (componente cliente: nada de marcadores).
 */

const positions = ["Oficial de seguridad", "Supervisor de seguridad"] as const;
/** Solo rangos que cumplen el requisito publicado (experiencia mayor de un año, art. 25). */
const experienceOptions = ["De 1 a 3 años", "Más de 3 años"] as const;
const incesOptions = ["Sí, tengo el certificado", "No"] as const;

const CV_TYPES = [".pdf", ".doc", ".docx"];
const CV_MAX_MB = 5;

type Field = "nombre" | "cedula" | "telefono" | "correo" | "zona" | "cv";
type Errors = Partial<Record<Field, string>>;
type Channel = "api" | "whatsapp" | "correo";
interface Outbox {
  text: string;
  wa: string;
  mail: string;
}
type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | ({ kind: "ready"; channel: "whatsapp" | "correo" } & Outbox)
  | ({ kind: "error" } & Outbox);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s().-]{7,20}$/;
const CEDULA_RE = /^[VEve]?-?\s?\d{6,9}$/;

const text = (data: FormData, key: string) => String(data.get(key) ?? "").trim();

function validate(data: FormData, withCv: boolean): Errors {
  const errors: Errors = {};
  if (text(data, "nombre").length < 3) errors.nombre = "Escriba su nombre y apellido.";
  const cedula = text(data, "cedula");
  if (cedula && !CEDULA_RE.test(cedula.replace(/\./g, "")))
    errors.cedula = "Revise la cédula, por ejemplo V-12345678.";
  if (!PHONE_RE.test(text(data, "telefono")))
    errors.telefono = "Escriba un teléfono válido, por ejemplo 0414 123 4567.";
  const correo = text(data, "correo");
  if (correo && !EMAIL_RE.test(correo)) errors.correo = "Revise el correo, por ejemplo nombre@correo.com.";
  if (!text(data, "zona")) errors.zona = "Escriba la zona o el municipio donde vive.";
  const cv = data.get("cv");
  if (withCv && cv instanceof File && cv.size > 0) {
    if (!CV_TYPES.some((ext) => cv.name.toLowerCase().endsWith(ext))) {
      errors.cv = "El currículum debe estar en PDF o Word (.doc, .docx).";
    } else if (cv.size > CV_MAX_MB * 1024 * 1024) {
      errors.cv = `El currículum no debe superar ${CV_MAX_MB} MB.`;
    }
  }
  return errors;
}

/** Postulación ya redactada para WhatsApp y para correo. */
function compose(data: FormData): Outbox {
  const cargo = text(data, "cargo") || positions[0];
  const fields: [string, string][] = [
    ["Nombre y apellido", text(data, "nombre")],
    ["Cédula", text(data, "cedula")],
    ["Teléfono", text(data, "telefono")],
    ["Correo", text(data, "correo")],
    ["Zona donde vivo", text(data, "zona")],
    ["Experiencia en seguridad", text(data, "experiencia")],
    ["Curso del INCES", text(data, "inces")],
    ["Comentarios", text(data, "mensaje")],
  ];
  const message = composeMessage(`POSTULACIÓN – ${cargo}. Les escribo desde sedinca.com (empleo).`, fields);
  const body = composeMessage(
    `Buenos días, SEDIN.\nLes escribo desde sedinca.com (empleo). Quiero postular como ${cargo.toLowerCase()}.\n`,
    fields,
  );
  return {
    text: message,
    wa: whatsappHref(message),
    mail: mailtoHref({ to: site.jobsEmail, subject: `Postulación: ${cargo}`, body }),
  };
}

export function JobForm({
  ubicacion = "empleo",
  privacyHref,
  className,
}: {
  /** Ubicación de Umami. */
  ubicacion?: string;
  /** Enlace a la política de privacidad, cuando exista la página. */
  privacyHref?: string;
  className?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const hasEndpoint = Boolean(site.jobsEndpoint);
  const tracking = { ubicacion, origen: "formulario" };

  const fieldProps = (name: Field) => ({
    id: `p-${name}`,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `p-${name}-error` : undefined,
    onChange: () => errors[name] && setErrors((e) => ({ ...e, [name]: undefined })),
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const requested = submitter?.value as Channel | undefined;
    const channel: Channel = requested ?? (hasEndpoint ? "api" : "whatsapp");
    const data = new FormData(form);

    const found = validate(data, channel === "api");
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      form.querySelector<HTMLElement>(`#p-${first}`)?.focus();
      setStatus({ kind: "idle" });
      return;
    }

    const outbox = compose(data);

    if (channel === "whatsapp" || (channel === "api" && !hasEndpoint)) {
      window.open(outbox.wa, "_blank", "noopener,noreferrer");
      trackEvent("postulacion-whatsapp", tracking);
      setStatus({ kind: "ready", channel: "whatsapp", ...outbox });
      return;
    }
    if (channel === "correo") {
      window.location.href = outbox.mail;
      trackEvent("correo", tracking);
      setStatus({ kind: "ready", channel: "correo", ...outbox });
      return;
    }

    setStatus({ kind: "sending" });
    try {
      const cv = data.get("cv");
      if (cv instanceof File && cv.size === 0) data.delete("cv");
      data.set("origen", "web/empleo");
      const res = await fetch(site.jobsEndpoint, { method: "POST", body: data });
      if (!res.ok) throw new Error(String(res.status));
      formRef.current?.reset();
      trackEvent("postulacion-enviada", tracking);
      setStatus({ kind: "sent" });
    } catch {
      setStatus({ kind: "error", ...outbox });
    }
  }

  const fallbackWa = whatsappHref(waMessages.empleo);
  const fallbackMail = mailtoHref({ to: site.jobsEmail, subject: "Postulación: Oficial de seguridad" });

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      aria-labelledby="postulacion-form-titulo"
      className={cn(
        "flex min-w-0 flex-col gap-6 rounded-xl border border-line-cyan bg-glass-2 p-5 shadow-elevation-2 backdrop-blur-glass-2 sm:p-10",
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        <h3 id="postulacion-form-titulo" className="m-0 font-display text-2xl leading-8 font-bold tracking-[-0.01em] text-ink">
          Postule con el formulario
        </h3>
        <p className="m-0 text-[15px] leading-[22px] text-ink-muted">
          Solo el nombre, el teléfono y la zona son obligatorios.
        </p>
      </div>

      <noscript>
        <p className={cn(statusBox, "border-line bg-surface-brand text-ink")}>
          Para enviar el formulario se necesita JavaScript. Puede postular{" "}
          <a href={fallbackWa}>por WhatsApp</a> o <a href={fallbackMail}>por correo</a>.
        </p>
      </noscript>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="field-label" htmlFor="p-nombre">
            Nombre y apellido
          </label>
          <Input {...fieldProps("nombre")} aria-required="true" autoComplete="name" placeholder="Ej. José Rodríguez" />
          <FieldError id="p-nombre-error">{errors.nombre}</FieldError>
        </div>
        <div className="flex flex-col gap-2">
          <label className="field-label" htmlFor="p-telefono">
            Teléfono
          </label>
          <Input
            {...fieldProps("telefono")}
            aria-required="true"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="0414 123 4567"
          />
          <FieldError id="p-telefono-error">{errors.telefono}</FieldError>
        </div>
        <div className="flex flex-col gap-2">
          <label className="field-label" htmlFor="p-zona">
            Zona donde vive
          </label>
          <Input
            {...fieldProps("zona")}
            aria-required="true"
            autoComplete="address-level2"
            placeholder="Municipio o sector"
          />
          <FieldError id="p-zona-error">{errors.zona}</FieldError>
        </div>
        <div className="flex flex-col gap-2">
          <label className="field-label" htmlFor="p-cedula">
            Cédula (opcional)
          </label>
          <Input {...fieldProps("cedula")} placeholder="V-12345678" />
          <FieldError id="p-cedula-error">{errors.cedula}</FieldError>
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <label className="field-label" htmlFor="p-correo">
            Correo (opcional)
          </label>
          <Input
            {...fieldProps("correo")}
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="nombre@correo.com"
          />
          <FieldError id="p-correo-error">{errors.correo}</FieldError>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="field-label" htmlFor="p-cargo">
            Cargo al que postula
          </label>
          <Select id="p-cargo" name="cargo" defaultValue={positions[0]}>
            {positions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="field-label" htmlFor="p-experiencia">
            Experiencia en seguridad
          </label>
          <Select id="p-experiencia" name="experiencia" defaultValue="">
            <option value="">Elija una opción</option>
            {experienceOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <label className="field-label" htmlFor="p-inces">
            ¿Tiene el curso de Formación de Oficiales de Seguridad (INCES)?
          </label>
          <Select id="p-inces" name="inces" defaultValue="">
            <option value="">Elija una opción</option>
            {incesOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="field-label" htmlFor="p-mensaje">
          Comentarios (opcional)
        </label>
        <Textarea
          id="p-mensaje"
          name="mensaje"
          rows={3}
          placeholder="Disponibilidad, cursos realizados, dónde prefiere trabajar…"
        />
      </div>

      {hasEndpoint ? (
        <div className="flex flex-col gap-2">
          <label className="field-label" htmlFor="p-cv">
            Currículum (opcional · PDF o Word, máx. {CV_MAX_MB} MB)
          </label>
          <FileInput {...fieldProps("cv")} accept={CV_TYPES.join(",")} />
          <FieldError id="p-cv-error">{errors.cv}</FieldError>
        </div>
      ) : (
        <p className="m-0 text-[15px] leading-[22px] text-ink-muted">
          ¿Tiene currículum? Es opcional: puede adjuntarlo en el chat de WhatsApp o en el correo.
        </p>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          {hasEndpoint ? (
            <>
              <Button type="submit" name="canal" value="api" disabled={status.kind === "sending"}>
                {status.kind === "sending" ? "Enviando…" : "Enviar postulación"}
              </Button>
              <Button type="submit" name="canal" value="whatsapp" variant="secondary" disabled={status.kind === "sending"}>
                <WhatsAppIcon size={18} tone="deep" />
                Enviar por WhatsApp
              </Button>
            </>
          ) : (
            <>
              <Button type="submit" name="canal" value="whatsapp">
                <WhatsAppIcon size={18} tone="brand" />
                Enviar por WhatsApp
              </Button>
              <Button type="submit" name="canal" value="correo" variant="secondary">
                <MailIcon size={18} />
                Enviar por correo
              </Button>
            </>
          )}
        </div>
        <p className="m-0 text-sm leading-5 text-ink-muted">
          Al enviar, acepta que SEDIN use estos datos solo para este proceso de selección.
          {privacyHref && (
            <>
              {" "}
              Vea la <a href={privacyHref}>política de privacidad</a>.
            </>
          )}
        </p>
      </div>

      <div role="status" aria-live="polite" className="empty:hidden">
        {status.kind === "sent" && (
          <p className={cn(statusBox, "border-success/40 bg-success-subtle text-ink-success")}>
            Postulación enviada. El equipo de selección de SEDIN revisará su perfil y se comunicará con los
            candidatos preseleccionados.
          </p>
        )}
        {(status.kind === "ready" || status.kind === "error") && (
          <div
            className={cn(
              "flex flex-col gap-3 rounded-lg border p-4 sm:p-5",
              status.kind === "ready" ? "border-line-cyan bg-accent-subtle" : "border-warning/50 bg-warning-subtle",
            )}
          >
            <p className="m-0 flex items-start gap-2 font-display text-base leading-6 font-semibold text-ink">
              {status.kind === "ready" && <CheckCircleIcon size={20} className="mt-0.5 flex-none text-ink-accent" />}
              {status.kind === "ready"
                ? "Su postulación está lista para enviar."
                : "No fue posible enviar la postulación por aquí."}
            </p>
            <p className="m-0 text-sm leading-5 text-ink-muted">
              {status.kind === "error"
                ? "Envíela por WhatsApp o por correo: el mensaje ya está escrito."
                : status.channel === "whatsapp"
                  ? "Se abrió WhatsApp con el mensaje ya escrito: solo pulse enviar. Si no se abrió, use uno de estos botones."
                  : "Se abrió su correo con la postulación ya escrita. Si no se abrió, use uno de estos botones."}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={status.wa}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass({ variant: "primary", size: "sm" })}
              >
                <WhatsAppIcon size={18} tone="brand" />
                Abrir WhatsApp
                <span className="sr-only"> (abre WhatsApp)</span>
              </a>
              <a href={status.mail} className={buttonClass({ variant: "secondary", size: "sm" })}>
                <MailIcon size={18} />
                Enviar por correo
              </a>
              <CopyMessageButton text={status.text} ubicacion={ubicacion} size="sm" desktopOnly={false} />
            </div>
            <details className="text-sm leading-5">
              <summary className="cursor-pointer font-semibold text-ink-brand">Ver el mensaje</summary>
              <p className="m-0 mt-2 rounded-md border border-line bg-surface p-3 whitespace-pre-line text-ink">
                {status.text}
              </p>
            </details>
          </div>
        )}
      </div>
    </form>
  );
}

const statusBox = "m-0 rounded-(--radius) border px-4 py-3 text-sm leading-5";
