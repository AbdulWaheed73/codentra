const stacks = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "NestJS",
  "WordPress",
  "Shopify",
  "iOS · Swift",
  "Android · Kotlin",
  "React Native",
  "AWS",
  "Postgres",
  "Redis",
  "Docker",
  "Kubernetes",
  "Terraform",
  "GraphQL",
  "tRPC",
];

export function TechMarquee() {
  const row = [...stacks, ...stacks];
  return (
    <div className="relative overflow-hidden border-y border-border/60 bg-card/20 py-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent"
      />
      <div className="flex min-w-full shrink-0 marquee gap-10 whitespace-nowrap">
        {row.map((s, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground"
          >
            <span className="size-1.5 rounded-full bg-gradient-tech" />
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
