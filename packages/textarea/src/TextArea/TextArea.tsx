import type { TgphComponentProps } from "@telegraph/helpers";
import { Box } from "@telegraph/layout";
import { clsx } from "clsx";
import React from "react";

import {
  type Size,
  type State,
  type Variant,
  sizeMap,
  stateMap,
  variantMap,
} from "./TextArea.constants";
import { baseStyles, variants } from "./TextArea.css";

const deriveState = ({ disabled, errored }: TextAreaBaseProps): State => {
  if (disabled) return "disabled";
  if (errored) return "error";
  return "default";
};

type TextAreaBaseProps = {
  size?: Size;
  variant?: Variant;
  errored?: boolean;
  disabled?: boolean;
  resize?: "both" | "vertical" | "horizontal" | "none";
};

type TextAreaProps = TextAreaBaseProps &
  TgphComponentProps<typeof Box> &
  React.ComponentPropsWithoutRef<"textarea">;

const TextArea = ({
  size = "2",
  variant = "outline",
  rounded = "2",
  resize = "both",
  disabled,
  errored,
  className,
  ...props
}: TextAreaProps) => {
  const derivedState = deriveState({ disabled, errored });

  return (
    <Box
      as="textarea"
      className={clsx(
        baseStyles,
        variants({ variant, size, resize, state: derivedState }),
        className,
      )}
      rounded={rounded}
      disabled={disabled}
      {...sizeMap[size]}
      {...variantMap[variant]}
      {...stateMap[derivedState]}
      {...props}
    />
  );
};

type TextAreaExportedProps = TgphComponentProps<typeof TextArea>;

export { TextArea, type TextAreaExportedProps as TextAreaProps };
