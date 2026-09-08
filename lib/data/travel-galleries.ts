export interface TravelGallery {
  slug: string;
  location: string;
  images: string[];
}

export const travelGalleries: TravelGallery[] = [
  {
    slug: "denver-colorado",
    location: "Denver, Colorado",
    images: Array.from(
      { length: 7 },
      (_, i) => `/travel/denver-colorado/0${i + 1}.jpg`
    ),
  },
  {
    slug: "washington-dc",
    location: "Washington D.C.",
    images: Array.from(
      { length: 8 },
      (_, i) => `/travel/washington-dc/0${i + 1}.jpg`
    ),
  },
  {
    slug: "sintra-portugal",
    location: "Sintra, Portugal",
    images: Array.from(
      { length: 5 },
      (_, i) => `/travel/sintra-portugal/0${i + 1}.jpg`
    ),
  },
  {
    slug: "astorga-spain",
    location: "Astorga, Spain",
    images: Array.from(
      { length: 2 },
      (_, i) => `/travel/astorga-spain/0${i + 1}.jpg`
    ),
  },
];

export function getTravelGalleryBySlug(slug: string) {
  return travelGalleries.find((g) => g.slug === slug);
}
