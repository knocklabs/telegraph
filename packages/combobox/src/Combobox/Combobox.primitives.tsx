import { Button } from "@telegraph/button";
import {
  RefToTgphRef,
  type RemappedOmit,
  type TgphComponentProps,
  type TgphElement,
} from "@telegraph/helpers";
import { Box, Stack, type StackProps } from "@telegraph/layout";
import { Tag } from "@telegraph/tag";
import { Tooltip, type TooltipProps } from "@telegraph/tooltip";
import { TooltipIfTruncated } from "@telegraph/truncate";
import { Text } from "@telegraph/typography";
import { ChevronsUpDown, X } from "lucide-react";
import { LazyMotion, domAnimation } from "motion/react";
import * as motion from "motion/react-m";
import React from "react";

import { ComboboxContext } from "./Combobox";
import {
  getCurrentOption,
  getValueFromOption,
  isMultiSelect,
  isSingleSelect,
} from "./Combobox.helpers";
import type {
  DefinedOption,
  MultiSelect,
  Option,
  SingleSelect,
} from "./Combobox.types";

// Drop `as`: this always renders `motion.span` (KNO-14501). Drop `alt` too:
// the body discards it, so leaving it in the type promised an accessible name
// this never renders.
type TriggerIndicatorProps<T extends TgphElement> = Omit<
  Partial<TgphComponentProps<typeof Button.Icon<T>>>,
  "as" | "alt"
>;

const TriggerIndicator = <T extends TgphElement = "span">(
  triggerIndicatorProps: TriggerIndicatorProps<T>,
) => {
  const {
    icon = ChevronsUpDown,
    "aria-hidden": ariaHidden = true,
    // Destructure `alt` for the same reason the cast omits it: Button.Icon
    // rejects `alt` and `aria-hidden` arriving together.
    as: _as,
    alt: _alt,
    ...props
  } = triggerIndicatorProps as TriggerIndicatorProps<"span"> & {
    as?: TgphElement;
    alt?: string;
  };
  const context = React.useContext(ComboboxContext);
  return (
    <Button.Icon
      as={motion.span}
      animate={{ rotate: context.open ? 180 : 0 }}
      transition={{ duration: 0.15, type: "spring", bounce: 0 }}
      icon={icon}
      aria-hidden={ariaHidden}
      {...(props as RemappedOmit<
        TgphComponentProps<typeof Button.Icon<typeof motion.span>>,
        "as" | "icon" | "alt" | "aria-hidden"
      >)}
    />
  );
};

type TriggerClearProps<T extends TgphElement> = TgphComponentProps<
  typeof Button<T>
> & {
  tooltipProps?: TooltipProps;
};

const TriggerClear = <T extends TgphElement = "button">(
  triggerClearProps: TriggerClearProps<T>,
) => {
  const { tooltipProps, ...props } =
    triggerClearProps as TriggerClearProps<"button">;
  const context = React.useContext(ComboboxContext);

  const handleClear = () => {
    if (isMultiSelect(context.value)) {
      const onValueChange =
        context.onValueChange as MultiSelect["onValueChange"];
      onValueChange?.([]);
    }

    if (isSingleSelect(context.value)) {
      const onValueChange =
        context.onValueChange as SingleSelect["onValueChange"];
      onValueChange?.(undefined);
    }
    context.triggerRef?.current?.focus();
  };

  const shouldShowClearable = React.useMemo(() => {
    if (isSingleSelect(context.value)) {
      return context.clearable && context.value;
    }

    if (isMultiSelect(context.value)) {
      return context.clearable && context.value?.length > 0;
    }
  }, [context.clearable, context.value]);

  if (!shouldShowClearable) return null;

  return (
    <Tooltip label="Clear field" {...tooltipProps}>
      <Button
        type="button"
        icon={{ icon: X, alt: "Clear field" }}
        size="0"
        variant="ghost"
        onClick={(event: React.MouseEvent) => {
          if (!context.value) return;
          event.stopPropagation();
          handleClear();
        }}
        onKeyDown={(event: React.KeyboardEvent) => {
          if (event.key === "Enter" || event.key === " ") {
            event.stopPropagation();
            event.preventDefault();
            handleClear();
          }
        }}
        data-tgph-combobox-clear
        style={{
          // Remove margin to make the clear button flush
          // with the trigger button
          marginTop: "calc(-1 * var(--tgph-spacing-1)",
          marginBottom: "calc(-1 * var(--tgph-spacing-1)",
        }}
        {...(props as RemappedOmit<
          TgphComponentProps<typeof Button<"button">>,
          | "type"
          | "icon"
          | "leadingIcon"
          | "trailingIcon"
          | "size"
          | "variant"
          | "onClick"
          | "onKeyDown"
        >)}
      />
    </Tooltip>
  );
};

type TriggerTextProps<T extends TgphElement> = TgphComponentProps<
  typeof Button.Text<T>
>;

