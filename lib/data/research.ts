import { ResearchPaper } from "@/lib/types";

export const researchPapers: ResearchPaper[] = [
  {
    slug: "extreme-quasar-outflows-lisa",
    title:
      "Developing New Computational Tools to Identify the Most Extreme Outflows in the Universe",
    summary:
      "Built an automated Python pipeline that isolates extremely high velocity quasar outflows (> 20% the speed of light) from Lyman-alpha forest spectral data contamination by exploiting variability timescales across multi-epoch SDSS spectra, with a redshift-invariant autoencoder (SpenderQ) as a fallback for reconstructing the intrinsic quasar continuum. Awarded a fully-funded travel grant from NASA-SURA, sponsored by the NASA Goddard Space Flight Center, to present at the 16th International Laser Interferometer Space Antenna Symposium.",
    date: "2025-11-01",
    ongoing: true,
    venue:
      "16th International NASA-ESA LISA Symposium — poster, with Dr. Paola Rodriguez Hidalgo (UW Bothell) & Dr. Bryna Hazelton (UW eScience Institute)",
    tags: ["Astrophysics", "Machine Learning"],
    pattern: "orbit",
  },
  {
    slug: "leo-debris-risk-private-satellites",
    title:
      "Assessing the Risk of Low Earth Orbit Overcrowding Due to the Accelerating Private Satellite Industry",
    summary:
      "A computational modeling study of orbital debris accumulation risk as commercial satellite constellations scale, examining how current collision-avoidance and de-orbit policy holds up against projected launch cadences.",
    date: "2025-09-01",
    venue: "CROW Journal, Vol. 11",
    tags: ["Astrophysics", "Computational Modeling", "Aerospace"],
    pattern: "orbit",
  },
  {
    slug: "quantum-computing-deep-space-missions",
    title:
      "Quantum Computing as a Means of Drastically Improving Efficiency of Deep Space Missions",
    summary:
      "A research report examining where classical computation bottlenecks deep-space exploration — planetary classification, orbital calculation, and signal degradation over interplanetary distances — and evaluating quantum optimization algorithms, QKD, and entanglement-based teleportation as candidate replacements.",
    date: "2023-06-01",
    venue: "Edmonds College — Research Report",
    tags: ["Quantum Computing", "Aerospace"],
    pattern: "terminal",
  },
];

export function getResearchBySlug(slug: string) {
  return researchPapers.find((r) => r.slug === slug);
}
