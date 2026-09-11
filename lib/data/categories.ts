import { ProjectCategory } from "@/lib/types";

export const categories: ProjectCategory[] = [
  {
    slug: "software-engineering",
    label: "Software Engineering",
    shortLabel: "Software",
    description:
      "Serverless backends, IoT integrations, and internal tooling built during 2+ years at T-Mobile, as well as computational research collaboration and independent projects.",
    pattern: "terminal",
  },
  {
    slug: "computational-physics",
    label: "Computational Physics",
    shortLabel: "Physics",
    description:
      "Rooted in physics...",
    pattern: "orbit",
  },
  {
    slug: "electrical-engineering",
    label: "Electrical Engineering",
    shortLabel: "EE Systems",
    description:
      "Hands-on circuits and hardware builds :)",
    pattern: "circuit",
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}
