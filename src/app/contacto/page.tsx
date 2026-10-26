import type { Metadata } from "next";
import type { ReactNode } from "react";
import { OfficeMap } from "@/components/contact/OfficeMap";
import { QuoteForm } from "@/components/contact/QuoteForm";
import { ChatIcon, ClockIcon, MailIcon, PhoneIcon } from "@/components/icons";
import { SitePage } from "@/components/layout/SitePage";
import { PageHero } from "@/components/ui/PageHero";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { emailHref, isPlaceholder, phoneHref, site, whatsappHref } from "@/config/site";

export const metadata: Metadata = {
  title: "Contacto y cotización",
  description:
    "Solicite una cotización de vigilancia privada, control de acceso o sistemas de seguridad electrónica a SEDIN, C.A.",
};

export default function ContactPage() {
  const wa = isPlaceholder(site.whatsappNumber) ? undefined : whatsappHref();
  const channels: { Icon: typeof PhoneIcon; label: string; value: string; href?: string }[] = [
    { Icon: PhoneIcon, label: "Teléfono", value: site.phone, href: phoneHref() },
    { Icon: ChatIcon, label: "WhatsApp", value: site.whatsappNumber, href: wa },
    { Icon: MailIcon, label: "Correo", value: site.email, href: emailHref() },
    { Icon: ClockIcon, label: "Horario de oficina", value: site.hours },
  ];

  return (
    <SitePage>
      <PageHero
        crumbs={[{ label: "Contacto" }]}
        eyebrow="Contacto"
        title={{ text: "Solicita tu", highlight: "cotización" }}
        lead="Cuéntanos qué necesitas proteger. Un asesor de SEDIN te contactará para coordinar la inspección del sitio."
        primary={{ label: "Completar solicitud", href: "#solicitud" }}
      />

      <section
        id="solicitud"
        aria-label="Canales y formulario"
        className="scroll-mt-4 bg-[image:var(--gradient-atmosphere)]"
      >
        <div className="mx-auto flex max-w-[1344px] flex-wrap items-start gap-12 px-4 py-12 sm:px-8 sm:pt-16 sm:pb-24">
          <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-6">
            <Eyebrow>Canales directos</Eyebrow>
            <ul className="m-0 flex list-none flex-col gap-1 rounded-lg border border-line-card bg-surface p-2">
              {channels.map(({ Icon, label, value, href }, i) => (
                <li
                  key={label}
                  className={
                    i > 0
                      ? "flex items-center gap-4 border-t border-line p-3"
                      : "flex items-center gap-4 p-3"
                  }
                >
                  <Icon size={24} className="flex-none text-ink-brand" />
                  <div>
                    <div className="font-display text-[12px] font-semibold tracking-[0.06em] text-ink-muted uppercase">
                      {label}
                    </div>
                    <ChannelValue href={href}>{value}</ChannelValue>
                  </div>
                </li>
              ))}
            </ul>

            <Eyebrow>Ubicación</Eyebrow>
            <OfficeMap />
          </div>

          <QuoteForm />
        </div>
      </section>
    </SitePage>
  );
}

function ChannelValue({ href, children }: { href?: string; children: ReactNode }) {
  const cls = "text-base leading-6 font-medium";
  if (!href) return <div className={cls}>{children}</div>;
  return (
    <a
      href={href}
      {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`${cls} block text-ink no-underline hover:text-ink-brand`}
    >
      {children}
    </a>
  );
}
