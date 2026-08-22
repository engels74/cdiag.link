# AGENTS.md

This file provides guidance to AI coding agents when working with code in this
repository.

## Scope

A one-route static Astro site (`src/pages/index.astro`) that markets `claude-diag` and hands
out its install command. The installer served from `sh.cdiag.link` and the diagnostic tool
itself live in `github.com/engels74/claude-diag` — not in this repo. Nothing here executes at
request time.

## Commands

Bun is the package manager; scripts are the plain Astro ones (`dev`, `check`, `build`,
`preview`). Validate any change with `bun run check && bun run build` — that is exactly the
`quality` job in `.github/workflows/deploy-pages.yml`. CI installs with `bun ci` (an
undocumented alias of `bun install`); use `bun install` locally.

There is no test runner, linter, or formatter configured. `astro check` is the entire
static-analysis surface — don't reach for `bun test`, eslint, or prettier, and don't add one to
satisfy a "run the tests" step.

## Build target

`astro.config.mjs` sets no adapter and no `output`, so the build is fully static and deploys to
GitHub Pages under the domain in `public/CNAME`. Astro Actions, API endpoints, server islands,
and `export const prerender = false` — all of which the stack playbook below describes
favourably — cannot work here. Put new behaviour in a client island or an inline `<script>`
instead.

## Gotchas

- **Islands are Svelte 5, runes only.** Svelte is the one UI framework integration; there is
  no JSX in the repo and `tsconfig.json` configures none, so a new `.tsx` file has no
  renderer behind it. Use `$props()` for inputs and `$state` / `$derived` for reactivity;
  `src/components/home/CopyCommand.svelte` is the smallest working reference. Anything that
  schedules work also has to tear it down, and `MockTerminal.svelte` is the reference for
  that half: its timers are armed in `onMount` and cleared by the function `onMount`
  returns.
- **A colour token has to be added in three spots.** Declare the custom property in *both* the
  `:root, [data-theme='claude-light']` block and the `[data-theme='claude-dark']` block of
  `src/styles/theme.css`, then map it under `theme.colors` in `uno.config.ts` as
  `'name': 'var(--name)'`. A token mapped to a variable that only exists in one block produces
  no build error — the colour just resolves to nothing at runtime.
- **The dark theme is defined but unreachable.** `src/layouts/BaseLayout.astro` hardcodes
  `data-theme="claude-light"`. Editing the `claude-dark` block changes nothing on the rendered
  site; making it reachable requires a theme switcher, not a CSS edit.
- **UnoCSS extracts class names statically at build time.** `src/lib/homepage/content.ts`
  deliberately holds data only. If you put utility strings in a `.ts`/`.js` file, add an
  `@unocss-include` comment or extend Uno's content scanning, or the generated CSS silently
  omits those classes.
- **Page copy belongs in `src/lib/homepage/content.ts`**, not inline in components —
  `installCommand`, `repoUrl`, `terminalLines`, and `featureCards` are imported by three
  components. `FeatureGrid.astro` is the canonical data-to-markup pattern.
- **`src/components/home/HeroSection.astro:13-14` links to `#flow` and `#report`, which don't
  exist** — no element in `src/` carries those ids. Add the matching `id` when you build those
  sections rather than treating the links as working anchors.
- **Indentation is tabs** across `src/` and the root `.ts`/`.mjs`/`.js` configs; JSON files use
  two spaces. Nothing enforces this, so match the file you are editing.

## Reference rules

- `.agents/rules/astro-dev-pro.md` — Astro / Bun / UnoCSS `presetWind4` / Svelte 5 runes /
  Solid conventions, with a decision matrix and an explicit rejected-patterns table. Read
  before adding a route, an island, or a `client:*` directive, or before editing
  `uno.config.ts`. It is the source of truth for stack conventions and is not restated here.
  Note it was researched against Astro 6 while this repo tracks Astro 7, and its server-side
  guidance is out of scope per **Build target** above. Its Solid sections are out of scope
  too — the Solid integration has been removed and islands here are Svelte only.
