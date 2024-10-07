import { useControllableState } from "@radix-ui/react-use-controllable-state";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Button as TelegraphButton } from "@telegraph/button";
import { useComposedRefs } from "@telegraph/compose-refs";
import {
  RefToTgphRef,
  type TgphComponentProps,
  type TgphElement,
} from "@telegraph/helpers";
import { Icon, Lucide } from "@telegraph/icon";
import { Input as TelegraphInput } from "@telegraph/input";
import { Box, Stack } from "@telegraph/layout";
import { Menu as TelegraphMenu } from "@telegraph/menu";
import { Tag } from "@telegraph/tag";
import { Tooltip } from "@telegraph/tooltip";
import { Text } from "@telegraph/typography";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

import { TRIGGER_MIN_HEIGHT } from "./Combobox.constants";
import {
  type DefinedOption,
  type Option,
  isMultiSelect,
  isSingleSelect,
} from "./Combobox.helpers";

const FIRST_KEYS = ["ArrowDown", "PageUp", "Home"];
const LAST_KEYS = ["ArrowUp", "PageDown", "End"];
const SELECT_KEYS = ["Enter", " "];

type SingleSelect = {
  value?: Option;
  onValueChange?: (value: Option) => void;
};

type MultiSelect = {
  value?: Array<Option>;
  onValueChange?: (value: Array<Option>) => void;
};

type RootProps = (
  | {
      value?: MultiSelect["value"];
      onValueChange?: MultiSelect["onValueChange"];
      layout?: "truncate" | "wrap";
    }
  | {
      value?: SingleSelect["value"];
      onValueChange?: SingleSelect["onValueChange"];
      layout?: never;
    }
) & {
  open?: boolean;
  defaultOpen?: boolean;
  errored?: boolean;
  placeholder?: string;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  closeOnSelect?: boolean;
  clearable?: boolean;
  children?: React.ReactNode;
};

const ComboboxContext = React.createContext<
  Omit<RootProps, "children"> & {
    contentId: string;
    triggerId: string;
    open: boolean;
    setOpen: (open: boolean) => void;
    onOpenToggle: () => void;
    searchQuery?: string;
    setSearchQuery?: (query: string) => void;
    triggerRef?: React.RefObject<HTMLDivElement>;
    searchRef?: React.RefObject<HTMLInputElement>;
    contentRef?: React.RefObject<HTMLDivElement>;
  }
>({
  onValueChange: () => {},
  contentId: "",
  triggerId: "",
  open: false,
  setOpen: () => {},
  onOpenToggle: () => {},
  clearable: false,
});

const Root = ({
  modal = true,
  closeOnSelect = true,
  clearable = false,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  defaultOpen: defaultOpenProp,
  value,
  onValueChange,
  errored,
  placeholder,
  layout,
  ...props
}: RootProps) => {
  const contentId = React.useId();
  const triggerId = React.useId();
  const triggerRef = React.useRef(null);
  const searchRef = React.useRef(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpenProp,
    onChange: onOpenChangeProp,
  });

  const onOpenToggle = React.useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
  }, [setOpen]);

  React.useEffect(() => {
    // If the combobox is closed clear
    // the search query
    if (!open) {
      setSearchQuery("");
    }
  }, [open]);

  return (
    <ComboboxContext.Provider
      value={{
        contentId,
        triggerId,
        value,
        onValueChange,
        placeholder,
        open,
        setOpen,
        onOpenToggle,
        closeOnSelect,
        clearable,
        searchQuery,
        setSearchQuery,
        triggerRef,
        searchRef,
        contentRef,
        errored,
        layout,
      }}
    >
      <TelegraphMenu.Root
        open={open}
        onOpenChange={setOpen}
        modal={modal}
        {...props}
      />
    </ComboboxContext.Provider>
  );
};

type TriggerTagProps = {
  value: string;
  label?: string;
};

