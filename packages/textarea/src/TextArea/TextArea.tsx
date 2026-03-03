import { Text, type TextProps } from "@telegraph/typography";

import {
  type Size,
  type Variant,
  sizeMap,
  stateMap,
  variantMap,
} from "./TextArea.constants";

type TextAreaTextProps = Omit<TextProps<"textarea">, "as">;

type TextAreaBaseProps = {
  size?: Size;
  variant?: Variant;
  errored?: boolean;
  disabled?: boolean;
  resize?: "both" | "vertical" | "horizontal" | "none";
  textProps?: TextAreaTextProps;
};

type TextAreaProps = TextAreaBaseProps & TextAreaTextProps;

const deriveState = ({
  disabled,
  errored,
}: Pick<TextAreaBaseProps, "disabled" | "errored">) => {
  if (disabled) return "disabled";
  if (errored) return "error";
  return "default";
};

const TextArea = ({
  size = "2",
  variant = "outline",
  resize = "both",
  disabled,
  errored,
  textProps,
  ...props
}: TextAreaProps) => {
  const derivedState = deriveState({ disabled, errored });

  return (
    <Text
      as="textarea"
      data-tgph-textarea
      data-tgph-textarea-state={derivedState}
      data-tgph-textarea-variant={variant}
      data-tgph-textarea-size={size}
      data-tgph-textarea-resize={resize}
      disabled={disabled}
      {...sizeMap[size]}
      {...variantMap[variant]}
      {...stateMap[derivedState][variant]}
      {...textProps}
      {...props}
    />
  );
};

export { TextArea, type TextAreaProps };
