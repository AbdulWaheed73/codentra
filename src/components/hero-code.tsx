"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

type Lang = "ts" | "swift" | "hcl";

interface Snippet {
  language: Lang;
  filename: string;
  label: string;
  code: string;
}

const SNIPPETS: Snippet[] = [
  {
    language: "ts",
    filename: "app/api/leads/route.ts",
    label: "Next.js · App Router",
    code: `import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

export async function POST(req: Request) {
  const body = schema.parse(await req.json());
  const lead = await db.lead.create({ data: body });
  return NextResponse.json(lead, { status: 201 });
}`,
  },
  {
    language: "swift",
    filename: "DashboardView.swift",
    label: "SwiftUI · iOS",
    code: `import SwiftUI

struct DashboardView: View {
  @StateObject var vm = DashboardVM()

  var body: some View {
    ScrollView {
      ForEach(vm.orders) { order in
        OrderRow(order: order)
          .transition(.opacity)
      }
    }
    .task { await vm.load() }
  }
}`,
  },
  {
    language: "ts",
    filename: "orders.controller.ts",
    label: "NestJS · Backend",
    code: `@Controller("orders")
export class OrdersController {
  constructor(private orders: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateOrderDto, @Req() req: Request) {
    return this.orders.create(req.user.id, dto);
  }
}`,
  },
  {
    language: "hcl",
    filename: "infra/ecs.tf",
    label: "Terraform · AWS",
    code: `resource "aws_ecs_service" "api" {
  name            = "codentra-api"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.api.arn
  desired_count   = 3

  load_balancer {
    target_group_arn = aws_lb_target_group.api.arn
    container_name   = "api"
    container_port   = 3000
  }
}`,
  },
];

type TokenKind =
  | "kw" | "str" | "num" | "ty" | "deco"
  | "cmt" | "op" | "punct" | "plain";
interface Token { kind: TokenKind; text: string }

const KEYWORDS: Record<Lang, Set<string>> = {
  ts: new Set([
    "import", "from", "export", "const", "let", "async", "function", "return",
    "await", "class", "new", "if", "else", "for", "of", "in", "default",
    "typeof", "true", "false", "null", "undefined", "void", "this",
    "interface", "type", "extends", "public", "private", "readonly", "static",
    "as",
  ]),
  swift: new Set([
    "import", "struct", "class", "var", "let", "func", "return", "if", "else",
    "for", "in", "guard", "self", "init", "some", "async", "await",
    "extension", "protocol", "true", "false", "nil",
  ]),
  hcl: new Set([
    "resource", "variable", "module", "output", "data", "provider", "true",
    "false",
  ]),
};

function tokenize(code: string, lang: Lang): Token[] {
  const kws = KEYWORDS[lang];
  const out: Token[] = [];
  let i = 0;
  while (i < code.length) {
    const c = code[i];

    if (c === "\n") {
      out.push({ kind: "plain", text: "\n" });
      i++;
      continue;
    }
    if (c === " " || c === "\t") {
      let j = i;
      while (j < code.length && (code[j] === " " || code[j] === "\t")) j++;
      out.push({ kind: "plain", text: code.slice(i, j) });
      i = j;
      continue;
    }
    // line comments (// for ts/swift, # for hcl)
    if (code.startsWith("//", i) || (c === "#" && lang === "hcl")) {
      const end = code.indexOf("\n", i);
      const stop = end === -1 ? code.length : end;
      out.push({ kind: "cmt", text: code.slice(i, stop) });
      i = stop;
      continue;
    }
    // string
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < code.length && code[j] !== c) {
        if (code[j] === "\\") j++;
        j++;
      }
      j = Math.min(j + 1, code.length);
      out.push({ kind: "str", text: code.slice(i, j) });
      i = j;
      continue;
    }
    // number
    if (/[0-9]/.test(c)) {
      let j = i;
      while (j < code.length && /[0-9.]/.test(code[j])) j++;
      out.push({ kind: "num", text: code.slice(i, j) });
      i = j;
      continue;
    }
    // decorator / annotation
    if (c === "@") {
      let j = i + 1;
      while (j < code.length && /[A-Za-z_]/.test(code[j])) j++;
      out.push({ kind: "deco", text: code.slice(i, j) });
      i = j;
      continue;
    }
    // identifier
    if (/[A-Za-z_$]/.test(c)) {
      let j = i;
      while (j < code.length && /[A-Za-z0-9_$]/.test(code[j])) j++;
      const word = code.slice(i, j);
      if (kws.has(word)) out.push({ kind: "kw", text: word });
      else if (/^[A-Z]/.test(word)) out.push({ kind: "ty", text: word });
      else out.push({ kind: "plain", text: word });
      i = j;
      continue;
    }
    // operators
    if (/[+\-*/%<>=!&|^~]/.test(c)) {
      out.push({ kind: "op", text: c });
      i++;
      continue;
    }
    // punct
    if (/[{}()[\];,.:?]/.test(c)) {
      out.push({ kind: "punct", text: c });
      i++;
      continue;
    }
    out.push({ kind: "plain", text: c });
    i++;
  }
  return out;
}