const TriggerTag = ({ label, value, ...props }: TriggerTagProps) => {
  const context = React.useContext(ComboboxContext);

  return (
    <Tag.Root
      size="1"
      as={motion.span}
      initial={{ opacity: 0, transform: "scale(0.8)" }}
      animate={{ opacity: 1, transform: "scale(1)" }}
      exit={{ opacity: 0, transform: "scale(0.5)" }}
      layout="position"
      transition={{
        duration: 0.2,
        type: "spring",
        bounce: 0,
        layout: {
          duration: 0.05,
          type: "spring",
          bounce: 0,
        },
      }}
      {...props}
    >
      <Tag.Text>{label || value}</Tag.Text>
      <Tag.Button
        icon={{ icon: Lucide.X, alt: `Remove ${value}` }}
        onClick={(event: React.MouseEvent) => {
          if (!context.onValueChange) return;
          const onValueChange =
            context.onValueChange as MultiSelect["onValueChange"];
          const contextValue = context.value as Array<Option>;
          const newValue = contextValue.filter((v) => v?.value !== value);
          onValueChange?.(newValue);
          // Stop click event from bubbling up
          event.stopPropagation();
          // Stop the button "submit" action from triggering
          event.preventDefault();
        }}
      />
    </Tag.Root>
  );
};

