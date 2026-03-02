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

const deriveState = ({
  disabled,
  errored,
}: Pick<TextAreaBaseProps, "disabled" | "errored">) => {
  if (disabled) return "disabled" as const;
  if (errored) return "error" as const;
  return "default" as const;
};

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
  const state = deriveState({ disabled, errored });

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
