# Type tests

The prop types in this repo are the product. `*.test-d.tsx` files are how that
product is tested. A change that adds or alters a public prop is not reviewable
until the assertions exist.

## How the harness runs

`vitest/config.mts` turns on `typecheck` and scopes it:

```ts
typecheck: {
  enabled: true,
  include: ["**/*.test-d.{ts,tsx}"],
  ignoreSourceErrors: true,
},
```

They run as part of `yarn test`. Three consequences follow, and each is a way to
write a test that asserts nothing.

**Only `*.test-d.tsx` is typechecked.** In a `*.test.tsx`, vitest strips types
with esbuild. A `@ts-expect-error` there is a comment, and `expectTypeOf` is a
no-op. If you are asserting on types, the filename has to end `.test-d.tsx`.

**`ignoreSourceErrors: true` hides implementation errors.** The suite reports
only errors raised inside the type tests. A component whose body does not
compile can still show green here. Do not read a passing run as "the package
type-checks."

**An unused `@ts-expect-error` is itself an error.** This is the one thing
working in your favor: when a prop stops being rejected, the directive goes
unused and the suite fails. It is why negative assertions do not rot.

## The four assertions a public props type needs

```tsx
import { Foo } from ".";
import type { FooProps } from ".";
import { describe, expectTypeOf, it } from "vitest";

describe("Foo types", () => {
  // 1. No catch-all. This is the one that catches a regression of the
  //    passthrough guard, and nothing else does.
  it("has no catch-all index signature", () => {
    expectTypeOf<FooProps>().not.toHaveProperty("notARealProp");
  });

  // 2. Declared props keep their exact type rather than widening to `any`.
  it("keeps declared props narrow", () => {
    expectTypeOf<FooProps["variant"]>().not.toBeAny();
  });

  // 3. Unknown props and bad values are rejected.
  it("rejects unknown props", () => {
    <Foo
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Foo
      // @ts-expect-error not a variant
      variant="notAVariant"
    />;
  });

  // 4. `as` still resolves, so the element's own props are accepted.
  it("accepts valid props", () => {
    <Foo as="a" href="/docs" target="_blank" />;
    <Foo variant="soft" className="c" data-testid="x" />;
  });
});
```

Assertions 1 and 3 both catch a regression of the passthrough guard. Keep both:
assertion 3 fails with `Unused '@ts-expect-error' directive`, which does not
name the cause, and assertion 1 fails with the property name, which does.

Assertion 4 alone proves nothing. Under a catch-all, every line in it passes.
Never ship a type test that only checks the accepting direction.

## Build the packages first, or the suite tests the last release

Cross-package types resolve through `dist`, not `src`. A worktree with a stale
or missing `packages/*/dist` type-checks the tests against whatever was built
last, so the suite reports the _previous_ version of the API.

The symptom is specific and misleading:

```
TypeCheckError: Unused '@ts-expect-error' directive.
 ❯ src/Button/Button.test-d.tsx:28:7
```

That reads like the assertion is wrong. It means the props type is currently
accepting `notARealProp` — the catch-all is back — because `@telegraph/helpers`
resolved to a build that predates the guard. Deleting the directive to make it
pass reintroduces the regression the test exists to catch.

Rebuild before believing any type-test result:

```bash
yarn build:packages
```

Never edit a type test to resolve a failure you have not seen against a fresh
build.

## Traps

**Assert the exported name.** Consumers import `ButtonRootProps`, not the
internal `RootProps`. Testing the internal alias can pass while the exported
type is broken by a re-export that reshapes it.

**Pin `as` when the component is polymorphic.** `expectTypeOf<FooProps>()` with
no argument resolves the generic to its default. That is a real case worth
testing, but it is not the same as `FooProps<"a">`, and a bug that only appears
under an explicit `as` will not show up. Cover both.

**Put the `@ts-expect-error` on the prop, not the element.** A directive above
`<Foo` suppresses every error in the whole JSX expression, so one genuine
failure masks the rest and the test still passes. One directive, one prop,
directly above the line:

```tsx
<Foo
  // @ts-expect-error unknown prop
  notARealProp="x"
/>
```

**Do not assert on a prop you did not exercise.** In a `.test.tsx` regression
test, a fixture that never passes the prop passes with and without the fix. A
`fontWeight` test caught nothing until the fixture actually set
`fontWeight="bold"`.

## Proving a test is load-bearing

Revert **only** the source file and confirm the test fails.

```bash
git diff HEAD -- packages/foo/src/Foo/Foo.tsx > /tmp/fix.patch
git checkout HEAD -- packages/foo/src/Foo/Foo.tsx
yarn vitest run --config=./vitest/config.mts --project=foo   # must fail
git apply /tmp/fix.patch
```

The project name is the bare package name from that package's
`vitest.config.mts` (`foo`), not the workspace name (`@telegraph/foo`).

`git stash` reverts the test with the source, so the suite passes and tells you
nothing. Two tests on the original prop-validation stack passed against the
unfixed code until this step caught them.
