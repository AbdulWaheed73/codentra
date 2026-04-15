import Link from "next/link";
import { Mail, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/logo";
import { Separator } from "@/components/ui/separator";

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.97 3.22 9.18 7.69 10.67.56.1.77-.24.77-.54 0-.27-.01-1.16-.02-2.1-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.39-1.22.71-1.5-2.5-.28-5.13-1.25-5.13-5.57 0-1.23.44-2.24 1.16-3.03-.12-.29-.5-1.44.11-3 0 0 .95-.3 3.11 1.16.9-.25 1.87-.37 2.83-.38.96.01 1.93.13 2.83.38 2.16-1.46 3.11-1.16 3.11-1.16.61 1.56.23 2.71.11 3 .72.79 1.16 1.8 1.16 3.03 0 4.33-2.64 5.28-5.15 5.56.4.35.76 1.03.76 2.08 0 1.5-.01 2.71-.01 3.08 0 .3.21.65.78.54 4.46-1.49 7.68-5.7 7.68-10.67C23.25 5.48 18.27.5 12 .5Z" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.62 0 4.29 2.38 4.29 5.48v6.26ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

const cols = [
  {
    title: "Services",
    links: [
      { label: "Web Development", href: "/services#web" },
      { label: "Mobile Apps", href: "/services#mobile" },
      { label: "Cloud & DevOps", href: "/services#cloud" },
      { label: "Compliance", href: "/services#compliance" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "GDPR", href: "/services#compliance" },
      { label: "Swedish Data Protection", href: "/services#compliance" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-border/60">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-tech opacity-40"
      />
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div className="space-y-5">
            <Logo />
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Codentra is a premium software studio engineering web, mobile and
              cloud products — built for scale, shipped with care.
            </p>
            <div className="flex items-center gap-2">
              <Link
                href="mailto:hello@codentra.dev"
                aria-label="Email"
                className="inline-flex size-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                <Mail className="size-4" />
              </Link>
              <Link
                href="#"
                aria-label="GitHub"
                className="inline-flex size-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                <GithubIcon className="size-4" />
              </Link>
              <Link
                href="#"
                aria-label="LinkedIn"
                className="inline-flex size-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                <LinkedinIcon className="size-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {cols.map((col) => (
              <div key={col.title}>
                <h4 className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {col.title}
                </h4>
                <ul className="space-y-2.5 text-sm">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-foreground/80 transition-colors hover:text-foreground"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-10 bg-border/60" />

        <div className="flex flex-col items-start justify-between gap-4 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} Codentra. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-3 py-1">
              <ShieldCheck className="size-3.5 text-primary" />
              GDPR compliant
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-3 py-1">
              <span className="relative inline-flex size-2 rounded-full bg-gradient-tech" />
              Based in Sweden
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
