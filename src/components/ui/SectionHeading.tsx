import Link from "next/link";
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

/** Enlace de texto con flecha («Ver servicio →»). */
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
      className={cn(
        "font-display font-semibold text-ink-brand no-underline transition-colors hover:text-brand-deep",
        className,
      )}
    >
      {children} →
    </Link>
  );
}
