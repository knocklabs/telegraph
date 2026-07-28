/**
 * Type-level regression guards, run by `vitest --typecheck` (enabled for this
 * package in `vitest.config.mts`).
 *
 * The guard that matters here is KNO-14309 / PR #895: wrapping a Base UI
 * primitive whose callbacks take a second `eventDetails` argument can collapse
 * sibling callback params to `any` at the JSX call site, depending on how
 * `Omit` interacts with the polymorphic generic. An `any` param satisfies every
 * ordinary assignment, so nothing but an explicit type assertion catches it.
 */
import { describe, expectTypeOf, it } from "vitest";

import type { CheckboxGroupProps } from "../CheckboxGroup";

import type { CheckboxProps } from "./index";

describe("Checkbox types", () => {
  it("exposes value as a boolean", () => {
    expectTypeOf<CheckboxProps["value"]>().toEqualTypeOf<boolean | undefined>();
  });

  it("exposes formValue as the string form payload", () => {
    expectTypeOf<CheckboxProps["formValue"]>().toEqualTypeOf<
      string | undefined
    >();
  });

  it("takes a boolean in onValueChange, never any", () => {
    expectTypeOf<NonNullable<CheckboxProps["onValueChange"]>>()
      .parameter(0)
      .toEqualTypeOf<boolean>();
  });

  it("keeps onValueChange single-argument", () => {
    expectTypeOf<
      Parameters<NonNullable<CheckboxProps["onValueChange"]>>
    >().toEqualTypeOf<[boolean]>();
  });
});

describe("CheckboxGroup types", () => {
  it("exposes value as a string array", () => {
    expectTypeOf<CheckboxGroupProps["value"]>().toEqualTypeOf<
      string[] | undefined
    >();
  });

  it("takes a string array in onValueChange, never any", () => {
    expectTypeOf<NonNullable<CheckboxGroupProps["onValueChange"]>>()
      .parameter(0)
      .toEqualTypeOf<string[]>();
  });

  it("keeps onValueChange single-argument", () => {
    expectTypeOf<
      Parameters<NonNullable<CheckboxGroupProps["onValueChange"]>>
    >().toEqualTypeOf<[string[]]>();
  });
});
