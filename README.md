# Madaly G — Portfolio

My minimalistic, dark-themed portfolio built with Next.js (App
Router), Tailwind CSS v4, and Lucide React.

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

## Automatic Content

All copy/data lives in `lib/data/*.ts` — update these files to automatically change the
bio, projects, research papers, or social links without needing to touch any
component markup.

`components/ui/pattern-tile.tsx` renders a generative SVG pattern (circuit
traces / orbital rings / terminal glyphs) as a placeholder for category tile
and research-preview imagery. Swap it for a real `<Image>` per category or
per paper whenever you have actual screenshots/photos/PDF thumbnails — the
call sites (`CategoryTile`, `ResearchCard`) only need `pattern` replaced with
an `imageUrl`/`<Image>`.

## Notes
- Dynamic route `params` are async per Next.js 15+/16 conventions
  (`await params` in `generateMetadata` and the page component).
