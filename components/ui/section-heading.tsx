import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className
      )}
    >
      <div className="flex items-center gap-2 font-mono text-sm uppercase tracking-[0.2em] text-accent">
        <span className="h-px w-6 bg-accent/60" />
        {eyebrow}
      </div>
      <h2 className="text-3xl font-medium tracking-tight text-zinc-950 sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-base leading-relaxed text-zinc-700">
          {description}
        </p>
      )}
    </div>
  );
}
