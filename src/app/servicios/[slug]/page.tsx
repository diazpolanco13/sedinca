import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SitePage } from "@/components/layout/SitePage";
import { ServiceTemplate } from "@/components/service/ServiceTemplate";
import { getService, servicesContent } from "@/content/services";

export const dynamicParams = false;

export function generateStaticParams() {
  return servicesContent.map((s) => ({ slug: s.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getService((await params).slug);
  if (!service) return {};
  return {
    title: service.name,
    description: service.metaDescription,
  };
}

export default async function ServicePage({ params }: Props) {
  const service = getService((await params).slug);
  if (!service) notFound();
  return (
    <SitePage>
      <ServiceTemplate service={service} />
    </SitePage>
  );
}
