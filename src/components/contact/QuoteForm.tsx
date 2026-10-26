"use client";

import { useRef, useState, type FormEvent } from "react";
import { Button, Checkbox, FieldError, Input, Radio, Select, Textarea } from "@/components/ui/form";
import { cn } from "@/lib/cn";
import { site } from "@/config/site";

export const serviceOptions = [
  "Vigilancia privada",
  "Control de acceso y salida de personal",
  "Sistemas de seguridad electrónica",
  "Gestión de riesgos y consultoría",
  "Aún no lo sé, necesito asesoría",
] as const;

export const sectorOptions = [
  "Residencial o condominio",
  "Empresa o industria",
  "Industria petrolera",
  "Corporación",
] as const;

type Field = "nombre" | "empresa" | "telefono" | "correo" | "consentimiento";
type Errors = Partial<Record<Field, string>>;
type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "error"; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s().-]{7,20}$/;

function validate(data: FormData): Errors {
  const errors: Errors = {};
  const text = (k: string) => String(data.get(k) ?? "").trim();
  if (text("nombre").length < 3) errors.nombre = "Indique nombre y apellido.";
  if (!text("empresa")) errors.empresa = "Indique la empresa o el condominio.";
  if (!PHONE_RE.test(text("telefono")))
    errors.telefono = "Indique un teléfono válido, p. ej. 0412 000 0000.";
  if (!EMAIL_RE.test(text("correo")))
    errors.correo = "Indique un correo válido, p. ej. nombre@empresa.com.";
  if (!data.get("consentimiento"))
    errors.consentimiento = "Se requiere la autorización de contacto.";
  return errors;
}

/** Formulario de cotización: validación en cliente y envío al endpoint configurado. */
export function QuoteForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const fieldProps = (name: Field) => ({
    id: `c-${name}`,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `c-${name}-error` : undefined,
    onChange: () => errors[name] && setErrors((e) => ({ ...e, [name]: undefined })),
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const found = validate(data);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      form.querySelector<HTMLElement>(`#c-${first}`)?.focus();
      setStatus({ kind: "idle" });
      return;
    }

    if (!site.contactEndpoint) {
      setStatus({
        kind: "error",
        message: `El envío en línea aún no está habilitado. Mientras tanto, la solicitud puede hacerse por teléfono, WhatsApp o al correo ${site.email}.`,
      });
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
      setStatus({ kind: "sent" });
    } catch {
      setStatus({
        kind: "error",
        message: "No fue posible enviar la solicitud. Intente de nuevo o comuníquese por teléfono.",
      });
    }
  }

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      aria-label="Solicitud de cotización"
      className="flex min-w-0 flex-[1.4_1_520px] flex-col gap-6 rounded-xl border border-line-cyan bg-glass-2 p-6 shadow-elevation-2 backdrop-blur-glass-2 sm:p-10"
    >
      <div className="flex flex-col gap-1">
        <h2 className="m-0 font-display text-2xl leading-8 font-semibold">Datos de la solicitud</h2>
        <p className="m-0 text-sm leading-5 text-ink-muted">
          Todos los campos son obligatorios salvo indicación.
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
        <div className="flex flex-col gap-2">
          <label className="field-label" htmlFor="c-nombre">
            Nombre y apellido
          </label>
          <Input {...fieldProps("nombre")} autoComplete="name" placeholder="Ej. María Pérez" />
          <FieldError id="c-nombre-error">{errors.nombre}</FieldError>
        </div>
        <div className="flex flex-col gap-2">
          <label className="field-label" htmlFor="c-empresa">
            Empresa o condominio
          </label>
          <Input
            {...fieldProps("empresa")}
            autoComplete="organization"
            placeholder="Nombre de la organización"
          />
          <FieldError id="c-empresa-error">{errors.empresa}</FieldError>
        </div>
        <div className="flex flex-col gap-2">
          <label className="field-label" htmlFor="c-telefono">
            Teléfono
          </label>
          <Input
            {...fieldProps("telefono")}
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="0412 000 0000"
          />
          <FieldError id="c-telefono-error">{errors.telefono}</FieldError>
        </div>
        <div className="flex flex-col gap-2">
          <label className="field-label" htmlFor="c-correo">
            Correo
          </label>
          <Input
            {...fieldProps("correo")}
            type="email"
            autoComplete="email"
            placeholder="nombre@empresa.com"
          />
          <FieldError id="c-correo-error">{errors.correo}</FieldError>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="field-label" htmlFor="c-servicio">
          Servicio de interés
        </label>
        <Select id="c-servicio" name="servicio" defaultValue={serviceOptions[0]}>
          {serviceOptions.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </Select>
      </div>

      <fieldset className="m-0 flex min-w-0 flex-col gap-2.5 border-0 p-0">
        <legend className="field-label mb-2.5 p-0">Sector</legend>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2.5">
          {sectorOptions.map((o, i) => (
            <Radio key={o} name="sector" value={o} label={o} defaultChecked={i === 0} />
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <label className="field-label" htmlFor="c-mensaje">
          ¿Qué necesitas proteger? (opcional)
        </label>
        <Textarea
          id="c-mensaje"
          name="mensaje"
          rows={4}
          placeholder="Tipo de instalación, horarios, número de accesos…"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Checkbox
          {...fieldProps("consentimiento")}
          value="si"
          label="Acepto que SEDIN me contacte por teléfono o correo para esta solicitud."
        />
        <FieldError id="c-consentimiento-error">{errors.consentimiento}</FieldError>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={status.kind === "sending"}>
          {status.kind === "sending" ? "Enviando…" : "Enviar solicitud"}
        </Button>
        <span className="text-sm leading-5 text-ink-muted">{site.responseTime}.</span>
      </div>

      <div role="status" aria-live="polite" className="empty:hidden">
        {status.kind === "sent" && (
          <p className={cn(statusBox, "border-success/40 bg-success-subtle text-ink-success")}>
            Solicitud enviada. Un asesor de SEDIN se comunicará para coordinar la inspección del
            sitio.
          </p>
        )}
        {status.kind === "error" && (
          <p className={cn(statusBox, "border-warning/50 bg-warning-subtle text-ink-warning")}>
            {status.message}
          </p>
        )}
      </div>
    </form>
  );
}

const statusBox = "m-0 rounded-(--radius) border px-4 py-3 text-sm leading-5";
