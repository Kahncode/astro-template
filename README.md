# Astro Template

Astro 6 + React islands + Tailwind CSS v4 + TypeScript, deployed to Cloudflare (Workers Static Assets). Includes Playwright, sitemap/robots, Git LFS for images, and a VS Code setup.

## Use

1. Create a repo from this template (or copy it), then `npm install`.
2. Follow the first-session checklist in [CLAUDE.md](CLAUDE.md).

## Commands

| Command          | Action                                  |
| :--------------- | :-------------------------------------- |
| `npm run dev`    | Dev server at `localhost:4321`          |
| `npm run build`  | Build to `./dist/`                      |
| `npm run preview`| Build + `wrangler dev`                  |
| `npm test`       | Playwright tests                        |
| `npm run deploy` | Build + `wrangler deploy`               |