const TriggerValue = () => {
  const context = React.useContext(ComboboxContext);

  if (context.value && isMultiSelect(context.value)) {
    const layout = context.layout || "truncate";
    const truncatedLength = context.value.length - 2;
    const truncatedLengthStringArray = truncatedLength.toString().split("");

    if (context.value.length === 0) {
      return (
        <TelegraphButton.Text color="gray">
          {context.placeholder}
        </TelegraphButton.Text>
      );
    }
    return (
      <Stack
        gap="1"
        w="full"
        wrap={layout === "wrap" ? "wrap" : "nowrap"}
        align="center"
        style={{
          position: "relative",
          flexGrow: 1,
        }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {context.value.map((v, i) => {
            if (
              v?.value &&
              ((layout === "truncate" && i <= 1) || layout === "wrap")
            ) {
              return (
                <RefToTgphRef key={v.value}>
                  <TriggerTag {...v} />
                </RefToTgphRef>
              );
            }
          })}
        </AnimatePresence>
        <AnimatePresence>
          {layout === "truncate" && context.value.length > 2 && (
            <Stack
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, type: "spring", bounce: 0 }}
              h="full"
              pr="1"
              pl="8"
              align="center"
              aria-label={`${truncatedLength} more selected`}
              style={{
                position: "absolute",
                right: 0,
                backgroundImage:
                  "linear-gradient(to left, var(--tgph-surface-1) 0 60%, transparent 90% 100%)",
              }}
              key="truncated text"
            >
              <Text as="span" size="1" style={{ whiteSpace: "nowrap" }}>
                +
                <AnimatePresence mode="wait" initial={false}>
                  {truncatedLengthStringArray.map((n) => (
                    <Box
                      as={motion.span}
                      w="2"
                      display="inline-block"
                      initial={{
                        opacity: 0.5,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                      exit={{
                        opacity: 0.5,
                      }}
                      transition={{ duration: 0.1, type: "spring", bounce: 0 }}
                      key={n}
                    >
                      {n}
                    </Box>
                  ))}
                </AnimatePresence>{" "}
                more
              </Text>
            </Stack>
          )}
        </AnimatePresence>
      </Stack>
    );
  }

  return (
    <TelegraphButton.Text color={!context.value ? "gray" : "default"}>
      {context?.value?.label || context?.value?.value || context.placeholder}
    </TelegraphButton.Text>
  );
};

type TriggerProps = React.ComponentProps<typeof TelegraphMenu.Trigger> & {
  placeholder?: string;
  size?: TgphComponentProps<typeof TelegraphButton.Root>["size"];
};

const Trigger = ({ size = "2", ...props }: TriggerProps) => {
  const context = React.useContext(ComboboxContext);

  const getAriaLabelString = React.useCallback(() => {
    if (!context.value) return context.placeholder;
    if (isSingleSelect(context.value)) {
      return (
        context.value?.label || context.value?.value || context.placeholder
      );
    } else {
      return (
        context.value?.map((v) => v?.label).join(", ") || context.placeholder
      );
    }
  }, [context.value, context.placeholder]);

  const shouldShowClearable = React.useMemo(() => {
    if (isMultiSelect(context.value)) {
      return context.clearable && context.value?.length > 0;
    }

    if (isSingleSelect(context.value)) {
      return context.clearable && context.value;
    }
  }, [context.clearable, context.value]);

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

  return (
    <TelegraphMenu.Trigger
      {...props}
      asChild
      onClick={(event: React.MouseEvent) => {
        event.preventDefault();
        context.onOpenToggle();
        context.triggerRef?.current?.focus();
      }}
      onKeyDown={(event: React.KeyboardEvent) => {
        // Lets the user tab in and out of the combobox as usual
        if (event.key === "Tab") {
          event.stopPropagation();
          return;
        }
        if (SELECT_KEYS.includes(event.key)) {
          event.preventDefault();
          return;
        }

        if (event.key === "ArrowDown") {
          context.onOpenToggle();
          return;
        }
      }}
      tgphRef={context.triggerRef}
    >
      <TelegraphButton.Root
        id={context.triggerId}
        type="button"
        bg="surface-1"
        variant="outline"
        align="center"
        minH={TRIGGER_MIN_HEIGHT[size]}
        h="full"
        w="full"
        py="1"
        size={size}
        color={context.errored ? "red" : "gray"}
        justify="space-between"
        // Accessibility attributes
        role="combobox"
        aria-label={getAriaLabelString()}
        aria-controls={context.contentId}
        aria-expanded={context.open}
        aria-haspopup="listbox"
        // Custom attributes
        data-tgph-combobox-trigger
        data-tgph-comobox-trigger-open={context.open}
      >
        <TriggerValue />
        <Stack align="center" gap="1">
          {shouldShowClearable && (
            <Tooltip label="Clear field">
              <TelegraphButton
                type="button"
                icon={{ icon: Lucide.X, alt: "Clear field" }}
                size="1"
                variant="ghost"
                onClick={(event: React.MouseEvent) => {
                  if (!context.value) return;
                  event.stopPropagation();
                  handleClear();
                }}
                onKeyDown={(event: React.KeyboardEvent) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.stopPropagation();
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
              />
            </Tooltip>
          )}
          <TelegraphButton.Icon
            as={motion.div}
            icon={Lucide.ChevronDown}
            animate={{ rotate: context.open ? "180deg" : "0deg" }}
            transition={{ duration: 0.2, type: "spring", bounce: 0 }}
            aria-hidden
          />
        </Stack>
      </TelegraphButton.Root>
    </TelegraphMenu.Trigger>
  );
};

type ContentProps<T extends TgphElement> = TgphComponentProps<
  typeof TelegraphMenu.Content<T>
>;

const Content = <T extends TgphElement>({
  tgphRef,
  style,
  children,
  ...props
}: ContentProps<T>) => {
  const context = React.useContext(ComboboxContext);
  const hasInteractedOutside = React.useRef(false);
  const composedRef = useComposedRefs<unknown>(tgphRef, context.contentRef);

  const internalContentRef = React.useRef(null);

  const [height, setHeight] = React.useState(0);
  const [initialAnimationComplete, setInitialAnimationComplete] =
    React.useState(false);

  const setHeightFromContent = React.useCallback(
    (element: Element) => {
      // Set the initial height of the content after the animation completes
      const rect = element.getBoundingClientRect();
      if (rect) {
        setHeight(rect.height);
      }

      if (!initialAnimationComplete) {
        setInitialAnimationComplete(true);
      }
    },
    [initialAnimationComplete],
  );

  React.useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const element = entry.target;
        setHeightFromContent(element);
      }
    });
    // Attatch the observer once the initial animation completes
    // and the content ref is available
    if (internalContentRef.current && initialAnimationComplete) {
      observer.observe(internalContentRef.current);
    }

    return () => observer.disconnect();
  }, [initialAnimationComplete, setHeightFromContent]);

  // Reset the animation complete state when the combobox is closed
  React.useEffect(() => {
    if (initialAnimationComplete === true && context.open === false) {
      setInitialAnimationComplete(false);
    }
  }, [context.open, initialAnimationComplete]);

  return (
    <TelegraphMenu.Content
      as={motion.div}
      mt="1"
      initial={{
        opacity: 0,
        scale: 0.8,
        height: "auto",
      }}
      animate={{
        opacity: 1,
        scale: 1,
        // Set height based on the internalContentRef so that
        // we get smooth animations when the content changes
        minHeight: height ? `${height}px` : "0",
      }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 0.2, type: "spring", bounce: 0 }}
      onAnimationComplete={() => {
        // Set height when the initial animation for
        // displaying the content completes
        if (!initialAnimationComplete && internalContentRef) {
          const element = internalContentRef.current as unknown as Element;
          setHeightFromContent(element);
        }
      }}
      onCloseAutoFocus={(event: Event) => {
        if (!hasInteractedOutside.current) context.triggerRef?.current?.focus();
        hasInteractedOutside.current = false;

        event.preventDefault();
      }}
      onKeyDown={(event: React.KeyboardEvent) => {
        // If the first option is focused and the user presses the up
        // arrow key, focus the search input
        const options = context.contentRef?.current?.querySelectorAll(
          "[data-tgph-combobox-option]",
        );

        if (
          document.activeElement === options?.[0] &&
          LAST_KEYS.includes(event.key)
        ) {
          context.searchRef?.current?.focus();
        }

        // Close the combobox if the user presses the escape key
        if (event.key === "Escape") {
          context.setOpen(false);
        }

        event.stopPropagation();
      }}
      bg="surface-1"
      style={{
        width: "var(--tgph-comobobox-trigger-width)",
        ...style,
        ...{
          "--tgph-comobobox-content-transform-origin":
            "var(--radix-popper-transform-origin)",
          "--tgph-combobox-content-available-width":
            "var(--radix-popper-available-width)",
          "--tgph-combobox-content-available-height":
            "calc(var(--radix-popper-available-height) - var(--tgph-spacing-8))",
          "--tgph-comobobox-trigger-width": "var(--radix-popper-anchor-width)",
          "--tgph-combobox-trigger-height": "var(--radix-popper-anchor-height)",
        },
      }}
      {...props}
      tgphRef={composedRef}
      data-tgph-combobox-content
      data-tgph-combobox-content-open={initialAnimationComplete}
      // Cancel out accessibility attirbutes related to aria menu
      role={undefined}
      aria-orientation={undefined}
    >
      <Stack direction="column" gap="1" tgphRef={internalContentRef}>
        {children}
      </Stack>
    </TelegraphMenu.Content>
  );
};

