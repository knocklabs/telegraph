# Base UI Migration Stack Checkpoint

Last updated: 2026-06-12

## Purpose

This document records the stack-wide checkpoint for KNO-13677 before the final Radix cleanup layer. It complements the PR description with a durable local record of what was checked, what remains, and which evidence should be re-used in the after action report.

## Checkpoint Scope

- React 18 compatibility across migrated packages.
- Remaining Radix runtime imports, dependencies, compatibility variables, and historical/documentation references.
- README coverage for packages touched by the migration stack.
- Local package, test, lint, and Storybook validation.
- Visual and functional Storybook checks in the Codex in-app Browser only, compared against the published baseline at `https://telegraph-storybook.vercel.app/`.

## Repeatable Command

Run:

```sh
yarn check:base-ui-migration
```

The command verifies:

- all published packages that import React declare the expected React 18/19 peer range;
- migrated Base UI packages declare the expected React DOM 18/19 peer range;
- migrated package source avoids known React 19-only APIs;
- published packages outside the intentionally unpublished `@telegraph/filter` package do not retain runtime `@radix-ui/*` imports or dependencies;
- migrated package READMEs document Base UI implementation notes and do not keep stale Radix primitive references;
- published Tooltip consumers still have package READMEs available for verification.

## Current Radix Classification

Runtime Radix imports/dependencies should be zero outside `@telegraph/filter`.

Expected non-runtime references before final cleanup:

- `packages/menu/src/Menu/Menu.tsx` maps Base UI positioning variables to Radix-compatible `--radix-popper-*` CSS custom properties for downstream style compatibility.
- `packages/combobox/src/Combobox/Combobox.tsx` consumes those Radix-compatible popper variables to preserve the previous public styling contract.
- `packages/menu/src/Menu/Menu.test.tsx` verifies the compatibility custom property mapping.
- `packages/compose-refs` source and README retain attribution/docs for the original Radix compose-refs implementation.
- `packages/helpers` docs retain external-library interop examples that mention Radix; these are documentation examples, not Telegraph runtime dependencies.
- package changelogs retain historical dependency update entries.
- `@telegraph/filter` remains out of scope because it is not published.

## Storybook Coverage Plan

Use one local Storybook server only. Build affected packages before browser checks, start Storybook with `yarn dev:storybook`, and stop it after evidence is captured.

Compare local `http://localhost:3005/iframe.html?...` stories against published baseline `https://telegraph-storybook.vercel.app/iframe.html?...` for:

- Appearance and Input Slot-backed stories.
- Tabs default, controlled, force-mounted, disabled, and overflow/menu states.
- RadioCards default, controlled, disabled, and keyboard states.
- Popover default, placements, controlled, nested, and close behavior.
- Tooltip default/open/placement states and downstream consumers in Truncate, Tag, and DataList.
- Menu default, grouped, checkbox/radio, nested submenu, disabled, and portal positioning states.
- SegmentedControl single, multiple, disabled, vertical, and overflow states.
- Toggle default, checked, disabled, icon, and form states.
- Modal default, controlled, nested stacking, focus return, and dismiss states.
- Combobox single, multi, clearable, search, empty, create, legacy, and controlled-open states.
- Select single, multi, clearable, disabled, and keyboard states.

## Evidence Ledger

Completed locally for KNO-13677:

- `yarn check:base-ui-migration`: passed. Reported zero runtime `@radix-ui` imports outside `@telegraph/filter`, zero `@radix-ui` package dependencies outside `@telegraph/filter`, zero stale migrated README Radix references, zero missing Base UI README notes, and zero Tooltip consumer README failures.
- `yarn check:react18`: passed through the same checkpoint script. This verifies React peer ranges, React DOM peer ranges for migrated packages, and absence of known React 19-only source API usage outside the unpublished Filter package.
- Runtime Radix import scan: `rg -n "from [\"']@radix-ui|require\\([\"']@radix-ui|import\\([\"']@radix-ui" packages --glob 'src/**/*.{ts,tsx,js,jsx}'` returned no matches.
- Radix package dependency scan: `rg -n '"@radix-ui/' packages/*/package.json package.json` returned no matches.
- Broad non-changelog Radix scan: remaining matches are Radix-compatible popper CSS custom properties in Menu/Combobox, helper attribution/docs, Tokens' Radix Colors reference, and helper README external-library examples.
- README audit: Tabs and SegmentedControl references were updated from Radix primitive links to Base UI primitive links. Toggle README now explicitly documents that it no longer depends on Radix.
- `yarn manypkg:check`: passed.
- `git diff --check`: passed.
- Prettier check for changed files: passed.
- React/TypeScript best-practices audit for changed code: passed. This PR adds a JavaScript checkpoint script and docs only; the script uses const arrow helpers, avoids default React namespace usage, avoids TypeScript interfaces/enums, and does not touch TS/TSX component source.
- `yarn test`: passed. 31 test files, 413 tests.
- `yarn build:packages`: exited 0. It still prints inherited declaration-generator diagnostics in unrelated existing packages (`nextjs`, `style-engine`, `link`, `tabs`, and unpublished `filter`), but all 31 package build tasks completed successfully.
- `yarn lint`: passed. 30 package lint tasks successful.
- `yarn build:storybook`: passed. Empty CSS warnings for Combobox, Tag, and Tooltip are expected because those packages currently emit empty package CSS.
- Storybook dev no-open smoke test: `storybook dev -p 3005 --no-open --exact-port --ci --smoke-test --no-version-updates --disable-telemetry --loglevel warn` passed when allowed to bind the local port.
- Storybook visual and DOM parity evidence: captured in `/private/tmp/telegraph-stack-checkpoint-kno-13677`.

Browser evidence files:

- `browser-state.json`: local and published state captures for the desktop visual matrix.
- `browser-mobile-state.json`: local and published state captures for mobile-width dense stories.
- `portal-checks.json`: local and published portal/open-state checks for Menu, Modal, Combobox, Select, and Popover.
- `keyboard-checks.json`: local Escape-key checks for Menu, Modal, Combobox, Select, and Popover.
- `local-*.png` and `published-*.png`: screenshot pairs captured with the Codex in-app Browser only.

Visual coverage completed:

- Desktop local/published screenshot pairs: Input leading icon, Tooltip default, Popover default open, TruncatedText custom tooltip story, Tag default, DataList default, Tabs second tab, RadioCards option 2, Menu default open, Menu submenu root open, SegmentedControl center selected, Toggle checked, Modal open, Combobox open, and Select open.
- Mobile local/published screenshot pairs: SegmentedControl scrollable, Combobox multi-select wrap layout, and Modal open.
- Manual visual inspection found the representative local/published pairs aligned for Menu, Combobox, Modal, mobile SegmentedControl, and mobile Combobox.

Functional and accessibility smoke evidence:

- Tabs: second tab selected and second panel visible.
- RadioCards: second radio checked.
- SegmentedControl: center option pressed.
- Toggle: checkbox checked through the visible label.
- Menu: `role="menu"` opens with expected menu items; Escape closes and returns focus to the trigger.
- Modal: `role="dialog"` opens in a portaled `.tgph` surface; Escape closes and returns focus to the opener.
- Combobox and Select: open state exposes `role="listbox"` with expected options; Escape closes the listbox.
- Popover: open state exposes `role="dialog"`; Escape flips trigger `aria-expanded` to `false` and unmounts after the exit animation.

CI and BugBot/watch status: pending until the PR is submitted.
