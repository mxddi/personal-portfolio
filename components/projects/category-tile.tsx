import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProjectCategory } from "@/lib/types";
import { PatternTile } from "@/components/ui/pattern-tile";

export function CategoryTile({ category }: { category: ProjectCategory }) {
  return (
    <Link
      href={`/projects/${category.slug}`}
      className="group relative flex aspect-[4/5] flex-col overflow-hidden rounded-sm border border-zinc-200 transition-colors duration-300 ease-precise hover:border-accent/40 dark:border-zinc-800 sm:aspect-[3/4]"
    >
      <PatternTile
        pattern={category.pattern}
        className="transition-transform duration-700 ease-precise group-hover:scale-[1.04]"
      />

      <div className="relative z-10 mt-auto w-full p-6 pt-8">
        <div className="flex min-h-[10.5rem] flex-col justify-end gap-3 sm:min-h-[9.5rem]">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-2xl font-medium leading-snug tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50">
              {category.label}
            </h3>
            <ArrowUpRight
              className="mt-1 h-4 w-4 shrink-0 -translate-x-1 translate-y-1 text-zinc-700 opacity-0 transition-all duration-300 ease-precise group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-accent group-hover:opacity-100 dark:text-zinc-300"
              strokeWidth={1.5}
            />
          </div>
          <p className="max-w-xs text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
            {category.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
