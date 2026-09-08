"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

// react-pdf needs the pdf.js worker; load it from the same CDN the rest of
// the /world page already relies on (react-globe.gl's textures) rather than
// wrestling with bundler asset paths for a binary worker file.
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const SWIPE_THRESHOLD = 50;

interface NotebookViewerProps {
  pdfUrl: string;
  title: string;
  onClose: () => void;
}

export function NotebookViewer({
  pdfUrl,
  title,
  onClose,
}: NotebookViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  // Native page aspect ratio (height / width), read off the loaded PDF page
  // itself — pages can be portrait or landscape, so we can't assume one.
  const [pageAspect, setPageAspect] = useState<number | null>(null);
  const [box, setBox] = useState({ width: 0, height: 0 });
  const boxRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  // Track the actual space available for the page (this box already flexes
  // to fill whatever room is left after the title/counter/padding), so we
  // can size the page to fit inside it completely — never taller or wider
  // than the viewport allows, so no text ever gets cropped out of view.
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setBox({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Reset the known aspect ratio whenever we switch documents, so a stale
  // ratio from the previous notebook can't flash before the new one loads.
  useEffect(() => {
    setPageAspect(null);
    setNumPages(null);
    setPageNumber(1);
  }, [pdfUrl]);

  const goPrev = () => setPageNumber((p) => Math.max(p - 1, 1));
  const goNext = () => setPageNumber((p) => Math.min(p + 1, numPages ?? p));

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

  // Fit the page entirely inside the measured box: constrain by whichever
  // dimension is tighter for this page's aspect ratio, then center it.
  let displayWidth = box.width;
  let displayHeight = box.height;
  if (pageAspect && box.width > 0 && box.height > 0) {
    const widthIfFullHeight = box.height / pageAspect;
    if (widthIfFullHeight <= box.width) {
      displayWidth = widthIfFullHeight;
      displayHeight = box.height;
    } else {
      displayWidth = box.width;
      displayHeight = box.width * pageAspect;
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col items-center gap-3 bg-black/80 px-4 pb-4 pt-14 backdrop-blur-sm sm:pt-16"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close notebook"
        className="absolute right-4 top-4 text-zinc-300 transition-colors duration-200 hover:text-white sm:right-6 sm:top-6"
      >
        <X className="h-7 w-7" strokeWidth={1.5} />
      </button>

      {numPages !== null && pageNumber > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          aria-label="Previous page"
          className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 text-zinc-300 transition-colors duration-200 hover:text-white sm:left-6"
        >
          <ChevronLeft className="h-8 w-8" strokeWidth={1.5} />
        </button>
      )}

      {numPages !== null && pageNumber < numPages && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          aria-label="Next page"
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 text-zinc-300 transition-colors duration-200 hover:text-white sm:right-6"
        >
          <ChevronRight className="h-8 w-8" strokeWidth={1.5} />
        </button>
      )}

      <p className="max-w-[90vw] shrink-0 text-center font-mono text-[11px] uppercase tracking-widest text-zinc-400 sm:max-w-md">
        {title}
      </p>

      <div
        ref={boxRef}
        className="flex min-h-0 w-full max-w-[480px] flex-1 items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            width: displayWidth || undefined,
            height: displayHeight || undefined,
          }}
          className="max-h-full max-w-full select-none overflow-hidden rounded-sm bg-[#f7f3ea] shadow-2xl shadow-black/60"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Document
            file={pdfUrl}
            onLoadSuccess={({ numPages: n }) => setNumPages(n)}
            loading={
              <div className="flex h-full min-h-96 w-full items-center justify-center font-mono text-xs uppercase tracking-widest text-zinc-500">
                Loading notebook…
              </div>
            }
            error={
              <div className="flex h-full min-h-96 w-full items-center justify-center font-mono text-xs uppercase tracking-widest text-red-500">
                Could not load this notebook.
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              width={displayWidth || undefined}
              onLoadSuccess={(page) =>
                setPageAspect(page.originalHeight / page.originalWidth)
              }
              renderTextLayer={false}
              renderAnnotationLayer={false}
              loading={
                <div className="flex h-full min-h-96 w-full items-center justify-center font-mono text-xs uppercase tracking-widest text-zinc-500">
                  Loading page…
                </div>
              }
            />
          </Document>
        </div>
      </div>

      {numPages !== null && (
        <div className="shrink-0 font-mono text-xs uppercase tracking-widest text-zinc-400">
          Page {pageNumber} / {numPages}
        </div>
      )}
    </div>
  );
}
