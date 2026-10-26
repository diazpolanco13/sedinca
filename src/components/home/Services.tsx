import { GuardIcon, IdCardIcon, MonitorIcon, TargetIcon } from "@/components/icons";
import { Card } from "@/components/ui/Card";
import { ArrowLink, Eyebrow, SectionTitle } from "@/components/ui/SectionHeading";
import { routes, services } from "@/config/site";

const items = [
  {
    Icon: GuardIcon,
    title: "Vigilancia privada",
    text: "Oficiales de seguridad en modalidad fija y móvil, con presencia disuasiva y atención inmediata ante cualquier novedad.",
    href: services.vigilancia.href,
  },
  {
    Icon: IdCardIcon,
    title: "Control de acceso y salida",
    text: "Inspección y registro de personal en cada ingreso y salida. Cada ingreso controlado es un riesgo menos para tu empresa.",
    href: services.acceso.href,
  },
  {
    Icon: MonitorIcon,
    title: "Sistemas de seguridad electrónica",
    text: "Cámaras de alta definición, vigilancia remota 24/7, cercado eléctrico y concertinas para tu perímetro.",
    href: services.electronicos.href,
  },
  {
    Icon: TargetIcon,
    title: "Gestión de riesgos y consultoría",
    text: "Prevención, análisis y respuesta efectiva. Asesoría para diseñar el esquema de seguridad que tu operación necesita.",
    href: services.riesgos.href,
  },
];

/** 03 · Servicios. */
export function Services() {
  return (
    <section id="servicios" aria-labelledby="servicios-titulo">
      <div className="mx-auto flex max-w-[1344px] flex-col gap-10 px-4 pt-16 pb-14 sm:px-8 lg:pt-24 lg:pb-[72px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex max-w-[640px] flex-col gap-3">
            <Eyebrow>Servicios</Eyebrow>
            <SectionTitle>
              <span id="servicios-titulo">
                Una sola empresa para proteger personas, accesos y perímetros
              </span>
            </SectionTitle>
          </div>
          <ArrowLink href={routes.services} className="py-3 text-[15px]">
            Todos los servicios
          </ArrowLink>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
          {items.map(({ Icon, title, text, href }) => (
            <Card key={title} accent>
              <div className="flex h-full flex-col gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-surface-brand text-ink-brand">
                  <Icon size={26} />
                </div>
                <h3 className="m-0 font-display text-xl leading-7 font-semibold">{title}</h3>
                <p className="m-0 text-[15px] leading-[22px] text-ink-muted">{text}</p>
                <ArrowLink href={href} className="mt-auto py-2 text-sm">
                  Ver servicio
                </ArrowLink>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
