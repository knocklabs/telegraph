import { Slot as RadixSlot } from "@radix-ui/react-slot";
import { useComposedRefs } from "@telegraph/compose-refs";
import clsx from "clsx";
import React from "react";
import type { Required } from '@telegraph/helpers';

import { COLOR, SIZE } from "./Input.constants";

type BaseRootProps = {
  size?: keyof typeof SIZE.Container;
  variant?: keyof typeof COLOR.Container.default;
  errored?: boolean;
};

type RootProps = BaseRootProps &
  Omit<React.ComponentPropsWithoutRef<"input">, "size">;

type RootRef = HTMLInputElement;

type InternalProps = Omit<BaseRootProps, "errored"> & {
  state: "default" | "disabled" | "error";
};


const InputContext = React.createContext<Required<InternalProps>>({
  state: "default",
  size: "2",
  variant: "outline",
});

const Root = React.forwardRef<RootRef, RootProps>(
  (
    {
      size = "2",
      variant = "outline",
      className,
      disabled,
      errored,
      children,
      ...props
    },
    forwardedRef,
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const composedRefs = useComposedRefs(forwardedRef, inputRef);

    const state = disabled ? "disabled" : errored ? "error" : "default";

    return (
      <InputContext.Provider value={{ size, variant, state }}>
        <div
          className={clsx(
            "box-border flex items-center transition-all",
            "border-2 border-solid text-gray-12 placeholder:text-gray-10",
            COLOR.Container[state][variant],
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
          <input
            className={clsx(
              "appearance-none text-gray-12 border-none shadow-0 outline-0 bg-transparent",
              "[font-family:inherit] h-full w-full",
              "order-2",
              SIZE.Input[size],
              className,
            )}
            disabled={disabled}
            {...props}
            ref={composedRefs}
          />
          {children}
        </div>
      </InputContext.Provider>
    );
  },
);

type SlotProps = React.ComponentPropsWithoutRef<typeof RadixSlot> & {
  size?: keyof typeof SIZE.Slot;
  position?: "leading" | "trailing";
};
type SlotRef = React.ElementRef<typeof RadixSlot>;

const Slot = React.forwardRef<SlotRef, SlotProps>(
  ({ position = "leading", ...props }, forwardedRef) => {
    const context = React.useContext(InputContext);
    return (
      <div
        className={clsx(
          "group box-border flex items-center justify-center h-full",
          "[&>[data-tgph-button]]:w-full [&>[data-tgph-button]]:h-auto",
          // Overrides to match the icon button in figma
          "[&>[data-tgph-button-layout='icon-only']]:aspect-square [&>[data-tgph-button-layout='icon-only']]:p-0",
          // Overrides default button layout to match the button in figma
          "[&>[data-tgph-button-layout='default']]:px-2",
          // If only an icon button is present, set the aspect ratio to square
          "[&:has([data-tgph-button-layout='icon-only'])]:aspect-square",
          // If only an icon button is present, reset the padding to spacing-1
          "[&:has([data-tgph-button-layout='icon-only'])]:!p-1",
          position === "leading" && SIZE.SlotLeading[context.size],
          position === "trailing" && SIZE.SlotTrailing[context.size],
          SIZE.Slot[props.size ?? context.size],
        )}
      >
        <RadixSlot size={context.size} {...props} ref={forwardedRef} />
      </div>
    );
  },
);

type DefaultProps = React.ComponentPropsWithoutRef<typeof Root> & {
  LeadingComponent?: React.ReactNode;
  TrailingComponent?: React.ReactNode;
};

const Default = ({
  LeadingComponent,
  TrailingComponent,
  ...props
}: DefaultProps) => {
  return (
    <Root {...props}>
      {LeadingComponent && <Slot position="leading">{LeadingComponent}</Slot>}
      {TrailingComponent && (
        <Slot position="trailing">{TrailingComponent}</Slot>
      )}
    </Root>
  );
};

Object.assign(Default, { Root, Slot });

const Input = Default as typeof Default & {
  Root: typeof Root;
  Slot: typeof Slot;
};

export { Input };
