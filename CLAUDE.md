# CLAUDE.md

Astro static site template: Astro 6 + React islands + Tailwind CSS v4 + TypeScript, deployed to Cloudflare. This file is the single source of truth for working in this repo.

## First session checklist (delete this section once done)

1. Ask the user whether they want to use **Impeccable** for design work (see "Design" below). If **no**, delete the "Design" section from this file.
2. Replace placeholders: `name` in `package.json` and `wrangler.jsonc`, `site` in `astro.config.mjs`, sitemap URL in `public/robots.txt`, title/description in `src/layouts/Layout.astro`, delete the Astro starter placeholders (`src/components/Welcome.astro`, `src/assets/astro.svg`, `background.svg`, their `images.ts` entries), add a default og image (raster, 1200x630), theme tokens in `src/styles/global.css`, `public/favicon.svg`.
3. Update the title and description line at the top of this file; remove template-only notes.

## Commands

```bash
npm run dev        # dev server at localhost:4321 (LAN-accessible)
npm run build      # production build -> ./dist/
npm run preview    # build + `wrangler dev` (closest to production)
npm test           # Playwright (starts dev server automatically)
npm run deploy     # build + `wrangler deploy` (ASK FIRST, see rules)
npm run generate-types  # wrangler types
```

## Stack

| Layer     | Tool                                          |
|-----------|-----------------------------------------------|
| Framework | Astro 6 (`output: 'static'`)                  |
| Islands   | React 19 (`@astrojs/react`)                   |
| Styling   | Tailwind CSS v4 via Vite plugin (no config file) |
| SEO       | `@astrojs/sitemap`, `public/robots.txt`       |
| Hosting   | Cloudflare Workers Static Assets (`wrangler`) |
| Tests     | Playwright (`tests/`)                         |
| Language  | TypeScript strict                             |

## Architecture

Islands: Astro renders everything as static HTML. Default to `.astro` components; use React `.tsx` only when state/interactivity is needed, hydrated with `client:load` / `client:visible` / `client:idle`.

```
src/
  assets/       # images.ts registry + imported images
  components/   # .astro (static) and .tsx (islands)
  layouts/      # Layout.astro: shared <head>, SEO, global.css import
  pages/        # file-based routing
  styles/       # global.css: @import "tailwindcss" + @theme tokens
public/         # served verbatim: favicon, robots.txt, _headers
tests/          # Playwright specs
```

## Code style

- TypeScript everywhere; no `any`. Functional React components with hooks only.
- Tailwind-first: utility classes in markup. Design tokens live in `@theme` in `global.css` (each `--color-*` becomes `bg-*`/`text-*`/`border-*` utilities). No `tailwind.config.js`, no extra CSS files.
- Tailwind v4 styles not applying? Check v4 syntax and the `@theme` block first.
- Astro HMR can miss `.astro` changes: restart `npm run dev`. Islands not hydrating: check the `client:*` directive.

## Images

- Never use raw `<img>`; always Astro's `<Image>` from `astro:assets` (webp conversion, lazy loading).
- `src` + `alt` live in `src/assets/images.ts` (single registry, consistent alt text).
- Always set `width` to the max displayed size (Astro converts format but does not downscale on its own); height follows the aspect ratio.
- Aspect ratio/layout styles belong in the component, not the registry.
- Raster images are stored via Git LFS (`.gitattributes`); make sure `git lfs install` has been run.

```astro
---
import { Image } from "astro:assets";
import { images } from "../assets/images";
---
<Image src={images.hero.src} alt={images.hero.alt} width={800}
  style="aspect-ratio: 16 / 9; object-fit: cover;" />
```

## Environment & Cloudflare

- Static site: there is no runtime env. Per-environment values are baked in at build time.
- `astro.config.mjs` detects the branch via `WORKERS_CI_BRANCH` (Workers Builds) or `CF_PAGES_BRANCH` (Pages builds); `main` = production. Selected values are injected with `vite.define` as custom globals (declare them in `src/env.d.ts`). Do not use `import.meta.env.VITE_*` for these: Vite's env plugin replaces them before `define` runs.
- Only PUBLIC values may be baked in (publishable keys, public URLs). Never secrets.
- Local overrides: `.env.local` (gitignored). Document variable names in `.env.example`.
- Deploy config: `wrangler.jsonc` (`assets.directory: ./dist`). `public/_headers` sets response headers; `public/.assetsignore` keeps worker files out of assets.
- Dev server uses `host: true` + `allowedHosts: true` for LAN/tunnel testing. Only run on trusted networks.

## Critical rules

1. **Secrets:** never commit passwords, API keys, tokens or `.env` files. Verify before any commit.
2. **Deploying:** never run `npm run deploy` or push to `main` (triggers a deployment) without explicit confirmation ("yes, deploy this").
3. **Branches:** never work on `main`. Use `feat/<name>`, `fix/<name>`, `docs/<name>`, `refactor/<name>`.
4. **Quality gates:** `npm run build` must pass before committing. No file > 300 lines, no function > 50 lines.
5. **Commits:** don't auto-commit.

## Do / Don't

- Do ask before refactoring more than 50 lines at once.
- Don't add dependencies without discussing the tradeoff.
- Don't use React where a static `.astro` component works.

## Design (optional: Impeccable)

For design/UI work (new pages, redesigns, polish, audits), use the `impeccable` skill. Keep project-specific design context (users, brand voice, palette, anti-references) in a `.impeccable.md` at the repo root and use only the tokens defined in `global.css`.
