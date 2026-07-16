import { Button as TelegraphButton } from "@telegraph/button";
import { useComposedRefs } from "@telegraph/compose-refs";
import {
  type RemappedOmit,
  type TgphComponentProps,
  type TgphElement,
  VisuallyHidden,
  useControllableState,
} from "@telegraph/helpers";
import { Icon } from "@telegraph/icon";
import { Input as TelegraphInput } from "@telegraph/input";
import { Box, Stack } from "@telegraph/layout";
import { Menu as TelegraphMenu } from "@telegraph/menu";
import { Text } from "@telegraph/typography";
import { Plus, Search as SearchIcon, X } from "lucide-react";
import {
  type CSSProperties,
  type ChangeEvent,
  type MouseEvent,
  type ReactElement,
  type KeyboardEvent as ReactKeyboardEvent,
  type KeyboardEventHandler as ReactKeyboardEventHandler,
  type ReactNode,
  type Ref,
  type RefObject,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { TRIGGER_MIN_HEIGHT } from "./Combobox.constants";
import {
  FIRST_KEYS,
  LAST_KEYS,
  SELECT_KEYS,
  doesOptionMatchSearchQuery,
  getCurrentOption,
  getOptionAccessibleLabel,
  getOptions,
  getRenderedSearchText,
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
  // The value to scroll to when the combobox opens if no value is selected.
  // Useful for long lists where you want to start at a specific position.
  defaultScrollToValue?: string;
  children?: ReactNode;
};

export const ComboboxContext = createContext<
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
    triggerRef?: RefObject<HTMLButtonElement>;
    searchRef?: RefObject<HTMLInputElement>;
    contentRef?: RefObject<HTMLDivElement>;
    onEscapeKeyDown?: (event: KeyboardEvent) => void;
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
  const contentId = useId();
  const triggerId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const options = useMemo(() => {
    return getOptions({ children, isOptionElement });
  }, [children]);

  const [searchQuery, setSearchQuery] = useState<string>("");
  // Keep open state controllable like the old menu-backed implementation while
  // still allowing uncontrolled usage through defaultOpen.
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpenProp ?? false,
    onChange: onOpenChangeProp,
  });

  // The selected value can be a string, legacy option object, or array of
  // either; this shared helper preserves that public contract.
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValueProp as O,
    onChange: onValueChangeProp as (value: O) => void,
  });

  const onOpenToggle = useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
  }, [setOpen]);

  useEffect(() => {
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
        // Context consumers handle the runtime single/multi branches below, so
        // expose one setter shape here and narrow it at the selection site.
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
        triggerRef: triggerRef as RefObject<HTMLButtonElement>,
        searchRef: searchRef as RefObject<HTMLInputElement>,
        contentRef: contentRef as RefObject<HTMLDivElement>,
        errored,
        layout,
        options,
        legacyBehavior,
        defaultScrollToValue,
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
  children?: ReactNode | ((props: { value: ChildrenFnValue<V> }) => ReactNode);
};

const Trigger = <V extends ChildrenValue>({
  size = "1",
  children,
  ...props
}: TriggerProps<V>) => {
  const context = useContext(ComboboxContext);
  const hasTags = isMultiSelect(context.value) && context.value.length > 0;

  const currentValue = useMemo<
    DefinedOption | Array<DefinedOption | undefined> | undefined
  >(() => {
    if (!context.value) return undefined;
    if (isSingleSelect(context.value)) {
      // Convert the public selected value back to the option object so custom
      // trigger render functions receive the same shape as before the rewrite.
      return getCurrentOption(
        context.value,
        context.options,
        context.legacyBehavior,
      );
    }
    if (isMultiSelect(context.value)) {
      // Preserve array order from the selected value while resolving each entry
      // against the current option list.
      return context.value.map((v) =>
        getCurrentOption(v, context.options, context.legacyBehavior),
      );
    }
    return undefined;
  }, [context.value, context.options, context.legacyBehavior]);

  const getAriaLabelString = useCallback(() => {
    if (!currentValue) return context.placeholder;
    if (isSingleSelect(currentValue)) {
      // The visible option label may be a React node, so derive a text-only
      // fallback before assigning it to aria-label.
      return getOptionAccessibleLabel(currentValue) || context.placeholder;
    }
    if (isMultiSelect(currentValue)) {
      // Multi-select trigger text is rendered as tags; expose the same selected
      // values as a comma-separated text label for assistive tech.
      return (
        currentValue
          .map((option) => getOptionAccessibleLabel(option))
          .filter(Boolean)
          .join(", ") || context.placeholder
      );
    }

    return context.placeholder;
  }, [currentValue, context.placeholder]);
  return (
    <TelegraphMenu.Trigger
      {...props}
      asChild
      onClick={(event: MouseEvent) => {
        event.preventDefault();
        context.onOpenToggle();
        context.triggerRef?.current?.focus();
      }}
      onKeyDown={(event: ReactKeyboardEvent) => {
        // If the event target isn't exactly the trigger we don't want anything to
        // happen within this event handler. For example, if the `X` icon on a trigger
        // tag is focused and the user presses `Enter`, this keydown event will trigger.
        if (event.target !== context.triggerRef?.current) return;

        // Lets the user tab in and out of the combobox as usual
        if (event.key === "Tab") {
          event.stopPropagation();
          return;
        }

        if (event.key === "Escape") {
          event.stopPropagation();
          event.preventDefault();
          context.setOpen(false);
          context.triggerRef?.current?.focus();
          return;
        }

        // Open the combobox when ArrowDown, Space, or Enter are pressed
        if (event.key === "ArrowDown" || SELECT_KEYS.includes(event.key)) {
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
          <>
            <Primitives.TriggerValue />
            <Primitives.TriggerActionsContainer>
              <Primitives.TriggerClear />
              <Primitives.TriggerIndicator />
            </Primitives.TriggerActionsContainer>
          </>
        )}
      </TelegraphButton.Root>
    </TelegraphMenu.Trigger>
  );
};

export type ContentProps<T extends TgphElement = "div"> = TgphComponentProps<
  typeof TelegraphMenu.Content<T>
>;

const Content = <T extends TgphElement = "div">({
  style,
  children,
  onEscapeKeyDown,
  tgphRef,
  ...props
}: ContentProps<T>) => {
  const context = useContext(ComboboxContext);
  const { open, setOpen, triggerRef } = context;
  const hasInteractedOutside = useRef(false);
  const handledEscapeKeyDownRef = useRef(false);
  const handledEscapeKeyDownTimeoutRef = useRef<number | undefined>(undefined);
  const composedRef = useComposedRefs<unknown>(tgphRef, context.contentRef);

  const internalContentRef = useRef(null);

  const [height, setHeight] = useState(0);
  const [initialAnimationComplete, setInitialAnimationComplete] =
    useState(false);

  const markEscapeKeyDownHandled = useCallback(() => {
    handledEscapeKeyDownRef.current = true;
    window.clearTimeout(handledEscapeKeyDownTimeoutRef.current);
    handledEscapeKeyDownTimeoutRef.current = window.setTimeout(() => {
      handledEscapeKeyDownRef.current = false;
    }, 0);
  }, []);

  const handleEscapeKeyDownEvent = useCallback(
    (event: KeyboardEvent) => {
      markEscapeKeyDownHandled();
      event.stopPropagation();
      onEscapeKeyDown?.(event);

      if (event.defaultPrevented) {
        return true;
      }

      if (open) {
        event.preventDefault();
        setOpen(false);
        triggerRef?.current?.focus();
      }

      return true;
    },
    [markEscapeKeyDownHandled, onEscapeKeyDown, open, setOpen, triggerRef],
  );

  const handleEscapeKeyDown = (event: ReactKeyboardEvent) => {
    if (event.key !== "Escape") {
      return false;
    }

    const baseUIEvent = event as ReactKeyboardEvent & {
      preventBaseUIHandler?: () => void;
    };

    baseUIEvent.preventBaseUIHandler?.();

    if (event.defaultPrevented || event.nativeEvent.defaultPrevented) {
      return true;
    }

    return handleEscapeKeyDownEvent(event.nativeEvent);
  };

  const setHeightFromContent = useCallback(
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

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const element = entry.target;
        setHeightFromContent(element);
      }
    });
    // Attach the observer once the initial animation completes
    // and the content ref is available
    if (internalContentRef.current && initialAnimationComplete) {
      observer.observe(internalContentRef.current);
    }

    return () => observer.disconnect();
  }, [initialAnimationComplete, setHeightFromContent]);

  // Reset the animation complete state when the combobox is closed
  useEffect(() => {
    if (initialAnimationComplete === true && context.open === false) {
      setInitialAnimationComplete(false);
    }
  }, [context.open, initialAnimationComplete]);

  // On open, set the height of the content after the animation completes
  // we add a timeout here to ensure that the DOM element has responded to
  // the state changes first
  useEffect(() => {
    if (!context.open) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setHeightFromContent(internalContentRef.current as unknown as Element);
    }, 10);

    return () => window.clearTimeout(timeout);
  }, [context.open, setHeightFromContent]);

  useEffect(() => {
    return () => {
      window.clearTimeout(handledEscapeKeyDownTimeoutRef.current);
    };
  }, []);

  const contentContext = {
    ...context,
    onEscapeKeyDown,
  };

  return (
    <ComboboxContext.Provider value={contentContext}>
      <TelegraphMenu.Content
        className="tgph"
        mt="1"
        onEscapeKeyDown={(event: KeyboardEvent) => {
          if (handledEscapeKeyDownRef.current) {
            handledEscapeKeyDownRef.current = false;
            return;
          }

          onEscapeKeyDown?.(event);

          if (event.defaultPrevented) {
            // Consumer escape handlers can keep the popup open.
            return;
          }

          if (context.open) {
            // Don't allow the event to bubble up outside of the menu
            event.stopPropagation();
            event.preventDefault();
            context.setOpen(false);
          }
        }}
        onCloseAutoFocus={(event: Event) => {
          if (!hasInteractedOutside.current) {
            // Menu close autofocus would otherwise move focus away from the
            // combobox trigger after keyboard selection or Escape close.
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
            "--tgph-combobox-trigger-width": "var(--radix-popper-anchor-width)",
            "--tgph-combobox-trigger-height":
              "var(--radix-popper-anchor-height)",
          },
        }}
        {...props}
        tgphRef={composedRef}
        data-tgph-combobox-content
        data-tgph-combobox-content-open={context.open}
        // Cancel out accessibility attributes related to aria menu
        role={undefined}
        aria-orientation={undefined}
        onKeyDown={(event: ReactKeyboardEvent) => {
          if (handleEscapeKeyDown(event)) {
            return;
          }

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
            // Moving backward from the first option should return focus to search,
            // matching the previous keyboard loop inside the combobox popup.
            context.searchRef?.current?.focus();
          }
        }}
      >
        <Stack direction="column" gap="1" tgphRef={internalContentRef}>
          {children}
        </Stack>
      </TelegraphMenu.Content>
    </ComboboxContext.Provider>
  );
};

