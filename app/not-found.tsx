import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center gap-6 text-center">
      <span className="font-mono text-sm uppercase tracking-[0.3em] text-accent">
        Error 404
      </span>
      <h1 className="text-4xl font-medium tracking-tight text-zinc-950 sm:text-5xl dark:text-zinc-50">
        Segment not found
      </h1>
      <p className="max-w-md text-base leading-relaxed text-zinc-700 dark:text-zinc-400">
        The route you requested doesn&apos;t resolve to anything in this
        system. It may have been moved, renamed, or never existed.
      </p>
      <Link
        href="/"
        className="group mt-2 inline-flex items-center gap-2 rounded-sm border border-zinc-300 px-5 py-2.5 font-mono text-sm uppercase tracking-widest text-zinc-800 transition-all duration-300 hover:border-accent/40 hover:text-accent dark:border-zinc-700 dark:text-zinc-200"
      >
        <ArrowLeft
          className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
          strokeWidth={1.5}
        />
        Back to home
      </Link>
    </div>
  );
}
