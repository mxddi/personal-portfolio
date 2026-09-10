import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProjectCategory } from "@/lib/types";
import { PatternTile } from "@/components/ui/pattern-tile";

export function CategoryTile({ category }: { category: ProjectCategory }) {
  return (
    <Link
      href={`/projects/${category.slug}`}
      className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-sm border border-zinc-200 transition-colors duration-300 ease-precise hover:border-accent/40 dark:border-zinc-800 sm:aspect-[3/4]"
    >
      <PatternTile
        pattern={category.pattern}
        className="transition-transform duration-700 ease-precise group-hover:scale-[1.04]"
      />

      <div className="relative z-10 flex items-center justify-between px-6 pt-6">
        <span className="font-mono text-sm text-zinc-700 transition-colors duration-300 group-hover:text-accent dark:text-zinc-300">
          {category.index}
        </span>
        <ArrowUpRight
          className="h-4 w-4 -translate-x-1 translate-y-1 text-zinc-700 opacity-0 transition-all duration-300 ease-precise group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-accent group-hover:opacity-100 dark:text-zinc-300"
          strokeWidth={1.5}
        />
      </div>

      <div className="relative z-10 flex flex-col gap-2 p-6">
        <h3 className="text-2xl font-medium tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50">
          {category.label}
        </h3>
        <p className="max-w-xs text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
          {category.description}
        </p>
      </div>
    </Link>
  );
}
