export interface TravelNotebook {
  /** Must match the `Location Name` column in `public/visited_locations.csv` exactly. */
  location: string;
  /** Public path to the PDF, rendered page-by-page in the globe's NotebookViewer. */
  pdfUrl: string;
  title: string;
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
];

/** A location can have more than one notebook — the viewer lets visitors cycle between them. */
export function getNotebooksForLocation(
  locationName: string
): TravelNotebook[] {
  return travelNotebooks.filter((n) => n.location === locationName);
}
