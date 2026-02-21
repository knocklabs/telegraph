import { DismissableLayer } from "@radix-ui/react-dismissable-layer";
import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Button as TelegraphButton } from "@telegraph/button";
import { useComposedRefs } from "@telegraph/compose-refs";
import {
  type RemappedOmit,
  type TgphComponentProps,
  type TgphElement,
} from "@telegraph/helpers";
import { Icon } from "@telegraph/icon";
import { Input as TelegraphInput } from "@telegraph/input";
import { Box, Stack } from "@telegraph/layout";
import { Menu as TelegraphMenu, MenuItem } from "@telegraph/menu";
import { Text } from "@telegraph/typography";
import { Plus, Search as SearchIcon, X } from "lucide-react";
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

const setRef = <T,>(ref: React.Ref<T> | undefined, value: T) => {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref && "current" in ref) {
    (ref as React.MutableRefObject<T>).current = value;
  }
};

type LayoutValue<O> = O extends DefinedOption | string | undefined
  ? never
  : "truncate" | "wrap";

export type RootProps<
  O extends (Option | Array<Option>) | (string | Array<string>),
  LB extends boolean,
> = {
  value?: O;
  defaultValue?: O;
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
  /**
   * The value to scroll to when the combobox opens, if no value is selected.
   * Useful for long lists where you want to start at a specific position.
   */
  defaultScrollToValue?: string;
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
    triggerRef?: React.RefObject<HTMLButtonElement>;
    searchRef?: React.RefObject<HTMLInputElement>;
    contentRef?: React.RefObject<HTMLDivElement>;
    options: Array<DefinedOption>;
    legacyBehavior: boolean;
    defaultScrollToValue?: string;
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
  value: valueProp,
  defaultValue: defaultValueProp,
  onValueChange: onValueChangeProp,
  errored,
  placeholder,
  layout,
  defaultScrollToValue,
  children,
  ...props
}: RootProps<O, LB>) => {
  const contentId = React.useId();
  const triggerId = React.useId();
  const triggerRef = React.useRef<HTMLButtonElement>(null);
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

  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValueProp as O,
    onChange: onValueChangeProp as (value: O) => void,
  });

  const isMultipleSelectValue = React.useMemo(() => {
    return (
      Array.isArray(value) ||
      Array.isArray(valueProp) ||
      Array.isArray(defaultValueProp)
    );
  }, [defaultValueProp, value, valueProp]);

  const handleBaseOpenChange = React.useCallback(
    (
      nextOpen: boolean,
      eventDetails?: {
        reason?: string;
      },
    ) => {
      const isCloseFromSelection =
        nextOpen === false && eventDetails?.reason === "item-press";

      if (closeOnSelect === false && isCloseFromSelection) {
        return;
      }

      setOpen(nextOpen);
    },
    [closeOnSelect, setOpen],
  );

  const handleBaseValueChange = React.useCallback(
    (nextValue: unknown) => {
      const normalizedValue = isMultipleSelectValue
        ? ((Array.isArray(nextValue) ? nextValue : []) as O)
        : ((nextValue === null ? undefined : nextValue) as O);

      setValue(normalizedValue);

      if (closeOnSelect) {
        setOpen(false);
      }
    },
    [closeOnSelect, isMultipleSelectValue, setOpen, setValue],
  );

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
        onValueChange: setValue as (value: Option | Array<Option>) => void,
        placeholder,
        open,
        setOpen,
        onOpenToggle,
        closeOnSelect,
        clearable,
        disabled,
        searchQuery,
        setSearchQuery,
        triggerRef: triggerRef as React.RefObject<HTMLButtonElement>,
        searchRef: searchRef as React.RefObject<HTMLInputElement>,
        contentRef: contentRef as React.RefObject<HTMLDivElement>,
        errored,
        layout,
        options,
        legacyBehavior,
        defaultScrollToValue,
      }}
    >
      <BaseCombobox.Root
        open={open}
        onOpenChange={handleBaseOpenChange}
        value={
          isMultipleSelectValue
            ? ((Array.isArray(value) ? value : []) as Array<Option>)
            : ((value ?? null) as Option | null)
        }
        onValueChange={handleBaseValueChange}
        multiple={isMultipleSelectValue}
        modal={modal && false}
        disabled={disabled}
        isItemEqualToValue={
          legacyBehavior
            ? (itemValue: unknown, selectedValue: unknown) =>
                getValueFromOption(itemValue as Option, true) ===
                getValueFromOption(selectedValue as Option, true)
            : undefined
        }
        itemToStringValue={
          legacyBehavior
            ? (itemValue: unknown) =>
                getValueFromOption(itemValue as Option, true) || ""
            : undefined
        }
        itemToStringLabel={
          legacyBehavior
            ? (itemValue: unknown) => {
                const option = itemValue as DefinedOption;
                if (typeof option?.label === "string") {
                  return option.label;
                }
                return option?.value || "";
              }
            : undefined
        }
        {...props}
      >
        {children}
      </BaseCombobox.Root>
    </ComboboxContext.Provider>
  );
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

