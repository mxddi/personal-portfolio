import { ProjectCategory } from "@/lib/types";

export const categories: ProjectCategory[] = [
  {
    slug: "software-engineering",
    label: "Software Engineering",
    shortLabel: "Software",
    description:
      "Serverless backends, IoT integrations, and internal tooling built during three years at T-Mobile.",
    pattern: "terminal",
    index: "01",
  },
  {
    slug: "computational-physics",
    label: "Computational Physics",
    shortLabel: "Physics",
    description:
      "Rooted in physics.",
    pattern: "orbit",
    index: "02",
  },
  {
    slug: "electrical-engineering",
    label: "Electrical Engineering",
    shortLabel: "EE Systems",
    description:
      "Hands-on circuits and hardware builds.",
    pattern: "circuit",
    index: "03",
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}
