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
import { Text } from "@telegraph/typography";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

import { type Option, isMultiSelect, isSingleSelect } from "./Combobox.helpers";

const FIRST_KEYS = ["ArrowDown", "PageUp", "Home"];
const LAST_KEYS = ["ArrowUp", "PageDown", "End"];

type RootProps = (
  | {
      value?: Array<Option>;
      onValueChange?: (value: Array<Option>) => void;
      layout?: "truncate" | "wrap";
    }
  | {
      value?: Option;
      onValueChange?: (value: Option) => void;
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
});

const Root = ({
  modal = true,
  closeOnSelect = true,
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
        as="span"
        role="button"
        icon={{ icon: Lucide.X, alt: `Remove ${value}` }}
        onClick={(event: React.MouseEvent) => {
          const onValueChange = context.onValueChange as (
            v: Array<Option>,
          ) => void;
          const contextValue = context.value as Array<Option>;
          const newValue = contextValue.filter((v) => v.value !== value);
          onValueChange(newValue);
          event.stopPropagation();
        }}
      />
    </Tag.Root>
  );
};

type TriggerValueProps<T extends TgphElement> = {
  size?: TgphComponentProps<typeof TelegraphButton.Root<T>>["size"];
};

const TriggerValue = <T extends TgphElement>({
  size = "1",
}: TriggerValueProps<T>) => {
  const context = React.useContext(ComboboxContext);

  const height = size === "1" ? "6" : size === "2" ? "8" : "10";

  if (context.value && isMultiSelect(context.value)) {
    const contextValue = context.value as Array<Option>;
    const layout = context.layout || "truncate";
    const truncatedLength = contextValue.length - 2;
    const truncatedLengthStringArray = truncatedLength.toString().split("");

    if (contextValue.length === 0) {
      return (
        <Stack h={height} align="center">
          <TelegraphButton.Text color="gray">
            {context.placeholder}
          </TelegraphButton.Text>
        </Stack>
      );
    }

    return (
      <Stack
        gap="1"
        w="full"
        my="1"
        wrap={layout === "wrap" ? "wrap" : "nowrap"}
        align="center"
        style={{
          position: "relative",
          flexGrow: 1,
        }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {contextValue.map((v, i) => {
            if ((layout === "truncate" && i <= 1) || layout === "wrap") {
              return (
                <RefToTgphRef key={v.value}>
                  <TriggerTag {...v} />
                </RefToTgphRef>
              );
            }
          })}
        </AnimatePresence>
        <AnimatePresence>
          {layout === "truncate" && contextValue.length > 2 && (
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
    <Stack h={height} align="center" my="1">
      <TelegraphButton.Text color={!context.value ? "gray" : "default"}>
        {context?.value?.label || context?.value?.value || context.placeholder}
      </TelegraphButton.Text>
    </Stack>
  );
};

type TriggerProps = React.ComponentProps<typeof TelegraphMenu.Anchor> & {
  placeholder?: string;
  size?: TgphComponentProps<typeof TelegraphButton.Root>["size"];
};

const Trigger = ({ size = "1", ...props }: TriggerProps) => {
  const context = React.useContext(ComboboxContext);

  const getAriaLabelString = React.useCallback(() => {
    if (!context.value) return context.placeholder;
    if (isSingleSelect(context.value)) {
      return (
        context.value?.label || context.value?.value || context.placeholder
      );
    } else {
      return (
        context.value?.map((v) => v.label).join(", ") || context.placeholder
      );
    }
  }, [context.value, context.placeholder]);

  return (
    <TelegraphMenu.Anchor
      {...props}
      asChild
      onClick={(event: React.MouseEvent) => {
        event.preventDefault();
        context.onOpenToggle();
        context.triggerRef?.current?.focus();
      }}
      onKeyDown={(event: React.KeyboardEvent) => {
        if (event.key === "ArrowDown") {
          context.onOpenToggle();
        }
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
        }
      }}
      tgphRef={context.triggerRef}
    >
      <RefToTgphRef>
        <TelegraphButton.Root
          id={context.triggerId}
          variant="outline"
          w="full"
          h="full"
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
          <TriggerValue size={size} />
          <TelegraphButton.Icon
            as={motion.div}
            icon={Lucide.ChevronDown}
            animate={{ rotate: context.open ? "180deg" : "0deg" }}
            transition={{ duration: 0.2, type: "spring", bounce: 0 }}
            aria-hidden
          />
        </TelegraphButton.Root>
      </RefToTgphRef>
    </TelegraphMenu.Anchor>
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
        height: height ? `${height}px` : "auto",
      }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 0.2, type: "spring", bounce: 0 }}
      onInteractOutside={() => {
        context.setOpen(false);
        hasInteractedOutside.current = true;
      }}
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
      }}
      style={{
        overflowY: "auto",
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
};

const Option = <T extends TgphElement>({
  value,
  label,
  ...props
}: OptionProps<T>) => {
  const context = React.useContext(ComboboxContext);
  const [isFocused, setIsFocused] = React.useState(false);
  const contextValue = context.value ?? [];

  const isVisible = isMultiSelect(contextValue)
    ? !context.searchQuery || value.includes(context.searchQuery.toLowerCase())
    : !context.searchQuery ||
      value.toLowerCase().includes(context.searchQuery.toLowerCase());

  const isSelected = isMultiSelect(contextValue)
    ? contextValue.some((v) => v.value === value)
    : contextValue.value === value;

  if (isVisible) {
    return (
      <TelegraphMenu.Button
        onSelect={(event: Event) => {
          !context.closeOnSelect && event.preventDefault();

          if (isMultiSelect(contextValue)) {
            const onValueChange = context.onValueChange as (
              v: Array<Option>,
            ) => void;

            const newValue = isSelected
              ? contextValue.filter((v) => v.value !== value)
              : [...contextValue, { value, label }];

            onValueChange(newValue);
          } else if (isSingleSelect(contextValue)) {
            const onValueChange = context.onValueChange as (v: Option) => void;
            onValueChange({ value, label });
          }

          context.triggerRef?.current?.focus();
        }}
        selected={isSelected}
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
  ...props
}: SearchProps) => {
  const id = React.useId();
  const context = React.useContext(ComboboxContext);
  const composedRef = useComposedRefs(tgphRef, context.searchRef);

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
    <Box borderBottom px="1" pb="1">
      <VisuallyHidden.Root>
        <Text as="label" htmlFor={id}>
          {label}
        </Text>
      </VisuallyHidden.Root>
      <TelegraphInput
        id={id}
        variant="ghost"
        placeholder={placeholder}
        value={context.searchQuery}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          context?.setSearchQuery?.(event.target.value);
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

const Combobox = {} as {
  Root: typeof Root;
  Trigger: typeof Trigger;
  Content: typeof Content;
  Options: typeof Options;
  Option: typeof Option;
  Search: typeof Search;
  Empty: typeof Empty;
};

Object.assign(Combobox, {
  Root,
  Trigger,
  Content,
  Options,
  Option,
  Search,
  Empty,
});

export { Combobox };
