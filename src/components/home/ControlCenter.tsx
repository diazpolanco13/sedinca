import { BoltIcon, CameraIcon, CoilIcon, MonitorIcon } from "@/components/icons";
import { SectionTitle } from "@/components/ui/SectionHeading";

const features = [
  {
    Icon: CameraIcon,
    title: "Cámaras de seguridad",
    text: "Alta definición, visión nocturna y monitoreo en tiempo real.",
  },
  {
    Icon: MonitorIcon,
    title: "Vigilancia remota 24/7",
    text: "Supervisión profesional desde nuestro centro de control.",
  },
  { Icon: BoltIcon, title: "Cercado eléctrico", text: "Seguridad perimetral de alta efectividad." },
  { Icon: CoilIcon, title: "Concertinas", text: "Máxima disuasión y protección perimetral." },
];

/** 05 · Centro de control (panel oscuro). */
export function ControlCenter() {
  return (
    <section aria-labelledby="control-titulo" className="on-dark bg-azure-950 text-titanium-100">
      <div className="mx-auto flex max-w-[1344px] flex-wrap items-center gap-14 px-4 py-16 sm:px-8 lg:py-24">
        <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-5">
          <span className="eyebrow text-cyan-300">Tecnología · Centro de control</span>
          <SectionTitle className="text-white">
            <span id="control-titulo">
              Tecnología, experiencia y protección para lo que más valoras
            </span>
          </SectionTitle>
          <p className="m-0 text-[17px] leading-[26px] text-titanium-300">
            Protegemos tu entorno, cuidamos tu tranquilidad. Supervisión profesional desde nuestro
            centro de control, con monitoreo constante en tiempo real.
          </p>
          <div className="flex items-baseline gap-4 pt-2">
            <span className="font-display text-[72px] leading-[72px] font-bold text-cyan-400">
              24/7
            </span>
            <span className="font-display text-[13px] leading-[18px] font-semibold tracking-[0.06em] text-titanium-300 uppercase">
              Monitoreo constante,
              <br />
              protección total
            </span>
          </div>
        </div>
        <div className="grid min-w-0 flex-[1_1_520px] grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-4">
          {features.map(({ Icon, title, text }) => (
            <div
              key={title}
              className="flex flex-col gap-2.5 rounded-lg border border-azure-200/16 bg-azure-900/55 p-6"
            >
              <Icon size={28} className="text-cyan-300" />
              <div className="font-display text-lg leading-6 font-semibold text-white">{title}</div>
              <div className="text-sm leading-5 text-titanium-300">{text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
