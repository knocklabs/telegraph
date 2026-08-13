---
name: code-review
description: Review a Telegraph change before it ships. Use when reviewing a diff, a PR, or your own work in this repo, and whenever a change touches a component's props type, destructures props, adds an `as` prop, or wraps a Base UI component.
---

# Reviewing a Telegraph change

Telegraph is a component library. Every prop type in `packages/*/src` is a
public API that a consuming app type-checks against. A prop type that is wrong
does not fail here. It fails in the consumer, one release later, in a codebase
nobody in this repo can see.

That is the whole reason this skill exists. Most review checklists look for
bugs that break the build. The failures below all compile.

## The failure shape

Three prop-validation releases (#922, #924, #925, #928, #931) fixed one family
of defect. In every case the type and the component disagreed, and nothing
reported it:

| The type says            | The component does           | What the consumer sees                           |
| ------------------------ | ---------------------------- | ------------------------------------------------ |
| any prop is accepted     | ignores the typo             | `<Text fontSize={16} />` compiles, does nothing  |
| `as` is accepted         | renders a fixed element      | `as={motion.div}` compiles, animation never runs |
| `as` accepts any element | `as` collapsed to `"button"` | `as={NextLink}` is not assignable                |
| this prop exists         | never reads it               | prop is accepted and silently dropped            |
| this prop exists         | never destructures it        | prop reaches the DOM as an attribute             |

None of these produce a type error, a lint warning, or a failing test on their
own. Reviewing by reading is not enough: six review passes over that stack
missed three of these, and a mechanical sweep found them in seconds.

**So do both.** Read for intent, then run the sweeps. When the two disagree,
the sweep is right.

## Rules

Read the rule file that matches what the diff touches. Read all three if the
diff adds a component.

| The diff...                                                             | Read                         |
| ----------------------------------------------------------------------- | ---------------------------- |
| changes a props type, adds a generic, adds or omits `as`                | `rules/polymorphic-types.md` |
| destructures props, adds a prop, spreads onto an element, wraps Base UI | `rules/prop-plumbing.md`     |
| adds or changes any public prop                                         | `rules/type-tests.md`        |

## Procedure

1. **Sweep first, then read.** Run the check below before forming an opinion.
   It takes a second and it is not fooled by a plausible-looking diff.

   ```bash
   node .agents/skills/code-review/scripts/check-prop-plumbing.cjs
   ```

   Sweep A and C need your verdict. Sweep B is always a defect. Compare the
   output against `main` rather than reading it cold: a finding that predates
   the diff is not this PR's problem, and a finding that appears in it is.

2. **Build before you trust a type result.** Cross-package types resolve
   through `dist`. A stale build makes the type-test suite report the previous
   release's API, and the failure it produces looks like a bad assertion rather
   than a regression. Run `yarn build:packages` first. `rules/type-tests.md`
   has the symptom to recognize.

3. **Diff the type errors as a set, never as a count.** `tsc` output moves
   around. A count that stays flat can hide one error disappearing and another
   appearing. Sort the `file:line:code` lines and `comm` the two lists. A count
   hid a relocated error twice on the work this skill came from.

4. **Guard against a false zero.** Any check that counts matches in command
   output reads a crashed run as "0 problems". Check the exit code too, and
   confirm the run found the files it claims to have checked.

5. **Prove every new test is load-bearing.** Revert _only_ the source file, not
   the test, and confirm the test fails. `git stash` reverts both and the test
   passes for the wrong reason. Two tests on the original stack passed against
   the unfixed code before this step caught them.

6. **Check the consumer.** A prop type change that looks harmless here can
   add hundreds of errors in `control`. Build the packages, point `control` at
   the build, and compare error sets before and after. Do not report a delta
   you did not measure against a real baseline on both sides.

## What is already enforced, and what is not

Know which failures the toolchain catches so you spend review attention on the
ones it does not.

**Caught automatically:**

- Type errors inside `*.test-d.tsx`, via `yarn test` (vitest `typecheck`).
- An unused `@ts-expect-error`. If the code stops being an error, the directive
  itself errors, so an assertion cannot silently stop asserting.

**Not caught, and the reason:**

- **A prop destructured out of props and never used.** `@typescript-eslint/no-unused-vars`
  runs with `ignoreRestSiblings: true` (`@knocklabs/eslint-config/library.js`),
  which exempts exactly this pattern, and the shared config loads `only-warn`,
  so nothing in lint fails the build anyway. Sweep B exists for this.
- **A prop declared and never destructured.** No rule models "this must not
  reach the DOM." Sweep C exists for this.
- **A catch-all index signature on a props type.** It makes every prop valid,
  so no test fails. The `not.toHaveProperty("notARealProp")` assertion in each
  package's `*.test-d.tsx` exists for this.
- **Implementation type errors.** `vitest/config.mts` sets
  `ignoreSourceErrors: true`, so the typecheck run reports only errors raised
  inside the type tests. A broken component compiles as far as that suite is
  concerned.
- **Anything in a `*.test.tsx`.** Typecheck covers `**/*.test-d.{ts,tsx}` only
  (`vitest/config.mts:26`). A `@ts-expect-error` in a `.test.tsx` asserts
  nothing at all, because vitest strips the types with esbuild.
- **A stale `dist`.** Nothing warns that the type tests just checked the last
  release instead of the working tree.

## Writing the review

State the failure as a consumer would hit it, not as a description of the code.
"`<Combobox.Empty>text</Combobox.Empty>` compiles and renders nothing" is
reviewable. "`children` is unused" is not: it reads like a lint nit, and it got
waved through on exactly that basis before.
