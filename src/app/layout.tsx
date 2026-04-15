import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Codentra — Engineering the Future of Software",
    template: "%s · Codentra",
  },
  description:
    "Codentra builds premium web & mobile products with Next.js, React, Node, Nest, WordPress, Shopify and AWS — GDPR & Sweden-ready.",
  keywords: [
    "Codentra",
    "software agency",
    "Next.js",
    "React",
    "iOS",
    "Android",
    "WordPress",
    "Shopify",
    "Node.js",
    "NestJS",
    "AWS",
    "GDPR",
    "Sweden",
  ],
  metadataBase: new URL("https://codentra.dev"),
  openGraph: {
    title: "Codentra — Engineering the Future of Software",
    description:
      "Premium web & mobile engineering. GDPR-first, Sweden-ready.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground relative overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
