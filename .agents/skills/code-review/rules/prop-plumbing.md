# Prop plumbing

Rule 1 of `polymorphic-types.md` covers types that lie about what they accept.
This file covers the opposite direction: the type is right and the component
does not honor it. Nothing in the toolchain reports any of these.

Start by running the sweep. It is faster than reading and it does not get tired.

```bash
node .agents/skills/code-review/scripts/check-prop-plumbing.cjs
```

## 1. A destructured prop must be referenced (sweep B)

```tsx
const Root = <T extends TgphElement = "div">(rootProps: RootProps<T>) => {
  const { as, className, ...props } = rootProps as RootProps<"div">;

  // Wrong — `as` is accepted, pulled out of the spread, and thrown away
  return <Stack direction="row" className={className} {...props} />;

  // Correct
  return <Stack as={as} direction="row" className={className} {...props} />;
};
```

`Toggle.Root` shipped the wrong version. `<Toggle.Root as="fieldset">` compiled
and rendered a `div`.

**Why nothing catches it.** `@typescript-eslint/no-unused-vars` runs with
`ignoreRestSiblings: true` in `@knocklabs/eslint-config/library.js`. That option
exists to allow the omit-by-destructuring idiom, and it exempts this exact
pattern by design. The shared config also loads `only-warn`, so even a hit would
not fail anything.

**The rule.** Every name you destructure out of props is either referenced later
in the same function or renamed to `_name`. There is no third case. If you are
pulling a prop out only to keep it off the spread, that is a discard: rename it
and go to section 3.

Sweep B covers both destructuring forms, `const { … } = rootProps` and
`({ … }: RootProps) =>`. A sweep that handles only one leaves half the
components unchecked.

## 2. A prop you declare must be destructured (sweep C)

```ts
export type MenuItemProps<T extends TgphElement = "button"> =
  TgphComponentProps<typeof Button.Root<T>> & {
    // Declared rather than inherited: no `fontWeight` exists on Button.Root
    // or the element passthrough.
    fontWeight?: ButtonTextProps["weight"];
  };
```

`MenuItem` did not destructure `fontWeight`, so it stayed in the rest element,
spread onto `Button.Root`, and reached the DOM as a `font-weight` attribute on
the rendered button.

**The distinction that matters.** A prop _inherited_ from the element
passthrough is safe in the rest spread: it is a real attribute of the element
being rendered. A prop Telegraph _invents_ is not. It has to be destructured out
before the spread, whether or not the component uses it.

Sweep C reports invented props on exported `*Props` types that the file never
destructures. Each hit needs a verdict, because forwarding to a Telegraph child
that does consume the prop is legitimate.

## 3. A discard must be paired with the type dropping the prop (sweep A)

`const { as: _as, ...props } = rootProps as RootProps & { as?: TgphElement }`
is correct only when `RootProps` does not declare `as`. The cast exists because
a spread from a consumer can still carry the prop at runtime, not because the
prop is part of the API.

If the public type still advertises the prop, the discard is the bug. See rule 5
of `polymorphic-types.md` for where the cast goes.

## 4. A phantom prop is worse than a missing one

`Tooltip` declared `asChild?: boolean` and had no code path that read it.
A consumer passing it gets no error, no warning, and no behavior. Removing it is
a breaking change to the type and a no-op at runtime, which is the best possible
outcome and still a release note.

Before adding a prop, find the line that consumes it. If you cannot point at
one, do not declare it.

## 5. Deriving the rendered element: use the shared predicate

`Button.Root` does not always render the element you asked for:

```ts
const rendersNativeButton = (as?: TgphElement, disabled?: boolean) =>
  !!disabled || !as || as === "button";

const derivedAs = rendersNativeButton(as, disabled) ? "button" : as;
```

`disabled` forces a real `<button>` regardless of `as`, because the native
`disabled` attribute is what actually blocks clicks.

Base UI components take a `nativeButton` prop and log a development error when
it disagrees with the tag that renders. Any wrapper that renders a
`Button.Root` inside a Base UI component must derive that prop from the same
predicate:

```ts
import { rendersNativeButton } from "@telegraph/button";

const nativeButton = rendersNativeButton(props.as, disabled);
```

```ts
// Wrong — ignores `disabled`, so a disabled `as={NextLink}` tab renders a
// <button> while claiming it did not
const nativeButton = !props.as || props.as === "button";
```

`Tab` shipped the wrong version. Four call sites derive this today: `Tab`,
`SegmentedControl`, and two in `Menu`. If you add a fifth, import the predicate
rather than re-deriving it.

**Testing this one is unusual.** Base UI composite items such as tabs stay
focusable while disabled so arrow-key navigation still reaches them, so they
render `aria-disabled` plus `tabindex="0"` and never a native `disabled`
attribute. Asserting on `disabled` will fail against both the broken and the
fixed component. The observable signal is the console error, so spy on it.
