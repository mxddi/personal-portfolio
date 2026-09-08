import type { Metadata } from "next";
import { GlobeExperience } from "@/components/world/globe-experience";

export const metadata: Metadata = {
  title: "World — Madaly G",
  description:
    "An interactive 3D globe of places I've traveled — tap a location to enter, and open the gallery where photos are available.",
};

export default function WorldPage() {
  return (
    <div className="w-full bg-[#04070a]">
      <GlobeExperience />
    </div>
  );
}
