# Interactive CSS Generator – Implementation Plan

This document captures the agreed-upon approach for auto-generating **hover / focus / active / focus-within** styles from the `cssVars` maps at build time, using a custom **Vite plugin**.

```tsx
// Example – desired developer experience

import { Box } from "@telegraph/layout";

export const Demo = () => <Box hover={{ h: "10", bg: "blue-5" }}>Hover me</Box>;

// When the element is hovered the plugin-generated CSS will automatically
// apply `height: var(--tgph-spacing-10)` and `background-color: var(--tgph-blue-5)`
// by swapping the corresponding custom properties—no extra styles required.
```

---

## 0. Goals

- Authors **only** maintain TypeScript/JS style maps (`cssVars`).
- Build pipeline emits the complete CSS, including pseudo-state overrides.
- No runtime listeners; final CSS is static.
- Works in both dev (HMR) and prod builds.

---

## 1. Design Decisions

| Decision                                                          | Rationale                                                          |
| ----------------------------------------------------------------- | ------------------------------------------------------------------ |
| **Source of truth** = `cssVars` export in each `*.constants.ts`   | Keeps logic in one place, already used by `useStyleEngine`.        |
| Supported states: `hover`, `focus`, `active`, `focus_within`      | Covers current needs; extendable.                                  |
| Integration target = append to each package’s `default.css`       | Keeps existing CSS intact; PostCSS still minifies aggregated file. |
| Plugin lives in `packages/vite-config/src/style-engine-plugin.ts` | Central & reusable.                                                |

---

## 2. Plugin Responsibilities

1. **Discovery**

   - On `buildStart`, glob `packages/**/src/**/*.constants.ts`.
   - Load each file via `vite.ssrLoadModule` to get its `cssVars`.

2. **CSS Generation**  
   For each key `k` in `cssVars`:

   - `baseProp` = `cssVars[k].cssVar` (e.g. `--background-color`).
   - For every pseudo-state `s`:
     - `syntheticVar` = `--${s}_${k}`.
     - `selector` = map → `:hover`, `:focus-visible`, …
     - Add line: `${selector}{ ${baseProp}: var(${syntheticVar}); }`.
   - Prepend default declarations for non-state props in the base rule (`.tgph-box` etc.).

3. **CSS integration**

   - Locate the package’s `src/default.css` file (same folder as the constants file).
   - Append an `/* AUTO-GENERATED START */ … /* AUTO-GENERATED END */` block containing the pseudo-state rules **after** existing content.
   - On rebuilds, detect and replace that block instead of duplicating, ensuring developer-authored CSS remains untouched.
   - Because `default.css` is already included in every package build, the new rules flow through the existing PostCSS/minify pipeline automatically—no extra imports or virtual modules.

4. **Dev-time watch**
   - On change to any `*.constants.ts`, regenerate that component’s CSS and trigger HMR.

---

## 3. Codebase Modifications

1. **Add plugin package**

   ```ts
   // packages/vite-config/src/style-engine-plugin.ts
   export function tgphStyleEngine() {
     /* implementation */
   }
   ```

2. **Wire plugin into Vite configs**

   ```ts
   // apps/relay/next.config.ts (or vite.config.ts)
   plugins: [tgphStyleEngine() /* existing plugins */];
   ```

3. **Primitives**

   - Remove manual interactive keys from `*.constants.ts`.
   - Delete hand-written `:hover` / `:focus` rules from `*.styles.css`.
   - **Move any default CSS custom property values** (e.g., `--background-color: none;`) **from existing `*.styles.css` files into the corresponding `cssVars` map**. The generator will emit those defaults into `default.css`, keeping all styling logic co-located in TypeScript.
   - No additional imports required; the plugin augments `default.css` automatically.

4. **Runtime helper tweak**
   Replace `interactive` flag logic in `getStyleProp` with a prefix check:
   ```ts
   const interactive = /^(?:hover|focus|active|focus_within)_/.test(key);
   ```

---

## 4. Testing Strategy

### Unit-test plan for the Vite plugin (no integration / no snapshots)

1. **Expose pure helpers**  
   The plugin file should export, in addition to the default `tgphStyleEngine()` function, two pure utilities:

   - `collectCssVars(globPattern: string): Promise<ComponentMap>` – returns `{ componentName ➜ cssVars }`.
   - `generateInteractiveCss(componentName: string, cssVars: CssVars): string` – returns the auto-generated CSS string for that component.

2. **Test cases (Vitest)**

| File                             | Purpose                                                                                                                                                              |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `collectCssVars.spec.ts`         | Mock a small virtual file-system using `mock-fs`; ensure it discovers constants files and returns the right structure.                                               |
| `generateInteractiveCss.spec.ts` | Feed minimal `cssVars` input, assert (with `expect(string).toContain(...)`) that critical lines appear for each state. **No snapshots** – use deterministic expects. |
| `idempotentAppend.spec.ts`       | Given an existing `default.css` string with an old auto-generated block, ensure `appendInteractiveBlock()` replaces it without touching preceding rules.             |

