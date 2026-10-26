import Link from "next/link";
import { ArrowLink, SectionTitle } from "@/components/ui/SectionHeading";
import { routes, whatsappHref } from "@/config/site";

/** 08 · Cotización + Trabaja con nosotros. */
export function CallToAction() {
  const wa = whatsappHref();
  const waExternal = wa.startsWith("http");
  return (
    <section id="empleo" aria-label="Cotización y empleo">
      <div className="mx-auto flex max-w-[1344px] flex-wrap gap-6 px-4 py-16 sm:px-8 lg:py-24">
        <div className="on-dark flex min-w-0 flex-[2_1_656px] flex-col gap-5 rounded-xl bg-[image:var(--gradient-action)] p-8 text-white sm:p-12">
          <SectionTitle>
            Seguridad que impulsa tu operación.
            <br />
            <span className="text-cyan-100">Confianza que te respalda.</span>
          </SectionTitle>
          <p className="m-0 max-w-[520px] text-[17px] leading-[26px]">
            Cuéntanos qué necesitas proteger y te enviamos una propuesta a la medida.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={routes.contact}
              className="inline-flex h-12 items-center rounded-(--radius) bg-white px-7 font-display text-[15px] font-bold tracking-[0.04em] text-azure-900 no-underline transition-[box-shadow,transform] hover:text-azure-900 hover:shadow-glow-cyan active:scale-[0.98]"
            >
              Solicitar cotización
            </Link>
            <a
              href={wa}
              {...(waExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="inline-flex h-[51px] items-center rounded-(--radius) border-[1.5px] border-white/60 px-7 font-display text-[15px] font-semibold tracking-[0.04em] text-white no-underline transition-colors hover:border-white hover:bg-white/10 hover:text-white active:scale-[0.98]"
            >
              Escribir por WhatsApp
            </a>
          </div>
        </div>
        <div className="flex min-w-0 flex-[1_1_400px] flex-col gap-4 rounded-xl border border-line-card bg-surface p-8 sm:p-10">
          <span className="eyebrow text-ink-brand">Trabaja con nosotros</span>
          <h3 className="m-0 font-display text-2xl leading-8 font-semibold">
            Únete al equipo de oficiales de seguridad
          </h3>
          <p className="m-0 text-[15px] leading-[22px] text-ink-muted">
            Formación, disciplina y crecimiento profesional. Conoce las vacantes y postula en línea.
          </p>
          <ArrowLink href={routes.jobs} className="mt-auto py-2 text-[15px]">
            Ver vacantes
          </ArrowLink>
        </div>
      </div>
    </section>
  );
}
