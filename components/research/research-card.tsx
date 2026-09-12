import Image from "next/image";
import Link from "next/link";
import { ResearchPaper } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import { Tag } from "@/components/ui/tag";
import { PatternTile } from "@/components/ui/pattern-tile";
import { FileText, ArrowUpRight } from "lucide-react";

type ResearchFile = {
  label: string;
  url: string;
  image?: string;
  imageContain?: boolean;
};

function ResearchFileLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group/link inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-accent-dim transition-colors duration-200 hover:text-accent"
    >
      <FileText className="h-3.5 w-3.5" strokeWidth={1.5} />
      {label}
      <ArrowUpRight
        className="h-3 w-3 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
        strokeWidth={1.5}
      />
    </Link>
  );
}

function ResearchPreview({
  file,
  pattern,
}: {
  file: ResearchFile;
  pattern: ResearchPaper["pattern"];
}) {
  return (
    <Link
      href={file.url}
      target="_blank"
      rel="noreferrer"
      className="group/preview relative aspect-[4/5] w-full max-w-[160px] overflow-hidden rounded-sm border border-zinc-200 dark:border-zinc-800"
    >
      {file.image ? (
        <Image
          src={file.image}
          alt=""
          fill
          className={cn(
            "transition-transform duration-700 ease-precise",
            file.imageContain
              ? "bg-white object-contain p-1.5"
              : "object-cover object-top group-hover/preview:scale-[1.04]"
          )}
          sizes="160px"
        />
      ) : (
        <>
          <PatternTile
            pattern={pattern}
            className="transition-transform duration-700 ease-precise group-hover/preview:scale-[1.05]"
          />
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 text-zinc-700 transition-colors duration-300 group-hover/preview:text-accent dark:text-zinc-300">
            <FileText className="h-6 w-6" strokeWidth={1.25} />
            <span className="font-mono text-[11px] uppercase tracking-widest">
              PDF
            </span>
          </div>
        </>
      )}
    </Link>
  );
}

function ResearchPreviewPlaceholder({
  paper,
}: {
  paper: ResearchPaper;
}) {
  return (
    <div className="relative aspect-[4/5] w-full max-w-[160px] overflow-hidden rounded-sm border border-zinc-200 dark:border-zinc-800">
      {paper.image ? (
        <Image
          src={paper.image}
          alt=""
          fill
          className={cn(
            paper.imageContain
              ? "bg-white object-contain p-1.5"
              : "object-cover object-top"
          )}
          sizes="160px"
        />
      ) : (
        <PatternTile pattern={paper.pattern} />
      )}
    </div>
  );
}

export function ResearchCard({ paper }: { paper: ResearchPaper }) {
  const fileLinks: ResearchFile[] = [
    ...(paper.fileUrl
      ? [
          {
            label: paper.fileLabel ?? "Read PDF",
            url: paper.fileUrl,
            image: paper.image,
            imageContain: paper.imageContain,
          },
        ]
      : []),
    ...(paper.additionalFiles ?? []),
  ];

  return (
    <div
      id={paper.slug}
      className="group scroll-mt-24 grid grid-cols-1 gap-6 border border-zinc-200 bg-white p-5 transition-all duration-300 ease-precise hover:border-accent/40 hover:bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900/60 sm:grid-cols-[160px_1fr] sm:p-6"
    >
      {fileLinks.length > 0 ? (
        <div className="flex flex-col gap-3">
          {fileLinks.map((file) => (
            <ResearchPreview key={file.url} file={file} pattern={paper.pattern} />
          ))}
        </div>
      ) : paper.image ? (
        <ResearchPreviewPlaceholder paper={paper} />
      ) : null}

      <div className="flex flex-col gap-3">
        <h3 className="text-xl font-medium leading-snug tracking-tight text-zinc-950 transition-colors duration-300 group-hover:text-accent dark:text-zinc-50">
          {paper.title}
        </h3>

        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-zinc-700 dark:text-zinc-300">
          <time dateTime={paper.date}>{formatDate(paper.date)}</time>
          {paper.ongoing && (
            <span className="rounded-sm border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[11px] uppercase tracking-widest text-accent-dim">
              Ongoing
            </span>
          )}
          {paper.venue && (
            <>
              <span className="text-zinc-500 dark:text-zinc-500">/</span>
              <span>{paper.venue}</span>
            </>
          )}
        </div>

        <p className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
          {paper.summary}
        </p>

        {fileLinks.length > 0 && (
          <div className="flex flex-col items-start gap-2 pt-1">
            {fileLinks.map((file) => (
              <ResearchFileLink
                key={file.url}
                href={file.url}
                label={file.label}
              />
            ))}
          </div>
        )}

        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {paper.tags.map((tag) => (
            <Tag key={tag}>[{tag}]</Tag>
          ))}
        </div>
      </div>
    </div>
  );
}
