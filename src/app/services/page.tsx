import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { ServicesGrid } from "@/components/services-grid";
import { Compliance } from "@/components/sections/compliance";
import { CTA } from "@/components/sections/cta";
import { TechMarquee } from "@/components/tech-marquee";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Web, mobile, backend, commerce, cloud and compliance — a full-stack engineering partner.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title={
          <>
            Everything you need to{" "}
            <span className="text-gradient">build and scale.</span>
          </>
        }
        description="From Next.js sites to native iOS & Android apps, from NestJS backends to AWS infrastructure — engineered to last."
      />

      <section className="py-16" id="services">
        <Container>
          <ServicesGrid anchors />
        </Container>
      </section>

      <TechMarquee />
      <Compliance />
      <CTA />
    </>
  );
}
