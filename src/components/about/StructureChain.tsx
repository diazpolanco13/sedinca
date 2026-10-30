import Link from "next/link";
import {
  ArrowRightIcon,
  BookIcon,
  BriefcaseIcon,
  ClipboardCheckIcon,
  EyeIcon,
  GuardIcon,
  MapPinIcon,
  RadioIcon,
} from "@/components/icons";
import { Pend, PendingPhoto, SourceNote } from "@/components/ui/Pending";
import { Reveal } from "@/components/ui/Reveal";
import { Accent, Section, SectionHeader } from "@/components/ui/Section";
import { structure, type RoleId } from "./aboutContent";

const roleIcons: Record<RoleId, typeof GuardIcon> = {
  "gerencia-general": BriefcaseIcon,
  "calidad-sso": ClipboardCheckIcon,
  "jefatura-operaciones": RadioIcon,
  supervision: EyeIcon,
  "jefes-de-grupo": BookIcon,
  oficiales: GuardIcon,
};

/**
 * 3 · Estructura por cargos, sin nombres (8.6): una «cadena de
 * responsabilidad» vertical, de la Gerencia General al puesto del cliente,
 * en tres tramos (Dirección · Operaciones · En su instalación). No se
 * presenta como organigrama vigente: en revisión se ve la nota para que
 * SEDIN lo valide, y el hueco de la foto real del equipo de supervisión.
 */
export function StructureChain() {
  return (
    <Section tone="sunken" id="estructura" labelledBy="estructura-titulo">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="flex flex-col gap-6 lg:sticky lg:top-28">
            <SectionHeader
              id="estructura-titulo"
              eyebrow={structure.eyebrow}
              title={
                <>
                  {structure.title.text} <Accent>{structure.title.highlight}</Accent>
                </>
              }
              lead={structure.lead}
            />
            <Pend as="p" className="m-0 text-sm leading-5 text-ink-muted" text={structure.review} />
            <SourceNote source={structure.source} />
            <Link
              href={structure.link.href}
              prefetch={false}
              className="group inline-flex items-center gap-1.5 self-start font-display text-base font-semibold text-ink-brand no-underline hover:underline"
            >
              {structure.link.label}
              <ArrowRightIcon
                size={18}
                className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
              />
            </Link>
            <PendingPhoto label={structure.photo} className="mt-2 aspect-[4/3]" />
          </div>
        </div>

        <div className="relative lg:col-span-7">
          {/* Raíl de la cadena (decorativo): pasa por el centro de cada nodo. */}
          <div
            aria-hidden="true"
            className="absolute top-14 bottom-6 left-[23px] w-0.5 rounded-full bg-linear-to-b from-cyan-400 to-azure-600"
          />
          <ol aria-label="Estructura por cargos" className="relative m-0 flex list-none flex-col gap-10 p-0">
            {structure.groups.map((group) => (
              <li key={group.id} className="flex flex-col gap-4">
                <h3 className="eyebrow m-0 pl-16 text-ink-brand">{group.label}</h3>
                <ol className="m-0 flex list-none flex-col gap-4 p-0">
                  {group.roles.map((role) => {
                    const Icon = roleIcons[role.id];
                    return (
                      <Reveal as="li" key={role.id} className="flex items-start gap-4">
                        <span
                          aria-hidden="true"
                          className="relative grid h-12 w-12 flex-none place-items-center rounded-full border-2 border-accent bg-surface text-ink-brand shadow-glow-cyan"
                        >
                          <Icon size={22} />
                        </span>
                        <div className="flex min-w-0 flex-1 flex-col gap-2 rounded-lg border border-line-card bg-surface p-5 shadow-elevation-1 sm:p-6">
                          <h4 className="m-0 font-display text-lg leading-6 font-bold tracking-[-0.01em] text-ink sm:text-xl sm:leading-7">
                            {role.title}
                          </h4>
                          <p className="m-0 text-[15px] leading-6 text-ink-muted">{role.text}</p>
                          <SourceNote source={role.source} />
                        </div>
                      </Reveal>
                    );
                  })}
                </ol>
              </li>
            ))}
          </ol>

          {/* Final de la cadena: la instalación del cliente. */}
          <div className="relative mt-6 flex items-center gap-4">
            <span
              aria-hidden="true"
              className="grid h-12 w-12 flex-none place-items-center rounded-full bg-[image:var(--gradient-action)] text-on-brand shadow-cta"
            >
              <MapPinIcon size={22} />
            </span>
            <p className="m-0 flex flex-col">
              <span className="font-display text-lg leading-6 font-bold text-ink">{structure.endpoint.label}</span>
              <span className="text-[15px] leading-[22px] text-ink-muted">{structure.endpoint.text}</span>
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
