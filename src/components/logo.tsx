import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2 font-heading tracking-tight",
        className
      )}
    >
      <span className="relative inline-flex size-7 items-center justify-center rounded-md bg-gradient-tech shadow-glow animate-aurora">
        <span className="absolute inset-[2px] rounded-[5px] bg-background/80 backdrop-blur-sm" />
        <span className="relative font-mono text-[11px] font-bold text-gradient">
          {"<>"}
        </span>
      </span>
      <span className="text-lg font-semibold">
        Cod<span className="text-gradient">entra</span>
      </span>
    </Link>
  );
}
