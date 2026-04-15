import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { ServicesGrid } from "@/components/services-grid";

export function ServicesTeaser() {
  return (
    <section className="relative py-24">
      <Container className="space-y-14">
        <SectionHeading
          eyebrow="What we do"
          title={
            <>
              Full-stack engineering,{" "}
              <span className="text-gradient">end to end.</span>
            </>
          }
          description="From first commit to production at scale — design systems, native apps, APIs, cloud, and compliance handled under one roof."
        />
        <ServicesGrid />
      </Container>
    </section>
  );
}
