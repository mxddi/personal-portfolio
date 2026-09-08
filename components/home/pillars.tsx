import { Atom, CodeXml, Cpu } from "lucide-react";
import { pillars } from "@/lib/data/pillars";
import { SectionHeading } from "@/components/ui/section-heading";

const ICONS = {
  code: CodeXml,
  atom: Atom,
  cpu: Cpu,
};

export function Pillars() {
  return (
    <section className="border-b border-zinc-200">
      <div className="container-page py-20 sm:py-24">
        <SectionHeading
          eyebrow="Core Skills"
          title="Three disciplines, one vision"
          description="Every project I take on draws from at least one of these domains, sometimes all three."
        />

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-zinc-200 bg-zinc-200 sm:grid-cols-3">
          {pillars.map((pillar) => {
            const Icon = ICONS[pillar.icon];
            return (
              <div
                key={pillar.title}
                className="group relative flex flex-col gap-5 bg-white p-8 transition-colors duration-300 hover:bg-zinc-50"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-zinc-500">
                    {pillar.index}
                  </span>
                  <Icon
                    className="h-5 w-5 text-zinc-500 transition-colors duration-300 group-hover:text-accent"
                    strokeWidth={1.5}
                  />
                </div>

                <h3 className="text-xl font-medium tracking-tight text-zinc-950">
                  {pillar.title}
                </h3>

                <p className="text-base leading-relaxed text-zinc-700">
                  {pillar.description}
                </p>

                <ul className="mt-auto flex flex-col gap-2 border-t border-zinc-200 pt-4">
                  {pillar.skills.map((skill) => (
                    <li
                      key={skill}
                      className="flex items-center gap-2 font-mono text-xs text-zinc-600"
                    >
                      <span className="h-1 w-1 rounded-full bg-zinc-300 transition-colors duration-300 group-hover:bg-accent" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
