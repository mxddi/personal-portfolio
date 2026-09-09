/**
 * A slow, shifting aurora-borealis backdrop for the hero — visible only in
 * dark mode, evoking auroral ribbons seen from orbit above Earth's night
 * side. Pure CSS: a handful of large, heavily blurred, screen-blended bands
 * drifting on long (18–28s) independent loops, so it costs nothing in light
 * mode and needs no client-side JS or canvas.
 *
 * Confined to the upper portion of the hero and faded out toward the
 * bottom, with a dark radial scrim behind the heading/bio column, so the
 * hero copy stays fully legible against the glow.
 */
export function AuroraBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 hidden h-[80%] overflow-hidden dark:block"
    >
      <div
        className="aurora-band left-[-20%] top-[-35%] h-[65%] w-[85%] bg-teal-400/40 blur-[90px] [animation:aurora-drift-a_24s_ease-in-out_infinite]"
      />
      <div
        className="aurora-band right-[-25%] top-[-30%] h-[70%] w-[75%] bg-sky-400/35 blur-[100px] [animation:aurora-drift-b_29s_ease-in-out_infinite]"
      />
      <div
        className="aurora-band left-[12%] top-[-18%] h-[55%] w-[60%] bg-violet-400/25 blur-[100px] [animation:aurora-drift-c_19s_ease-in-out_infinite]"
      />

      {/* Scrim: darkens the zone behind the heading/bio column so text
          stays high-contrast against the glow. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 65% at 22% 32%, rgba(9,9,11,0.88) 0%, rgba(9,9,11,0.55) 45%, rgba(9,9,11,0) 75%)",
        }}
      />

      {/* Settle the whole effect back into the section background toward
          the bottom, so it doesn't bleed into the CTA / stats row. */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-zinc-950" />
    </div>
  );
}
