"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}

// Character-by-character entrance. Wraps each word in an inline-block span so
// the rising chars don't break line wrapping.
export function TextReveal({
  text,
  className,
  delay = 0,
  stagger = 0.018,
}: TextRevealProps) {
  const words = text.split(" ");
  let charIndex = 0;
  return (
    <span className={cn("inline", className)}>
      {words.map((word, wi) => {
        const chars = [...word];
        return (
          <span
            key={`${word}-${wi}`}
            className="inline-block overflow-hidden whitespace-nowrap align-bottom"
          >
            {chars.map((c, ci) => {
              const idx = charIndex++;
              return (
                <motion.span
                  key={ci}
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.55,
                    delay: delay + idx * stagger,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="inline-block"
                >
                  {c}
                </motion.span>
              );
            })}
            {wi < words.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </span>
        );
      })}
    </span>
  );
}
