---
type: "agent_requested"
description: "Astro Bun UnoCSS Svelte SolidJS Development Guidelines"
---

# Astro + Bun + UnoCSS + Svelte/Solid Agent Coding Playbook

## Agent Operating Contract

This playbook is implementation guidance for AI coding agents working in an Astro project that uses Bun, UnoCSS with `presetWind4`, and Astro integrations for Svelte and Solid.

When creating code:

- Use the defaults and decision rules here before inventing structure.
- Prefer Astro-native routing, rendering, and data flow.
- Add the smallest complete implementation that fits the task.

When modifying code:

- Preserve runtime behaviour unless asked to change it.
- Follow nearby repository conventions unless they conflict with a Reject item.
- Improve only nearby touched code toward this playbook.
- Do not perform broad unrelated rewrites.

When refactoring:

- Identify the stale or rejected pattern first.
- Take the smallest safe migration step.
- Keep the diff reviewable.
- Surface broad migrations instead of silently performing them.

When reviewing:

- Check routing, hydration, framework boundaries, UnoCSS extraction safety, security-sensitive rendering, and verification commands.
- Reject adjacent-ecosystem drift.

When uncertain:

- Prefer conservative stable defaults.
- Do not invent APIs, commands, or migrations.

## Stack Snapshot & Defaults

- **Research date:** 2026-05-07
- **Research basis:** Current official docs, release notes, migration guides, specifications, changelogs, and primary repositories.

- **Astro is the application shell and default composition layer.** Treat `.astro` files as the place for routes, layouts, server-side data loading, framework composition, and hydration decisions. Astro uses file-based routing, standard `<a>` navigation instead of a framework `<Link>`, server-first rendering for framework components, and explicit `client:*` directives for hydration. citeturn7view5turn7view1turn9view0turn36search22

- **Use Astro 6-era defaults and official integrations.** Current docs include the Astro 6 upgrade guide and Astro 6 configuration features such as `security.csp`; official integration docs are aligned to the same major line. citeturn6search9turn11view5turn14view4

- **Bun is the default package manager and task runner for this stack, but not an excuse to ignore repository scripts.** `bun create astro`, `bun install`, `bun run <script>`, and `bunx` are supported. Bun can run Astro with `bunx --bun`, but Astro’s own Bun recipe still warns that some integrations may show rough edges, so use repository scripts as the source of truth for CI and local verification. citeturn35search1turn34search5turn35search3turn36search1

- **UnoCSS is explicit, not implicit.** Astro’s UnoCSS integration does not ship with a default preset; add `presetWind4()` in `uno.config.ts`. UnoCSS is build-time extraction-based, so only statically discoverable utilities are generated unless you safelist or explicitly include additional sources. `client:only` Astro framework components also need to live in `src/components` or be added to UnoCSS content scanning. citeturn29view0turn29view1turn29view2

- **`presetWind4` is the right Uno preset for Tailwind-v4-style utilities in this stack.** It is the Tailwind 4-compatible preset, its reset is integrated behind `preflights.reset`, and its theme CSS variable generation is on-demand by default. Do not bolt on extra reset packages just because older Uno or Tailwind examples did. citeturn29view3turn30view0turn30view1turn30view2

- **New Svelte code should target Svelte 5 syntax.** Svelte 5 keeps old syntax working for migration, but current defaults are runes, `$props`, callback props instead of `createEventDispatcher`, snippets instead of slots for component composition, and `$effect` / `$effect.pre` instead of `beforeUpdate` / `afterUpdate`. Stores remain useful, but mainly for complex asynchronous streams or cases needing explicit subscription semantics. citeturn17view0turn19view0turn17view3turn17view5turn17view1

- **Solid is a first-class Astro island option, but use Solid on Solid’s terms.** Solid components do not re-run on every state change; reactivity is signal-based and fine-grained. Use `createSignal` for state, `createMemo` for derived values, `createEffect` for side effects only, and `splitProps` / `mergeProps` instead of React-style prop destructuring. Astro’s Solid integration also automatically wraps async and hydrating components in top-level suspense boundaries. citeturn27search5turn24search0turn24search1turn24search2turn22search0turn20search1turn20search10turn14view1

- **Keep shadcn usage conditional in this stack.** Official `shadcn/ui` Astro installation expects React integration plus Tailwind, while `shadcn-svelte` is an unofficial community port built with Bits UI and Tailwind CSS, and its Astro installation docs also assume Tailwind-oriented setup. In an Astro + UnoCSS + Svelte/Solid project, neither is a default. Use them only when the repository already uses them, or when the task explicitly requires adopting and maintaining their generated component source. citeturn5view0turn5view2turn33search10turn4view6turn33search12

