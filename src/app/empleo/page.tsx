import type { Metadata } from "next";
import { ClipboardCheckIcon, HeadsetIcon, MedalIcon, ShieldCheckIcon } from "@/components/icons";
import { JobForm } from "@/components/jobs/JobForm";
import { SitePage } from "@/components/layout/SitePage";
import { FeatureBand, SectionHeader, StepList } from "@/components/ui/blocks";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { PageHero } from "@/components/ui/PageHero";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Trabaja con nosotros",
  description:
    "Vacantes de oficial de seguridad y supervisor en SEDIN, C.A. Formación, disciplina y crecimiento profesional. Postulación en línea con currículum.",
};

/* Funciones y perfil: SED-GC-PR-01 Reglamento Interno, capítulos III y IV. */
const vacancies = [
  {
    chip: "Operativo",
    title: "Oficial de seguridad",
    text: "Protección de personas y bienes en puestos de vigilancia fija y móvil: control de entradas y salidas, registro en el libro de novedades y reporte inmediato de cualquier novedad al supervisor.",
    profile: [
      "Responsabilidad y capacidad de respuesta",
      "Excelente presencia personal y buen trato",
      "Puntualidad y disciplina",
      "Discreción y confidencialidad",
    ],
  },
  {
    chip: "Supervisión",
    title: "Supervisor de seguridad",
    text: "Responsable de la correcta ejecución del servicio: inspección de puestos, control de asistencia y puntualidad, entrenamiento del personal en las órdenes de servicio y análisis de riesgos en cada puesto.",
    profile: [
      "Liderazgo basado en el ejemplo",
      "Conocimiento técnico y actualización constante",
      "Trato digno y respetuoso al personal",
      "Toma de decisiones oportuna",
    ],
  },
];

const offer = [
  {
    Icon: ClipboardCheckIcon,
    title: "Formación",
    text: "Inducción y entrenamiento en las órdenes de servicio y los procedimientos de cada puesto.",
  },
  {
    Icon: ShieldCheckIcon,
    title: "Equipamiento",
    text: "Uniforme, calzado de seguridad y equipos de comunicación para prestar el servicio.",
  },
  {
    Icon: MedalIcon,
    title: "Crecimiento profesional",
    text: "Disciplina, experiencia y oportunidades de crecer dentro de la organización.",
  },
  {
    Icon: HeadsetIcon,
    title: "Respaldo en el puesto",
    text: "Supervisores que acompañan el servicio y atienden cada novedad.",
  },
];

const steps = [
  {
    title: "Postulación en línea",
    text: "Completa el formulario y adjunta tu currículum.",
  },
  {
    title: "Reclutamiento y selección",
    text: "El equipo de selección revisa el perfil y contacta a los candidatos preseleccionados.",
  },
  {
    title: "Admisión",
    text: "Entrega de documentos y asignación de cargo, turno y puesto.",
  },
  {
    title: "Inducción",
    text: "Formación en procedimientos, normas y órdenes de servicio antes de iniciar.",
  },
];

export default function JobsPage() {
  return (
    <SitePage>
      <PageHero
        crumbs={[{ label: "Trabaja con nosotros" }]}
        eyebrow="Trabaja con nosotros"
        title={{ text: "Únete al equipo de oficiales de", highlight: "seguridad" }}
        lead="Formación, disciplina y crecimiento profesional. Conoce las vacantes y postula en línea."
        primary={{ label: "Postular en línea", href: "#postulacion" }}
        secondary={{ label: "Ver vacantes", href: "#vacantes" }}
      />

      {/* Vacantes */}
      <section id="vacantes" aria-labelledby="vacantes-titulo" className="scroll-mt-4">
        <div className="mx-auto flex max-w-[1344px] flex-col gap-8 px-4 pt-16 pb-12 sm:px-8 lg:pt-[88px] lg:pb-14">
          <SectionHeader
            eyebrow="Vacantes"
            title="Oficiales de seguridad y supervisores"
            id="vacantes-titulo"
          />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-6">
            {vacancies.map((v) => (
              <Card key={v.title} elevation={1} accent>
                <div className="flex flex-col gap-3 p-2">
                  <Chip className="self-start">{v.chip}</Chip>
                  <h3 className="m-0 font-display text-2xl leading-8 font-semibold">{v.title}</h3>
                  <p className="m-0 text-base leading-6 text-ink-muted">{v.text}</p>
                  <span className="field-label pt-2">Perfil</span>
                  <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[15px] leading-[22px]">
                    {v.profile.map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
          <p className="m-0 text-[15px] leading-[22px] text-ink-muted">
            Requisitos de postulación: {site.jobRequirements}
          </p>
        </div>
      </section>

      <FeatureBand label="Qué ofrecemos" items={offer} />

      <section aria-labelledby="proceso-titulo">
        <div className="mx-auto flex max-w-[1344px] flex-col gap-8 px-4 py-16 sm:px-8 lg:py-[88px]">
          <SectionHeader
            eyebrow="Proceso de selección"
            title="De la postulación a la inducción"
            id="proceso-titulo"
          />
          <StepList steps={steps} />
        </div>
      </section>

      {/* Postulación */}
      <section
        id="postulacion"
        aria-labelledby="postulacion-titulo"
        className="scroll-mt-4 bg-[image:var(--gradient-atmosphere)]"
      >
        <div className="mx-auto flex max-w-[1344px] flex-wrap items-start gap-12 px-4 py-16 sm:px-8 lg:py-24">
          <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-5">
            <SectionHeader eyebrow="Postulación" title="Postula en línea" id="postulacion-titulo">
              Completa tus datos y adjunta tu currículum. El equipo de selección de SEDIN revisará
              tu perfil.
            </SectionHeader>
            <ul className="m-0 flex list-none flex-col gap-1 rounded-lg border border-line-card bg-surface p-2 text-[15px] leading-[22px]">
              <li className="p-3">
                <span className="field-label block">Formato del currículum</span>
                PDF o Word (.doc, .docx), hasta 5 MB.
              </li>
              <li className="border-t border-line p-3">
                <span className="field-label block">Requisitos</span>
                {site.jobRequirements}
              </li>
              <li className="border-t border-line p-3">
                <span className="field-label block">Consultas</span>
                {site.phone} · {site.email}
              </li>
            </ul>
          </div>
          <JobForm />
        </div>
      </section>
    </SitePage>
  );
}
