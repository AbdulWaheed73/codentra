import {
  Globe,
  Smartphone,
  Cloud,
  ShieldCheck,
  ShoppingBag,
  Server,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Service {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  bullets: string[];
}

export const services: Service[] = [
  {
    id: "web",
    icon: Globe,
    title: "Web Development",
    description:
      "High-performance marketing sites and SaaS products with modern frameworks. SEO-first, edge-ready, pixel-tight.",
    bullets: ["Next.js · React", "WordPress (headless or classic)", "Core Web Vitals tuned"],
  },
  {
    id: "mobile",
    icon: Smartphone,
    title: "Mobile Apps",
    description:
      "Native-grade iOS and Android apps with shared codebases when it fits, and platform-specific builds when it matters.",
    bullets: ["iOS (Swift) · Android (Kotlin)", "React Native for cross-platform", "App Store & Play release ops"],
  },
  {
    id: "backend",
    icon: Server,
    title: "Backend & APIs",
    description:
      "Robust, typed services engineered for scale — from REST to GraphQL to event-driven systems.",
    bullets: ["Node.js · NestJS · TypeScript", "GraphQL & tRPC APIs", "Postgres · Redis · queues"],
  },
  {
    id: "commerce",
    icon: ShoppingBag,
    title: "Commerce",
    description:
      "Storefronts that actually convert — from Shopify builds to headless commerce on Next.js.",
    bullets: ["Shopify (Liquid & Hydrogen)", "Headless commerce on Next.js", "Checkout & payment integrations"],
  },
  {
    id: "cloud",
    icon: Cloud,
    title: "Cloud & DevOps",
    description:
      "Reliable AWS infrastructure with IaC, CI/CD, and observability — so releases are boring in the best way.",
    bullets: ["AWS (ECS · Lambda · S3 · RDS)", "Terraform & GitHub Actions", "Logs, metrics & tracing"],
  },
  {
    id: "compliance",
    icon: ShieldCheck,
    title: "GDPR & Swedish Compliance",
    description:
      "Privacy-by-design engineering aligned with GDPR and Swedish data protection rules from day one.",
    bullets: ["GDPR-aligned architectures", "Dataskyddsförordningen · Kamerabevakningslagen", "Data residency in EU / Sweden"],
  },
];