## Decision Matrix

| Scenario | Use | Avoid |
|---|---|---|
| Installing dependencies and running scripts | `bun add`, `bun add -d`, `bun install`, `bun run <script>`, and `bunx <bin>` | Switching package managers ad hoc. Only follow npm/pnpm/yarn instead when the repository lockfile, CI, or scripts are clearly authoritative, or a Bun integration issue is already known. citeturn34search5turn35search3turn35search1turn36search1 |
| New route or page | `src/pages/**` with `.astro` pages by default | Importing SvelteKit or SolidStart routing conventions such as route objects, loaders, or framework `<Link>` components. Astro uses file routes and normal anchors. citeturn7view5turn37view0 |
| Small client interaction on an otherwise static page | Plain `.astro` markup plus a bundled `<script>` | Spinning up a Svelte or Solid island for trivial DOM behaviour like toggles, copy buttons, or one-off listeners. citeturn11view2turn7view1 |
| Interactive component or stateful widget | Svelte or Solid component imported into `.astro` and hydrated with the lightest suitable `client:*` directive | Defaulting immediately to `client:load` or `client:only`. Astro server-renders framework components unless you opt out. citeturn7view1turn9view0 |
| Choosing a hydration directive | `client:load` only for immediately interactive UI; `client:idle` for lower-priority UI; `client:visible` for below-the-fold or heavy widgets; `client:media` for screen-conditional UI; `client:only` only when SSR cannot work or is unwanted | Treating all islands the same, or hiding hydration directives behind spreads or dynamic tags. Hydration directives must be compiler-visible on directly imported framework components. citeturn9view0 |
| Repeated styling patterns | Uno utilities in markup first; Uno shortcuts for repeated cross-file utility bundles | Runtime class-string concatenation, or broad `@apply`/directive abstractions for patterns that are clearer inline. citeturn31view2turn32search18turn32search20 |
| Dynamic visual variants | Static class maps in scanned files; `safelist` only for known finite generated sets | Template-string utility generation like `` `bg-${tone}-500` ``. UnoCSS cannot infer runtime combinations. citeturn31view2turn29view2 |
| Same-app server mutations | Astro Actions | Bespoke internal API endpoints for ordinary app mutations. Use endpoints instead for public URLs, webhooks, non-action consumers, or response shapes that do not fit Actions. citeturn12view0turn7view3 |
| Svelte composition | Svelte 5 runes, callback props, snippets | New `export let`, `createEventDispatcher`, implicit slot APIs, or `beforeUpdate` / `afterUpdate` in new code. citeturn19view0turn17view3turn17view5 |
| Solid composition | Signals, memos, control-flow components, reactive prop helpers | React mental models such as prop destructuring, derived state in effects, or treating component bodies as re-running renders. citeturn22search0turn24search1turn27search5turn26search0turn25search0 |
| shadcn in this stack | Conditional: only if the repo already uses `shadcn/ui` or `shadcn-svelte`, or the task explicitly requests adopting them | Introducing shadcn by default into an Astro + UnoCSS Svelte/Solid codebase. The official install paths assume Tailwind-led setup, and `shadcn/ui` Astro also assumes React. citeturn5view2turn4view6turn33search10 |

## Implementation Guidelines

### Project Structure & Interop Boundaries

### Use `.astro` as the framework boundary

**Default:** Compose routes, layouts, and mixed-framework pages in `.astro`. Astro can import and render multiple frameworks on the same page, but only `.astro` files should be the cross-framework seam.

```ts
// astro.config.ts
import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";
import svelte from "@astrojs/svelte";
import solid from "@astrojs/solid-js";

export default defineConfig({
  integrations: [UnoCSS(), svelte(), solid()],
});
```

```ts
// uno.config.ts
import { defineConfig, presetWind4 } from "unocss";

export default defineConfig({
  presets: [
    presetWind4({
      preflights: {
        reset: true,
      },
    }),
  ],
});
```

```js
// svelte.config.js
import { vitePreprocess } from "@astrojs/svelte";

export default {
  preprocess: vitePreprocess(),
};
```

```json
// tsconfig.json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"],
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "solid-js"
  }
}
```

**Reject:** Do not nest Solid inside Svelte or Svelte inside Solid directly. Do not port SvelteKit or SolidStart app-structure assumptions into Astro.

