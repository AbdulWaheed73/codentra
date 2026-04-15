import { cn } from "@/lib/utils";

export function GridBackground({
  className,
  size = "md",
  fade = true,
}: {
  className?: string;
  size?: "sm" | "md";
  fade?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10",
        size === "sm" ? "bg-grid-sm" : "bg-grid",
        fade && "bg-radial-fade",
        className
      )}
    />
  );
}

export function AuroraGlow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className
      )}
    >
      <div className="absolute left-1/2 top-[-20%] h-[520px] w-[820px] -translate-x-1/2 rounded-full opacity-40 blur-3xl bg-gradient-tech animate-aurora" />
      <div className="absolute bottom-[-30%] right-[-10%] h-[420px] w-[520px] rounded-full opacity-25 blur-3xl bg-gradient-tech animate-aurora" />
    </div>
  );
}
