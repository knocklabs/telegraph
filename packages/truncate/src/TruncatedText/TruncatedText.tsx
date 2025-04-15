import { TgphComponentProps } from "@telegraph/helpers";
import { Text } from "@telegraph/typography";

import { TooltipIfTruncated } from "../TooltipIfTruncated";

type TruncatedTextProps = {
  tooltipProps?: Partial<TgphComponentProps<typeof TooltipIfTruncated>>;
} & TgphComponentProps<typeof Text>;

const TruncatedText = ({
  tooltipProps,
  style,
  ...props
}: TruncatedTextProps) => {
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