**Existing code:** If the repository already mixes frameworks incorrectly, do not redesign the whole component tree. Move new cross-framework composition into `.astro` and contain further spread there. citeturn7view1turn14view0turn15view0turn29view0turn30view0

### Use Astro-native routing, not adjacent-framework routing

**Default:** Add pages and endpoints under `src/pages/**`. Use plain anchor tags for navigation.

```astro
---
// src/pages/account/settings.astro
import SettingsPanel from "../../components/account/SettingsPanel.svelte";
---

<h1>Settings</h1>
<p><a href="/account/">Back to account</a></p>
<SettingsPanel client:idle />
```

**Reject:** Do not create route objects, loader files, framework `<Link>` components, or parallel app/router structures.

**Existing code:** Preserve current URLs. If a touched area still mirrors another meta-framework, migrate only the local route/component pair you are editing. citeturn7view5turn37view0

### Prefer server rendering first, then add hydration deliberately

**Default:** Framework components render as static HTML unless a `client:*` directive is present. Choose hydration based on urgency, not habit.

```astro
---
// src/pages/products.astro
import ProductFilters from "../components/products/ProductFilters.svelte";
import CompareDrawer from "../components/products/CompareDrawer.tsx";
---

<ProductFilters client:idle />
<CompareDrawer client:visible={{ rootMargin: "200px" }} />
```

Use this default order:

- `client:load` for immediately interactive, above-the-fold UI.
- `client:idle` for lower-priority controls.
- `client:visible` for below-the-fold or heavy widgets.
- `client:media` when interactivity is truly viewport-condition-dependent.
- `client:only` only when SSR is incompatible or actively undesirable.

**Reject:** Do not default to `client:only`. It skips server HTML and behaves like immediate client rendering.

**Existing code:** If touched code uses `client:load` everywhere, only downgrade the specific island you are editing when the interaction timing is obviously lower priority. citeturn7view1turn9view0

### Prefer plain Astro scripts for tiny behaviour

**Default:** If the page is mostly static and the interaction is DOM-local, use a standard Astro `<script>` before introducing an island.

```astro
<!-- src/components/CopyCodeButton.astro -->
<button type="button" data-copy-code class="rounded px-3 py-2 text-sm">
  Copy
</button>

<script>
  const buttons = document.querySelectorAll("[data-copy-code]");

  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
      await navigator.clipboard.writeText("copied");
    });
  });
</script>
```

**Reject:** Do not create a Svelte or Solid component just to attach one event listener.

**Existing code:** If a tiny island already exists and is stable, keep it unless the touched change is already shrinking that area. citeturn11view2turn7view1

### Routing, Data Loading & Server Work

### Fetch in server frontmatter by default

**Default:** In `.astro` files, fetch data in frontmatter. In static output it runs at build time; in SSR it runs at request time.

```astro
---
// src/pages/team.astro
const response = await fetch("https://example.com/api/team");
const team = await response.json();
---

<ul>
  {team.members.map((member) => <li>{member.name}</li>)}
</ul>
```

Pass fetched data down as props instead of re-fetching immediately in the island.

**Reject:** Do not fetch the same data again in a client island unless the feature genuinely needs client-side refresh or live updates.

**Existing code:** When touching a page that fetches on both server and client for the initial render, remove only the redundant local fetch path. citeturn7view4

### Use Astro Actions for app-internal mutations

**Default:** Use Actions for form posts and app-internal client-to-server mutations that benefit from type-safe input validation and shared calling conventions.

```ts
// src/actions/index.ts
import { defineAction, ActionError } from "astro:actions";
import { z } from "astro/zod";

export const server = {
  newsletter: defineAction({
    accept: "form",
    input: z.object({
      email: z.string().email(),
    }),
    handler: async ({ email }, context) => {
      if (!context.locals.user) {
        throw new ActionError({ code: "UNAUTHORIZED" });
      }

      // persist subscription here
      return { ok: true, email };
    },
  }),
};
```

```astro
---
// src/pages/newsletter.astro
export const prerender = false;
import { actions } from "astro:actions";
---

<form method="POST" action={actions.newsletter}>
  <label for="email">Email</label>
  <input id="email" name="email" type="email" required />
  <button type="submit">Subscribe</button>
</form>
```

**Conditional:** Form `action={actions.someAction}` requires on-demand rendering for that page. If the page must remain fully static, call the action from a client script or island instead.

