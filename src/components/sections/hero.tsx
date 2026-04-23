"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { Magnetic } from "@/components/motion/magnetic";
import { TextReveal } from "@/components/motion/text-reveal";

const HeroMark = dynamic(
  () => import("@/components/three/hero-mark").then((m) => m.HeroMark),
  { ssr: false, loading: () => null }
);

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden pb-16 pt-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-grid-sm bg-radial-fade opacity-30"
      />

      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* copy */}
          <div className="flex flex-col items-start gap-6 lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground backdrop-blur"
            >
              <Sparkles className="size-3 text-primary" />
              Premium software studio · Sweden
            </motion.div>

            <h1 className="text-balance font-heading text-4xl font-semibold leading-[1.02] tracking-tight sm:text-5xl md:text-6xl lg:text-[68px]">
              <TextReveal text="Engineering the" />
              <br className="hidden md:block" />{" "}
              <motion.span
                initial={{ opacity: 0, scale: 0.94, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-gradient inline-block"
              >
                future
              </motion.span>{" "}
              <TextReveal text="of software." delay={0.75} />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg"
            >
              Codentra builds premium web & mobile products with Next.js,
              React, Node, Nest, WordPress, Shopify and AWS — GDPR-first and
              Sweden-ready.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.05 }}
              className="mt-1 flex flex-wrap items-center gap-3"
            >
              <Magnetic strength={0.35}>
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
              </Magnetic>
              <Magnetic strength={0.25}>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-border/60 bg-card/40 px-6 backdrop-blur hover:border-primary/40"
                >
                  <Link href="/services">Explore services</Link>
                </Button>
              </Magnetic>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.25 }}
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
          </div>

          {/* 3D mark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[360px] w-full sm:h-[440px] lg:col-span-5 lg:h-[560px]"
          >
            {/* aura ring behind the canvas */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10"
              style={{
                background:
                  "radial-gradient(50% 50% at 50% 50%, oklch(0.72 0.2 290 / 0.35) 0%, transparent 70%)",
                filter: "blur(12px)",
              }}
            />
            <HeroMark className="!h-full !w-full" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="mt-14 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70"
        >
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            ↓
          </motion.span>
          Scroll to continue
        </motion.div>
      </Container>
    </section>
  );
}
