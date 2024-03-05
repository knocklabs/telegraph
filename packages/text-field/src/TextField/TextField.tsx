import { useComposedRefs } from "@telegraph/compose-refs";
import { Icon } from "@telegraph/icon";
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
  value?: string;
  onChange?: (
    value: string,
    { event }: { event: React.ChangeEvent<HTMLInputElement> },
  ) => void;
  leadingIcon?: React.ComponentProps<typeof Icon>;
  TrailingAction?: React.ReactElement;
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
      leadingIcon,
      TrailingAction,
      className,
      disabled,
      error,
      ...props
    },
    forwardedRef,
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const composedRefs = useComposedRefs(inputRef, forwardedRef);

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

    // Adds default props to the component, which can be overridden by the caller
    const TrailingActionComponent = TrailingAction
      ? React.cloneElement(TrailingAction, {
          size,
          color: "gray",
          variant: "ghost",
          ...TrailingAction?.props,
        })
      : null;
    return (
      <div
        className={clsx(
          "box-border flex items-center transition-all",
          "border-2 border-solid text-gray-12 placeholder:text-gray-10",
          COLOR.Container[internalState][variant],
          SIZE.Container[size],
        )}
        // Focus the input when clicking on the container
        onPointerDown={(event) => {
          const target = event.target as HTMLElement;

          // Make sure we're not clicking on an interactive element
          if (target.closest("button, a")) {
            event.preventDefault();
            return;
          }

          const input = inputRef.current;
          if (!input) return;

          requestAnimationFrame(() => {
            input.focus();
          });
        }}
      >
        {leadingIcon && <Icon size={size} color="gray" {...leadingIcon} />}
        <input
          value={value}
          onChange={(event) => {
            onChange?.(event.target.value, { event });
          }}
          className={clsx(
            "appearance-none text-gray-12 border-none shadow-0 outline-0 bg-transparent",
            "[font-family:inherit] h-full w-full",
            SIZE.Field[size],
            className,
          )}
          disabled={disabled}
          {...props}
          ref={composedRefs}
        />
        {TrailingAction && (
          <div
            className={clsx(
              "box-border aspect-square h-full p-[2px] flex items-center justify-center",
              // Overrides to get the button to fit into the text field as designed
              "[&>[data-tgph-button]]:aspect-square [&>[data-tgph-button]]:p-0 [&>[data-tgph-button]]:w-full [&>[data-tgph-button]]:h-auto",
              SIZE.TrailingAction[size],
            )}
          >
            {TrailingActionComponent}
          </div>
        )}
      </div>
    );
  },
);

export { TextField };