const TriggerText = <T extends TgphElement = "span">(
  triggerTextProps: TriggerTextProps<T>,
) => {
  const { children, ...props } = triggerTextProps as TriggerTextProps<"span">;
  const context = React.useContext(ComboboxContext);

  const label = React.useMemo(() => {
    if (!isSingleSelect(context.value)) return;

    const currentOption = getCurrentOption(
      context.value,
      context.options,
      context.legacyBehavior,
    );

    const label =
      currentOption?.label || currentOption?.value || context.placeholder;

    // In `legacyBehavior` mode, we can override the label of the combobox via the `label` prop
    // in context value. So, if we're in `legacyBehavior` mode and the context value has a
    // label, we want to use that label instead of the label from the current option
    const legacyLabelOverride =
      context.legacyBehavior && (context?.value as DefinedOption)?.label;

    return legacyLabelOverride ? legacyLabelOverride : label;
  }, [
    context.value,
    context.options,
    context.legacyBehavior,
    context.placeholder,
  ]);

  return (
    <TooltipIfTruncated>
      <Button.Text
        color={!context.value ? "gray" : "default"}
        textOverflow="ellipsis"
        overflow="hidden"
        {...(props as RemappedOmit<
          TgphComponentProps<typeof Button.Text<"span">>,
          "color" | "textOverflow" | "overflow" | "children"
        >)}
      >
        {children || label}
      </Button.Text>
    </TooltipIfTruncated>
  );
};

type TriggerPlaceholderProps<T extends TgphElement> = TgphComponentProps<
  typeof Button.Text<T>
>;

const TriggerPlaceholder = <T extends TgphElement = "span">(
  triggerPlaceholderProps: TriggerPlaceholderProps<T>,
) => {
  const { children, ...props } =
    triggerPlaceholderProps as TriggerPlaceholderProps<"span">;
  const context = React.useContext(ComboboxContext);
  return (
    <TooltipIfTruncated>
      <Button.Text
        color="gray"
        textOverflow="ellipsis"
        overflow="hidden"
        {...(props as RemappedOmit<
          TgphComponentProps<typeof Button.Text<"span">>,
          "color" | "textOverflow" | "overflow" | "children"
        >)}
      >
        {children || context.placeholder}
      </Button.Text>
    </TooltipIfTruncated>
  );
};

type TriggerTagsContainerProps = StackProps;

const TriggerTagsContainer = ({ children }: TriggerTagsContainerProps) => {
  const context = React.useContext(ComboboxContext);

  if (!isMultiSelect(context.value)) return null;

  const layout = context.layout || "truncate";
  const truncatedLength = context.value.length - 2;
  const truncatedLengthStringArray = truncatedLength.toString().split("");

  return (
    <Stack
      gap="0_5"
      w="full"
      wrap={layout === "wrap" ? "wrap" : "nowrap"}
      align="center"
      style={{
        position: "relative",
        flexGrow: 1,
      }}
    >
      {children}
      {layout === "truncate" && context.value.length > 2 && (
        <Stack
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1, type: "spring", bounce: 0 }}
          h="full"
          pr="1"
          pl="8"
          align="center"
          aria-label={`${context.value.length - 2} more selected`}
          position="absolute"
          right="0"
          style={{
            backgroundImage:
              "linear-gradient(to left, var(--tgph-surface-1) 0 60%, transparent 90% 100%)",
          }}
        >
          <Text as="span" size="1" style={{ whiteSpace: "nowrap" }}>
            +
            {truncatedLengthStringArray.map((n) => (
              <Box
                as={motion.span}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1, type: "spring", bounce: 0 }}
                w="2"
                display="inline-block"
                key={n}
              >
                {n}
              </Box>
            ))}{" "}
            more
          </Text>
        </Stack>
      )}
    </Stack>
  );
};

const TriggerTagContext = React.createContext<{
  value: string;
}>({
  value: "",
});

// Drop `as`: this always renders `motion.span` (KNO-14501).
type TriggerTagRootProps<T extends TgphElement> = {
  value: string;
} & RemappedOmit<TgphComponentProps<typeof Tag.Root<T>>, "as">;

const TriggerTagRoot = <T extends TgphElement = "span">(
  triggerTagRootProps: TriggerTagRootProps<T>,
) => {
  const {
    value,
    children,
    as: _as,
    ...props
  } = triggerTagRootProps as TriggerTagRootProps<"span"> & {
    as?: TgphElement;
  };
  return (
    <TriggerTagContext.Provider value={{ value }}>
      <Tag.Root
        as={motion.span}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.1, type: "spring", bounce: 0 }}
        size="1"
        maxH="5"
        rounded="1"
        layout="position"
        {...(props as RemappedOmit<
          TgphComponentProps<typeof Tag.Root<typeof motion.span>>,
          "as" | "size" | "maxH" | "rounded" | "children"
        >)}
      >
        {children}
      </Tag.Root>
    </TriggerTagContext.Provider>
  );
};

type TriggerTagTextProps<T extends TgphElement> = TgphComponentProps<
  typeof Tag.Text<T>
>;

