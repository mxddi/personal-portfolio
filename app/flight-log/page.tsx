import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/page-intro";
import { ComingSoon } from "@/components/ui/coming-soon";

export const metadata: Metadata = {
  title: "Flight Log — Madaly G",
  description: "A new section, currently under construction.",
};

export default function FlightLogPage() {
  return (
    <div className="container-page py-16 sm:py-20">
      <PageIntro eyebrow="Coming Soon" title="Flight Log" />
      <ComingSoon />
    </div>
  );
}
