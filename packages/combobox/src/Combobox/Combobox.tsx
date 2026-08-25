import { Autocomplete as BaseAutocomplete } from "@base-ui/react/autocomplete";
import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import {
  type ButtonRootProps,
  Button as TelegraphButton,
  resolveButtonNativeButton,
} from "@telegraph/button";
import { useComposedRefs } from "@telegraph/compose-refs";
import {
  type LegacyDismissEventHandler,
  type PolymorphicProps,
  type RemappedOmit,
  type TgphComponentProps,
  type TgphElement,
  VisuallyHidden,
  createTgphBaseUIRender,
  getBaseUIPositionerVisibilityStyle,
  useControllableState,
} from "@telegraph/helpers";
import { Icon, type IconProps } from "@telegraph/icon";
import {
  type InputProps as TelegraphInputProps,
  Input as TelegraphInput,
} from "@telegraph/input";
import { Box, Stack, type StackProps } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import { Plus, Search as SearchIcon, X } from "lucide-react";
import { LazyMotion, domAnimation } from "motion/react";
import {
  type CSSProperties,
  type ChangeEvent,
  Children,
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactElement,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type Ref,
  type RefObject,
  type SetStateAction,
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
  isMultiSelect,
  isSingleSelect,
} from "./Combobox.helpers";
import { OptionItem, type OptionItemProps } from "./Combobox.optionItem";
import { Primitives } from "./Combobox.primitives";
import type {
  ComboboxActions,
  ComboboxChangeDetails,
  ComboboxHighlightDetails,
  ComboboxSelectionMode,
  ComboboxValue,
  DefinedOption,
  MultiSelect,
  SingleSelect,
} from "./Combobox.types";

type BaseUIFocusEvent = ReactFocusEvent<HTMLElement> & {
  preventBaseUIHandler?: () => void;
};

type BaseUIMouseEvent = ReactMouseEvent<HTMLElement> & {
  preventBaseUIHandler?: () => void;
};

const legacyHighlightFocusEvents = new WeakSet<Event>();

type LayoutValue<V> = V extends string ? never : "truncate" | "wrap";

type ValueChangeValue<V extends ComboboxValue> = V extends string
  ? V | undefined
  : V;

export type RootProps<V extends ComboboxValue = string> = {
  value?: V;
  defaultValue?: V;
  onValueChange?: (value: ValueChangeValue<V>) => void;
  layout?: LayoutValue<V>;
  open?: boolean;
  defaultOpen?: boolean;
  errored?: boolean;
  placeholder?: string;
  // The optional second `details` argument is additive: existing single-argument
  // handlers stay assignable. It carries Base UI's change `reason` and `cancel()`.
  onOpenChange?: (open: boolean, details?: ComboboxChangeDetails) => void;
  modal?: boolean;
  closeOnSelect?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  // Disable the built-in text filtering of `Combobox.Option`s. Use this when the
  // consumer already narrows the option list itself (e.g. an async/server search
  // driven by `Combobox.Search`'s `onValueChange`): the options you render are
  // shown as-is, and the typed query is still exposed to `Combobox.Create` and
  // the Search clear button. Without it, the internal filter stacks on top of
  // the consumer's, hiding server results whose text is produced by child
  // components.
  manualFiltering?: boolean;
  // Observe virtual option focus without relying on the transitional synthetic
  // focus event compatibility bridge.
  onItemHighlighted?: (
    value: string | undefined,
    details: ComboboxHighlightDetails,
  ) => void;
  // The value to scroll to when the combobox opens if no value is selected.
  // Useful for long lists where you want to start at a specific position.
  defaultScrollToValue?: string;
  // --- Additive (T5): input-as-trigger + free-text arrangement -------------
  // Selection semantics. `undefined` keeps the historical inference from the
  // `value` shape (single vs. multiple). `"none"` renders the free-text
  // Autocomplete root, where there is no selected value and the input text is
  // the state.
  selectionMode?: ComboboxSelectionMode;
  // Controlled input text, distinct from the selected `value`. Only meaningful
  // with a `Combobox.Input` anchor (and the sole state in `selectionMode="none"`).
  inputValue?: string;
  defaultInputValue?: string;
  onInputValueChange?: (value: string, details: ComboboxChangeDetails) => void;
  // Filtering/inline-autocomplete behavior for `selectionMode="none"`.
  autocompleteMode?: "list" | "inline" | "both" | "none";
  // Highlight the first match while typing. Defaults to the historical on for
  // single/multiple (keeps the typeahead + `filteredItems` mechanism) and off
  // for free text.
  autoHighlight?: boolean;
  // Whether clicking the anchor input opens the popup. Defaults to false for
  // free text and true otherwise (Base UI's per-root defaults).
  openOnInputClick?: boolean;
  // Whether arrow-key focus loops between the input and the list ends.
  loopFocus?: boolean;
  onItemHighlighted?: (
    value: string | undefined,
    details: ComboboxHighlightDetails,
  ) => void;
  actionsRef?: RefObject<ComboboxActions | null>;
  children?: ReactNode;
};

export const ComboboxContext = createContext<
  Omit<RootProps<ComboboxValue>, "children"> & {
    contentId: string;
    triggerId: string;
    open: boolean;
    setOpen: (
      open: SetStateAction<boolean>,
      details?: ComboboxChangeDetails,
    ) => void;
    onOpenToggle: () => void;
    searchQuery?: string;
    setSearchQuery?: (query: string) => void;
    hasSearch: boolean;
    triggerRef?: RefObject<HTMLButtonElement>;
    searchRef?: RefObject<HTMLInputElement>;
    contentRef?: RefObject<HTMLDivElement>;
    // The anchor `Combobox.Input`, when used instead of a button `Trigger`.
    // Focus lives here across open/type/navigate/select (virtual focus).
    anchorInputRef?: RefObject<HTMLInputElement>;
    onEscapeKeyDown?: (event: KeyboardEvent) => void;
    // Content registers its escape handler here so the Root-level Base UI
    // `onOpenChange` bridge can honor a consumer preventing dismissal.
    onEscapeKeyDownRef?: RefObject<
      ((event: KeyboardEvent) => void) | undefined
    >;
    options: Array<DefinedOption>;
    manualFiltering: boolean;
    defaultScrollToValue?: string;
    // Explicit Base UI registry index for a Create row rendered outside Options.
    createIndex?: number;
    // An option can opt into closing when Root keeps the popup open globally.
    // The click handler sets this before Base UI commits the selection.
    optionCloseOnClickRef?: RefObject<boolean>;
    // Resolved selection mode (never `undefined`), so parts can branch behavior
    // (e.g. Content skips the hidden popup input when the anchor input owns it).
    resolvedSelectionMode: ComboboxSelectionMode;
    // Whether a `Combobox.Input` anchor is rendered as a direct child of Root.
    hasAnchorInput: boolean;
    // The consumer-provided id for the anchor input, or Root's generated id.
    // Content uses the same id to name its dialog.
    anchorInputId: string;
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
  hasSearch: false,
  manualFiltering: false,
  resolvedSelectionMode: "single",
  hasAnchorInput: false,
  anchorInputId: "",
});