**Security:** Actions are public endpoints under `/_actions/...`; authorise them like API routes. Put permission checks in each action handler, and gate globally in middleware only when that policy is truly shared.

**Reject:** Do not create an internal `fetch("/api/...")` endpoint just to move typed form data from your own UI to your own server.

**Existing code:** If the repository already uses endpoints for internal mutations, keep them unless the touched flow benefits materially from a local Action migration. citeturn12view0turn12view3turn12view4turn13view2turn13view0turn13view1

### Use endpoints for public HTTP or non-Action shapes

**Default:** Use endpoints in `src/pages/**` when you need a URL-addressable resource, webhook target, generated asset, feed, or API response shape meant for non-Astro consumers.

```ts
// src/pages/api/health.json.ts
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
```

**Conditional:** In static output, endpoints build static files; in SSR they execute on request. Use an adapter when you need on-demand behaviour.

**Existing code:** Keep existing stable endpoints for public consumers. Do not force Actions where URLs are part of the contract. citeturn7view3turn11view4

### Use server islands only when partial deferral really helps

**Default:** Reach for `server:defer` only when a personalised or slow server fragment should not block the rest of the page.

```astro
---
// src/pages/dashboard.astro
import PersonalFeed from "../components/dashboard/PersonalFeed.astro";
---

<PersonalFeed server:defer>
  <div slot="fallback">Loading feed…</div>
</PersonalFeed>
```

**Conditional:** `server:defer` needs an adapter and therefore an on-demand server environment.

**Reject:** Do not introduce server islands into otherwise simple static pages without a clear latency or personalisation reason.

**Existing code:** If the repository is fully static, surface the adapter requirement instead of silently converting the app to SSR. citeturn11view3turn11view4turn9view0

### Svelte Rules for New Code

### Use Svelte 5 syntax for new and heavily touched Svelte components

**Default:** New Svelte components should use runes syntax and callback props.

```svelte
<!-- src/components/forms/ToggleField.svelte -->
<script lang="ts">
  let pressed = $state(false);

  let {
    label,
    ontoggle,
  }: {
    label: string;
    ontoggle?: (next: boolean) => void;
  } = $props();
</script>

<button
  type="button"
  aria-pressed={pressed}
  class="inline-flex items-center gap-2 rounded px-3 py-2"
  onclick={() => {
    pressed = !pressed;
    ontoggle?.(pressed);
  }}
>
  <span>{label}</span>
  <span>{pressed ? "On" : "Off"}</span>
</button>
```

**Reject:** Do not write new Svelte 4-style `export let`, `on:click`, or `createEventDispatcher` patterns in fresh components.

**Existing code:** Svelte 5 still supports old syntax. Do not mass-convert untouched components. Migrate the touched component only when the edit already changes its interface or internal state logic. citeturn17view0turn19view0

### Use snippets for new reusable content APIs

**Default:** For new Svelte wrapper components, prefer snippet props and `{@render ...}` over slot-based internal APIs.

**Reject:** Do not design new library-like Svelte components around named slots if you are already writing Svelte 5 code.

**Existing code:** Existing slot-based components can stay until touched. When you touch them, migrate only the local public surface you are changing. citeturn17view5turn18view2

### Use `$effect` and `$effect.pre`, not deprecated update hooks

**Default:** Use `$effect` for post-update reactive side effects and `$effect.pre` when you need pre-DOM-update work.

**Reject:** Do not introduce `beforeUpdate` or `afterUpdate` in new runes components.

**Existing code:** Leave legacy hooks alone unless that component is already being refactored. citeturn17view3

### Use `$bindable` only when two-way component binding is intentionally part of the API

**Default:** Keep props one-way by default. Mark a prop bindable only when the component is intentionally exposing two-way state.

**Reject:** Do not make routine presentational component props bindable just because it is possible.

**Existing code:** If a component already overuses binding, reduce it only in the touched surface area. citeturn17view4

### Use stores conditionally, not by habit

**Default:** Prefer local rune state and plain props for ordinary component state.

**Conditional:** Use `svelte/store` when you truly need complex asynchronous streams, explicit subscription control, or shared store semantics that fit the existing repository.

**Reject:** Do not introduce stores for small local component state that is clearer as `$state` / `$derived`.

**Existing code:** Keep existing stores if they are stable and widely shared; do not rewrite them merely for style compliance. citeturn17view1

### Solid Rules for New Code

### Write Solid as Solid, not as React with different imports

