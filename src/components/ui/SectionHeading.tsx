import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={cn("eyebrow text-ink-brand", className)}>{children}</span>;
}

export function SectionTitle({
  children,
  className,
  as: Tag = "h2",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h2" | "h3";
}) {
  return (
    <Tag
      className={cn(
        "m-0 font-display text-[clamp(28px,3vw,40px)] leading-[1.15] font-bold tracking-[-0.01em]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/**
 * Enlace de texto con flecha («Ver servicio →»), sin precarga. Área táctil
 * de 44px sin cambiar el aspecto (relleno vertical y margen negativo).
 */
export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      prefetch={false}
      className={cn(
        "group -my-3 inline-flex items-center gap-1.5 py-3 font-display font-semibold text-ink-brand no-underline transition-colors hover:underline",
        className,
      )}
    >
      {children}
      <ArrowRightIcon
        size={16}
        className="flex-none transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
      />
    </Link>
  );
}
