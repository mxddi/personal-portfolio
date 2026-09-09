export interface Pillar {
  index: string;
  title: string;
  description: string;
  skills: string[];
  icon: "code" | "atom" | "cpu";
}

export const pillars: Pillar[] = [
  {
    index: "01",
    title: "Software Engineering",
    description:
      "Three years building consumer and internal software at T-Mobile: the full lifecycle, from architecture and algorithm design to CI/CD and deployment.",
    skills: [
      "Python / Java / TypeScript / C++",
      "AWS · PostgreSQL · Node.js · Flask",
      "React Native · Cross-Platform Apps",
      "Git / GitHub / Jira Workflows",
    ],
    icon: "code",
  },
  {
    index: "02",
    title: "Computational Physics",
    description:
      "Physics research applying machine learning and numerical methods to astrophysics data, from quasar outflows to orbital debris risk.",
    skills: [
      "Monte Carlo Analysis",
      "Signal Processing (FFT, Denoising)",
      "Convolutional Autoencoders",
      "NumPy / SciPy / Pandas",
    ],
    icon: "atom",
  },
  {
    index: "03",
    title: "Electrical & Hardware Systems",
    description:
      "Hands-on hardware design, from a custom designed cloud chamber to laser optics experiments — combining circuits, sensors, and data into complete physical systems.",
    skills: [
      "Electrical / Hardware Interfacing",
      "CAD (Fusion 360) · 3D Printing",
      "Laser Optics Experiments",
      "End-to-End System Design",
    ],
    icon: "cpu",
  },
];
