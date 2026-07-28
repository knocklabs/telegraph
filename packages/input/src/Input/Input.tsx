import { useComposedRefs } from "@telegraph/compose-refs";
import type {
  PolymorphicProps,
  Required,
  TgphElement,
  TgphSlotProps,
} from "@telegraph/helpers";
import { TgphSlot } from "@telegraph/helpers";
import { Stack, type StackProps } from "@telegraph/layout";
import { Text, type TextProps } from "@telegraph/typography";
import {
  type MouseEvent,
  type ReactNode,
  createContext,
  forwardRef,
  useContext,
  useRef,
} from "react";

import { COLOR, SIZE } from "./Input.constants";

export type BaseRootProps = {
  size?: "1" | "2" | "3";
  variant?: "outline" | "ghost";
  errored?: boolean;
};

// `TextProps<T>`/`StackProps` rather than `ComponentProps<typeof Text>` or
// `ComponentProps<typeof Stack>`: extracting props from a generic component
// instantiates its parameter at the constraint, which erases the passthrough.
// Threading `T` — or using the props type with its own default, as `stackProps`
// does for the always-`div` container — keeps the inherited props intact.
// `as` is declared here because the `Omit` below strips Text's own `as`.
export type RootProps<T extends TgphElement = "input"> = BaseRootProps & {
  as?: T;
  textProps?: Omit<TextProps<T>, "as">;
  stackProps?: Omit<StackProps, "as">;
} & Omit<TextProps<T>, "as" | keyof BaseRootProps>;

type InternalProps = Omit<BaseRootProps, "errored"> & {
  state: "default" | "disabled" | "error";
};

const InputContext = createContext<Required<InternalProps>>({
  state: "default",
  size: "2",
  variant: "outline",
});

const Root = <T extends TgphElement = "input">(rootProps: RootProps<T>) => {
  // Read through the default element: while `T` is unresolved the element
  // passthrough is a deferred conditional, so native attributes like `disabled`
  // are not visible and every prop would otherwise be an unresolved indexed
  // access intersected with its declared type.
  const {
    as = "input",
    size = "2",
    variant = "outline",
    textProps,
    stackProps,
    disabled,
    errored,
    children,
    tgphRef,
    ...props
  } = rootProps as RootProps<"input">;
  const Component = as;
  const inputRef = useRef<HTMLInputElement>(null);
  const composedRefs = useComposedRefs(tgphRef, inputRef);

  const state = disabled ? "disabled" : errored ? "error" : "default";

  return (
    <InputContext.Provider value={{ size, variant, state }}>
      <Stack
        // Focus the input when clicking on the container
        onPointerDown={(event: MouseEvent<HTMLDivElement>) => {
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
        {...stackProps}
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

export type SlotProps = Omit<TgphSlotProps, "size"> & {
  size?: "1" | "2" | "3";
  position?: "leading" | "trailing";
};
type SlotRef = HTMLElement;

const Slot = forwardRef<SlotRef, SlotProps>(
  ({ position = "leading", ...props }, forwardedRef) => {
    const context = useContext(InputContext);
    const slotSize = props.size ?? context.size;

    return (
      <Stack
        align="center"
        justify="center"
        h="full"
        data-tgph-input-slot
        data-tgph-input-slot-position={position}
        data-tgph-input-slot-size={slotSize}
        {...(position === "leading" && SIZE.SlotLeading[context.size])}
        {...(position === "trailing" && SIZE.SlotTrailing[context.size])}
      >
        <TgphSlot size={slotSize} {...props} ref={forwardedRef} />
      </Stack>
    );
  },
);

// `RootProps<T>` rather than `TgphComponentProps<typeof Root>`: extracting
// props from a generic component instantiates its parameter at the constraint,
// which erases the passthrough.
export type DefaultProps<T extends TgphElement = "input"> = Omit<
  PolymorphicProps<T>,
  keyof BaseRootProps
> &
  RootProps<T> & {
    LeadingComponent?: ReactNode;
    TrailingComponent?: ReactNode;
  };

const Default = <T extends TgphElement = "input">({
  LeadingComponent,
  TrailingComponent,
  ...props
}: DefaultProps<T>) => {
  const rootProps = props as RootProps<T>;

  return (
    <Root<T> {...rootProps}>
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
