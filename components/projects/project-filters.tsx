"use client";

import { useMemo, useState } from "react";
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { Project, ProjectCategorySlug } from "@/lib/types";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectListRow } from "@/components/projects/project-list-row";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "list";

export function ProjectFilters({
  projects,
  tags,
  categorySlug,
}: {
  projects: Project[];
  tags: string[];
  categorySlug: ProjectCategorySlug;
}) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>("grid");

  const filtered = useMemo(() => {
    if (!activeTag) return projects;
    return projects.filter((p) => p.tags.includes(activeTag));
  }, [projects, activeTag]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 pr-2 font-mono text-xs uppercase tracking-widest text-zinc-700 dark:text-zinc-300">
            <SlidersHorizontal className="h-3 w-3" strokeWidth={1.5} />
            Filter
          </span>
          <FilterChip
            label="All"
            active={activeTag === null}
            onClick={() => setActiveTag(null)}
          />
          {tags.map((tag) => (
            <FilterChip
              key={tag}
              label={tag}
              active={activeTag === tag}
              onClick={() => setActiveTag(tag)}
            />
          ))}
        </div>

        <div className="flex items-center gap-1 self-start rounded-sm border border-zinc-200 p-0.5 dark:border-zinc-800">
          <ViewButton
            active={view === "grid"}
            onClick={() => setView("grid")}
            icon={LayoutGrid}
            label="Grid view"
          />
          <ViewButton
            active={view === "list"}
            onClick={() => setView("list")}
            icon={List}
            label="List view"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 font-mono text-xs text-zinc-700 dark:text-zinc-300">
        <span className="text-accent">{filtered.length}</span>
        {filtered.length === 1 ? "result" : "results"}
        {activeTag && (
          <>
            <span>for</span>
            <span className="text-zinc-800 dark:text-zinc-200">
              [{activeTag}]
            </span>
          </>
        )}
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              categorySlug={categorySlug}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-zinc-200 border-y border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
          {filtered.map((project) => (
            <ProjectListRow
              key={project.slug}
              project={project}
              categorySlug={categorySlug}
            />
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="flex flex-col items-center gap-2 border border-dashed border-zinc-300 py-16 text-center dark:border-zinc-700">
          <p className="font-mono text-base text-zinc-700 dark:text-zinc-300">
            No projects match this filter.
          </p>
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-sm border px-3 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors duration-200",
        active
          ? "border-accent/40 bg-accent/10 text-accent"
          : "border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
      )}
    >
      {label}
    </button>
  );
}

function ViewButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof LayoutGrid;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "rounded-[3px] p-1.5 transition-colors duration-200",
        active
          ? "bg-zinc-100 text-accent dark:bg-zinc-800"
          : "text-zinc-600 hover:text-zinc-800 dark:hover:text-zinc-200"
      )}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
    </button>
  );
}
