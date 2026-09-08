import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

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
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="flex min-h-screen flex-col bg-white font-sans">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
