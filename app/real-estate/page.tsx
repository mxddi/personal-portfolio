import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/page-intro";
import { ComingSoon } from "@/components/ui/coming-soon";

export const metadata: Metadata = {
  title: "Real Estate — Madaly G",
  description: "A new section, currently under construction.",
};

export default function RealEstatePage() {
  return (
    <div className="container-page py-16 sm:py-20">
      <PageIntro eyebrow="Coming Soon" title="Real Estate" />
      <ComingSoon />
    </div>
  );
}
