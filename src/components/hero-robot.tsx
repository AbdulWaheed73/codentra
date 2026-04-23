"use client";

import { Card } from "@/components/ui/card";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";

export function HeroRobot() {
  return (
    <Card className="relative h-[420px] w-full overflow-hidden rounded-2xl border-border/40 bg-black/[0.96] sm:h-[500px]">
      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="white"
      />
      <SplineScene
        scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
        className="!h-full !w-full"
      />
    </Card>
  );
}
