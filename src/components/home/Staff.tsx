import {
  ClipboardCheckIcon,
  IdCardSimpleIcon,
  SearchIcon,
  ShieldIcon,
  TeamIcon,
} from "@/components/icons";
import { Eyebrow, SectionTitle } from "@/components/ui/SectionHeading";

const skills = [
  { Icon: IdCardSimpleIcon, label: "Procedimientos de acceso" },
  { Icon: SearchIcon, label: "Inspección y control" },
  { Icon: ClipboardCheckIcon, label: "Protocolos de seguridad" },
  { Icon: ShieldIcon, label: "Prevención y comunicación" },
  { Icon: TeamIcon, label: "Trato respetuoso y profesional" },
];

/** 06 · Personal capacitado. */
export function Staff() {
  return (
    <section id="nosotros" aria-labelledby="personal-titulo">
      <div className="mx-auto flex max-w-[1344px] flex-wrap items-start gap-14 px-4 py-16 sm:px-8 lg:py-24">
        <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-4">
          <Eyebrow>Nuestro personal</Eyebrow>
          <SectionTitle>
            <span id="personal-titulo">Profesionales comprometidos con tu seguridad</span>
          </SectionTitle>
          <p className="m-0 text-[17px] leading-[26px] text-ink-muted">
            Nuestro personal está altamente capacitado para garantizar el control y la seguridad en
            cada ingreso y salida de tu empresa.
          </p>
          <blockquote className="mx-0 mt-2 mb-0 rounded-lg bg-surface-brand px-6 py-5 font-display text-xl leading-7 font-semibold text-brand-deep">
            «Atentos siempre, protegiendo lo que más importa.»
          </blockquote>
        </div>
        <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-3">
          <span className="font-display text-[13px] leading-[18px] font-bold tracking-[0.06em] text-ink-muted uppercase">
            Personal capacitado en
          </span>
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3 p-0">
            {skills.map(({ Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-3 rounded-md border border-line-card bg-surface p-4"
              >
                <Icon size={22} className="flex-none text-ink-brand" />
                <span className="text-[15px] leading-[22px] font-medium">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
