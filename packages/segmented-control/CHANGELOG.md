# @telegraph/segmented-control

## 0.4.1

### Patch Changes

- [#949](https://github.com/knocklabs/telegraph/pull/949) [`5015089`](https://github.com/knocklabs/telegraph/commit/5015089fd7a94dde8214ef383fa78d86c3aec688) Thanks [@kylemcd](https://github.com/kylemcd)! - Infer Base UI `nativeButton` semantics from polymorphic Telegraph triggers using stable component resolvers and Motion intrinsic metadata.

- Updated dependencies [[`5015089`](https://github.com/knocklabs/telegraph/commit/5015089fd7a94dde8214ef383fa78d86c3aec688)]:
  - @telegraph/helpers@0.3.0
  - @telegraph/button@0.9.0
  - @telegraph/layout@0.6.2
  - @telegraph/truncate@0.3.1

## 0.4.0

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

- [#928](https://github.com/knocklabs/telegraph/pull/928) [`3498748`](https://github.com/knocklabs/telegraph/commit/3498748c83003c7dfbc9f7364fd3f2ae9a7871c5) Thanks [@kylemcd](https://github.com/kylemcd)! - `SegmentedControl.Option` accepts a component for `as`, so an option can navigate:

  ```tsx
  <SegmentedControl.Option value="docs" as={NextLink} href="/docs">
    Docs
  </SegmentedControl.Option>
  ```

  `OptionProps` read bare `ButtonProps`, which is `ButtonProps<"button">` and carries `as?: "button"`. Intersecting that with the `as?: T` beside it pinned the element.

  Only the public props type is generic. The internals stay at the default element, because carrying an unresolved element parameter through Base UI's `render` callback stacks mapped types over Button's icon union and takes package type-checking from seconds to minutes.

  `nativeButton` follows the element that renders, as it now does for `Menu.Button`. It counts the root's `disabled` as well as the option's own, because `Root` passes `disabled` down through context and `Button` renders a native button whenever it is set. Reading only the option's own left a disabled option without its native `disabled` attribute, which Base UI replaced with `aria-disabled`.

  Several components took their element parameter without a default, so an absent `as` left it at the constraint rather than the documented default. The element passthrough then dropped native attributes, and `<Combobox.Option type="button" />` or `<Combobox.Empty id="x" />` did not compile. Fixed on `Combobox.Option`, `Combobox.Empty`, `Combobox.Create`, `Tag.Button` and the Combobox trigger primitives.

  Three more components could not take a component for `as` at all:
  - `Select.Option` was not generic, and its props type read bare `ComboboxOptionProps`.
  - `Spinner` declared `Partial<IconBaseProps<T>>`, and a mapped type in front of `as?: T` stops the element resolving. Only `icon` is optional now, so the rendered element's own required props are enforced again.
  - `Toggle.Indicator` declared `"span"` but renders `Tag as={as || "label"}`, so it rejected props the rendered element accepts, such as `htmlFor`.

### Patch Changes

- [#928](https://github.com/knocklabs/telegraph/pull/928) [`3498748`](https://github.com/knocklabs/telegraph/commit/3498748c83003c7dfbc9f7364fd3f2ae9a7871c5) Thanks [@kylemcd](https://github.com/kylemcd)! - `Tabs.Tab` no longer reports a Base UI error when a disabled tab renders as another element:

  ```tsx
  <Tabs.Tab value="docs" as="a" href="/docs" disabled>
    Docs
  </Tabs.Tab>
  ```

  `Button` always renders a real `<button>` when you disable it. It needs the native disabled state to block clicks, so it ignores `as`. `Tab` missed that and told Base UI the tag was not a button. Base UI logged the mismatch on every render.

  `@telegraph/button` now exports `rendersNativeButton(as, disabled)`. `Button.Root` uses it to pick its own tag. `Menu.Button`, `Menu.SubTrigger`, `SegmentedControl.Option`, and `Tabs.Tab` read it too. The five cannot diverge again.

- [#931](https://github.com/knocklabs/telegraph/pull/931) [`4de60e4`](https://github.com/knocklabs/telegraph/commit/4de60e4b49c051dc9c3399e573cf623dc397ae34) Thanks [@kylemcd](https://github.com/kylemcd)! - Update the READMEs for the prop-validation change.

  The `Modal.Content` custom-animation example passed `as={motion.div}`. `Modal.Content` always renders the animated element now, so the example animates a child instead. Copying it used to give a type error.

  `Popover.Content` drops its custom-animation example. The props table and the `skipAnimation` example already cover turning the built-in animation off.

  `Modal.Body` no longer documents `flex`, and the Tabs root no longer documents `disabled`. Neither prop existed. The catch-all index signature hid that.

  `Menu.Button` documents `as` and `nativeButton`. `SegmentedControl.Option` and `Select.Option` document `as`. `Select.Option` documents `label`.

  The `@telegraph/textarea` README documented seven props that do not exist: `autoResize`, `minRows`, `maxRows`, `showCharacterCount`, `state`, `errorMessage` and `helperText`. Roughly half its examples were built around them. It also gave `size` two values outside the scale, and the wrong default for `size` and `resize`. The README now documents the real component, and every example in it compiles.

  `@telegraph/helpers` gains a "Type checking" section covering the two cases that surprise people: a `data-*` key alone in a nested prop bag, and a `tgphRef` whose element type does not match. The README is the only prose that reaches an installed package, because no package publishes its changelog.

- Updated dependencies [[`3498748`](https://github.com/knocklabs/telegraph/commit/3498748c83003c7dfbc9f7364fd3f2ae9a7871c5), [`32a08b3`](https://github.com/knocklabs/telegraph/commit/32a08b3c8e4280c9d2f93f6bb53a76b8ab5e47b3), [`4de60e4`](https://github.com/knocklabs/telegraph/commit/4de60e4b49c051dc9c3399e573cf623dc397ae34), [`de498f8`](https://github.com/knocklabs/telegraph/commit/de498f80da2b93ddf252d3699088658039dda859)]:
  - @telegraph/button@0.8.0
  - @telegraph/helpers@0.2.0
  - @telegraph/layout@0.6.0
  - @telegraph/truncate@0.3.0

## 0.3.3

### Patch Changes

- Updated dependencies [[`028dd83`](https://github.com/knocklabs/telegraph/commit/028dd8337dadb4df0971ef20af6b275338385a9e)]:
  - @telegraph/truncate@0.2.0

## 0.3.2

### Patch Changes

- [#880](https://github.com/knocklabs/telegraph/pull/880) [`c5145da`](https://github.com/knocklabs/telegraph/commit/c5145daf880a13a59205992f3edf765402e8cdfa) Thanks [@dependabot](https://github.com/apps/dependabot)! - chore(deps): bump lucide-react from 1.16.0 to 1.23.0

- Updated dependencies [[`c5145da`](https://github.com/knocklabs/telegraph/commit/c5145daf880a13a59205992f3edf765402e8cdfa)]:
  - @telegraph/button@0.7.4

## 0.3.1

### Patch Changes

- [#862](https://github.com/knocklabs/telegraph/pull/862) [`c8d0331`](https://github.com/knocklabs/telegraph/commit/c8d03316510ca06044a51844d7c814c0947ac5f9) Thanks [@kylemcd](https://github.com/kylemcd)! - Restore radio-group accessibility semantics for single-select `SegmentedControl`. After the Base UI migration it rendered every option as a toggle button (`role="group"` + `aria-pressed`), which misrepresents a single-select control as independent multi-select toggles. Single-select now exposes `role="radiogroup"` + `role="radio"` + `aria-checked`, while `type="multiple"` keeps the correct toggle-button semantics. Also stops emitting the redundant `aria-disabled="false"` on enabled options.

## 0.3.0

### Minor Changes

- [#837](https://github.com/knocklabs/telegraph/pull/837) [`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde) Thanks [@kylemcd](https://github.com/kylemcd)! - Migrate SegmentedControl to Base UI ToggleGroup primitives while preserving Telegraph value shapes, empty-string values, scroll controls, `tgphRef`, and disabled option styling. Group-level `disabled` now propagates to every rendered option button so visual disabled state matches blocked interaction.

### Patch Changes

- Updated dependencies [[`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde), [`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde), [`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde), [`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde), [`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde), [`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde), [`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde)]:
  - @telegraph/helpers@0.1.0
  - @telegraph/truncate@0.1.6
  - @telegraph/button@0.7.3
  - @telegraph/layout@0.5.2

## 0.2.7

### Patch Changes

- Updated dependencies [[`f9c6e1c`](https://github.com/knocklabs/telegraph/commit/f9c6e1c078a1bd3d6a8e5eb0ce2dd6713ccc781e)]:
  - @telegraph/helpers@0.0.16
  - @telegraph/layout@0.5.1
  - @telegraph/button@0.7.2
  - @telegraph/truncate@0.1.5

## 0.2.6

### Patch Changes

- [#813](https://github.com/knocklabs/telegraph/pull/813) [`ef0aa8e`](https://github.com/knocklabs/telegraph/commit/ef0aa8e6bcf08c7108a3e3cc0261d543faaf2bb2) Thanks [@dependabot](https://github.com/apps/dependabot)! - chore(deps): bump lucide-react from 0.544.0 to 1.14.0

- Updated dependencies [[`ef0aa8e`](https://github.com/knocklabs/telegraph/commit/ef0aa8e6bcf08c7108a3e3cc0261d543faaf2bb2)]:
  - @telegraph/button@0.7.1

## 0.2.5

### Patch Changes

- Updated dependencies [[`12ed121`](https://github.com/knocklabs/telegraph/commit/12ed1211ce7d8ad9316660b4f6fea4f5528a78a5)]:
  - @telegraph/button@0.7.0

## 0.2.4

### Patch Changes

- [#764](https://github.com/knocklabs/telegraph/pull/764) [`f9dcbe7`](https://github.com/knocklabs/telegraph/commit/f9dcbe7bd8c79afd3dd25329b1f6ea6df202f85a) Thanks [@dependabot](https://github.com/apps/dependabot)! - chore(deps): bump motion from 12.34.3 to 12.38.0

## 0.2.3

### Patch Changes

- Updated dependencies [[`3c100cf`](https://github.com/knocklabs/telegraph/commit/3c100cf78d2b322f674e2f170860f938ea3b69a3)]:
  - @telegraph/button@0.6.0
  - @telegraph/truncate@0.1.2

## 0.2.2

### Patch Changes

- Updated dependencies [[`627e61c`](https://github.com/knocklabs/telegraph/commit/627e61c3b17ccfc36f5fb835bb5f21a092efca95)]:
  - @telegraph/button@0.5.0
  - @telegraph/layout@0.5.0
  - @telegraph/truncate@0.1.0

## 0.2.1

### Patch Changes

- [#693](https://github.com/knocklabs/telegraph/pull/693) [`4ab1d02`](https://github.com/knocklabs/telegraph/commit/4ab1d02cf51db16024e7098d4c9f9b963b8fac37) Thanks [@dependabot](https://github.com/apps/dependabot)! - chore(deps): bump motion from 12.23.12 to 12.34.3

## 0.2.0

### Minor Changes

- [#688](https://github.com/knocklabs/telegraph/pull/688) [`8d55540`](https://github.com/knocklabs/telegraph/commit/8d5554005bea4695560efbee9ea4333ccddfc1bf) Thanks [@kylemcd](https://github.com/kylemcd)! - fix: invalid props on components would not throw type errors

### Patch Changes

- Updated dependencies [[`8d55540`](https://github.com/knocklabs/telegraph/commit/8d5554005bea4695560efbee9ea4333ccddfc1bf)]:
  - @telegraph/truncate@0.1.0
  - @telegraph/button@0.4.0
  - @telegraph/layout@0.4.0

## 0.1.20

### Patch Changes

- [#653](https://github.com/knocklabs/telegraph/pull/653) [`d6c6aa9`](https://github.com/knocklabs/telegraph/commit/d6c6aa9cb0e11ba96df7d7efd479c8e4652fc029) Thanks [@dependabot](https://github.com/apps/dependabot)! - chore(deps): bump react and @types/react

- Updated dependencies [[`d6c6aa9`](https://github.com/knocklabs/telegraph/commit/d6c6aa9cb0e11ba96df7d7efd479c8e4652fc029)]:
  - @telegraph/truncate@0.0.18
  - @telegraph/helpers@0.0.15
  - @telegraph/button@0.3.6
  - @telegraph/layout@0.3.3

## 0.1.19

### Patch Changes

- Updated dependencies []:
  - @telegraph/button@0.3.5

## 0.1.18

### Patch Changes

- Updated dependencies [[`c7ffe1d`](https://github.com/knocklabs/telegraph/commit/c7ffe1d85a0320dec6a05b1fd386ba0092c48e37)]:
  - @telegraph/helpers@0.0.14
  - @telegraph/button@0.3.4
  - @telegraph/layout@0.3.2
  - @telegraph/truncate@0.0.17

## 0.1.17

### Patch Changes

- [#645](https://github.com/knocklabs/telegraph/pull/645) [`28543a2`](https://github.com/knocklabs/telegraph/commit/28543a2fb20c7a4dcfc35c91e7454b51e02ef061) Thanks [@kylemcd](https://github.com/kylemcd)! - feat: ensure selected item in segmented control is within view on selection and initial mount

- Updated dependencies [[`0c44b7c`](https://github.com/knocklabs/telegraph/commit/0c44b7ce809b4d5c37ea13ef31d95197f8ad0777)]:
  - @telegraph/button@0.3.3

## 0.1.16

### Patch Changes

- [#640](https://github.com/knocklabs/telegraph/pull/640) [`712f9fd`](https://github.com/knocklabs/telegraph/commit/712f9fd3604f5e89a8eed61548a2d63b5a3522c7) Thanks [@kylemcd](https://github.com/kylemcd)! - feat: add horizontal scrolling to overflowed segmented control

- Updated dependencies [[`712f9fd`](https://github.com/knocklabs/telegraph/commit/712f9fd3604f5e89a8eed61548a2d63b5a3522c7)]:
  - @telegraph/truncate@0.0.16

## 0.1.15

### Patch Changes

- Updated dependencies [[`8ceb949`](https://github.com/knocklabs/telegraph/commit/8ceb949883d1df0bc279af1cbbdaead64a25e49e)]:
  - @telegraph/layout@0.3.1
  - @telegraph/button@0.3.2

## 0.1.14

### Patch Changes

- Updated dependencies [[`aeb1c2b`](https://github.com/knocklabs/telegraph/commit/aeb1c2bf0db098320ecc960debf7f99ce0bb35d3), [`7c5f127`](https://github.com/knocklabs/telegraph/commit/7c5f127d945bfe3a171032195e214454ac4291cf), [`5901b31`](https://github.com/knocklabs/telegraph/commit/5901b317bef94ae6ff3903ed5c8129bde6a4532b)]:
  - @telegraph/layout@0.3.0
  - @telegraph/button@0.3.1

## 0.1.13

### Patch Changes

- Updated dependencies [[`8d9f23c`](https://github.com/knocklabs/telegraph/commit/8d9f23cdc43701b6a281cd4ac0c6a1d5fdfe107a)]:
  - @telegraph/button@0.3.0

## 0.1.12

### Patch Changes

- Updated dependencies [[`0073505`](https://github.com/knocklabs/telegraph/commit/00735055f9078e61ac4b31d7bc306b57c5fc6c7b)]:
  - @telegraph/button@0.2.7

## 0.1.11

### Patch Changes

- Updated dependencies [[`17a3409`](https://github.com/knocklabs/telegraph/commit/17a34098ee1c6c83ba9dd7ff65255161f2ff094c)]:
  - @telegraph/button@0.2.6

## 0.1.10

### Patch Changes

- Updated dependencies [[`3c4a714`](https://github.com/knocklabs/telegraph/commit/3c4a7142e9e9272701f924162ca938d548fef625)]:
  - @telegraph/button@0.2.5

## 0.1.9

### Patch Changes

- Updated dependencies [[`322bf1e`](https://github.com/knocklabs/telegraph/commit/322bf1e463b0a2a5b83899843d8ea54004b89b9b)]:
  - @telegraph/layout@0.2.3
  - @telegraph/button@0.2.4

## 0.1.8

### Patch Changes

- Updated dependencies []:
  - @telegraph/layout@0.2.2
  - @telegraph/button@0.2.3

## 0.1.7

### Patch Changes

- Updated dependencies [[`4834ada`](https://github.com/knocklabs/telegraph/commit/4834ada4a00cdf8a9a1e524092f644d503cd3646)]:
  - @telegraph/button@0.2.2

## 0.1.6

### Patch Changes

- Updated dependencies [[`76a99cc`](https://github.com/knocklabs/telegraph/commit/76a99cc774ccf5609cabb6ee3d429fbc5ba1dee8)]:
  - @telegraph/button@0.2.1

## 0.1.5

### Patch Changes

- Updated dependencies [[`4817bf4`](https://github.com/knocklabs/telegraph/commit/4817bf496e77214d5a99426d4a559e99fd98e8f0)]:
  - @telegraph/button@0.2.0

## 0.1.4

### Patch Changes

- Updated dependencies [[`efcbf52`](https://github.com/knocklabs/telegraph/commit/efcbf52f5b3b364ba20fafc3cb66bbf0681172d7)]:
  - @telegraph/button@0.1.4

## 0.1.3

### Patch Changes

- [#544](https://github.com/knocklabs/telegraph/pull/544) [`638bebc`](https://github.com/knocklabs/telegraph/commit/638bebccbcb604f76e86aba9d204fa27767cf608) Thanks [@dependabot](https://github.com/apps/dependabot)! - chore(deps): bump @radix-ui/react-toggle-group from 1.1.10 to 1.1.11

- Updated dependencies [[`7d587b9`](https://github.com/knocklabs/telegraph/commit/7d587b908df373676d556bd2fc3c242c37917496)]:
  - @telegraph/button@0.1.3

## 0.1.2

### Patch Changes

- Updated dependencies [[`23ae20c`](https://github.com/knocklabs/telegraph/commit/23ae20c41f62e6f0a8c6d5c60db882a24cf8512d)]:
  - @telegraph/button@0.1.2

## 0.1.1

### Patch Changes

- [#524](https://github.com/knocklabs/telegraph/pull/524) [`fd14d50`](https://github.com/knocklabs/telegraph/commit/fd14d509c3f3f76eafc07d08c73e30db79255a2e) Thanks [@kylemcd](https://github.com/kylemcd)! - bump packages to get tokens upgrades

- Updated dependencies [[`fd14d50`](https://github.com/knocklabs/telegraph/commit/fd14d509c3f3f76eafc07d08c73e30db79255a2e)]:
  - @telegraph/button@0.1.1
  - @telegraph/layout@0.2.1

## 0.1.0

### Minor Changes

- [#519](https://github.com/knocklabs/telegraph/pull/519) [`aa0df27`](https://github.com/knocklabs/telegraph/commit/aa0df2714578f411fd7c80ce3610713d6e77d053) Thanks [@ksorathia](https://github.com/ksorathia)! - Standardize spacing and style across primitives.

### Patch Changes

- Updated dependencies [[`aa0df27`](https://github.com/knocklabs/telegraph/commit/aa0df2714578f411fd7c80ce3610713d6e77d053)]:
  - @telegraph/button@0.1.0

## 0.0.44

### Patch Changes

- Updated dependencies [[`bca0117`](https://github.com/knocklabs/telegraph/commit/bca011776c3b8b96e4f46a049578fcd7a167e052)]:
  - @telegraph/layout@0.2.0
  - @telegraph/button@0.0.84

## 0.0.43

### Patch Changes

- [#501](https://github.com/knocklabs/telegraph/pull/501) [`dc12662`](https://github.com/knocklabs/telegraph/commit/dc12662f6f41697d976d0978871a567d564777e8) Thanks [@kylemcd](https://github.com/kylemcd)! - deprecate usage of `@telegraph/motion` in favor of tiny `motion` package

- [#498](https://github.com/knocklabs/telegraph/pull/498) [`99e01e3`](https://github.com/knocklabs/telegraph/commit/99e01e3dcf7508af0bfae14e9b62cccff7af3388) Thanks [@kylemcd](https://github.com/kylemcd)! - update imports for the `Lucide` object from `@telegraph/icon` to import icons directly from `lucide-react` instead.

- Updated dependencies [[`e554068`](https://github.com/knocklabs/telegraph/commit/e554068b0f9ca5a1e8fe9d6f27dd2a30373a3cc8), [`dc12662`](https://github.com/knocklabs/telegraph/commit/dc12662f6f41697d976d0978871a567d564777e8), [`99e01e3`](https://github.com/knocklabs/telegraph/commit/99e01e3dcf7508af0bfae14e9b62cccff7af3388), [`2d3e1cd`](https://github.com/knocklabs/telegraph/commit/2d3e1cddd8a6bfac7108e350649f81bdc18f57c8)]:
  - @telegraph/layout@0.1.21
  - @telegraph/button@0.0.83

## 0.0.42

### Patch Changes

- [#494](https://github.com/knocklabs/telegraph/pull/494) [`e769470`](https://github.com/knocklabs/telegraph/commit/e7694701fb63ebc65d9fe77d9a89c8f0bf557b67) Thanks [@kylemcd](https://github.com/kylemcd)! - update package exports to be in the correct order

- [#493](https://github.com/knocklabs/telegraph/pull/493) [`5209f6d`](https://github.com/knocklabs/telegraph/commit/5209f6d6c8ed9d71d61c76c089541b14d3369a35) Thanks [@kylemcd](https://github.com/kylemcd)! - update radix deps to latest

- Updated dependencies [[`e769470`](https://github.com/knocklabs/telegraph/commit/e7694701fb63ebc65d9fe77d9a89c8f0bf557b67)]:
  - @telegraph/helpers@0.0.13
  - @telegraph/button@0.0.82
  - @telegraph/layout@0.1.20

## 0.0.41

### Patch Changes

- Updated dependencies [[`def8e98`](https://github.com/knocklabs/telegraph/commit/def8e983fe8d90d3d35f8ffe81ceb9daa46e1b30)]:
  - @telegraph/layout@0.1.19
  - @telegraph/button@0.0.81
  - @telegraph/helpers@0.0.12

## 0.0.40

### Patch Changes

- Updated dependencies [[`45d2fe1`](https://github.com/knocklabs/telegraph/commit/45d2fe1284b97f984fb08f118e25a9d6bc58c353)]:
  - @telegraph/layout@0.1.18
  - @telegraph/button@0.0.80

## 0.0.39

### Patch Changes

- Updated dependencies []:
  - @telegraph/layout@0.1.17
  - @telegraph/button@0.0.79

## 0.0.38

### Patch Changes

- Updated dependencies []:
  - @telegraph/button@0.0.78

## 0.0.37

### Patch Changes

- Updated dependencies [[`0dcbd65`](https://github.com/knocklabs/telegraph/commit/0dcbd65ba294edd97cdc4159533a8516433cd3c9)]:
  - @telegraph/button@0.0.77

## 0.0.36

### Patch Changes

- Updated dependencies [[`955c255`](https://github.com/knocklabs/telegraph/commit/955c25512468a67717de9e56a6b49f72ff53279e)]:
  - @telegraph/helpers@0.0.12
  - @telegraph/button@0.0.76
  - @telegraph/layout@0.1.16

## 0.0.35

### Patch Changes

- Updated dependencies []:
  - @telegraph/button@0.0.75
  - @telegraph/layout@0.1.15

## 0.0.34

### Patch Changes

- Updated dependencies []:
  - @telegraph/button@0.0.74
  - @telegraph/layout@0.1.14

## 0.0.33

### Patch Changes

- Updated dependencies [[`061bb93`](https://github.com/knocklabs/telegraph/commit/061bb9367a211650add6e2f54cbce5c85b69a137)]:
  - @telegraph/layout@0.1.13
  - @telegraph/button@0.0.73

## 0.0.32

### Patch Changes

- [#384](https://github.com/knocklabs/telegraph/pull/384) [`552fb82`](https://github.com/knocklabs/telegraph/commit/552fb82a33203c87e58715b4a52ea0c360999636) Thanks [@dependabot](https://github.com/apps/dependabot)! - upgrade typescript dep

- Updated dependencies [[`552fb82`](https://github.com/knocklabs/telegraph/commit/552fb82a33203c87e58715b4a52ea0c360999636)]:
  - @telegraph/helpers@0.0.11
  - @telegraph/button@0.0.72
  - @telegraph/layout@0.1.12

## 0.0.31

### Patch Changes

- [#408](https://github.com/knocklabs/telegraph/pull/408) [`916d37c`](https://github.com/knocklabs/telegraph/commit/916d37cc78433eeb70a93e041b18f951d2d25bcd) Thanks [@MikeCarbone](https://github.com/MikeCarbone)! - chore: minor upgrades to react, fixes peer dependency issues

- [#409](https://github.com/knocklabs/telegraph/pull/409) [`734b5c5`](https://github.com/knocklabs/telegraph/commit/734b5c5ee2ac0484a09f534148a4ca1cf23fb3d0) Thanks [@MikeCarbone](https://github.com/MikeCarbone)! - chore: adds React 19 as a peer dependency

- Updated dependencies [[`916d37c`](https://github.com/knocklabs/telegraph/commit/916d37cc78433eeb70a93e041b18f951d2d25bcd), [`734b5c5`](https://github.com/knocklabs/telegraph/commit/734b5c5ee2ac0484a09f534148a4ca1cf23fb3d0)]:
  - @telegraph/button@0.0.71
  - @telegraph/helpers@0.0.10
  - @telegraph/layout@0.1.11

## 0.0.28

### Patch Changes

- Updated dependencies [[`4e67707`](https://github.com/knocklabs/telegraph/commit/4e677077ed644bd2861401986c3a4350d26d0c05)]:
  - @telegraph/button@0.0.68

## 0.0.27

### Patch Changes

- Updated dependencies [[`2925a69`](https://github.com/knocklabs/telegraph/commit/2925a699379f14b08fc91d2c5f84a143dfda01eb)]:
  - @telegraph/layout@0.1.8
  - @telegraph/button@0.0.67
  - @telegraph/helpers@0.0.7

## 0.0.26

### Patch Changes

- Updated dependencies [[`19d31b1`](https://github.com/knocklabs/telegraph/commit/19d31b165203c8a00186733b35d83c70bcbf32fc)]:
  - @telegraph/button@0.0.66

## 0.0.25

### Patch Changes

- Updated dependencies [[`1a6d741`](https://github.com/knocklabs/telegraph/commit/1a6d7418990003585f58c64d7a8d023e8058b021)]:
  - @telegraph/button@0.0.65

## 0.0.24

### Patch Changes

- Updated dependencies [[`47723a4`](https://github.com/knocklabs/telegraph/commit/47723a426e1734d6bfa6c69000690875d0d101cc)]:
  - @telegraph/layout@0.1.6
  - @telegraph/button@0.0.64

## 0.0.23

### Patch Changes

- Updated dependencies [[`00be1af`](https://github.com/knocklabs/telegraph/commit/00be1af7e04c1d0aba3dc42a8cf2943b9cf2cfc7)]:
  - @telegraph/button@0.0.63

## 0.0.22

### Patch Changes

- Updated dependencies [[`ede88ff`](https://github.com/knocklabs/telegraph/commit/ede88ffd76c081ee66b0c879a4f97ea0d49a6aa9)]:
  - @telegraph/button@0.0.62

## 0.0.21

### Patch Changes

- Updated dependencies []:
  - @telegraph/button@0.0.61

## 0.0.20

### Patch Changes

- Updated dependencies [[`67e54c0`](https://github.com/knocklabs/telegraph/commit/67e54c0aa06281579cdfb62f7ceb5792cba02b1c)]:
  - @telegraph/button@0.0.60

## 0.0.19

### Patch Changes

- Updated dependencies []:
  - @telegraph/button@0.0.59
  - @telegraph/layout@0.1.5

## 0.0.18

### Patch Changes

- Updated dependencies []:
  - @telegraph/button@0.0.58
  - @telegraph/layout@0.1.4

## 0.0.17

### Patch Changes

- Updated dependencies [[`a748be4`](https://github.com/knocklabs/telegraph/commit/a748be4d48b4e26908deaa120389598e185007c6), [`22ac9d0`](https://github.com/knocklabs/telegraph/commit/22ac9d0ff28ef0966edd31a4016c76d8a7ae91ad), [`8fdf776`](https://github.com/knocklabs/telegraph/commit/8fdf77633d6991014ffa55b32b1ba45ef124f917), [`6cf176f`](https://github.com/knocklabs/telegraph/commit/6cf176fc3272d89d725951b5024dd0db4cf9a4e8), [`6cf176f`](https://github.com/knocklabs/telegraph/commit/6cf176fc3272d89d725951b5024dd0db4cf9a4e8), [`bc6c1f4`](https://github.com/knocklabs/telegraph/commit/bc6c1f4223380b310487d72dc4153e499f07fefe)]:
  - @telegraph/button@0.0.57
  - @telegraph/layout@0.1.3

## 0.0.16

### Patch Changes

- Updated dependencies [[`a9ece46`](https://github.com/knocklabs/telegraph/commit/a9ece460f0b90927e3808c83d6c90eabb118aed0)]:
  - @telegraph/layout@0.1.2
  - @telegraph/button@0.0.56

## 0.0.15

### Patch Changes

- Updated dependencies [[`6a9c100`](https://github.com/knocklabs/telegraph/commit/6a9c10012e435b297756adff6b89976453e5d890)]:
  - @telegraph/layout@0.1.1
  - @telegraph/button@0.0.55

## 0.0.14

### Patch Changes

- Updated dependencies [[`7ef8fe2`](https://github.com/knocklabs/telegraph/commit/7ef8fe2df51b1f632163918095a5496322277cad)]:
  - @telegraph/button@0.0.54
  - @telegraph/layout@0.1.0

## 0.0.13

### Patch Changes

- Updated dependencies [[`fe1a1fb`](https://github.com/knocklabs/telegraph/commit/fe1a1fb882e50e551d3f00a201057b040ed28559)]:
  - @telegraph/button@0.0.53

## 0.0.7

### Patch Changes

- Updated dependencies [[`ddd7880`](https://github.com/knocklabs/telegraph/commit/ddd7880d56f0bfd05712722febd778b6ad69c651)]:
  - @telegraph/button@0.0.47

## 0.0.6

### Patch Changes

- Updated dependencies [[`1b0bb33`](https://github.com/knocklabs/telegraph/commit/1b0bb333d6ca1664971d19d48d3b036c6711d554)]:
  - @telegraph/helpers@0.0.6
  - @telegraph/button@0.0.46
  - @telegraph/layout@0.0.28

## 0.0.5

### Patch Changes

- Updated dependencies [[`61fa6d5`](https://github.com/knocklabs/telegraph/commit/61fa6d5b94b9b96e1a8d679f840dbafea12e9fc3)]:
  - @telegraph/button@0.0.45

## 0.0.4

### Patch Changes

- Updated dependencies [[`e30e06a`](https://github.com/knocklabs/telegraph/commit/e30e06a7e6bafc6b7aefcf26228e432f2e3906c9)]:
  - @telegraph/button@0.0.44
  - @telegraph/layout@0.0.27

## 0.0.3

### Patch Changes

- Updated dependencies [[`4d642b2`](https://github.com/knocklabs/telegraph/commit/4d642b2e06fc6b11accc71493f3cc34208204043)]:
  - @telegraph/button@0.0.43

## 0.0.2

### Patch Changes

- Updated dependencies []:
  - @telegraph/button@0.0.42

## 0.0.1

### Patch Changes

- [#201](https://github.com/knocklabs/telegraph/pull/201) [`b71bdd3`](https://github.com/knocklabs/telegraph/commit/b71bdd37cd75c48515a189afd4d5e56299bed70e) Thanks [@kylemcd](https://github.com/kylemcd)! - first version of the segmented control component
