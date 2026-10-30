import { CheckIcon } from "@/components/icons";
import { Pend, PendingBlock } from "@/components/ui/Pending";
import { Reveal } from "@/components/ui/Reveal";
import { Accent, Section, SectionHeader } from "@/components/ui/Section";
import { anyPending, filterPending } from "@/lib/pending";
import { commitments, commitmentsCopy } from "./homeContent";

/**
 * 06 · «Nuestro compromiso con usted» (propuesta, 7.5).
 *
 * Los compromisos son condicionales: solo se publican los que SEDIN acepte
 * poner en contrato. Mientras todos sean [MARCADORES], en producción la
 * sección no se pinta (Inicio queda más corto) y en revisión se ven
 * resaltados dentro de un bloque «Pendiente de confirmar». La guía gratuita
 * «8 preguntas…» vive ahora junto a las preguntas frecuentes (HomeFaq).
 *
 * Fondo claro: va entre «Clientes» (gris) y las preguntas (tinte de marca).
 */
export function Commitments() {
  const visible = filterPending(commitments, (c) => c.text);
  const confirmed = commitments.filter((c) => !anyPending(c.text));
  if (visible.length === 0) return null;

  return (
    <Section
      tone="light"
      space="none"
      id="compromiso"
      labelledBy="compromiso-titulo"
      className="py-14 sm:py-20 lg:py-28"
    >
      <div className="flex flex-col gap-10">
        <Reveal as="header">
          <SectionHeader
            id="compromiso-titulo"
            eyebrow={commitmentsCopy.eyebrow}
            title={
              <>
                {commitmentsCopy.title.text} <Accent>{commitmentsCopy.title.highlight}</Accent>
              </>
            }
            lead={commitmentsCopy.lead}
          />
        </Reveal>
        <PendingBlock label="Compromisos" needs={commitmentsCopy.needs} pending={confirmed.length === 0}>
          <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-5">
            {visible.map((item) => (
              <Reveal
                as="li"
                key={item.id}
                className="flex flex-col gap-3 rounded-lg border border-line-card bg-surface p-5 shadow-elevation-1"
              >
                <span className="inline-flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent-subtle text-ink-brand">
                    <CheckIcon size={16} />
                  </span>
                  <span className="eyebrow text-ink-muted">{item.label}</span>
                </span>
                <Pend as="p" className="m-0 font-display text-[17px] leading-6 font-semibold text-ink" text={item.text} />
              </Reveal>
            ))}
          </ul>
        </PendingBlock>
        <Pend as="p" className="m-0 text-base leading-[26px] text-ink-muted" text={commitmentsCopy.references} />
      </div>
    </Section>
  );
}
