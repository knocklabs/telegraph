import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import {
  type TgphComponentProps,
  createTgphBaseUIRender,
} from "@telegraph/helpers";
import { Box } from "@telegraph/layout";
import { type ComponentProps } from "react";

type BaseTabsRootProps = ComponentProps<typeof BaseTabs.Root>;
type TabsValue = string;

export type TabsProps = TgphComponentProps<typeof Box> &
  Pick<BaseTabsRootProps, "orientation"> & {
    defaultValue?: TabsValue;
    value?: TabsValue;
    onValueChange?: (value: TabsValue) => void;
  };

/**
 * Root component for Tabs
 * Provides context for tab state management and renders child components
 */
const Tabs = ({
  children,
  defaultValue,
  value,
  onValueChange,
  orientation,
  ...props
}: TabsProps) => {
  const baseDefaultValue =
    defaultValue ?? (value === undefined ? null : undefined);
  const handleValueChange: BaseTabsRootProps["onValueChange"] | undefined =
    onValueChange
      ? (nextValue) => {
          if (typeof nextValue === "string") {
            onValueChange(nextValue);
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
        <Box data-tgph-tabs="" {...props}>
          {children}
        </Box>,
      )}
    />
  );
};

export { Tabs };
