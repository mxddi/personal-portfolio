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
    images: buildImages("washington-dc", 9),
  },
  {
    slug: "sintra-portugal",
    location: "Sintra, Portugal",
    images: buildImages("sintra-portugal", 7),
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
    images: buildImages("chiang-mai-thailand", 12),
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
    images: buildImages("shkoder-albania", 18),
  },
  {
    slug: "los-angeles-california",
    location: "Los Angeles, California",
    images: [
      
    ],
  },
  {
    slug: "ybbs-an-der-donau-austria",
    location: "Ybbs an der Donau, Austria",
    images: buildImages("ybbs-an-der-donau-austria", 2),
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
    images: [
      "/travel/fethiye-turkey/01.jpg",
      "/travel/fethiye-turkey/02.jpg",
      "/travel/fethiye-turkey/03.jpg",
      "/travel/fethiye-turkey/04.jpg",
      "/travel/fethiye-turkey/05.mp4",
      "/travel/fethiye-turkey/06.jpg",
      "/travel/fethiye-turkey/07.jpg",
      "/travel/fethiye-turkey/08.jpg",
      "/travel/fethiye-turkey/09.mp4",
      "/travel/fethiye-turkey/10.jpg",
      "/travel/fethiye-turkey/11.jpg",
      "/travel/fethiye-turkey/12.jpg",
      "/travel/fethiye-turkey/13.jpg",
      "/travel/fethiye-turkey/14.jpg",
      "/travel/fethiye-turkey/15.jpg",
      "/travel/fethiye-turkey/16.jpg",
      "/travel/fethiye-turkey/17.jpg",
      "/travel/fethiye-turkey/18.jpg",
      "/travel/fethiye-turkey/19.jpg"
    ],
  },
  {
    slug: "paris-france",
    location: "Paris, France",
    images: [
      "/travel/paris-france/01.jpg",
      "/travel/paris-france/02.jpg",
      "/travel/paris-france/03.jpg",
      "/travel/paris-france/04.mp4",
      "/travel/paris-france/05.jpg",
      "/travel/paris-france/06.jpg",
      "/travel/paris-france/07.jpg",
      "/travel/paris-france/08.jpg"
    ],
  },
  {
    slug: "zagreb-croatia",
    location: "Zagreb, Croatia",
    images: buildImages("zagreb-croatia", 1),
  },
  {
    slug: "landivy-france",
    location: "Landivy, France",
    images: buildImages("landivy-france", 10),
  },
];

export function getTravelGalleryBySlug(slug: string) {
  return travelGalleries.find((g) => g.slug === slug);
}
