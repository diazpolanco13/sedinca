import type { Metadata } from "next";
import { CallToAction } from "@/components/home/CallToAction";
import { Staff } from "@/components/home/Staff";
import { Values } from "@/components/home/Values";
import { ClipboardCheckIcon, ClipboardIcon, EyeIcon, MedalIcon } from "@/components/icons";
import { SitePage } from "@/components/layout/SitePage";
import { SectionHeader } from "@/components/ui/blocks";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/ui/PageHero";
import { SectionTitle } from "@/components/ui/SectionHeading";
import { routes, site } from "@/config/site";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Seguridad y Defensa Integral, Compañía Anónima (SEDIN, C.A.): seguridad privada y protección preventiva no armada a personas y bienes, con personal capacitado y gestión de calidad.",
};

/* Fuente: SED-GC-PR-01 Reglamento Interno (objeto, modalidades, supervisión, calidad). */
const facts = [
  { term: "Razón social", value: site.legalName },
  { term: "RIF", value: site.rif },
  { term: "Modalidades", value: "Vigilancia fija · Vigilancia móvil · Consultoría y asesoría" },
  {
    term: "Sectores",
    value: "Industria petrolera · Empresas e industria · Corporaciones · Residencial y condominios",
  },
];

const quality = [
  {
    Icon: ClipboardCheckIcon,
    title: "Procedimientos documentados",
    text: "Procedimientos codificados y con control de revisiones, estructurados según la norma ISO 9001.",
  },
  {
    Icon: EyeIcon,
    title: "Supervisión en sitio",
    text: "Supervisores inspeccionan los puestos, verifican asistencia y puntualidad y analizan los riesgos de cada servicio.",
  },
  {
    Icon: ClipboardIcon,
    title: "Libro de novedades y controles",
    text: "Cada puesto cuenta con libro de novedades y controles de entrada y salida de personal y vehículos.",
  },
  {
    Icon: MedalIcon,
    title: "Mejora continua",
    text: "Inducción del personal y mejora continua de procedimientos, instrucciones y normas.",
  },
];

export default function AboutPage() {
  return (
    <SitePage>
      <PageHero
        crumbs={[{ label: "Nosotros" }]}
        eyebrow="Nosotros"
        title={{ text: "Seguridad y Defensa", highlight: "Integral" }}
        lead="Atentos siempre, protegiendo lo que más importa. Seguridad privada y protección preventiva para personas y bienes."
        secondary={{ label: "Trabaja con nosotros", href: routes.jobs }}
      />

      {/* Quiénes somos */}
      <section aria-labelledby="quienes-titulo">
        <div className="mx-auto flex max-w-[1344px] flex-wrap items-start gap-14 px-4 py-16 sm:px-8 lg:py-24">
          <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-5">
            <SectionHeader
              eyebrow="Quiénes somos"
              title="Seguridad privada y protección preventiva"
              id="quienes-titulo"
            />
            <p className="m-0 text-[17px] leading-[26px] text-ink-muted">
              {site.legalName} ({site.name}) presta servicios de seguridad privada y protección
              preventiva no armada a personas y bienes, en las modalidades de vigilancia fija y
              móvil, y servicios de consultoría y asesoría.
            </p>
            <p className="m-0 text-[17px] leading-[26px] text-ink-muted">
              La empresa está organizada por procesos, con equipos multidisciplinarios, reglas
              claras y métodos compartidos, para asegurar la consistencia y la calidad de cada
              servicio.
            </p>
          </div>
          <Card elevation={1} accent className="min-w-0 flex-[1_1_400px]">
            <dl className="m-0 flex flex-col p-2">
              {facts.map(({ term, value }, i) => (
                <div key={term} className={i > 0 ? "border-t border-line py-4" : "pb-4"}>
                  <dt className="field-label">{term}</dt>
                  <dd className="m-0 pt-1 text-base leading-6 font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </section>

      <Values />
      <Staff />

      {/* Gestión de calidad */}
      <section aria-labelledby="calidad-titulo" className="on-dark bg-azure-950 text-titanium-100">
        <div className="mx-auto flex max-w-[1344px] flex-col gap-10 px-4 py-16 sm:px-8 lg:py-24">
          <div className="flex max-w-[640px] flex-col gap-3">
            <span className="eyebrow text-cyan-300">Gestión de calidad</span>
            <SectionTitle className="text-white">
              <span id="calidad-titulo">Procedimientos claros y mejora continua</span>
            </SectionTitle>
            <p className="m-0 text-[17px] leading-[26px] text-titanium-300">
              Un Sistema de Gestión de Calidad ordena cada proceso de la empresa, desde la
              planificación del servicio hasta el reporte de novedades al cliente.
            </p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
            {quality.map(({ Icon, title, text }) => (
              <div
                key={title}
                className="flex flex-col gap-2.5 rounded-lg border border-azure-200/16 bg-azure-900/55 p-6"
              >
                <Icon size={28} className="text-cyan-300" />
                <div className="font-display text-lg leading-6 font-semibold text-white">
                  {title}
                </div>
                <div className="text-sm leading-5 text-titanium-300">{text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CallToAction />
    </SitePage>
  );
}
