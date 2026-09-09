import { Mail, ArrowUpRight } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/data/social";
import { GitHubIcon, LinkedInIcon } from "@/components/icons/brand-icons";

const ICONS = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  mail: Mail,
};

export function ContactSection() {
  return (
    <section>
      <div className="container-page py-20 sm:py-24">
        <div className="flex flex-col items-start justify-between gap-10 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 font-mono text-sm uppercase tracking-[0.2em] text-accent">
              <span className="h-px w-6 bg-accent/60" />
              Let&apos;s Collaborate
            </div>
            <h2 className="max-w-md text-3xl font-medium tracking-tight text-zinc-950 sm:text-4xl dark:text-zinc-50">
              Get in touch:
            </h2>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-zinc-200 bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-800 sm:grid-cols-3">
          {SOCIAL_LINKS.map((link) => {
            const Icon = ICONS[link.icon];
            return (
              <a
                key={link.label}
                href={link.href}
                target={link.icon !== "mail" ? "_blank" : undefined}
                rel="noreferrer"
                className="group flex items-center justify-between gap-4 bg-white p-6 transition-colors duration-300 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-sm border border-zinc-200 text-zinc-500 transition-colors duration-300 group-hover:border-accent/40 group-hover:text-accent dark:border-zinc-800">
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-base font-medium text-zinc-900 dark:text-zinc-100">
                      {link.label}
                    </span>
                    <span className="font-mono text-sm text-zinc-600 dark:text-zinc-400">
                      {link.handle}
                    </span>
                  </div>
                </div>
                <ArrowUpRight
                  className="h-4 w-4 text-zinc-500 transition-all duration-300 ease-precise group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                  strokeWidth={1.5}
                />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
