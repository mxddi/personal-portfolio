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
    location: "Paris, France",
    pdfUrl: "/notebooks/paris-france.pdf",
    title: "The Life and Work of Dr. Roger Penrose",
  },
];

export function getNotebookForLocation(
  locationName: string
): TravelNotebook | null {
  return travelNotebooks.find((n) => n.location === locationName) ?? null;
}
