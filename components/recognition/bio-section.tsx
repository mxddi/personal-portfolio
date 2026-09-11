import { ProfilePhoto } from "@/components/home/profile-photo";
import { bio } from "@/lib/data/bio";

export function BioSection() {
  return (
    <section className="max-w-3xl">
      <div className="flex flex-col items-center gap-10 sm:flex-row sm:items-start">
        <div className="shrink-0 [&>div]:w-32 sm:[&>div]:w-36">
          <ProfilePhoto
            src="/travel/sintra-portugal/05.jpg"
            alt="Portrait at Monserrate Palace, Sintra, Portugal"
            imageScale={175}
            imagePosition="28% 70%"
          />
        </div>

        <div className="flex min-w-0 flex-col gap-6 text-center sm:text-left">
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-medium tracking-tight text-zinc-950 sm:text-4xl dark:text-zinc-50">
              {bio.name}
            </h1>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-600 dark:text-zinc-400">
              {bio.meta.join(" · ")}
            </p>
          </div>

          <div className="flex flex-col gap-5 text-base leading-relaxed text-zinc-700 sm:text-lg dark:text-zinc-300">
            {bio.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