type OptionsProps<T extends TgphElement> = TgphComponentProps<typeof Stack<T>>;

const Options = <T extends TgphElement>({ ...props }: OptionsProps<T>) => {
  const context = React.useContext(ComboboxContext);
  return (
    <Stack
      id={context.contentId}
      direction="column"
      gap="1"
      style={{
        overflowY: "auto",
        // Available Height - Padding from edge of screen
        maxHeight:
          "calc(var(--tgph-combobox-content-available-height) - var(--tgph-spacing-12))",
      }}
      // Accessibility attributes
      role="listbox"
      {...props}
    />
  );
};

type OptionProps<T extends TgphElement> = TgphComponentProps<
  typeof TelegraphMenu.Button<T>
> & {
  value: string;
  label?: string;
  selected?: boolean | null;
};

const Option = <T extends TgphElement>({
  value,
  label,
  selected,
  onSelect,
  ...props
}: OptionProps<T>) => {
  const context = React.useContext(ComboboxContext);
  const [isFocused, setIsFocused] = React.useState(false);
  const contextValue = context.value;

  const isVisible = isMultiSelect(contextValue)
    ? !context.searchQuery ||
      value.toLowerCase().includes(context.searchQuery.toLowerCase())
    : !context.searchQuery ||
      value.toLowerCase().includes(context.searchQuery.toLowerCase());

  const isSelected = isMultiSelect(contextValue)
    ? contextValue.some((v) => v?.value === value)
    : contextValue?.value === value;

  const handleSelection = (event: Event | React.KeyboardEvent) => {
    // Don't do anything if the key isn't a selection key
    const keyboardEvent = event as React.KeyboardEvent;
    if (keyboardEvent.key && !SELECT_KEYS.includes(keyboardEvent.key)) return;

    // Don't bubble up the event
    event.stopPropagation();
    event.preventDefault();

    if (context.closeOnSelect === true) {
      context.setOpen(false);
    }

    if (onSelect) {
      // Need to convert to non keyboard type event
      // since onSelect is expecting a mouse event
      // and we've handled the keyboard event already
      const onSelectEvent = event as unknown as Event;
      return onSelect(onSelectEvent);
    }

    if (isSingleSelect(contextValue)) {
      const onValueChange =
        context.onValueChange as SingleSelect["onValueChange"];
      onValueChange?.({ value, label });
    } else if (isMultiSelect(contextValue)) {
      const onValueChange =
        context.onValueChange as MultiSelect["onValueChange"];

      const newValue = isSelected
        ? contextValue.filter((v) => v?.value !== value)
        : [...contextValue, { value, label }];

      onValueChange?.(newValue);
    }

    context.triggerRef?.current?.focus();
  };

  if (isVisible) {
    return (
      <TelegraphMenu.Button
        type="button"
        onSelect={handleSelection}
        onKeyDown={handleSelection}
        // Force null if selected equals null so we
        // can override the icon of the button
        selected={selected === null ? null : selected ?? isSelected}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        // Accessibility attributes
        role="option"
        aria-selected={isSelected ? "true" : "false"}
        // Custom attributes
        data-tgph-combobox-option
        data-tgph-combobox-option-focused={isFocused}
        data-tgph-combobox-option-value={value}
        data-tgph-combobox-option-label={label}
        {...props}
      >
        {label || value}
      </TelegraphMenu.Button>
    );
  }
};

