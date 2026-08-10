# @telegraph/helpers

## 0.3.0

### Minor Changes

- [#949](https://github.com/knocklabs/telegraph/pull/949) [`5015089`](https://github.com/knocklabs/telegraph/commit/5015089fd7a94dde8214ef383fa78d86c3aec688) Thanks [@kylemcd](https://github.com/kylemcd)! - Infer Base UI `nativeButton` semantics from polymorphic Telegraph triggers using stable component resolvers and Motion intrinsic metadata.

## 0.2.0

### Minor Changes

- [#922](https://github.com/knocklabs/telegraph/pull/922) [`32a08b3`](https://github.com/knocklabs/telegraph/commit/32a08b3c8e4280c9d2f93f6bb53a76b8ab5e47b3) Thanks [@kylemcd](https://github.com/kylemcd)! - Restore prop validation across all components. Extracting props from a generic component (`TgphComponentProps<typeof Stack>`) instantiated the element type parameter at its constraint, making `React.ComponentProps<React.ElementType>` resolve to `any` and leaving a `{ [x: string]: any }` index signature on every inheriting component. That disabled excess-property checking _and_ widened declared props to `any`, so `<Button fontSize={16}>` and `<Button variant="nonsense">` both compiled.

  `PolymorphicProps` now drops the element passthrough when the element type is unresolved, and every inherited prop type threads the element parameter through (`StackProps<T>` rather than the bare form). **Breaking for type consumers** that were passing props which never belonged to a component — those are now errors. Props that genuinely exist are unaffected.

  Consequences worth knowing about:
  - **A `data-*` key alone in a nested prop bag is an error.** Two separate checks apply, and which one fires depends on the shape. A fresh object literal gets excess-property checking, so `textProps={{ "data-testid": "x" }}` fails. A variable does not, but it hits weak-type detection when it shares no property with an all-optional target, so a bag holding only `data-*` keys fails as well. Anything carrying one real prop passes either check:

    ```tsx
    <Text data-testid="x" />                      // fine, JSX exempts hyphenated attributes
    textProps={{ size: "2", "data-testid": "x" }} // fails, fresh literal
    textProps={{ size: "2", ...dataAttrs }}       // fine, spread properties are exempt
    textProps={bagWithARealProp}                  // fine, not fresh
    textProps={{ ...dataAttrs }}                  // fails, no property in common
    ```

    A `data-${string}` index signature on `PolymorphicProps` removes the limitation. It was measured against `control/dashboard` twice, before and after the passthrough deduplication: it fixes 0 errors there and adds 5 `TS2590` "union type is too complex to represent" at ordinary call sites such as `{...buttonProps}` and `kbdProps={{ ...kbdProps, name }}`. A compiler limit with no call-site workaround is a worse failure than an excess-property error with three, so it stays out.

  - `tgphRef` is no longer `any`. A ref whose element type does not match the component's is now an error — e.g. a `RefObject<HTMLDivElement>` on `Combobox.Trigger`, which renders a `button`.
  - `Input`'s `stackProps` and `Modal.Content`'s inherited `StackProps` are the non-generic form, which is `div`-shaped. Both wrappers do render a `div`, so element-specific props pushed through them are now correctly rejected.
  - `Input.Slot` is validated too. It took its props from `TgphSlotProps`, which intersects `Record<string, unknown>` so the slot primitive can merge arbitrary props onto its child. `Omit` over an index signature keeps the index signature, so every key was swallowed and `<Input.Slot position="middle" />` compiled. It now declares its own props. `TgphSlot` itself is unchanged.

  Also: `style` accepts CSS custom properties (`--*`) again, `Button.Root` declares `disabled` so it survives `as="a"`, and `Toggle` declares `disabled`/`required`/`name`.

  `CSSPropertiesWithVars` is a union rather than an intersection. `React.CSSProperties` is an interface, so it gains no implicit index signature, and an intersection with the `--*` half rejected every value declared as plain `CSSProperties` — including the common `({ style }: { style?: CSSProperties }) => <Stack style={style} />` wrapper.

### Patch Changes

- [#931](https://github.com/knocklabs/telegraph/pull/931) [`4de60e4`](https://github.com/knocklabs/telegraph/commit/4de60e4b49c051dc9c3399e573cf623dc397ae34) Thanks [@kylemcd](https://github.com/kylemcd)! - Update the READMEs for the prop-validation change.

  The `Modal.Content` custom-animation example passed `as={motion.div}`. `Modal.Content` always renders the animated element now, so the example animates a child instead. Copying it used to give a type error.

  `Popover.Content` drops its custom-animation example. The props table and the `skipAnimation` example already cover turning the built-in animation off.

  `Modal.Body` no longer documents `flex`, and the Tabs root no longer documents `disabled`. Neither prop existed. The catch-all index signature hid that.

  `Menu.Button` documents `as` and `nativeButton`. `SegmentedControl.Option` and `Select.Option` document `as`. `Select.Option` documents `label`.

  The `@telegraph/textarea` README documented seven props that do not exist: `autoResize`, `minRows`, `maxRows`, `showCharacterCount`, `state`, `errorMessage` and `helperText`. Roughly half its examples were built around them. It also gave `size` two values outside the scale, and the wrong default for `size` and `resize`. The README now documents the real component, and every example in it compiles.

  `@telegraph/helpers` gains a "Type checking" section covering the two cases that surprise people: a `data-*` key alone in a nested prop bag, and a `tgphRef` whose element type does not match. The README is the only prose that reaches an installed package, because no package publishes its changelog.

## 0.1.0

### Minor Changes

- [#837](https://github.com/knocklabs/telegraph/pull/837) [`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde) Thanks [@kylemcd](https://github.com/kylemcd)! - Add the Base UI render bridge used by the migration while preserving Telegraph `tgphRef` behavior and React 18 compatibility. This also adds `@base-ui/react` as a runtime dependency for shared helper primitives.

- [#837](https://github.com/knocklabs/telegraph/pull/837) [`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde) Thanks [@kylemcd](https://github.com/kylemcd)! - Replace Radix Slot usage in Appearance and Input with Telegraph helpers, and add shared `TgphSlot`, `VisuallyHidden`, and `useControllableState` exports for migrated components. Explicit appearance overrides now remain pinned instead of being overwritten by document-level appearance observer updates.

### Patch Changes

- [#837](https://github.com/knocklabs/telegraph/pull/837) [`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde) Thanks [@kylemcd](https://github.com/kylemcd)! - Migrate Popover internals from Radix UI to Base UI while preserving Telegraph styling, `tgphRef`, dismissal callbacks, focus callbacks, `avoidCollisions`, and `hideWhenDetached` compatibility. Also add shared Base UI compatibility helpers for migrated floating components.

- [#837](https://github.com/knocklabs/telegraph/pull/837) [`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde) Thanks [@kylemcd](https://github.com/kylemcd)! - Migrate Tabs from Radix primitives to Base UI while preserving Telegraph styling hooks and `tgphRef` support. `onValueChange` now honestly types the Base UI cleared-selection case as `string | null`, and list activation behavior is configured through `Tabs.List` props.

## 0.0.16

### Patch Changes

- [#830](https://github.com/knocklabs/telegraph/pull/830) [`f9c6e1c`](https://github.com/knocklabs/telegraph/commit/f9c6e1c078a1bd3d6a8e5eb0ce2dd6713ccc781e) Thanks [@kylemcd](https://github.com/kylemcd)! - fix(vite-config): emit declaration files to a consistent `dist/types` root

  Pin the TypeScript declaration root to `src` in the shared dts plugin config so
  every package emits its types to `dist/types/index.d.ts`. Previously, packages
  whose tsconfig omitted `rootDir` emitted to `dist/types/src/index.d.ts`, which
  did not match the `types` entrypoint declared in their `package.json`, so
  consumers received no type definitions (`@telegraph/compose-refs`, `helpers`,
  `input`, `modal`, `nextjs`, `tokens`).

  Pinning the declaration root also repairs degraded type emission that depended
  on the inferred root: `@telegraph/tabs` previously emitted a dangling
  `TgphElement` reference (`error TS2304: Cannot find name 'TgphElement'` for
  consumers), and `@telegraph/modal`'s `Content` prop type was widened to `any`.
  Both now emit correct, fully-resolved types.

  Also corrects the stale top-level `types` field in `@telegraph/tokens`.

## 0.0.15

### Patch Changes

- [#653](https://github.com/knocklabs/telegraph/pull/653) [`d6c6aa9`](https://github.com/knocklabs/telegraph/commit/d6c6aa9cb0e11ba96df7d7efd479c8e4652fc029) Thanks [@dependabot](https://github.com/apps/dependabot)! - chore(deps): bump react and @types/react

## 0.0.14

### Patch Changes

- [#650](https://github.com/knocklabs/telegraph/pull/650) [`c7ffe1d`](https://github.com/knocklabs/telegraph/commit/c7ffe1d85a0320dec6a05b1fd386ba0092c48e37) Thanks [@kylemcd](https://github.com/kylemcd)! - fix: infinite render issue with RefToTgphRef's interaction with radix's ref

## 0.0.13

### Patch Changes

- [#494](https://github.com/knocklabs/telegraph/pull/494) [`e769470`](https://github.com/knocklabs/telegraph/commit/e7694701fb63ebc65d9fe77d9a89c8f0bf557b67) Thanks [@kylemcd](https://github.com/kylemcd)! - update package exports to be in the correct order

## 0.0.12

### Patch Changes

- [#434](https://github.com/knocklabs/telegraph/pull/434) [`955c255`](https://github.com/knocklabs/telegraph/commit/955c25512468a67717de9e56a6b49f72ff53279e) Thanks [@kylemcd](https://github.com/kylemcd)! - adds support for custom triggers in the combobox

## 0.0.11

### Patch Changes

- [#384](https://github.com/knocklabs/telegraph/pull/384) [`552fb82`](https://github.com/knocklabs/telegraph/commit/552fb82a33203c87e58715b4a52ea0c360999636) Thanks [@dependabot](https://github.com/apps/dependabot)! - upgrade typescript dep

## 0.0.10

### Patch Changes

- [#408](https://github.com/knocklabs/telegraph/pull/408) [`916d37c`](https://github.com/knocklabs/telegraph/commit/916d37cc78433eeb70a93e041b18f951d2d25bcd) Thanks [@MikeCarbone](https://github.com/MikeCarbone)! - chore: minor upgrades to react, fixes peer dependency issues

- [#409](https://github.com/knocklabs/telegraph/pull/409) [`734b5c5`](https://github.com/knocklabs/telegraph/commit/734b5c5ee2ac0484a09f534148a4ca1cf23fb3d0) Thanks [@MikeCarbone](https://github.com/MikeCarbone)! - chore: adds React 19 as a peer dependency

## 0.0.6

### Patch Changes

- [#221](https://github.com/knocklabs/telegraph/pull/221) [`1b0bb33`](https://github.com/knocklabs/telegraph/commit/1b0bb333d6ca1664971d19d48d3b036c6711d554) Thanks [@kylemcd](https://github.com/kylemcd)! - useDeterminateState + button integration

## 0.0.5

### Patch Changes

- [#192](https://github.com/knocklabs/telegraph/pull/192) [`661854e`](https://github.com/knocklabs/telegraph/commit/661854eba8553eb7a112d1f3f5f5555a27729581) Thanks [@connorlindsey](https://github.com/connorlindsey)! - feat: add popover component. Pass ref through RefToTgphRef.

## 0.0.4

### Patch Changes

- [#174](https://github.com/knocklabs/telegraph/pull/174) [`9ab56ad`](https://github.com/knocklabs/telegraph/commit/9ab56ad877b964e1f21ff24312957cc6df519756) Thanks [@kylemcd](https://github.com/kylemcd)! - audit and fix dependencies

- [#172](https://github.com/knocklabs/telegraph/pull/172) [`96ac617`](https://github.com/knocklabs/telegraph/commit/96ac61740a39fa8f769946afdf16e02434c39770) Thanks [@kylemcd](https://github.com/kylemcd)! - button style-engine migration

## 0.0.3

### Patch Changes

- [#132](https://github.com/knocklabs/telegraph/pull/132) [`8d4c7bb`](https://github.com/knocklabs/telegraph/commit/8d4c7bb5031747c185faa31c0bc0aef7bd14d01c) Thanks [@kylemcd](https://github.com/kylemcd)! - first release of new menu component

## 0.0.2

### Patch Changes

- [#124](https://github.com/knocklabs/telegraph/pull/124) [`def3d89`](https://github.com/knocklabs/telegraph/commit/def3d89056aa54c0d24f74e33bc04df8efc712d9) Thanks [@kylemcd](https://github.com/kylemcd)! - better ts support for as prop with custom tgphRef

## 0.0.1

### Patch Changes

- [#73](https://github.com/knocklabs/telegraph/pull/73) [`0aa9613`](https://github.com/knocklabs/telegraph/commit/0aa9613512ac4fa6073bcf2542b3f67216ad1e7e) Thanks [@kylemcd](https://github.com/kylemcd)! - tag types fixes + helper types
