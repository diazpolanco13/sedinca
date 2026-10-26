import { BriefcaseIcon, BuildingIcon, FactoryIcon, HomeIcon } from "@/components/icons";
import { Placeholder } from "@/components/ui/Placeholder";
import { Eyebrow, SectionTitle } from "@/components/ui/SectionHeading";

const sectors = [
  {
    Icon: FactoryIcon,
    photo: "Espacio para fotografía de instalación petrolera",
    title: "Industria petrolera",
    text: "Protección de instalaciones, activos críticos y personal en operaciones de alto riesgo.",
  },
  {
    Icon: BuildingIcon,
    photo: "Espacio para fotografía de planta o almacén",
    title: "Empresas e industria",
    text: "Seguridad corporativa para oficinas, plantas, almacenes y centros de distribución.",
  },
  {
    Icon: BriefcaseIcon,
    photo: "Espacio para fotografía de sede corporativa",
    title: "Corporaciones",
    text: "Soluciones a la medida, discreción, control y protección para tu tranquilidad.",
  },
  {
    Icon: HomeIcon,
    photo: "Espacio para fotografía de conjunto residencial",
    title: "Residencial y condominios",
    text: "Presencia disuasiva, vigilancia 24/7 y control de accesos para conjuntos residenciales.",
  },
];

/** 04 · Sectores. */
export function Sectors() {
  return (
    <section id="sectores" aria-labelledby="sectores-titulo" className="bg-surface-sunken">
      <div className="mx-auto flex max-w-[1344px] flex-col gap-10 px-4 py-16 sm:px-8 lg:py-[88px]">
        <div className="flex max-w-[640px] flex-col gap-3">
          <Eyebrow>Sectores</Eyebrow>
          <SectionTitle>
            <span id="sectores-titulo">Servicios especializados para cada entorno</span>
          </SectionTitle>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
          {sectors.map(({ Icon, photo, title, text }) => (
            <div
              key={title}
              className="flex flex-col gap-3 rounded-lg border border-line-card bg-surface p-6"
            >
              <Placeholder label={photo} icon={<Icon size={28} />} className="h-40" />
              <h3 className="m-0 font-display text-xl leading-7 font-semibold">{title}</h3>
              <p className="m-0 text-[15px] leading-[22px] text-ink-muted">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
