import { ChatIcon } from "@/components/icons";
import { whatsappHref } from "@/config/site";

/** Botón flotante de WhatsApp, presente en todas las páginas. */
export function WhatsAppButton() {
  const href = whatsappHref();
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      aria-label="Escribir por WhatsApp"
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="fixed right-4 bottom-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-elevation-2 transition-[background-color,box-shadow,transform] hover:bg-brand-hover hover:shadow-glow-cyan active:scale-[0.98] sm:right-6 sm:bottom-6"
    >
      <ChatIcon size={26} />
    </a>
  );
}
