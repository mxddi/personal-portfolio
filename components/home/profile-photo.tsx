import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { User } from "lucide-react";

const CANDIDATES = ["profile.jpg", "profile.jpeg", "profile.png", "profile.webp"];

function findProfileImage(): string | null {
  for (const file of CANDIDATES) {
    const abs = path.join(process.cwd(), "public", file);
    if (fs.existsSync(abs)) return `/${file}`;
  }
  return null;
}

/**
 * Renders the hero portrait. Drop a photo into `/public` named `profile.jpg`
 * (or .jpeg/.png/.webp) and it will automatically replace this placeholder —
 * no code changes needed.
 */
export function ProfilePhoto() {
  const src = findProfileImage();

  return (
    <div className="relative w-20 sm:w-36 md:w-48 lg:w-64 xl:w-72">
      {/* Corner brackets — technical "figure" framing */}
      <span className="absolute -left-1.5 -top-1.5 h-3 w-3 border-l border-t border-zinc-300 sm:-left-2 sm:-top-2 sm:h-4 sm:w-4" />
      <span className="absolute -right-1.5 -top-1.5 h-3 w-3 border-r border-t border-zinc-300 sm:-right-2 sm:-top-2 sm:h-4 sm:w-4" />
      <span className="absolute -bottom-1.5 -left-1.5 h-3 w-3 border-b border-l border-zinc-300 sm:-bottom-2 sm:-left-2 sm:h-4 sm:w-4" />
      <span className="absolute -bottom-1.5 -right-1.5 h-3 w-3 border-b border-r border-zinc-300 sm:-bottom-2 sm:-right-2 sm:h-4 sm:w-4" />

      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm border border-zinc-200 bg-zinc-50">
        {src ? (
          <Image
            src={src}
            alt="Portrait of Madaly G"
            fill
            sizes="(min-width: 1280px) 288px, (min-width: 1024px) 256px, (min-width: 768px) 192px, (min-width: 640px) 144px, 96px"
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-zinc-500">
            <User className="h-5 w-5 sm:h-8 sm:w-8" strokeWidth={1.25} />
            <span className="font-mono text-xl font-medium tracking-tight text-zinc-400 sm:text-5xl">
              MG
            </span>
          </div>
        )}
      </div>

      <p className="mt-2 hidden text-center font-mono text-[11px] uppercase tracking-widest text-zinc-500 sm:mt-3 sm:block sm:text-left sm:text-xs">
        Fig. 01 — Madaly G
      </p>
    </div>
  );
}
