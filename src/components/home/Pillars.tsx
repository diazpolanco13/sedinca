import { ClipboardIcon, EyeIcon, MedalIcon, ShieldCheckIcon } from "@/components/icons";

const pillars = [
  { Icon: ShieldCheckIcon, title: "Seguridad profesional", text: "Personal altamente capacitado." },
  { Icon: EyeIcon, title: "Monitoreo y control", text: "Supervisión constante 24/7." },
  {
    Icon: ClipboardIcon,
    title: "Gestión de riesgos",
    text: "Prevención, análisis y respuesta efectiva.",
  },
  {
    Icon: MedalIcon,
    title: "Compromiso y confianza",
    text: "Aliados estratégicos en tu protección.",
  },
];

/** 02 · Pilares: por qué SEDIN. */
export function Pillars() {
  return (
    <section aria-label="Por qué SEDIN" className="border-b border-line bg-surface">
      <div className="mx-auto grid max-w-[1344px] grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6 px-4 py-8 sm:px-8">
        {pillars.map(({ Icon, title, text }) => (
          <div key={title} className="flex items-start gap-4">
            <Icon size={32} className="flex-none text-ink-brand" />
            <div>
              <div className="font-display text-base leading-[22px] font-bold">{title}</div>
              <div className="text-sm leading-5 text-ink-muted">{text}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
