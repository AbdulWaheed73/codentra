"use client";

import { motion } from "framer-motion";
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
              The Codentra strand
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="text-balance font-heading text-3xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl"
            >
              Six capabilities,{" "}
              <span className="text-gradient">one strand of DNA.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="text-pretty text-base leading-relaxed text-muted-foreground md:text-lg"
            >
              Scroll the strand. Each node on the helix is a part of the stack we
              bring to every product we ship.
            </motion.p>
          </div>
        </Container>
      </div>

      {/* chapters — alternating sides, the helix runs down the middle behind them */}
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

  return (
    <div
      className={cn(
        "relative flex min-h-[92vh] items-center",
        side === "left" ? "justify-start" : "justify-end"
      )}
    >
      <Container
        className={cn(
          "grid grid-cols-1 md:grid-cols-12"
        )}
      >
        <motion.div
          initial={{
            opacity: 0,
            x: side === "left" ? -60 : 60,
            y: 20,
          }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: false, margin: "-25% 0px -25% 0px", amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "col-span-1 w-full max-w-md sm:max-w-sm md:col-span-5 md:max-w-none",
            side === "left"
              ? "md:col-start-1"
              : "md:col-start-8 md:ml-auto"
          )}
        >
          <div className="gradient-border relative rounded-2xl bg-card/70 p-6 backdrop-blur-xl sm:p-7">
            <div className="mb-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              <span className="inline-flex size-1.5 rounded-full bg-gradient-tech" />
              Node · 0{index + 1}
            </div>
            <h3 className="font-heading text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
              {title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
              {description}
            </p>
            <ul className="mt-5 space-y-2 border-t border-border/50 pt-5 text-sm">
              {bullets.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2 text-foreground/85"
                >
                  <span className="mt-1.5 inline-block size-1 shrink-0 rounded-full bg-gradient-tech" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}
