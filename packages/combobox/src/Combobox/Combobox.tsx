import { DismissableLayer } from "@radix-ui/react-dismissable-layer";
import * as Portal from "@radix-ui/react-portal";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Button as TelegraphButton } from "@telegraph/button";
import { useComposedRefs } from "@telegraph/compose-refs";
import {
  RefToTgphRef,
  type RemappedOmit,
  type TgphComponentProps,
  type TgphElement,
} from "@telegraph/helpers";
import { Icon } from "@telegraph/icon";
import { Input as TelegraphInput } from "@telegraph/input";
import { Box, Stack } from "@telegraph/layout";
import { Menu as TelegraphMenu } from "@telegraph/menu";
import { Text } from "@telegraph/typography";
import { Plus, Search as SearchIcon, X } from "lucide-react";
import { LazyMotion, domAnimation } from "motion/react";
import React from "react";

import { TRIGGER_MIN_HEIGHT } from "./Combobox.constants";
import {
  doesOptionMatchSearchQuery,
  getCurrentOption,
  getOptions,
  getValueFromOption,
  isMultiSelect,
  isSingleSelect,
} from "./Combobox.helpers";
import { Primitives } from "./Combobox.primitives";
import type {
  DefinedOption,
  MultiSelect,
  Option,
  SingleSelect,
} from "./Combobox.types";

const FIRST_KEYS = ["ArrowDown", "PageUp", "Home"];
const LAST_KEYS = ["ArrowUp", "PageDown", "End"];
const SELECT_KEYS = ["Enter", " "];

type LayoutValue<O> = O extends DefinedOption | string | undefined
  ? never
  : "truncate" | "wrap";

type RootProps<
  O extends (Option | Array<Option>) | (string | Array<string>),
  LB extends boolean,
> = {
  value?: O;
  onValueChange?: (value: O) => void;
  layout?: LayoutValue<O>;
  open?: boolean;
  defaultOpen?: boolean;
  errored?: boolean;
  placeholder?: string;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  closeOnSelect?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  legacyBehavior?: LB;
  children?: React.ReactNode;
};

export const ComboboxContext = React.createContext<
  Omit<
    RootProps<(Option | Array<Option>) | (string | Array<string>), boolean>,
    "children"
  > & {
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
    options: Array<DefinedOption>;
    legacyBehavior: boolean;
  }
>({
  value: undefined,
  onValueChange: () => {},
  contentId: "",
  triggerId: "",
  open: false,
  setOpen: () => {},
  onOpenToggle: () => {},
  clearable: false,
  disabled: false,
  options: [],
  legacyBehavior: false,
});

const Root = <
  O extends (Option | Array<Option>) | (string | Array<string>),
  LB extends boolean,
>({
  modal = true,
  closeOnSelect = true,
  clearable = false,
  disabled = false,
  legacyBehavior = false as LB,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  defaultOpen: defaultOpenProp,
  value,
  onValueChange,
  errored,
  placeholder,
  layout,
  children,
  ...props
}: RootProps<O, LB>) => {
  const contentId = React.useId();
  const triggerId = React.useId();
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const options = React.useMemo(() => {
    return getOptions(children);
  }, [children]);

  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpenProp ?? false,
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
        // Need to cast this to avoid type errors
        // because the type of onValueChange is not
        // consistent with the value type
        onValueChange: onValueChange as (value: Option | Array<Option>) => void,
        placeholder,
        open,
        setOpen,
        onOpenToggle,
        closeOnSelect,
        clearable,
        disabled,
        searchQuery,
        setSearchQuery,
        triggerRef: triggerRef as React.RefObject<HTMLDivElement>,
        searchRef: searchRef as React.RefObject<HTMLInputElement>,
        contentRef: contentRef as React.RefObject<HTMLDivElement>,
        errored,
        layout,
        options,
        legacyBehavior,
      }}
    >
      <TelegraphMenu.Root
        open={open}
        onOpenChange={setOpen}
        modal={modal}
        {...props}
      >
        {children}
      </TelegraphMenu.Root>
    </ComboboxContext.Provider>
  );
};

const TriggerValue = () => {
  const context = React.useContext(ComboboxContext);

  if (context.value && isMultiSelect(context.value)) {
    const layout = context.layout || "truncate";

    if (context.value.length === 0) {
      return <Primitives.TriggerPlaceholder />;
    }

    return (
      <LazyMotion features={domAnimation}>
        <Primitives.TriggerTagsContainer>
          {context.value.map((v, i) => {
            const value = getValueFromOption(v, context.legacyBehavior);
            if (
              value &&
              ((layout === "truncate" && i <= 1) || layout === "wrap")
            ) {
              return (
                <RefToTgphRef key={value}>
                  <Primitives.TriggerTag.Default value={value} />
                </RefToTgphRef>
              );
            }
          })}
        </Primitives.TriggerTagsContainer>
      </LazyMotion>
    );
  }

  if (context && isSingleSelect(context.value)) {
    if (!context.value) {
      return <Primitives.TriggerPlaceholder />;
    }
    return <Primitives.TriggerText />;
  }
};

