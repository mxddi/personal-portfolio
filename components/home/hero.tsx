import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProfilePhoto } from "@/components/home/profile-photo";
import { AuroraCanvas } from "@/components/home/aurora-canvas";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <AuroraCanvas />
      {/* Grid backdrop only shows in light mode — dark mode gets the
          aurora scene above instead. */}
      <div className="bg-grid-fade absolute inset-0 dark:hidden" />

      <div className="container-page relative py-16 sm:py-24 md:py-32">
        <div className="relative">
          {/* Frosted glass card, dark mode only — a separate, absolutely
              positioned backdrop rather than padding on `.hero-grid`
              itself, so it doesn't eat into the grid's own width (which
              would squeeze the heading into the photo on narrow mobile
              screens). It just floats a few pixels outside the content. */}
          <div className="pointer-events-none absolute -inset-4 hidden rounded-2xl bg-zinc-950/35 shadow-2xl shadow-black/40 backdrop-blur-xl dark:block sm:-inset-6 sm:rounded-3xl md:-inset-8" />

          <div className="hero-grid relative">
            <h1
              style={{ gridArea: "heading" }}
              className="animate-fade-up min-w-0 max-w-4xl text-balance text-5xl font-medium leading-[1.1] tracking-tight text-zinc-950 opacity-0 sm:text-6xl md:text-7xl dark:text-zinc-50"
            >
              {/* Hi, I&apos;m <span className="text-accent">Madaly</span> */}
              <span className="text-zinc-950 dark:text-zinc-50">MADALY</span>
            </h1>

            <div
              style={{ gridArea: "photo" }}
              className="animate-fade-up shrink-0 justify-self-start opacity-0 [animation-delay:120ms] sm:justify-self-auto"
            >
              <ProfilePhoto />
            </div>

            <p
              style={{ gridArea: "bio" }}
              className="animate-fade-up max-w-2xl text-balance text-lg leading-relaxed text-zinc-700 opacity-0 [animation-delay:80ms] sm:text-xl dark:text-zinc-300"
            >
              {/*— a multipassionate software engineer and computational physicist*/}
              Multipassionate software engineer and computational physicist
              building
              systems at the intersection of{" "}
              <span className="text-zinc-950 dark:text-zinc-50">code</span>,{" "}
              <span className="text-zinc-950 dark:text-zinc-50">
                the physics of our universe
              </span>
              , and{" "}
              <span className="text-zinc-950 dark:text-zinc-50">
                circuits
              </span>
              . I hold a{" "}
              <span className="text-zinc-950 dark:text-zinc-50">
                B.S. in Physics
              </span>{" "}
              and am currently pursuing an{" "}
              <span className="text-zinc-950 dark:text-zinc-50">
                M.S. in Electrical Engineering
              </span>
              , with a focus on autonomous spacecraft systems.
            </p>

            <div
              style={{ gridArea: "cta" }}
              className="animate-fade-up flex flex-wrap items-center gap-4 pt-2 opacity-0 [animation-delay:160ms]"
            >
              <Link
                href="/projects"
                className="group inline-flex items-center gap-2 rounded-sm border border-accent/40 bg-accent/10 px-5 py-2.5 font-mono text-sm uppercase tracking-widest text-accent-dim transition-all duration-300 ease-precise hover:bg-accent/20"
              >
                View Projects
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-300 ease-precise group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={2}
                />
              </Link>
              <Link
                href="/research"
                className="group inline-flex items-center gap-2 rounded-sm border border-zinc-300 px-5 py-2.5 font-mono text-sm uppercase tracking-widest text-zinc-800 transition-all duration-300 ease-precise hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:text-zinc-50"
              >
                Read Research
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-300 ease-precise group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={2}
                />
              </Link>
            </div>

            <dl
              style={{ gridArea: "stats" }}
              className="animate-fade-up mt-4 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-4 border-t border-zinc-200 pt-8 font-mono text-sm opacity-0 [animation-delay:240ms] sm:grid-cols-3 dark:border-zinc-800"
            >
              {[
                { label: "Degree", value: "B.S. Physics" },
                { label: "Upcoming", value: "M.S. EE" },
                { label: "Focus", value: "Data / Autonomy" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-1">
                  <dt className="uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
                    {item.label}
                  </dt>
                  <dd className="text-zinc-900 dark:text-zinc-100">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