**Default:** Use signals for state, memos for derived values, props objects for reactive reads, and Solid control-flow components for rendering logic.

```tsx
// src/components/counter/Counter.tsx
import { createMemo, createSignal, mergeProps, splitProps } from "solid-js";

type Props = {
  initial?: number;
  class?: string;
};

export function Counter(rawProps: Props) {
  const props = mergeProps({ initial: 0 }, rawProps);
  const [local, buttonProps] = splitProps(props, ["initial", "class"]);
  const [count, setCount] = createSignal(local.initial);
  const label = createMemo(() => `Count: ${count()}`);

  return (
    <button
      type="button"
      class={local.class}
      onClick={() => setCount((n) => n + 1)}
      {...buttonProps}
    >
      {label()}
    </button>
  );
}
```

**Reject:** Do not destructure `props` directly in Solid component parameters or at the top of the component when those values need to stay reactive.

**Existing code:** If touched code already destructures stale props, fix only the props involved in the edit. citeturn22search0turn20search1turn20search10

### Use `createMemo` for derived state and `createEffect` only for side effects

**Default:** Derived values belong in memos. Effects are for DOM integration, logging, subscriptions, or other side effects.

```tsx
// src/components/search/FilteredList.tsx
import { For, createMemo, createSignal } from "solid-js";

const ITEMS = ["Ada", "Grace", "Linus", "Margaret"];

export function FilteredList() {
  const [query, setQuery] = createSignal("");

  const filtered = createMemo(() =>
    ITEMS.filter((item) =>
      item.toLowerCase().includes(query().toLowerCase()),
    ),
  );

  return (
    <>
      <input
        value={query()}
        onInput={(e) => setQuery(e.currentTarget.value)}
        placeholder="Filter"
      />
      <ul>
        <For each={filtered()}>{(item) => <li>{item}</li>}</For>
      </ul>
    </>
  );
}
```

**Reject:** Do not compute derived state by setting another signal inside `createEffect`. Do not put side effects in memos.

**Existing code:** If an effect in a touched file is only deriving state, convert just that local chain to a memo. citeturn24search1turn24search2turn23view0turn22search6

### Use Solid control-flow primitives for reactive lists and conditionals

**Default:** Use `<Show>`, `<Switch>/<Match>`, `<For>`, and `<Index>` rather than treating JSX as React-style re-rendered templates.

- Use `<For>` when list order or length changes.
- Use `<Index>` when the list shape is stable but item values change frequently.
- Use `<Show>` for conditional branches, especially when you want lazy branch handling.

**Reject:** Do not default to `array.map()` for dynamic reactive list rendering.

**Existing code:** If `map()` is already stable in a local static case, leave it. Migrate only dynamic touched lists. citeturn26search0turn25search0turn25search1

### Respect Solid’s SSR and hydration timing

**Default:** Assume `createEffect` does not run during SSR and also does not run during initial client hydration. If the initial HTML must include async data, fetch it server-side in Astro or use integration-supported async Solid patterns.

**Conditional:** Astro’s Solid integration already wraps async and hydrating components in top-level suspense boundaries, so you do not need to add a top-level suspense wrapper just to support resources or lazy components.

**Reject:** Do not depend on `createEffect` for server-rendered initial data.

**Existing code:** If a touched Solid island relies on an effect for first-render content, move the initial data path up into Astro or into a proper async Solid pattern. citeturn22search6turn14view1

### UI, Styling & Components

### Keep UnoCSS utility names statically discoverable

**Default:** Use literal utility strings in `.astro`, `.svelte`, `.tsx`, or in explicitly scanned files. Prefer static lookup tables over dynamic string construction.

```ts
// src/lib/ui/button.ts
// @unocss-include
export const buttonClass = {
  primary:
    "inline-flex items-center justify-center rounded px-3 py-2 text-sm font-medium bg-primary text-white hover:bg-primary/90",
  ghost:
    "inline-flex items-center justify-center rounded px-3 py-2 text-sm font-medium hover:bg-muted",
} as const;

export type ButtonTone = keyof typeof buttonClass;
```

```astro
---
// src/components/ui/Button.astro
import { buttonClass, type ButtonTone } from "../../lib/ui/button";

interface Props {
  tone?: ButtonTone;
  href?: string;
}

const { tone = "primary", href, ...rest } = Astro.props;
const classes = buttonClass[tone];
---

{href ? (
  <a href={href} class={classes} {...rest}><slot /></a>
) : (
  <button type="button" class={classes} {...rest}><slot /></button>
)}
```