export type TriggerProps<V extends ChildrenValue> = TriggerBaseProps & {
  placeholder?: string;
  children?:
    | React.ReactNode
    | ((props: { value: ChildrenFnValue<V> }) => React.ReactNode);
};

const Trigger = <V extends ChildrenValue>({
  size = "1",
  children,
  tgphRef,
  onClick: onClickProp,
  onKeyDown: onKeyDownProp,
  disabled: _disabled,
  ...props
}: TriggerProps<V>) => {
  const context = React.useContext(ComboboxContext);
  const hasTags = isMultiSelect(context.value) && context.value.length > 0;
  const composedTriggerRef = useComposedRefs(tgphRef, context.triggerRef);

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
    <BaseCombobox.Trigger
      ref={composedTriggerRef as React.Ref<HTMLButtonElement>}
      id={context.triggerId}
      type="button"
      style={{
        all: "unset",
        width: "100%",
        display: "block",
      }}
      onClick={(event) => {
        onClickProp?.(event as React.MouseEvent<HTMLButtonElement>);
      }}
      onKeyDown={(event) => {
        // If the event target isn't exactly the trigger we don't want anything to
        // happen within this event handler. For example, if the `X` icon on a trigger
        // tag is focused and the user presses `Enter`, this keydown event will trigger.
        if (event.target !== context.triggerRef?.current) return;

        if (event.key === "Tab") {
          event.stopPropagation();
          onKeyDownProp?.(event as React.KeyboardEvent<HTMLButtonElement>);
          return;
        }

        if (context.open && event.key === "ArrowDown") {
          const options = context.contentRef?.current?.querySelectorAll(
            "[data-tgph-combobox-option]",
          );
          const firstOption = options?.[0] as HTMLElement | undefined;
          if (firstOption) {
            event.stopPropagation();
            event.preventDefault();
            firstOption.focus();
            return;
          }
        }

        if (context.open && LAST_KEYS.includes(event.key)) {
          const options = context.contentRef?.current?.querySelectorAll(
            "[data-tgph-combobox-option]",
          );
          const lastOption = options?.[options.length - 1] as
            | HTMLElement
            | undefined;
          if (lastOption) {
            event.stopPropagation();
            event.preventDefault();
            lastOption.focus();
            return;
          }
        }

        if (
          context.open &&
          event.key.length === 1 &&
          !event.altKey &&
          !event.ctrlKey &&
          !event.metaKey
        ) {
          const options = context.contentRef?.current?.querySelectorAll(
            "[data-tgph-combobox-option]",
          );
          const match = Array.from(options || []).find((option) =>
            option.textContent
              ?.trim()
              .toLowerCase()
              .startsWith(event.key.toLowerCase()),
          ) as HTMLElement | undefined;

          if (match) {
            event.stopPropagation();
            event.preventDefault();
            match.focus();
            return;
          }
        }

        onKeyDownProp?.(event as React.KeyboardEvent<HTMLButtonElement>);
      }}
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
    >
      <TelegraphButton.Root
        as="span"
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
        {...props}
      >
        {children ? (
          typeof children === "function" ? (
            children({ value: currentValue as ChildrenFnValue<V> })
          ) : (
            children
          )
        ) : (
          <>
            <Primitives.TriggerValue />
            <Primitives.TriggerActionsContainer>
              <Primitives.TriggerClear />
              <Primitives.TriggerIndicator />
            </Primitives.TriggerActionsContainer>
          </>
        )}
      </TelegraphButton.Root>
    </BaseCombobox.Trigger>
  );
};

