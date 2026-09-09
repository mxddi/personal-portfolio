import { cn } from "@/lib/utils";

type PatternVariant = "circuit" | "orbit" | "terminal";

interface PatternTileProps {
  pattern: PatternVariant;
  className?: string;
}

/**
 * Generative SVG backdrop used as a stand-in for category/preview imagery.
 * Swap for a real photo/screenshot by rendering an <Image> instead — the
 * component boundary (aspect ratio + overlay treatment) stays the same.
 */
export function PatternTile({ pattern, className }: PatternTileProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden bg-zinc-50 dark:bg-zinc-900",
        className
      )}
      aria-hidden
    >
      <svg
        className="h-full w-full text-accent/60"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id={`pattern-terminal`}
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <text x="2" y="20" fontSize="14" fill="currentColor" opacity="0.5">
              {"{ }"}
            </text>
          </pattern>

          <pattern
            id="pattern-circuit"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 30 H20 V10 H60 M20 30 V50 H45 V60 M45 50 H60"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            <circle cx="20" cy="30" r="2.5" fill="currentColor" />
            <circle cx="45" cy="50" r="2.5" fill="currentColor" />
            <circle cx="60" cy="10" r="2.5" fill="currentColor" />
          </pattern>

          <pattern
            id="pattern-orbit"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <ellipse
              cx="40"
              cy="40"
              rx="36"
              ry="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            <ellipse
              cx="40"
              cy="40"
              rx="14"
              ry="36"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.6"
            />
            <circle cx="40" cy="40" r="3" fill="currentColor" />
          </pattern>

          <radialGradient id="tile-fade" cx="50%" cy="35%" r="75%">
            <stop
              offset="0%"
              stopOpacity="0"
              className="[stop-color:white] dark:[stop-color:#09090b]"
            />
            <stop
              offset="100%"
              stopOpacity="0.9"
              className="[stop-color:white] dark:[stop-color:#09090b]"
            />
          </radialGradient>
        </defs>

        <rect width="100%" height="100%" fill={`url(#pattern-${pattern})`} />
        <rect width="100%" height="100%" fill="url(#tile-fade)" />
      </svg>

      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent dark:from-zinc-950 dark:via-zinc-950/50" />
    </div>
  );
}
