"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import Papa from "papaparse";
import { Eye, X } from "lucide-react";
import {
  AmbientLight,
  BackSide,
  Color,
  DirectionalLight,
  Mesh,
  MeshPhongMaterial,
} from "three";
import type { GlobeMethods } from "react-globe.gl";
import {
  getNotebooksForLocation,
  isPdfNotebook,
  type PdfTravelNotebook,
  type TravelNotebook,
} from "@/lib/data/travel-notebooks";

const Globe = dynamic(
  () => import("three").then(() => import("react-globe.gl")),
  { ssr: false }
);
const NotebookViewer = dynamic(
  () => import("@/components/world/notebook-viewer").then((m) => m.NotebookViewer),
  { ssr: false }
);

interface LocationPoint {
  name: string;
  lat: number;
  lng: number;
  galleryUrl: string | null;
  /** A location can have more than one — the viewer lets visitors cycle between them. */
  notebooks: TravelNotebook[];
}

const ACCENT = "#5eead4";
const ACCENT_DIM = "#2dd4bf";
const HIGHLIGHT = "#ff3864";
const GLOBE_ATMOSPHERE = "#5ad2d6";

const HIGHLIGHTED_LOCATIONS = new Set([
  "Washington D.C.",
  "Leon, Spain",
  "Denver, Colorado",
  "Paris, France",
]);

function isHighlightedLocation(location: LocationPoint) {
  return HIGHLIGHTED_LOCATIONS.has(location.name);
}

function toLocationPoint(d: object): LocationPoint {
  return d as LocationPoint;
}

function highlightRingColor(t: number) {
  const alpha = Math.pow(1 - t, 0.45);
  return `rgba(255, 65, 105, ${alpha})`;
}

