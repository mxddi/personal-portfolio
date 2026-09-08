import { Construction } from "lucide-react";

export function ComingSoon() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-5 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-sm border border-zinc-200 bg-zinc-50 text-accent">
        <Construction className="h-6 w-6" strokeWidth={1.25} />
      </div>
      <p className="font-mono text-sm uppercase tracking-[0.2em] text-zinc-500">
        Under construction
      </p>
      <h2 className="text-3xl font-medium tracking-tight text-zinc-950 sm:text-4xl">
        Come back soon :)
      </h2>
    </div>
  );
}
