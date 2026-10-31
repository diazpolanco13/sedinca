import { ActionLink } from "@/components/ui/ActionLink";
import { FactStrip } from "@/components/ui/FactStrip";
import { HeroBackdrop } from "@/components/ui/HeroBackdrop";
import { Container } from "@/components/ui/Section";
import { CallLink } from "@/components/ui/WhatsAppLink";
import { audienceActions, ctaLabels } from "@/config/site";
import { heroFacts } from "@/content/facts";
import { cn } from "@/lib/cn";
import { heroCopy, heroFactsMobile } from "./homeContent";

const UBICACION = "portada";

/**
 * 01 · Portada de cine (propuesta, 7.1): la foto del puente a sangre, el
 * titular de siempre, la promesa «Vigilancia que se ve y se reporta.», los
 * botones de Inicio (11.3) y la franja de hechos sobre una placa de vidrio.
 *
 * Móvil: compacta, sin la primera frase del subtítulo, los dos botones a lo
 * ancho (WhatsApp y «Diagnóstico y cotización», con 44px o más para el
 * toque); la franja pasa a dos filas con los hechos cortos.
 *
 * El bloque de botones lleva `data-hero-actions`: la barra de móvil y el
 * botón flotante de WhatsApp aparecen cuando sale de pantalla.
 *
 * El encabezado (SiteHeader) se superpone arriba: de ahí el margen superior.
 * Sin animaciones: la portada se ve completa desde el primer pintado.
 */
export function Hero() {
  const [whatsapp, diagnostico, empresa] = audienceActions("general", { ubicacion: UBICACION });
  const [leadIntro, leadRecord] = heroCopy.lead;
  const [firstEyebrow, ...otherEyebrows] = heroCopy.eyebrow;

  return (
    <section
      id="inicio"
      aria-labelledby="portada-titulo"
      className="relative isolate flex flex-col overflow-hidden bg-azure-950 text-white sm:min-h-[680px] lg:min-h-[min(100svh,980px)]"
    >
      <HeroBackdrop />

      {/* Luz de cine: base oscura para la franja y destello cian a la izquierda. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-linear-to-t from-azure-950 via-azure-950/60 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_8%_88%,color-mix(in_oklab,var(--cyan-400)_20%,transparent)_0%,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="dot-grid pointer-events-none absolute inset-y-0 left-0 hidden w-[42%] opacity-40 [mask-image:radial-gradient(70%_60%_at_0%_100%,black,transparent_75%)] lg:block"
      />

      <Container className="on-dark relative flex flex-1 flex-col pt-[88px] sm:pt-32 lg:pt-[148px]">
        <div className="flex max-w-[860px] flex-1 flex-col justify-center gap-4 pt-4 pb-6 sm:gap-6 sm:pt-8 sm:pb-12 lg:pt-6 lg:pb-14">
          <p className="m-0 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 font-display text-[11px] leading-4 font-semibold tracking-[0.14em] text-white/80 uppercase sm:text-[13px] sm:leading-5">
            <span className="inline-flex items-center gap-3 max-sm:w-full">
              <span
                aria-hidden="true"
                className="h-0.5 w-8 flex-none rounded-full bg-[image:var(--gradient-accent-line)] sm:w-10"
              />
              {firstEyebrow}
            </span>
            {otherEyebrows.map((part, i) => (
              <span key={part} className="inline-flex items-center gap-2.5">
                {/* En móvil, la segunda parte abre la segunda línea: sin punto delante. */}
                <span aria-hidden="true" className={cn("text-cyan-300", i === 0 && "max-sm:hidden")}>
                  ·
                </span>
                {part}
              </span>
            ))}
          </p>

          <h1
            id="portada-titulo"
            className="m-0 font-display text-[length:clamp(40px,min(6vw,9.6svh),92px)] leading-[1.02] font-bold tracking-[-0.025em] text-balance text-white [text-shadow:0_2px_24px_rgba(4,13,31,0.35)]"
          >
            {heroCopy.title.text}{" "}
            <span className="text-azure-300 [text-shadow:0_2px_16px_rgba(4,13,31,0.55)]">
              {heroCopy.title.highlight}
            </span>
          </h1>

          <p className="m-0 flex items-center gap-3 font-display text-[19px] leading-6 font-semibold tracking-[-0.01em] text-white sm:gap-4 sm:text-[clamp(22px,2.2vw,30px)] sm:leading-tight">
            <span
              aria-hidden="true"
              className="h-6 w-0.5 flex-none rounded-full bg-accent shadow-glow-cyan sm:h-8"
            />
            {heroCopy.promise}
          </p>

          <p className="m-0 max-w-[620px] font-sans text-[15px] leading-[22px] font-light text-white/88 max-sm:[@media(max-height:700px)]:hidden sm:text-xl sm:leading-8 lg:max-w-[680px]">
            <span className="hidden sm:inline">{leadIntro} </span>
            {leadRecord}
          </p>

          <div data-hero-actions="" className="flex flex-col gap-4 pt-3 sm:gap-5 sm:pt-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:gap-4">
              <ActionLink action={whatsapp} variant="primary" size="xl" block className="max-sm:px-5 max-sm:text-[17px]" />
              {/* Móvil: botón secundario a lo ancho (56px); desde 640px, el de portada (60px). */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-full sm:hidden">
                  <ActionLink action={diagnostico} variant="onPhoto" size="lg" block />
                </div>
                <div className="hidden sm:contents">
                  <ActionLink action={diagnostico} variant="onPhoto" size="xl" />
                </div>
                <span className="text-[13px] leading-[18px] text-white/75">{ctaLabels.diagnosticoNote}</span>
              </div>
            </div>

            <div className="hidden flex-wrap items-center gap-x-6 gap-y-2 text-[15px] leading-6 sm:flex">
              <span className="[&_a]:text-cyan-200">
                <ActionLink action={empresa} variant="inline" />
              </span>
              <CallLink ubicacion={UBICACION} variant="onPhoto" size="sm" />
            </div>
          </div>
        </div>
      </Container>

      {/* Franja de hechos (sustituye a «Pilares» y a los 5 chips de servicios). */}
      <div className="on-dark relative border-t border-white/12 bg-scrim/50 backdrop-blur-[6px]">
        <Container className="py-3.5 sm:py-5">
          <div className="sm:hidden">
            <FactStrip
              items={heroFactsMobile}
              tone="photo"
              className="max-sm:grid max-sm:grid-cols-2 max-sm:gap-x-3 max-sm:gap-y-2 max-sm:text-[11px] max-sm:tracking-[0.05em]"
            />
          </div>
          <div className="hidden sm:block">
            <FactStrip
              items={heroFacts}
              tone="photo"
              className="lg:grid lg:grid-cols-[repeat(3,auto)] lg:justify-between lg:gap-x-10"
            />
          </div>
        </Container>
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px bg-[image:var(--gradient-accent-line)] opacity-80"
        />
      </div>
    </section>
  );
}
