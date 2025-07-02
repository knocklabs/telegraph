import { Slot as RadixSlot } from "@radix-ui/react-slot";
import { useComposedRefs } from "@telegraph/compose-refs";
import type {
  PolymorphicProps,
  Required,
  TgphComponentProps,
  TgphElement,
} from "@telegraph/helpers";
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import React from "react";

import { COLOR, SIZE } from "./Input.constants";

type BaseRootProps = {
  size?: "1" | "2" | "3";
  variant?: "outline" | "ghost";
  errored?: boolean;
};

type RootProps<T extends TgphElement> = BaseRootProps & {
  textProps?: Omit<React.ComponentProps<typeof Text<T>>, "as">;
} & Omit<React.ComponentProps<typeof Text<T>>, "as">;

type InternalProps = Omit<BaseRootProps, "errored"> & {
  state: "default" | "disabled" | "error";
};

const InputContext = React.createContext<Required<InternalProps>>({
  state: "default",
  size: "2",
  variant: "outline",
});

const Root = <T extends TgphElement>({
  as = "input" as T,
  size = "2",
  variant = "outline",
  textProps,
  disabled,
  errored,
  children,
  tgphRef,
  ...props
}: RootProps<T>) => {
  const Component = as;
  const inputRef = React.useRef<HTMLInputElement>(null);
  const composedRefs = useComposedRefs(tgphRef, inputRef);

  const state = disabled ? "disabled" : errored ? "error" : "default";

  return (
    <InputContext.Provider value={{ size, variant, state }}>
      <Stack
        // Focus the input when clicking on the container
        onPointerDown={(event: React.MouseEvent<HTMLDivElement>) => {
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
        align="center"
        {...SIZE.Container[size]}
        {...COLOR.Container[state][variant]}
        data-tgph-input-container
        data-tgph-input-container-variant={variant}
        data-tgph-input-container-state={state}
        data-tgph-input-container-size={size}
      >
        {/* 
          We choose to use the `<Text/>` component as a base here so that we can 
          configure the text inside of the input to match the design system font sizes
        */}
        <Text
          as={Component}
          bg="transparent"
          shadow="0"
          h="full"
          w="full"
          disabled={disabled}
          tgphRef={composedRefs}
          {...SIZE.Text[size]}
          {...COLOR.Text[state]}
          {...props}
          {...textProps}
          data-tgph-input-field
        />
        {children}
      </Stack>
    </InputContext.Provider>
  );
};

type SlotProps = React.ComponentPropsWithoutRef<typeof RadixSlot> & {
  size?: "1" | "2" | "3";
  position?: "leading" | "trailing";
};
type SlotRef = React.ElementRef<typeof RadixSlot>;

const Slot = React.forwardRef<SlotRef, SlotProps>(
  ({ position = "leading", ...props }, forwardedRef) => {
    const context = React.useContext(InputContext);
    return (
      <Stack
        align="center"
        justify="center"
        h="full"
        data-tgph-input-slot
        data-tgph-input-slot-position={position}
        data-tgph-input-slot-size={props.size ?? context.size}
        {...(position === "leading" && SIZE.SlotLeading[context.size])}
        {...(position === "trailing" && SIZE.SlotTrailing[context.size])}
      >
        <RadixSlot size={context.size} {...props} ref={forwardedRef} />
      </Stack>
    );
  },
);

type DefaultProps<T extends TgphElement> = PolymorphicProps<T> &
  TgphComponentProps<typeof Root> & {
    LeadingComponent?: React.ReactNode;
    TrailingComponent?: React.ReactNode;
  };

const Default = <T extends TgphElement>({
  LeadingComponent,
  TrailingComponent,
  ...props
}: DefaultProps<T>) => {
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
