import { DataList } from ".";
import type {
  DataListItemProps,
  DataListLabelProps,
  DataListListItemProps,
  DataListListProps,
  DataListValueProps,
} from ".";
import { Bell } from "lucide-react";
import { describe, expectTypeOf, it } from "vitest";

describe("DataList types", () => {
  it("has no catch-all index signature", () => {
    expectTypeOf<DataListListProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<DataListListItemProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<DataListLabelProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<DataListValueProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<DataListItemProps>().not.toHaveProperty("notARealProp");
  });

  it("keeps declared props narrow", () => {
    expectTypeOf<DataListListProps["direction"]>().not.toBeAny();
    expectTypeOf<DataListListProps["gap"]>().not.toBeAny();
    expectTypeOf<DataListListItemProps["align"]>().not.toBeAny();
    expectTypeOf<DataListValueProps["minW"]>().not.toBeAny();
    expectTypeOf<DataListLabelProps["icon"]>().not.toBeAny();
    expectTypeOf<DataListLabelProps["textProps"]>().not.toBeAny();
    expectTypeOf<DataListLabelProps["description"]>().not.toBeAny();
    expectTypeOf<DataListLabelProps["tooltipProps"]>().not.toBeAny();
    expectTypeOf<DataListItemProps["label"]>().not.toBeAny();
    expectTypeOf<DataListItemProps["labelProps"]>().not.toBeAny();
    expectTypeOf<DataListItemProps["valueProps"]>().not.toBeAny();
  });

  it("rejects unknown props", () => {
    <DataList.List
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <DataList.List
      // @ts-expect-error unknown prop
      fontSize={16}
    />;
    <DataList.ListItem
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <DataList.Label
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <DataList.Value
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <DataList.Item
      label="Name"
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
  });

  it("rejects invalid values for declared props", () => {
    <DataList.List
      // @ts-expect-error not a spacing token
      p={12345}
    />;
    <DataList.List
      // @ts-expect-error not a flex direction
      direction="sideways"
    />;
    <DataList.ListItem
      // @ts-expect-error not an alignment
      align="notAnAlignment"
    />;
    <DataList.Value
      // @ts-expect-error not a spacing token
      minW="notASpacingToken"
    />;
    <DataList.Label
      // @ts-expect-error textProps only takes Text props
      textProps={{ as: "span", notARealProp: "x" }}
    />;
    <DataList.Item
      // @ts-expect-error a symbol is not renderable content
      label={Symbol("nope")}
    />;
    <DataList.Item
      label="Name"
      // @ts-expect-error icon requires a LucideIcon under `icon`
      icon={{ icon: "bell", alt: "bell" }}
    />;
  });

  it("accepts valid props", () => {
    <DataList.List gap="4" p="2" maxW="160" direction="column" />;
    <DataList.List as="section" className="c" style={{ opacity: 0.5 }} />;
    <DataList.ListItem direction="row" align="baseline" gap="1" mt="4" />;
    <DataList.Value w="full" minW="0" data-testid="value" />;
    <DataList.Label
      icon={{ icon: Bell, "aria-hidden": true }}
      description="More detail"
      textProps={{ as: "span", size: "1", color: "gray", weight: "medium" }}
      tooltipProps={{ side: "top" }}
      maxW="36"
      aria-label="label"
    >
      Name
    </DataList.Label>;
    <DataList.Item
      label="Name"
      description="Full legal name"
      icon={{ icon: Bell, alt: "bell" }}
      labelProps={{ maxW: "36" }}
      valueProps={{ w: "full" }}
      direction="row"
    >
      Ada Lovelace
    </DataList.Item>;
  });
});
