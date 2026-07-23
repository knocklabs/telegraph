import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { Button as TelegraphButton } from "@telegraph/button";
import { useComposedRefs } from "@telegraph/compose-refs";
import {
  type LegacyDismissEventHandler,
  type RemappedOmit,
  type TgphComponentProps,
  type TgphElement,
  VisuallyHidden,
  createTgphBaseUIRender,
  getBaseUIPositionerVisibilityStyle,
  useControllableState,
} from "@telegraph/helpers";
import { Icon } from "@telegraph/icon";
import { Input as TelegraphInput } from "@telegraph/input";
import { Box, Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import { Plus, Search as SearchIcon, X } from "lucide-react";
import {
  type CSSProperties,
  type ChangeEvent,
  Children,
  type ReactElement,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type Ref,
  type RefObject,
  createContext,
  isValidElement,
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
  doesOptionMatchSearchQuery,
  getCurrentOption,
  getOptionAccessibleLabel,
  getOptions,
  getRenderedSearchText,
  getValueFromOption,
  isMultiSelect,
  isSingleSelect,
} from "./Combobox.helpers";
import { OptionItem } from "./Combobox.optionItem";
import { Primitives } from "./Combobox.primitives";
import type {
  DefinedOption,
  MultiSelect,
  Option,
  SingleSelect,
} from "./Combobox.types";

// Base UI's change callbacks pass a cancelable details object as the second
// argument. We only need `cancel`, `reason`, and the underlying DOM `event`, so
// describe just that surface instead of importing Base UI's internal type.
type BaseUIChangeEventDetails = {
  cancel: () => void;
  isCanceled: boolean;
  reason: string;
  event: Event;
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
    // Content registers its escape handler here so the Root-level Base UI
    // `onOpenChange` bridge can honor a consumer preventing dismissal.
    onEscapeKeyDownRef?: RefObject<
      ((event: KeyboardEvent) => void) | undefined
    >;
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

// Action items (`onSelect`/`Create`) must be navigable and highlightable but
// must never commit a selection. Base UI keys selection, highlight, and
// "selected on open" tracking off each item's `value`, and it treats a
// `null`/`undefined` value as equal to the "no selection" state — so a mounted
// action item would masquerade as the selected item whenever nothing is
// selected, dragging the highlight onto itself. Giving action items this stable
// non-null sentinel instead keeps them distinct from every real value and from
// "no selection", while Base UI's own commit is still cancelled for them at the
// value bridge below. It is only ever a Base UI item value; it never reaches the
// public value shape.
const ON_SELECT_ITEM_VALUE = Object.freeze({}) as unknown as string;

// Whether a value Base UI is trying to commit is the action-item sentinel, in
// which case Base UI's selection must be cancelled.
const isOnSelectItemValue = (value: unknown): boolean =>
  value === ON_SELECT_ITEM_VALUE;

// Resolve a Base UI string value back into the legacy `{ value, label }` option
// object the public API emits when `legacyBehavior` is enabled.
const toLegacyOption = (
  value: string,
  options: Array<DefinedOption>,
): DefinedOption => {
  const found = options.find((option) => option.value === value);
  return found ? { value: found.value, label: found.label } : { value };
};

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
}: RootProps<O, LB>) => {
  const contentId = useId();
  const triggerId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const onEscapeKeyDownRef = useRef<
    ((event: KeyboardEvent) => void) | undefined
  >(undefined);

  const options = useMemo(() => {
    return getOptions({ children, isOptionElement });
  }, [children]);

  // Whether a `Combobox.Create` is rendered. It mounts a matching row that isn't
  // part of `options`, so `filteredItems` must reserve a slot for it (below).
  const hasCreate = useMemo(() => childrenContainCreate(children), [children]);

  // The combobox is single- or multi-select for its lifetime; derive that from
  // whichever value shape the consumer provided.
  const multiple = useMemo(
    () => isMultiSelect(valueProp) || isMultiSelect(defaultValueProp),
    [valueProp, defaultValueProp],
  );

  const [searchQuery, setSearchQuery] = useState<string>("");

  // Base UI seeds the type-to-filter highlight from its filtered-items list and
  // only re-runs that seeding when the list's identity changes. In children mode
  // we render the options ourselves (no `items` prop), so Base UI's list is
  // always empty and the seeding never re-fires while typing — leaving the
  // highlight stuck on the option that was selected on open. Handing Base UI the
  // currently visible option values (in rendered order) as `filteredItems`
  // re-triggers that seeding per keystroke and sizes Base UI's highlight bounds
  // to the mounted rows.
  //
  // The rendered DOM, selection, and highlight all remain driven by the mounted
  // `Combobox.Option` children; Base UI only uses this list for bookkeeping. So
  // an over-inclusive list is harmless, while an under-inclusive one would let
  // Base UI's bounds check drop a valid highlight — hence the conservative
  // inclusion rules below.
  const filteredItems = useMemo<Array<string>>(() => {
    const query = searchQuery ?? "";
    const values = options
      .filter(
        (option) =>
          !query ||
          doesOptionMatchSearchQuery({
            children: option.label,
            value: option.value,
            searchQuery: query,
          }) ||
          // Text rendered inside child components isn't observable from the
          // Root (it's captured per-option after mount), so keep options that
          // render such content to avoid under-counting the mounted rows.
          optionRendersUnsearchableText(option.label),
      )
      .map((option) => option.value);

    // Reserve the `Combobox.Create` row's slot so Base UI's bounds check keeps
    // it navigable. Over-reserving when Create is hidden (its value already
    // exists) is harmless.
    if (query && hasCreate) {
      values.push(query);
    }

    return values;
  }, [options, searchQuery, hasCreate]);
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

  // Map the public value shape into the flat string(s) Base UI drives selection
  // with. `null` keeps Base UI controlled while representing "no selection".
  const baseValue = useMemo<string | Array<string> | null>(() => {
    if (multiple) {
      const array = isMultiSelect(value) ? value : [];
      return array
        .map((entry) => getValueFromOption(entry, legacyBehavior))
        .filter((entry): entry is string => Boolean(entry));
    }

    if (isSingleSelect(value)) {
      return getValueFromOption(value, legacyBehavior) ?? null;
    }

    return null;
  }, [value, multiple, legacyBehavior]);

  const handleBaseValueChange = useCallback(
    (
      next: string | Array<string> | null,
      eventDetails: BaseUIChangeEventDetails,
    ) => {
      if (multiple) {
        const array = Array.isArray(next) ? next : [];
        // The sentinel (or a null/undefined) entry means an `onSelect`/Create
        // item was pressed; let its own handler run instead of committing a
        // selection.
        if (
          array.some((entry) => entry == null || isOnSelectItemValue(entry))
        ) {
          eventDetails.cancel();
          return;
        }

        const nextValue = legacyBehavior
          ? array.map((entry) => toLegacyOption(entry, options))
          : array;
        (setValue as MultiSelect["onValueChange"])?.(
          nextValue as Array<Option>,
        );
      } else {
        // Real options always carry a string value, so a sentinel (or null)
        // commit is an `onSelect`/Create item; skip it and let `onClick` handle
        // the action.
        if (next == null || Array.isArray(next) || isOnSelectItemValue(next)) {
          eventDetails.cancel();
          return;
        }

        const nextValue = legacyBehavior ? toLegacyOption(next, options) : next;
        (setValue as SingleSelect["onValueChange"])?.(nextValue as Option);
      }

      // Base UI's single-select close arrives through `onOpenChange`, but we
      // always drive closing from here so multi-select honors closeOnSelect too.
      if (closeOnSelect === true) {
        setOpen(false);
      }
    },
    [multiple, legacyBehavior, options, setValue, closeOnSelect, setOpen],
  );

  const handleBaseOpenChange = useCallback(
    (nextOpen: boolean, eventDetails: BaseUIChangeEventDetails) => {
      const reason = eventDetails.reason;

      if (!nextOpen) {
        // Selection open/close is managed entirely by the value bridge above so
        // closeOnSelect behaves identically for single and multi select.
        if (reason === "item-press") {
          eventDetails.cancel();
          return;
        }

        if (reason === "escape-key") {
          const onEscapeKeyDown = onEscapeKeyDownRef.current;
          if (onEscapeKeyDown) {
            onEscapeKeyDown(eventDetails.event as KeyboardEvent);
            if (eventDetails.event.defaultPrevented) {
              // A consumer preventing default keeps the popup open.
              eventDetails.cancel();
              return;
            }
          }
        }
      }

      setOpen(nextOpen);
    },
    [setOpen],
  );

  const handleInputValueChange = useCallback((nextValue: string) => {
    setSearchQuery(nextValue);
  }, []);

  return (
    <ComboboxContext.Provider
      value={{
        contentId,
        triggerId,
        value,
        // Context consumers (clear button, tag removal) call this with the
        // public value shape; narrow it at each selection site.
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
        onEscapeKeyDownRef,
        errored,
        layout,
        options,
        legacyBehavior,
        defaultScrollToValue,
      }}
    >
      <BaseCombobox.Root
        // Children mode: no `items`, so Base UI performs no filtering and drives
        // selection/highlight/virtual-focus off the mounted `Combobox.Item`s.
        multiple={multiple}
        value={baseValue}
        onValueChange={
          handleBaseValueChange as (value: unknown, details: unknown) => void
        }
        open={open}
        onOpenChange={
          handleBaseOpenChange as (open: boolean, details: unknown) => void
        }
        onInputValueChange={handleInputValueChange}
        // Seed the highlight on the first match after the query changes so
        // pressing Enter selects it, mirroring the old typeahead behavior.
        autoHighlight
        // The rendered options stay the `Combobox.Option` children; this list
        // only exists so Base UI re-seeds the type-to-filter highlight per
        // keystroke and bounds it to the mounted rows. See the `filteredItems`
        // memo above for why it is computed conservatively.
        filteredItems={filteredItems}
        modal={modal}
        disabled={disabled}
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
  TgphComponentProps<typeof TelegraphButton.Root>,
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
    <BaseCombobox.Trigger
      disabled={context.disabled}
      nativeButton
      // Base UI opens the popup on the trigger's mousedown. The tag-remove and
      // clear controls live inside the trigger button and only stop the click,
      // so intercept mousedown in the capture phase for those targets to keep
      // the popup from opening while their own click handlers still run.
      onMouseDownCapture={(event: ReactMouseEvent<HTMLElement>) => {
        const target = event.target as HTMLElement;
        if (
          target.closest?.(
            "[data-tgph-combobox-tag-button], [data-tgph-combobox-clear]",
          )
        ) {
          event.stopPropagation();
        }
      }}
      render={createTgphBaseUIRender(
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
          tgphRef={context.triggerRef}
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
        </TelegraphButton.Root>,
      )}
    />
  );
};

