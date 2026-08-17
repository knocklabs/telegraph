# @telegraph/link

## 0.2.2

### Patch Changes

- [#955](https://github.com/knocklabs/telegraph/pull/955) [`259502e`](https://github.com/knocklabs/telegraph/commit/259502ec33f9ce3c14406edff3341bfd0ecaabf5) Thanks [@kylemcd](https://github.com/kylemcd)! - feat: fix polymorphic prop types dropping `className`, `children` and `style`

  Adds a standalone TypeScript 7 type-check (`yarn type:check`, `typescript@7.0.2`
  aliased as `typescript-7` so it can coexist with the TypeScript the build needs)
  plus a CI job, and fixes the prop-type defect it surfaced.

  `PolymorphicProps` declares `children`, `className` and `style` explicitly so
  they survive when the element passthrough is dropped for an unresolved element
  type. The standard-library `Omit` is `Pick<T, Exclude<keyof T, K>>`, and that
  `keyof`/`Pick` round-trip discards those declarations when the type it wraps is
  still generic. Every props type built with it therefore lost them: a component
  generic over its element could not read its own `className`. `RemappedOmit`
  removes keys in place and keeps them, so the affected props types now use it.

  No runtime change, and no component body needed editing: the affected components
  already read these props, the types just never admitted it because nothing
  type-checked them. The props each component accepts are otherwise unchanged.

  One exception, in `@telegraph/modal`: `Modal.Body`, `Modal.Header` and
  `Modal.Footer` no longer accept `color`. They render a `Stack`, which drops
  `color` on purpose because React accepts it on any element and it renders an
  attribute that paints nothing. Pass a color through `<Text>` instead.

- Updated dependencies [[`ef8d6c6`](https://github.com/knocklabs/telegraph/commit/ef8d6c60bc8ca3d7f0597bd99bd96a898285e25e), [`259502e`](https://github.com/knocklabs/telegraph/commit/259502ec33f9ce3c14406edff3341bfd0ecaabf5)]:
  - @telegraph/helpers@0.3.1
  - @telegraph/icon@0.6.2
  - @telegraph/layout@0.6.3
  - @telegraph/typography@0.5.2

## 0.2.1

### Patch Changes

- Updated dependencies [[`5015089`](https://github.com/knocklabs/telegraph/commit/5015089fd7a94dde8214ef383fa78d86c3aec688)]:
  - @telegraph/helpers@0.3.0
  - @telegraph/icon@0.6.1
  - @telegraph/layout@0.6.2
  - @telegraph/typography@0.5.1

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

- Updated dependencies [[`32a08b3`](https://github.com/knocklabs/telegraph/commit/32a08b3c8e4280c9d2f93f6bb53a76b8ab5e47b3), [`4de60e4`](https://github.com/knocklabs/telegraph/commit/4de60e4b49c051dc9c3399e573cf623dc397ae34), [`de498f8`](https://github.com/knocklabs/telegraph/commit/de498f80da2b93ddf252d3699088658039dda859), [`3498748`](https://github.com/knocklabs/telegraph/commit/3498748c83003c7dfbc9f7364fd3f2ae9a7871c5)]:
  - @telegraph/helpers@0.2.0
  - @telegraph/layout@0.6.0
  - @telegraph/typography@0.5.0
  - @telegraph/icon@0.6.0

## 0.1.8

### Patch Changes

- [#880](https://github.com/knocklabs/telegraph/pull/880) [`c5145da`](https://github.com/knocklabs/telegraph/commit/c5145daf880a13a59205992f3edf765402e8cdfa) Thanks [@dependabot](https://github.com/apps/dependabot)! - chore(deps): bump lucide-react from 1.16.0 to 1.23.0

- Updated dependencies [[`c5145da`](https://github.com/knocklabs/telegraph/commit/c5145daf880a13a59205992f3edf765402e8cdfa)]:
  - @telegraph/icon@0.5.4

## 0.1.7

### Patch Changes

- Updated dependencies [[`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde), [`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde), [`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde), [`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde), [`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde)]:
  - @telegraph/helpers@0.1.0
  - @telegraph/layout@0.5.2
  - @telegraph/icon@0.5.3
  - @telegraph/typography@0.4.2

## 0.1.6

### Patch Changes

- Updated dependencies [[`f9c6e1c`](https://github.com/knocklabs/telegraph/commit/f9c6e1c078a1bd3d6a8e5eb0ce2dd6713ccc781e)]:
  - @telegraph/helpers@0.0.16
  - @telegraph/layout@0.5.1
  - @telegraph/icon@0.5.2
  - @telegraph/typography@0.4.1

## 0.1.5

### Patch Changes

- [#813](https://github.com/knocklabs/telegraph/pull/813) [`ef0aa8e`](https://github.com/knocklabs/telegraph/commit/ef0aa8e6bcf08c7108a3e3cc0261d543faaf2bb2) Thanks [@dependabot](https://github.com/apps/dependabot)! - chore(deps): bump lucide-react from 0.544.0 to 1.14.0

- Updated dependencies [[`ef0aa8e`](https://github.com/knocklabs/telegraph/commit/ef0aa8e6bcf08c7108a3e3cc0261d543faaf2bb2)]:
  - @telegraph/icon@0.5.1

## 0.1.4

### Patch Changes

- Updated dependencies [[`3c100cf`](https://github.com/knocklabs/telegraph/commit/3c100cf78d2b322f674e2f170860f938ea3b69a3)]:
  - @telegraph/typography@0.4.0
  - @telegraph/icon@0.5.0

## 0.1.3

### Patch Changes

- Updated dependencies [[`1de6cf1`](https://github.com/knocklabs/telegraph/commit/1de6cf1874835db4389f5e7f14fbcc694229a5de)]:
  - @telegraph/typography@0.3.0
  - @telegraph/icon@0.4.1
  - @telegraph/layout@0.5.0

## 0.1.2

### Patch Changes

- Updated dependencies [[`627e61c`](https://github.com/knocklabs/telegraph/commit/627e61c3b17ccfc36f5fb835bb5f21a092efca95)]:
  - @telegraph/layout@0.5.0
  - @telegraph/icon@0.4.0
  - @telegraph/typography@0.2.1

## 0.1.1

### Patch Changes

- [#698](https://github.com/knocklabs/telegraph/pull/698) [`c2e8391`](https://github.com/knocklabs/telegraph/commit/c2e8391342a372b2bc6aa5e29a6c86f816491401) Thanks [@kylemcd](https://github.com/kylemcd)! - feat: first version of the link component
