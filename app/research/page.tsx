import type { Metadata } from "next";
import { researchPapers } from "@/lib/data/research";
import { ResearchCard } from "@/components/research/research-card";
import { ResearchHashScroll } from "@/components/research/research-hash-scroll";
import { PageIntro } from "@/components/ui/page-intro";

export const metadata: Metadata = {
  title: "Research — Madaly G",
  description:
    "Research papers and technical writeups spanning computational physics, electrical engineering, and machine learning.",
};

export default function ResearchPage() {
  return (
    <div className="container-page py-16 sm:py-20">
      <ResearchHashScroll />
      <PageIntro
        eyebrow="Published & Ongoing"
        title="Research"
        description= "Selected writeups from coursework, independent study, and collaboration in astrophysics."
      />

      <div className="mt-12 flex flex-col gap-4">
        {researchPapers.map((paper) => (
          <ResearchCard key={paper.slug} paper={paper} />
        ))}
      </div>
    </div>
  );
}
