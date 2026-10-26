import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/** Chip de estado (Sedin.Chip). `live` añade el punto de acento con pulso. */
export function Chip({
  tone = "operational",
  live = false,
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: "operational" | "standby"; live?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex h-[26px] items-center gap-1.5 rounded-full border px-3 py-1 font-display text-[12px] leading-4 font-semibold tracking-[0.06em] uppercase",
        tone === "operational"
          ? "border-[var(--chip-operational-line)] bg-[var(--chip-operational-bg)] text-ink-brand"
          : "border-[var(--chip-standby-line)] bg-[var(--chip-standby-bg)] text-ink-muted",
        className,
      )}
      {...props}
    >
      {live && (
        <span
          aria-hidden="true"
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            tone === "operational"
              ? "animate-[sd-pulse_1.6s_ease-out_infinite] bg-accent"
              : "bg-ink-subtle",
          )}
        />
      )}
      {children}
    </span>
  );
}
