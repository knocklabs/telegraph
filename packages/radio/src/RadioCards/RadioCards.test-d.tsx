import { RadioCards } from ".";
import type {
  RadioCardsItemDescriptionProps,
  RadioCardsItemIconProps,
  RadioCardsItemProps,
  RadioCardsItemTitleProps,
  RadioCardsProps,
  RadioCardsRootProps,
} from ".";
import { Bell } from "lucide-react";
import { describe, expectTypeOf, it } from "vitest";

describe("RadioCards types", () => {
  it("has no catch-all index signature", () => {
    expectTypeOf<RadioCardsProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<RadioCardsRootProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<RadioCardsItemProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<RadioCardsItemTitleProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<RadioCardsItemDescriptionProps>().not.toHaveProperty(
      "notARealProp",
    );
    expectTypeOf<RadioCardsItemIconProps>().not.toHaveProperty("notARealProp");
  });

  it("keeps declared props narrow", () => {
    expectTypeOf<RadioCardsProps["options"]>().not.toBeAny();
    expectTypeOf<RadioCardsRootProps["value"]>().not.toBeAny();
    expectTypeOf<RadioCardsRootProps["defaultValue"]>().not.toBeAny();
    expectTypeOf<RadioCardsRootProps["onValueChange"]>().not.toBeAny();
    expectTypeOf<RadioCardsRootProps["orientation"]>().not.toBeAny();
    expectTypeOf<RadioCardsRootProps["loop"]>().not.toBeAny();
    expectTypeOf<RadioCardsRootProps["dir"]>().not.toBeAny();
    expectTypeOf<RadioCardsRootProps["direction"]>().not.toBeAny();
    expectTypeOf<RadioCardsRootProps["disabled"]>().not.toBeAny();
    expectTypeOf<RadioCardsItemProps["value"]>().not.toBeAny();
    expectTypeOf<RadioCardsItemProps["tgphRef"]>().not.toBeAny();
    expectTypeOf<RadioCardsItemTitleProps["size"]>().not.toBeAny();
    expectTypeOf<RadioCardsItemDescriptionProps["color"]>().not.toBeAny();
    expectTypeOf<RadioCardsItemIconProps["icon"]>().not.toBeAny();

    expectTypeOf<RadioCardsRootProps["value"]>().toEqualTypeOf<
      string | null | undefined
    >();
    expectTypeOf<RadioCardsRootProps["onValueChange"]>().toEqualTypeOf<
      ((value: string) => void) | undefined
    >();
  });

  it("rejects unknown props", () => {
    <RadioCards
      options={[]}
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <RadioCards
      options={[]}
      // @ts-expect-error unknown prop
      fontSize={16}
    />;
    <RadioCards.Root
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <RadioCards.Item
      value="one"
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <RadioCards.ItemTitle
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <RadioCards.ItemDescription
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <RadioCards.ItemIcon
      icon={Bell}
      alt="bell"
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
  });

  it("rejects invalid values for declared props", () => {
    <RadioCards.Root
      // @ts-expect-error not a spacing token
      p={12345}
    />;
    <RadioCards.Root
      // @ts-expect-error not a flex direction
      direction="sideways"
    />;
    <RadioCards.Root
      // @ts-expect-error not an orientation
      orientation="diagonal"
    />;
    <RadioCards.Root
      // @ts-expect-error value is a string
      value={42}
    />;
    <RadioCards.Item
      // @ts-expect-error item values are strings
      value={42}
    />;
    <RadioCards.ItemTitle
      // @ts-expect-error not a text size token
      size="99"
    />;
    <RadioCards.ItemDescription
      // @ts-expect-error not a text color token
      color="notAColor"
    />;
    <RadioCards.ItemIcon
      // @ts-expect-error icon takes a LucideIcon, not its name
      icon="bell"
      alt="bell"
    />;
    <RadioCards
      // @ts-expect-error options is an array of item descriptors
      options="one"
    />;
  });

  it("accepts valid props", () => {
    <RadioCards
      aria-label="Delivery method"
      defaultValue="one"
      direction="column"
      orientation="vertical"
      onValueChange={(value) => value.toUpperCase()}
      options={[
        {
          value: "one",
          title: "Option one",
          description: "The first option",
          icon: { icon: Bell, alt: "Bell" },
        },
        { value: "two", title: "Option two", disabled: true },
      ]}
    />;

    <RadioCards.Root
      value="one"
      onValueChange={(value) => value.toUpperCase()}
      direction="row"
      gap="1"
      p="2"
      loop={false}
      dir="ltr"
      className="c"
      style={{ opacity: 0.5 }}
      data-testid="radio-cards"
    >
      <RadioCards.Item value="one">
        <RadioCards.ItemIcon icon={Bell} alt="Bell" />
        <RadioCards.ItemTitle size="2">Option one</RadioCards.ItemTitle>
        <RadioCards.ItemDescription size="0" color="gray">
          The first option
        </RadioCards.ItemDescription>
      </RadioCards.Item>
      <RadioCards.Item value="two" disabled style={{ opacity: 0.5 }}>
        <RadioCards.ItemTitle as="span">Option two</RadioCards.ItemTitle>
      </RadioCards.Item>
    </RadioCards.Root>;
  });
});