// The public Content surface mirrors the props consumers relied on from the
// menu-backed implementation. Positioning props flow to the Base UI positioner;
// the remainder are Stack style props for the popup surface.
export type ContentProps<T extends TgphElement = "div"> = RemappedOmit<
  TgphComponentProps<typeof Stack<T>>,
  "children"
> & {
  children?: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
  collisionPadding?: number;
  sticky?: boolean;
  hideWhenDetached?: boolean;
  forceMount?: boolean;
  finalFocus?:
    | boolean
    | RefObject<HTMLElement | null>
    | ((closeType: string) => void | boolean | HTMLElement | null);
  onCloseAutoFocus?: LegacyDismissEventHandler;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
};

const Content = <T extends TgphElement = "div">({
  style,
  children,
  onEscapeKeyDown,
  onCloseAutoFocus,
  finalFocus,
  forceMount,
  side = "bottom",
  align = "start",
  sideOffset = 4,
  alignOffset,
  collisionPadding,
  sticky,
  hideWhenDetached,
  tgphRef,
  ...props
}: ContentProps<T>) => {
  const context = useContext(ComboboxContext);
  const composedRef = useComposedRefs<unknown>(tgphRef, context.contentRef);
  const internalContentRef = useRef<HTMLDivElement>(null);

  const [height, setHeight] = useState(0);
  const [initialAnimationComplete, setInitialAnimationComplete] =
    useState(false);

  // Whether the consumer rendered a `Combobox.Search`. When absent we still need
  // an input in the popup for Base UI's virtual focus, so we mount a hidden one.
  const hasSearch = useMemo(() => childrenContainSearch(children), [children]);

  // Register the escape handler so the Root-level open-change bridge can call it
  // and honor a consumer preventing dismissal.
  useEffect(() => {
    if (!context.onEscapeKeyDownRef) return undefined;
    context.onEscapeKeyDownRef.current = onEscapeKeyDown;
    return () => {
      if (context.onEscapeKeyDownRef) {
        context.onEscapeKeyDownRef.current = undefined;
      }
    };
  }, [onEscapeKeyDown, context.onEscapeKeyDownRef]);

  // Focus the in-popup input synchronously on open. Base UI moves focus there
  // itself, but only on a later animation frame, which would drop keystrokes
  // typed immediately after opening. Focusing here (a layout effect) lands
  // focus before that frame; Base UI's later focus targets the same input.
  useLayoutEffect(() => {
    if (!context.open) return;
    const input = context.contentRef?.current?.querySelector<HTMLInputElement>(
      "[data-tgph-combobox-search], [data-tgph-combobox-input-hidden]",
    );
    input?.focus();
  }, [context.open, context.contentRef]);

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
      if (internalContentRef.current) {
        setHeightFromContent(internalContentRef.current);
      }
    }, 10);

    return () => window.clearTimeout(timeout);
  }, [context.open, setHeightFromContent]);

  // Mirror the old `onCloseAutoFocus` → trigger refocus behavior. Base UI's
  // default returns focus to the trigger when the popup was opened by pointer,
  // but leaves it on the in-popup input when opened via the keyboard; return
  // focus to the trigger explicitly (except on outside pointer dismissal, where
  // focus should follow the click) to keep the trigger focused after closing.
  const resolvedFinalFocus = useMemo<
    boolean | RefObject<HTMLElement | null> | ((closeType: string) => unknown)
  >(() => {
    if (finalFocus !== undefined) {
      return finalFocus;
    }

    if (!onCloseAutoFocus) {
      return (closeType: string) =>
        closeType === "keyboard" ? context.triggerRef?.current : true;
    }

    return () => {
      const event = new Event("closeAutoFocus", { cancelable: true });
      onCloseAutoFocus(event);
      return event.defaultPrevented ? false : true;
    };
  }, [finalFocus, onCloseAutoFocus, context.triggerRef]);

  const stackProps = props as TgphComponentProps<typeof Stack>;

  return (
    <BaseCombobox.Portal keepMounted={forceMount}>
      <BaseCombobox.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        sticky={sticky}
        style={(state) =>
          getBaseUIPositionerVisibilityStyle({
            anchorHidden: state.anchorHidden,
            hideWhenDetached,
            zIndex: "var(--tgph-zIndex-popover)",
          })
        }
      >
        <BaseCombobox.Popup
          finalFocus={
            resolvedFinalFocus as TgphComponentProps<
              typeof BaseCombobox.Popup
            >["finalFocus"]
          }
          render={createTgphBaseUIRender(
            <Stack
              className="tgph"
              direction="column"
              gap="1"
              bg="surface-1"
              rounded="4"
              shadow="2"
              py="1"
              mt="1"
              // Base UI renders the popup as role="dialog"; name it via the
              // trigger so it isn't an unnamed dialog for assistive tech.
              aria-labelledby={context.triggerId}
              data-tgph-combobox-content
              data-tgph-combobox-content-open={context.open}
              tgphRef={
                composedRef as TgphComponentProps<typeof Stack>["tgphRef"]
              }
              style={{
                outline: "none",
                overflowY: "auto",
                width: "var(--tgph-combobox-trigger-width)",
                transition: "min-height 200ms ease-in-out",
                minHeight: height ? `${height}px` : "0",
                ...style,
                ...({
                  "--tgph-combobox-content-transform-origin":
                    "var(--transform-origin)",
                  "--tgph-combobox-content-available-width":
                    "var(--available-width)",
                  "--tgph-combobox-content-available-height":
                    "calc(var(--available-height) - var(--tgph-spacing-8))",
                  "--tgph-combobox-trigger-width": "var(--anchor-width)",
                  "--tgph-combobox-trigger-height": "var(--anchor-height)",
                } as CSSProperties),
              }}
              {...stackProps}
            >
              {/* Virtual focus needs an input in the popup even without a
                  visible Search; mount a hidden one in that case. */}
              {!hasSearch ? (
                <VisuallyHidden>
                  <BaseCombobox.Input
                    // Keep it out of the Tab sequence (it is only focused
                    // programmatically for virtual focus, on open) but labelled
                    // so it is not an unnamed control for assistive tech.
                    tabIndex={-1}
                    aria-label={context.placeholder ?? "Search"}
                    data-tgph-combobox-input-hidden
                  />
                </VisuallyHidden>
              ) : null}
              <Stack direction="column" gap="1" tgphRef={internalContentRef}>
                {children}
              </Stack>
            </Stack>,
          )}
        />
      </BaseCombobox.Positioner>
    </BaseCombobox.Portal>
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
    <BaseCombobox.List
      render={createTgphBaseUIRender(
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
          tgphRef={composedRef as TgphComponentProps<typeof Stack>["tgphRef"]}
          {...props}
        />,
      )}
    />
  );
};

