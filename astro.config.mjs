// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// Branch detection for build-time environment selection.
// Workers Builds injects WORKERS_CI_BRANCH; Pages builds inject CF_PAGES_BRANCH.
// Both are unset locally (Vite then falls back to .env.development / .env.local).
const BRANCH = process.env.WORKERS_CI_BRANCH ?? process.env.CF_PAGES_BRANCH;
const IS_PROD = BRANCH === "main";

// Example: bake per-environment PUBLIC values into the static output.
// Use custom globals (not import.meta.env.VITE_*) — Vite's env plugin would replace
// those with undefined before `define` can override them. Declare the globals in
// src/env.d.ts. Never put secrets here: the output is public.
const buildDefines = {
	__APP_ENV__: JSON.stringify(IS_PROD ? "production" : "development"),
	// __API_URL__: JSON.stringify(IS_PROD ? "https://api.example.com" : "https://api-dev.example.com"),
};

// https://astro.build/config
export default defineConfig({
	site: "https://example.com", // TODO: real production URL (used by sitemap + canonical URLs)
	output: "static",
	integrations: [react(), sitemap()],

	vite: {
		plugins: [tailwindcss()],
		define: buildDefines,
		server: {
			// LAN access for phone testing / tunnels. Disables Vite's host check:
			// only use on trusted networks.
			host: true,
			allowedHosts: true,
		},
	},

	// Static output: images are optimized at build time and Cloudflare serves dist/ as-is
	// (see wrangler.jsonc).
});
