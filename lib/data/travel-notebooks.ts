export interface TravelNotebook {
  /** Must match the `Location Name` column in `public/visited_locations.csv` exactly. */
  location: string;
  title: string;
  /** Public path to the PDF, rendered page-by-page in the globe's NotebookViewer. */
  pdfUrl?: string;
  /** When set (and no pdfUrl), the globe notebook icon links here instead of opening a PDF. */
  href?: string;
}

export type PdfTravelNotebook = TravelNotebook & { pdfUrl: string };

export function isPdfNotebook(
  notebook: TravelNotebook
): notebook is PdfTravelNotebook {
  return Boolean(notebook.pdfUrl);
}

export const travelNotebooks: TravelNotebook[] = [
  {
    location: "Leon, Spain",
    pdfUrl: "/notebooks/leon-spain.pdf",
    title:
      "In the Shadow of Alignment: Beyond the Melodrama of Traditional Depictions of a Total Solar Eclipse",
  },
  {
    location: "Leon, Spain",
    pdfUrl: "/notebooks/leon-spain-2.pdf",
    title: "Ambiguity, Eclipses, and Hidden Power in Paradise Lost and León",
  },
  {
    location: "Paris, France",
    pdfUrl: "/notebooks/paris-france.pdf",
    title: "The Life and Work of Dr. Roger Penrose",
  },
  {
    location: "Lisbon, Portugal",
    pdfUrl: "/notebooks/lisbon-portugal.pdf",
    title: "Observations — Lisbon",
  },
  {
    location: "Tokyo, Japan",
    pdfUrl: "/notebooks/tokyo-japan.pdf",
    title: "Observations — Tokyo",
  },
  {
    location: "Denver, Colorado",
    href: "/research#extreme-quasar-outflows-lisa",
    title:
      "Developing New Computational Tools to Identify the Most Extreme Outflows in the Universe",
  },
  {
    location: "Washington D.C.",
    href: "/research#extreme-quasar-outflows-lisa",
    title:
      "Developing New Computational Tools to Identify the Most Extreme Outflows in the Universe",
  },
];

/** A location can have more than one notebook — the viewer lets visitors cycle between them. */
export function getNotebooksForLocation(
  locationName: string
): TravelNotebook[] {
  return travelNotebooks.filter((n) => n.location === locationName);
}