export type ContentProps<T extends TgphElement = "div"> = TgphComponentProps<
  typeof TelegraphMenu.Content<T>
>;

const Content = <T extends TgphElement = "div">({
  style,
  children,
  tgphRef,
  onKeyDown: onKeyDownProp,
  ...props
}: ContentProps<T>) => {
  const context = React.useContext(ComboboxContext);
  const popupRef = useComposedRefs<unknown>(tgphRef);

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

  React.useEffect(() => {
    if (!context.open) return;

    const focusGuards = document.querySelectorAll("[data-base-ui-focus-guard]");
    focusGuards.forEach((focusGuard) => {
      if (!focusGuard.getAttribute("aria-label")) {
        focusGuard.setAttribute("aria-label", "Focus guard");
      }
    });
  }, [context.open]);

  return (
    <BaseCombobox.Portal>
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
        <BaseCombobox.Positioner sideOffset={4}>
          <BaseCombobox.Popup
            className="tgph"
            initialFocus={false}
            finalFocus={context.triggerRef}
            style={{
              width: "var(--tgph-combobox-trigger-width)",
              transition: "min-height 200ms ease-in-out",
              minHeight: height ? `${height}px` : "0",
              ...style,
              ...{
                "--tgph-combobox-content-transform-origin":
                  "var(--transform-origin)",
                "--tgph-combobox-content-available-width":
                  "var(--available-width)",
                "--tgph-combobox-content-available-height":
                  "calc(var(--available-height) - var(--tgph-spacing-8))",
                "--tgph-combobox-trigger-width": "var(--anchor-width)",
                "--tgph-combobox-trigger-height": "var(--anchor-height)",
              },
            }}
            {...(props as React.ComponentProps<typeof BaseCombobox.Popup>)}
            ref={popupRef as React.Ref<HTMLDivElement>}
            data-tgph-combobox-content
            data-tgph-combobox-content-open={context.open}
            onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
              // Don't allow the event to bubble up outside of the menu
              event.stopPropagation();
              onKeyDownProp?.(event as React.KeyboardEvent<HTMLElement>);

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
            <Stack bg="surface-1" direction="column" gap="1" tgphRef={internalContentRef}>
              {children}
            </Stack>
          </BaseCombobox.Popup>
        </BaseCombobox.Positioner>
      </DismissableLayer>
    </BaseCombobox.Portal>
  );
};

export type OptionsProps<T extends TgphElement = "div"> = TgphComponentProps<
  typeof Stack<T>
>;

const Options = <T extends TgphElement = "div">({
  tgphRef,
  children,
  ...props
}: OptionsProps<T>) => {
  const context = React.useContext(ComboboxContext);
  const optionsRef = React.useRef<HTMLDivElement>(null);
  const composedRef = useComposedRefs<unknown>(
    tgphRef,
    optionsRef,
    context.contentRef,
  );

  // Scroll to the selected option (or defaultScrollToValue) when the combobox opens
  React.useEffect(() => {
    if (context.open && optionsRef.current) {
      // Small delay to ensure the DOM has rendered
      requestAnimationFrame(() => {
        const selectedValue = isSingleSelect(context.value)
          ? getValueFromOption(context.value, context.legacyBehavior)
          : isMultiSelect(context.value) && context.value.length > 0
            ? getValueFromOption(context.value[0], context.legacyBehavior)
            : null;

        // Use selected value if available, otherwise fall back to defaultScrollToValue
        const valueToScrollTo = selectedValue ?? context.defaultScrollToValue;

        if (valueToScrollTo) {
          // Find the target option by iterating through elements rather than
          // using querySelector with string interpolation, which would fail
          // if the value contains special characters like quotes or brackets
          const options = optionsRef.current?.querySelectorAll(
            "[data-tgph-combobox-option]",
          );
          const targetOption = Array.from(options || []).find(
            (el) =>
              el.getAttribute("data-tgph-combobox-option-value") ===
              valueToScrollTo,
          );

          // Check if scrollIntoView is available (not available in jsdom)
          if (
            targetOption &&
            typeof targetOption.scrollIntoView === "function"
          ) {
            targetOption.scrollIntoView({ block: "center" });
          }
        }
      });
    }
  }, [
    context.open,
    context.value,
    context.legacyBehavior,
    context.defaultScrollToValue,
  ]);

  return (
    <BaseCombobox.List
      id={context.contentId}
      // Accessibility attributes
      role="listbox"
      tabIndex={-1}
      ref={composedRef as React.Ref<HTMLDivElement>}
      style={
        {
          overflowY: "auto",
          // maxHeight defaults to available height - padding from edge of screen
          "--max-height": !props.maxHeight
            ? "calc(var(--tgph-combobox-content-available-height) - var(--tgph-spacing-12))"
            : undefined,
        } as React.CSSProperties
      }
    >
      <Stack direction="column" gap="1" {...props}>
        {children}
      </Stack>
    </BaseCombobox.List>
  );
};

