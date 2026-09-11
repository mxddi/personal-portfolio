import fs from "node:fs";
import path from "node:path";
import { User } from "lucide-react";

const CANDIDATES = ["profile.jpg", "profile.jpeg", "profile.png", "profile.webp"];

function findProfileImage(): string | null {
  for (const file of CANDIDATES) {
    const abs = path.join(process.cwd(), "public", file);
    if (fs.existsSync(abs)) return `/${file}`;
  }
  return null;
}

interface ProfilePhotoProps {
  src?: string;
  alt?: string;
  /** Background size percentage — values above 100 crop/zoom in. */
  imageScale?: number;
  imagePosition?: string;
}

/**
 * Renders the hero portrait. Drop a photo into `/public` named `profile.jpg`
 * (or .jpeg/.png/.webp) and it will automatically replace this placeholder —
 * no code changes needed.
 */
export function ProfilePhoto({
  src: srcOverride,
  alt = "Portrait of Madaly G",
  imageScale,
  imagePosition = "center",
}: ProfilePhotoProps = {}) {
  const src = srcOverride ?? findProfileImage();

  return (
    <div className="relative w-36 min-[375px]:w-44 sm:w-44 md:w-52 lg:w-64 xl:w-72">
      <div className="protect-image overflow-hidden rounded-sm bg-zinc-50 dark:bg-zinc-900">
        {src ? (
          <>
            <link rel="preload" as="image" href={src} fetchPriority="high" />
            <div
              role="img"
              aria-label={alt}
              className="protect-image aspect-[3/4] w-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${src})`,
                ...(imageScale !== undefined && {
                  backgroundSize: `${imageScale}%`,
                  backgroundPosition: imagePosition,
                }),
              }}
            />
          </>
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
