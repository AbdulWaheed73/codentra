"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";

const steps = [
  {
    n: "01",
    title: "Discover",
    body: "Workshops to map outcomes, constraints, and the shortest path to value.",
  },
  {
    n: "02",
    title: "Architect",
    body: "We design systems that scale — data models, infra, and UI foundations.",
  },
  {
    n: "03",
    title: "Build",
    body: "Weekly demoable increments. Type-safe, tested, observable from day one.",
  },
  {
    n: "04",
    title: "Ship & evolve",
    body: "CI/CD, monitoring, and iteration loops so your product compounds.",
  },
];

export function Process() {
  return (
    <section className="relative py-24">
      <Container className="space-y-14">
        <SectionHeading
          eyebrow="How we work"
          title={
            <>
              A process built for{" "}
              <span className="text-gradient">shipping.</span>
            </>
          }
          description="Calm, transparent collaboration with clear artifacts at every stage."
        />
        <div className="relative grid gap-5 md:grid-cols-4">
          <div
            aria-hidden
            className="absolute left-0 right-0 top-14 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block"
          />
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="group relative rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-full border border-border/60 bg-background font-mono text-xs text-primary">
                  {s.n}
                </div>
                <h3 className="font-heading text-base font-semibold">
                  {s.title}
                </h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