export function GlobeExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const resumeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [locations, setLocations] = useState<LocationPoint[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [selected, setSelected] = useState<LocationPoint | null>(null);
  const [globeReady, setGlobeReady] = useState(false);
  const [openNotebooks, setOpenNotebooks] = useState<PdfTravelNotebook[] | null>(
    null
  );

  // Measure container for a responsive canvas.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setDimensions({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Load + parse the CSV of visited locations.
  useEffect(() => {
    Papa.parse("/visited_locations.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = (results.data as Record<string, string>[])
          .map((row) => {
            const lat = parseFloat(row["Latitude"]);
            const lng = parseFloat(row["Longitude"]);
            const name = row["Location Name"]?.trim();
            const galleryUrl = row["galleryUrl"]?.trim() || null;
            if (!name || Number.isNaN(lat) || Number.isNaN(lng)) return null;
            return {
              name,
              lat,
              lng,
              galleryUrl,
              notebooks: getNotebooksForLocation(name),
            } as LocationPoint;
          })
          .filter((row): row is LocationPoint => row !== null);
        setLocations(rows);
      },
      error: () => setLoadError(true),
    });
  }, []);

  // Auto-rotate, pausing gracefully while the visitor is interacting.
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe || !locations || !globeReady) return;

    globe.pointOfView({ lat: 20, lng: 10, altitude: 2.4 }, 0);

    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.enableDamping = true;

    const pause = () => {
      controls.autoRotate = false;
      if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    };
    const scheduleResume = () => {
      if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
      resumeTimeout.current = setTimeout(() => {
        controls.autoRotate = true;
      }, 3000);
    };

    controls.addEventListener("start", pause);
    controls.addEventListener("end", scheduleResume);

    return () => {
      controls.removeEventListener("start", pause);
      controls.removeEventListener("end", scheduleResume);
      if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations, globeReady]);

  const ringsData = useMemo(
    () => (locations ?? []).filter((d) => d.galleryUrl),
    [locations]
  );

  return (
    <div
      ref={containerRef}
      className="relative h-[calc(100svh-4rem)] min-h-0 w-full overflow-hidden bg-[#04070a]"
    >
      {dimensions.width > 0 && locations && (
        <Globe
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="/world/earth-night.jpg?v=2"
          bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundImageUrl="https://unpkg.com/three-globe/example/img/night-sky.png"
          globeCurvatureResolution={2}
          showAtmosphere
          atmosphereColor={GLOBE_ATMOSPHERE}
          atmosphereAltitude={0.21}
          onGlobeReady={() => {
            setGlobeReady(true);
            const globe = globeRef.current;
            if (!globe) return;

            // Render at a higher internal resolution than the display's
            // native pixel ratio (the library clamps to 2x by default) so
            // points that sit close together stay crisp and distinguishable
            // instead of anti-aliasing into a single blurry blob.
            const renderer = globe.renderer();
            renderer.setPixelRatio(
              Math.min(Math.max(window.devicePixelRatio, 2) * 1.5, 3)
            );
            renderer.toneMappingExposure = 1.12;

            const scene = globe.scene();
            const maxAniso = renderer.capabilities.getMaxAnisotropy();

            // Cool blue fill so baked land reads dark blue, not gray.
            scene.traverse((obj) => {
              if (obj instanceof AmbientLight) {
                obj.color.setHex(0x7a96b0);
                obj.intensity = Math.PI * 1.38;
              }
              if (obj instanceof DirectionalLight) {
                obj.color.setHex(0xdce6f0);
                obj.intensity = 0.38 * Math.PI;
              }
            });

            // Anisotropic filtering keeps continent edges from smearing
            // when the camera is zoomed in at a glancing angle.
            scene.traverse((obj) => {
              if (!(obj instanceof Mesh)) return;
              const material = obj.material;
              if (!(material instanceof MeshPhongMaterial) || !material.map) {
                return;
              }
              if (material.side === BackSide) return;

              material.map.anisotropy = maxAniso;
              material.map.needsUpdate = true;
              if (material.bumpMap) {
                material.bumpMap.anisotropy = maxAniso;
                material.bumpMap.needsUpdate = true;
              }

              material.emissiveMap = material.map;
              material.emissive = new Color(0xfff2dc);
              material.emissiveIntensity = 0.48;
              material.color = new Color(0x9eb4c8);
              material.shininess = 2;
              material.specular = new Color(0x111111);
              material.needsUpdate = true;
            });
          }}
          pointsData={locations}
          pointLat="lat"
          pointLng="lng"
          pointAltitude={0.01}
          pointResolution={32}
          pointRadius={(d: object) => {
            const loc = toLocationPoint(d);
            return loc.galleryUrl || loc.notebooks.length > 0 ? 0.45 : 0.28;
          }}
          pointColor={(d: object) => {
            const loc = toLocationPoint(d);
            if (isHighlightedLocation(loc)) return HIGHLIGHT;
            if (loc.galleryUrl || loc.notebooks.length > 0) return ACCENT;
            return ACCENT_DIM;
          }}
          pointLabel={(d: object) => toLocationPoint(d).name}
          onPointClick={(d: object) => setSelected(toLocationPoint(d))}
          ringsData={ringsData}
          ringLat="lat"
          ringLng="lng"
          ringColor={(d: object) => {
            const loc = toLocationPoint(d);
            if (isHighlightedLocation(loc)) {
              return highlightRingColor;
            }
            return (t: number) => `rgba(94, 234, 212, ${1 - t})`;
          }}
          ringMaxRadius={(d: object) =>
            isHighlightedLocation(toLocationPoint(d)) ? 4.6 : 3.2
          }
          ringPropagationSpeed={(d: object) =>
            isHighlightedLocation(toLocationPoint(d)) ? 1.35 : 2
          }
          ringRepeatPeriod={(d: object) =>
            isHighlightedLocation(toLocationPoint(d)) ? 1000 : 1400
          }
        />
      )}

      {!locations && !loadError && (
        <div className="absolute inset-0 flex items-center justify-center font-mono text-xs tracking-widest text-zinc-300">
          booting systems...
        </div>
      )}

      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center font-mono text-xs uppercase tracking-widest text-red-400">
          Could not load location data.
        </div>
      )}

      <div className="pointer-events-none absolute bottom-4 left-4 font-mono text-[11px] uppercase tracking-widest text-zinc-300">
        Drag to rotate · Scroll to zoom · Tap location to enter
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative m-4 w-full max-w-sm rounded-lg border border-white/10 bg-[#0a0f12]/95 p-6 shadow-2xl shadow-black/50"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              aria-label="Close"
              className="absolute right-3 top-3 text-zinc-300 transition-colors duration-200 hover:text-zinc-200"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>

            <div className="flex items-center gap-4 pr-6">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-medium tracking-tight text-zinc-50">
                  {selected.name}
                </h3>

                {selected.galleryUrl && (
                  <Link
                    href={selected.galleryUrl}
                    className="group mt-4 inline-flex items-center gap-2 border-t border-white/10 pt-4 font-mono text-xs uppercase tracking-widest text-teal-300 transition-colors duration-200 hover:text-teal-200"
                  >
                    <Eye
                      className="h-5 w-5 transition-transform duration-200 group-hover:scale-110"
                      strokeWidth={1.75}
                    />
                    More
                  </Link>
                )}
              </div>

              {selected.notebooks.length > 0 && (() => {
                const pdfNotebooks = selected.notebooks.filter(isPdfNotebook);
                const researchHref = selected.notebooks.find((n) => n.href)?.href;
                const notebookIcon = (
                  <Image
                    src="/notebook-icon.jpg"
                    alt=""
                    width={112}
                    height={112}
                    className="h-[112px] w-[112px] object-cover transition-transform duration-300 ease-precise group-hover:scale-105"
                  />
                );

                if (pdfNotebooks.length > 0) {
                  return (
                    <button
                      type="button"
                      onClick={() => setOpenNotebooks(pdfNotebooks)}
                      aria-label={`Open notebook for ${selected.name}`}
                      title="Open notebook"
                      className="group relative shrink-0 overflow-hidden rounded-md transition-transform duration-200"
                    >
                      {notebookIcon}
                    </button>
                  );
                }

                if (researchHref) {
                  return (
                    <Link
                      href={researchHref}
                      onClick={() => setSelected(null)}
                      aria-label={`View research for ${selected.name}`}
                      title="View research"
                      className="group relative shrink-0 overflow-hidden rounded-md transition-transform duration-200"
                    >
                      {notebookIcon}
                    </Link>
                  );
                }

                return null;
              })()}
            </div>
          </div>
        </div>
      )}

      {openNotebooks && (
        <NotebookViewer
          notebooks={openNotebooks}
          onClose={() => setOpenNotebooks(null)}
        />
      )}
    </div>
  );
}