const CreateIndexContext = createContext<number | undefined>(undefined);

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
// The marker key is deliberately unusual — and not `label`/`value`, which Base
// UI would surface as the fill text — so the value serializes (via
// `ON_SELECT_ITEM_FILL`) to a string no real option value could collide with.
const ON_SELECT_ITEM_VALUE = Object.freeze({
  __tgphActionItem: true,
}) as unknown as string;

// Whether a value Base UI is trying to commit is the action-item sentinel, in
// which case Base UI's selection must be cancelled.
const isOnSelectItemValue = (value: unknown): boolean =>
  value === ON_SELECT_ITEM_VALUE;

// In `selectionMode="none"` Base UI fills the input from a pressed item's value
// (`fillInputOnItemPress`, baked into Autocomplete.Root). For an action item the
// value is the sentinel object, which Base UI serializes with `JSON.stringify`
// to this string. Recognizing it lets the Root cancel that one fill so pressing
// a Create/inert row never corrupts the free-text input.
const ON_SELECT_ITEM_FILL = JSON.stringify(ON_SELECT_ITEM_VALUE);

// Base UI's change `reason` for an item press (pointer or Enter on an option).
const ITEM_PRESS_REASON = "item-press";

// Base UI change reasons where the USER edited the input text. Only these
// should update the children-mode search query; Base UI also fires
// `onInputValueChange` for programmatic label resyncs (reason `"none"`) and
// item-press fills, and mirroring those would leave a reopened list wrongly
// pre-filtered to the selected option's label.
const USER_INPUT_REASONS = new Set<string>([
  "input-change",
  "input-clear",
  "input-paste",
]);
const Root = <V extends ComboboxValue = string>({
  modal = true,
  closeOnSelect = true,
  clearable = false,
  disabled = false,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  defaultOpen: defaultOpenProp,
  value: valueProp,
  defaultValue: defaultValueProp,
  onValueChange: onValueChangeProp,
  errored,
  placeholder,
  layout,
  manualFiltering: manualFilteringProp,
  onItemHighlighted: onItemHighlightedProp,
  defaultScrollToValue,
  selectionMode: selectionModeProp,
  inputValue: inputValueProp,
  defaultInputValue: defaultInputValueProp,
  onInputValueChange: onInputValueChangeProp,
  autocompleteMode = "list",
  autoHighlight: autoHighlightProp,
  openOnInputClick: openOnInputClickProp,
  loopFocus: loopFocusProp,
  onItemHighlighted: onItemHighlightedProp,
  actionsRef,
  children,
}: RootProps<V>) => {
  const contentId = useId();
  const triggerId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const anchorInputRef = useRef<HTMLInputElement>(null);
  const onEscapeKeyDownRef = useRef<
    ((event: KeyboardEvent) => void) | undefined
  >(undefined);
  const optionCloseOnClickRef = useRef(false);

  const options = useMemo(() => {
    return getOptions({ children, isOptionElement, isOptionsElement });
  }, [children]);

  const searchControl = useMemo(() => findSearchControl(children), [children]);
  const searchControlsFiltering =
    searchControl?.value !== undefined ||
    searchControl?.onValueChange !== undefined;
  // A controlled Search historically replaced Telegraph's filter. Preserve
  // that behavior unless Root explicitly chooses its filtering mode.
  const manualFiltering = manualFilteringProp ?? searchControlsFiltering;

  // Whether a `Combobox.Create` is rendered. It mounts a matching row that isn't
  // part of `options`, so `filteredItems` must reserve a slot for it (below).
  const hasCreate = useMemo(() => childrenContainCreate(children), [children]);

  // Whether a `Combobox.Input` anchor is rendered (input-as-trigger arrangement)
  // instead of the button `Combobox.Trigger`.
  const anchorInputElement = useMemo(
    () => findAnchorInput(children),
    [children],
  );
  const hasAnchorInput = anchorInputElement !== undefined;
  const anchorInputId =
    (anchorInputElement?.props as { id?: string } | undefined)?.id ?? triggerId;

  // Single- vs multi-select is derived from the value shape; an explicit
  // `selectionMode` overrides it. Consumers should keep that shape stable
  // (multi-select initializes with an array); Base UI does not support the
  // `multiple` flag flipping after mount.
  const inferredMultiple = useMemo(
    () => isMultiSelect(valueProp) || isMultiSelect(defaultValueProp),
    [valueProp, defaultValueProp],
  );
  const resolvedSelectionMode: ComboboxSelectionMode =
    selectionModeProp ?? (inferredMultiple ? "multiple" : "single");
  const isNoneMode = resolvedSelectionMode === "none";
  const multiple = resolvedSelectionMode === "multiple";

  // Free-text (`selectionMode="none"`) input text. Telegraph always controls the
  // Autocomplete root's value (from this state or the consumer's `inputValue`) so
  // that (a) a genuinely controlled `inputValue` is lossless — driven through the
  // engine's own value/onValueChange rather than a separate DOM-controlled input,
  // which is what dropped keystrokes in T4 — and (b) an item-press fill of the
  // action-item sentinel can be cancelled before it reaches state.
  const isInputControlled = inputValueProp !== undefined;
  const [uncontrolledInputValue, setUncontrolledInputValue] = useState<string>(
    () => defaultInputValueProp ?? "",
  );
  const resolvedInputValue = isInputControlled
    ? (inputValueProp as string)
    : uncontrolledInputValue;

  const [uncontrolledSearchQuery, setSearchQuery] = useState<string>(
    () =>
      searchControl?.defaultValue ??
      inputValueProp ??
      defaultInputValueProp ??
      "",
  );
  const searchQuery = isNoneMode
    ? resolvedInputValue
    : (searchControl?.value ?? inputValueProp ?? uncontrolledSearchQuery);

  // The query that drives children-mode filtering is derived during render so
  // external Search or Root input-value changes filter without a stale frame.
  const activeSearchQuery = searchQuery;

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
  const { filteredItems, createIndex } = useMemo(() => {
    // With manual filtering the consumer decides which options render, so keep
    // every option in the bounds list and never filter it here.
    const query = manualFiltering ? "" : activeSearchQuery;
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
    // it navigable. Use the typed query (`activeSearchQuery`) rather than the
    // filter `query` (forced empty under manualFiltering, and the wrong field in
    // free-text mode) so Create stays navigable in every arrangement.
    // Over-reserving when Create is hidden (its value already exists) is harmless.
    const createQuery = activeSearchQuery;
    let nextCreateIndex: number | undefined;
    if (createQuery && hasCreate) {
      nextCreateIndex = values.length;
      values.push(createQuery);
    }

    return { filteredItems: values, createIndex: nextCreateIndex };
  }, [options, activeSearchQuery, hasCreate, manualFiltering]);
  // Open state, kept controllable like the old menu-backed implementation. This
  // mirrors `useControllableState` (same no-op-on-equal and updater semantics)
  // but threads Base UI's change `details` to the consumer's `onOpenChange` as an
  // additive optional second argument. Existing single-argument handlers ignore it.
  const isOpenControlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState<boolean>(
    defaultOpenProp ?? false,
  );
  const uncontrolledOpenRef = useRef(uncontrolledOpen);
  useEffect(() => {
    uncontrolledOpenRef.current = uncontrolledOpen;
  }, [uncontrolledOpen]);
  const open = isOpenControlled ? (openProp as boolean) : uncontrolledOpen;

  const setOpen = useCallback(
    (
      nextOrUpdater: SetStateAction<boolean>,
      details?: ComboboxChangeDetails,
    ) => {
      const current = isOpenControlled
        ? (openProp as boolean)
        : uncontrolledOpenRef.current;
      const nextOpen =
        typeof nextOrUpdater === "function"
          ? nextOrUpdater(current)
          : nextOrUpdater;

      if (Object.is(current, nextOpen)) {
        return;
      }

      if (!isOpenControlled) {
        uncontrolledOpenRef.current = nextOpen;
        setUncontrolledOpen(nextOpen);
      }

      onOpenChangeProp?.(nextOpen, details);
    },
    [isOpenControlled, openProp, onOpenChangeProp],
  );

  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValueProp as V,
    onChange: onValueChangeProp as (value: V) => void,
  });

  const onOpenToggle = useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
  }, [setOpen]);

  const wasOpenRef = useRef(open);
  useEffect(() => {
    // Reset the in-popup search query when the popup closes — but only on the
    // open→close transition, not on mount, which would otherwise wipe an initial
    // `inputValue`/`defaultInputValue`. Free text persists across open/close (the
    // anchor input is the state), so it is never reset here.
    if (wasOpenRef.current && !open && !isNoneMode) {
      setSearchQuery("");
    }
    wasOpenRef.current = open;
  }, [open, isNoneMode]);

  // Map the public value shape into the flat string(s) Base UI drives selection
  // with. `null` keeps Base UI controlled while representing "no selection".
  const baseValue = useMemo<string | Array<string> | null>(() => {
    if (multiple) {
      return isMultiSelect(value) ? value : [];
    }

    if (isSingleSelect(value)) {
      return value ?? null;
    }

    return null;
  }, [value, multiple]);

  const handleBaseValueChange = useCallback(
    (
      next: string | Array<string> | null,
      eventDetails: ComboboxChangeDetails,
    ) => {
      const array = multiple && Array.isArray(next) ? next : [];
      const isActionItem = multiple
        ? array.some((entry) => entry == null || isOnSelectItemValue(entry))
        : Array.isArray(next) || isOnSelectItemValue(next);

      if (isActionItem) {
        eventDetails.cancel();
        return;
      }

      // Preserve the menu-backed callback order. Controlled callers observe the
      // popup close before they receive the selected value.
      if (closeOnSelect === true && next != null) {
        setOpen(false, eventDetails);
      }

      if (multiple) {
        (setValue as MultiSelect["onValueChange"])?.(array);
      } else {
        const nextValue = next == null ? undefined : next;
        (setValue as SingleSelect["onValueChange"])?.(nextValue);
      }

      // The former Menu.Button-backed option allowed one row to close a Root
      // whose global closeOnSelect was false. Menu emitted the value first for
      // that per-row override, so preserve the same callback order here.
      if (!closeOnSelect && optionCloseOnClickRef.current) {
        setOpen(false);
      }
    },
    [multiple, setValue, closeOnSelect, setOpen],
  );

  const handleBaseOpenChange = useCallback(
    (nextOpen: boolean, eventDetails: ComboboxChangeDetails) => {
      const reason = eventDetails.reason;

      if (!nextOpen) {
        // Let Base UI finish its internal close when selection also closes the
        // controlled Telegraph state. Cancelling that transition leaves Base
        // UI internally open, so the next trigger press cannot reopen it.
        if (reason === "item-press") {
          if (!closeOnSelect && !optionCloseOnClickRef.current) {
            eventDetails.cancel();
          }
          if (!isNoneMode || !closeOnSelect) {
            return;
          }
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

      setOpen(nextOpen, eventDetails);
    },
    [setOpen, isNoneMode, closeOnSelect],
  );

  const handleInputValueChange = useCallback(
    (nextValue: string, eventDetails: ComboboxChangeDetails) => {
      // Free-text mode: Base UI fills the input from a pressed item's value.
      // For an action item (Create/inert row) that value is the sentinel, which
      // serializes to `ON_SELECT_ITEM_FILL`; cancel that single fill so it never
      // replaces the user's free text. Real options still fill as usual.
      if (
        isNoneMode &&
        eventDetails.reason === ITEM_PRESS_REASON &&
        nextValue === ON_SELECT_ITEM_FILL
      ) {
        eventDetails.cancel();
        return;
      }

      // Mirror the query into the popup search-query state so children-mode
      // filtering runs — but only when the user edited the input, never for Base
      // UI's programmatic label resyncs (reason `"none"`) or item-press fills,
      // which would otherwise leave a reopened list pre-filtered to the selected
      // label. Free-text mode derives its query from the input text instead (see
      // `activeSearchQuery`), so only the other arrangements need it.
      if (!isNoneMode && USER_INPUT_REASONS.has(eventDetails.reason)) {
        setSearchQuery(nextValue);
      }

      // In free text, Telegraph owns the (always-controlled) input value unless
      // the consumer controls it via `inputValue`.
      if (isNoneMode && !isInputControlled) {
        setUncontrolledInputValue(nextValue);
      }

      onInputValueChangeProp?.(nextValue, eventDetails);
    },
    [isNoneMode, isInputControlled, onInputValueChangeProp],
  );

  // `context.setSearchQuery` is only ever called to clear the query (the Search
  // clear button and Create). In free-text mode the anchor input is the query,
  // so clear its uncontrolled value instead of the unused search-query state.
  const clearSearchQuery = useCallback(
    (query: string) => {
      if (isNoneMode) {
        if (!isInputControlled) setUncontrolledInputValue(query);
        return;
      }
      setSearchQuery(query);
    },
    [isNoneMode, isInputControlled],
  );

  // TRANSITIONAL compatibility bridge: the menu-backed combobox moved DOM
  // focus through its options. Base UI uses virtual focus instead, but legacy
  // virtualized consumers listen for the bubbling focus event to mount the next
  // window of options. Re-emit that signal from the highlighted row while real
  // focus remains on the input. New consumers must use `onItemHighlighted` on
  // `Combobox.Root`; remove this bridge in a future major release.
  const handleBaseItemHighlighted = useCallback(
    (
      highlightedValue: string | undefined,
      details: ComboboxHighlightDetails,
    ) => {
      // Action items (`onSelect`/Create) carry the internal sentinel value;
      // report them as "nothing highlighted" so it never leaks to consumers.
      const publicValue = isOnSelectItemValue(highlightedValue)
        ? undefined
        : highlightedValue;
      onItemHighlightedProp?.(publicValue, details);

      if (publicValue === undefined) {
        return;
      }

      const highlightedOption = Array.from(
        contentRef.current?.querySelectorAll<HTMLElement>(
          "[data-tgph-combobox-option]",
        ) ?? [],
      ).find(
        (option) =>
          option.getAttribute("data-tgph-combobox-option-value") ===
          publicValue,
      );

      if (highlightedOption) {
        const focusEvent = new FocusEvent("focusin", { bubbles: true });
        legacyHighlightFocusEvents.add(focusEvent);
        highlightedOption.dispatchEvent(focusEvent);
      }
    },
    [onItemHighlightedProp],
  );

  // Base UI otherwise derives the anchor-input text from the raw item value.
  // Resolve it through Telegraph's option model so a selected `push` option
  // displays its human-readable `Push` label. Keep the action sentinel's exact
  // serialization because free-text mode uses it to cancel action-row fills.
  const itemToStringLabel = useCallback(
    (itemValue: unknown) => {
      if (isOnSelectItemValue(itemValue)) return ON_SELECT_ITEM_FILL;
      if (typeof itemValue !== "string") return "";

      return (
        getOptionAccessibleLabel(
          options.find((option) => option.value === itemValue),
        ) ?? itemValue
      );
    },
    [options],
  );

  return (
    <ComboboxContext.Provider
      value={{
        contentId,
        triggerId,
        value,
        // Context consumers handle the runtime single/multi branches below, so
        // expose one setter shape here and narrow it at the selection site.
        onValueChange: setValue as (value: ComboboxValue | undefined) => void,
        placeholder,
        open,
        setOpen,
        onOpenToggle,
        closeOnSelect,
        clearable,
        disabled,
        searchQuery: activeSearchQuery,
        setSearchQuery: clearSearchQuery,
        hasSearch: searchControl !== undefined,
        triggerRef: triggerRef as RefObject<HTMLButtonElement>,
        searchRef: searchRef as RefObject<HTMLInputElement>,
        contentRef: contentRef as RefObject<HTMLDivElement>,
        anchorInputRef: anchorInputRef as RefObject<HTMLInputElement>,
        onEscapeKeyDownRef,
        errored,
        layout,
        options,
        manualFiltering,
        defaultScrollToValue,
        createIndex,
        optionCloseOnClickRef,
        resolvedSelectionMode,
        hasAnchorInput,
        anchorInputId,
      }}
    >
      {isNoneMode ? (
        <BaseAutocomplete.Root
          // Same AriaCombobox engine with selectionMode="none" baked in; its
          // value/onValueChange ARE the input text (no selected value). Telegraph
          // always controls that value so a controlled `inputValue` is lossless
          // and action-item fills can be cancelled at `handleInputValueChange`.
          value={resolvedInputValue}
          onValueChange={
            handleInputValueChange as (value: string, details: unknown) => void
          }
          // Filtering/inline-autocomplete behavior (default "list").
          mode={autocompleteMode}
          open={open}
          onOpenChange={
            handleBaseOpenChange as (open: boolean, details: unknown) => void
          }
          // Children mode: options are mounted `Combobox.Item`s; this list only
          // re-seeds the type-to-filter highlight and bounds it to the rows.
          filteredItems={filteredItems}
          itemToStringValue={itemToStringLabel}
          autoHighlight={autoHighlightProp ?? false}
          openOnInputClick={openOnInputClickProp}
          loopFocus={loopFocusProp}
          onItemHighlighted={
            handleBaseItemHighlighted as (
              value: unknown,
              details: unknown,
            ) => void
          }
          actionsRef={actionsRef}
          modal={modal}
          disabled={disabled}
        >
          {children}
        </BaseAutocomplete.Root>
      ) : (
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
          onInputValueChange={
            handleInputValueChange as (value: string, details: unknown) => void
          }
          // Preserve the historical typeahead: seed the highlight on the first
          // match after the query changes so pressing Enter selects it.
          autoHighlight={autoHighlightProp ?? true}
          // Telegraph controls the engine input from either Root input props,
          // controlled Search props, or its mirrored internal query. Keeping a
          // single source of truth makes consumer rewrites and clear actions
          // render without racing Base UI's internal input state.
          inputValue={searchQuery}
          openOnInputClick={openOnInputClickProp}
          loopFocus={loopFocusProp}
          onItemHighlighted={
            handleBaseItemHighlighted as (
              value: unknown,
              details: unknown,
            ) => void
          }
          actionsRef={actionsRef}
          // The rendered options stay the `Combobox.Option` children; this list
          // only exists so Base UI re-seeds the type-to-filter highlight per
          // keystroke and bounds it to the mounted rows. See the `filteredItems`
          // memo above for why it is computed conservatively.
          filteredItems={filteredItems}
          itemToStringLabel={itemToStringLabel}
          modal={modal}
          disabled={disabled}
        >
          {children}
        </BaseCombobox.Root>
      )}
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

type TriggerBaseProps = RemappedOmit<ButtonRootProps, "children">;

export type TriggerProps<V extends ChildrenValue> = TriggerBaseProps & {
  placeholder?: string;
  children?: ReactNode | ((props: { value: ChildrenFnValue<V> }) => ReactNode);
};

const Trigger = <V extends ChildrenValue>({
  size = "1",
  children,
  tgphRef,
  ...props
}: TriggerProps<V>) => {
  const context = useContext(ComboboxContext);
  // Compose a consumer ref with the internal trigger ref instead of letting the
  // spread below clobber it — the internal ref drives keyboard-close refocus.
  const composedTriggerRef = useComposedRefs(
    tgphRef as Ref<HTMLButtonElement>,
    context.triggerRef,
  );
  const hasTags = isMultiSelect(context.value) && context.value.length > 0;

  const currentValue = useMemo<
    DefinedOption | Array<DefinedOption | undefined> | undefined
  >(() => {
    if (!context.value) return undefined;
    if (isSingleSelect(context.value)) {
      // Convert the public selected value back to the option object so custom
      // trigger render functions receive the same shape as before the rewrite.
      return getCurrentOption(context.value, context.options);
    }
    if (isMultiSelect(context.value)) {
      // Preserve array order from the selected value while resolving each entry
      // against the current option list.
      return context.value.map((v) => getCurrentOption(v, context.options));
    }
    return undefined;
  }, [context.value, context.options]);

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
      onMouseDown={(event: ReactMouseEvent<HTMLElement>) => {
        if (event.button !== 0 || context.open || context.disabled) return;

        // Base UI defers non-input trigger opening to the next animation frame.
        // The menu-backed combobox opened during mousedown, and consumers use
        // that turn to start lazy option loading before the click completes.
        // Replace Base UI's toggle for this press so it cannot observe the
        // synchronously opened store and interpret the same press as a close.
        context.setOpen(true);
        (event as BaseUIMouseEvent).preventBaseUIHandler?.();
      }}
      render={createTgphBaseUIRender(
        <TelegraphButton.Root
          id={context.triggerId}
          type="button"
          bg="surface-1"
          variant="outline"
          align="center"
          minH={TRIGGER_MIN_HEIGHT[size]}
          // `auto` (not `full`) so the trigger grows with wrapped tags but never
          // stretches to a definite-height ancestor. Button.Root would otherwise
          // apply its fixed per-size `h`, which clips the wrap layout.
          h="auto"
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
          tgphRef={composedTriggerRef}
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

// A `@telegraph/input`-styled anchor/trigger. Rendered as a direct child of
// `Combobox.Root` (outside the positioner) so Base UI's `Combobox.Input` becomes
// the anchor: it owns `role="combobox"`, aria-expanded/controls/activedescendant,
// and virtual focus, and the popup opens beneath it (bound to its width via
// `--anchor-width`). The real `<input>`, its value, onChange, role and aria all
// come from Base UI's Input; Telegraph only supplies the styled shell/slots.
//
// `value`/`onChange` are intentionally omitted from the public props: the engine
// owns the input text (drive it with `Combobox.Root`'s `inputValue` /
// `onInputValueChange`, or its `value` in `selectionMode="none"`). An input
// rendered inside `Combobox.Content` is a `Combobox.Search`, not this part.
export type InputProps = RemappedOmit<
  TelegraphInputProps<"input">,
  "value" | "onChange" | "defaultValue"
>;

const Input = ({
  size = "2",
  variant = "outline",
  placeholder,
  errored,
  disabled,
  LeadingComponent,
  TrailingComponent,
  tgphRef,
  ...props
}: InputProps) => {
  const context = useContext(ComboboxContext);
  const composedRef = useComposedRefs(tgphRef, context.anchorInputRef);
  // Resolve disabled/errored from the local prop, falling back to Root-level.
  const isDisabled = disabled ?? context.disabled;
  const isErrored = errored ?? context.errored;

  return (
    <BaseCombobox.Input
      // Feed disabled to Base UI's Input (not only the styled child) so the
      // engine's own store/behavior — keyboard, open-on-click, ARIA — matches
      // the visual state even when disabled is set locally rather than on Root.
      // (Base UI computes disabled as fieldDisabled || store.disabled || this.)
      disabled={isDisabled}
      // Do NOT pass a controlled `value` to Base UI's input: the anchor input's
      // value is owned by the engine (fed from the Root's controlled input text),
      // which is what keeps fast typing lossless. A DOM-controlled value here is
      // exactly the path that raced Base UI and dropped keystrokes in T4.
      render={createTgphBaseUIRender(
        <TelegraphInput
          id={context.anchorInputId}
          size={size}
          variant={variant}
          // Fall back to the Root-level placeholder/errored/disabled when unset.
          placeholder={placeholder ?? context.placeholder}
          errored={isErrored}
          disabled={isDisabled}
          LeadingComponent={LeadingComponent}
          TrailingComponent={TrailingComponent}
          // Point at the listbox (the Telegraph List forces id={contentId}); the
          // child's explicit value wins the render merge over Base UI's internal
          // list id, matching how Trigger and Search wire aria-controls.
          aria-controls={context.contentId}
          data-tgph-combobox-input
          {...props}
          tgphRef={composedRef}
        />,
      )}
    />
  );
};

// The public Content surface mirrors the props consumers relied on from the
// menu-backed implementation. Positioning props flow to the Base UI positioner;
// the remainder are Stack style props for the popup surface.
//
// Source the polymorphic element props from `PolymorphicProps<T>` and the Stack
// style props from the *non-generic* Stack. Wrapping the generic `typeof
// Stack<T>` in `Omit<…>` produces a deferred mapped type, and TypeScript then
// fails to compute a contextual type for the sibling dismiss-handler callbacks
// below — their `event` param silently widens to `any` at the JSX call site.
// That is exactly what let a stale Radix-shaped handler reading
// `event.detail.originalEvent` compile and crash at runtime (KNO-14309). Keeping
// the `Omit` off the generic makes each handler's `event` resolve to its
// concrete `Event` type. Mirrors `Menu.Content`.
export type ContentProps<T extends TgphElement = "div"> = PolymorphicProps<T> &
  Omit<StackProps, "align" | "as"> & {
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
    // Runs when focus is about to move into the popup on open. Prevent default to
    // place focus yourself (bridged onto Base UI's `initialFocus`).
    onOpenAutoFocus?: LegacyDismissEventHandler;
    onEscapeKeyDown?: (event: KeyboardEvent) => void;
  };

const Content = <T extends TgphElement = "div">({
  style,
  children,
  onEscapeKeyDown,
  onCloseAutoFocus,
  onOpenAutoFocus,
  finalFocus,
  forceMount,
  side = "bottom",
  align = "start",
  sideOffset = 4,
  alignOffset,
  collisionPadding,
  sticky,
  hideWhenDetached,
  onKeyDown: onKeyDownProp,
  onFocus: onFocusProp,
  tgphRef,
  ...props
}: ContentProps<T>) => {
  const context = useContext(ComboboxContext);
  const composedRef = useComposedRefs<unknown>(tgphRef, context.contentRef);
  const internalContentRef = useRef<HTMLDivElement>(null);
  const pointerDownRef = useRef(false);

  const [height, setHeight] = useState(0);
  const [initialAnimationComplete, setInitialAnimationComplete] =
    useState(false);

  // Root can identify direct Combobox.Search and Combobox.Input elements before
  // the popup mounts. Wrapper components cannot be inspected before React
  // renders them, so they keep the hidden virtual-focus input as a fallback.
  const needsHiddenInput = !context.hasSearch && !context.hasAnchorInput;

  // Register the escape handler so the Root-level open-change bridge can call it
  // and honor a consumer preventing dismissal.
  useEffect(() => {
    const onEscapeKeyDownRef = context.onEscapeKeyDownRef;
    if (!onEscapeKeyDownRef) return undefined;

    onEscapeKeyDownRef.current = onEscapeKeyDown;
    return () => {
      onEscapeKeyDownRef.current = undefined;
    };
  }, [onEscapeKeyDown, context.onEscapeKeyDownRef]);

  // Focus the in-popup input synchronously on open. Base UI moves focus there
  // itself, but only on a later animation frame, which would drop keystrokes
  // typed immediately after opening. Focusing here (a layout effect) lands
  // focus before that frame; Base UI's later focus targets the same input.
  // Skipped in the input-as-trigger arrangement (focus stays on the anchor
  // input) and when a consumer supplies `onOpenAutoFocus` (they own open-focus).
  useLayoutEffect(() => {
    if (!context.open || context.hasAnchorInput || onOpenAutoFocus) return;
    const content = context.contentRef?.current;
    const input =
      content?.querySelector<HTMLInputElement>("[data-tgph-combobox-search]") ??
      content?.querySelector<HTMLInputElement>(
        "[data-tgph-combobox-input-hidden]",
      );
    input?.focus();
  }, [
    context.open,
    context.contentRef,
    context.hasAnchorInput,
    needsHiddenInput,
    onOpenAutoFocus,
  ]);

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
      // Input-as-trigger: focus lives on the anchor input throughout, so let Base
      // UI keep it there (there is no button trigger to return focus to).
      if (context.hasAnchorInput) {
        return true;
      }
      return (closeType: string) =>
        closeType === "keyboard" ? context.triggerRef?.current : true;
    }

    return () => {
      const event = new Event("closeAutoFocus", { cancelable: true });
      onCloseAutoFocus(event);
      return event.defaultPrevented ? false : true;
    };
  }, [
    finalFocus,
    onCloseAutoFocus,
    context.triggerRef,
    context.hasAnchorInput,
  ]);

  // Bridge the old `onOpenAutoFocus` onto Base UI's `initialFocus`. Preventing
  // the legacy event cancels Base UI's move; otherwise return the popup input so
  // side-effect-only handlers retain the historical default focus behavior.
  // The layout effect above yields whenever this handler exists so prevention
  // is observed before any focus move. Mirrors the close-autofocus bridge.
  const resolvedInitialFocus = useMemo<
    ((openType: string) => unknown) | undefined
  >(() => {
    if (!onOpenAutoFocus) {
      return undefined;
    }
    return () => {
      const event = new Event("openAutoFocus", { cancelable: true });
      onOpenAutoFocus(event);
      if (event.defaultPrevented) {
        return false;
      }
      return (
        context.anchorInputRef?.current ??
        context.searchRef?.current ??
        context.contentRef?.current?.querySelector<HTMLInputElement>(
          "[data-tgph-combobox-search], [data-tgph-combobox-input-hidden]",
        ) ??
        null
      );
    };
  }, [
    onOpenAutoFocus,
    context.anchorInputRef,
    context.searchRef,
    context.contentRef,
  ]);

  const stackProps = props as StackProps;

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
          initialFocus={
            resolvedInitialFocus as TgphComponentProps<
              typeof BaseCombobox.Popup
            >["initialFocus"]
          }
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
              aria-labelledby={
                context.hasAnchorInput
                  ? context.anchorInputId
                  : context.triggerId
              }
              data-tgph-combobox-content
              data-tgph-combobox-content-open={context.open}
              tgphRef={composedRef as StackProps["tgphRef"]}
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
              onPointerDownCapture={(event) => {
                stackProps.onPointerDownCapture?.(event);
                pointerDownRef.current = true;
              }}
              onPointerUpCapture={(event) => {
                stackProps.onPointerUpCapture?.(event);
                // A pointer-generated click can move focus after pointerup.
                // Keep the marker through that click, then clear it next task.
                window.setTimeout(() => {
                  pointerDownRef.current = false;
                }, 0);
              }}
              onPointerCancelCapture={(event) => {
                stackProps.onPointerCancelCapture?.(event);
                pointerDownRef.current = false;
              }}
              onKeyDown={(event: ReactKeyboardEvent<HTMLDivElement>) => {
                onKeyDownProp?.(event);
                if (context.open) {
                  event.stopPropagation();
                }
              }}
              onFocus={(event: ReactFocusEvent<HTMLDivElement>) => {
                onFocusProp?.(event);
                const isLegacyHighlightFocusEvent =
                  legacyHighlightFocusEvents.has(event.nativeEvent);
                if (
                  !pointerDownRef.current &&
                  event.target instanceof Element &&
                  event.target.closest("[data-tgph-combobox-option]")
                ) {
                  // TRANSITIONAL compatibility bridge: Base UI redirects option
                  // focus to its input. Preserve explicit `.focus()` calls used
                  // by legacy virtualizers. New consumers must use
                  // `onItemHighlighted` on `Combobox.Root`; remove this bridge
                  // in a future major release.
                  (event as BaseUIFocusEvent).preventBaseUIHandler?.();
                }
                if (isLegacyHighlightFocusEvent) {
                  // Keep the compatibility signal inside the popup. Document-
                  // level focus traps must only observe real focus movement.
                  event.stopPropagation();
                }
              }}
            >
              {/* Virtual focus needs an input in the popup even without a
                  visible Search; mount a hidden one in that case (but not when an
                  anchor `Combobox.Input` already owns the combobox input). */}
              {needsHiddenInput ? (
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
              {/* Options animate their selection checkmark with `motion/react-m`,
                  which needs a `LazyMotion` feature provider. The popup renders in
                  a portal (outside the trigger's own provider), so wrap it here —
                  mirrors `Menu.Content`, whose provider the menu-backed combobox
                  used to rely on. */}
              <LazyMotion features={domAnimation}>
                <Stack direction="column" gap="1" tgphRef={internalContentRef}>
                  {children}
                </Stack>
              </LazyMotion>
            </Stack>,
          )}
        />
      </BaseCombobox.Positioner>
    </BaseCombobox.Portal>
  );
};

// `PolymorphicProps<T>` + the non-generic `StackProps` (see `ContentProps`);
// a bare `typeof Stack<T>` defers the mapped type and drops `children`/`as`.
export type OptionsProps<T extends TgphElement = "div"> = PolymorphicProps<T> &
  Omit<StackProps, "as">;

const Options = <T extends TgphElement = "div">({
  tgphRef,
  ...props
}: OptionsProps<T>) => {
  const context = useContext(ComboboxContext);
  const optionsRef = useRef<HTMLDivElement>(null);
  const composedRef = useComposedRefs<unknown>(tgphRef, optionsRef);

  // Scroll to the selected option or defaultScrollToValue when the combobox opens.
  useEffect(() => {
    let rafId: number | undefined;
    if (context.open && optionsRef.current) {
      // Small delay to ensure the DOM has rendered
      rafId = requestAnimationFrame(() => {
        const selectedValue = isSingleSelect(context.value)
          ? context.value
          : isMultiSelect(context.value) && context.value.length > 0
            ? context.value[0]
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
    // Cancel a still-pending scroll if the popup closes or deps change first.
    return () => {
      if (rafId !== undefined) cancelAnimationFrame(rafId);
    };
  }, [context.open, context.value, context.defaultScrollToValue]);

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
          tgphRef={composedRef as StackProps["tgphRef"]}
          {...(props as StackProps)}
        />,
      )}
    />
  );
};

// Keep the `Omit` off the generic `typeof OptionItem<T>`: wrapping it defers the
// mapped type and widens the sibling `onSelect` event to `any` at the JSX call
// site — the KNO-14309 failure documented on `ContentProps` above. Source the
// element props from `PolymorphicProps<T>` and the row props from the
// non-generic `OptionItemProps<"div">`.
export type OptionProps<T extends TgphElement = "div"> = PolymorphicProps<T> &
  Omit<OptionItemProps<"div">, "as" | "label"> & {
    value: DefinedOption["value"];
    label?: DefinedOption["label"];
    selected?: boolean | null;
    closeOnClick?: boolean;
    onSelect?: (event: Event) => void;
  };

const Option = <T extends TgphElement = "div">({
  value,
  label,
  selected,
  closeOnClick,
  onSelect,
  children,
  disabled,
  tgphRef,
  ...props
}: OptionProps<T>) => {
  const context = useContext(ComboboxContext);
  const explicitIndex = useContext(CreateIndexContext);
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
    // The consumer owns which options render (see `manualFiltering`).
    context.manualFiltering ||
    !context.searchQuery ||
    doesOptionMatchSearchQuery({
      children: label || children,
      value,
      renderedText,
      searchQuery: context.searchQuery,
    }) ||
    // An option whose visible text is produced by a child component can't be
    // matched until it has mounted and captured that text. If it first mounts
    // while a query is already active (the async/server-search case), show it
    // rather than hide it forever; once captured it filters normally.
    (renderedText.length === 0 &&
      optionRendersUnsearchableText(label ?? children));

  const isSelected = isMultiSelect(contextValue)
    ? contextValue.includes(value)
    : contextValue === value;

  // Depend on the specific stable context values rather than the whole (per-
  // render) context object, so this callback isn't rebuilt every Root render.
  const { closeOnSelect, onValueChange, setOpen } = context;
  const handleClick = useCallback(
    (event: ReactMouseEvent<HTMLElement>) => {
      if (disabled) {
        return;
      }

      // The old menu-backed options contained selection clicks and prevented
      // polymorphic anchors from navigating after a value was chosen.
      event.stopPropagation();
      // Prevent the browser default on the native event without marking Base
      // UI's synthetic event handled; its same-element selection handler still
      // needs to commit the option after this callback returns.
      event.nativeEvent.preventDefault();

      if (closeOnClick && context.optionCloseOnClickRef) {
        context.optionCloseOnClickRef.current = true;
        queueMicrotask(() => {
          if (context.optionCloseOnClickRef) {
            context.optionCloseOnClickRef.current = false;
          }
        });
      }

      if (onSelect) {
        // Base UI has no per-item select callback, and its own commit for this
        // item is canceled at the Root value bridge (the item is given no
        // committable value), so run the override here.
        if (closeOnSelect === true) {
          setOpen(false);
        }

        onSelect(event.nativeEvent);
        if (!closeOnSelect && closeOnClick) {
          setOpen(false);
        }
        return;
      }

      // Base UI deliberately leaves anchors to native navigation and skips its
      // selection bridge. Telegraph historically selected polymorphic links
      // while preventing navigation, so commit that case directly.
      const isLink =
        event.currentTarget instanceof HTMLAnchorElement &&
        event.currentTarget.hasAttribute("href");
      if (!isLink) {
        return;
      }

      if (closeOnSelect === true) {
        setOpen(false);
      }

      if (isMultiSelect(contextValue)) {
        const nextValue = isSelected
          ? contextValue.filter((entry) => entry !== value)
          : [...contextValue, value];
        (onValueChange as MultiSelect["onValueChange"])?.(nextValue);
      } else {
        (onValueChange as SingleSelect["onValueChange"])?.(value);
      }

      if (!closeOnSelect && closeOnClick) {
        setOpen(false);
      }
    },
    [
      onSelect,
      disabled,
      closeOnClick,
      closeOnSelect,
      setOpen,
      contextValue,
      context.optionCloseOnClickRef,
      onValueChange,
      isSelected,
      value,
    ],
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
      index={explicitIndex}
      disabled={disabled}
      nativeButton={resolveButtonNativeButton({
        as: props.as ?? "div",
        disabled,
      })}
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
          // TRANSITIONAL compatibility bridge: Base UI uses virtual focus, but
          // legacy consumers also focus option elements directly to drive
          // virtualized windows. Keep them out of the tab order while retaining
          // that programmatic focus contract. New consumers must use
          // `onItemHighlighted` on `Combobox.Root`; remove this bridge in a
          // future major release.
          tabIndex={-1}
          tgphRef={composedRef as OptionItemProps<"div">["tgphRef"]}
          {...(props as OptionItemProps<"div">)}
          disabled={disabled}
        >
          {label || children || value}
        </OptionItem>,
      )}
    />
  );
};

