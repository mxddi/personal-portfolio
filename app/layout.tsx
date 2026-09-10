import type { Metadata } from "next";
import Script from "next/script";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

// Applies the saved theme before hydration so there's no flash on load.
// Unset visitors default to light — not the OS color scheme.
const THEME_INIT_SCRIPT = `
  (function () {
    try {
      if (localStorage.getItem("theme") === "dark") {
        document.documentElement.classList.add("dark");
      }
    } catch (e) {}
  })();
`;

export const metadata: Metadata = {
  title: "Madaly G — Multipassionate Software Engineer & Computational Physicist",
  description:
    "Portfolio of Madaly G — multipassionate software engineer and computational physicist working across distributed systems, numerical simulation, and electrical engineering. B.S. Physics, M.S. Electrical Engineering (in progress).",
  metadataBase: new URL("https://madalyg.dev"),
  openGraph: {
    title: "Madaly G — Multipassionate Software Engineer & Computational Physicist",
    description:
      "Building at the intersection of software, physics, and circuits.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-white font-sans dark:bg-zinc-950">
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
