"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useScroll, useMotionValueEvent } from "framer-motion";

const DNAHelix = dynamic(
  () => import("@/components/three/dna-helix").then((m) => m.DNAHelix),
  { ssr: false, loading: () => null }
);

const NODE_COUNT = 6;
// the scroll window (fraction of total home-page scroll) that roughly
// corresponds to the ScrollJourney chapters — nodes light up in sync.
const ACTIVE_START = 0.18;
const ACTIVE_END = 0.7;

export function HomeBackdrop() {
  const progressRef = useRef(0);
  const activeIndexRef = useRef(0);
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
    if (v <= ACTIVE_START) {
      activeIndexRef.current = 0;
    } else if (v >= ACTIVE_END) {
      activeIndexRef.current = NODE_COUNT - 1;
    } else {
      const local = (v - ACTIVE_START) / (ACTIVE_END - ACTIVE_START);
      activeIndexRef.current = Math.min(
        NODE_COUNT - 1,
        Math.floor(local * NODE_COUNT)
      );
    }
  });

  // expose progress + active index to chapter components via a shared module
  useEffect(() => {
    backdropState.progressRef = progressRef;
    backdropState.activeIndexRef = activeIndexRef;
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
    >
      {/* radial vignette so the strand reads cleanest in the middle */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 80% at 50% 50%, transparent 0%, oklch(0.07 0.015 265 / 0.55) 100%)",
        }}
      />
      <DNAHelix
        progressRef={progressRef}
        activeIndexRef={activeIndexRef}
        className="!h-full !w-full"
      />
    </div>
  );
}

// shared ref bridge so the ScrollJourney chapters can read active-index / page scroll
import type { MutableRefObject } from "react";
export const backdropState: {
  progressRef: MutableRefObject<number> | null;
  activeIndexRef: MutableRefObject<number> | null;
} = {
  progressRef: null,
  activeIndexRef: null,
};
