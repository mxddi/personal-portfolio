"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface GalleryGridProps {
  images: string[];
  location: string;
}

// Minimum horizontal drag distance (px) before a touch gesture counts as a swipe.
const SWIPE_THRESHOLD = 50;

export function GalleryGrid({ images, location }: GalleryGridProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  const goPrev = () =>
    setOpenIndex((i) => (i === null ? i : Math.max(i - 1, 0)));
  const goNext = () =>
    setOpenIndex((i) => (i === null ? i : Math.min(i + 1, images.length - 1)));

  useEffect(() => {
    if (openIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (touchDeltaX.current > SWIPE_THRESHOLD) goPrev();
    else if (touchDeltaX.current < -SWIPE_THRESHOLD) goNext();
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  const isFirst = openIndex === 0;
  const isLast = openIndex === images.length - 1;

  return (
    <>
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="relative aspect-square cursor-zoom-in overflow-hidden rounded-md border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <Image
              src={src}
              alt={location}
              fill
              className="object-cover transition-transform duration-500 ease-precise hover:scale-105"
              sizes="(min-width: 640px) 33vw, 50vw"
            />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-10"
          onClick={() => setOpenIndex(null)}
        >
          <button
            onClick={() => setOpenIndex(null)}
            aria-label="Close"
            className="absolute right-4 top-4 text-zinc-300 transition-colors duration-200 hover:text-white sm:right-6 sm:top-6"
          >
            <X className="h-7 w-7" strokeWidth={1.5} />
          </button>

          {images.length > 1 && !isFirst && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 text-zinc-300 transition-colors duration-200 hover:text-white sm:left-6"
            >
              <ChevronLeft className="h-8 w-8" strokeWidth={1.5} />
            </button>
          )}

          {images.length > 1 && !isLast && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              aria-label="Next image"
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 text-zinc-300 transition-colors duration-200 hover:text-white sm:right-6"
            >
              <ChevronRight className="h-8 w-8" strokeWidth={1.5} />
            </button>
          )}

          <div
            className="relative flex max-h-full max-w-full items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={images[openIndex]}
              alt={location}
              className="max-h-[90vh] max-w-[90vw] select-none object-contain"
              draggable={false}
            />
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-xs uppercase tracking-widest text-zinc-300 sm:bottom-6">
              {openIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}
