import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import {
  type TgphComponentProps,
  type TgphElement,
  createTgphBaseUIRender,
} from "@telegraph/helpers";
import { MenuItem } from "@telegraph/menu";
import { type ComponentPropsWithoutRef, type Ref } from "react";

type BaseTabRenderProps = ComponentPropsWithoutRef<"button"> & {
  ref?: Ref<HTMLElement>;
};

type BaseTabState = {
  active: boolean;
};

/**
 * Props for the Tab component
 * @property {string} value - Unique identifier for the tab
 * @property {React.ReactNode} children - Content to display in the tab
 * @property {boolean} disabled - Whether this tab is disabled
 * @property {() => void} onClick - Additional onClick handler
 * @property {TabIconProps} leadingIcon - Icon to display on the left side of the tab
 * @property {TabIconProps} trailingIcon - Icon to display on the right side of the tab
 */
export type TabProps<T extends TgphElement = "button"> = {
  value: string;
} & TgphComponentProps<typeof MenuItem<T>>;

/**
 * Tab component that uses Base UI Tabs.Tab with MenuItem styling
 */
const Tab = <T extends TgphElement = "button">({
  disabled = false,
  value,
  children,
  onClick,
  leadingIcon,
  trailingIcon,
  icon,
  ...props
}: TabProps<T>) => {
  const defaultIconProps: TgphComponentProps<
    typeof MenuItem<T>
  >["leadingIcon"] = {
    size: "6",
    color: "gray",
    variant: "secondary",
    "data-tgph-tab-icon": "",
  };

  const combinedLeadingIcon = leadingIcon
    ? ({ ...defaultIconProps, ...leadingIcon } as const)
    : icon
      ? ({ ...defaultIconProps, ...icon } as const)
      : undefined;
  const nativeButton = !props.as || props.as === "button";

  return (
    <BaseTabs.Tab
      value={value}
      disabled={disabled}
      onClick={onClick}
      nativeButton={nativeButton}
      render={createTgphBaseUIRender<BaseTabRenderProps, BaseTabState>(
        (state) => (
          <MenuItem
            leadingIcon={combinedLeadingIcon}
            trailingIcon={
              trailingIcon && { ...defaultIconProps, ...trailingIcon }
            }
            disabled={disabled}
            py="4"
            px="2"
            fontWeight="medium"
            position="relative"
            data-tgph-tab=""
            data-state={state.active ? "active" : "inactive"}
            gap="2"
            color="gray"
            size="1"
            // Important for styling the active color
            textProps={{
              "data-tgph-tab-text": "",
            }}
            {...props}
          >
            {children}
          </MenuItem>
        ),
      )}
    />
  );
};

export { Tab };
