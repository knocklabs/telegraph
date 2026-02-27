import type { TgphComponentProps } from "@telegraph/helpers";
import { Text } from "@telegraph/typography";
import React from "react";

import { COLOR, SIZE } from "./TextArea.constants";

type TextAreaBaseProps = {
  size?: "1" | "2" | "3";
  variant?: "outline" | "ghost";
  errored?: boolean;
  disabled?: boolean;
  resize?: "both" | "vertical" | "horizontal" | "none";
};

type TextAreaProps = TextAreaBaseProps & {
  textProps?: Omit<React.ComponentProps<typeof Text>, "as">;
} & Omit<React.ComponentProps<typeof Text>, "as" | keyof TextAreaBaseProps>;

const TextArea = ({
  size = "2",
  variant = "outline",
  resize = "both",
  disabled,
  errored,
  textProps,
  tgphRef,
  ...props
}: TextAreaProps) => {
  const state = disabled ? "disabled" : errored ? "error" : "default";

  return (
    <Text
      as="textarea"
      tgphRef={tgphRef}
      data-tgph-textarea
      data-tgph-textarea-state={state}
      data-tgph-textarea-variant={variant}
      data-tgph-textarea-size={size}
      data-tgph-textarea-resize={resize}
      disabled={disabled}
      w="full"
      {...SIZE[size]}
      {...COLOR[state][variant]}
      {...textProps}
      {...props}
    />
  );
};

type TextAreaExportedProps = TgphComponentProps<typeof TextArea>;

export { TextArea, type TextAreaExportedProps as TextAreaProps };
