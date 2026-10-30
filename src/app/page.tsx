import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { ClientProof } from "@/components/home/ClientProof";
import { Commitments } from "@/components/home/Commitments";
import { Hero } from "@/components/home/Hero";
import { HomeFaq } from "@/components/home/HomeFaq";
import { closingCopy } from "@/components/home/homeContent";
import { ProtectSelector } from "@/components/home/ProtectSelector";
import { ReportBlock } from "@/components/home/ReportBlock";
import { WhoProtects } from "@/components/home/WhoProtects";
import { SitePage } from "@/components/layout/SitePage";
import { CtaBand } from "@/components/ui/CtaBand";
import { absoluteUrl, audienceActions, routes } from "@/config/site";

export const metadata: Metadata = {
  title: { absolute: "Empresa de vigilancia privada en Maracaibo | SEDIN, C.A." },
  description:
    "Vigilancia privada no armada, control de acceso, cámaras con visión nocturna y cercado eléctrico en Maracaibo y el Zulia. Escríbanos por WhatsApp.",
  alternates: { canonical: absoluteUrl(routes.home) },
};

/** Cierre (7.7): WhatsApp · Diagnóstico y cotización · «¿Compra para una empresa? Solicite una propuesta…». */
const closingActions = audienceActions("general", { ubicacion: "cierre" });

/**
 * Inicio (propuesta, sección 7 y «Ajuste de la Dirección»). Ritmo de
 * fondos: portada (foto) → claro → OSCURO → claro → [gris: clientes, solo
 * con testimonios o casos] → [claro: compromisos, solo los confirmados] →
 * tinte de marca (preguntas y guía) → OSCURO (cierre).
 */
export default function HomePage() {
  return (
    <SitePage>
      <Hero />
      <ProtectSelector />
      <ReportBlock />
      <WhoProtects />
      <ClientProof />
      <Commitments />
      <HomeFaq />
      <CtaBand
        actions={closingActions}
        ubicacion="cierre"
        footnote={
          <>
            {closingCopy.jobs.text}{" "}
            <Link
              href={closingCopy.jobs.href}
              prefetch={false}
              className="group -my-3 inline-flex items-center gap-1 py-3 font-semibold whitespace-nowrap text-cyan-200 underline underline-offset-[3px] hover:text-cyan-200"
            >
              {closingCopy.jobs.label}
              <ArrowRightIcon
                size={16}
                className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
              />
            </Link>
          </>
        }
      />
    </SitePage>
  );
}
