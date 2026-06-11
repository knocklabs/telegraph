import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import {
  type TgphComponentProps,
  createTgphBaseUIRender,
} from "@telegraph/helpers";
import { Box } from "@telegraph/layout";
import {
  type CSSProperties,
  type ComponentPropsWithoutRef,
  type Ref,
} from "react";

type BasePanelRenderProps = ComponentPropsWithoutRef<"div"> & {
  ref?: Ref<HTMLDivElement>;
};
type BasePanelState = {
  hidden: boolean;
};

export type TabPanelProps = TgphComponentProps<typeof Box> & {
  value: string;
  forceMount?: boolean;
  forceBackgroundMount?: "once" | "none";
};

/**
 * Content panel associated with a Tab
 * Only renders when its associated tab is active
 */
const TabPanel = ({
  value,
  children,
  forceMount,
  forceBackgroundMount = "none",
  ...props
}: TabPanelProps) => {
  const shouldKeepMounted = forceBackgroundMount === "once" || forceMount;

  const getPanelStyle = (state: BasePanelState): CSSProperties | undefined => {
    if (!shouldKeepMounted) {
      return props.style;
    }

    return {
      visibility: state.hidden ? "hidden" : "visible",
      overflow: state.hidden ? "hidden" : "visible",
      height: state.hidden ? 0 : "auto",
      ...props.style,
    };
  };

  return (
    <BaseTabs.Panel
      value={value}
      keepMounted={shouldKeepMounted}
      render={createTgphBaseUIRender<BasePanelRenderProps, BasePanelState>(
        (state) => (
          <Box
            data-tgph-tab-panel=""
            data-state={state.hidden ? "inactive" : "active"}
            {...props}
            style={getPanelStyle(state)}
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
