import Image from "next/image";
import Link from "next/link";
import type { ComponentType } from "react";
import { ArrowRightIcon } from "@/components/icons";
import { umami } from "@/lib/analytics";
import { cn } from "@/lib/cn";

type IconType = ComponentType<{ size?: number; className?: string }>;

const aspects = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[16/10]",
  square: "aspect-square",
  wide: "aspect-[21/9]",
} as const;

/**
 * Tarjeta fotográfica grande y enlazada entera: foto a sangre con degradado
 * azul noche, título dentro, zoom suave y borde cian al pasar el cursor o con
 * el foco. Carga diferida por defecto.
 *
 * Las fotos de sectores son de IA: úselas como ambientación (nunca como
 * «nuestro equipo»). La foto es decorativa (alt vacío): el nombre del enlace
 * lo da el título.
 */
export function PhotoCard({
  href,
  title,
  eyebrow,
  text,
  cta = "Ver más",
  photo,
  Icon,
  aspect = "portrait",
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
  headingLevel = "h3",
  event,
  ubicacion,
  scrimClassName = "bg-linear-to-t from-azure-950/95 via-azure-950/45 to-azure-950/5",
  alignRow = aspect === "square",
  className,
}: {
  href: string;
  title: string;
  eyebrow?: string;
  text?: string;
  /** Texto del pie con flecha («Ver sector»). */
  cta?: string;
  photo: { src: string; position?: string };
  Icon?: IconType;
  aspect?: keyof typeof aspects;
  /** Ancho real de la tarjeta en cada punto de corte. */
  sizes?: string;
  /** Solo si la tarjeta está en la primera pantalla. */
  priority?: boolean;
  headingLevel?: "h2" | "h3" | "h4";
  /** Evento de Umami opcional. */
  event?: string;
  ubicacion?: string;
  /**
   * Degradado bajo el texto (sustituye al de serie). En tarjetas estrechas,
   * donde el título ocupa 3 líneas y sube a la zona clara de la foto, use uno
   * más alto y denso.
   */
  scrimClassName?: string;
  /**
   * Desde 1024px, reserva 2 líneas al título (alineado abajo) y 3 al texto,
   * para que icono, título, texto y enlace de una misma fila caigan a la
   * misma altura aunque un título o un texto ocupe más líneas. Por defecto,
   * en las cuadradas (rejillas de 3–4 con textos de largo distinto: «Así lo
   * aplicamos», «Sectores que atendemos»). Sin recortar: un texto más largo
   * se ve entero y solo esa tarjeta sube.
   */
  alignRow?: boolean;
  className?: string;
}) {
  const Heading = headingLevel;
  return (
    <Link
      href={href}
      prefetch={false}
      {...(event ? umami(event, { ubicacion }) : {})}
      className={cn(
        "group relative isolate flex overflow-hidden rounded-xl bg-azure-950 text-white no-underline shadow-elevation-1 outline-offset-4 transition-shadow duration-300 hover:text-white hover:shadow-elevation-2",
        aspects[aspect],
        className,
      )}
    >
      <Image
        src={photo.src}
        alt=""
        fill
        sizes={sizes}
        priority={priority}
        className={cn(
          "-z-10 object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100",
          photo.position,
        )}
      />
      <span aria-hidden="true" className={cn("absolute inset-0 -z-10", scrimClassName)} />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/10 transition-shadow duration-300 ring-inset group-hover:ring-2 group-hover:ring-cyan-400 group-focus-visible:ring-2 group-focus-visible:ring-cyan-400"
      />
      <span className="mt-auto flex w-full flex-col gap-2 p-5 sm:p-6">
        {Icon && (
          <span className="mb-1 inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/15 bg-white/10 text-cyan-200">
            <Icon size={22} />
          </span>
        )}
        {eyebrow && <span className="eyebrow text-cyan-200">{eyebrow}</span>}
        <Heading
          className={cn(
            "m-0 font-display text-[22px] leading-7 font-bold tracking-[-0.01em] text-white sm:text-2xl sm:leading-8",
            alignRow && "lg:flex lg:min-h-16 lg:items-end",
          )}
        >
          {title}
        </Heading>
        {text && (
          <span className={cn("text-[15px] leading-[22px] text-white/85", alignRow && "lg:min-h-[66px]")}>{text}</span>
        )}
        <span className="mt-1 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-cyan-200">
          {cta}
          <ArrowRightIcon
            size={16}
            className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
          />
        </span>
      </span>
    </Link>
  );
}
