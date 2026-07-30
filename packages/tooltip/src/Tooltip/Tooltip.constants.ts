import type { OverrideAppearance } from "@telegraph/appearance";
import type { Required, TgphComponentProps } from "@telegraph/helpers";
import type { StackProps } from "@telegraph/layout";

export type Appearance = Required<
  TgphComponentProps<typeof OverrideAppearance>
>["appearance"];

export const TooltipContentProps: Record<Appearance, StackProps> = {
  light: {
    shadow: "2",
  },

  dark: {},
};
