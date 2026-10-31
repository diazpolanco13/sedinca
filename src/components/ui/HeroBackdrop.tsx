import { HeroVideo, HeroVideoToggle } from "@/components/ui/HeroVideo";

/**
 * Foto de portada a sangre (vigilante en el puente), su animación encima
 * (`HeroVideo`: entra con un fundido cuando puede reproducirse) y los velos
 * que oscurecen la izquierda y el borde superior. Va dentro de una sección
 * `relative`; el contenido posterior debe ser `relative` para quedar encima.
 *
 * El botón de pausa va abajo a la derecha (en móvil, arriba). Si la portada
 * tiene algo pegado abajo (la franja de hechos de Inicio), pase
 * `toggle={false}` y ponga `<HeroVideoToggle />` donde corresponda.
 *
 * Rendimiento (propuesta, 15.4): las imágenes no se optimizan en el build
 * (`images.unoptimized`), así que aquí van las variantes WebP generadas con
 * sharp en `public/assets/portada/`:
 * - móvil en vertical (<640px): recorte vertical de 620×1008 (≈40 KB);
 * - resto: 640, 1024, 1600 y 1792 px de ancho (14–90 KB; 1792 es el ancho
 *   del original, no se amplía), elegidos por `sizes="100vw"`.
 * El JPG original (483 KB) queda solo como respaldo. Es la imagen LCP:
 * carga inmediata con `fetchPriority="high"`, y el póster del vídeo.
 */
const base = "/assets/portada";
const widths = [640, 1024, 1600, 1792] as const;
const srcSet = widths.map((w) => `${base}/hero-${w}.webp ${w}w`).join(", ");

/**
 * Sitio del botón de pausa. En móvil, arriba a la derecha bajo el encabezado
 * (abajo chocaría con los botones a lo ancho); desde 640px, abajo a la derecha.
 */
export const togglePlace = "top-[66px] right-4 max-sm:size-9 sm:top-auto";

/** Encuadre de la foto y del vídeo (el vigilante, a la derecha). */
const framing = "object-[78%_center] max-sm:portrait:object-center min-[901px]:object-[70%_center]";

export function HeroBackdrop({ toggle = true }: { toggle?: boolean }) {
  return (
    <>
      <picture>
        <source media="(max-width: 639px) and (orientation: portrait)" type="image/webp" srcSet={`${base}/hero-movil.webp`} />
        <source type="image/webp" srcSet={srcSet} sizes="100vw" />
        <img
          src="/assets/hero-puente-vigilante.jpg"
          alt=""
          width={1792}
          height={1008}
          fetchPriority="high"
          className={`absolute inset-0 h-full w-full object-cover ${framing}`}
        />
      </picture>
      <HeroVideo className={framing} />
      <div aria-hidden="true" className="hero-scrim absolute inset-0" />
      {toggle && <HeroVideoToggle className={`${togglePlace} sm:right-6 sm:bottom-6`} />}
    </>
  );
}
