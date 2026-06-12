# Base UI Migration Final Cleanup

Last updated: 2026-06-12

## Purpose

This document records the final Radix cleanup audit for KNO-13678. It should be used with the PR description and the KNO-13677 checkpoint doc when preparing the project after-action report.

## Direct Dependency And Runtime Import Result

- Runtime source import scan for `@radix-ui/*` across package source returned no matches.
- Direct package manifest and lockfile scan for `@radix-ui/*` returned no matches.
- `@telegraph/filter` remains ignored for published migration scope because it is not published.

## Remaining Radix Reference Classification

The remaining `radix` matches are intentionally retained or historical:

- `packages/menu/src/Menu/Menu.tsx`, `packages/menu/src/Menu/Menu.test.tsx`, `packages/menu/README.md`, and `packages/combobox/src/Combobox/Combobox.tsx` retain `--radix-popper-*` CSS custom property names as an explicit compatibility contract for downstream styles.
- `packages/radio/src/RadioCards/RadioCards.tsx`, `packages/radio/src/RadioCards/RadioCards.test.tsx`, and `packages/tabs/src/Tabs/Tabs.test.tsx` retain Radix-compatible API/state wording because the migration intentionally keeps those public contracts while using Base UI internally.
- `packages/combobox/README.md`, `packages/select/README.md`, `packages/toggle/README.md`, and `packages/tooltip/README.md` retain short compatibility/no-longer-depends notes that document the migration outcome for consumers.
- `packages/compose-refs/src/compose-refs.ts` and `packages/compose-refs/README.md` retain source attribution for the original compose-refs implementation.
- `packages/helpers/src/components/RefToTgphRef/RefToTgphRef.tsx` retains one source attribution link for the original Slot merge behavior. The source comments and published README examples were updated away from Radix-specific integration guidance.
- `packages/tokens/README.md` retains a Radix Colors reference as design-token/color-system context, not component implementation guidance.
- Package changelogs retain historical dependency update entries.
- Migration docs, including this file and the KNO-13677 checkpoint, retain Radix mentions only to document audit commands, migration evidence, and accepted compatibility exceptions.

## Final Documentation Changes

- `packages/helpers/README.md` now uses Base UI examples for the active render-bridge guidance instead of old `@radix-ui/react-popover` and `@radix-ui/react-dialog` examples.
- `packages/helpers/README.md` now describes `RefToTgphRef` as a generic external-library bridge and keeps `createTgphBaseUIRender` as the preferred Base UI integration path.

## Final Verification Evidence

Completed locally for KNO-13678:

- `rg "@radix-ui|radix"` was run case-insensitively across packages, docs, root metadata, and `yarn.lock`, excluding changelogs/dist/node_modules. All active matches align with the classification above.
- Runtime source import scan for `@radix-ui/*`: no matches.
- Direct manifest and lockfile scan for `@radix-ui/*`: no matches.
- `yarn install --immutable`: passed with existing peer warning noise for root `postcss`/`vite`.
- `yarn check:base-ui-migration`: passed.
- `yarn check:react18`: passed.
- Prettier check for changed files: passed.
- `git diff --check`: passed.
- React/TypeScript best-practices audit for changed code: passed. The only changed TSX lines are source comments in `RefToTgphRef`; no implementation code patterns were added.
- `yarn test`: passed. 31 test files, 413 tests.
- `yarn build:packages`: exited 0. It still prints inherited declaration-generator diagnostics in existing packages (`nextjs`, `style-engine`, `link`, `tabs`, and unpublished `filter`), but all 31 package build tasks completed successfully.
- `yarn lint`: passed. 30 package lint tasks successful.
- `yarn build:storybook`: passed. Empty CSS warnings for Combobox, Tag, and Tooltip are expected because those packages currently emit empty package CSS.

## Final Storybook Smoke Evidence

Browser evidence was captured with the Codex in-app Browser only and a single local static Storybook preview server on port 3005. The local server was stopped after verification and port 3005 was confirmed clear.

Evidence files:

- `/private/tmp/telegraph-final-cleanup-kno-13678/storybook-dom-smoke-results.json`
- `/private/tmp/telegraph-final-cleanup-kno-13678/storybook-targeted-dom-results.json`
- `/private/tmp/telegraph-final-cleanup-kno-13678/tooltip-hover-results.json`

Local and published baseline checks completed:

- Popover default story rendered one open `role="dialog"` locally and in the published baseline.
- Menu default trigger opened one `role="menu"` with four `role="menuitem"` elements locally and in the published baseline.
- Modal trigger opened one `role="dialog"` locally and in the published baseline.
- Combobox single-select trigger opened one `role="listbox"` with five `role="option"` elements locally and in the published baseline.
- Select single-select trigger opened one `role="listbox"` with two `role="option"` elements locally and in the published baseline.
- SegmentedControl Center option became selected locally and in the published baseline. Local uses `aria-pressed="true"`; the published baseline uses `data-state="on"` with `role="radio"`.
- Tooltip local `Open` story rendered one `role="tooltip"`. Published baseline hover on the default story rendered one `role="tooltip"`.

The in-app Browser screenshot API repeatedly timed out on `Page.captureScreenshot`, including with clipped viewport captures and after reconnecting the Browser session. No Chrome or alternate browser was used. Because KNO-13678 only changes docs/comments, final visual confidence relies on the KNO-13677 screenshot matrix plus this final DOM/ARIA smoke pass.
