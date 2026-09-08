import { ResearchPaper } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Tag } from "@/components/ui/tag";
import { PatternTile } from "@/components/ui/pattern-tile";
import { FileText, ArrowUpRight } from "lucide-react";

export function ResearchCard({ paper }: { paper: ResearchPaper }) {
  const href = paper.fileUrl;
  const Wrapper = (href ? "a" : "div") as any;
  const wrapperProps = href
    ? { href, target: "_blank", rel: "noreferrer" }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className="group grid grid-cols-1 gap-6 border border-zinc-200 bg-white p-5 transition-all duration-300 ease-precise hover:border-accent/40 hover:bg-zinc-50/60 sm:grid-cols-[160px_1fr] sm:p-6"
    >
      <div className="relative aspect-[4/5] w-full max-w-[160px] overflow-hidden rounded-sm border border-zinc-200">
        <PatternTile
          pattern={paper.pattern}
          className="transition-transform duration-700 ease-precise group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 text-zinc-600 transition-colors duration-300 group-hover:text-accent">
          <FileText className="h-6 w-6" strokeWidth={1.25} />
          {href && (
            <span className="font-mono text-[11px] uppercase tracking-widest">
              PDF
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-medium leading-snug tracking-tight text-zinc-950 transition-colors duration-300 group-hover:text-accent">
            {paper.title}
          </h3>
          {href && (
            <ArrowUpRight
              className="mt-1 h-4 w-4 shrink-0 -translate-x-1 translate-y-1 text-zinc-700 opacity-0 transition-all duration-300 ease-precise group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-accent group-hover:opacity-100"
              strokeWidth={1.5}
            />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-zinc-600">
          <time dateTime={paper.date}>{formatDate(paper.date)}</time>
          {paper.ongoing && (
            <span className="rounded-sm border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[11px] uppercase tracking-widest text-accent-dim">
              Ongoing
            </span>
          )}
          {paper.venue && (
            <>
              <span className="text-zinc-400">/</span>
              <span>{paper.venue}</span>
            </>
          )}
        </div>

        <p className="text-base leading-relaxed text-zinc-700">
          {paper.summary}
        </p>

        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {paper.tags.map((tag) => (
            <Tag key={tag}>[{tag}]</Tag>
          ))}
        </div>
      </div>
    </Wrapper>
  );
}
