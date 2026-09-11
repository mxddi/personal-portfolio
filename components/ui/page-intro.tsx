import { cn } from "@/lib/utils";

interface PageIntroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  titleClassName?: string;
}

export function PageIntro({
  eyebrow,
  title,
  description,
  titleClassName,
}: PageIntroProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-zinc-200 pb-10 dark:border-zinc-800">
      {eyebrow && (
        <div className="flex items-center gap-2 font-mono text-sm uppercase tracking-[0.2em] text-accent">
          <span className="h-px w-6 bg-accent/60" />
          {eyebrow}
        </div>
      )}
      <h1
        className={cn(
          "font-medium tracking-tight text-zinc-950 dark:text-zinc-50",
          titleClassName ?? "text-4xl sm:text-5xl"
        )}
      >
        {title}
      </h1>
      {description && (
        <p className="max-w-2xl text-base leading-relaxed text-zinc-700 sm:text-lg dark:text-zinc-300">
          {description}
        </p>
      )}
    </div>
  );
}
