"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  bullets?: string[];
  href?: string;
  className?: string;
  index?: number;
}

export function ServiceCard({
  icon: Icon,
  title,
  description,
  bullets,
  href,
  className,
  index = 0,
}: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className={cn(
        "group relative flex h-full flex-col rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-glow",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(600px circle at var(--x, 50%) var(--y, 50%), oklch(0.72 0.2 290 / 0.08), transparent 40%)",
        }}
      />
      <div className="mb-5 inline-flex size-11 items-center justify-center rounded-xl border border-border/60 bg-background/60">
        <Icon className="size-5 text-primary" strokeWidth={1.75} />
      </div>
      <h3 className="mb-2 font-heading text-lg font-semibold tracking-tight">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {bullets && bullets.length > 0 && (
        <ul className="mt-5 space-y-2 border-t border-border/50 pt-5 text-sm">
          {bullets.map((b) => (
            <li
              key={b}
              className="flex items-start gap-2 text-foreground/80"
            >
              <span className="mt-1.5 inline-block size-1 shrink-0 rounded-full bg-gradient-tech" />
              {b}
            </li>
          ))}
        </ul>
      )}
      {href && (
        <Link
          href={href}
          className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-foreground/90 transition-colors hover:text-primary"
        >
          Learn more
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      )}
    </motion.div>
  );
}
