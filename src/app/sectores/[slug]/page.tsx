import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectorTemplate } from "@/components/sector/SectorTemplate";
import { absoluteUrl, sectorHref, sectorSlugs } from "@/config/site";
import { getSector } from "@/content/sectors";
import { publishedText } from "@/lib/pending";

type Params = { slug: string };

/** Solo los 4 sectores; cualquier otra ruta da 404 en la exportación estática. */
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return sectorSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const sector = getSector(slug);
  if (!sector) return {};
  return {
    // Títulos de la propuesta (15.3), sin marcadores.
    title: publishedText(sector.meta.title),
    description: publishedText(sector.meta.description),
    alternates: { canonical: absoluteUrl(sectorHref(sector.id)) },
  };
}

export default async function SectorPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const sector = getSector(slug);
  if (!sector) notFound();
  return <SectorTemplate sector={sector} />;
}