export type OptionProps<T extends TgphElement = "div"> = Omit<
  TgphComponentProps<typeof OptionItem<T>>,
  "label"
> & {
  value: DefinedOption["value"];
  label?: DefinedOption["label"];
  selected?: boolean | null;
  onSelect?: (event: Event) => void;
  closeOnClick?: boolean;
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

  const handleClick = useCallback(
    (event: ReactMouseEvent<HTMLElement>) => {
      if (!onSelect) {
        return;
      }

      // Base UI has no per-item select callback, and its own commit for this
      // item is canceled at the Root value bridge (the item is given no
      // committable value), so run the override here.
      if (context.closeOnSelect === true) {
        context.setOpen(false);
      }

      onSelect(event.nativeEvent);
    },
    [onSelect, context],
  );

  if (!isVisible) {
    return null;
  }

  return (
    <BaseCombobox.Item
      // Items carrying an `onSelect` (including Create) must not commit a Base
      // UI selection; the sentinel value keeps them navigable/highlightable
      // without matching a real value or the "no selection" state, and their
      // commit is cancelled at the value bridge (see `isOnSelectItemValue`).
      value={onSelect ? ON_SELECT_ITEM_VALUE : value}
      onClick={handleClick}
      render={createTgphBaseUIRender(
        <OptionItem
          as="div"
          mx="1"
          // Force null if selected equals null so we can override the icon of
          // the button.
          selected={selected === null ? null : (selected ?? isSelected)}
          // Accessibility attributes
          role="option"
          aria-selected={isSelected ? "true" : "false"}
          // Custom attributes
          data-tgph-combobox-option
          data-tgph-combobox-option-value={value}
          data-tgph-combobox-option-label={label}
          tgphRef={
            composedRef as TgphComponentProps<typeof OptionItem<T>>["tgphRef"]
          }
          {...(props as TgphComponentProps<typeof OptionItem<T>>)}
        >
          {label || children || value}
        </OptionItem>,
      )}
    />
  );
};

