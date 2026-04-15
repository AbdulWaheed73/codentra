import { Hero } from "@/components/sections/hero";
import { ServicesTeaser } from "@/components/sections/services-teaser";
import { ScrollJourney } from "@/components/sections/scroll-journey";
import { TechMarquee } from "@/components/tech-marquee";
import { Process } from "@/components/sections/process";
import { Compliance } from "@/components/sections/compliance";
import { CTA } from "@/components/sections/cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TechMarquee />
      <ScrollJourney />
      <ServicesTeaser />
      <Process />
      <Compliance />
      <CTA />
    </>
  );
}