const TriggerTagText = <T extends TgphElement = "span">(
  triggerTagTextProps: TriggerTagTextProps<T>,
) => {
  const { children, ...props } =
    triggerTagTextProps as TriggerTagTextProps<"span">;
  const context = React.useContext(ComboboxContext);
  const triggerTagContext = React.useContext(TriggerTagContext);

  const option = React.useMemo(() => {
    // Find option amongst other options
    const foundOption = context.options.find(
      (o) => o.value === triggerTagContext.value,
    );
    if (foundOption) return foundOption.label || foundOption.value;

    // Find option amongst the current values in the case of creation
    if (!context.value) return undefined;
    const contextValue = context.value as Array<Option>;
    const foundValue = contextValue.find(
      (v) =>
        getValueFromOption(v, context.legacyBehavior) ===
        triggerTagContext.value,
    );

    if (!foundValue) return undefined;

    return foundValue;
  }, [
    context.options,
    context.value,
    triggerTagContext.value,
    context.legacyBehavior,
  ]);

  return (
    <Tag.Text
      {...(props as RemappedOmit<
        TgphComponentProps<typeof Tag.Text<"span">>,
        "children"
      >)}
    >
      {/* `Option` includes the legacy `{ value, label }` shape, which is not a
          `ReactNode`. Rendering it was already the pre-existing behaviour; only
          the type is narrowed here. */}
      {children || (option as React.ReactNode)}
    </Tag.Text>
  );
};

type TriggerTagButtonProps<T extends TgphElement> = TgphComponentProps<
  typeof Tag.Button<T>
>;

const TriggerTagButton = <T extends TgphElement = "button">(
  triggerTagButtonProps: TriggerTagButtonProps<T>,
) => {
  const { children, ...props } =
    triggerTagButtonProps as TriggerTagButtonProps<"button">;
  const context = React.useContext(ComboboxContext);
  const triggerTagContext = React.useContext(TriggerTagContext);

  return (
    <Tag.Button
      icon={{ icon: X, alt: `Remove ${triggerTagContext.value}` }}
      height="full"
      borderRightRadius="1"
      onClick={(event: React.MouseEvent) => {
        if (!context.onValueChange) return;
        const onValueChange =
          context.onValueChange as MultiSelect["onValueChange"];
        const contextValue = context.value as Array<Option>;

        const newValue = contextValue.filter((v) => {
          const valueOption = getValueFromOption(v, context.legacyBehavior);
          return valueOption !== triggerTagContext.value;
        });

        onValueChange?.(newValue);
        // Stop click event from bubbling up
        event.stopPropagation();
        // Stop the button "submit" action from triggering
        event.preventDefault();
      }}
      data-tgph-combobox-tag-button
      {...(props as RemappedOmit<
        TgphComponentProps<typeof Tag.Button<"button">>,
        | "icon"
        | "leadingIcon"
        | "trailingIcon"
        | "height"
        | "borderRightRadius"
        | "onClick"
        | "children"
      >)}
    >
      {children}
    </Tag.Button>
  );
};

type TriggerTagDefaultProps<T extends TgphElement> = TgphComponentProps<
  typeof TriggerTagRoot<T>
>;

const TriggerTagDefault = <T extends TgphElement = "span">(
  triggerTagDefaultProps: TriggerTagDefaultProps<T>,
) => {
  const { value, children, ...props } =
    triggerTagDefaultProps as TriggerTagDefaultProps<"span">;
  return (
    <TriggerTag.Root value={value} {...props}>
      <TriggerTag.Text>{children}</TriggerTag.Text>
      <TriggerTag.Button />
    </TriggerTag.Root>
  );
};

// `StackProps` rather than `TgphComponentProps<typeof Stack>`, for the same
// reason as `TriggerTagsContainerProps` above.
type TriggerActionsContainerProps = StackProps;

const TriggerActionsContainer = (props: TriggerActionsContainerProps) => {
  return <Stack align="center" gap="1" {...props} />;
};

const TriggerValue = () => {
  const context = React.useContext(ComboboxContext);

  if (context.value && isMultiSelect(context.value)) {
    const layout = context.layout || "truncate";

    if (context.value.length === 0) {
      return <TriggerPlaceholder />;
    }

    return (
      <LazyMotion features={domAnimation}>
        <TriggerTagsContainer>
          {context.value.map((v, i) => {
            const value = getValueFromOption(v, context.legacyBehavior);
            if (
              value &&
              ((layout === "truncate" && i <= 1) || layout === "wrap")
            ) {
              return (
                <RefToTgphRef key={value}>
                  <TriggerTag.Default value={value} />
                </RefToTgphRef>
              );
            }
          })}
        </TriggerTagsContainer>
      </LazyMotion>
    );
  }

  if (context && isSingleSelect(context.value)) {
    if (!context.value) {
      return <TriggerPlaceholder />;
    }
    return <TriggerText />;
  }
};

const TriggerTag = {
  Root: TriggerTagRoot,
  Text: TriggerTagText,
  Button: TriggerTagButton,
  Default: TriggerTagDefault,
};

const Primitives = {
  TriggerIndicator,
  TriggerClear,
  TriggerText,
  TriggerPlaceholder,
  TriggerTagsContainer,
  TriggerActionsContainer,
  TriggerTag,
  TriggerValue,
};

export { Primitives };
