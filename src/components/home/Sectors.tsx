import Image from "next/image";
import { Eyebrow, SectionTitle } from "@/components/ui/SectionHeading";
import { sectorsContent } from "@/content/sectors";

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
          {sectorsContent.map(({ id, Icon, photo, title, text }) => (
            <div
              key={id}
              className="flex flex-col gap-3 rounded-lg border border-line-card bg-surface p-6"
            >
              <div className="relative h-40 overflow-hidden rounded-md">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 1280px) 256px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
                <span className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-md bg-surface-brand text-ink-brand">
                  <Icon size={22} />
                </span>
              </div>
              <h3 className="m-0 font-display text-xl leading-7 font-semibold">{title}</h3>
              <p className="m-0 text-[15px] leading-[22px] text-ink-muted">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
