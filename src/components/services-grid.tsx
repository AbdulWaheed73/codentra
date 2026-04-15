"use client";

import { ServiceCard } from "@/components/service-card";
import { services } from "@/lib/services";

export function ServicesGrid({ anchors = false }: { anchors?: boolean }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((s, i) => {
        const card = (
          <ServiceCard
            icon={s.icon}
            title={s.title}
            description={s.description}
            bullets={s.bullets}
            index={i}
          />
        );
        return anchors ? (
          <div key={s.id} id={s.id} className="scroll-mt-24">
            {card}
          </div>
        ) : (
          <div key={s.id}>{card}</div>
        );
      })}
    </div>
  );
}