export type OptionProps<T extends TgphElement = "button"> = TgphComponentProps<
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
  onClick: onClickProp,
  onKeyDown: onKeyDownProp,
  disabled: disabledProp,
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

  const handleSelection = (
    event:
      | (React.MouseEvent<HTMLDivElement> & {
          preventBaseUIHandler?: () => void;
        })
      | (React.KeyboardEvent<HTMLDivElement> & {
          preventBaseUIHandler?: () => void;
        }),
  ) => {
    if (disabledProp) return;

    // Don't allow the event to bubble up outside of the menu
    event.stopPropagation();

    // Don't do anything if the key isn't a selection key
    const keyboardEvent = event as React.KeyboardEvent<HTMLDivElement>;
    if (keyboardEvent.key && !SELECT_KEYS.includes(keyboardEvent.key)) {
      onKeyDownProp?.(event as unknown as React.KeyboardEvent<HTMLButtonElement>);
      return;
    }

    // Prevent Base UI's default item selection so we can preserve
    // the existing Combobox value semantics (including legacy mode).
    event.preventBaseUIHandler?.();
    event.preventDefault();

    if (context.closeOnSelect === true) {
      context.setOpen(false);
    }

    onClickProp?.(event as unknown as React.MouseEvent<HTMLButtonElement>);

    if (onSelect) {
      onSelect(event.nativeEvent as Event);
      context.triggerRef?.current?.focus();
      return;
    }

    if (isSingleSelect(contextValue)) {
      const onValueChange = context.onValueChange as SingleSelect["onValueChange"];

      // TODO: Remove this once { value, label } option is deprecated
      if (context.legacyBehavior === true) {
        onValueChange?.({ value, label });
      } else {
        onValueChange?.(value);
      }
    } else if (isMultiSelect(contextValue)) {
      const onValueChange = context.onValueChange as MultiSelect["onValueChange"];
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

  if (!isVisible) return null;

  return (
    <BaseCombobox.Item
      value={context.legacyBehavior === true ? { value, label } : value}
      disabled={disabledProp}
      nativeButton={false}
      tabIndex={-1}
      onClick={handleSelection}
      onKeyDown={handleSelection}
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
    >
      <MenuItem
        as="span"
        // Force null if selected equals null so we
        // can override the icon of the button
        selected={selected === null ? null : (selected ?? isSelected)}
        {...(props as TgphComponentProps<typeof MenuItem<"span">>)}
      >
        {label || children || value}
      </MenuItem>
    </BaseCombobox.Item>
  );
};

export type SearchProps = TgphComponentProps<typeof TelegraphInput> & {
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
        const options = context.contentRef?.current?.querySelectorAll(
          "[data-tgph-combobox-option]",
        );
        const firstOption = options?.[0] as HTMLElement | undefined;
        if (firstOption) {
          event.preventDefault();
          firstOption.focus({ preventScroll: true });
        }
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

  React.useEffect(() => {
    if (!context.open) return;

    requestAnimationFrame(() => {
      context.searchRef?.current?.focus();
    });
  }, [context.open, context.searchRef]);

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
        autoFocus={context.open}
        data-tgph-combobox-search
        aria-controls={context.contentId}
        {...props}
        tgphRef={composedRef}
      />
    </Box>
  );
};

export type EmptyProps<T extends TgphElement = "div"> = TgphComponentProps<
  typeof Stack<T>
> & {
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

export type CreateProps<
  T extends TgphElement = "button",
  LB extends boolean = false,
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
