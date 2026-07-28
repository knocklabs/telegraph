import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { type TgphElement, createTgphBaseUIRender } from "@telegraph/helpers";
import { Stack, type StackProps } from "@telegraph/layout";
import { type ComponentProps } from "react";

type BaseTabsRootProps = ComponentProps<typeof BaseTabs.Root>;
type TabsValue = string;
type TabsValueChangeHandler<Value extends TabsValue> = {
  bivarianceHack(value: Value): void;
}["bivarianceHack"];

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
