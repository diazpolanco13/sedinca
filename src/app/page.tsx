import type { Metadata } from "next";
import { CallToAction } from "@/components/home/CallToAction";
import { ControlCenter } from "@/components/home/ControlCenter";
import { Hero } from "@/components/home/Hero";
import { Pillars } from "@/components/home/Pillars";
import { Sectors } from "@/components/home/Sectors";
import { Services } from "@/components/home/Services";
import { Staff } from "@/components/home/Staff";
import { Values } from "@/components/home/Values";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export const metadata: Metadata = {
  title: { absolute: "Inicio — SEDIN" },
};

export default function HomePage() {
  return (
    <div className="relative">
      <SiteHeader />
      <main>
        <Hero />
        <Pillars />
        <Services />
        <Sectors />
        <ControlCenter />
        <Staff />
        <Values />
        <CallToAction />
      </main>
      <SiteFooter />
    </div>
  );
}
