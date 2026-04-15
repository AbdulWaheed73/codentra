import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";

export function CTA() {
  return (
    <section className="relative py-24">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/40 p-10 text-center backdrop-blur-sm md:p-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-60 animate-aurora"
            style={{
              background:
                "radial-gradient(600px circle at 20% 20%, oklch(0.72 0.2 290 / 0.28), transparent 50%), radial-gradient(500px circle at 80% 80%, oklch(0.78 0.17 210 / 0.22), transparent 50%)",
              backgroundSize: "200% 200%",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-grid-sm bg-radial-fade opacity-50"
          />
          <div className="mx-auto max-w-2xl space-y-5">
            <h2 className="text-balance font-heading text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              Have an idea?{" "}
              <span className="text-gradient">Let&apos;s engineer it.</span>
            </h2>
            <p className="text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              Tell us about your product. We&apos;ll respond within one business
              day with a clear next step.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full bg-gradient-tech px-6 text-primary-foreground shadow-glow hover:opacity-95"
              >
                <Link href="/contact">
                  Start a project <ArrowUpRight className="ml-1 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-border/60 bg-background/60 px-6 backdrop-blur hover:border-primary/40"
              >
                <Link href="mailto:hello@codentra.dev">hello@codentra.dev</Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
