import type { TgphComponentProps, TgphElement } from "@telegraph/helpers";
import { Text } from "@telegraph/typography";

import { TooltipIfTruncated } from "../TooltipIfTruncated";

type TruncatedTextProps<T extends TgphElement> = {
  tooltipProps?: Partial<TgphComponentProps<typeof TooltipIfTruncated>>;
} & TgphComponentProps<typeof Text<T>>;

const TruncatedText = <T extends TgphElement>({
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
