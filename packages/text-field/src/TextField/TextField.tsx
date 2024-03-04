import { clsx } from "clsx";
import React from "react";

import { COLOR, SIZE } from "./TextField.constants";

type TextFieldProps = Omit<
  React.HTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
> & {
  size?: "1" | "2" | "3";
  variant?: "outline" | "ghost";
  disabled?: boolean;
  error?: boolean | string;
  useChangeEvent?: boolean;
  value?: string;
  onChange?: (
    value: string,
    { event }: { event: React.ChangeEvent<HTMLInputElement> },
  ) => void;
};

type TextFieldRef = HTMLInputElement;

type InternalProps = {
  id: string;
  state: "default" | "error" | "disabled";
  size: TextFieldProps["size"];
  variant: TextFieldProps["variant"];
  message?: string;
};

const TextField = React.forwardRef<TextFieldRef, TextFieldProps>(
  (
    {
      size = "2",
      variant = "outline",
      value,
      onChange,
      className,
      disabled,
      error,
      ...props
    },
    ref,
  ) => {
    const [internalState, setInternalState] =
      React.useState<InternalProps["state"]>("default");

    React.useEffect(() => {
      if (disabled) {
        setInternalState("disabled");
      } else if (error) {
        setInternalState("error");
      } else {
        setInternalState("default");
      }
    }, [disabled, error]);

    return (
      <input
        value={value}
        onChange={(event) => {
          onChange?.(event.target.value, { event });
        }}
        className={clsx(
          "appearance-none outline-0 shadow-0 text-gray-12 border-solid",
          SIZE.Field[size],
          COLOR.Field[internalState][variant],
          className,
        )}
        disabled={disabled}
        {...props}
        ref={ref}
      />
    );
  },
);

export { TextField };
