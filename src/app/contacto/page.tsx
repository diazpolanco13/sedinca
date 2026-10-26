import type { Metadata } from "next";
import type { ReactNode } from "react";
import { QuoteForm } from "@/components/contact/QuoteForm";
import { ChatIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/icons";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Placeholder } from "@/components/ui/Placeholder";
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
    { Icon: PinIcon, label: "Oficina", value: `${site.address} · ${site.hours}` },
  ];

  return (
    <>
      <SiteHeader variant="solid" />
      <main>
        <section className="bg-[image:var(--gradient-atmosphere)]">
          <div className="mx-auto flex max-w-[1344px] flex-wrap items-start gap-12 px-4 pt-12 pb-16 sm:px-8 sm:pt-16 sm:pb-24">
            <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-6">
              <Eyebrow>Contacto</Eyebrow>
              <h1 className="m-0 font-display text-[clamp(36px,4vw,52px)] leading-[1.08] font-bold tracking-[-0.02em]">
                Solicita tu cotización
              </h1>
              <p className="m-0 text-lg leading-7 text-ink-muted">
                Cuéntanos qué necesitas proteger. Un asesor de SEDIN te contactará para coordinar la
                inspección del sitio.
              </p>

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

              <Placeholder
                tone="map"
                label="Espacio para mapa de ubicación de la oficina"
                text="[Mapa de ubicación]"
                className="h-[202px]"
              />
            </div>

            <QuoteForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
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
