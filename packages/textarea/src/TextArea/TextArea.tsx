import type { TgphComponentProps } from "@telegraph/helpers";
import { Text, type TextProps } from "@telegraph/typography";
import type React from "react";

import { COLOR, SIZE } from "./TextArea.constants";

type TextAreaBaseProps = {
  size?: keyof typeof SIZE;
  variant?: keyof (typeof COLOR)[keyof typeof COLOR];
  errored?: boolean;
  disabled?: boolean;
  resize?: "both" | "vertical" | "horizontal" | "none";
  tgphRef?: React.Ref<HTMLTextAreaElement>;
};

type TextAreaProps = TextAreaBaseProps & {
  textProps?: Omit<TextProps<"textarea">, "as">;
};

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
  tgphRef,
  textProps,
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
    />
  );
};

type TextAreaExportedProps = TgphComponentProps<typeof TextArea>;

export { TextArea, type TextAreaExportedProps as TextAreaProps };
