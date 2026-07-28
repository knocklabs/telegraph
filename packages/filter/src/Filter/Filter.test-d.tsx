import { Filter } from ".";
import { Apple, Mountain } from "lucide-react";
import type { ComponentProps } from "react";
import { describe, expectTypeOf, it } from "vitest";

// The package exports only the `Filter` compound component, no prop types, so
// the contract is read back off the exported parts.
type FilterRootProps = ComponentProps<typeof Filter.Root>;
type FilterTriggerProps = ComponentProps<typeof Filter.Trigger>;
type FilterContentProps = ComponentProps<typeof Filter.Content>;
type FilterParameterProps = ComponentProps<typeof Filter.Parameter>;
type FilterMenuProps = ComponentProps<typeof Filter.Menu>;
type FilterOptionProps = ComponentProps<typeof Filter.Option>;
type FilterDividerProps = ComponentProps<typeof Filter.Divider>;
type FilterChipProps = ComponentProps<typeof Filter.Chip>;
type FilterChipLayoutProps = ComponentProps<typeof Filter.ChipLayout>;
type FilterChipDisplayProps = ComponentProps<typeof Filter.ChipDisplay>;

describe("Filter types", () => {
  it("has no catch-all index signature", () => {
    expectTypeOf<FilterRootProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<FilterTriggerProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<FilterContentProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<FilterParameterProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<FilterMenuProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<FilterOptionProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<FilterDividerProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<FilterChipProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<FilterChipLayoutProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<FilterChipDisplayProps>().not.toHaveProperty("notARealProp");
  });

  it("keeps declared props narrow", () => {
    expectTypeOf<FilterRootProps["children"]>().not.toBeAny();
    expectTypeOf<FilterContentProps["isTopSearchable"]>().not.toBeAny();
    expectTypeOf<FilterMenuProps["name"]>().not.toBeAny();
    expectTypeOf<FilterMenuProps["icon"]>().not.toBeAny();
    expectTypeOf<FilterMenuProps["isSearchable"]>().not.toBeAny();
    expectTypeOf<FilterMenuProps["hotKey"]>().not.toBeAny();
    expectTypeOf<FilterOptionProps["value"]>().not.toBeAny();
    expectTypeOf<FilterOptionProps["name"]>().not.toBeAny();
    expectTypeOf<FilterOptionProps["icon"]>().not.toBeAny();
    expectTypeOf<FilterChipProps["filterKey"]>().not.toBeAny();
    expectTypeOf<FilterChipProps["operator"]>().not.toBeAny();
    expectTypeOf<FilterChipProps["active"]>().not.toBeAny();
    expectTypeOf<FilterChipProps["isMulti"]>().not.toBeAny();
  });

  it("rejects unknown props", () => {
    <Filter.Root
      // @ts-expect-error unknown prop
      notARealProp="x"
    >
      <div />
    </Filter.Root>;
    <Filter.Trigger
      // @ts-expect-error unknown prop
      notARealProp="x"
    >
      <div />
    </Filter.Trigger>;
    <Filter.Content
      // @ts-expect-error unknown prop
      notARealProp="x"
    >
      <div />
    </Filter.Content>;
    <Filter.Parameter
      value="account"
      // @ts-expect-error unknown prop
      notARealProp="x"
    >
      <div />
    </Filter.Parameter>;
    <Filter.Menu
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Filter.Option
      value="active"
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Filter.Divider
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Filter.Chip
      filterKey="account"
      operator="is"
      active={{ value: "active" }}
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Filter.ChipLayout
      // @ts-expect-error unknown prop
      notARealProp="x"
    >
      <div />
    </Filter.ChipLayout>;
    <Filter.ChipDisplay
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Filter.Menu
      // @ts-expect-error unknown prop
      fontSize={16}
    />;
  });

  it("rejects invalid values for declared props", () => {
    <Filter.Content
      // @ts-expect-error isTopSearchable is a boolean
      isTopSearchable="yes"
    >
      <div />
    </Filter.Content>;
    <Filter.Menu
      // @ts-expect-error icon takes a LucideIcon, not its name
      icon="apple"
    />;
    <Filter.Menu
      // @ts-expect-error name is a string
      name={42}
    />;
    <Filter.Parameter
      // @ts-expect-error value is the string key of the parameter
      value={42}
    >
      <div />
    </Filter.Parameter>;
    <Filter.Option
      value="active"
      // @ts-expect-error name is a string
      name={42}
    />;
    <Filter.Chip
      filterKey="account"
      // @ts-expect-error not a filter operator
      operator="is_kind_of"
      active={{ value: "active" }}
    />;
  });

  it("accepts valid props", () => {
    <Filter.Root>
      <Filter.ChipDisplay />
      <Filter.Trigger>
        <button type="button">Filter</button>
      </Filter.Trigger>
      <Filter.Content isTopSearchable>
        <Filter.Parameter name="Account" value="account" icon={Apple}>
          <Filter.Menu name="Account" icon={Apple} isSearchable hotKey="a">
            <Filter.Option name="Active" value="active" icon={Mountain} />
            <Filter.Option value={true} />
            <Filter.Option value={42} />
          </Filter.Menu>
        </Filter.Parameter>
        <Filter.Divider />
        <Filter.Parameter
          name="Snacks"
          value="snacks"
          icon={Mountain}
          isMulti
          pluralNoun="snacks"
        >
          <Filter.Menu name="Snacks">
            <Filter.Option name="Chocolate" value="chocolate" />
          </Filter.Menu>
        </Filter.Parameter>
      </Filter.Content>
    </Filter.Root>;

    <Filter.ChipLayout>
      <Filter.Chip
        filterKey="snacks"
        filterName="Snacks"
        operator="is_any_of"
        icon={Mountain}
        isMulti
        pluralNoun="snacks"
        active={[{ value: "chocolate", name: "Chocolate" }]}
      />
    </Filter.ChipLayout>;
  });
});