**Reject:** Do not build utilities via template strings such as `` `bg-${tone}-500` `` or `` `md:${size}` `` and assume UnoCSS will find them.

**Existing code:** Replace dynamic class construction in the touched area with static maps first. Use `safelist` only when the set is finite but too awkward to express inline. citeturn31view2turn31view0turn29view2

### Use `class:list` in `.astro` when conditional classes are still static

**Default:** In Astro components, use `class:list` to compose conditional static utility names without falling back to fragile string concatenation.

```astro
---
const selected = true;
const disabled = false;
---

<button
  class:list={[
    "inline-flex items-center rounded px-3 py-2",
    selected && "bg-primary text-white",
    disabled && "pointer-events-none opacity-50",
  ]}
>
  Save
</button>
```

**Reject:** Do not hand-roll concatenation logic in `.astro` when `class:list` keeps the utilities literal and compiler-visible.

**Existing code:** Convert only the local expression when you are already touching the element. citeturn7view0

### Use Uno shortcuts for repeated utility bundles, not for every one-off class list

**Default:** Keep small component-local styling inline. Introduce Uno `shortcuts` when the same utility cluster repeats across files or forms part of the design language.

```ts
// uno.config.ts
import { defineConfig, presetWind4 } from "unocss";

export default defineConfig({
  presets: [presetWind4({ preflights: { reset: true } })],
  shortcuts: {
    "ui-card": "rounded-xl border border-default bg-default p-4 shadow-sm",
    "ui-input":
      "w-full rounded border border-default bg-default px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary",
  },
});
```

**Reject:** Do not hiding every utility list behind custom class names. That throws away the main benefit of atomic styling.

**Existing code:** If a repeated bundle already exists as plain utilities, keep it inline until repetition is clearly hurting maintenance. citeturn32search20turn32search15

### Do not stack Tailwind tooling on top of UnoCSS by default

**Default:** For this stack, use `@unocss/astro` plus `presetWind4()` as the utility system.

**Conditional:** If the repository already contains `shadcn/ui` or `shadcn-svelte`, keep its generated source code and adapt only the touched components. Expect Tailwind-oriented global styles, tokens, and installation assumptions.

**Reject:** Do not add Tailwind/PostCSS tooling solely to satisfy shadcn examples when the repository’s styling system is already UnoCSS.

**Existing code:** If a repository already runs both Tailwind and UnoCSS, surface that as technical debt. Do not silently expand the overlap. citeturn29view0turn29view3turn30view1turn5view2turn4view6turn33search10

### Treat shadcn-generated code as project code, not a black box

**Conditional:** If the repository already uses `shadcn-svelte`, edit generated components as normal source files and keep changes local, explicit, and reversible. If it already uses official `shadcn/ui` Astro, remember that path assumes React integration.

**Fallback:** Without existing shadcn adoption, build the needed component directly in Astro, Svelte, or Solid with UnoCSS.

**Reject:** Do not introduce shadcn into a touched change just to get a button, dialog, or form shell.

**Existing code:** Preserve existing import aliases and generated file layout when touching shadcn code; do not regenerate the whole registry unless the task explicitly asks for that migration. citeturn4view6turn5view0turn33search10

### Security & Configuration

### Use `astro:env` modules for environment variables

**Default:** Import typed environment variables from `astro:env/client` and `astro:env/server`.

```ts
---
// src/pages/profile.astro
import { API_URL } from "astro:env/client";
import { API_SECRET } from "astro:env/server";

const response = await fetch(`${API_URL}/profile`, {
  headers: {
    Authorization: `Bearer ${API_SECRET}`,
  },
});
---
```

**Reject:** Do not leak secrets into client code. Secret client variables are not supported.

**Existing code:** If touched code reaches into environment variables loosely, migrate only the local reads first. citeturn11view1

### Reject unsanitised `set:html`

**Default:** Treat `set:html` as equivalent to setting `innerHTML`. Use it only for trusted or sanitised HTML.

```astro
---
const html = "<p>Trusted content</p>";
---

<Fragment set:html={html} />
```

**Reject:** Do not pipe user-generated or untrusted remote HTML straight into `set:html`.

**Existing code:** If touched code already uses `set:html` with uncertain input, surface it immediately as a security concern even if you do not broaden the refactor. citeturn9view0

### Enable CSP only when the project is ready for its constraints

