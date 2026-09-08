import { Mail } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/data/social";
import { GitHubIcon, LinkedInIcon } from "@/components/icons/brand-icons";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/12">
      <div className="container-page flex flex-col items-center gap-4 py-10 sm:flex-row sm:justify-between">
        <p className="font-mono text-sm text-zinc-600">
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
                className="rounded-sm p-2 text-zinc-600 transition-colors duration-200 hover:text-accent"
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
