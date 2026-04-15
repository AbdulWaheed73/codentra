"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, MapPin, FileText } from "lucide-react";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";

const points = [
  {
    icon: ShieldCheck,
    title: "GDPR by default",
    body: "Lawful bases, consent flows, DSAR-ready data models, retention policies — engineered in, not bolted on.",
  },
  {
    icon: MapPin,
    title: "Swedish expertise",
    body: "We work fluently with Dataskyddsförordningen, IMY guidance and sector-specific Swedish rules.",
  },
  {
    icon: Lock,
    title: "Privacy by design",
    body: "Pseudonymization, encryption, least-privilege IAM, and audit trails are part of the platform.",
  },
  {
    icon: FileText,
    title: "Docs & DPIAs",
    body: "Records of processing, DPIAs and subprocessor lists shipped alongside the code.",
  },
];

export function Compliance() {
  return (
    <section id="compliance" className="relative py-24">
      <Container className="space-y-14">
        <SectionHeading
          eyebrow="Compliance"
          title={
            <>
              GDPR & Sweden-ready,{" "}
              <span className="text-gradient">from day one.</span>
            </>
          }
          description="We build for regulated markets. Privacy isn't a checkbox for us — it's architectural."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {points.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="gradient-border rounded-2xl bg-card/40 p-6 backdrop-blur-sm"
            >
              <div className="flex items-start gap-4">
                <div className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-background/60">
                  <p.icon className="size-5 text-primary" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="font-heading text-base font-semibold tracking-tight">
                    {p.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {p.body}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
