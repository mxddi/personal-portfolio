import type { Metadata } from "next";
import { recognitionCategories, getAwardsByCategory } from "@/lib/data/recognition";
import { AwardCard } from "@/components/recognition/award-card";
import { PageIntro } from "@/components/ui/page-intro";

export const metadata: Metadata = {
  title: "Recognition — Madaly G",
  description:
    "Grants, scholarships, academic honors, competitive event placements, and service awards.",
};

export default function RecognitionPage() {
  const sections = recognitionCategories
    .map((category) => ({
      category,
      items: getAwardsByCategory(category.slug),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <div className="container-page py-16 sm:py-20">
      <PageIntro
        eyebrow="Honors & Awards"
        title="Recognition"
        description="Selected grants, scholarships, academic honors, competitive event placements, and service awards."
      />

      <div className="mt-12 flex flex-col gap-14">
        {sections.map(({ category, items }) => (
          <section key={category.slug} className="flex flex-col gap-1">
            <div className="border-b border-zinc-200 pb-4 dark:border-zinc-800">
              <h2 className="text-xl font-medium tracking-tight text-zinc-950 sm:text-2xl dark:text-zinc-50">
                {category.label}
              </h2>
            </div>

            <div className="mt-2 flex flex-col">
              {items.map((award) => (
                <AwardCard key={award.slug} award={award} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
