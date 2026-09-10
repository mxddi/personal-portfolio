import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { categories, getCategory } from "@/lib/data/categories";
import { getProjectBySlug, projects } from "@/lib/data/projects";
import { formatDate } from "@/lib/utils";
import { Tag } from "@/components/ui/tag";

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

export function generateStaticParams() {
  return projects.flatMap((p) =>
    p.categories.map((category) => ({ category, slug: p.slug }))
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category: categorySlug, slug } = await params;
  const project = getProjectBySlug(categorySlug, slug);
  if (!project) return {};
  return {
    title: `${project.title} — Madaly G`,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { category: categorySlug, slug } = await params;
  const category = getCategory(categorySlug);
  const project = getProjectBySlug(categorySlug, slug);
  if (!category || !project) notFound();

  return (
    <div className="container-page py-16 sm:py-20">
      <Link
        href={`/projects/${category.slug}`}
        className="group inline-flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-zinc-700 transition-colors duration-200 hover:text-accent dark:text-zinc-300"
      >
        <ArrowLeft
          className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
          strokeWidth={1.5}
        />
        {category.label}
      </Link>

      <div className="mt-6 flex flex-col gap-4 border-b border-zinc-200 pb-10 dark:border-zinc-800">
        <div className="flex items-center gap-3 font-mono text-sm uppercase tracking-[0.2em] text-accent">
          <span className="h-px w-6 bg-accent/60" />
          Category
        </div>
        <h1 className="max-w-3xl text-4xl font-medium tracking-tight text-zinc-950 sm:text-5xl dark:text-zinc-50">
          {project.title}
        </h1>
        <div className="flex items-center gap-2 font-mono text-sm text-zinc-700 dark:text-zinc-300">
          <time dateTime={project.date}>{formatDate(project.date)}</time>
          {project.ongoing && (
            <span className="rounded-sm border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-xs uppercase tracking-widest text-accent-dim">
              Ongoing
            </span>
          )}
          {project.classified && (
            <span className="text-zinc-500 dark:text-zinc-500">
              | Classified
            </span>
          )}
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_280px]">
        <div className="flex flex-col gap-8">
          {project.image && (
            <div className="relative flex w-full items-center justify-center overflow-hidden border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-900">
              <Image
                src={project.image}
                alt={project.title}
                width={project.imageWidth ?? 1600}
                height={project.imageHeight ?? 1000}
                className="h-auto max-h-[640px] w-auto max-w-full object-contain"
                sizes="(min-width: 1024px) 700px, 100vw"
                priority
              />
            </div>
          )}

          <p className="max-w-2xl text-base leading-relaxed text-zinc-700 sm:text-lg dark:text-zinc-300">
            {project.summary}
          </p>

          <div className="flex flex-wrap gap-2 border-t border-zinc-200 pt-6 dark:border-zinc-800">
            {project.tags.map((tag) => (
              <Tag key={tag}>[{tag}]</Tag>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-zinc-200 pt-6 dark:border-zinc-800 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
          {project.links?.writeup && (
            <Link
              href={project.links.writeup}
              target="_blank"
              rel="noreferrer"
              className="group mb-4 inline-flex items-center gap-1.5 border-b border-zinc-200 pb-4 font-mono text-xs uppercase tracking-widest text-accent-dim transition-colors duration-200 hover:text-accent dark:border-zinc-800"
            >
              {project.links.writeupLabel ?? "Read the Write-Up"}
              <ArrowUpRight
                className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.5}
              />
            </Link>
          )}

          <span className="font-mono text-xs uppercase tracking-widest text-zinc-600">
            Stack
          </span>
          <ul className="flex flex-col gap-2 font-mono text-sm text-zinc-800 dark:text-zinc-200">
            {project.stack.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
