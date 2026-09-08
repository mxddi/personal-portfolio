import type { Metadata } from "next";
import { categories } from "@/lib/data/categories";
import { CategoryTile } from "@/components/projects/category-tile";
import { PageIntro } from "@/components/ui/page-intro";

export const metadata: Metadata = {
  title: "Projects — Madaly G",
  description:
    "Technical projects spanning software engineering, computational physics, and electrical engineering.",
};

export default function ProjectsPage() {
  return (
    <div className="container-page py-16 sm:py-20">
      <PageIntro
        eyebrow="Selected Work"
        title="Projects"
        description="Three disciplines, documented in detail. Pick a category to see the full build log: tech/engineering stack, scope, and papers or repositories for each."
      />

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {categories.map((category) => (
          <CategoryTile key={category.slug} category={category} />
        ))}
      </div>
    </div>
  );
}