export type SearchProps = TgphComponentProps<typeof TelegraphInput> & {
  label?: string;
};

// Reset a Base UI (uncontrolled) input to empty by writing through the native
// value setter and dispatching an input event, so Base UI's own onChange runs
// and its store — and our mirrored searchQuery — clear in lockstep.
const clearInputElement = (input: HTMLInputElement | null | undefined) => {
  if (!input) return;
  const setValue = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value",
  )?.set;
  setValue?.call(input, "");
  input.dispatchEvent(new Event("input", { bubbles: true }));
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

  // Destructured only to keep `value` off the (uncontrolled) Base UI input; a
  // consumer-controlled Search observes/updates the query through onValueChange.
  void controlledValueProp;

  return (
    <Box borderBottom="px" px="1" pb="1">
      <VisuallyHidden>
        <Text as="label" htmlFor={id}>
          {label}
        </Text>
      </VisuallyHidden>
      <BaseCombobox.Input
        // Base UI owns the input value; mirror it into a consumer-controlled
        // Search via onChange without making the DOM input controlled (which
        // races Base UI's own state and drops keystrokes).
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onValueChangeProp?.(event.target.value);
        }}
        render={createTgphBaseUIRender(
          <TelegraphInput
            id={id}
            variant="ghost"
            placeholder={placeholder}
            LeadingComponent={<Icon icon={SearchIcon} alt="Search Icon" />}
            TrailingComponent={
              context?.searchQuery && context?.searchQuery?.length > 0 ? (
                <TelegraphButton
                  variant="ghost"
                  color="gray"
                  icon={{ icon: X, alt: "Clear Search Query" }}
                  onClick={() => {
                    clearInputElement(context.searchRef?.current);
                    context.setSearchQuery?.("");
                  }}
                />
              ) : null
            }
            data-tgph-combobox-search
            aria-controls={context.contentId}
            {...props}
            tgphRef={composedRef}
          />,
        )}
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