// Root bridges these text props into Base UI's input state. Controlled Search
// also restores the old contract where the consumer owns option filtering.
export type SearchProps = RemappedOmit<
  TelegraphInputProps<"input">,
  "value" | "defaultValue"
> & {
  label?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

const Search = ({
  label = "Search",
  placeholder = "Search",
  tgphRef,
  value: _valueProp,
  defaultValue: _defaultValueProp,
  onValueChange: onValueChangeProp,
  onKeyDown: onKeyDownProp,
  ...props
}: SearchProps) => {
  const id = useId();
  const context = useContext(ComboboxContext);
  const composedRef = useComposedRefs(tgphRef, context.searchRef);

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
                    context.setSearchQuery?.("");
                    onValueChangeProp?.("");
                  }}
                />
              ) : null
            }
            data-tgph-combobox-search
            aria-controls={context.contentId}
            onKeyDown={(event: ReactKeyboardEvent<HTMLInputElement>) => {
              onKeyDownProp?.(event);
              if (event.key !== "Escape") {
                event.stopPropagation();
              }
            }}
            {...props}
            tgphRef={composedRef}
          />,
        )}
      />
    </Box>
  );
};

type SearchControl = Pick<
  SearchProps,
  "value" | "defaultValue" | "onValueChange"
>;