**Conditional:** Astro 6 adds built-in `security.csp`. Enable it when the project has a real CSP requirement and can verify compatibility via `build` and `preview`.

**Fallback:** If the project does not already require CSP, keep the default and focus on sanitisation, typed env access, and authorisation checks.

**Risk:** Astro’s CSP support is not available in dev mode, does not support Astro’s `<ClientRouter />`, and has limitations around external scripts/styles and Shiki unless you provide appropriate hashes or alternatives.

**Existing code:** Do not switch CSP on as a side effect of an unrelated feature branch. citeturn11view5

## Testing, Tooling & Verification

Use repository scripts first. If the repository does not provide a script, fall back to the official Astro or Bun command.

| Trigger | Run | Failure means |
|---|---|---|
| Dependency or lockfile change | `bun install` and commit the resulting lockfile change intentionally | Dependency graph drift or unresolved install incompatibility. citeturn34search5turn34search11 |
| Any meaningful code change | `bun run build` if present, otherwise `bunx astro build` | Route, integration, SSR/SSG, or asset pipeline breakage. citeturn37view0 |
| Any `.astro`, content schema, TS, or integration change | `bun run check` if present, otherwise `bunx astro check` | Astro diagnostics or TypeScript errors; this is the main CI-grade structural check. citeturn37view0turn36search5 |
| Stale generated Astro types suspected | `bunx astro sync` | Generated `.astro/types.d.ts` and related types were stale. Note that `dev`, `build`, and `check` already run sync. citeturn37view0 |
| Repository already uses tests | the repository’s existing `bun run test`, `bun test`, or other test script | Behavioural regression in the project’s existing test stack. Do not add a new test runner only to satisfy this playbook. citeturn36search1turn22search2 |
| Bun-runtime-specific work | the repository’s Bun-targeted script, or `bunx --bun astro dev` for local parity when the repo intentionally targets Bun runtime | Bun-only incompatibility that may not appear when Astro falls back to Node execution. citeturn35search1turn36search1 |

Practical verification order for a normal feature branch:

1. Install or update dependencies with Bun.
2. Run the project’s type/diagnostic check.
3. Run the build.
4. Run focused tests if the repository already has them.
5. If the task changes runtime-sensitive behaviour and the repo explicitly targets Bun runtime, verify with the Bun runtime path as well. citeturn34search5turn37view0turn35search1

## Migration & Anti-Patterns

| Reject | Use instead | Existing-code migration |
|---|---|---|
| Svelte 4 syntax in new code: `export let`, `on:`, `createEventDispatcher`, `beforeUpdate`, `afterUpdate` | Svelte 5 runes, callback props, `onclick`, `$effect` / `$effect.pre`, snippets | Keep stable old components untouched. When editing a component deeply, migrate that component only. citeturn19view0turn17view3turn17view5 |
| New slot-based Svelte component APIs | Snippet props and `{@render ...}` | Leave working slot APIs until touched; migrate only the touched interface. citeturn18view2turn17view5 |
| Solid prop destructuring and React-style effect misuse | Prop object reads, `splitProps` / `mergeProps`, `createMemo` for derived state, `createEffect` for side effects only | Replace only the stale local pattern being edited. citeturn22search0turn20search1turn20search10turn24search1turn24search2 |
| `array.map()` for reactive Solid lists by habit | `<For>` or `<Index>` based on list stability | Migrate only dynamic/touched lists. Static one-off rendering can remain. citeturn26search0 |
| Astro pages that mimic another meta-framework’s router or link API | File routes in `src/pages/**` and standard `<a>` links | Preserve URLs; change only the touched route surface. citeturn7view5turn37view0 |
| Blanket `client:load` or `client:only` for all framework components | SSR by default plus the lightest suitable `client:*` directive | Downgrade the touched island when safe; do not audit the whole site unless asked. citeturn7view1turn9view0 |
| Runtime-generated Uno class names | Static maps, `class:list`, `safelist`, or explicit content scanning | Replace local dynamic strings first. If utilities live in `.ts` / `.js`, add scanning or `@unocss-include`. citeturn31view2turn31view0turn7view0 |
| Adding `@unocss/reset` alongside `presetWind4` reset usage | `presetWind4({ preflights: { reset: true } })` | Remove duplicate/reset drift only where touched. citeturn30view0turn30view1 |
| Using Actions without auth checks because they “feel internal” | Per-action auth/authorisation, same as API routes | Add checks to touched actions first; gate globally via middleware only if truly shared. citeturn13view2turn13view0turn13view1 |
| Introducing `shadcn/ui` or `shadcn-svelte` as a default dependency for this stack | Plain Astro/Svelte/Solid components with UnoCSS, or existing shadcn adoption if already present | Keep existing shadcn code if the repo uses it; do not introduce it in unrelated changes. citeturn5view2turn4view6turn33search10 |