type SearchProps = TgphComponentProps<typeof TelegraphInput> & {
  label?: string;
};

const Search = ({
  label = "Search",
  placeholder = "Search",
  tgphRef,
  value: controlledValueProp,
  onValueChange: onValueChangeProp,
  ...props
}: SearchProps) => {
  const id = React.useId();
  const context = React.useContext(ComboboxContext);
  const composedRef = useComposedRefs(tgphRef, context.searchRef);

  const value = controlledValueProp ?? context.searchQuery;
  const onValueChange = onValueChangeProp ?? context.setSearchQuery;

  React.useEffect(() => {
    const handleSearchKeyDown = (event: KeyboardEvent) => {
      if (FIRST_KEYS.includes(event.key)) {
        context.contentRef?.current?.focus({ preventScroll: true });
      }

      if (event.key === "Escape") {
        context.setOpen(false);
      }

      event.stopPropagation();
    };

    const searchInput = context.searchRef?.current;

    if (searchInput) {
      searchInput.addEventListener("keydown", handleSearchKeyDown);
      return () => {
        searchInput.removeEventListener("keydown", handleSearchKeyDown);
      };
    }
  }, [context]);

  return (
    <Box borderBottom="px" px="1" pb="1">
      <VisuallyHidden.Root>
        <Text as="label" htmlFor={id}>
          {label}
        </Text>
      </VisuallyHidden.Root>
      <TelegraphInput
        id={id}
        variant="ghost"
        placeholder={placeholder}
        value={value}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          onValueChange(event.target.value);
        }}
        LeadingComponent={<Icon icon={Lucide.Search} alt="Search Icon" />}
        TrailingComponent={
          context?.searchQuery && context?.searchQuery?.length > 0 ? (
            <TelegraphButton
              as={motion.button}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, type: "spring", bounce: 0 }}
              variant="ghost"
              color="gray"
              icon={{ icon: Lucide.X, alt: "Clear Search Query" }}
              onClick={() => context.setSearchQuery?.("")}
            />
          ) : null
        }
        autoFocus
        data-tgph-combobox-search
        aria-controls={context.contentId}
        {...props}
        tgphRef={composedRef}
      />
    </Box>
  );
};

