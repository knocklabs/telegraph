import type { OverrideAppearance } from "@telegraph/appearance";
import type { Required, TgphComponentProps } from "@telegraph/helpers";
import type { Stack } from "@telegraph/layout";

type Appearance = Required<
  TgphComponentProps<typeof OverrideAppearance>
>["appearance"];

// Set any appearance specifics props for the content.
// For example, a light appearance tooltip should stand out
// from the background of the page.
export const TooltipContentProps: Record<
  Appearance,
  TgphComponentProps<typeof Stack>
> = {
  light: {
    border: "px",
    shadow: "2",
  },

  dark: {},
};
