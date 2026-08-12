# @telegraph/select

## 0.1.2

### Patch Changes

- Updated dependencies [[`3a9004a`](https://github.com/knocklabs/telegraph/commit/3a9004a2657ef2d4ff8279af973dfc2151540676)]:
  - @telegraph/combobox@0.5.2

## 0.1.1

### Patch Changes

- Updated dependencies [[`5015089`](https://github.com/knocklabs/telegraph/commit/5015089fd7a94dde8214ef383fa78d86c3aec688)]:
  - @telegraph/helpers@0.3.0
  - @telegraph/combobox@0.5.1

## 0.1.0

### Minor Changes

- [#922](https://github.com/knocklabs/telegraph/pull/922) [`32a08b3`](https://github.com/knocklabs/telegraph/commit/32a08b3c8e4280c9d2f93f6bb53a76b8ab5e47b3) Thanks [@kylemcd](https://github.com/kylemcd)! - `Select.Root` is now generic over its value, so `onValueChange` reports the value type the caller selected over instead of the whole union `Combobox` accepts. Reading the props off `typeof Combobox.Root` instantiated Combobox's value parameter at its constraint, so a single-string select handed its consumer back `string | { value, label } | Array<...>` and every call site had to narrow the value it had just supplied.

  The value type is inferred from `value`/`defaultValue` and defaults to `string`:

  ```tsx
  const [value, setValue] = useState<string>("");
  <Select.Root value={value} onValueChange={setValue} />; // (value: string) => void

  const [values, setValues] = useState<Array<string>>([]);
  <Select.Root value={values} onValueChange={setValues} />; // (value: Array<string>) => void
  ```

  **Breaking in three ways.** `value` is now a string or an array of strings — matching `Select.Option`, whose `value` has always been a string — so passing `null`, an option object, or a non-string union is an error.

  `legacyBehavior` is no longer accepted, and is now discarded rather than forwarded: it makes Combobox emit `{ value, label }` option objects, which `Select.Option` cannot produce and `onValueChange` no longer describes. Use `Combobox` directly for that.

  `layout` now applies only to selects over an array of values. It was always declared as `never` for a single value (`layout` positions multiple selected tags); reading the props with the value parameter at its constraint is what previously made it look available on every Select.

  `Select.Option` now accepts `label`, which it previously omitted from its props type while honoring at runtime. It defaults to `children`, and overriding it is how a plain-text label reaches search and the trigger when `children` is rich:

  ```tsx
  <Select.Option value="1" label="Option 1">
    <b>Option 1</b>
  </Select.Option>
  ```

  This also fixes an inconsistency for `label={undefined}`. `Select.Option` took `label` through its rest spread, which landed the explicit `undefined` after the fallback and erased it, so the option rendered its raw `value` while the trigger still rendered `children`. The two paths now agree.

  Runtime behavior is otherwise unchanged.

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

- [#931](https://github.com/knocklabs/telegraph/pull/931) [`4de60e4`](https://github.com/knocklabs/telegraph/commit/4de60e4b49c051dc9c3399e573cf623dc397ae34) Thanks [@kylemcd](https://github.com/kylemcd)! - Update the READMEs for the prop-validation change.

  The `Modal.Content` custom-animation example passed `as={motion.div}`. `Modal.Content` always renders the animated element now, so the example animates a child instead. Copying it used to give a type error.

  `Popover.Content` drops its custom-animation example. The props table and the `skipAnimation` example already cover turning the built-in animation off.

  `Modal.Body` no longer documents `flex`, and the Tabs root no longer documents `disabled`. Neither prop existed. The catch-all index signature hid that.

  `Menu.Button` documents `as` and `nativeButton`. `SegmentedControl.Option` and `Select.Option` document `as`. `Select.Option` documents `label`.

  The `@telegraph/textarea` README documented seven props that do not exist: `autoResize`, `minRows`, `maxRows`, `showCharacterCount`, `state`, `errorMessage` and `helperText`. Roughly half its examples were built around them. It also gave `size` two values outside the scale, and the wrong default for `size` and `resize`. The README now documents the real component, and every example in it compiles.

  `@telegraph/helpers` gains a "Type checking" section covering the two cases that surprise people: a `data-*` key alone in a nested prop bag, and a `tgphRef` whose element type does not match. The README is the only prose that reaches an installed package, because no package publishes its changelog.

- Updated dependencies [[`32a08b3`](https://github.com/knocklabs/telegraph/commit/32a08b3c8e4280c9d2f93f6bb53a76b8ab5e47b3), [`4de60e4`](https://github.com/knocklabs/telegraph/commit/4de60e4b49c051dc9c3399e573cf623dc397ae34), [`88ea929`](https://github.com/knocklabs/telegraph/commit/88ea9296955fd6202c01686cfe2b097306019a19), [`3498748`](https://github.com/knocklabs/telegraph/commit/3498748c83003c7dfbc9f7364fd3f2ae9a7871c5)]:
  - @telegraph/helpers@0.2.0
  - @telegraph/combobox@0.5.0

## 0.0.101

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.4.3
  - @telegraph/helpers@0.1.0

## 0.0.100

### Patch Changes

- Updated dependencies [[`7849e7d`](https://github.com/knocklabs/telegraph/commit/7849e7d12af4b61b430984dd5b0b6d24411cb7d3), [`c5145da`](https://github.com/knocklabs/telegraph/commit/c5145daf880a13a59205992f3edf765402e8cdfa)]:
  - @telegraph/combobox@0.4.2
  - @telegraph/helpers@0.1.0

## 0.0.99

### Patch Changes

- Updated dependencies [[`13c3aa2`](https://github.com/knocklabs/telegraph/commit/13c3aa24c301d33a00701376ed54eca70205da0d)]:
  - @telegraph/combobox@0.4.1
  - @telegraph/helpers@0.1.0

## 0.0.98

### Patch Changes

- [#837](https://github.com/knocklabs/telegraph/pull/837) [`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde) Thanks [@kylemcd](https://github.com/kylemcd)! - Verify Select against the migrated Combobox implementation, including single-select, multi-select, prop pass-through, portalled accessibility scans, keyboard selection, Escape dismissal, and focus return.

- Updated dependencies [[`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde), [`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde), [`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde), [`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde), [`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde), [`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde)]:
  - @telegraph/helpers@0.1.0
  - @telegraph/combobox@0.4.0

## 0.0.97

### Patch Changes

- Updated dependencies [[`f9c6e1c`](https://github.com/knocklabs/telegraph/commit/f9c6e1c078a1bd3d6a8e5eb0ce2dd6713ccc781e)]:
  - @telegraph/helpers@0.0.16
  - @telegraph/combobox@0.3.6

## 0.0.96

### Patch Changes

- [#821](https://github.com/knocklabs/telegraph/pull/821) [`ee56d9e`](https://github.com/knocklabs/telegraph/commit/ee56d9e381f06232a0d03b1db72a4c6ba04da334) Thanks [@kylemcd](https://github.com/kylemcd)! - Add hover-to-open submenus to Menu via `Menu.Sub`, `Menu.SubTrigger`, and `Menu.SubContent`. These wrap Radix's submenu primitives, so a submenu now opens on hover (and `→` / `Enter`), coordinates open/close with its parent, supports keyboard navigation and "safe triangle" pointer tracking, and positions itself to the side automatically. `Menu.SubTrigger` defaults to a trailing chevron. This replaces the previous nested-`Menu.Root` workaround, which only opened on click.

  Combobox, Select, Filter, and Tabs receive a patch release so they ship against the new Menu.

- Updated dependencies [[`ee56d9e`](https://github.com/knocklabs/telegraph/commit/ee56d9e381f06232a0d03b1db72a4c6ba04da334)]:
  - @telegraph/combobox@0.3.5

## 0.0.95

### Patch Changes

- [#818](https://github.com/knocklabs/telegraph/pull/818) [`595de43`](https://github.com/knocklabs/telegraph/commit/595de43078651f125657cbe8072a9e5a3f095a12) Thanks [@kylemcd](https://github.com/kylemcd)! - Fix checkmark flash in Menu/Combobox/Select on open. Menu item checkmarks no longer briefly appear selected for every item before normalizing — the motion element now initializes at its target state (`initial={false}`) instead of flashing visible on mount. Also hoisted the `LazyMotion` provider from each `MenuItem` up into `Menu.Content` so it's instantiated once per menu rather than per item.

- Updated dependencies [[`595de43`](https://github.com/knocklabs/telegraph/commit/595de43078651f125657cbe8072a9e5a3f095a12)]:
  - @telegraph/combobox@0.3.4

## 0.0.94

### Patch Changes

- Updated dependencies [[`ef0aa8e`](https://github.com/knocklabs/telegraph/commit/ef0aa8e6bcf08c7108a3e3cc0261d543faaf2bb2)]:
  - @telegraph/combobox@0.3.3
  - @telegraph/helpers@0.0.15

## 0.0.93

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.3.2

## 0.0.92

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.3.1

## 0.0.91

### Patch Changes

- Updated dependencies [[`12ed121`](https://github.com/knocklabs/telegraph/commit/12ed1211ce7d8ad9316660b4f6fea4f5528a78a5)]:
  - @telegraph/combobox@0.3.0

## 0.0.90

### Patch Changes

- Updated dependencies [[`fdcd5cb`](https://github.com/knocklabs/telegraph/commit/fdcd5cbb07108dd0df83d471a53bc578566a00c1)]:
  - @telegraph/combobox@0.2.7
  - @telegraph/helpers@0.0.15

## 0.0.89

### Patch Changes

- Updated dependencies [[`f9dcbe7`](https://github.com/knocklabs/telegraph/commit/f9dcbe7bd8c79afd3dd25329b1f6ea6df202f85a)]:
  - @telegraph/combobox@0.2.6

## 0.0.88

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.2.5

## 0.0.87

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.2.4

## 0.0.86

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.2.3

## 0.0.85

### Patch Changes

- Updated dependencies [[`16e678c`](https://github.com/knocklabs/telegraph/commit/16e678c5e8bc7f13613116954bc15099a8694bb7)]:
  - @telegraph/combobox@0.2.2

## 0.0.84

### Patch Changes

- Updated dependencies [[`4ab1d02`](https://github.com/knocklabs/telegraph/commit/4ab1d02cf51db16024e7098d4c9f9b963b8fac37)]:
  - @telegraph/combobox@0.2.1

## 0.0.83

### Patch Changes

- Updated dependencies [[`8d55540`](https://github.com/knocklabs/telegraph/commit/8d5554005bea4695560efbee9ea4333ccddfc1bf)]:
  - @telegraph/combobox@0.2.0

## 0.0.82

### Patch Changes

- Updated dependencies [[`5196b27`](https://github.com/knocklabs/telegraph/commit/5196b2774b2aa218da7fa721ee59fd16049d18de)]:
  - @telegraph/combobox@0.1.28

## 0.0.81

### Patch Changes

- [#679](https://github.com/knocklabs/telegraph/pull/679) [`7111048`](https://github.com/knocklabs/telegraph/commit/71110486996cf8e447f503bf1aef63aeee1a6d4e) Thanks [@kylemcd](https://github.com/kylemcd)! - feat: add defaultValue and defaultScrollToValue, automatically scroll to value on open

- Updated dependencies [[`7111048`](https://github.com/knocklabs/telegraph/commit/71110486996cf8e447f503bf1aef63aeee1a6d4e)]:
  - @telegraph/combobox@0.1.27

## 0.0.80

### Patch Changes

- [#653](https://github.com/knocklabs/telegraph/pull/653) [`d6c6aa9`](https://github.com/knocklabs/telegraph/commit/d6c6aa9cb0e11ba96df7d7efd479c8e4652fc029) Thanks [@dependabot](https://github.com/apps/dependabot)! - chore(deps): bump react and @types/react

- Updated dependencies [[`d6c6aa9`](https://github.com/knocklabs/telegraph/commit/d6c6aa9cb0e11ba96df7d7efd479c8e4652fc029)]:
  - @telegraph/combobox@0.1.26
  - @telegraph/helpers@0.0.15

## 0.0.79

### Patch Changes

- Updated dependencies [[`b32cee5`](https://github.com/knocklabs/telegraph/commit/b32cee572cdabc573814253d20444283aebfdbd2)]:
  - @telegraph/combobox@0.1.25

## 0.0.78

### Patch Changes

- Updated dependencies [[`c7ffe1d`](https://github.com/knocklabs/telegraph/commit/c7ffe1d85a0320dec6a05b1fd386ba0092c48e37)]:
  - @telegraph/helpers@0.0.14
  - @telegraph/combobox@0.1.24

## 0.0.77

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.1.23

## 0.0.76

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.1.22

## 0.0.75

### Patch Changes

- Updated dependencies [[`8e068c8`](https://github.com/knocklabs/telegraph/commit/8e068c804d139fa9c3e43d1b9023c555000fe9de)]:
  - @telegraph/combobox@0.1.21

## 0.0.74

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.1.20

## 0.0.73

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.1.19

## 0.0.72

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.1.18

## 0.0.71

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.1.17

## 0.0.70

### Patch Changes

- Updated dependencies [[`f369dc9`](https://github.com/knocklabs/telegraph/commit/f369dc946e16ce48954873f48ca20a0f120100b5)]:
  - @telegraph/combobox@0.1.16

## 0.0.69

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.1.15

## 0.0.68

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.1.14

## 0.0.67

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.1.13

## 0.0.66

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.1.12

## 0.0.65

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.1.11

## 0.0.64

### Patch Changes

- Updated dependencies [[`4834ada`](https://github.com/knocklabs/telegraph/commit/4834ada4a00cdf8a9a1e524092f644d503cd3646)]:
  - @telegraph/combobox@0.1.10

## 0.0.63

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.1.9

## 0.0.62

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.1.8

## 0.0.61

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.1.7

## 0.0.60

### Patch Changes

- Updated dependencies [[`efcbf52`](https://github.com/knocklabs/telegraph/commit/efcbf52f5b3b364ba20fafc3cb66bbf0681172d7), [`b25935f`](https://github.com/knocklabs/telegraph/commit/b25935f52cc1af004b65704762e5729679493cdf)]:
  - @telegraph/combobox@0.1.6

## 0.0.59

### Patch Changes

- Updated dependencies [[`366b466`](https://github.com/knocklabs/telegraph/commit/366b4662d31fc822f42ea144207d8897d08ef3ad)]:
  - @telegraph/combobox@0.1.5

## 0.0.58

### Patch Changes

- Updated dependencies [[`7d587b9`](https://github.com/knocklabs/telegraph/commit/7d587b908df373676d556bd2fc3c242c37917496)]:
  - @telegraph/combobox@0.1.4

## 0.0.57

### Patch Changes

- Updated dependencies [[`23ae20c`](https://github.com/knocklabs/telegraph/commit/23ae20c41f62e6f0a8c6d5c60db882a24cf8512d)]:
  - @telegraph/combobox@0.1.3

## 0.0.56

### Patch Changes

- Updated dependencies [[`c0244e3`](https://github.com/knocklabs/telegraph/commit/c0244e3f4b6232f633ba4d99bb0eb603909c87fa)]:
  - @telegraph/combobox@0.1.2

## 0.0.55

### Patch Changes

- Updated dependencies [[`fd14d50`](https://github.com/knocklabs/telegraph/commit/fd14d509c3f3f76eafc07d08c73e30db79255a2e)]:
  - @telegraph/combobox@0.1.1

## 0.0.54

### Patch Changes

- Updated dependencies [[`aa0df27`](https://github.com/knocklabs/telegraph/commit/aa0df2714578f411fd7c80ce3610713d6e77d053)]:
  - @telegraph/combobox@0.1.0

## 0.0.53

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.0.91

## 0.0.52

### Patch Changes

- Updated dependencies [[`b29b966`](https://github.com/knocklabs/telegraph/commit/b29b966ae01a20e17d1839296ba5ba155e967621)]:
  - @telegraph/combobox@0.0.90

## 0.0.51

### Patch Changes

- Updated dependencies [[`6e5d6c3`](https://github.com/knocklabs/telegraph/commit/6e5d6c313f630f2095c7ef3622520daf8e3ab1e2), [`dc12662`](https://github.com/knocklabs/telegraph/commit/dc12662f6f41697d976d0978871a567d564777e8), [`99e01e3`](https://github.com/knocklabs/telegraph/commit/99e01e3dcf7508af0bfae14e9b62cccff7af3388)]:
  - @telegraph/combobox@0.0.89

## 0.0.50

### Patch Changes

- [#494](https://github.com/knocklabs/telegraph/pull/494) [`e769470`](https://github.com/knocklabs/telegraph/commit/e7694701fb63ebc65d9fe77d9a89c8f0bf557b67) Thanks [@kylemcd](https://github.com/kylemcd)! - update package exports to be in the correct order

- Updated dependencies [[`e769470`](https://github.com/knocklabs/telegraph/commit/e7694701fb63ebc65d9fe77d9a89c8f0bf557b67), [`f5d6a69`](https://github.com/knocklabs/telegraph/commit/f5d6a693e078dbfa1c99a78dc7b8ec6a9c34218a), [`5209f6d`](https://github.com/knocklabs/telegraph/commit/5209f6d6c8ed9d71d61c76c089541b14d3369a35)]:
  - @telegraph/combobox@0.0.88
  - @telegraph/helpers@0.0.13

## 0.0.49

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.0.87
  - @telegraph/helpers@0.0.12

## 0.0.48

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.0.86

## 0.0.47

### Patch Changes

- Updated dependencies [[`bad64d8`](https://github.com/knocklabs/telegraph/commit/bad64d8996ba2304dc84ca81d0393bff5844fc96)]:
  - @telegraph/combobox@0.0.85

## 0.0.46

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.0.84

## 0.0.45

### Patch Changes

- Updated dependencies [[`fa140c7`](https://github.com/knocklabs/telegraph/commit/fa140c7af8fa30c06a9b65d365304d279055efd8)]:
  - @telegraph/combobox@0.0.83

## 0.0.44

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.0.82

## 0.0.43

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.0.81

## 0.0.42

### Patch Changes

- Updated dependencies [[`5c0784e`](https://github.com/knocklabs/telegraph/commit/5c0784e3fc5198ae4a83ef5c09b7b8c57c8d264d)]:
  - @telegraph/combobox@0.0.80

## 0.0.41

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.0.79

## 0.0.40

### Patch Changes

- Updated dependencies [[`0dcbd65`](https://github.com/knocklabs/telegraph/commit/0dcbd65ba294edd97cdc4159533a8516433cd3c9)]:
  - @telegraph/combobox@0.0.78

## 0.0.39

### Patch Changes

- Updated dependencies [[`955c255`](https://github.com/knocklabs/telegraph/commit/955c25512468a67717de9e56a6b49f72ff53279e)]:
  - @telegraph/combobox@0.0.77
  - @telegraph/helpers@0.0.12

## 0.0.38

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.0.76

## 0.0.37

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.0.75

## 0.0.36

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.0.74

## 0.0.35

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.0.73

## 0.0.34

### Patch Changes

- Updated dependencies [[`a21c8d7`](https://github.com/knocklabs/telegraph/commit/a21c8d75b02c6bd90dfc6c286f6c6bf972d95a70)]:
  - @telegraph/combobox@0.0.72

## 0.0.33

### Patch Changes

- [#384](https://github.com/knocklabs/telegraph/pull/384) [`552fb82`](https://github.com/knocklabs/telegraph/commit/552fb82a33203c87e58715b4a52ea0c360999636) Thanks [@dependabot](https://github.com/apps/dependabot)! - upgrade typescript dep

- Updated dependencies [[`552fb82`](https://github.com/knocklabs/telegraph/commit/552fb82a33203c87e58715b4a52ea0c360999636)]:
  - @telegraph/combobox@0.0.71
  - @telegraph/helpers@0.0.11

## 0.0.32

### Patch Changes

- [#408](https://github.com/knocklabs/telegraph/pull/408) [`916d37c`](https://github.com/knocklabs/telegraph/commit/916d37cc78433eeb70a93e041b18f951d2d25bcd) Thanks [@MikeCarbone](https://github.com/MikeCarbone)! - chore: minor upgrades to react, fixes peer dependency issues

- [#409](https://github.com/knocklabs/telegraph/pull/409) [`734b5c5`](https://github.com/knocklabs/telegraph/commit/734b5c5ee2ac0484a09f534148a4ca1cf23fb3d0) Thanks [@MikeCarbone](https://github.com/MikeCarbone)! - chore: adds React 19 as a peer dependency

- Updated dependencies [[`916d37c`](https://github.com/knocklabs/telegraph/commit/916d37cc78433eeb70a93e041b18f951d2d25bcd), [`734b5c5`](https://github.com/knocklabs/telegraph/commit/734b5c5ee2ac0484a09f534148a4ca1cf23fb3d0)]:
  - @telegraph/combobox@0.0.70
  - @telegraph/helpers@0.0.10

## 0.0.29

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.0.67

## 0.0.28

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.0.66
  - @telegraph/helpers@0.0.7

## 0.0.27

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.0.65

## 0.0.26

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.0.64

## 0.0.25

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.0.63

## 0.0.24

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.0.62

## 0.0.23

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.0.61

## 0.0.22

### Patch Changes

- Updated dependencies [[`c532fc8`](https://github.com/knocklabs/telegraph/commit/c532fc8f0efc0671d62a90b4fc1d938a14fe4a52), [`9405270`](https://github.com/knocklabs/telegraph/commit/94052700d273f4776ceb16ff1ee502dabeba5fa4)]:
  - @telegraph/combobox@0.0.60

## 0.0.21

### Patch Changes

- Updated dependencies [[`eff031c`](https://github.com/knocklabs/telegraph/commit/eff031c01e5163230775366368d326fd86ade992)]:
  - @telegraph/combobox@0.0.59

## 0.0.20

### Patch Changes

- Updated dependencies [[`05ea45f`](https://github.com/knocklabs/telegraph/commit/05ea45f6f5858ac657755a98f9ec5bef3fc37625)]:
  - @telegraph/combobox@0.0.58

## 0.0.19

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.0.57

## 0.0.18

### Patch Changes

- Updated dependencies [[`c605b62`](https://github.com/knocklabs/telegraph/commit/c605b62a0e36a81847f5fe2afc1a33968984a49d)]:
  - @telegraph/combobox@0.0.56

## 0.0.17

### Patch Changes

- Updated dependencies [[`8fe81ee`](https://github.com/knocklabs/telegraph/commit/8fe81eec1eafa03111009b541da86aa2cf2dbd03)]:
  - @telegraph/combobox@0.0.55

## 0.0.16

### Patch Changes

- Updated dependencies [[`821374b`](https://github.com/knocklabs/telegraph/commit/821374b573e45015d9a9bf7a037eb89a7c19c2bc)]:
  - @telegraph/combobox@0.0.54

## 0.0.15

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.0.53

## 0.0.14

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.0.52

## 0.0.13

### Patch Changes

- [`6d87d10`](https://github.com/knocklabs/telegraph/commit/6d87d102d5ece0eae0a9dc5a33c67c183c7f510e) Thanks [@kylemcd](https://github.com/kylemcd)! - remove logic now contained in combobox from select component

## 0.0.12

### Patch Changes

- Updated dependencies [[`8f699f0`](https://github.com/knocklabs/telegraph/commit/8f699f03c7ce28e85299512811b95eb4631921bc)]:
  - @telegraph/combobox@0.0.51

## 0.0.11

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.0.50

## 0.0.10

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.0.49

## 0.0.9

### Patch Changes

- Updated dependencies [[`22ac9d0`](https://github.com/knocklabs/telegraph/commit/22ac9d0ff28ef0966edd31a4016c76d8a7ae91ad)]:
  - @telegraph/combobox@0.0.48

## 0.0.8

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.0.47

## 0.0.7

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.0.46

## 0.0.6

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.0.45

## 0.0.5

### Patch Changes

- Updated dependencies [[`2ed88f4`](https://github.com/knocklabs/telegraph/commit/2ed88f4870c33b755409c965f189caec29d77c80)]:
  - @telegraph/combobox@0.0.44

## 0.0.4

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.0.43

## 0.0.3

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.0.42

## 0.0.2

### Patch Changes

- Updated dependencies []:
  - @telegraph/combobox@0.0.41

## 0.0.1

### Patch Changes

- [#299](https://github.com/knocklabs/telegraph/pull/299) [`57d486e`](https://github.com/knocklabs/telegraph/commit/57d486e1da7b0c650bc39ac12528a5f0f4f3a374) Thanks [@kylemcd](https://github.com/kylemcd)! - new select component + combobox fixes

- Updated dependencies [[`57d486e`](https://github.com/knocklabs/telegraph/commit/57d486e1da7b0c650bc39ac12528a5f0f4f3a374)]:
  - @telegraph/combobox@0.0.40
