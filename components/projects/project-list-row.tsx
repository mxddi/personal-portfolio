import Link from "next/link";
import { Project } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Tag } from "@/components/ui/tag";
import { ArrowUpRight } from "lucide-react";

export function ProjectListRow({ project }: { project: Project }) {
  const externalHref = project.links?.repo ?? project.links?.demo;
  const href = externalHref ?? `/projects/${project.category}/${project.slug}`;
  const externalProps = externalHref
    ? { target: "_blank", rel: "noreferrer" }
    : {};

  return (
    <Link
      href={href}
      {...externalProps}
      className="group grid grid-cols-1 items-start gap-3 py-5 transition-colors duration-200 hover:bg-zinc-50 dark:hover:bg-zinc-900 sm:grid-cols-12 sm:items-center sm:gap-4 sm:px-4"
    >
      <div className="flex items-center gap-2 font-mono text-sm text-zinc-700 dark:text-zinc-300 sm:col-span-2">
        <time dateTime={project.date}>{formatDate(project.date)}</time>
      </div>

      <div className="flex flex-col gap-1 sm:col-span-4">
        <h3 className="flex flex-wrap items-center gap-2 text-base font-medium text-zinc-950 transition-colors duration-200 group-hover:text-accent dark:text-zinc-50">
          {project.title}
          {project.ongoing && (
            <span className="rounded-sm border border-accent/30 bg-accent/10 px-1.5 py-0.5 font-mono text-[11px] font-normal uppercase tracking-widest text-accent-dim">
              Ongoing
            </span>
          )}
          {project.classified && (
            <span className="font-mono text-xs font-normal text-zinc-500 dark:text-zinc-500">
              | Classified
            </span>
          )}
        </h3>
        <p className="line-clamp-1 text-sm text-zinc-700 dark:text-zinc-300">
          {project.summary}
        </p>
      </div>

      <div className="font-mono text-xs text-zinc-700 dark:text-zinc-300 sm:col-span-3">
        {project.stack.join(" · ")}
      </div>

      <div className="flex flex-wrap gap-1.5 sm:col-span-2">
        {project.tags.map((tag) => (
          <Tag key={tag} className="text-[11px]">
            {tag}
          </Tag>
        ))}
      </div>

      <div className="hidden justify-end sm:col-span-1 sm:flex">
        <ArrowUpRight
          className="h-3.5 w-3.5 text-zinc-600 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent group-hover:opacity-100"
          strokeWidth={1.5}
        />
      </div>
    </Link>
  );
}