type EmptyProps<T extends TgphElement> = TgphComponentProps<typeof Stack<T>> & {
  icon?: TgphComponentProps<typeof Icon> | null;
  message?: string | null;
};

const Empty = <T extends TgphElement>({
  icon = { icon: Lucide.Search, alt: "Search Icon" },
  message = "No results found",
  children,
  ...props
}: EmptyProps<T>) => {
  const context = React.useContext(ComboboxContext);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const options = context.contentRef?.current?.querySelectorAll(
      "[data-tgph-combobox-option]",
    );

    if (options?.length === 0) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [context.searchQuery, context.contentRef, children]);

  if (isVisible) {
    return (
      <Stack
        as={motion.div}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, type: "spring", bounce: 0 }}
        gap="1"
        align="center"
        justify="center"
        w="full"
        my="8"
        data-tgph-combobox-empty
        {...props}
      >
        {icon === null ? <></> : <Icon {...icon} />}
        {message === null ? <></> : <Text as="span">{message}</Text>}
      </Stack>
    );
  }
};

type CreateProps<T extends TgphElement> = TgphComponentProps<
  typeof TelegraphMenu.Button<T>
> & {
  leadingText?: string;
  values?: Array<Option>;
  onCreate?: (value: DefinedOption) => void;
};

const Create = <T extends TgphElement>({
  leadingText = "Create",
  values,
  onCreate,
  selected = null,
  ...props
}: CreateProps<T>) => {
  const context = React.useContext(ComboboxContext);

  const variableAlreadyExists = React.useCallback(
    (searchQuery: string | undefined) => {
      if (!values || values?.length === 0) return false;
      return values.some((v) => v?.value === searchQuery);
    },
    [values],
  );

  if (context.searchQuery && !variableAlreadyExists(context.searchQuery)) {
    return (
      <Option
        leadingIcon={{ icon: Lucide.Plus, "aria-hidden": true }}
        mx="1"
        value={context.searchQuery}
        label={`${leadingText} "${context.searchQuery}"`}
        selected={selected}
        onSelect={() => {
          if (onCreate && context.value && context.searchQuery) {
            if (isSingleSelect(context.value)) {
              onCreate({ value: context.searchQuery });
            }

            if (isMultiSelect(context.value)) {
              onCreate({ value: context.searchQuery });
            }

            context.setSearchQuery?.("");
          }
        }}
        {...props}
      />
    );
  }
};

const Combobox = {} as {
  Root: typeof Root;
  Trigger: typeof Trigger;
  Content: typeof Content;
  Options: typeof Options;
  Option: typeof Option;
  Search: typeof Search;
  Empty: typeof Empty;
  Create: typeof Create;
};

Object.assign(Combobox, {
  Root,
  Trigger,
  Content,
  Options,
  Option,
  Search,
  Empty,
  Create,
});

export { Combobox };
