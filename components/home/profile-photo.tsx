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
    <div className="relative w-36 min-[375px]:w-44 sm:w-44 md:w-52 lg:w-64 xl:w-72">
      <div className="overflow-hidden rounded-sm bg-zinc-50 dark:bg-zinc-900">
        {src ? (
          <Image
            src={src}
            alt="Portrait of Madaly G"
            width={900}
            height={1200}
            quality={100}
            unoptimized
            className="h-auto w-full"
            priority
          />
        ) : (
          <div className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-2 text-zinc-600 dark:text-zinc-400">
            <User className="h-5 w-5 sm:h-8 sm:w-8" strokeWidth={1.25} />
            <span className="font-mono text-xl font-medium tracking-tight text-zinc-500 sm:text-5xl dark:text-zinc-500">
              MG
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
