import { cn } from "@/lib/utils";

interface TagProps {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}

export function Tag({ children, active, className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-xs uppercase tracking-wide",
        active
          ? "border-accent/40 bg-accent/10 text-accent"
          : "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300",
        className
      )}
    >
      {children}
    </span>
  );
}
