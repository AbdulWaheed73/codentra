"use client";

import { Target, Zap, Users, Layers } from "lucide-react";
import { ServiceCard } from "@/components/service-card";

const values = [
  {
    icon: Target,
    title: "Outcome-driven",
    description:
      "We measure success by what your product does in the world — not by lines of code shipped.",
  },
  {
    icon: Zap,
    title: "Premium craft",
    description:
      "Type-safe code, thoughtful UI, zero-sloppiness. We treat polish as a feature, not a finishing touch.",
  },
  {
    icon: Users,
    title: "Calm collaboration",
    description:
      "Weekly demoable increments, transparent trade-offs, zero surprises on Fridays.",
  },
  {
    icon: Layers,
    title: "Full-stack depth",
    description:
      "From iOS to AWS — one team that owns the whole picture instead of handing it off.",
  },
];

export function ValuesGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {values.map((v, i) => (
        <ServiceCard
          key={v.title}
          icon={v.icon}
          title={v.title}
          description={v.description}
          index={i}
        />
      ))}
    </div>
  );
}
