# The Board — Recipe Finder

An advanced recipe finder built with React + TypeScript, backed by
[TheMealDB](https://www.themealdb.com)'s free public REST API (no signup or API
key required). Styled as a chalkboard menu board — pinned recipe cards, chalk
typography, and a saffron/paprika/sage accent palette.

## Features

- **Search by name** — debounced live search as you type.
- **Browse by category, cuisine, or ingredient** — chip-based filters pulled
  live from the API's own category/area/ingredient lists.
- **Recipe detail view** — full ingredient list with checkboxes (tick off what
  you have), step-by-step method, tags, and links to the source/video where
  available.
- **Favorites** — star any recipe to save it; favorites persist in
  `localStorage` so they survive a refresh, with their own tab and count badge.
- **Surprise me** — pulls a random recipe straight into the detail view.
- Loading skeletons, empty states, and error states throughout — no dead ends.

## Project structure

```
recipe-finder/
├── src/
│   ├── components/     HeaderBoard, ChipRail, RecipeCard, RecipeGrid, RecipeModal
│   ├── hooks/           useFavorites (localStorage), useDebouncedValue
│   ├── lib/api.ts        TheMealDB REST client + type mapping
│   ├── types.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Run it

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). That's it — no
backend to stand up, no `.env` file, no API key. The app talks directly to
`https://www.themealdb.com/api/json/v1/1/...` from the browser.

Build for production with `npm run build` (outputs to `dist/`); preview it
locally with `npm run preview`.

## Notes

- TheMealDB's free tier uses the shared test key (`1`) baked into
  `src/lib/api.ts`. It's rate-limited but generous enough for normal use; if
  you outgrow it, TheMealDB sells a Patreon-gated key you can drop into the
  same `BASE` constant, or you can swap in a different provider (e.g.
  Spoonacular) by reimplementing the functions in `lib/api.ts` — the rest of
  the app only depends on the `RecipeSummary` / `RecipeDetail` shapes in
  `types.ts`.
- If you're behind a restrictive corporate proxy or firewall, make sure
  `www.themealdb.com` is reachable.
- Favorites are per-browser (`localStorage`), not synced anywhere — there's no
  backend or account system in this build.
