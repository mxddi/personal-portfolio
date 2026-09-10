import { Mail } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/data/social";
import { GitHubIcon, LinkedInIcon } from "@/components/icons/brand-icons";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/12 dark:border-white/12">
      <div className="container-page flex flex-col items-center gap-4 py-10 sm:flex-row sm:justify-between">
        <p className="font-mono text-sm text-zinc-700 dark:text-zinc-300">
          © {new Date().getFullYear()} Madaly G.
        </p>

        <div className="flex items-center gap-1">
          {SOCIAL_LINKS.map((link) => {
            const Icon =
              link.icon === "github"
                ? GitHubIcon
                : link.icon === "linkedin"
                ? LinkedInIcon
                : Mail;
            return (
              <a
                key={link.label}
                href={link.href}
                target={link.icon !== "mail" ? "_blank" : undefined}
                rel="noreferrer"
                aria-label={link.label}
                className="rounded-sm p-2 text-zinc-700 transition-colors duration-200 hover:text-accent dark:text-zinc-300"
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} />
              </a>
            );
          })}

          <span className="mx-1 h-4 w-px bg-zinc-200 dark:bg-zinc-800" />

          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