const findSearchControl = (children: ReactNode): SearchControl | undefined => {
  let found: SearchControl | undefined;

  Children.forEach(children, (child) => {
    if (found || !isValidElement(child)) return;
    const element = child as ReactElement<
      SearchControl & { children?: ReactNode }
    >;

    if (element.type === Search) {
      found = element.props;
      return;
    }

    if (element.props.children) {
      found = findSearchControl(element.props.children);
    }
  });

  return found;
};

// Combobox.Option matches by type; a truthy `value` prop keeps consumer
// wrappers around Option matching. Controlled inputs also carry `value` and
// would become phantom options, so a change handler excludes an element
// unless option-shaped props (label/selected/onSelect/children) mark it as
// a wrapped option.
const isOptionElement = (element: ReactElement) => {
  if (element.type === Option) return true;
  if (element.type === Search) return false;
  // The anchor input is not an option (and carries no committable value).
  if (element.type === Input) return false;

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

const isOptionsElement = (element: ReactElement) => element.type === Options;

// Walk the Root children for a `Combobox.Input` anchor so Root can preserve its
// id as well as flag the input-as-trigger arrangement (Content then skips its
// hidden popup input, and focus/finalFocus stay on the anchor input).
const findAnchorInput = (children: ReactNode): ReactElement | undefined => {
  let found: ReactElement | undefined;
  Children.forEach(children, (child) => {
    if (found || !(typeof child === "object" && child !== null)) return;
    const element = child as ReactElement<{ children?: ReactNode }>;
    if (element.type === Input) {
      found = element;
      return;
    }
    // Stop at Content: an input inside the popup is a Search, not the anchor.
    if (element.type === Content) {
      return;
    }
    if (element.props?.children) {
      found = findAnchorInput(element.props.children);
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

export type EmptyProps<T extends TgphElement = "div"> = PolymorphicProps<T> &
  Omit<StackProps, "as"> & {
    icon?: IconProps | null;
    message?: string | null;
  };

const Empty = <T extends TgphElement = "div">({
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
        {...(props as StackProps)}
      >
        {icon === null ? <></> : <Icon {...icon} />}
        {message === null ? <></> : <Text as="span">{message}</Text>}
      </Stack>
    );
  }
};

export type CreateProps<T extends TgphElement = "div"> = PolymorphicProps<T> &
  Omit<OptionItemProps<"div">, "as"> & {
    leadingText?: string;
    values?: Array<string>;
    onCreate?: (value: string) => void;
  };

const Create = <T extends TgphElement = "div">({
  leadingText = "Create",
  values,
  onCreate,
  selected = null,
  ...props
}: CreateProps<T>) => {
  const context = useContext(ComboboxContext);

  const variableAlreadyExists = useCallback(
    (searchQuery: string | undefined) => {
      if (!searchQuery || !values || values.length === 0) return false;
      return values.includes(searchQuery);
    },
    [values],
  );

  if (context.searchQuery && !variableAlreadyExists(context.searchQuery)) {
    return (
      <CreateIndexContext.Provider value={context.createIndex}>
        <Option
          leadingIcon={{ icon: Plus, "aria-hidden": true }}
          mx="1"
          value={context.searchQuery}
          label={`${leadingText} "${context.searchQuery}"`}
          selected={selected}
          onSelect={() => {
            if (onCreate && context.searchQuery) {
              onCreate(context.searchQuery);

              context.setSearchQuery?.("");
            }
          }}
          // Forward the remaining Create props to Option, minus the ones set
          // explicitly above. The spread is last, so its type must not re-declare
          // them or `value` collides (TS2783). Mirrors Button.Icon's Omit cast.
          {...(props as Omit<
            OptionProps<"div">,
            "value" | "label" | "selected" | "onSelect" | "leadingIcon" | "mx"
          >)}
        />
      </CreateIndexContext.Provider>
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
  Input: typeof Input;
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
  Input,
  Content,
  Options,
  Option,
  Search,
  Empty,
  Create,
  Primitives,
});

export { Combobox };
