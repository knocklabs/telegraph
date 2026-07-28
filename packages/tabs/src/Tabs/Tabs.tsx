import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { type TgphElement, createTgphBaseUIRender } from "@telegraph/helpers";
import { Stack, type StackProps } from "@telegraph/layout";
import { type ComponentProps } from "react";

type BaseTabsRootProps = ComponentProps<typeof BaseTabs.Root>;
type TabsValue = string;
type TabsValueChangeHandler<Value extends TabsValue> = {
  bivarianceHack(value: Value): void;
}["bivarianceHack"];

// `StackProps<T>` rather than `TgphComponentProps<typeof Stack>`: extracting
// props from a generic component instantiates its parameter at the constraint,
// which erases the passthrough. Threading `T` keeps Stack's props intact, so a
// second (defaulted) parameter carries the element type alongside `Value`.
export type TabsProps<
  Value extends TabsValue = string,
  T extends TgphElement = "div",
> = StackProps<T> & {
  defaultValue?: Value;
  orientation?: BaseTabsRootProps["orientation"];
  value?: Value;
  onValueChange?: TabsValueChangeHandler<Value>;
};

const Tabs = <Value extends TabsValue = string, T extends TgphElement = "div">(
  tabsProps: TabsProps<Value, T>,
) => {
  // Read through the default element: while `T` is unresolved the element
  // passthrough is a deferred conditional, so every prop would otherwise be an
  // unresolved indexed access intersected with its declared type.
  const {
    children,
    defaultValue,
    value,
    onValueChange,
    orientation,
    ...props
  } = tabsProps as TabsProps<Value, "div">;
  // Base UI uses `null` for "no tab selected"; keep defaultValue undefined
  // when controlled so React does not see both controlled and default values.
  const baseDefaultValue =
    defaultValue ?? (value === undefined ? null : undefined);
  const handleValueChange: BaseTabsRootProps["onValueChange"] | undefined =
    onValueChange
      ? (nextValue) => {
          // Base UI can report `null` when it cannot resolve an active tab.
          // Radix-backed Telegraph tabs only notified consumers with string
          // tab values, so keep that Base UI state internal for compatibility.
          if (typeof nextValue === "string") {
            onValueChange(nextValue as Value);
          }
        }
      : undefined;

  return (
    <BaseTabs.Root
      defaultValue={baseDefaultValue}
      value={value}
      onValueChange={handleValueChange}
      orientation={orientation}
      render={createTgphBaseUIRender(
        // Stack the tab list above the panel by default; `direction` is
        // overridable for side-by-side tab layouts.
        <Stack
          direction="column"
          data-tgph-tabs=""
          {...(props as Omit<
            TabsProps<Value, "div">,
            | "children"
            | "defaultValue"
            | "value"
            | "onValueChange"
            | "orientation"
          >)}
        >
          {children}
        </Stack>,
      )}
    />
  );
};

export { Tabs };
