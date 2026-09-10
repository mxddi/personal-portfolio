export type ProjectCategorySlug =
  | "software-engineering"
  | "computational-physics"
  | "electrical-engineering";

export interface ProjectCategory {
  slug: ProjectCategorySlug;
  label: string;
  shortLabel: string;
  description: string;
  pattern: "circuit" | "orbit" | "terminal";
}

export interface Project {
  slug: string;
  title: string;
  category: ProjectCategorySlug;
  summary: string;
  stack: string[];
  tags: string[];
  date: string; // ISO string, display formatted (start date if ongoing)
  ongoing?: boolean; // true if the project/research is still in progress
  image?: string; // optional real photo/poster, shown full-size on the detail page (and as card thumbnail if `cardImage` is not set)
  imageWidth?: number; // intrinsic pixel width of `image`, for correct aspect ratio on the detail page
  imageHeight?: number; // intrinsic pixel height of `image`, for correct aspect ratio on the detail page
  cardImage?: string; // optional override image for the project card thumbnail (falls back to `image` when absent)
  classified?: boolean; // internal/confidential employer work — no public repo to link
  links?: {
    repo?: string;
    demo?: string;
    writeup?: string;
    writeupLabel?: string; // overrides the default "Read the Write-Up" link text
  };
}

export type RecognitionCategorySlug =
  | "grants"
  | "scholarships"
  | "academic"
  | "competitive"
  | "volunteering"
  | "creative";

export interface RecognitionCategory {
  slug: RecognitionCategorySlug;
  label: string;
  description: string;
}

export interface Award {
  slug: string;
  title: string;
  issuer: string;
  date: string; // ISO string, display formatted
  category: RecognitionCategorySlug;
  association?: string; // e.g. affiliated institution
  summary?: string;
  link?: {
    label: string;
    href: string;
  };
}

export interface ResearchPaper {
  slug: string;
  title: string;
  summary: string;
  date: string; // start date if ongoing
  ongoing?: boolean; // true if research is still in progress
  venue?: string;
  tags: string[];
  fileUrl?: string;
  pattern: "circuit" | "orbit" | "terminal";
}
