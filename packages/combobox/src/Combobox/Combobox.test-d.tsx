import { Combobox } from ".";
import type {
  ComboboxContentProps,
  ComboboxCreateProps,
  ComboboxEmptyProps,
  ComboboxOptionProps,
  ComboboxOptionsProps,
  ComboboxRootProps,
  ComboboxSearchProps,
  ComboboxTriggerProps,
} from ".";
import { describe, expectTypeOf, it } from "vitest";

describe("Combobox types", () => {
  it("has no catch-all index signature", () => {
    expectTypeOf<ComboboxRootProps<string, false>>().not.toHaveProperty(
      "notARealProp",
    );
    expectTypeOf<ComboboxTriggerProps<string>>().not.toHaveProperty(
      "notARealProp",
    );
    expectTypeOf<ComboboxContentProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<ComboboxOptionsProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<ComboboxOptionProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<ComboboxSearchProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<ComboboxEmptyProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<ComboboxCreateProps>().not.toHaveProperty("notARealProp");
  });

  it("keeps declared props narrow", () => {
    expectTypeOf<ComboboxRootProps<string, false>["value"]>().not.toBeAny();
    expectTypeOf<
      ComboboxRootProps<string, false>["onValueChange"]
    >().not.toBeAny();
    expectTypeOf<
      ComboboxRootProps<string, false>["placeholder"]
    >().not.toBeAny();
    expectTypeOf<ComboboxRootProps<string, false>["clearable"]>().not.toBeAny();
    expectTypeOf<ComboboxRootProps<string, false>["disabled"]>().not.toBeAny();
    expectTypeOf<
      ComboboxRootProps<string, false>["closeOnSelect"]
    >().not.toBeAny();
    expectTypeOf<ComboboxRootProps<string, false>["errored"]>().not.toBeAny();
    expectTypeOf<ComboboxRootProps<string, false>["modal"]>().not.toBeAny();
    expectTypeOf<
      ComboboxRootProps<string, false>["legacyBehavior"]
    >().not.toBeAny();
    expectTypeOf<
      ComboboxRootProps<string, false>["defaultScrollToValue"]
    >().not.toBeAny();
    expectTypeOf<
      ComboboxRootProps<Array<string>, false>["layout"]
    >().not.toBeAny();

    expectTypeOf<ComboboxTriggerProps<string>["placeholder"]>().not.toBeAny();

    expectTypeOf<ComboboxOptionProps["value"]>().not.toBeAny();
    expectTypeOf<ComboboxOptionProps["label"]>().not.toBeAny();
    expectTypeOf<ComboboxOptionProps["selected"]>().not.toBeAny();
    // Guard the callback PARAM, not just the function: closed-polymorphic typing
    // must keep it from widening to `any` (the KNO-14309 failure mode).
    expectTypeOf<
      Parameters<NonNullable<ComboboxOptionProps["onSelect"]>>[0]
    >().toEqualTypeOf<Event>();

    expectTypeOf<ComboboxSearchProps["label"]>().not.toBeAny();

    expectTypeOf<ComboboxEmptyProps["icon"]>().not.toBeAny();
    expectTypeOf<ComboboxEmptyProps["message"]>().not.toBeAny();

    expectTypeOf<ComboboxCreateProps["leadingText"]>().not.toBeAny();
    expectTypeOf<ComboboxCreateProps["values"]>().not.toBeAny();
    expectTypeOf<ComboboxCreateProps["onCreate"]>().not.toBeAny();
    expectTypeOf<
      Parameters<NonNullable<ComboboxCreateProps["onCreate"]>>[0]
    >().toEqualTypeOf<string>();
  });

  it("rejects unknown props", () => {
    <Combobox.Root
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Combobox.Root
      // @ts-expect-error unknown prop
      fontSize={16}
    />;
    <Combobox.Trigger
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Combobox.Trigger
      // @ts-expect-error unknown prop
      fontSize={16}
    />;
    <Combobox.Content
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Combobox.Content
      // @ts-expect-error unknown prop
      fontSize={16}
    />;
    <Combobox.Options
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Combobox.Options
      // @ts-expect-error unknown prop
      fontSize={16}
    />;
    <Combobox.Option
      value="a"
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Combobox.Option
      value="a"
      // @ts-expect-error unknown prop
      fontSize={16}
    />;
    <Combobox.Search
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Combobox.Search
      // @ts-expect-error unknown prop
      fontSize={16}
    />;
    <Combobox.Empty
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Combobox.Empty
      // @ts-expect-error unknown prop
      fontSize={16}
    />;
    <Combobox.Create
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Combobox.Create
      // @ts-expect-error unknown prop
      fontSize={16}
    />;
  });

  it("rejects unknown props on trigger primitives", () => {
    <Combobox.Primitives.TriggerIndicator
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Combobox.Primitives.TriggerClear
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Combobox.Primitives.TriggerText
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Combobox.Primitives.TriggerPlaceholder
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Combobox.Primitives.TriggerTagsContainer
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Combobox.Primitives.TriggerActionsContainer
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Combobox.Primitives.TriggerValue
      // @ts-expect-error TriggerValue takes no props
      notARealProp="x"
    />;
    <Combobox.Primitives.TriggerTag.Root
      value="a"
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Combobox.Primitives.TriggerTag.Text
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Combobox.Primitives.TriggerTag.Button
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Combobox.Primitives.TriggerTag.Default
      value="a"
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
  });

  it("rejects `as` on animated trigger primitives", () => {
    // KNO-14501.
    <Combobox.Primitives.TriggerIndicator
      // @ts-expect-error as is not a TriggerIndicator prop
      as="section"
    />;
    // The body discards `alt`, so the type must not promise it.
    <Combobox.Primitives.TriggerIndicator
      // @ts-expect-error alt is not a TriggerIndicator prop
      alt="Open"
    />;
    <Combobox.Primitives.TriggerTag.Root
      value="a"
      // @ts-expect-error as is not a TriggerTag.Root prop
      as="section"
    />;
  });

  it("rejects invalid values for declared props", () => {
    <Combobox.Root
      // @ts-expect-error modal is a boolean
      modal="yes"
    />;
    <Combobox.Root
      // @ts-expect-error disabled is a boolean
      disabled="yes"
    />;
    <Combobox.Root
      value="a"
      // @ts-expect-error placeholder is a string
      placeholder={42}
    />;
    <Combobox.Root
      value={["a"]}
      // @ts-expect-error not a layout value
      layout="sideways"
    />;
    <Combobox.Root
      value="a"
      // @ts-expect-error layout only applies to multi-select values
      layout="wrap"
    />;
    <Combobox.Trigger
      // @ts-expect-error placeholder is a string
      placeholder={42}
    />;
    <Combobox.Trigger
      // @ts-expect-error disabled is a boolean
      disabled="yes"
    />;
    <Combobox.Content
      // @ts-expect-error not a spacing token
      p={12345}
    />;
    <Combobox.Content
      // @ts-expect-error not a popover side
      side="sideways"
    />;
    <Combobox.Options
      // @ts-expect-error not a spacing token
      p={12345}
    />;
    <Combobox.Options
      // @ts-expect-error not a flex direction
      direction="sideways"
    />;
    <Combobox.Option
      value="a"
      // @ts-expect-error not a spacing token
      p={12345}
    />;
    <Combobox.Option
      // @ts-expect-error option values are strings
      value={42}
    />;
    <Combobox.Option
      value="a"
      // @ts-expect-error selected is boolean | null
      selected="yes"
    />;
    // @ts-expect-error value is required on an option
    <Combobox.Option />;
    <Combobox.Search
      // @ts-expect-error label is a string
      label={42}
    />;
    <Combobox.Empty
      // @ts-expect-error not a spacing token
      p={12345}
    />;
    <Combobox.Empty
      // @ts-expect-error message is string | null
      message={42}
    />;
    <Combobox.Empty
      // @ts-expect-error icon is Icon props | null
      icon="notAnIcon"
    />;
    <Combobox.Create
      // @ts-expect-error not a spacing token
      p={12345}
    />;
    <Combobox.Create
      // @ts-expect-error leadingText is a string
      leadingText={42}
    />;
    <Combobox.Create
      // @ts-expect-error create values are strings
      values={[1]}
    />;
  });

  it("accepts valid props", () => {
    <Combobox.Root
      value="a"
      defaultValue="b"
      onValueChange={(value) => value.toUpperCase()}
      open
      defaultOpen={false}
      onOpenChange={() => {}}
      errored
      placeholder="Pick one"
      modal
      closeOnSelect
      clearable
      disabled
      legacyBehavior={false}
      defaultScrollToValue="a"
    >
      <Combobox.Trigger placeholder="Pick one" disabled id="trigger" />
      <Combobox.Content p="2" className="c" style={{ opacity: 1 }}>
        <Combobox.Search
          label="Search"
          placeholder="Search"
          variant="ghost"
          size="2"
          value=""
          onValueChange={() => {}}
          className="c"
          style={{ opacity: 1 }}
          id="search"
        />
        <Combobox.Options direction="column" gap="1" p="2" maxHeight="64">
          <Combobox.Option value="a" label="A" selected p="2" />
          <Combobox.Option value="b" selected={null} onSelect={() => {}} />
          <Combobox.Option value="c" as="button" aria-label="c" />
        </Combobox.Options>
        <Combobox.Empty message="No results" icon={null} p="2" />
        <Combobox.Create
          leadingText="Create"
          values={["a"]}
          onCreate={(value) => value.toUpperCase()}
        />
      </Combobox.Content>
    </Combobox.Root>;

    <Combobox.Root value={["a"]} layout="wrap" />;

    <Combobox.Trigger size="1" variant="outline" p="2" />;
    <Combobox.Trigger className="c" style={{ opacity: 1 }} color="gray" />;
    <Combobox.Trigger aria-label="trigger" data-testid="trigger" />;
    <Combobox.Trigger>
      {({ value }) => <span>{String(value)}</span>}
    </Combobox.Trigger>;
    <Combobox.Content data-testid="content" aria-label="content" as="div" />;
    <Combobox.Options className="c" as="div" aria-label="options" id="opts" />;
    <Combobox.Option
      value="a"
      className="c"
      data-testid="option"
      id="option"
    />;
    <Combobox.Search aria-label="search" data-testid="search" />;
    <Combobox.Empty
      message={null}
      className="c"
      as="div"
      data-testid="empty"
    />;
    <Combobox.Create className="c" p="2" aria-label="create" />;

    <Combobox.Primitives.TriggerIndicator />;
    <Combobox.Primitives.TriggerClear />;
    <Combobox.Primitives.TriggerText />;
    <Combobox.Primitives.TriggerPlaceholder />;
    <Combobox.Primitives.TriggerTagsContainer />;
    <Combobox.Primitives.TriggerActionsContainer />;
    <Combobox.Primitives.TriggerValue />;
    <Combobox.Primitives.TriggerTag.Root value="a" />;
    <Combobox.Primitives.TriggerTag.Text />;
    <Combobox.Primitives.TriggerTag.Button />;
    <Combobox.Primitives.TriggerTag.Default value="a" />;
  });

  it("resolves Create at its default element", () => {
    // Create renders as an option row, so with no `as` it takes `div` native
    // attributes (`id`) and an explicit `as="a"` switches to anchor attributes.
    // `type` can't discriminate the default here — Create accepts Button.Root
    // props (incl. `type`) through its option-row base regardless of element.
    <Combobox.Create id="create-row" />;
    <Combobox.Create as="a" href="/new" />;
  });
});
