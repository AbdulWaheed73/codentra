import type { Metadata } from "next";
import { Mail, MapPin, Clock } from "lucide-react";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Tell us about your project. We'll respond within one business day.",
};

const info = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@codentra.dev",
    href: "mailto:hello@codentra.dev",
  },
  {
    icon: MapPin,
    label: "Based in",
    value: "Sweden · remote-friendly",
  },
  {
    icon: Clock,
    label: "Reply time",
    value: "Within 24 hours, weekdays",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Tell us about your{" "}
            <span className="text-gradient">project.</span>
          </>
        }
        description="We&apos;ll get back to you within one business day with a clear next step."
      />

      <section className="pb-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
            <div className="space-y-8">
              <div className="space-y-4">
                {info.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur-sm"
                  >
                    <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-background/60">
                      <item.icon className="size-4 text-primary" strokeWidth={1.75} />
                    </div>
                    <div>
                      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        {item.label}
                      </div>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="mt-1 inline-block text-base text-foreground transition-colors hover:text-primary"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <div className="mt-1 text-base text-foreground">
                          {item.value}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="gradient-border rounded-2xl bg-card/40 p-6 backdrop-blur-sm">
                <h3 className="font-heading text-base font-semibold">
                  Working with us
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  We take on a small number of engagements at a time to keep
                  quality high. Typical projects run 6–16 weeks with weekly
                  demos and clear deliverables.
                </p>
              </div>
            </div>

            <ContactForm />
          </div>
        </Container>
      </section>
    </>
  );
}
