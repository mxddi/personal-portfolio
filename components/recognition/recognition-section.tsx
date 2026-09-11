import { recognitionCategories, getAwardsByCategory } from "@/lib/data/recognition";
import { AwardCard } from "@/components/recognition/award-card";
import { PageIntro } from "@/components/ui/page-intro";

export function RecognitionSection() {
  const sections = recognitionCategories
    .map((category) => ({
      category,
      items: getAwardsByCategory(category.slug),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <>
      <PageIntro
        //eyebrow="Honors & Awards"
        title="Selected Recognition"
        titleClassName="text-3xl sm:text-4xl"
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
    </>
  );
}