const KIND_CLASS: Record<TokenKind, string> = {
  kw:    "text-[#7c3aed] dark:text-[#c4b5fd]",
  str:   "text-[#15803d] dark:text-[#86efac]",
  num:   "text-[#b45309] dark:text-[#fcd34d]",
  ty:    "text-[#0369a1] dark:text-[#7dd3fc]",
  deco:  "text-[#d97706] dark:text-[#fbbf24]",
  cmt:   "text-muted-foreground/70 italic",
  op:    "text-foreground/60",
  punct: "text-foreground/70",
  plain: "text-foreground/90",
};

export function HeroCode({ className }: { className?: string }) {
  const [snippetIdx, setSnippetIdx] = useState(0);
  const [typed, setTyped] = useState(0);
  const [pausing, setPausing] = useState(false);

  const snippet = SNIPPETS[snippetIdx];
  const tokens = useMemo(
    () => tokenize(snippet.code, snippet.language),
    [snippet]
  );
  const totalLen = snippet.code.length;
  const totalLines = snippet.code.split("\n").length;

  // typing loop
  useEffect(() => {
    if (pausing) {
      const t = setTimeout(() => {
        setTyped(0);
        setPausing(false);
        setSnippetIdx((i) => (i + 1) % SNIPPETS.length);
      }, 1800);
      return () => clearTimeout(t);
    }
    if (typed >= totalLen) {
      setPausing(true);
      return;
    }
    const next = snippet.code[typed];
    const delay =
      next === "\n" ? 110 :
      /[;{}]/.test(next) ? 50 :
      14;
    const t = setTimeout(() => setTyped((n) => n + 1), delay);
    return () => clearTimeout(t);
  }, [typed, totalLen, pausing, snippet.code]);

  // cursor-driven tilt
  const panelRef = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 120, damping: 18 });
  const sry = useSpring(ry, { stiffness: 120, damping: 18 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = panelRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
      const py = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
      ry.set(px * 14);
      rx.set(-py * 10);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [rx, ry]);

  // clip tokens to `typed` chars
  let remaining = typed;
  const rendered: { tok: Token; key: number }[] = [];
  for (let i = 0; i < tokens.length; i++) {
    if (remaining <= 0) break;
    const t = tokens[i];
    if (t.text.length <= remaining) {
      rendered.push({ tok: t, key: i });
      remaining -= t.text.length;
    } else {
      rendered.push({
        tok: { kind: t.kind, text: t.text.slice(0, remaining) },
        key: i,
      });
      remaining = 0;
    }
  }

  return (
    <motion.div
      className={cn("relative w-full [perspective:1400px]", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* underglow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(55% 60% at 50% 55%, oklch(0.72 0.2 290 / 0.38) 0%, transparent 70%)",
          filter: "blur(18px)",
        }}
      />

      <motion.div
        ref={panelRef}
        style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/85 shadow-xl shadow-primary/10 backdrop-blur-xl dark:shadow-[0_30px_80px_-30px_rgba(30,41,120,0.9)]"
      >
        {/* top highlight edge */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent"
        />
        {/* gradient-border accent */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background: "var(--gradient-tech)",
            WebkitMask:
              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            padding: "1px",
            opacity: 0.35,
          }}
        />

        {/* window chrome */}
        <div className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#ff5f57]/85" />
            <span className="size-2.5 rounded-full bg-[#febc2e]/85" />
            <span className="size-2.5 rounded-full bg-[#28c840]/85" />
          </div>
          <div className="hidden truncate font-mono text-[11px] text-muted-foreground sm:block">
            {snippet.filename}
          </div>
          <div className="rounded-full border border-border/60 bg-foreground/5 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-primary">
            {snippet.label}
          </div>
        </div>

        {/* code body */}
        <div className="relative">
          <pre className="m-0 flex min-h-[340px] overflow-hidden px-0 py-4 font-mono text-[12.5px] leading-[1.65] sm:text-[13px]">
            {/* line gutter — sized to snippet so it doesn't reflow */}
            <div className="select-none border-r border-border/50 px-3 text-right text-muted-foreground/50">
              {Array.from({ length: totalLines }, (_, i) => (
                <div key={i}>{String(i + 1).padStart(2, "0")}</div>
              ))}
            </div>

            {/* code */}
            <code className="block min-w-0 flex-1 overflow-hidden px-4">
              {rendered.map(({ tok, key }) => (
                <span key={key} className={KIND_CLASS[tok.kind]}>
                  {tok.text}
                </span>
              ))}
              {!pausing && (
                <span className="inline-block h-[1.05em] w-[2px] translate-y-[3px] bg-primary align-middle animate-[caret_1s_steps(2)_infinite]" />
              )}
            </code>
          </pre>
        </div>

        {/* footer */}
        <div className="flex items-center justify-between gap-3 border-t border-border/60 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block size-1.5 rounded-full bg-emerald-400/85 shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
              {pausing ? "Ready" : "Typing"}
            </span>
            <span>{snippet.language.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-3">
            {/* snippet progress dots */}
            <div className="flex items-center gap-1">
              {SNIPPETS.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "block h-1 rounded-full transition-all",
                    i === snippetIdx ? "w-5 bg-primary" : "w-1.5 bg-foreground/20"
                  )}
                />
              ))}
            </div>
            <span className="hidden sm:inline">utf-8 · lf</span>
          </div>
        </div>
      </motion.div>

      {/* caret keyframes */}
      <style>{`@keyframes caret { 0%, 100% { opacity: 1 } 50% { opacity: 0 } }`}</style>
    </motion.div>
  );
}
