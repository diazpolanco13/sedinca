import type { Metadata } from "next";
import { CallToAction } from "@/components/home/CallToAction";
import { ControlCenter } from "@/components/home/ControlCenter";
import { Hero } from "@/components/home/Hero";
import { Pillars } from "@/components/home/Pillars";
import { Sectors } from "@/components/home/Sectors";
import { Services } from "@/components/home/Services";
import { Staff } from "@/components/home/Staff";
import { Values } from "@/components/home/Values";
import { SitePage } from "@/components/layout/SitePage";

export const metadata: Metadata = {
  title: { absolute: "Inicio — SEDIN" },
};

export default function HomePage() {
  return (
    <SitePage>
      <Hero />
      <Pillars />
      <Services />
      <Sectors />
      <ControlCenter />
      <Staff />
      <Values />
      <CallToAction />
    </SitePage>
  );
}
