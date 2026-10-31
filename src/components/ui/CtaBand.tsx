import type { ReactNode } from "react";
import { ClockIcon, PinIcon } from "@/components/icons";
import { CONTACT_ZONE_CLASS } from "@/components/layout/contactZone";
import { ActionGroup } from "@/components/ui/ActionLink";
import { GlassCard } from "@/components/ui/GlassCard";
import { Section, SectionHeader } from "@/components/ui/Section";
import { CallLink } from "@/components/ui/WhatsAppLink";
import {
  audienceActions,
  site,
  waMessages,
  type Audience,
  type CtaAction,
  type SectorSlug,
} from "@/config/site";
import type { ServiceContent } from "@/content/services";
import { umami } from "@/lib/analytics";

/**
 * Cierre persuasivo de página (sección oscura): titular, entradilla, botones
 * según la audiencia y, a la derecha (solo desde 1024px), la tarjeta de
 * contacto 24/7: botón «Llamar» con «Respuesta inmediata, en tiempo real», oficina
 * y «Cómo llegar». WhatsApp no se repite en la tarjeta: ya es el botón
 * principal. En móvil la tarjeta no se pinta: el pie, justo debajo, y la
 * barra de contacto ya llevan teléfono, WhatsApp y dirección.
 *
 * Mientras el cierre está en pantalla, el botón flotante de WhatsApp se
 * retira (clase `CONTACT_ZONE_CLASS`).
 *
 *   <CtaBand audience="residencial" sector="condominios" whatsappMessage={sector.whatsapp} ubicacion="cierre" />
 *   <CtaBand audience="empresa" actions={sector.cta} />
 *
 * Compatibilidad: acepta las props anteriores (`label`, `eyebrow`,
 * `children`, `cta`) para que las páginas antiguas sigan compilando.
 */
export function CtaBand({
  id = "cierre",
  eyebrow = "Hablemos",
  title = "Cuéntenos qué necesita proteger",
  lead = "Un asesor le responde y coordina con usted la inspección del sitio. Sin compromiso.",
  audience = "general",
  whatsappMessage,
  ubicacion = "cierre",
  sector,
  servicio,
  actions,
  footnote,
  contactCard = true,
  children,
  label,
  cta,
}: {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  lead?: ReactNode;
  audience?: Audience | "general";
  whatsappMessage?: string;
  /** Ubicación para Umami (por defecto `cierre`). */
  ubicacion?: string;
  sector?: SectorSlug;
  servicio?: ServiceContent["slug"];
  /** Sustituye a los botones calculados por audiencia. */
  actions?: readonly CtaAction[];
  /** Línea final, p. ej. «¿Busca empleo como oficial de seguridad? Postule aquí →». */
  footnote?: ReactNode;
  /** Tarjeta de contacto 24/7 a la derecha (solo desde 1024px). */
  contactCard?: boolean;
  children?: ReactNode;
  /** @deprecated Nombre accesible (API anterior). */
  label?: string;
  /** @deprecated Enlace extra (API anterior); se añade como enlace de texto. */
  cta?: { label: string; href: string };
}) {
  const message =
    whatsappMessage ??
    (sector ? waMessages.sector[sector] : servicio ? waMessages.servicio[servicio] : waMessages.general);
  const computed = actions ?? audienceActions(audience, { ubicacion, whatsapp: message, sector, servicio });
  const all: CtaAction[] = cta ? [...computed, { kind: "link", label: cta.label, href: cta.href }] : [...computed];
  const titleId = `${id}-titulo`;

  return (
    <Section tone="dark" id={id} labelledBy={titleId} label={label} className={CONTACT_ZONE_CLASS}>
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="flex flex-col gap-8 lg:col-span-7">
          <SectionHeader eyebrow={eyebrow} title={title} lead={lead} id={titleId} />
          {children}
          <ActionGroup actions={all} tone="dark" size="lg" />
          {footnote && <p className="m-0 text-[15px] leading-6 text-ink-muted">{footnote}</p>}
        </div>

        {contactCard && (
          <GlassCard tone="dark" level={2} accent className="hidden p-8 lg:col-span-5 lg:block">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 text-ink-muted">
                <ClockIcon size={20} className="text-cyan-300" />
                <span className="eyebrow">Atención {site.hours}</span>
              </div>
              <div className="flex flex-col gap-3">
                <CallLink ubicacion={ubicacion} variant="onPhoto" size="md" className="self-start" />
                <p className="m-0 text-[15px] leading-6 text-ink-muted">
                  {site.responseTime}, por WhatsApp y por teléfono.
                </p>
              </div>
              <div className="flex gap-3 border-t border-line pt-5 text-[15px] leading-6 text-ink-muted">
                <PinIcon size={20} className="mt-0.5 flex-none text-cyan-300" />
                <span>
                  {site.address}, {site.city}.{" "}
                  <a
                    href={site.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...umami("como-llegar", { ubicacion })}
                    className="font-semibold whitespace-nowrap text-cyan-200 underline underline-offset-[3px]"
                  >
                    Cómo llegar
                    <span className="sr-only"> (abre Google Maps)</span>
                  </a>
                </span>
              </div>
            </div>
          </GlassCard>
        )}
      </div>
    </Section>
  );
}
