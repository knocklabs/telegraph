# Polymorphic prop types

Every Telegraph component takes `as` and forwards the props of whatever element
it renders. The types that express this are load-bearing and easy to break in
ways that compile. Each rule below has a shape to copy, a shape to reject, and
the mechanism that makes the wrong shape wrong.

## 1. Never build the element passthrough by hand

```ts
// Correct
export type FooProps<T extends TgphElement = "div"> = PolymorphicProps<T> & {
  variant?: "a" | "b";
};

// Wrong
export type FooProps<T extends TgphElement = "div"> = Omit<
  React.ComponentProps<T>,
  "as"
> & { variant?: "a" | "b" };
```

**Mechanism.** `T` is not always resolved. When a consumer writes `<Foo />` with
no `as`, or when the type is referenced without an argument, `T` is the whole
`React.ElementType` union. `React.ComponentProps<React.ElementType>` is
`{ [x: string]: any }`, so `Omit<…, "as">` keeps that index signature. The
resulting props type accepts every prop name in existence, and every component
that intersects it inherits the hole.

This is not theoretical. It was the state of the library before #922: 341 real
prop errors in `control` were being hidden by it.

`PolymorphicProps` (`packages/helpers/src/types/utility.ts:61`) guards the case
with `React.ElementType extends E ? unknown : Omit<…>`, dropping the passthrough
rather than widening it. Use it, or `PolymorphicPropsWithTgphRef` when the
component also takes `tgphRef`.

**Review check.** Any `React.ComponentProps<`, `ComponentPropsWithoutRef<`, or
`JSX.IntrinsicElements[` applied to a generic parameter in a props type. It
needs the unresolved-`E` guard or it is a hole.

**Test.** Every package asserts this already. Add the type to the list:

```ts
expectTypeOf<FooProps>().not.toHaveProperty("notARealProp");
```

## 2. `as?: T` must sit at the top level of the intersection

```ts
// Correct — omit, then re-declare at the top level
export type RootProps<T extends TgphElement = "button"> = Omit<
  StackProps<T>,
  "tgphRef" | "as" | "onClick"
> &
  AsAndTgphRefProps<T, HTMLButtonElement> &
  RootBaseProps;

// Wrong — the omit now wraps `as`, so `T` has no inference site
export type RootProps<T extends TgphElement = "button"> = Omit<
  StackProps<T> & { as?: T; tgphRef?: React.Ref<HTMLButtonElement> },
  "onClick"
> &
  RootBaseProps;
```

**Mechanism.** TypeScript infers `T` from the `as` prop at the call site. It
cannot infer through a mapped type. `Omit`, `Partial`, `Pick`, `Required` and
`RemappedOmit` are all mapped types, so any of them in front of `as?: T` stops
`<Root as="a" />` resolving `T` to `"a"`. `T` falls back to its default,
`href` is rejected, and the component's whole reason for being polymorphic is
gone.

The two-line version reads redundant and it is not. Do not "simplify" it by
folding the re-declaration back inside the omit. `AsAndTgphRefProps`
(`packages/helpers/src/types/utility.ts:90`) exists to make the intent obvious
and carries a comment saying so.

**Review check.** A refactor that reduces an omit-then-re-declare into a single
mapped type. It always compiles.

**Test.**

```ts
<Foo as="a" href="/docs" />;          // must compile
<Foo as="a" notAnAnchorProp="x" />;   // must be a @ts-expect-error
```

The first line alone is not enough. With a catch-all index signature it passes
too.

## 3. Never reference a generic props type bare

```ts
// Correct
export type TabProps<T extends TgphElement = "button"> = {
  value: string;
} & TgphComponentProps<typeof MenuItem<T>>;

// Wrong
export type TabProps<T extends TgphElement = "button"> = {
  value: string;
  as?: T;
} & MenuItemProps;
```

**Mechanism.** `MenuItemProps` has a default, so bare it means
`MenuItemProps<"button">`, which carries `as?: "button"`. Intersecting that with
`as?: T` gives `as?: "button" & T`. For any `T` that is not `"button"` the
intersection is `never`, so `<Tab as={NextLink} />` reports that the component
is not assignable to `"button"`.

This is the defect #928 fixed across select, icon, toggle, combobox, menu and
segmented-control.

**Review check.** Any `SomethingProps` used without a type argument inside
another props type. It is nearly always wrong. Pass `T` through, and when you
need a component's props go through `TgphComponentProps<typeof X<T>>` so the
generic travels with it.

**Exception.** Resolving through the default is fine when the value provably
does not depend on the element type, and the code says why:

```ts
// MenuItem's icon props do not depend on its element type, so resolving them
// through the default element loses nothing.
type TabIconProps = NonNullable<MenuItemProps<"button">["leadingIcon"]>;
```

## 4. Do not intersect a passthrough that is already inherited

```ts
// Correct — BoxProps<T> already carries the element props
export type StackProps<T extends TgphElement = "div"> = Omit<
  BoxProps<T>,
  "as"
> &
  AsProp<T> &
  StyleProps;

// Wrong — repeats the entire element prop set a second time
export type StackProps<T extends TgphElement = "div"> = BoxProps<T> &
  PolymorphicProps<T> &
  StyleProps;
```

**Mechanism.** The passthrough is large. Intersecting it twice does not change
what the type accepts, so nothing fails, and it multiplies the work the checker
does at every call site. #925 removed these; do not add them back.

**Review check.** A props type that intersects both a Telegraph component's
props and `PolymorphicProps`/`ComponentProps` for the same `T`.

## 5. When a component ignores `as`, drop it from the type and cast in the body

Some components render a fixed element on purpose. A `Modal.Root` is always the
Base UI root; a `Combobox` trigger indicator is always `motion.span`. Those must
not advertise `as`.

```ts
// Correct — `as` is absent from RootProps; the cast is on the value
const Root = (rootProps: RootProps) => {
  const {
    // Discarded as well as dropped from the type, because a spread can still
    // carry it.
    as: _as,
    ...props
  } = rootProps as RootProps & { as?: TgphElement };

// Wrong — the cast is on the parameter, which puts `as` back in the public type
const Root = ({ as: _as, ...props }: RootProps & { as?: TgphElement }) => {
```

**Mechanism.** A parameter's declared type _is_ the component's public props
type. Widening it there re-advertises `as`, so `<Modal.Root as="div">` compiles
and does nothing — the exact bug the change was meant to remove. Casting the
value inside the body strips the prop at runtime without touching the public
type.

Keep the discard named `_as`: `varsIgnorePattern: "^_"` in the shared eslint
config depends on the prefix, and sweep A in `check-prop-plumbing.cjs` uses it
to tell a deliberate discard from a dropped prop.

**Review check.** Every `_`-prefixed discard must be paired with the prop being
absent from the public type. Run sweep A and check each hit against its type.

## 6. `Omit` versus `RemappedOmit`

`Omit<T, K>` can resolve to `Record<string, any>` when `T` is a union or an
unresolved generic, which reintroduces the hole from rule 1. `RemappedOmit`
(`packages/helpers/src/types/utility.ts:107`) is a key-remapping mapped type
that eliminates the keys outright.

Prefer `RemappedOmit` when omitting from a type that is generic or a union.
Both are mapped types, so rule 2 still applies to both.
