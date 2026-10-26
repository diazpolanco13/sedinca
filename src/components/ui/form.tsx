import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

/*
 * Controles del sistema de diseño (Sedin.Input, Checkbox, Radio, Button),
 * reimplementados con las mismas medidas y estados que bundle.css.
 */

const fieldBase =
  "w-full rounded-(--radius) border border-line-strong bg-surface font-sans text-base text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink-subtle focus:border-brand focus:shadow-[0_0_0_3px_var(--focus-halo)] aria-invalid:border-ink-danger";

export function Input({
  className,
  type = "text",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input type={type} className={cn(fieldBase, "h-11 px-4 leading-6", className)} {...props} />
  );
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(fieldBase, "h-11 px-4", className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea className={cn(fieldBase, "resize-y px-4 py-3 leading-6", className)} {...props} />
  );
}

type ChoiceProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { label: ReactNode };

const choiceLabel =
  "relative inline-flex cursor-pointer items-center gap-2 font-sans text-base leading-6 text-ink";
const hiddenInput = "peer absolute m-0 h-[18px] w-[18px] opacity-0";
const choiceFocus =
  "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus-ring";

export function Checkbox({ label, className, ...props }: ChoiceProps) {
  return (
    <label className={cn(choiceLabel, className)}>
      <input type="checkbox" className={hiddenInput} {...props} />
      <span
        aria-hidden="true"
        className={cn(
          "inline-grid h-[18px] w-[18px] flex-none place-items-center rounded-sm border-[1.5px] border-line-strong bg-surface",
          "peer-checked:border-brand peer-checked:bg-brand",
          "peer-checked:after:h-[9px] peer-checked:after:w-[5px] peer-checked:after:translate-y-[-1px] peer-checked:after:rotate-45 peer-checked:after:border-r-2 peer-checked:after:border-b-2 peer-checked:after:border-on-brand peer-checked:after:content-['']",
          "peer-aria-invalid:border-ink-danger",
          choiceFocus,
        )}
      />
      <span>{label}</span>
    </label>
  );
}

export function Radio({ label, className, ...props }: ChoiceProps) {
  return (
    <label className={cn(choiceLabel, className)}>
      <input type="radio" className={hiddenInput} {...props} />
      <span
        aria-hidden="true"
        className={cn(
          "inline-grid h-[18px] w-[18px] flex-none place-items-center rounded-full border-[1.5px] border-line-strong bg-surface",
          "peer-checked:border-brand peer-checked:after:h-2 peer-checked:after:w-2 peer-checked:after:rounded-full peer-checked:after:bg-accent peer-checked:after:content-['']",
          choiceFocus,
        )}
      />
      <span>{label}</span>
    </label>
  );
}

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" }) {
  return (
    <button
      type={type}
      className={cn(
        "h-11 cursor-pointer rounded-(--radius) border-0 px-6 font-display text-sm leading-5 font-semibold tracking-[0.04em] transition-[filter,box-shadow,background-color,border-color,transform] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45",
        variant === "primary" &&
          "bg-[image:var(--gradient-action)] font-bold text-on-brand shadow-inset-highlight hover:brightness-[1.08] hover:shadow-[var(--inset-highlight),var(--glow-cyan)]",
        variant === "secondary" &&
          "border-[1.5px] border-line bg-surface text-ink hover:border-brand hover:bg-surface-brand",
        variant === "ghost" && "bg-transparent text-ink-brand hover:bg-[var(--ghost-hover)]",
        className,
      )}
      {...props}
    />
  );
}

/** Mensaje de error bajo un campo (body-sm, ink-danger). */
export function FieldError({ id, children }: { id: string; children?: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} className="m-0 text-sm leading-5 text-ink-danger">
      {children}
    </p>
  );
}
