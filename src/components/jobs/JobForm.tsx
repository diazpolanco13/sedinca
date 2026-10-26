"use client";

import { useRef, useState, type FormEvent } from "react";
import {
  Button,
  Checkbox,
  FieldError,
  FileInput,
  Input,
  Select,
  Textarea,
} from "@/components/ui/form";
import { cn } from "@/lib/cn";
import { site } from "@/config/site";

export const positions = ["Oficial de seguridad", "Supervisor de seguridad"] as const;
const experienceOptions = [
  "Sin experiencia",
  "Menos de 1 año",
  "De 1 a 3 años",
  "Más de 3 años",
] as const;

const CV_TYPES = [".pdf", ".doc", ".docx"];
const CV_MAX_MB = 5;

type Field = "nombre" | "cedula" | "telefono" | "correo" | "ciudad" | "cv" | "consentimiento";
type Errors = Partial<Record<Field, string>>;
type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "error"; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s().-]{7,20}$/;
const CEDULA_RE = /^[VEve]?-?\s?\d{6,9}$/;

function validate(data: FormData): Errors {
  const errors: Errors = {};
  const text = (k: string) => String(data.get(k) ?? "").trim();
  if (text("nombre").length < 3) errors.nombre = "Indique nombre y apellido.";
  if (!CEDULA_RE.test(text("cedula").replace(/\./g, "")))
    errors.cedula = "Indique una cédula válida, p. ej. V-12345678.";
  if (!PHONE_RE.test(text("telefono")))
    errors.telefono = "Indique un teléfono válido, p. ej. 0412 000 0000.";
  if (!EMAIL_RE.test(text("correo")))
    errors.correo = "Indique un correo válido, p. ej. nombre@correo.com.";
  if (!text("ciudad")) errors.ciudad = "Indique la ciudad de residencia.";
  const cv = data.get("cv");
  if (!(cv instanceof File) || cv.size === 0) {
    errors.cv = "Adjunte el currículum.";
  } else if (!CV_TYPES.some((ext) => cv.name.toLowerCase().endsWith(ext))) {
    errors.cv = "El currículum debe estar en PDF o Word (.doc, .docx).";
  } else if (cv.size > CV_MAX_MB * 1024 * 1024) {
    errors.cv = `El currículum no debe superar ${CV_MAX_MB} MB.`;
  }
  if (!data.get("consentimiento"))
    errors.consentimiento = "Se requiere la autorización para tratar los datos.";
  return errors;
}

/** Formulario de postulación con CV: validación en cliente y envío al endpoint configurado. */
export function JobForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });

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
    const data = new FormData(form);
    const found = validate(data);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      form.querySelector<HTMLElement>(`#p-${first}`)?.focus();
      setStatus({ kind: "idle" });
      return;
    }

    if (!site.jobsEndpoint) {
      setStatus({
        kind: "error",
        message: `La postulación en línea aún no está habilitada. Mientras tanto, puede enviar el currículum al correo ${site.email}.`,
      });
      return;
    }

    setStatus({ kind: "sending" });
    try {
      data.set("origen", "web/empleo");
      const res = await fetch(site.jobsEndpoint, { method: "POST", body: data });
      if (!res.ok) throw new Error(String(res.status));
      formRef.current?.reset();
      setStatus({ kind: "sent" });
    } catch {
      setStatus({
        kind: "error",
        message: "No fue posible enviar la postulación. Intente de nuevo más tarde.",
      });
    }
  }

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      aria-label="Postulación"
      className="flex min-w-0 flex-[1.4_1_520px] flex-col gap-6 rounded-xl border border-line-cyan bg-glass-2 p-6 shadow-elevation-2 backdrop-blur-glass-2 sm:p-10"
    >
      <div className="flex flex-col gap-1">
        <h2 className="m-0 font-display text-2xl leading-8 font-semibold">Datos del postulante</h2>
        <p className="m-0 text-sm leading-5 text-ink-muted">
          Todos los campos son obligatorios salvo indicación.
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
        <div className="flex flex-col gap-2">
          <label className="field-label" htmlFor="p-nombre">
            Nombre y apellido
          </label>
          <Input {...fieldProps("nombre")} autoComplete="name" placeholder="Ej. José Rodríguez" />
          <FieldError id="p-nombre-error">{errors.nombre}</FieldError>
        </div>
        <div className="flex flex-col gap-2">
          <label className="field-label" htmlFor="p-cedula">
            Cédula de identidad
          </label>
          <Input {...fieldProps("cedula")} placeholder="V-12345678" />
          <FieldError id="p-cedula-error">{errors.cedula}</FieldError>
        </div>
        <div className="flex flex-col gap-2">
          <label className="field-label" htmlFor="p-telefono">
            Teléfono
          </label>
          <Input
            {...fieldProps("telefono")}
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="0412 000 0000"
          />
          <FieldError id="p-telefono-error">{errors.telefono}</FieldError>
        </div>
        <div className="flex flex-col gap-2">
          <label className="field-label" htmlFor="p-correo">
            Correo
          </label>
          <Input
            {...fieldProps("correo")}
            type="email"
            autoComplete="email"
            placeholder="nombre@correo.com"
          />
          <FieldError id="p-correo-error">{errors.correo}</FieldError>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
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
          <Select id="p-experiencia" name="experiencia" defaultValue={experienceOptions[0]}>
            {experienceOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="field-label" htmlFor="p-ciudad">
          Ciudad de residencia
        </label>
        <Input
          {...fieldProps("ciudad")}
          autoComplete="address-level2"
          placeholder="Ciudad o municipio"
        />
        <FieldError id="p-ciudad-error">{errors.ciudad}</FieldError>
      </div>

      <div className="flex flex-col gap-2">
        <label className="field-label" htmlFor="p-cv">
          Currículum (PDF o Word, máx. {CV_MAX_MB} MB)
        </label>
        <FileInput {...fieldProps("cv")} accept={CV_TYPES.join(",")} />
        <FieldError id="p-cv-error">{errors.cv}</FieldError>
      </div>

      <div className="flex flex-col gap-2">
        <label className="field-label" htmlFor="p-mensaje">
          Comentarios (opcional)
        </label>
        <Textarea
          id="p-mensaje"
          name="mensaje"
          rows={3}
          placeholder="Disponibilidad de turnos, cursos realizados…"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Checkbox
          {...fieldProps("consentimiento")}
          value="si"
          label="Autorizo a SEDIN a tratar mis datos para este proceso de selección."
        />
        <FieldError id="p-consentimiento-error">{errors.consentimiento}</FieldError>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={status.kind === "sending"}>
          {status.kind === "sending" ? "Enviando…" : "Enviar postulación"}
        </Button>
      </div>

      <div role="status" aria-live="polite" className="empty:hidden">
        {status.kind === "sent" && (
          <p className={cn(statusBox, "border-success/40 bg-success-subtle text-ink-success")}>
            Postulación enviada. El equipo de selección de SEDIN revisará el perfil y se comunicará
            con los candidatos preseleccionados.
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
