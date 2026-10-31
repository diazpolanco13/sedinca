import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ContactForms } from "@/components/contact/ContactForms";
import { ContactHero } from "@/components/contact/ContactHero";
import { NoScriptContact } from "@/components/contact/NoScriptContact";
import { OfficeMap } from "@/components/contact/OfficeMap";
import { PriceNote } from "@/components/contact/PriceNote";
import { sectorSchemes } from "@/components/contact/sectorSchemes";
import { ClockIcon, MailIcon, MapPinIcon, UsersIcon } from "@/components/icons";
import { SitePage } from "@/components/layout/SitePage";
import { textLink } from "@/components/ui/links";
import { Accent, Section, SectionHeader } from "@/components/ui/Section";
import { ActionLink } from "@/components/ui/ActionLink";
import { Timeline } from "@/components/ui/Timeline";
import { CallLink, WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { emailHref, proposalMail, routes, site, waMessages } from "@/config/site";
import { umami } from "@/lib/analytics";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Cotización de vigilancia en Maracaibo",
  description:
    "Escríbanos por WhatsApp o llame al +58 414 164 2505, atención 24/7. Cotización de vigilancia privada, control de acceso y cámaras en Maracaibo y el Zulia.",
  path: routes.contact,
});

const nextSteps = [
  { title: "Conversamos", text: "Por WhatsApp o por teléfono, sobre lo que necesita proteger." },
  { title: "Coordinamos la inspección", text: "Visitamos su instalación para conocer accesos, horarios y riesgos." },
  { title: "Recibe una propuesta escrita", text: "Con el esquema recomendado para su caso." },
];

export default function ContactPage() {
  const responseLine = `Respuesta inmediata por WhatsApp y teléfono, atención ${site.hours}.`;

  return (
    <SitePage>
      <ContactHero
        crumbs={[{ label: "Contacto" }]}
        path={routes.contact}
        eyebrow={`Contacto · Atención ${site.hours}`}
        title={{ text: "Hablemos de la seguridad de", highlight: "su instalación" }}
        lead="Escríbanos por WhatsApp o llámenos. Le orientamos sobre vigilancia, control de acceso y sistemas electrónicos en Maracaibo y el Zulia."
      >
        <div data-hero-actions="" className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap sm:gap-4">
          <WhatsAppLink message={waMessages.general} ubicacion="contacto" size="lg" block />
          <CallLink ubicacion="contacto" variant="onPhoto" size="lg" block />
        </div>
        <p className="m-0 flex items-start gap-2.5 text-[15px] leading-[22px] text-white/88 sm:text-base">
          <ClockIcon size={20} className="mt-px flex-none text-cyan-300" />
          {responseLine}
        </p>
      </ContactHero>

      <Section tone="light" id="formulario" labelledBy="formulario-titulo">
        {/* Por debajo de lg: titular, diagnóstico y después «Qué pasa
            después» (la columna izquierda se disuelve con `contents` y cada
            pieza toma su `order`). Desde lg, columna fija a la izquierda. */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="contents lg:sticky lg:top-28 lg:col-span-4 lg:flex lg:flex-col lg:gap-10 lg:self-start">
            <div className="order-1">
              <SectionHeader
                id="formulario-titulo"
                eyebrow="Diagnóstico o mensaje libre"
                title={
                  <>
                    Cuéntenos qué necesita <Accent>proteger</Accent>
                  </>
                }
                lead="Con 4 preguntas, el diagnóstico le propone un esquema; si lo prefiere, escríbalo con sus palabras. Los dos se abren en WhatsApp ya escritos."
                size="md"
              />
            </div>
            <div className="order-3 flex flex-col gap-5">
              <p className="eyebrow m-0 text-ink-muted">Qué pasa después</p>
              <Timeline items={nextSteps} label="Qué pasa después" />
            </div>
          </div>
          <div className="order-2 min-w-0 lg:col-span-8">
            <NoScriptContact ubicacion="contacto" />
            <ContactForms schemes={sectorSchemes()} priceNote={<PriceNote />} />
          </div>
        </div>
      </Section>

      <Section tone="sunken" id="canales" labelledBy="canales-titulo">
        <SectionHeader
          id="canales-titulo"
          eyebrow="Otros canales"
          title={
            <>
              Correo, oficina y <Accent>horario</Accent>
            </>
          }
          lead={
            <>
              Además de WhatsApp y del teléfono <span className="whitespace-nowrap">{site.phone}</span>.
            </>
          }
          size="md"
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:gap-8">
          <ul className="m-0 grid list-none content-start gap-4 p-0 lg:col-span-5">
            <Channel Icon={MailIcon} label="Correo">
              <a
                href={emailHref()}
                {...umami("correo", { ubicacion: "contacto" })}
                className="font-medium break-all text-ink no-underline hover:text-ink-brand"
              >
                {site.email}
              </a>
              <p className="mt-2 mb-0 text-[15px] leading-[22px] text-ink-muted">
                ¿Compra para una empresa?{" "}
                <ActionLink action={proposalMail("contacto")} variant="inline" />
              </p>
            </Channel>
            <Channel Icon={MapPinIcon} label="Oficina">
              <p className="m-0 font-medium text-ink">{site.address}</p>
              <p className="m-0 text-ink-muted">{site.city}</p>
              <p className="mt-2 mb-0 text-[15px] leading-[22px] text-ink-muted">
                {site.name} · RIF {site.rifDisplay}
              </p>
            </Channel>
            <Channel Icon={ClockIcon} label="Horario">
              <p className="m-0 font-medium text-ink">Atención {site.hours}</p>
              <p className="mt-1 mb-0 text-[15px] leading-[22px] text-ink-muted">
                Respuesta inmediata por{" "}
                <WhatsAppLink message={waMessages.general} ubicacion="contacto" variant="inline">
                  WhatsApp
                </WhatsAppLink>{" "}
                y{" "}
                <CallLink ubicacion="contacto" variant="inline">
                  teléfono
                </CallLink>
                .
              </p>
            </Channel>
            <Channel Icon={UsersIcon} label="Empleo">
              <p className="m-0 text-[15px] leading-[22px] text-ink-muted">
                ¿Busca trabajo como oficial de seguridad?{" "}
                <Link href={routes.jobs} prefetch={false} className={textLink}>
                  Vea los requisitos y postule
                </Link>
                .
              </p>
            </Channel>
          </ul>
          <div className="min-w-0 lg:col-span-7">
            <OfficeMap ubicacion="contacto" />
          </div>
        </div>
      </Section>
    </SitePage>
  );
}

function Channel({
  Icon,
  label,
  children,
}: {
  Icon: typeof MailIcon;
  label: string;
  children: ReactNode;
}) {
  return (
    <li className="flex gap-4 rounded-lg border border-line-card bg-surface p-5">
      <span
        aria-hidden="true"
        className="grid h-11 w-11 flex-none place-items-center rounded-md bg-surface-brand text-ink-brand"
      >
        <Icon size={22} />
      </span>
      <div className="min-w-0 flex-1 text-base leading-6">
        <h3 className="field-label m-0 mb-1.5">{label}</h3>
        {children}
      </div>
    </li>
  );
}
