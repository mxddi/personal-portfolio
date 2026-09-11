import type { Metadata } from "next";
import { BioSection } from "@/components/recognition/bio-section";
import { RecognitionSection } from "@/components/recognition/recognition-section";

export const metadata: Metadata = {
  title: "Bio — Madaly G",
  description:
    "Background, interests, and selected grants, scholarships, academic honors, and awards.",
};

export default function BioPage() {
  return (
    <div className="container-page py-16 sm:py-20">
      <BioSection />

      <div className="mt-24 border-t border-zinc-200 pt-20 dark:border-zinc-800">
        <RecognitionSection />
      </div>
    </div>
  );
}
