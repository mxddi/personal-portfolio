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
          : "border-zinc-200 bg-zinc-50 text-zinc-600",
        className
      )}
    >
      {children}
    </span>
  );
}
