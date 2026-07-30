# @telegraph/data-list

## 0.3.0

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

- Updated dependencies [[`32a08b3`](https://github.com/knocklabs/telegraph/commit/32a08b3c8e4280c9d2f93f6bb53a76b8ab5e47b3), [`4de60e4`](https://github.com/knocklabs/telegraph/commit/4de60e4b49c051dc9c3399e573cf623dc397ae34), [`de498f8`](https://github.com/knocklabs/telegraph/commit/de498f80da2b93ddf252d3699088658039dda859), [`88ea929`](https://github.com/knocklabs/telegraph/commit/88ea9296955fd6202c01686cfe2b097306019a19), [`3498748`](https://github.com/knocklabs/telegraph/commit/3498748c83003c7dfbc9f7364fd3f2ae9a7871c5)]:
  - @telegraph/helpers@0.2.0
  - @telegraph/layout@0.6.0
  - @telegraph/typography@0.5.0
  - @telegraph/icon@0.6.0
  - @telegraph/tooltip@0.6.0

## 0.2.4

### Patch Changes

- [#837](https://github.com/knocklabs/telegraph/pull/837) [`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde) Thanks [@kylemcd](https://github.com/kylemcd)! - Verify published Tooltip consumers against the Base UI-backed implementation and preserve their trigger refs, optional tooltip labels, and Radix-compatible trigger state attributes. TooltipIfTruncated now documents and tests that an explicit `label` takes precedence over child text when both are provided.

- Updated dependencies [[`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde), [`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde), [`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde), [`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde), [`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde), [`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde), [`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde)]:
  - @telegraph/helpers@0.1.0
  - @telegraph/tooltip@0.5.0
  - @telegraph/layout@0.5.2
  - @telegraph/icon@0.5.3
  - @telegraph/typography@0.4.2

## 0.2.3

### Patch Changes

- Updated dependencies [[`f9c6e1c`](https://github.com/knocklabs/telegraph/commit/f9c6e1c078a1bd3d6a8e5eb0ce2dd6713ccc781e)]:
  - @telegraph/helpers@0.0.16
  - @telegraph/layout@0.5.1
  - @telegraph/icon@0.5.2
  - @telegraph/tooltip@0.4.1
  - @telegraph/typography@0.4.1

## 0.2.2

### Patch Changes

- Updated dependencies [[`03cfc99`](https://github.com/knocklabs/telegraph/commit/03cfc99c839a753e81d0d1fec2f7b167c0160038)]:
  - @telegraph/tooltip@0.4.0

## 0.2.1

### Patch Changes

- Updated dependencies [[`c335807`](https://github.com/knocklabs/telegraph/commit/c33580795d3e75d921449a5684ff7aaff1c2c482)]:
  - @telegraph/tooltip@0.3.0

## 0.2.0

### Minor Changes

- [#746](https://github.com/knocklabs/telegraph/pull/746) [`a1f2d79`](https://github.com/knocklabs/telegraph/commit/a1f2d79d904ab66c1d9494c0a27dbdd7426984f1) Thanks [@ksorathia](https://github.com/ksorathia)! - Standardize row layouts in `DataList`

### Patch Changes

- Updated dependencies [[`f9dcbe7`](https://github.com/knocklabs/telegraph/commit/f9dcbe7bd8c79afd3dd25329b1f6ea6df202f85a)]:
  - @telegraph/tooltip@0.2.2

## 0.1.4

### Patch Changes

- Updated dependencies [[`3c100cf`](https://github.com/knocklabs/telegraph/commit/3c100cf78d2b322f674e2f170860f938ea3b69a3)]:
  - @telegraph/typography@0.4.0
  - @telegraph/icon@0.5.0
  - @telegraph/tooltip@0.2.1

## 0.1.3

### Patch Changes

- Updated dependencies [[`1de6cf1`](https://github.com/knocklabs/telegraph/commit/1de6cf1874835db4389f5e7f14fbcc694229a5de), [`d3b6fee`](https://github.com/knocklabs/telegraph/commit/d3b6fee0e7cd308151efdc5921164d324ccaf045)]:
  - @telegraph/typography@0.3.0
  - @telegraph/tooltip@0.2.0
  - @telegraph/icon@0.4.1
  - @telegraph/layout@0.5.0

## 0.1.2

### Patch Changes

- Updated dependencies [[`627e61c`](https://github.com/knocklabs/telegraph/commit/627e61c3b17ccfc36f5fb835bb5f21a092efca95)]:
  - @telegraph/layout@0.5.0
  - @telegraph/icon@0.4.0
  - @telegraph/tooltip@0.1.3
  - @telegraph/typography@0.2.1

## 0.1.1

### Patch Changes

- [#701](https://github.com/knocklabs/telegraph/pull/701) [`16e678c`](https://github.com/knocklabs/telegraph/commit/16e678c5e8bc7f13613116954bc15099a8694bb7) Thanks [@ksorathia](https://github.com/ksorathia)! - Add surface-3 background color for interactive outlined variants.

## 0.1.0

### Minor Changes

- [#688](https://github.com/knocklabs/telegraph/pull/688) [`8d55540`](https://github.com/knocklabs/telegraph/commit/8d5554005bea4695560efbee9ea4333ccddfc1bf) Thanks [@kylemcd](https://github.com/kylemcd)! - fix: invalid props on components would not throw type errors

### Patch Changes

- Updated dependencies [[`8d55540`](https://github.com/knocklabs/telegraph/commit/8d5554005bea4695560efbee9ea4333ccddfc1bf)]:
  - @telegraph/typography@0.2.0
  - @telegraph/tooltip@0.1.0
  - @telegraph/layout@0.4.0
  - @telegraph/icon@0.4.0

## 0.0.9

### Patch Changes

- [#653](https://github.com/knocklabs/telegraph/pull/653) [`d6c6aa9`](https://github.com/knocklabs/telegraph/commit/d6c6aa9cb0e11ba96df7d7efd479c8e4652fc029) Thanks [@dependabot](https://github.com/apps/dependabot)! - chore(deps): bump react and @types/react

- Updated dependencies [[`d6c6aa9`](https://github.com/knocklabs/telegraph/commit/d6c6aa9cb0e11ba96df7d7efd479c8e4652fc029)]:
  - @telegraph/typography@0.1.29
  - @telegraph/helpers@0.0.15
  - @telegraph/tooltip@0.0.62
  - @telegraph/layout@0.3.3
  - @telegraph/icon@0.3.5

## 0.0.8

### Patch Changes

- Updated dependencies [[`a8c2402`](https://github.com/knocklabs/telegraph/commit/a8c24027d5a341ab53f4e72e0f6c0fe74d0d0372)]:
  - @telegraph/icon@0.3.4

## 0.0.7

### Patch Changes

- Updated dependencies [[`c7ffe1d`](https://github.com/knocklabs/telegraph/commit/c7ffe1d85a0320dec6a05b1fd386ba0092c48e37)]:
  - @telegraph/helpers@0.0.14
  - @telegraph/icon@0.3.3
  - @telegraph/layout@0.3.2
  - @telegraph/tooltip@0.0.61
  - @telegraph/typography@0.1.28

## 0.0.6

### Patch Changes

- Updated dependencies [[`8ceb949`](https://github.com/knocklabs/telegraph/commit/8ceb949883d1df0bc279af1cbbdaead64a25e49e)]:
  - @telegraph/layout@0.3.1
  - @telegraph/typography@0.1.27
  - @telegraph/tooltip@0.0.60
  - @telegraph/icon@0.3.2

## 0.0.5

### Patch Changes

- [#626](https://github.com/knocklabs/telegraph/pull/626) [`5634e8d`](https://github.com/knocklabs/telegraph/commit/5634e8dbedea588c793ea460ead27a0a39746ffa) Thanks [@connorlindsey](https://github.com/connorlindsey)! - feat: add description as tooltip

## 0.0.4

### Patch Changes

- [#624](https://github.com/knocklabs/telegraph/pull/624) [`794e5aa`](https://github.com/knocklabs/telegraph/commit/794e5aa8df38d6d687faceaa933a8fdda6da49a3) Thanks [@kylemcd](https://github.com/kylemcd)! - fix: data-list label size, additional props for default component

## 0.0.3

### Patch Changes

- Updated dependencies [[`aeb1c2b`](https://github.com/knocklabs/telegraph/commit/aeb1c2bf0db098320ecc960debf7f99ce0bb35d3), [`7c5f127`](https://github.com/knocklabs/telegraph/commit/7c5f127d945bfe3a171032195e214454ac4291cf), [`5901b31`](https://github.com/knocklabs/telegraph/commit/5901b317bef94ae6ff3903ed5c8129bde6a4532b)]:
  - @telegraph/layout@0.3.0
  - @telegraph/typography@0.1.26
  - @telegraph/icon@0.3.1

## 0.0.2

### Patch Changes

- Updated dependencies [[`8d9f23c`](https://github.com/knocklabs/telegraph/commit/8d9f23cdc43701b6a281cd4ac0c6a1d5fdfe107a)]:
  - @telegraph/icon@0.3.0

## 0.0.1

### Patch Changes

- [#593](https://github.com/knocklabs/telegraph/pull/593) [`322bf1e`](https://github.com/knocklabs/telegraph/commit/322bf1e463b0a2a5b83899843d8ea54004b89b9b) Thanks [@kylemcd](https://github.com/kylemcd)! - feat: add data-list package, add alignSelf prop to Box component.

- Updated dependencies [[`322bf1e`](https://github.com/knocklabs/telegraph/commit/322bf1e463b0a2a5b83899843d8ea54004b89b9b)]:
  - @telegraph/layout@0.2.3
  - @telegraph/typography@0.1.25
  - @telegraph/icon@0.2.7