type ChildrenValue = string | Array<string> | never;

// When utilizing the `children` prop as a function, we need to infer the type of the value
// to ensure that the value is always defined. We do this via the generic `V` passed through
// to the `Trigger` component. This is expected to be `typeof value`.
type ChildrenFnValue<V extends ChildrenValue> = V extends never
  ? never
  : V extends string
    ? DefinedOption | undefined
    : Array<DefinedOption>;

type TriggerBaseProps = RemappedOmit<
  TgphComponentProps<typeof TelegraphButton.Root> &
    TgphComponentProps<typeof TelegraphMenu.Trigger>,
  "children"
>;

type TriggerProps<V extends ChildrenValue> = TriggerBaseProps & {
  placeholder?: string;
  children?:
    | React.ReactNode
    | ((props: { value: ChildrenFnValue<V> }) => React.ReactNode);
};

const Trigger = <V extends ChildrenValue>({
  size = "1",
  children,
  ...props
}: TriggerProps<V>) => {
  const context = React.useContext(ComboboxContext);
  const hasTags = isMultiSelect(context.value) && context.value.length > 0;

  const currentValue = React.useMemo<
    DefinedOption | Array<DefinedOption | undefined> | undefined
  >(() => {
    if (!context.value) return undefined;
    if (isSingleSelect(context.value)) {
      return getCurrentOption(
        context.value,
        context.options,
        context.legacyBehavior,
      );
    }
    if (isMultiSelect(context.value)) {
      return context.value.map((v) =>
        getCurrentOption(v, context.options, context.legacyBehavior),
      );
    }
    return undefined;
  }, [context.value, context.options, context.legacyBehavior]);

  const getAriaLabelString = React.useCallback(() => {
    if (!currentValue) return context.placeholder;
    if (isSingleSelect(currentValue)) {
      return currentValue?.label || currentValue?.value || context.placeholder;
    }
    if (isMultiSelect(currentValue)) {
      return (
        currentValue.map((v) => v?.label || v?.value).join(", ") ||
        context.placeholder
      );
    }

    return context.placeholder;
  }, [currentValue, context.placeholder]);

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
          // Don't allow the event to bubble up outside of the menu
          event.stopPropagation();
          event.preventDefault();
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
        py="0_5"
        pr="1_5"
        pl={hasTags ? "0_5" : "1_5"}
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
        data-tgph-combobox-trigger-open={context.open}
        disabled={context.disabled}
        {...props}
      >
        {children ? (
          typeof children === "function" ? (
            children({ value: currentValue as ChildrenFnValue<V> })
          ) : (
            children
          )
        ) : (
          <TriggerValue />
        )}
        <Stack align="center" gap="1">
          <Primitives.TriggerClear />
          <Primitives.TriggerIndicator />
        </Stack>
      </TelegraphButton.Root>
    </TelegraphMenu.Trigger>
  );
};

type ContentProps<T extends TgphElement> = TgphComponentProps<
  typeof TelegraphMenu.Content<T>
>;

const Content = <T extends TgphElement>({
  style,
  children,
  tgphRef,
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
      const rect = element?.getBoundingClientRect();
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

  // On open, set the height of the content after the animation completes
  // we add a timeout here to ensure that the DOM element has responded to
  // the state changes first
  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (context.open) {
      timeout = setTimeout(() => {
        setHeightFromContent(internalContentRef.current as unknown as Element);
      }, 10);
    }

    return () => timeout && clearTimeout(timeout);
  }, [context.open, setHeightFromContent]);

  return (
    <Portal.Root asChild>
      {/* 
        We add radix's dismissable layer here so that we can swallow any escape
        key presses to prevent cases like a modal closing when we close the
        combobox 
      */}
      <DismissableLayer
        onEscapeKeyDown={(event) => {
          if (context.open) {
            // Don't allow the event to bubble up outside of the menu
            event.stopPropagation();
            event.preventDefault();
            context.setOpen(false);
          }
        }}
      >
        <TelegraphMenu.Content
          className="tgph"
          mt="1"
          onCloseAutoFocus={(event: Event) => {
            if (!hasInteractedOutside.current) {
              context.triggerRef?.current?.focus();
            }

            hasInteractedOutside.current = false;

            event.preventDefault();
          }}
          bg="surface-1"
          style={{
            width: "var(--tgph-combobox-trigger-width)",
            transition: "min-height 200ms ease-in-out",
            minHeight: height ? `${height}px` : "0",
            ...style,
            ...{
              "--tgph-combobox-content-transform-origin":
                "var(--radix-popper-transform-origin)",
              "--tgph-combobox-content-available-width":
                "var(--radix-popper-available-width)",
              "--tgph-combobox-content-available-height":
                "calc(var(--radix-popper-available-height) - var(--tgph-spacing-8))",
              "--tgph-combobox-trigger-width":
                "var(--radix-popper-anchor-width)",
              "--tgph-combobox-trigger-height":
                "var(--radix-popper-anchor-height)",
            },
          }}
          {...props}
          tgphRef={composedRef}
          data-tgph-combobox-content
          data-tgph-combobox-content-open={context.open}
          // Cancel out accessibility attirbutes related to aria menu
          role={undefined}
          aria-orientation={undefined}
          onKeyDown={(event: React.KeyboardEvent) => {
            // Don't allow the event to bubble up outside of the menu
            event.stopPropagation();

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
          }}
        >
          <Stack direction="column" gap="1" tgphRef={internalContentRef}>
            {children}
          </Stack>
        </TelegraphMenu.Content>
      </DismissableLayer>
    </Portal.Root>
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
        // maxHeight defaults to available height - padding from edge of screen
        "--max-height": !props.maxHeight
          ? "calc(var(--tgph-combobox-content-available-height) - var(--tgph-spacing-12))"
          : undefined,
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
  value: DefinedOption["value"];
  label?: DefinedOption["label"];
  selected?: boolean | null;
};

