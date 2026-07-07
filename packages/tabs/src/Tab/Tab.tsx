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

export type TabProps<T extends TgphElement = "button"> = {
  value: string;
} & TgphComponentProps<typeof MenuItem<T>>;

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
  const combinedTrailingIcon = trailingIcon
    ? ({ ...defaultIconProps, ...trailingIcon } as const)
    : undefined;
  const menuItemProps = props as TgphComponentProps<typeof MenuItem<T>>;
  // Base UI renders a native button by default; only opt out when Telegraph's
  // polymorphic `as` prop means MenuItem owns the element type.
  const nativeButton = !props.as || props.as === "button";

  return (
    <BaseTabs.Tab
      value={value}
      disabled={disabled}
      onClick={onClick}
      nativeButton={nativeButton}
      render={createTgphBaseUIRender<BaseTabRenderProps, BaseTabState>(
        (state) => (
          <MenuItem<T>
            leadingIcon={combinedLeadingIcon}
            trailingIcon={combinedTrailingIcon}
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
            {...menuItemProps}
          >
            {children}
          </MenuItem>
        ),
      )}
    />
  );
};

export { Tab };
