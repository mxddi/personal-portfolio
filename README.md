# Madaly G — Portfolio

A minimalistic, dark-themed developer portfolio built with Next.js (App
Router), Tailwind CSS v4, and Lucide React. Designed for a creative
multihyphenate working across software engineering, computational physics,
and electrical engineering.

## Stack

- **Next.js 16** (App Router, Server Components, async `params`)
- **React 19**
- **Tailwind CSS v4** (CSS-first config via `@theme` in `app/globals.css` —
  there's no `tailwind.config.ts`, theme tokens live in the CSS file)
- **Geist Sans / Geist Mono** via the [`geist`](https://www.npmjs.com/package/geist) package
- **Lucide React** for icons (note: Lucide v1 removed trademarked brand
  icons — GitHub/LinkedIn marks are small inline SVGs in
  `components/icons/brand-icons.tsx`)

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint . (Next 16 removed `next lint`)
```

## Project structure

```
app/
  layout.tsx              Root layout — fonts, header, footer
  globals.css             Tailwind v4 theme tokens + base styles
  page.tsx                Home: hero, pillars, contact
  projects/
    page.tsx               3 category tiles (Software / Physics / EE)
    [category]/page.tsx     Filterable project list per category
  research/
    page.tsx                Research paper list
components/
  layout/                 Header, footer
  home/                   Hero, pillars grid, contact section
  projects/               Category tiles, project cards, filters
  research/               Research card
  ui/                     Shared primitives (Tag, SectionHeading, PatternTile...)
  icons/                  Brand icon replacements (GitHub, LinkedIn)
lib/
  data/                   Content: categories, projects, research, social, pillars
  types.ts                Shared TypeScript types
  utils.ts                cn() + formatDate() helpers
```

## Content

All copy/data lives in `lib/data/*.ts` — update these files to change the
bio, projects, research papers, or social links without touching any
component markup.

`components/ui/pattern-tile.tsx` renders a generative SVG pattern (circuit
traces / orbital rings / terminal glyphs) as a placeholder for category tile
and research-preview imagery. Swap it for a real `<Image>` per category or
per paper whenever you have actual screenshots/photos/PDF thumbnails — the
call sites (`CategoryTile`, `ResearchCard`) only need `pattern` replaced with
an `imageUrl`/`<Image>`.

## Notes

- No light theme / toggle — the design is intentionally a single, strict
  dark theme (`#0a0a0a`).
- The accent color is a teal/cyan (`--color-accent` in `globals.css`, near
  `#5eead4`) used sparingly for signal — status dots, active nav underline,
  hover states, tags.
- Dynamic route `params` are async per Next.js 15+/16 conventions
  (`await params` in `generateMetadata` and the page component).
