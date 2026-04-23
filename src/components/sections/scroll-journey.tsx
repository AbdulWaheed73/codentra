"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { services } from "@/lib/services";
import { Container } from "@/components/container";
import { cn } from "@/lib/utils";

export function ScrollJourney() {
  return (
    <section className="relative">
      {/* intro */}
      <div className="relative py-24">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5 text-center">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground backdrop-blur"
            >
              <span className="inline-flex size-1.5 rounded-full bg-gradient-tech" />
              How we engineer
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="text-balance font-heading text-3xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl"
            >
              Six capabilities,{" "}
              <span className="text-gradient">one platform.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="text-pretty text-base leading-relaxed text-muted-foreground md:text-lg"
            >
              Scroll through the stack. Each layer below is part of what we
              ship into production — together, on one team.
            </motion.p>
          </div>
        </Container>
      </div>

      {/* chapters */}
      <div className="relative">
        {services.map((s, i) => (
          <ChapterRow
            key={s.id}
            index={i}
            title={s.title}
            description={s.description}
            bullets={s.bullets}
          />
        ))}
      </div>
    </section>
  );
}

function ChapterRow({
  index,
  title,
  description,
  bullets,
}: {
  index: number;
  title: string;
  description: string;
  bullets: string[];
}) {
  const side: "left" | "right" = index % 2 === 0 ? "left" : "right";
  const rowRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start end", "end start"],
  });

  // giant background numeral parallax
  const numY = useTransform(scrollYProgress, [0, 1], ["40%", "-40%"]);
  const numOpacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    [0, 0.22, 0.22, 0]
  );
  const numScale = useTransform(scrollYProgress, [0, 1], [0.85, 1.15]);

  // card parallax — moves opposite the numeral for depth
  const cardY = useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]);

  return (
    <div
      ref={rowRef}
      className={cn(
        "relative flex min-h-[70vh] items-center py-16 md:min-h-[92vh] md:py-0",
        side === "left" ? "justify-start" : "justify-end"
      )}
    >
      {/* ghost numeral */}
      <motion.div
        aria-hidden
        style={{ y: numY, opacity: numOpacity, scale: numScale }}
        className={cn(
          "pointer-events-none absolute top-1/2 -translate-y-1/2 select-none font-heading text-[22vw] font-black leading-none tracking-tighter md:text-[16vw]",
          side === "left" ? "right-[4%]" : "left-[4%]"
        )}
      >
        <span
          style={{
            background: "var(--gradient-tech)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
          }}
        >
          0{index + 1}
        </span>
      </motion.div>

      <Container className="grid grid-cols-1 md:grid-cols-12">
        <motion.div
          style={{ y: cardY }}
          initial={{
            opacity: 0,
            x: side === "left" ? -60 : 60,
            y: 40,
          }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: false, margin: "-25% 0px -25% 0px", amount: 0.3 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "col-span-1 w-full max-w-md sm:max-w-sm md:col-span-6 md:max-w-none",
            side === "left" ? "md:col-start-1" : "md:col-start-7 md:ml-auto"
          )}
        >
          <div className="gradient-border relative rounded-2xl bg-card/70 p-6 backdrop-blur-xl sm:p-7">
            <div className="mb-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <span className="inline-flex size-1.5 rounded-full bg-gradient-tech" />
                Layer · 0{index + 1}
              </span>
              <span className="text-muted-foreground/60">
                {String(index + 1).padStart(2, "0")} / 06
              </span>
            </div>
            <h3 className="font-heading text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
              {title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
              {description}
            </p>
            <ul className="mt-5 space-y-2 border-t border-border/50 pt-5 text-sm">
              {bullets.map((b, bi) => (
                <motion.li
                  key={b}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-20% 0px" }}
                  transition={{ duration: 0.4, delay: 0.2 + bi * 0.08 }}
                  className="flex items-start gap-2 text-foreground/85"
                >
                  <span className="mt-1.5 inline-block size-1 shrink-0 rounded-full bg-gradient-tech" />
                  {b}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}