export type OptionsProps<T extends TgphElement = "div"> = TgphComponentProps<
  typeof Stack<T>
>;

const Options = <T extends TgphElement = "div">({
  tgphRef,
  ...props
}: OptionsProps<T>) => {
  const context = useContext(ComboboxContext);
  const optionsRef = useRef<HTMLDivElement>(null);
  const composedRef = useComposedRefs<unknown>(tgphRef, optionsRef);

  // Scroll to the selected option or defaultScrollToValue when the combobox opens.
  useEffect(() => {
    if (context.open && optionsRef.current) {
      // Small delay to ensure the DOM has rendered
      requestAnimationFrame(() => {
        const selectedValue = isSingleSelect(context.value)
          ? getValueFromOption(context.value, context.legacyBehavior)
          : isMultiSelect(context.value) && context.value.length > 0
            ? getValueFromOption(context.value[0], context.legacyBehavior)
            : null;

        // Prefer the current selection, then fall back to the explicit initial
        // scroll target for long lists.
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
    <Stack
      id={context.contentId}
      direction="column"
      gap="1"
      style={
        {
          overflowY: "auto",
          // maxHeight defaults to available height - padding from edge of screen
          "--max-height": !props.maxHeight
            ? "calc(var(--tgph-combobox-content-available-height) - var(--tgph-spacing-12))"
            : undefined,
        } as CSSProperties
      }
      // Accessibility attributes
      role="listbox"
      tgphRef={composedRef}
      {...props}
    />
  );
};

export type OptionProps<T extends TgphElement = "button"> = Omit<
  TgphComponentProps<typeof TelegraphMenu.Button<T>>,
  "label"
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
  closeOnClick,
  tgphRef,
  ...props
}: OptionProps<T>) => {
  const context = useContext(ComboboxContext);
  const { onEscapeKeyDown, setOpen, triggerRef } = context;
  const [isFocused, setIsFocused] = useState(false);
  const contextValue = context.value;
  const optionRef = useRef<HTMLElement>(null);
  const composedRef = useComposedRefs<HTMLElement>(
    tgphRef as Ref<HTMLElement>,
    optionRef,
  );

  // Capture the option's rendered text so search can match text produced
  // inside child components, which isn't readable from the element tree.
  // The popup opens unfiltered, so every option captures before filtering
  // starts; the state persists while the option is filtered out.
  const [renderedText, setRenderedText] = useState<string[]>([]);
  // No deps on purpose: content can change without anything to depend on.
  // The updater bails out when the capture is unchanged.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    if (!optionRef.current) return;
    const captured = getRenderedSearchText(optionRef.current);
    setRenderedText((current) => {
      const changed =
        captured.length !== current.length ||
        captured.some((variant, index) => variant !== current[index]);
      return changed ? captured : current;
    });
  });

  const isVisible =
    !context.searchQuery ||
    doesOptionMatchSearchQuery({
      children: label || children,
      value,
      renderedText,
      searchQuery: context.searchQuery,
    });

  const isSelected = isMultiSelect(contextValue)
    ? contextValue.some(
        (v) => getValueFromOption(v, context.legacyBehavior) === value,
      )
    : getValueFromOption(contextValue, context.legacyBehavior) === value;

  useEffect(() => {
    const option = optionRef.current;
    if (!option) {
      return undefined;
    }

    const handleOptionKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      event.stopPropagation();
      onEscapeKeyDown?.(event);

      if (event.defaultPrevented) {
        return;
      }

      event.preventDefault();
      setOpen(false);
      triggerRef?.current?.focus();
    };

    option.addEventListener("keydown", handleOptionKeyDown);

    return () => {
      option.removeEventListener("keydown", handleOptionKeyDown);
    };
  }, [onEscapeKeyDown, setOpen, triggerRef]);

  const handleSelection = (event: Event | ReactKeyboardEvent) => {
    const keyboardEvent = event as ReactKeyboardEvent;
    if (keyboardEvent.key === "Escape") {
      event.stopPropagation();
      context.onEscapeKeyDown?.(keyboardEvent.nativeEvent);

      if (
        event.defaultPrevented ||
        keyboardEvent.nativeEvent.defaultPrevented
      ) {
        return;
      }

      event.preventDefault();
      context.setOpen(false);
      context.triggerRef?.current?.focus();
      return;
    }

    if (keyboardEvent.key && !SELECT_KEYS.includes(keyboardEvent.key)) {
      // Let non-selection keys bubble to the content layer so Escape dismissal
      // and popup-level navigation shims still run from focused options.
      return;
    }

    // Don't allow selection events to bubble up outside of the menu.
    event.stopPropagation();

    // Don't bubble up the event
    event.preventDefault();

    if (context.closeOnSelect === true) {
      // Close before emitting value changes so controlled callers see the old
      // menu-backed ordering of open/value updates.
      context.setOpen(false);
    }

    if (onSelect) {
      // Menu onSelect receives an Event; keyboard selection is already handled
      // here, so bridge the event shape for the public override callback.
      const onSelectEvent = event as unknown as Event;
      return onSelect(onSelectEvent);
    }

    if (isSingleSelect(contextValue)) {
      const onValueChange =
        context.onValueChange as SingleSelect["onValueChange"];

      // TODO: Remove this once { value, label } option is deprecated
      if (context.legacyBehavior === true) {
        // Legacy single select still emits the option object shape.
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
            // Preserve the legacy array item shape when that mode is enabled.
            context.legacyBehavior === true ? { value, label } : value,
          ];

      onValueChange?.(newValue);
    }

    if (context.closeOnSelect === true) {
      context.triggerRef?.current?.focus();
    }
  };

  if (isVisible) {
    return (
      <TelegraphMenu.Button
        type="button"
        onSelect={handleSelection as (event: Event) => void}
        onKeyDown={handleSelection as ReactKeyboardEventHandler}
        closeOnClick={closeOnClick ?? context.closeOnSelect}
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
        tgphRef={
          composedRef as TgphComponentProps<
            typeof TelegraphMenu.Button<T>
          >["tgphRef"]
        }
        {...props}
      >
        {label || children || value}
      </TelegraphMenu.Button>
    );
  }
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
  const id = useId();
  const context = useContext(ComboboxContext);
  const composedRef = useComposedRefs(tgphRef, context.searchRef);

  const value = controlledValueProp ?? context.searchQuery;
  const onValueChange = onValueChangeProp ?? context.setSearchQuery;

  useEffect(() => {
    const handleSearchKeyDown = (event: KeyboardEvent) => {
      if (FIRST_KEYS.includes(event.key)) {
        // Arrowing down from the search input should transfer focus into the
        // options list without scrolling the popup.
        context.contentRef?.current?.focus({ preventScroll: true });
      }

      if (event.key === "Escape") {
        return;
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
      <VisuallyHidden>
        <Text as="label" htmlFor={id}>
          {label}
        </Text>
      </VisuallyHidden>
      <TelegraphInput
        id={id}
        variant="ghost"
        placeholder={placeholder}
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
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

// Combobox.Option matches by type; a truthy `value` prop keeps consumer
// wrappers around Option matching. Controlled inputs also carry `value` and
// would become phantom options, so a change handler excludes an element
// unless option-shaped props (label/selected/onSelect/children) mark it as
// a wrapped option.
const isOptionElement = (element: ReactElement) => {
  if (element.type === Option) return true;
  if (element.type === Search) return false;

  const props = element.props as {
    value?: unknown;
    label?: unknown;
    selected?: unknown;
    onSelect?: unknown;
    children?: unknown;
    onChange?: unknown;
    onValueChange?: unknown;
  };

  const hasChangeHandler = Boolean(props?.onChange || props?.onValueChange);
  const isOptionShaped =
    props?.label !== undefined ||
    props?.selected !== undefined ||
    props?.onSelect !== undefined ||
    props?.children !== undefined;

  if (hasChangeHandler && !isOptionShaped) return false;
  return Boolean(props?.value);
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
  const context = useContext(ComboboxContext);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const content = context.contentRef?.current;
    if (!content) return undefined;

    const recount = () => {
      const options = content.querySelectorAll("[data-tgph-combobox-option]");
      setIsVisible(options.length === 0);
    };

    recount();

    // Options can come and go without anything to depend on (a content
    // update can hide the last match), so watch the DOM directly
    const observer = new MutationObserver(recount);
    observer.observe(content, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [context.contentRef]);

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
  const context = useContext(ComboboxContext);

  const variableAlreadyExists = useCallback(
    (searchQuery: string | undefined) => {
      if (!values || values?.length === 0) return false;
      // Compare through getValueFromOption so create works for both string
      // values and legacy { value, label } options.
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

            // The conditional prop type keeps public APIs precise, but runtime
            // creation narrows through the legacyBehavior branch above.
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
