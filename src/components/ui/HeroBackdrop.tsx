/**
 * Foto de portada a sangre (vigilante en el puente) con los velos que
 * oscurecen la izquierda y el borde superior. Va dentro de una sección
 * `relative`; el contenido posterior debe ser `relative` para quedar encima.
 *
 * Rendimiento (propuesta, 15.4): las imágenes no se optimizan en el build
 * (`images.unoptimized`), así que aquí van las variantes WebP generadas con
 * sharp en `public/assets/portada/`:
 * - móvil en vertical (<640px): recorte vertical de 620×1008 (≈40 KB);
 * - resto: 640, 1024, 1600 y 1792 px de ancho (14–90 KB; 1792 es el ancho
 *   del original, no se amplía), elegidos por `sizes="100vw"`.
 * El JPG original (483 KB) queda solo como respaldo. Es la imagen LCP:
 * carga inmediata con `fetchPriority="high"`.
 */
const base = "/assets/portada";
const widths = [640, 1024, 1600, 1792] as const;
const srcSet = widths.map((w) => `${base}/hero-${w}.webp ${w}w`).join(", ");

export function HeroBackdrop() {
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
          className="absolute inset-0 h-full w-full object-cover object-[78%_center] max-sm:portrait:object-center min-[901px]:object-[70%_center]"
        />
      </picture>
      <div aria-hidden="true" className="hero-scrim absolute inset-0" />
    </>
  );
}
