import Image from "next/image";
import Link from "next/link";
import { Project } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Tag } from "@/components/ui/tag";
import { ArrowUpRight } from "lucide-react";

export function ProjectCard({ project }: { project: Project }) {
  const externalHref = project.links?.repo ?? project.links?.demo;
  const href = externalHref ?? `/projects/${project.category}/${project.slug}`;
  const externalProps = externalHref
    ? { target: "_blank", rel: "noreferrer" }
    : {};
  const thumbnail = project.cardImage ?? project.image;

  return (
    <Link
      href={href}
      {...externalProps}
      className="group flex flex-col gap-5 border border-zinc-200 bg-white p-6 transition-all duration-300 ease-precise hover:border-accent/40 hover:bg-zinc-50/60 sm:p-7"
    >
      {thumbnail && (
        <div className="relative -m-6 mb-0 aspect-[16/10] w-[calc(100%+3rem)] overflow-hidden border-b border-zinc-200 sm:-m-7 sm:mb-0 sm:w-[calc(100%+3.5rem)]">
          <Image
            src={thumbnail}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 ease-precise group-hover:scale-[1.04]"
            sizes="(min-width: 1024px) 400px, 100vw"
          />
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-xl font-medium tracking-tight text-zinc-950 transition-colors duration-300 group-hover:text-accent sm:text-2xl">
            {project.title}
          </h3>
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-600">
            <time dateTime={project.date}>{formatDate(project.date)}</time>
            {project.ongoing && (
              <span className="rounded-sm border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[11px] uppercase tracking-widest text-accent-dim">
                Ongoing
              </span>
            )}
            {project.classified && (
              <span className="text-zinc-400">| Classified</span>
            )}
          </div>
        </div>

        <ArrowUpRight
          className="mt-1 h-4 w-4 shrink-0 -translate-x-1 translate-y-1 text-zinc-700 opacity-0 transition-all duration-300 ease-precise group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-accent group-hover:opacity-100"
          strokeWidth={1.5}
        />
      </div>

      <p className="text-base leading-relaxed text-zinc-700">
        {project.summary}
      </p>

      <div className="flex flex-wrap gap-2 font-mono text-xs text-zinc-600">
        {project.stack.map((tech, i) => (
          <span key={tech} className="flex items-center gap-2">
            {i > 0 && <span className="text-zinc-400">·</span>}
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap gap-2 border-t border-zinc-200 pt-4">
        {project.tags.map((tag) => (
          <Tag key={tag}>[{tag}]</Tag>
        ))}
      </div>
    </Link>
  );
}
