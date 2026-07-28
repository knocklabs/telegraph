import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { type TgphElement, createTgphBaseUIRender } from "@telegraph/helpers";
import { Box, type BoxProps } from "@telegraph/layout";
import { type ComponentPropsWithoutRef, type Ref } from "react";

type BasePanelRenderProps = ComponentPropsWithoutRef<"div"> & {
  ref?: Ref<HTMLDivElement>;
};
type BasePanelState = {
  hidden: boolean;
};

export type TabPanelProps<T extends TgphElement = "div"> = BoxProps<T> & {
  value: string;
  forceMount?: boolean;
  forceBackgroundMount?: "once" | "none";
};

const TabPanel = <T extends TgphElement = "div">(
  tabPanelProps: TabPanelProps<T>,
) => {
  const {
    value,
    children,
    forceMount,
    forceBackgroundMount = "none",
    style,
    ...props
  } = tabPanelProps as TabPanelProps<"div">;
  // Radix `forceMount` and Telegraph `forceBackgroundMount="once"` both kept
  // inactive panels mounted; Base UI exposes that behavior as `keepMounted`.
  const shouldKeepMounted = forceBackgroundMount === "once" || forceMount;

  return (
    <BaseTabs.Panel
      value={value}
      keepMounted={shouldKeepMounted}
      render={createTgphBaseUIRender<BasePanelRenderProps, BasePanelState>(
        (state) => (
          <Box
            data-tgph-tab-panel=""
            data-state={state.hidden ? "inactive" : "active"}
            {...(props as Omit<
              TabPanelProps<"div">,
              | "value"
              | "children"
              | "forceMount"
              | "forceBackgroundMount"
              | "style"
            >)}
            style={{
              ...(shouldKeepMounted && {
                visibility: state.hidden ? "hidden" : "visible",
                overflow: state.hidden ? "hidden" : "visible",
                height: state.hidden ? 0 : "auto",
              }),
              ...style,
            }}
            aria-hidden={shouldKeepMounted && state.hidden ? true : undefined}
          >
            {children}
          </Box>
        ),
      )}
    />
  );
};

export { TabPanel };
