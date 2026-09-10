"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/world", label: "World" },
  { href: "/projects", label: "Projects" },
  { href: "/research", label: "Research" },
  { href: "/real-estate", label: "Real Estate" },
  { href: "/flight-log", label: "Flight Log" },
  { href: "/recognition", label: "Recognition" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Prevent background scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const isLinkActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-black/12 bg-white/80 backdrop-blur-md dark:border-white/12 dark:bg-zinc-950/80">
      <div className="container-page flex h-16 items-center justify-between">
        <Link
          href="/"
          className="font-mono text-xl tracking-tight text-zinc-950 transition-colors duration-200 hover:text-accent dark:text-zinc-50"
        >
          M<span className="text-accent">/</span>G
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = isLinkActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-sm px-3 py-2 font-mono text-sm uppercase tracking-widest transition-colors duration-200",
                  isActive
                    ? "text-zinc-950 dark:text-zinc-50"
                    : "text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
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

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          className="flex h-9 w-9 items-center justify-center rounded-sm border border-zinc-200 text-zinc-700 transition-colors duration-200 hover:border-accent/40 hover:text-accent dark:border-zinc-800 dark:text-zinc-300 md:hidden"
        >
          {isMenuOpen ? (
            <X className="h-4 w-4" strokeWidth={1.5} />
          ) : (
            <Menu className="h-4 w-4" strokeWidth={1.5} />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <nav className="border-t border-black/12 bg-white dark:border-white/12 dark:bg-zinc-950 md:hidden">
          <div className="container-page flex flex-col py-2">
            {NAV_LINKS.map((link) => {
              const isActive = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-sm px-2 py-3 font-mono text-sm uppercase tracking-widest transition-colors duration-200",
                    isActive
                      ? "text-accent"
                      : "text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-50"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