const Option = <T extends TgphElement>({
  value,
  label,
  selected,
  onSelect,
  children,
  ...props
}: OptionProps<T>) => {
  const context = React.useContext(ComboboxContext);
  const [isFocused, setIsFocused] = React.useState(false);
  const contextValue = context.value;

  const isVisible =
    !context.searchQuery ||
    doesOptionMatchSearchQuery({
      children: label || children,
      value,
      searchQuery: context.searchQuery,
    });

  const isSelected = isMultiSelect(contextValue)
    ? contextValue.some(
        (v) => getValueFromOption(v, context.legacyBehavior) === value,
      )
    : getValueFromOption(contextValue, context.legacyBehavior) === value;

  const handleSelection = (event: Event | React.KeyboardEvent) => {
    // Don't allow the event to bubble up outside of the menu
    event.stopPropagation();

    // Don't do anything if the key isn't a selection key
    const keyboardEvent = event as React.KeyboardEvent;
    if (keyboardEvent.key && !SELECT_KEYS.includes(keyboardEvent.key)) return;

    // Don't bubble up the event
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

      // TODO: Remove this once { value, label } option is deprecated
      if (context.legacyBehavior === true) {
        onValueChange?.({ value, label });
      } else {
        onValueChange?.(value);
      }
    } else if (isMultiSelect(contextValue)) {
      const onValueChange =
        context.onValueChange as MultiSelect["onValueChange"];
      const contextValue = context.value as Array<Option>;

      const newValue = isSelected
        ? contextValue.filter(
            (v) => getValueFromOption(v, context.legacyBehavior) !== value,
          )
        : [
            ...contextValue,
            // TODO: Remove this once { value, label } option is deprecated
            context.legacyBehavior === true ? { value, label } : value,
          ];

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
        selected={selected === null ? null : (selected ?? isSelected)}
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
        {label || children || value}
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
        LeadingComponent={<Icon icon={SearchIcon} alt="Search Icon" />}
        TrailingComponent={
          context?.searchQuery && context?.searchQuery?.length > 0 ? (
            <TelegraphButton
              variant="ghost"
              color="gray"
              icon={{ icon: X, alt: "Clear Search Query" }}
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
  icon = { icon: SearchIcon, alt: "Search Icon" },
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

type CreateProps<
  T extends TgphElement,
  LB extends boolean,
> = TgphComponentProps<typeof TelegraphMenu.Button<T>> & {
  leadingText?: string;
} & (LB extends true
    ? {
        values: Array<DefinedOption>;
        onCreate: (value: { value: string; label?: string }) => void;
        legacyBehavior: true;
      }
    : {
        values?: Array<string>;
        onCreate?: (value: string) => void;
        legacyBehavior?: false;
      });

const Create = <T extends TgphElement, LB extends boolean>({
  leadingText = "Create",
  values,
  onCreate,
  selected = null,
  legacyBehavior = false as LB,
  ...props
}: CreateProps<T, LB>) => {
  const context = React.useContext(ComboboxContext);

  const variableAlreadyExists = React.useCallback(
    (searchQuery: string | undefined) => {
      if (!values || values?.length === 0) return false;
      return values.some(
        (v) => getValueFromOption(v, legacyBehavior) === searchQuery,
      );
    },
    [values, legacyBehavior],
  );

  if (context.searchQuery && !variableAlreadyExists(context.searchQuery)) {
    return (
      <Option
        leadingIcon={{ icon: Plus, "aria-hidden": true }}
        mx="1"
        value={context.searchQuery}
        label={`${leadingText} "${context.searchQuery}"`}
        selected={selected}
        onSelect={() => {
          if (onCreate && context.searchQuery) {
            const value =
              legacyBehavior === true
                ? { value: context.searchQuery }
                : context.searchQuery;

            const create = onCreate as CreateProps<T, LB>["onCreate"];

            create(value);

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
  Primitives: typeof Primitives;
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
  Primitives,
});

export { Combobox };
