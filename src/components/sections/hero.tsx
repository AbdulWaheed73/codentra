"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden pb-16 pt-10">
      {/* soft vignette that fades edges so the DNA backdrop reads better */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-grid-sm bg-radial-fade opacity-40"
      />

      <Container>
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground backdrop-blur"
          >
            <Sparkles className="size-3 text-primary" />
            Premium software studio · Sweden
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-balance font-heading text-4xl font-semibold leading-[1.02] tracking-tight sm:text-5xl md:text-6xl lg:text-[72px]"
          >
            Engineering the{" "}
            <span className="text-gradient">future</span> of software.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            Codentra builds premium web & mobile products with Next.js, React,
            Node, Nest, WordPress, Shopify and AWS — GDPR-first and
            Sweden-ready.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-2 flex flex-wrap items-center justify-center gap-3"
          >
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full bg-gradient-tech px-6 text-primary-foreground shadow-glow hover:opacity-95"
            >
              <Link href="/contact">
                Start a project
                <ArrowUpRight className="ml-1 size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-border/60 bg-card/40 px-6 backdrop-blur hover:border-primary/40"
            >
              <Link href="/services">Explore services</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-10 grid w-full max-w-lg grid-cols-3 gap-4 border-t border-border/60 pt-6"
          >
            {[
              { k: "10+", v: "Years combined" },
              { k: "40+", v: "Products shipped" },
              { k: "100%", v: "GDPR-aligned" },
            ].map((s) => (
              <div key={s.v}>
                <div className="font-heading text-2xl font-semibold tracking-tight">
                  {s.k}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {s.v}
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-14 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70"
          >
            <motion.span
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              ↓
            </motion.span>
            Scroll the strand
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
