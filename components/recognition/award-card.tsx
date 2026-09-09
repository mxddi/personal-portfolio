import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Award } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function AwardCard({ award }: { award: Award }) {
  return (
    <div className="flex flex-col gap-2 border-b border-zinc-200 py-6 last:border-b-0 dark:border-zinc-800">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="max-w-2xl text-lg font-medium leading-snug tracking-tight text-zinc-950 dark:text-zinc-50">
          {award.title}
        </h3>
        <time
          dateTime={award.date}
          className="whitespace-nowrap font-mono text-xs text-zinc-500"
        >
          {formatDate(award.date)}
        </time>
      </div>

      <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
        {award.issuer}
        {award.association && (
          <>
            <span className="text-zinc-400 dark:text-zinc-600"> · </span>
            {award.association}
          </>
        )}
      </p>

      {award.summary && (
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-700 dark:text-zinc-400">
          {award.summary}
        </p>
      )}

      {award.link && (
        <Link
          href={award.link.href}
          target="_blank"
          rel="noreferrer"
          className="group mt-1 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-accent-dim transition-colors duration-200 hover:text-accent"
        >
          {award.link.label}
          <ArrowUpRight
            className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={1.5}
          />
        </Link>
      )}
    </div>
  );
}
