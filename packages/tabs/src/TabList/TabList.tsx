import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { type TgphElement, createTgphBaseUIRender } from "@telegraph/helpers";
import { Stack, type StackProps } from "@telegraph/layout";
import { type ComponentProps } from "react";

type BaseTabsListProps = ComponentProps<typeof BaseTabs.List>;
export type TabListProps<T extends TgphElement = "div"> = StackProps<T> & {
  activateOnFocus?: BaseTabsListProps["activateOnFocus"];
  loop?: BaseTabsListProps["loopFocus"];
};

const TabList = <T extends TgphElement = "div">(
  tabListProps: TabListProps<T>,
) => {
  const {
    children,
    loop = true,
    activateOnFocus = true,
    ...props
  } = tabListProps as TabListProps<"div">;

  return (
    <BaseTabs.List
      activateOnFocus={activateOnFocus}
      loopFocus={loop}
      render={createTgphBaseUIRender(
        <Stack
          flexDirection={"row"}
          gap="1"
          paddingBottom={"1"}
          paddingRight={"0"}
          marginBottom="4"
          position="relative"
          data-tgph-tab-list=""
          {...(props as Omit<
            TabListProps<"div">,
            "children" | "loop" | "activateOnFocus"
          >)}
        >
          {children}
        </Stack>,
      )}
    />
  );
};

export { TabList };
