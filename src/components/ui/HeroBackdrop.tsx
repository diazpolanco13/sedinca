import Image from "next/image";

/**
 * Foto de portada a sangre (vigilante en el puente) con los velos que
 * oscurecen la izquierda y el borde superior. Va dentro de una sección
 * `relative`; el contenido posterior debe ser `relative` para quedar encima.
 */
export function HeroBackdrop() {
  return (
    <>
      <Image
        src="/assets/hero-puente-vigilante.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[78%_center] min-[901px]:object-[70%_center]"
      />
      <div aria-hidden="true" className="hero-scrim absolute inset-0" />
    </>
  );
}
