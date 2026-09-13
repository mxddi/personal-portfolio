import { Award, RecognitionCategory } from "@/lib/types";

export const recognitionCategories: RecognitionCategory[] = [
  {
    slug: "grants",
    label: "Grants & Fellowships",
    description: "Funding awarded to support research and conference travel.",
  },
  {
    slug: "scholarships",
    label: "Scholarships",
    description: "Merit- and need-based funding for undergraduate study.",
  },
  {
    slug: "academic",
    label: "Academic Honors",
    description: "Recognition for coursework, GPA, and departmental standing.",
  },
  {
    slug: "competitive",
    label: "Competitive Events",
    description: "Placements from hackathons and competitions.",
  },
  {
    slug: "volunteering",
    label: "Volunteering & Service",
    description: "Recognition for service contributions to the field.",
  },
  {
    slug: "creative",
    label: "Creative & Other",
    description: "Recognition outside the technical track.",
  },
];

export const awards: Award[] = [
  // ---------- Grants & Fellowships ----------
  {
    slug: "nasa-sura-cresst-travel-grant",
    title: "NASA-SURA CRESST II Travel Grant — 16th International LISA Symposium",
    issuer: "NASA",
    date: "2026-04-01",
    category: "grants",
    association: "University of Washington Bothell",
    summary:
      "Awarded funding to present at the 16th International LISA Symposium in College Park, Maryland, in support of the future Laser Interferometer Space Antenna collaboration between NASA and ESA. Shared work on automating the identification of extremely high velocity quasar outflows at the highest velocity limit studied to date, with an international delegation of researchers.",
  },

  // ---------- Scholarships ----------
  {
    slug: "washington-state-opportunity-scholar",
    title: "Washington State Opportunity Scholar (Baccalaureate)",
    issuer: "Washington State Opportunity Scholarship",
    date: "2021-04-01",
    category: "scholarships",
    summary:
      "Granted $22,500 in individual funding for pursuing a B.S. in a STEM field, as a first generation student. Awarded based on need, merit and commitment to advancing the future of STEM.",
    link: {
      label: "LinkedIn Post",
      href: "https://www.linkedin.com/posts/madalygregory_as-the-first-in-my-family-to-pursue-a-college-share-6781435061943226368-Y6Qm",
    },
  },

  // ---------- Academic Honors ----------
  {
    slug: "sigma-pi-sigma",
    title: "Sigma Pi Sigma — National Physics Honor Society",
    issuer: "Sigma Pi Sigma Honors Society, American Institute of Physics (AIP)",
    date: "2026-04-01",
    category: "academic",
    association: "University of Washington Bothell",
    summary:
      "Inducted into the national physics honor society: membership is restricted to top-ranking students who demonstrate high standards of scholarship, professional merit, and a dedication to the advancement of physics.",
  },
  {
    slug: "deans-list",
    title: "Dean's List (3.5+ Annual GPA)",
    issuer: "University of Washington",
    date: "2026-03-01",
    category: "academic",
    association: "University of Washington Bothell",
  },
  {
    slug: "outstanding-stem-project",
    title: "Outstanding STEM Project — Portable Electric Cloud Chamber",
    issuer: "Edmonds College",
    date: "2024-03-01",
    category: "academic",
    summary:
      "Recognized for co-designing a reusable, dry-ice-free cloud chamber; invited to present the device to the college's Board of Trustees and made it available to students as a public demonstration tool.",
  },
  /*{
    slug: "ap-scholar-with-distinction",
    title: "AP Scholar with Distinction",
    issuer: "College Board",
    date: "2021-08-01",
    category: "academic",
    summary:
      "Recognizes exemplary college-level achievement for attaining an average score of at least 3.5 on all AP exams taken and scores of 3 or higher on five or more of these exams.",
  },*/
  {
    slug: "presidents-award-educational-excellence",
    title: "President's Award for Educational Excellence",
    issuer: "U.S. Department of Education",
    date: "2021-06-01",
    category: "academic",
  },

  // ---------- Competitive Events ----------
  {
    slug: "techtogether-1st-place-hackathon",
    title: "1st Place Hackathon Solution — TimeSlice",
    issuer: "TechTogether 2023 Seattle",
    date: "2023-05-01",
    category: "competitive",
    summary:
      "Developed the concept and prototype overnight for an AI-assisted daily planner app built in Python and JavaScript. TimeSlice helps college students, professionals, and neurodivergent individuals with daily scheduling by recognizing patterns in routines and habits over time.",
    link: {
      label: "Devpost",
      href: "https://devpost.com/software/timeslice",
    },
  },
  {
    slug: "fbla-8th-nationals-psa",
    title: "8th Place Nationals — Public Service Announcement",
    issuer: "Future Business Leaders of America - Phi Beta Lambda",
    date: "2020-01-01",
    category: "competitive",
    summary:
      "Recognized for a digital spoken presentation on the importance of financial literacy for youth via a filmed Public Service Announcement.",
  },
  /*{
    slug: "fbla-business-achievement-future-level",
    title: "Business Achievement Award — Future Level",
    issuer: "Future Business Leaders of America - Phi Beta Lambda",
    date: "2020-01-01",
    category: "competitive",
    summary:
      "Nationally recognized for completing a series of achievements focused on service, education, personal progress, and chapter growth.",
  }, */
  // ---------- Volunteering & Service ----------
  {
    slug: "ieee-outstanding-service-award",
    title: "Outstanding Service Award",
    issuer: "IEEE New Era AI World Leaders Summit",
    date: "2025-12-01",
    category: "volunteering",
    association: "University of Washington Bothell",
  }
];

export function getAwardsByCategory(category: string) {
  return awards
    .filter((a) => a.category === category)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
