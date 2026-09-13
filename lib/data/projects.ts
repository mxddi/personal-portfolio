import { Project, ProjectCategorySlug } from "@/lib/types";

export const projects: Project[] = [
  // ---------- Software Engineering (T-Mobile, 2020–2023) ----------
  {
    slug: "tmo-go-iot-bike-security",
    title: "T-Mo Go — IoT Bike Security & Tracking",
    categories: ["software-engineering"],
    summary:
      "Lead backend developer for a T-Mobile DevEdge hackathon build: a geofenced anti-theft system that flags a bike as stolen the instant it leaves a locked zone, streams live location to a companion iOS app, and fires an automated SMS alert to the rider.",
    stack: [
      "Python",
      "AWS Lambda",
      "DynamoDB",
      "Serverless Framework",
      "Twilio",
      "Bluetooth",
    ],
    tags: ["Full-Stack", "IoT"],
    date: "2022-06-01",
    classified: true,
  },
  {
    slug: "iot-telemetry-health-probe",
    title: "IoT Telemetry Health Probe",
    categories: ["software-engineering"],
    summary:
      "A diagnostic web tool that decodes raw hex-string UDP payloads from field devices into readable telemetry — temperature, battery level, speed, status — and surfaces live service health, cutting down the team's manual testing time.",
    stack: ["JavaScript", "Python", "UDP", "REST"],
    tags: ["Backend", "Developer Tools"],
    date: "2020-11-01",
    classified: true,
  },
  {
    slug: "smart-home-device-control-app",
    title: "Smart Home Device Control App",
    categories: ["software-engineering"],
    summary:
      "React Native front-end for controlling mock smart-home devices — locks, bulbs — over a shared IoT API, with animated on/off interactions and live device state fetched on mount.",
    stack: ["React Native", "JavaScript", "REST API"],
    tags: ["Full-Stack", "Mobile"],
    date: "2021-06-01",
    classified: true,
  },
  {
    slug: "wifi-significant-location-classifier",
    title: "Significant-Location Classifier from Wi-Fi Scans",
    categories: ["software-engineering"],
    summary:
      "Prototyped a way to infer whether a scanned Wi-Fi network corresponds to home, work, or school by clustering visit frequency and time-of-day patterns — aimed at reducing noisy location pings without extra user input.",
    stack: ["Python", "Clustering", "Decision Trees", "Pandas"],
    tags: ["Data", "Machine Learning"],
    date: "2022-08-01",
    classified: true,
  },
  {
    slug: "timeslice-ai-scheduling-app",
    title: "TimeSlice — AI Daily Planning Assistant",
    categories: ["software-engineering"],
    summary:
      "Built overnight at TechTogether Seattle: a mobile app that slices the day into 'time blocks' and uses machine learning to learn routine patterns, suggest Pomodoro-style breaks, and auto-reschedule the rest of the day when a task runs long. Won the 'Planting the Seed for Growth' award.",
    stack: [
      "Python",
      "Flask",
      "SQLAlchemy",
      "FlutterFlow",
      "JavaScript",
      "Figma",
      "Azure",
    ],
    tags: ["AI", "Full-Stack", "Mobile", "Data"],
    date: "2023-05-14",
    links: {
      repo: "https://github.com/madalyg/TimeSlice",
      writeup: "https://devpost.com/software/timeslice",
    },
  },
  {
    slug: "synapse-ai-task-prioritization",
    title: "Synapse — AI-Powered Automatic Task Prioritization",
    categories: ["software-engineering"],
    summary:
      "A web app that bridges daily to-do lists and long-term goals: tasks pulled from Google Calendar/Tasks are auto-scored on urgency and goal-alignment, plotted on a live Eisenhower Matrix, and paired with a Groq-powered AI coach that flags misaligned tasks and suggests schedule adjustments.",
    stack: [
      "React",
      "Groq API",
      "Google Calendar API",
      "Google Tasks API",
      "Vercel",
    ],
    tags: ["AI", "Full-Stack", "Mobile", "Data"],
    date: "2026-04-25",
    links: {
      repo: "https://github.com/madalyg/Synapse3",
      demo: "https://synapse3-topaz.vercel.app",
    },
  },
  {
    slug: "rocket-operation-gnc-sim",
    title: "Rocket Operation GNC Sim",
    categories: ["software-engineering", "computational-physics"],
    summary:
      "Designing a C++ foundation for simulating rocket flight dynamics using custom 3D vector mathematics, including position, gravity, forces, and navigation-related calculations.",
    stack: ["C++", "Vector3D", "Docker"],
    tags: ["Physics Simulation", "Numerical Methods", "GNC"],
    date: "2026-09-01",
    ongoing: true,
    links: {
      repo: "https://github.com/madalyg/rocket_operation_sim",
    },
  },

  {
    slug: "grand-pre-crop-planning-system",
    title:
      "Grand Pré, Les 3 Jardins — Crop Planning & Resource Allocation System",
    categories: ["software-engineering"],
    summary:
      "In rural France I designed a custom Excel-based crop management system for a working farm's greenhouse: a color-coded grid modeling every planting bed by crop category (leaf, root, fruit, aromatic) and status (seeded, planted, completed) to optimize planting schedules, yield tracking, and resource allocation across dozens of concurrent rotations.",
    stack: ["Microsoft Excel", "Conditional Formatting", "Data Modeling"],
    tags: ["Volunteer", "Data", "Systems Design"],
    date: "2022-09-01",
    image: "/projects/grand-pre-crop-plan.jpg",
    imageWidth: 1600,
    imageHeight: 1130,
    links: {
      writeup: "/projects/grand-pre-crop-plan.xlsx",
      writeupLabel: "See the Program",
    },
  },

  // ---------- Computational Physics ----------
  {
    slug: "dr16q-ehvo-quasar-pipeline",
    title: "Extremely High Velocity Quasar Outflow Research Pipeline",
    categories: ["computational-physics"],
    summary:
      "My previous working branch of the UW Bothell quasar research group's collaborative codebase: Python tools for normalizing raw SDSS spectra, flagging absorption troughs, and running cross-correlation, redshift, and variability analyses to isolate extremely high-velocity outflow (EHVO) quasars from the DR16 sample. Note: Most up to date codebase is hosted on a private repository, commits to be merged later.",
    stack: [
      "Python",
      "NumPy",
      "Pandas",
      "Matplotlib",
      "SDSS Spectra",
      "Version Control",
      "Software Documentation",
    ],
    tags: ["Astrophysics", "Research Software", "Numerical Methods"],
    date: "2025-11-01",
    ongoing: true,
    links: {
      repo: "https://github.com/paolaUWB/DR16Q/tree/Maddi",
    },
  },
  {
    slug: "monte-carlo-simulations-python",
    title: "Monte Carlo Simulations in Python",
    categories: ["computational-physics"],
    summary:
      "Two Monte Carlo case studies built from first principles: modeling energy deposition in a CERN ATLAS-style calorimeter cell via inverse transform sampling, and simulating a year of stock price paths with geometric Brownian motion.",
    stack: ["Python", "NumPy", "Matplotlib"],
    tags: ["Physics Simulation", "Numerical Methods"],
    date: "2026-02-01",
    image: "/projects/monte-carlo-cover.png",
    imageWidth: 990,
    imageHeight: 724,
    links: {
      writeup: "/projects/monte-carlo-simulations-in-python.pdf",
    },
  },
  {
    slug: "quantum-eraser-superposition",
    title: "Quantum Eraser: Erasing & Restoring Which-Path Information",
    categories: ["computational-physics"],
    summary:
      "Built a polarizer-and-double-slit setup to test at what polarization angle a photon's which-path information is erased, mapping interference-fringe visibility against filter angle to pinpoint the laser's dominant polarization axis.",
    stack: [
      "Optics Bench",
      "High-Energy Laser",
      "Polarizing Filter",
      "Photometer",
    ],
    tags: ["Quantum Mechanics", "Optics"],
    date: "2023-06-01",
    image: "/projects/quantum-eraser-demo.jpg",
    imageWidth: 1600,
    imageHeight: 1257,
  },
  {
    slug: "measuring-plancks-constant-leds",
    title: "Measuring Planck's Constant Using LEDs",
    categories: ["computational-physics"],
    summary:
      "Derived Planck's constant from scratch by measuring the threshold voltage of four LED colors and relating the slope of voltage-vs-frequency to h — landing within 3.7% of the accepted value using a low-cost breadboard circuit.",
    stack: ["Breadboard Circuit", "Multimeter", "Linear Regression"],
    tags: ["Quantum Mechanics", "Experimental Physics"],
    date: "2024-03-14",
    image: "/projects/measuring-plancks-constant-leds-preview.png",
    cardImage: "/projects/measuring-plancks-constant-leds-preview.png",
    imageWidth: 1024,
    imageHeight: 650,
    links: {
      writeup: "/projects/measuring-plancks-constant-leds.pdf",
    },
  },

  // ---------- Electrical Engineering ----------
  {
    slug: "portable-electric-cloud-chamber",
    title: "Portable Electric Cloud Chamber",
    categories: ["electrical-engineering"],
    summary:
      "Designed and built a reusable, dry-ice-free cloud chamber using eight cascaded Peltier thermoelectric coolers and a closed-loop water cooling system, sustaining the −26°C gradient needed to visualize ionizing radiation tracks. Partnered withe mechanical engineer Branden Floyd who taught me how to solder, 3D print, and design the cooling system. Invited to present the device to the college's Board of Trustees, made available to students as a public demonstration tool, and awarded Outstanding STEM Project.",
    stack: ["Fusion 360 CAD", "Peltier TECs", "DC Power Systems", "3D Printing"],
    tags: [
      "Electrical Engineering",
      "Hardware",
      "Wiring",
      "Soldering",
      "Hardware-Electrical Interfacing",
    ],
    date: "2024-03-13",
    image: "/projects/cloud-chamber.jpg",
    imageWidth: 1600,
    imageHeight: 1200,
    links: {
      writeup:
        "https://www.linkedin.com/posts/madalygregory_moving-into-my-last-year-of-undergraduate-ugcPost-7398862499166662656-3Mqc",
    },
  },
  {
    slug: "lifi-optical-data-transmission",
    title: "LiFi: Transmitting Data via Light Waves",
    categories: ["electrical-engineering"],
    summary:
      "Built a laser-and-phototransistor link that pulses binary-encoded text between two Arduinos over light, then calculated transmission accuracy against distance from 50cm to 300cm.",
    stack: ["Arduino", "Laser Diode", "Phototransistor", "Serial Comms"],
    tags: ["Electrical Engineering", "Optical Communication"],
    date: "2023-11-01",
    image: "/projects/lifi-poster.jpg",
    imageWidth: 1600,
    imageHeight: 1280,
    cardImage: "/projects/life-card.jpg",
  },
  {
    slug: "quantum-rng-photoresistor-circuit",
    title: "Quantum Random Number Generator Circuit",
    categories: ["electrical-engineering"],
    summary:
      "Designed a beamsplitter-and-photoresistor circuit intended to harvest true randomness from vacuum fluctuations, comparing voltage readings across two polarized paths to output a binary digit per Arduino cycle.",
    stack: ["Arduino", "Beamsplitter", "Photoresistors", "3D-Printed Mounts"],
    tags: ["Electrical Engineering", "Embedded Systems"],
    date: "2023-11-29",
    image: "/projects/random-digit-card.jpg",
    imageWidth: 1024,
    imageHeight: 768,
    links: {
      writeup: "/projects/quantum-rng-report.pdf",
    },
  },
];

export function projectInCategory(
  project: Project,
  category: ProjectCategorySlug
) {
  return project.categories.includes(category);
}

export function getProjectHref(
  project: Project,
  category?: ProjectCategorySlug
) {
  const categorySlug = category ?? project.categories[0];
  return `/projects/${categorySlug}/${project.slug}`;
}

export function getProjectsByCategory(category: string) {
  const slug = category as ProjectCategorySlug;
  return projects
    .filter((p) => projectInCategory(p, slug))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getProjectBySlug(category: string, slug: string) {
  const categorySlug = category as ProjectCategorySlug;
  return projects.find(
    (p) => p.slug === slug && projectInCategory(p, categorySlug)
  );
}

export function getAllTags(category?: string) {
  const categorySlug = category as ProjectCategorySlug | undefined;
  const source = categorySlug
    ? projects.filter((p) => projectInCategory(p, categorySlug))
    : projects;
  const tags = new Set<string>();
  source.forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return Array.from(tags).sort();
}
