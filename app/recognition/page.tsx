import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BioSection } from "@/components/recognition/bio-section";
import { RecognitionSection } from "@/components/recognition/recognition-section";
import { BIO_PAGE_ENABLED } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Bio — Madaly G",
  description:
    "Background, interests, and selected grants, scholarships, academic honors, and awards.",
};

export default function BioPage() {
  if (!BIO_PAGE_ENABLED) {
    notFound();
  }

  return (
    <div className="container-page py-16 sm:py-20">
      <BioSection />

      <div className="mt-24 border-t border-zinc-200 pt-20 dark:border-zinc-800">
        <RecognitionSection />
      </div>
    </div>
  );
}
