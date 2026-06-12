import type { OverrideAppearance } from "@telegraph/appearance";
import type { Required, TgphComponentProps } from "@telegraph/helpers";
import type { Stack } from "@telegraph/layout";

export type Appearance = Required<
  TgphComponentProps<typeof OverrideAppearance>
>["appearance"];

export const TooltipContentProps: Record<
  Appearance,
  TgphComponentProps<typeof Stack>
> = {
  light: {
    shadow: "2",
  },

  dark: {},
};
