export interface TravelGallery {
  slug: string;
  location: string;
  images: string[];
}

function buildImages(slug: string, count: number) {
  return Array.from(
    { length: count },
    (_, i) => `/travel/${slug}/${String(i + 1).padStart(2, "0")}.jpg`
  );
}

export const travelGalleries: TravelGallery[] = [
  {
    slug: "denver-colorado",
    location: "Denver, Colorado",
    images: buildImages("denver-colorado", 7),
  },
  {
    slug: "washington-dc",
    location: "Washington D.C.",
    images: buildImages("washington-dc", 10),
  },
  {
    slug: "sintra-portugal",
    location: "Sintra, Portugal",
    images: buildImages("sintra-portugal", 6),
  },
  {
    slug: "astorga-spain",
    location: "Astorga, Spain",
    images: buildImages("astorga-spain", 2),
  },
  {
    slug: "leon-spain",
    location: "Leon, Spain",
    images: buildImages("leon-spain", 18),
  },
  {
    slug: "chiang-mai-thailand",
    location: "Chiang Mai, Thailand",
    images: buildImages("chiang-mai-thailand", 8),
  },
  {
    slug: "rome-italy",
    location: "Rome, Italy",
    images: buildImages("rome-italy", 6),
  },
  {
    slug: "lisbon-portugal",
    location: "Lisbon, Portugal",
    images: buildImages("lisbon-portugal", 5),
  },
  {
    slug: "shkoder-albania",
    location: "Shkoder, Albania",
    images: buildImages("shkoder-albania", 4),
  },
  {
    slug: "los-angeles-california",
    location: "Los Angeles, California",
    images: buildImages("los-angeles-california", 2),
  },
  {
    slug: "ybbs-an-der-donau-austria",
    location: "Ybbs an der Donau, Austria",
    images: buildImages("ybbs-an-der-donau-austria", 1),
  },
  {
    slug: "segovia-spain",
    location: "Segovia, Spain",
    images: buildImages("segovia-spain", 1),
  },
  {
    slug: "salamanca-spain",
    location: "Salamanca, Spain",
    images: buildImages("salamanca-spain", 1),
  },
  {
    slug: "madrid-spain",
    location: "Madrid, Spain",
    images: buildImages("madrid-spain", 1),
  },
  {
    slug: "fethiye-turkey",
    location: "Fethiye, Turkey",
    images: buildImages("fethiye-turkey", 1),
  },
];

export function getTravelGalleryBySlug(slug: string) {
  return travelGalleries.find((g) => g.slug === slug);
}