// Walk the Content children for a `Combobox.Search` so Content can decide
// whether to mount its own hidden input for virtual focus.
const childrenContainSearch = (children: ReactNode): boolean => {
  let found = false;
  Children.forEach(children, (child) => {
    if (found || !(typeof child === "object" && child !== null)) return;
    const element = child as ReactElement<{ children?: ReactNode }>;
    if (element.type === Search) {
      found = true;
      return;
    }
    if (element.props?.children) {
      found = childrenContainSearch(element.props.children);
    }
  });
  return found;
};

// Whether an option's label/children can render text that the Root can't read
// statically — i.e. it contains a component element that may produce searchable
// text from its own props/state (captured per-option after mount as
// `renderedText`). Host elements (string `type`) expose their text through
// their own children, so only component types are treated as opaque. Used to
// keep such options in `filteredItems` so a valid highlight isn't dropped.
const optionRendersUnsearchableText = (label: ReactNode): boolean => {
  let found = false;
  Children.forEach(label, (child) => {
    if (found || !isValidElement(child)) return;
    if (typeof child.type !== "string") {
      found = true;
      return;
    }
    const grandchildren = (child.props as { children?: ReactNode })?.children;
    if (grandchildren != null) {
      found = optionRendersUnsearchableText(grandchildren);
    }
  });
  return found;
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
  T extends TgphElement = "div",
  LB extends boolean = false,
> = TgphComponentProps<typeof OptionItem<T>> & {
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

// Walk the children for a `Combobox.Create` so the Root's `filteredItems` list
// can reserve a slot for the row Create mounts (it isn't one of `options`).
const childrenContainCreate = (children: ReactNode): boolean => {
  let found = false;
  Children.forEach(children, (child) => {
    if (found || !(typeof child === "object" && child !== null)) return;
    const element = child as ReactElement<{ children?: ReactNode }>;
    if (element.type === Create) {
      found = true;
      return;
    }
    if (element.props?.children) {
      found = childrenContainCreate(element.props.children);
    }
  });
  return found;
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
