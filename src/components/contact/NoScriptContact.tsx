import { CallLink, MailLink, WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { site, waMessages } from "@/config/site";

/**
 * Sin JavaScript, el diagnóstico (y el formulario breve) se pintan pero no
 * avanzan: «Continuar» enviaría un GET que recarga en el paso 1. Este aviso
 * los oculta (todo lo marcado con `data-wizard`) y ofrece en su lugar los
 * canales que sí funcionan: WhatsApp con el mensaje general, llamada y
 * correo. Con JavaScript no se pinta nada.
 */
export function NoScriptContact({ ubicacion }: { ubicacion: string }) {
  return (
    <noscript>
      <style>{"[data-wizard]{display:none!important}"}</style>
      <div className="flex flex-col gap-5 rounded-lg border border-line-cyan bg-surface p-5 shadow-elevation-1 sm:p-8">
        <div className="flex flex-col gap-2">
          <p className="m-0 font-display text-xl leading-7 font-bold tracking-[-0.01em] text-ink sm:text-2xl sm:leading-8">
            Cuéntenos qué necesita proteger
          </p>
          <p className="m-0 text-[15px] leading-[22px] text-ink-muted">
            El diagnóstico necesita JavaScript, que está desactivado en su navegador. Escríbanos o llámenos y un
            asesor le orienta; atención {site.hours}.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <WhatsAppLink message={waMessages.general} ubicacion={ubicacion} size="lg" block />
          <CallLink ubicacion={ubicacion} variant="secondary" size="lg" block />
          <MailLink
            subject="Solicitud de cotización desde sedinca.com"
            ubicacion={ubicacion}
            size="lg"
            block
          >
            Escribir un correo
          </MailLink>
        </div>
      </div>
    </noscript>
  );
}