## Quick Reference

### Preferred defaults

- Routes, layouts, and framework composition: `.astro` first. citeturn7view5turn7view1
- Small interaction on static markup: Astro `<script>`. citeturn11view2
- Interactive island: Svelte or Solid with the lightest `client:*` directive that satisfies UX. citeturn9view0turn7view1
- Internal server mutations: Astro Actions. citeturn12view0
- Public/webhook/resource URLs: Astro endpoints. citeturn7view3
- Utility CSS: UnoCSS `@unocss/astro` + `presetWind4()`. citeturn29view0turn29view3
- Repeated style bundles: Uno shortcuts, sparingly. citeturn32search20
- Conditional classes in `.astro`: `class:list`. citeturn7view0
- New Svelte files: Svelte 5 syntax. citeturn17view0turn19view0
- New Solid files: signals, memos, control-flow primitives, no prop destructuring. citeturn22search0turn24search1turn26search0
- Environment variables: `astro:env/client` and `astro:env/server`. citeturn11view1

### Use this, not that

| Use this | Not that |
|---|---|
| `.astro` route files | SvelteKit/SolidStart router patterns in Astro |
| `<a href="/path/">` | framework `<Link>` in Astro pages |
| SSR by default + `client:*` where needed | blanket `client:only` |
| Astro `<script>` for trivial DOM work | an island for every click handler |
| Actions for internal mutations | bespoke internal `/api/*` if no public API is needed |
| Static class maps and `class:list` | runtime utility-string concatenation |
| `presetWind4({ preflights: { reset: true } })` | extra reset packages layered on top |
| Svelte `$props`, callbacks, snippets | `export let`, `createEventDispatcher`, new slot-heavy APIs |
| Solid `createMemo` for derived state | setting signals inside `createEffect` for pure derivation |
| `splitProps` / `mergeProps` | eager Solid prop destructuring |

### File-location cheat sheet

- `src/pages/**` — routes and endpoints. citeturn7view5turn7view3
- `src/layouts/**` — Astro layout components.
- `src/components/**` — Astro, Svelte, and Solid UI components. Keep `client:only` components here unless Uno content scanning is configured otherwise. citeturn29view0
- `src/actions/index.ts` — Astro Actions entry point; split into imported modules if needed. citeturn12view4
- `src/content.config.ts` — content collections, schemas, and loaders. citeturn7view2
- `astro.config.*` — integrations, adapters, Astro runtime config. citeturn36search11
- `uno.config.ts` — Uno presets, shortcuts, safelist, content scanning. citeturn29view0turn29view2
- `svelte.config.js` — Svelte preprocess and integration-level compiler options. citeturn15view0
- `tsconfig.json` — project TS settings, including Solid’s `jsxImportSource` when using TSX. citeturn14view0

### Verification commands

- Install/update deps: `bun install` citeturn34search5turn34search11
- Check Astro/project diagnostics: `bun run check` or `bunx astro check` citeturn37view0turn36search5
- Generate Astro types when needed: `bunx astro sync` citeturn37view0
- Build for deployment: `bun run build` or `bunx astro build` citeturn37view0
- Run repo tests if present: `bun run test` or `bun test` citeturn36search1turn22search2
- Bun-runtime parity check when explicitly relevant: `bunx --bun astro dev` citeturn35search1turn36search1

### Top anti-drift warnings

- Astro is not SvelteKit and not SolidStart. Keep routing and data conventions Astro-native. citeturn7view5
- UnoCSS is not Tailwind tooling. `presetWind4` gives Tailwind-v4-style utilities, but extraction, config, and shadcn setup assumptions still differ. citeturn29view3turn31view2turn5view2turn4view6
- Svelte 5 is not “Svelte 4 forever”. New code should not keep reproducing deprecated event/props/slot patterns. citeturn19view0turn17view3turn17view5
- Solid is not React with different imports. Do not destructure props casually, and do not use effects for pure derivation. citeturn22search0turn24search1turn24search2
- shadcn is not a default fit for this stack. Adopt only when the repository already committed to it or the task explicitly requires it. citeturn5view2turn4view6turn33search10