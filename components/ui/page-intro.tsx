interface PageIntroProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export function PageIntro({ eyebrow, title, description }: PageIntroProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-zinc-200 pb-10 dark:border-zinc-800">
      <div className="flex items-center gap-2 font-mono text-sm uppercase tracking-[0.2em] text-accent">
        <span className="h-px w-6 bg-accent/60" />
        {eyebrow}
      </div>
      <h1 className="text-4xl font-medium tracking-tight text-zinc-950 sm:text-5xl dark:text-zinc-50">
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
