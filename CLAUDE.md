# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

Bun is the package manager (`bun.lock`). `package.json` requires Node >= 22.12.0; CI runs Node 24.

| Command | Purpose |
|---|---|
| `bun install` | Install dependencies (CI uses `bun ci` instead). |
| `bun dev` | Local dev server. |
| `bun run check` | `astro check` — TypeScript and Astro diagnostics. |
| `bun run build` | Static build to `dist/`. |
| `bun run preview` | Serve the built output. |

Validate any change with `bun run check && bun run build`. That is exactly what the `quality` job in `.github/workflows/deploy-pages.yml` runs on every pull request and push to `main`.

There is no test runner, linter, or formatter configured. `astro check` is the entire static-analysis surface — do not invent a test or lint command.

## Architecture Overview

A single-page static Astro site that markets and distributes the install command for `claude-diag`, a separate tool at `github.com/engels74/claude-diag`. The install script served from `sh.cdiag.link` is **not** in this repository; this repo is only the landing page. There is no adapter or `output` setting in `astro.config.mjs`, so the build is fully static and deploys to GitHub Pages under the custom domain in `public/CNAME`.

- `src/pages/index.astro` — the only route. Composes the layout and the three page sections.
- `src/layouts/BaseLayout.astro` — HTML shell, meta and Open Graph tags, imports `src/styles/theme.css`.
- `src/components/home/` — `HeroSection.astro`, `FeatureGrid.astro`, and `FooterSection.astro` are server-rendered. `CopyCommand.svelte` (Svelte 5 runes) and `MockTerminal.tsx` (Solid) are the only hydrated islands; both are mounted `client:load` from `HeroSection.astro`.
- `src/lib/homepage/content.ts` — single source of truth for page copy and data: `installCommand`, `repoUrl`, `terminalLines`, `featureCards`, and their types. Three components import from it.
- Styling is UnoCSS with `presetWind4`. `uno.config.ts` maps semantic color names to CSS custom properties; `src/styles/theme.css` defines those properties.

## Implementation Decisions

| Need | Use | Avoid |
|---|---|---|
| New section, layout, or static markup | An `.astro` component in `src/components/home/` | A Svelte or Solid island for non-interactive content |
| Page copy, lists, links, or the install command | An export from `src/lib/homepage/content.ts` | Inlining the string in a component |
| New interactive behaviour | Extend `CopyCommand.svelte` or `MockTerminal.tsx` | Introducing a third UI framework |
| A utility bundle used in more than one place | A shortcut in `uno.config.ts` (`focus-ring`, `panel-surface`, `eyebrow-text`) | Copying long class strings between files |
| A semantic color | A theme token (`text-muted-foreground`, `bg-terminal`, …) | A new arbitrary `oklch(...)` value when a token already fits |

Arbitrary `bg-[oklch(...)]` values do appear (for example in `FeatureGrid.astro` and `MockTerminal.tsx`) for one-off shades that have no token. Follow that only when no existing token applies.

## Common Change Workflows

**Adding a color token:**

1. Add the custom property to **both** the `:root, [data-theme='claude-light']` block and the `[data-theme='claude-dark']` block in `src/styles/theme.css`.
2. Map it in `theme.colors` of `uno.config.ts` as `'name': 'var(--name)'`.
3. Use it as `text-name` / `bg-name` / `border-name`.

Every color in `uno.config.ts` currently resolves to a variable defined in both theme blocks. Preserve that invariant — a token mapped to a missing variable fails silently at runtime rather than at build time.

**Adding page content:** add the data and its type to `src/lib/homepage/content.ts`, then render it from the relevant `.astro` component. `FeatureGrid.astro` is the canonical example of the pattern:

```astro
---
import { featureCards } from '../../lib/homepage/content';
---
{featureCards.map((feature) => (
	<article class="panel-surface p-5">
		<p class="eyebrow-text">{feature.kicker}</p>
	</article>
))}
```

## Critical Gotchas

- **`.tsx` here is Solid, not React.** `tsconfig.json` sets `jsxImportSource: "solid-js"`. Use `createSignal`, `createMemo`, `<For>`, and `classList`; do not destructure props or use effects for derived state.
- **Dark theme is defined but unreachable.** `BaseLayout.astro:13` hardcodes `data-theme="claude-light"`, and the fully populated `[data-theme='claude-dark']` block in `theme.css` is never activated. Enabling dark mode requires adding a theme switcher, not just editing CSS.
- **UnoCSS extracts class names statically at build time.** `src/lib/homepage/content.ts` currently holds data only. If you put utility class strings in a `.ts` file, add an `@unocss-include` comment or the generated CSS will silently omit them.
- **Two nav links have no targets.** `HeroSection.astro:13-14` link to `#flow` and `#report`, but no element in `src/` carries those `id`s. Add the matching `id` when you add those sections, or add a target alongside any new nav link.
- **Indentation is tabs** in `src/` and in the root `.ts`/`.mjs`/`.js` config files; JSON files use two spaces. No formatter enforces this, so match the surrounding file.

## Additional Documentation

- `.augment/rules/astro-dev-pro.md` — Detailed stack playbook for Astro, Bun, UnoCSS `presetWind4`, Svelte 5, and Solid, with decision matrices and rejected patterns. Read it before adding a route, an island, an Astro Action, an endpoint, or environment-variable handling; it covers stack-level conventions this file deliberately does not repeat.
