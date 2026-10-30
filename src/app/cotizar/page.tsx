import type { Metadata } from "next";
import { ContactHero } from "@/components/contact/ContactHero";
import { NoScriptContact } from "@/components/contact/NoScriptContact";
import { PriceNote } from "@/components/contact/PriceNote";
import { QuoteWizard } from "@/components/contact/QuoteWizard";
import { sectorSchemes } from "@/components/contact/sectorSchemes";
import { CheckIcon } from "@/components/icons";
import { SitePage } from "@/components/layout/SitePage";
import { Section } from "@/components/ui/Section";
import { CallLink, WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { ctaLabels, routes, site, waMessages } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Diagnóstico de seguridad en 4 preguntas",
  description:
    "Responda 4 preguntas y reciba el esquema de seguridad recomendado para su condominio, comercio, planta o instalación petrolera del Zulia, listo para WhatsApp.",
  path: routes.cotizar,
});

const assurances = [
  "Solo su nombre es obligatorio",
  "El resumen se abre en WhatsApp ya escrito",
  `Atención ${site.hours}`,
];

export default function CotizarPage() {
  return (
    <SitePage>
      {/* Todos los «Diagnóstico y cotización» y «Cotizar» llevan aquí: el
          antetítulo repite el nombre del botón. Portada mínima para que el
          paso 1 se vea enseguida: titular compacto; en el teléfono, solo la
          primera frase de la entradilla; en escritorio (lg), solo ruta,
          antetítulo y titular (el teléfono está en la barra superior y el
          botón flotante de WhatsApp aparece al pasar la portada). */}
      <ContactHero
        crumbs={[{ label: "Cotizar" }]}
        path={routes.cotizar}
        eyebrow={ctaLabels.diagnostico}
        title={{ text: "Su esquema de seguridad en", highlight: "4 preguntas" }}
        titleSize="compact"
        leadClassName="lg:hidden"
        lead={
          <>
            Rápidas y sin compromiso.
            <span className="max-sm:hidden">
              {" "}
              Al final verá el esquema que le recomendamos y por qué, y lo envía por WhatsApp para que un asesor
              prepare su propuesta.
            </span>
          </>
        }
      >
        <div
          data-hero-actions=""
          className="flex flex-col gap-3 text-[15px] leading-[22px] text-white/88 sm:flex-row sm:items-center sm:gap-4 lg:hidden"
        >
          <p className="m-0">¿Prefiere hablar ahora?</p>
          <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-4">
            <WhatsAppLink message={waMessages.general} ubicacion="cotizar" variant="onPhoto" size="sm">
              WhatsApp
            </WhatsAppLink>
            <CallLink ubicacion="cotizar" variant="onPhoto" size="sm">
              Llamar
            </CallLink>
          </div>
        </div>
      </ContactHero>

      {/* Poco aire arriba: el diagnóstico empieza justo bajo la portada. */}
      <Section tone="sunken" label="Diagnóstico de seguridad" space="none" className="pt-8 pb-14 lg:pb-20">
        <div className="mx-auto flex max-w-[880px] flex-col gap-6">
          <NoScriptContact ubicacion="cotizar" />
          <QuoteWizard ubicacion="cotizar" schemes={sectorSchemes()} priceNote={<PriceNote />} />
          <ul
            data-wizard=""
            className="m-0 flex list-none flex-wrap justify-center gap-x-6 gap-y-2 p-0 text-[15px] leading-[22px] text-ink-muted"
          >
            {assurances.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckIcon size={18} className="flex-none text-ink-brand" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </SitePage>
  );
}
