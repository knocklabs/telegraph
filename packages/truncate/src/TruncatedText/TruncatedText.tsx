import type { TgphComponentProps, TgphElement } from "@telegraph/helpers";
import { Text } from "@telegraph/typography";

import { TooltipIfTruncated } from "../TooltipIfTruncated";

export type TruncatedTextProps<T extends TgphElement = "span"> = {
  tooltipProps?: Partial<TgphComponentProps<typeof TooltipIfTruncated>>;
} & TgphComponentProps<typeof Text<T>>;

const TruncatedText = <T extends TgphElement = "span">({
  tooltipProps,
  style,
  ...props
}: TruncatedTextProps<T>) => {
  return (
    <TooltipIfTruncated {...tooltipProps}>
      <Text
        textOverflow="ellipsis"
        overflow="hidden"
        style={{
          display: "block",
          whiteSpace: "nowrap",
          ...style,
        }}
        {...props}
      />
    </TooltipIfTruncated>
  );
};

export { TruncatedText };
