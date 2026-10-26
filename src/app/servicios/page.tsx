import type { Metadata } from "next";
import { ClipboardIcon, EyeIcon, MedalIcon, ShieldCheckIcon } from "@/components/icons";
import { SitePage } from "@/components/layout/SitePage";
import { FeatureBand, SectionHeader, StepList } from "@/components/ui/blocks";
import { Card } from "@/components/ui/Card";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHero } from "@/components/ui/PageHero";
import { ArrowLink } from "@/components/ui/SectionHeading";
import { serviceCatalog, servicesContent } from "@/content/services";
import { routes } from "@/config/site";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Vigilancia privada, control de acceso y salida de personal, sistemas de seguridad electrónica y gestión de riesgos para industrias, empresas, corporaciones y conjuntos residenciales.",
};

const reasons = [
  {
    Icon: ShieldCheckIcon,
    title: "Seguridad profesional",
    text: "Personal altamente capacitado en cada puesto de servicio.",
  },
  {
    Icon: EyeIcon,
    title: "Monitoreo y control",
    text: "Supervisión constante 24/7 desde nuestro centro de control.",
  },
  {
    Icon: ClipboardIcon,
    title: "Gestión de riesgos",
    text: "Prevención, análisis y respuesta efectiva ante cualquier novedad.",
  },
  {
    Icon: MedalIcon,
    title: "Compromiso y confianza",
    text: "Aliados estratégicos en la protección de tu operación.",
  },
];

const steps = [
  {
    title: "Inspección del sitio",
    text: "Visitamos las instalaciones y evaluamos accesos, perímetro y riesgos.",
  },
  {
    title: "Propuesta a la medida",
    text: "Combinamos los servicios que tu operación necesita: oficiales, controles y tecnología.",
  },
  {
    title: "Puesta en servicio",
    text: "Oficiales uniformados y equipados, con libro de novedades y controles de entrada y salida.",
  },
  {
    title: "Supervisión continua",
    text: "Supervisores verifican el servicio y te informan cada novedad.",
  },
];

export default function ServicesPage() {
  return (
    <SitePage>
      <PageHero
        crumbs={[{ label: "Servicios" }]}
        eyebrow="Servicios"
        title={{
          text: "Una sola empresa para proteger personas, accesos y",
          highlight: "perímetros",
        }}
        lead="Vigilancia privada, control de acceso, sistemas electrónicos y gestión de riesgos para industrias, empresas, corporaciones y conjuntos residenciales."
        secondary={{ label: "Ver servicios", href: "#catalogo" }}
      />

      <section id="catalogo" aria-labelledby="catalogo-titulo" className="scroll-mt-4">
        <div className="mx-auto flex max-w-[1344px] flex-col gap-8 px-4 pt-16 pb-12 sm:px-8 lg:pt-[88px] lg:pb-14">
          <SectionHeader
            eyebrow="Catálogo"
            title="Cuatro líneas de servicio, un mismo estándar"
            id="catalogo-titulo"
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {servicesContent.map((s) => {
              const { title, Icon, summary, includes } = serviceCatalog[s.slug];
              return (
                <Card key={s.slug} elevation={1} accent>
                  <div className="flex h-full flex-col gap-4 p-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-surface-brand text-ink-brand">
                      <Icon size={26} />
                    </div>
                    <h3 className="m-0 font-display text-2xl leading-8 font-semibold">{title}</h3>
                    <p className="m-0 text-base leading-6 text-ink-muted">{summary}</p>
                    <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-2 p-0 text-[15px] leading-[22px]">
                      {includes.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <ArrowLink
                      href={`${routes.services}/${s.slug}`}
                      className="mt-auto py-2 text-[15px]"
                    >
                      Ver servicio
                    </ArrowLink>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <FeatureBand label="Por qué SEDIN" items={reasons} />

      <section aria-labelledby="proceso-titulo">
        <div className="mx-auto flex max-w-[1344px] flex-col gap-8 px-4 py-16 sm:px-8 lg:py-[88px]">
          <SectionHeader
            eyebrow="Cómo trabajamos"
            title="Del primer recorrido al reporte de novedades"
            id="proceso-titulo"
          />
          <StepList steps={steps} />
        </div>
      </section>

      <CtaBand label="Asesoría" eyebrow="¿No sabes qué servicio necesitas?">
        <p className="m-0 max-w-[560px] text-[17px] leading-[26px] text-ink-muted">
          Un asesor de SEDIN evalúa tus instalaciones y propone la combinación de servicios adecuada
          para tu operación.
        </p>
      </CtaBand>
    </SitePage>
  );
}
