import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import {
  type TgphComponentProps,
  createTgphBaseUIRender,
} from "@telegraph/helpers";
import { Stack } from "@telegraph/layout";
import { type ComponentProps } from "react";

type BaseTabsListProps = ComponentProps<typeof BaseTabs.List>;
export type TabListProps = TgphComponentProps<typeof Stack> & {
  activateOnFocus?: BaseTabsListProps["activateOnFocus"];
  loop?: BaseTabsListProps["loopFocus"];
};

const TabList = ({
  children,
  loop = true,
  activateOnFocus = true,
  ...props
}: TabListProps) => {
  return (
    <BaseTabs.List
      activateOnFocus={activateOnFocus}
      loopFocus={loop}
      render={createTgphBaseUIRender(
        <Stack
          flexDirection={"row"}
          spacing="2"
          gap="1"
          paddingBottom={"1"}
          paddingRight={"0"}
          marginBottom="4"
          position="relative"
          data-tgph-tab-list=""
          {...props}
        >
          {children}
        </Stack>,
      )}
    />
  );
};

export { TabList };
