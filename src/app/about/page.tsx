import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { SectionHeading } from "@/components/section-heading";
import { ValuesGrid } from "@/components/values-grid";
import { CTA } from "@/components/sections/cta";

export const metadata: Metadata = {
  title: "About",
  description:
    "Codentra is a premium software studio building web, mobile and cloud products. GDPR-first, Sweden-based.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Codentra"
        title={
          <>
            A studio built for the{" "}
            <span className="text-gradient">long-haul products.</span>
          </>
        }
        description="We&apos;re a small, senior team that prefers fewer, deeper engagements. Based in Sweden, building for the world."
      />

      <section className="py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-start">
            <div className="space-y-5 text-foreground/90">
              <p className="text-lg leading-relaxed">
                Codentra was founded on a simple idea: teams ship better when
                engineering, design and compliance sit at the same table from
                day one.
              </p>
              <p className="leading-relaxed text-muted-foreground">
                We partner with startups and established companies to build
                web, mobile and cloud products that hold up under real-world
                load. We care about performance budgets, accessible interfaces,
                and architectures that make future engineers smile instead of
                swear.
              </p>
              <p className="leading-relaxed text-muted-foreground">
                Operating from Sweden, we bring deep fluency with GDPR and
                Swedish data protection law — so regulated industries get a
                partner that speaks the language of both code and compliance.
              </p>
            </div>

            <div className="gradient-border rounded-3xl bg-card/40 p-8 backdrop-blur-sm">
              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  { k: "Sweden", v: "Based in" },
                  { k: "EU", v: "Data residency" },
                  { k: "GDPR", v: "First principle" },
                  { k: "24h", v: "Reply time" },
                ].map((s) => (
                  <div
                    key={s.v}
                    className="rounded-2xl border border-border/60 bg-background/40 p-5"
                  >
                    <div className="font-heading text-2xl font-semibold tracking-tight">
                      {s.k}
                    </div>
                    <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {s.v}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="space-y-14">
          <SectionHeading
            eyebrow="Our values"
            title={
              <>
                Principles we{" "}
                <span className="text-gradient">actually live by.</span>
              </>
            }
          />
          <ValuesGrid />
        </Container>
      </section>

      <CTA />
    </>
  );
}
