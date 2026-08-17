# @telegraph/popover

## 0.5.2

### Patch Changes

- [#956](https://github.com/knocklabs/telegraph/pull/956) [`ef8d6c6`](https://github.com/knocklabs/telegraph/commit/ef8d6c60bc8ca3d7f0597bd99bd96a898285e25e) Thanks [@kylemcd](https://github.com/kylemcd)! - chore: replace ESLint with oxlint and Prettier with oxfmt

  Consolidates the monorepo onto the oxc toolchain. A single root `.oxlintrc.json`
  replaces the per-package `.eslintrc.js` files and a single `.oxfmtrc.json`
  replaces the Prettier config. The rule set matches the dashboard's, so a rule
  lands in both repos or neither.

  The five bumped packages each gain a `displayName` on a `forwardRef` component
  that did not have one, which is what React DevTools and React's own warnings
  show. No props, types, or rendered output change.
  (Stacked on the TypeScript 7 type-check PR.)

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
  - @telegraph/layout@0.6.3

## 0.5.1

### Patch Changes

- [#949](https://github.com/knocklabs/telegraph/pull/949) [`5015089`](https://github.com/knocklabs/telegraph/commit/5015089fd7a94dde8214ef383fa78d86c3aec688) Thanks [@kylemcd](https://github.com/kylemcd)! - Infer Base UI `nativeButton` semantics from polymorphic Telegraph triggers using stable component resolvers and Motion intrinsic metadata.

- Updated dependencies [[`5015089`](https://github.com/knocklabs/telegraph/commit/5015089fd7a94dde8214ef383fa78d86c3aec688)]:
  - @telegraph/helpers@0.3.0
  - @telegraph/layout@0.6.2

## 0.5.0

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

- [#924](https://github.com/knocklabs/telegraph/pull/924) [`88ea929`](https://github.com/knocklabs/telegraph/commit/88ea9296955fd6202c01686cfe2b097306019a19) Thanks [@kylemcd](https://github.com/kylemcd)! - `as` no longer replaces the animated element on `Popover.Content`, `Tooltip`'s popup label, `Modal.Root`, and Combobox's trigger indicator and trigger tag. Each renders a `framer-motion` element and then spread the caller's rest props after it, so a caller-supplied `as` won that spread. The animation stopped running, motion props reached a plain DOM node, and for `Popover.Content` the popup could stay mounted after close, because `onAnimationComplete` never fired on a non-motion element.

  `as` is now dropped from each props type and discarded at runtime. Passing it is a type error, and a spread cannot smuggle it through.

  `Modal.Root` needed one more change to keep that promise. The cast that let the body destructure `as` sat on the parameter. That put `as` straight back into the public type, so `<Modal.Root as="div">` compiled and did nothing. The cast now sits in the body.

  `Tooltip` also drops `asChild`. It declared the prop and never read it. Tooltip always merges its props onto its child, so `asChild` had no meaning. Passing it is now a type error, and you can remove it.

  `Combobox.Primitives.TriggerIndicator` also drops `alt`. The body discards it, because `Button.Icon` rejects `alt` and `aria-hidden` together. Leaving `alt` in the type promised an accessible name that never rendered.

### Patch Changes

- [#931](https://github.com/knocklabs/telegraph/pull/931) [`4de60e4`](https://github.com/knocklabs/telegraph/commit/4de60e4b49c051dc9c3399e573cf623dc397ae34) Thanks [@kylemcd](https://github.com/kylemcd)! - Update the READMEs for the prop-validation change.

  The `Modal.Content` custom-animation example passed `as={motion.div}`. `Modal.Content` always renders the animated element now, so the example animates a child instead. Copying it used to give a type error.

  `Popover.Content` drops its custom-animation example. The props table and the `skipAnimation` example already cover turning the built-in animation off.

  `Modal.Body` no longer documents `flex`, and the Tabs root no longer documents `disabled`. Neither prop existed. The catch-all index signature hid that.

  `Menu.Button` documents `as` and `nativeButton`. `SegmentedControl.Option` and `Select.Option` document `as`. `Select.Option` documents `label`.

  The `@telegraph/textarea` README documented seven props that do not exist: `autoResize`, `minRows`, `maxRows`, `showCharacterCount`, `state`, `errorMessage` and `helperText`. Roughly half its examples were built around them. It also gave `size` two values outside the scale, and the wrong default for `size` and `resize`. The README now documents the real component, and every example in it compiles.

  `@telegraph/helpers` gains a "Type checking" section covering the two cases that surprise people: a `data-*` key alone in a nested prop bag, and a `tgphRef` whose element type does not match. The README is the only prose that reaches an installed package, because no package publishes its changelog.

- Updated dependencies [[`32a08b3`](https://github.com/knocklabs/telegraph/commit/32a08b3c8e4280c9d2f93f6bb53a76b8ab5e47b3), [`4de60e4`](https://github.com/knocklabs/telegraph/commit/4de60e4b49c051dc9c3399e573cf623dc397ae34), [`de498f8`](https://github.com/knocklabs/telegraph/commit/de498f80da2b93ddf252d3699088658039dda859)]:
  - @telegraph/helpers@0.2.0
  - @telegraph/layout@0.6.0

## 0.4.2

### Patch Changes

- [#895](https://github.com/knocklabs/telegraph/pull/895) [`d6ee028`](https://github.com/knocklabs/telegraph/commit/d6ee028d4cd649a287076ab5f1b9a94e0a2b5eef) Thanks [@kylemcd](https://github.com/kylemcd)! - Tighten base-ui dismiss-handler types so stale Radix `event.detail` usage fails to compile.

  `Popover.Content`, `Menu.Content`, and `Modal.Content` hand their dismiss callbacks (`onInteractOutside`, `onPointerDownOutside`, `onFocusOutside`, `onEscapeKeyDown`) the native DOM event, but the compat shim kept Radix's prop names. The callback's `event` param was resolving to `any` at the JSX call site instead of its concrete DOM `Event`, so in a consumer whose tsconfig doesn't flag implicit `any` a stale Radix-shaped handler reading `event.detail.originalEvent` compiled and then crashed at runtime (`Cannot read properties of undefined`). Each param now resolves to its concrete `Event` type, so `.detail`/`.originalEvent` access is a compile error.

  **Breaking (`@telegraph/modal`):** `Modal.Content` is now a plain function component instead of `forwardRef` (whose `PropsWithoutRef` wrapper caused the same widening), matching `Popover`/`Menu`. A `ref` on `Modal.Content` no longer forwards — pass `tgphRef` instead. (On React 19 a stray `ref` still reaches the node as a prop; on React 18 it does not.)

## 0.4.1

### Patch Changes

- [#861](https://github.com/knocklabs/telegraph/pull/861) [`e78f94d`](https://github.com/knocklabs/telegraph/commit/e78f94dd105671294c2bec3b633c341e29192765) Thanks [@kylemcd](https://github.com/kylemcd)! - Set the popover z-index on the Base UI positioner instead of only the popup. Base UI portals content to `<body>` and applies a `transform` to the positioner, making it the stacking-context root at `z-index: auto`; a z-index on the popup child alone was trapped inside that context, so popovers could render underneath app content with its own positive z-index. This matches how Menu and Tooltip already set their positioner z-index.

## 0.4.0

### Minor Changes

- [#837](https://github.com/knocklabs/telegraph/pull/837) [`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde) Thanks [@kylemcd](https://github.com/kylemcd)! - Migrate Popover internals from Radix UI to Base UI while preserving Telegraph styling, `tgphRef`, dismissal callbacks, focus callbacks, `avoidCollisions`, and `hideWhenDetached` compatibility. Also add shared Base UI compatibility helpers for migrated floating components.

### Patch Changes

- Updated dependencies [[`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde), [`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde), [`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde), [`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde), [`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde)]:
  - @telegraph/helpers@0.1.0
  - @telegraph/layout@0.5.2

## 0.3.2

### Patch Changes

- Updated dependencies [[`f9c6e1c`](https://github.com/knocklabs/telegraph/commit/f9c6e1c078a1bd3d6a8e5eb0ce2dd6713ccc781e)]:
  - @telegraph/helpers@0.0.16
  - @telegraph/layout@0.5.1

## 0.3.1

### Patch Changes

- [#764](https://github.com/knocklabs/telegraph/pull/764) [`f9dcbe7`](https://github.com/knocklabs/telegraph/commit/f9dcbe7bd8c79afd3dd25329b1f6ea6df202f85a) Thanks [@dependabot](https://github.com/apps/dependabot)! - chore(deps): bump motion from 12.34.3 to 12.38.0

## 0.3.0

### Minor Changes

- [#734](https://github.com/knocklabs/telegraph/pull/734) [`d3b6fee`](https://github.com/knocklabs/telegraph/commit/d3b6fee0e7cd308151efdc5921164d324ccaf045) Thanks [@ksorathia](https://github.com/ksorathia)! - Update shadow tokens to work in light and dark modes. Adjust modal, popover, menu, and tooltip to rely on shadow to apply border

### Patch Changes

- Updated dependencies []:
  - @telegraph/layout@0.5.0

## 0.2.3

### Patch Changes

- Updated dependencies [[`627e61c`](https://github.com/knocklabs/telegraph/commit/627e61c3b17ccfc36f5fb835bb5f21a092efca95)]:
  - @telegraph/layout@0.5.0

## 0.2.2

### Patch Changes

- [#709](https://github.com/knocklabs/telegraph/pull/709) [`560071e`](https://github.com/knocklabs/telegraph/commit/560071edb330493cb5db6fe9230158555cdc7da2) Thanks [@MikeCarbone](https://github.com/MikeCarbone)! - mike-kno-11947-telegraph-fix-border-color-to-look-better-in-dark-and-light

## 0.2.1

### Patch Changes

- [#693](https://github.com/knocklabs/telegraph/pull/693) [`4ab1d02`](https://github.com/knocklabs/telegraph/commit/4ab1d02cf51db16024e7098d4c9f9b963b8fac37) Thanks [@dependabot](https://github.com/apps/dependabot)! - chore(deps): bump motion from 12.23.12 to 12.34.3

## 0.2.0

### Minor Changes

- [#688](https://github.com/knocklabs/telegraph/pull/688) [`8d55540`](https://github.com/knocklabs/telegraph/commit/8d5554005bea4695560efbee9ea4333ccddfc1bf) Thanks [@kylemcd](https://github.com/kylemcd)! - fix: invalid props on components would not throw type errors

### Patch Changes

- Updated dependencies [[`8d55540`](https://github.com/knocklabs/telegraph/commit/8d5554005bea4695560efbee9ea4333ccddfc1bf)]:
  - @telegraph/layout@0.4.0

## 0.1.9

### Patch Changes

- [#653](https://github.com/knocklabs/telegraph/pull/653) [`d6c6aa9`](https://github.com/knocklabs/telegraph/commit/d6c6aa9cb0e11ba96df7d7efd479c8e4652fc029) Thanks [@dependabot](https://github.com/apps/dependabot)! - chore(deps): bump react and @types/react

- Updated dependencies [[`d6c6aa9`](https://github.com/knocklabs/telegraph/commit/d6c6aa9cb0e11ba96df7d7efd479c8e4652fc029)]:
  - @telegraph/helpers@0.0.15
  - @telegraph/layout@0.3.3

## 0.1.8

### Patch Changes

- Updated dependencies [[`c7ffe1d`](https://github.com/knocklabs/telegraph/commit/c7ffe1d85a0320dec6a05b1fd386ba0092c48e37)]:
  - @telegraph/helpers@0.0.14
  - @telegraph/layout@0.3.2

## 0.1.7

### Patch Changes

- Updated dependencies [[`8ceb949`](https://github.com/knocklabs/telegraph/commit/8ceb949883d1df0bc279af1cbbdaead64a25e49e)]:
  - @telegraph/layout@0.3.1

## 0.1.6

### Patch Changes

- Updated dependencies [[`aeb1c2b`](https://github.com/knocklabs/telegraph/commit/aeb1c2bf0db098320ecc960debf7f99ce0bb35d3), [`7c5f127`](https://github.com/knocklabs/telegraph/commit/7c5f127d945bfe3a171032195e214454ac4291cf), [`5901b31`](https://github.com/knocklabs/telegraph/commit/5901b317bef94ae6ff3903ed5c8129bde6a4532b)]:
  - @telegraph/layout@0.3.0

## 0.1.5

### Patch Changes

- Updated dependencies [[`322bf1e`](https://github.com/knocklabs/telegraph/commit/322bf1e463b0a2a5b83899843d8ea54004b89b9b)]:
  - @telegraph/layout@0.2.3

## 0.1.4

### Patch Changes

- Updated dependencies []:
  - @telegraph/layout@0.2.2

## 0.1.3

### Patch Changes

- [#566](https://github.com/knocklabs/telegraph/pull/566) [`38867ab`](https://github.com/knocklabs/telegraph/commit/38867ab2cc762056a3486bfa7d25cc90841db608) Thanks [@dependabot](https://github.com/apps/dependabot)! - chore(deps): bump @radix-ui/react-popover from 1.1.14 to 1.1.15

## 0.1.2

### Patch Changes

- [#532](https://github.com/knocklabs/telegraph/pull/532) [`c0244e3`](https://github.com/knocklabs/telegraph/commit/c0244e3f4b6232f633ba4d99bb0eb603909c87fa) Thanks [@dependabot](https://github.com/apps/dependabot)! - chore(deps): bump motion from 12.23.0 to 12.23.12

## 0.1.1

### Patch Changes

- [#524](https://github.com/knocklabs/telegraph/pull/524) [`fd14d50`](https://github.com/knocklabs/telegraph/commit/fd14d509c3f3f76eafc07d08c73e30db79255a2e) Thanks [@kylemcd](https://github.com/kylemcd)! - bump packages to get tokens upgrades

- Updated dependencies []:
  - @telegraph/layout@0.2.1

## 0.1.0

### Minor Changes

- [#519](https://github.com/knocklabs/telegraph/pull/519) [`aa0df27`](https://github.com/knocklabs/telegraph/commit/aa0df2714578f411fd7c80ce3610713d6e77d053) Thanks [@ksorathia](https://github.com/ksorathia)! - Standardize spacing and style across primitives.

## 0.0.29

### Patch Changes

- Updated dependencies [[`bca0117`](https://github.com/knocklabs/telegraph/commit/bca011776c3b8b96e4f46a049578fcd7a167e052)]:
  - @telegraph/layout@0.2.0

## 0.0.28

### Patch Changes

- [#502](https://github.com/knocklabs/telegraph/pull/502) [`6e5d6c3`](https://github.com/knocklabs/telegraph/commit/6e5d6c313f630f2095c7ef3622520daf8e3ab1e2) Thanks [@kylemcd](https://github.com/kylemcd)! - update packages to use react-m and remove animate presence to shrink bundle

- [#501](https://github.com/knocklabs/telegraph/pull/501) [`dc12662`](https://github.com/knocklabs/telegraph/commit/dc12662f6f41697d976d0978871a567d564777e8) Thanks [@kylemcd](https://github.com/kylemcd)! - deprecate usage of `@telegraph/motion` in favor of tiny `motion` package

- [#498](https://github.com/knocklabs/telegraph/pull/498) [`99e01e3`](https://github.com/knocklabs/telegraph/commit/99e01e3dcf7508af0bfae14e9b62cccff7af3388) Thanks [@kylemcd](https://github.com/kylemcd)! - update imports for the `Lucide` object from `@telegraph/icon` to import icons directly from `lucide-react` instead.

- Updated dependencies [[`e554068`](https://github.com/knocklabs/telegraph/commit/e554068b0f9ca5a1e8fe9d6f27dd2a30373a3cc8), [`99e01e3`](https://github.com/knocklabs/telegraph/commit/99e01e3dcf7508af0bfae14e9b62cccff7af3388), [`2d3e1cd`](https://github.com/knocklabs/telegraph/commit/2d3e1cddd8a6bfac7108e350649f81bdc18f57c8)]:
  - @telegraph/layout@0.1.21

## 0.0.27

### Patch Changes

- [#494](https://github.com/knocklabs/telegraph/pull/494) [`e769470`](https://github.com/knocklabs/telegraph/commit/e7694701fb63ebc65d9fe77d9a89c8f0bf557b67) Thanks [@kylemcd](https://github.com/kylemcd)! - update package exports to be in the correct order

- [#495](https://github.com/knocklabs/telegraph/pull/495) [`f5d6a69`](https://github.com/knocklabs/telegraph/commit/f5d6a693e078dbfa1c99a78dc7b8ec6a9c34218a) Thanks [@kylemcd](https://github.com/kylemcd)! - fix typescript build issues

- [#493](https://github.com/knocklabs/telegraph/pull/493) [`5209f6d`](https://github.com/knocklabs/telegraph/commit/5209f6d6c8ed9d71d61c76c089541b14d3369a35) Thanks [@kylemcd](https://github.com/kylemcd)! - update radix deps to latest

- Updated dependencies [[`e769470`](https://github.com/knocklabs/telegraph/commit/e7694701fb63ebc65d9fe77d9a89c8f0bf557b67)]:
  - @telegraph/helpers@0.0.13
  - @telegraph/layout@0.1.20
  - @telegraph/motion@0.0.9

## 0.0.26

### Patch Changes

- Updated dependencies [[`def8e98`](https://github.com/knocklabs/telegraph/commit/def8e983fe8d90d3d35f8ffe81ceb9daa46e1b30)]:
  - @telegraph/layout@0.1.19
  - @telegraph/helpers@0.0.12
  - @telegraph/motion@0.0.8

## 0.0.25

### Patch Changes

- [#476](https://github.com/knocklabs/telegraph/pull/476) [`bad64d8`](https://github.com/knocklabs/telegraph/commit/bad64d8996ba2304dc84ca81d0393bff5844fc96) Thanks [@dependabot](https://github.com/apps/dependabot)! - chore(deps): bump @radix-ui/react-use-controllable-state from 1.1.0 to 1.2.2

- Updated dependencies [[`45d2fe1`](https://github.com/knocklabs/telegraph/commit/45d2fe1284b97f984fb08f118e25a9d6bc58c353)]:
  - @telegraph/layout@0.1.18

## 0.0.24

### Patch Changes

- Updated dependencies []:
  - @telegraph/layout@0.1.17
  - @telegraph/motion@0.0.8

## 0.0.23

### Patch Changes

- [#441](https://github.com/knocklabs/telegraph/pull/441) [`14ea9d1`](https://github.com/knocklabs/telegraph/commit/14ea9d164d69c0adeae4f2405565592aa4c9c75c) Thanks [@kylemcd](https://github.com/kylemcd)! - adds `skipAnimation` prop to `<Motion/>` and integrates into `<Popover/>` and `<Tooltip/>`

- Updated dependencies [[`14ea9d1`](https://github.com/knocklabs/telegraph/commit/14ea9d164d69c0adeae4f2405565592aa4c9c75c)]:
  - @telegraph/motion@0.0.8

## 0.0.22

### Patch Changes

- Updated dependencies [[`955c255`](https://github.com/knocklabs/telegraph/commit/955c25512468a67717de9e56a6b49f72ff53279e)]:
  - @telegraph/helpers@0.0.12
  - @telegraph/layout@0.1.16

## 0.0.21

### Patch Changes

- Updated dependencies []:
  - @telegraph/layout@0.1.15

## 0.0.20

### Patch Changes

- Updated dependencies []:
  - @telegraph/layout@0.1.14
  - @telegraph/motion@0.0.7

## 0.0.19

### Patch Changes

- Updated dependencies [[`061bb93`](https://github.com/knocklabs/telegraph/commit/061bb9367a211650add6e2f54cbce5c85b69a137)]:
  - @telegraph/layout@0.1.13

## 0.0.18

### Patch Changes

- [#395](https://github.com/knocklabs/telegraph/pull/395) [`5b4d487`](https://github.com/knocklabs/telegraph/commit/5b4d487105c657296cabdc02b1b29ea588863905) Thanks [@dependabot](https://github.com/apps/dependabot)! - upgrade radix popover dep

- [#384](https://github.com/knocklabs/telegraph/pull/384) [`552fb82`](https://github.com/knocklabs/telegraph/commit/552fb82a33203c87e58715b4a52ea0c360999636) Thanks [@dependabot](https://github.com/apps/dependabot)! - upgrade typescript dep

- Updated dependencies [[`552fb82`](https://github.com/knocklabs/telegraph/commit/552fb82a33203c87e58715b4a52ea0c360999636)]:
  - @telegraph/helpers@0.0.11
  - @telegraph/layout@0.1.12
  - @telegraph/motion@0.0.7

## 0.0.17

### Patch Changes

- [#408](https://github.com/knocklabs/telegraph/pull/408) [`916d37c`](https://github.com/knocklabs/telegraph/commit/916d37cc78433eeb70a93e041b18f951d2d25bcd) Thanks [@MikeCarbone](https://github.com/MikeCarbone)! - chore: minor upgrades to react, fixes peer dependency issues

- [#409](https://github.com/knocklabs/telegraph/pull/409) [`734b5c5`](https://github.com/knocklabs/telegraph/commit/734b5c5ee2ac0484a09f534148a4ca1cf23fb3d0) Thanks [@MikeCarbone](https://github.com/MikeCarbone)! - chore: adds React 19 as a peer dependency

- Updated dependencies [[`916d37c`](https://github.com/knocklabs/telegraph/commit/916d37cc78433eeb70a93e041b18f951d2d25bcd), [`734b5c5`](https://github.com/knocklabs/telegraph/commit/734b5c5ee2ac0484a09f534148a4ca1cf23fb3d0)]:
  - @telegraph/helpers@0.0.10
  - @telegraph/layout@0.1.11
  - @telegraph/motion@0.0.6

## 0.0.14

### Patch Changes

- Updated dependencies [[`2925a69`](https://github.com/knocklabs/telegraph/commit/2925a699379f14b08fc91d2c5f84a143dfda01eb)]:
  - @telegraph/layout@0.1.8
  - @telegraph/helpers@0.0.7
  - @telegraph/motion@0.0.3

## 0.0.13

### Patch Changes

- Updated dependencies [[`47723a4`](https://github.com/knocklabs/telegraph/commit/47723a426e1734d6bfa6c69000690875d0d101cc)]:
  - @telegraph/layout@0.1.6

## 0.0.12

### Patch Changes

- Updated dependencies []:
  - @telegraph/layout@0.1.5

## 0.0.11

### Patch Changes

- Updated dependencies []:
  - @telegraph/layout@0.1.4

## 0.0.10

### Patch Changes

- [`bbdf59b`](https://github.com/knocklabs/telegraph/commit/bbdf59b316b315075bb7cb8ec20225e438f8e756) Thanks [@kylemcd](https://github.com/kylemcd)! - fix issue where refs weren't being properly applied to components using motion

- Updated dependencies [[`bbdf59b`](https://github.com/knocklabs/telegraph/commit/bbdf59b316b315075bb7cb8ec20225e438f8e756)]:
  - @telegraph/motion@0.0.3

## 0.0.9

### Patch Changes

- [#368](https://github.com/knocklabs/telegraph/pull/368) [`22ac9d0`](https://github.com/knocklabs/telegraph/commit/22ac9d0ff28ef0966edd31a4016c76d8a7ae91ad) Thanks [@kylemcd](https://github.com/kylemcd)! - motion updates

- Updated dependencies [[`a748be4`](https://github.com/knocklabs/telegraph/commit/a748be4d48b4e26908deaa120389598e185007c6), [`22ac9d0`](https://github.com/knocklabs/telegraph/commit/22ac9d0ff28ef0966edd31a4016c76d8a7ae91ad), [`8fdf776`](https://github.com/knocklabs/telegraph/commit/8fdf77633d6991014ffa55b32b1ba45ef124f917), [`6cf176f`](https://github.com/knocklabs/telegraph/commit/6cf176fc3272d89d725951b5024dd0db4cf9a4e8), [`6cf176f`](https://github.com/knocklabs/telegraph/commit/6cf176fc3272d89d725951b5024dd0db4cf9a4e8), [`bc6c1f4`](https://github.com/knocklabs/telegraph/commit/bc6c1f4223380b310487d72dc4153e499f07fefe)]:
  - @telegraph/layout@0.1.3
  - @telegraph/motion@0.0.2

## 0.0.8

### Patch Changes

- Updated dependencies [[`a9ece46`](https://github.com/knocklabs/telegraph/commit/a9ece460f0b90927e3808c83d6c90eabb118aed0)]:
  - @telegraph/layout@0.1.2

## 0.0.7

### Patch Changes

- Updated dependencies [[`6a9c100`](https://github.com/knocklabs/telegraph/commit/6a9c10012e435b297756adff6b89976453e5d890)]:
  - @telegraph/layout@0.1.1

## 0.0.6

### Patch Changes

- [#352](https://github.com/knocklabs/telegraph/pull/352) [`aae39d2`](https://github.com/knocklabs/telegraph/commit/aae39d2b088730f91bba0ce417d85af4a1a5b7f8) Thanks [@kylemcd](https://github.com/kylemcd)! - @telegraph/motion and integration into @telegraph/popover

- Updated dependencies [[`7ef8fe2`](https://github.com/knocklabs/telegraph/commit/7ef8fe2df51b1f632163918095a5496322277cad), [`aae39d2`](https://github.com/knocklabs/telegraph/commit/aae39d2b088730f91bba0ce417d85af4a1a5b7f8)]:
  - @telegraph/layout@0.1.0
  - @telegraph/motion@0.0.1

## 0.0.3

### Patch Changes

- Updated dependencies [[`1b0bb33`](https://github.com/knocklabs/telegraph/commit/1b0bb333d6ca1664971d19d48d3b036c6711d554)]:
  - @telegraph/helpers@0.0.6
  - @telegraph/layout@0.0.28

## 0.0.2

### Patch Changes

- Updated dependencies []:
  - @telegraph/layout@0.0.27

## 0.0.1

### Patch Changes

- [#192](https://github.com/knocklabs/telegraph/pull/192) [`661854e`](https://github.com/knocklabs/telegraph/commit/661854eba8553eb7a112d1f3f5f5555a27729581) Thanks [@connorlindsey](https://github.com/connorlindsey)! - feat: add popover component. Pass ref through RefToTgphRef.

- Updated dependencies [[`661854e`](https://github.com/knocklabs/telegraph/commit/661854eba8553eb7a112d1f3f5f5555a27729581)]:
  - @telegraph/helpers@0.0.5
  - @telegraph/layout@0.0.26
