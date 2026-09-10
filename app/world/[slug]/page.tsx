import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { travelGalleries, getTravelGalleryBySlug } from "@/lib/data/travel-galleries";
import { GalleryGrid } from "@/components/world/gallery-grid";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return travelGalleries.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const gallery = getTravelGalleryBySlug(slug);
  if (!gallery) return {};
  return {
    title: `${gallery.location} — Madaly G`,
    description: `Photos from ${gallery.location}.`,
  };
}

export default async function TravelGalleryPage({ params }: PageProps) {
  const { slug } = await params;
  const gallery = getTravelGalleryBySlug(slug);
  if (!gallery) notFound();

  return (
    <div className="container-page py-16 sm:py-20">
      <Link
        href="/world"
        className="group inline-flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-zinc-700 transition-colors duration-200 hover:text-accent dark:text-zinc-300"
      >
        <ArrowLeft
          className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
          strokeWidth={1.5}
        />
        World
      </Link>

      <div className="mt-6 flex flex-col gap-4 border-b border-zinc-200 pb-10 dark:border-zinc-800">
        <div className="flex items-center gap-2 font-mono text-sm uppercase tracking-[0.2em] text-accent">
          <span className="h-px w-6 bg-accent/60" />
          Gallery
        </div>
        <h1 className="text-4xl font-medium tracking-tight text-zinc-950 sm:text-5xl dark:text-zinc-50">
          {gallery.location}
        </h1>
      </div>

      <GalleryGrid images={gallery.images} location={gallery.location} />
    </div>
  );
}
