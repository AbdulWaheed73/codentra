import { Container } from "@/components/container";
import { AuroraGlow, GridBackground } from "@/components/grid-bg";

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pb-16 pt-20 sm:pt-24">
      <GridBackground />
      <AuroraGlow />
      <Container className="relative">
        <div className="mx-auto max-w-3xl space-y-5 text-center">
          {eyebrow && (
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground backdrop-blur">
              <span className="inline-flex size-1.5 rounded-full bg-gradient-tech" />
              {eyebrow}
            </div>
          )}
          <h1 className="text-balance font-heading text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            {title}
          </h1>
          {description && (
            <p className="text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              {description}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
