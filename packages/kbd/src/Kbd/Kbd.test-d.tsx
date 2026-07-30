import { Kbd, KbdProvider } from ".";
import type { KbdProps } from ".";
import { describe, expectTypeOf, it } from "vitest";

describe("Kbd types", () => {
  it("has no catch-all index signature", () => {
    expectTypeOf<KbdProps>().not.toHaveProperty("notARealProp");
  });

  it("keeps declared props narrow", () => {
    expectTypeOf<KbdProps["size"]>().not.toBeAny();
    expectTypeOf<KbdProps["contrast"]>().not.toBeAny();
    expectTypeOf<KbdProps["label"]>().not.toBeAny();
    expectTypeOf<KbdProps["eventKey"]>().not.toBeAny();
    expectTypeOf<KbdProps["label"]>().toEqualTypeOf<string>();
  });

  it("rejects unknown props", () => {
    <Kbd
      label="K"
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Kbd
      label="K"
      // @ts-expect-error unknown prop
      fontSize={16}
    />;
    <KbdProvider
      // @ts-expect-error unknown prop
      notARealProp="x"
    >
      <Kbd label="K" />
    </KbdProvider>;
  });

  it("rejects invalid values for declared props", () => {
    <Kbd
      label="K"
      // @ts-expect-error not a spacing token
      p={12345}
    />;
    <Kbd
      label="K"
      // @ts-expect-error not a kbd size
      size="99"
    />;
    <Kbd
      // @ts-expect-error label must be a string
      label={12}
    />;
    <Kbd
      label="K"
      // @ts-expect-error contrast is a boolean
      contrast="yes"
    />;
    <Kbd
      label="K"
      // @ts-expect-error not a stack direction
      direction="sideways"
    />;
  });

  it("accepts valid props", () => {
    <Kbd label="K" size="1" contrast eventKey="k" />;
    <Kbd label="Meta" size="3" p="2" mt="4" gap="1" />;
    <Kbd label="Shift" as="div" aria-label="shift" data-testid="shift" />;
    <Kbd label="Enter" className="c" style={{ opacity: 0.5 }} />;
    <KbdProvider>
      <Kbd label="K" />
    </KbdProvider>;
  });
});
