"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { motion } from "framer-motion";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => <LoaderOrb />,
});

const TechScene = dynamic(
  () => import("@/components/three/tech-scene").then((m) => m.TechScene),
  {
    ssr: false,
    loading: () => <LoaderOrb />,
  }
);

const SPLINE_SCENE = process.env.NEXT_PUBLIC_SPLINE_SCENE;

export function HeroScene() {
  return (
    <div className="relative aspect-square w-full">
      {/* ambient glow halo behind the canvas */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[8%] rounded-full bg-gradient-tech opacity-30 blur-3xl animate-aurora"
      />
      <Suspense fallback={<LoaderOrb />}>
        {SPLINE_SCENE ? <Spline scene={SPLINE_SCENE} /> : <TechScene />}
      </Suspense>
    </div>
  );
}

function LoaderOrb() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <motion.div
        className="size-24 rounded-full bg-gradient-tech shadow-glow"
        animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
