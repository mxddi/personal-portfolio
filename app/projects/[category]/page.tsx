import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { categories, getCategory } from "@/lib/data/categories";
import { getAllTags, getProjectsByCategory } from "@/lib/data/projects";
import { ProjectFilters } from "@/components/projects/project-filters";

interface PageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return {
    title: `${category.label} Projects — Madaly G`,
    description: category.description,
  };
}

export default async function CategoryProjectsPage({ params }: PageProps) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const projects = getProjectsByCategory(category.slug);
  const tags = getAllTags(category.slug);

  return (
    <div className="container-page py-16 sm:py-20">
      <Link
        href="/projects"
        className="group inline-flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-zinc-600 transition-colors duration-200 hover:text-accent"
      >
        <ArrowLeft
          className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
          strokeWidth={1.5}
        />
        All categories
      </Link>

      <div className="mt-6 flex flex-col gap-4 border-b border-zinc-200 pb-10">
        <div className="flex items-center gap-3 font-mono text-sm uppercase tracking-[0.2em] text-accent">
          <span className="h-px w-6 bg-accent/60" />
          Category
        </div>
        <h1 className="text-4xl font-medium tracking-tight text-zinc-950 sm:text-5xl">
          {category.label}
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-zinc-700 sm:text-lg">
          {category.description}
        </p>
      </div>

      <div className="mt-10">
        <ProjectFilters projects={projects} tags={tags} />
      </div>
    </div>
  );
}
