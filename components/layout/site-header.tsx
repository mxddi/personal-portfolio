"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/research", label: "Research" },
  { href: "/recognition", label: "Recognition" },
  { href: "/world", label: "World" },
  { href: "/real-estate", label: "Real Estate" },
  { href: "/flight-log", label: "Flight Log" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-black/12 bg-white/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <Link
          href="/"
          className="group flex items-center gap-2 font-mono text-base tracking-tight text-zinc-950"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-sm border border-zinc-200 bg-zinc-50 text-sm text-accent transition-colors group-hover:border-accent/50">
            MG
          </span>
          <span className="hidden text-zinc-600 sm:inline">
            /madaly-g
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-sm px-3 py-2 font-mono text-sm uppercase tracking-widest transition-colors duration-200",
                  isActive
                    ? "text-zinc-950"
                    : "text-zinc-600 hover:text-zinc-900"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute inset-x-3 -bottom-[1px] h-px bg-accent" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