3. **Utilities for tests**

   - Use `stripIndent` from `common-tags` to format inline CSS literals.
   - Keep asserts granular (`toContain('--hover_padding:')`, etc.) instead of snapshotting whole files.

4. **Location**  
   `packages/vite-config/__tests__/` with each `*.spec.ts` co-located.  
   Vitest config already exists (`vitest/config.ts`). No additional setup is required.

5. **CI step**  
   Add a CI step that runs `yarn test --filter packages/vite-config` (Vitest workspaces respect the filter) so only the plugin’s unit tests run.

---

## 5. Roll-out & Compatibility

- Keep old prop names (`hover_backgroundColor`) temporarily; map them in generator for backward compatibility.
- Publish plugin as `@telegraph/vite-style-engine`.
- Provide migration guide: “delete interactive keys, add `auto-css` import.”

---

## 6. Timeline (suggested)

| Week | Tasks                                                      |
| ---- | ---------------------------------------------------------- |
| 1    | Prototype plugin with Box. Validate dev & prod.            |
| 2    | Migrate Stack, Text; write tests.                          |
| 3    | Migrate remaining primitives, update docs, publish plugin. |

---

## 7. Risks & Mitigations

| Risk                                | Mitigation                                                  |
| ----------------------------------- | ----------------------------------------------------------- |
| Dynamic prop names not detected     | Document rule: prop keys must be literals/consts.           |
| Build performance on large projects | Cache by `mtime` & hash; run in worker.                     |
| Missing CSS import                  | Plugin can auto-inject virtual import via `transform` hook. |

---

### Outcome

_Zero manual interactive CSS. Developers edit TypeScript, the build creates robust, compressed, and perfectly-synced styles._

---

### Implementation Checklist (for background agent)

> Tick each box as you complete the work. Keep the list in the same order so reviewers can follow progress.

#### 1 Vite Plugin core

- [ ] **Create `packages/vite-config/src/style-engine-plugin.ts`** containing the exported `tgphStyleEngine()` Vite plugin.
- [ ] **Implement helper `collectCssVars(globPattern)`** that returns a map of component names → `cssVars` export.
- [ ] **Implement helper `generateInteractiveCss(componentName, cssVars)`** that returns the CSS string for all pseudo-states.
- [ ] **Implement `appendInteractiveBlock(defaultCssPath, cssString)`** which inserts/replaces the `/* AUTO-GENERATED START */` block at the end of `default.css`.
- [ ] **Wire discovery, generation and append logic** inside the plugin lifecycle hooks (`buildStart`, `handleHotUpdate`).
- [ ] Ensure the plugin uses `vite.ssrLoadModule` (server-side) so TS/ESM files load without additional build steps.
- [ ] Add `STATE_MAP` constant `{ hover: ':hover', focus: ':focus-visible', active: ':active', focus_within: ':has(:focus-within)' }`.

#### 2 Runtime updates

- [ ] **Modify `getStyleProp`** to detect interactive props via prefix regex instead of `matchingCssVar.interactive`.
- [ ] **Remove `interactive` flag usage in component code (e.g., `Box.tsx`) if no longer needed.**

#### 3 Primitives cleanup

- [ ] **Strip manual `hover_*`, `focus_*`, `active_*`, `focus_within_*` keys** from every `*.constants.ts`.
- [ ] **Move default custom-property values** (currently in `*.styles.css`) into their corresponding `cssVars` entries.
- [ ] **Delete hand-written pseudo-state rules** from each `*.styles.css` (Box, Stack, etc.).

#### 4 Vite / Next config

- [ ] **Import and register the plugin** in every Vite config (e.g., `apps/relay/next.config.ts`, `examples/*`, templates).

#### 5 Unit tests (Vitest only)

- [ ] **Create `packages/vite-config/__tests__/collectCssVars.spec.ts`** – validates discovery logic via `mock-fs`.
- [ ] **Create `generateInteractiveCss.spec.ts`** – asserts generated CSS contains expected rules (no snapshots).
- [ ] **Create `idempotentAppend.spec.ts`** – ensures `appendInteractiveBlock` is idempotent.
- [ ] **Update `vitest/config.ts`** if necessary to alias plugin path.

#### 6 CI & scripts

- [ ] **Add workspace-focused test command** (`yarn test --filter packages/vite-config`) to CI workflow.

#### 7 Migration & cleanup

- [ ] **Run `yarn build:packages`** and ensure no style regressions in Storybook / visual tests.
- [ ] **Remove deprecated imports or flags** (e.g., `.tgph-box--interactive` class if now redundant).

#### 8 Documentation

- [ ] **Update README / docs** in relevant packages to explain the new `hover`, `focus`, `active` object prop API and removal of manual CSS.

> Remember: _Only unit tests; no integration or snapshot tests are required._

---
