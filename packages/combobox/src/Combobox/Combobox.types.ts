import type {
  ComboboxRootActions,
  ComboboxRootChangeEventDetails,
  ComboboxRootChangeEventReason,
  ComboboxRootHighlightEventDetails,
  ComboboxRootHighlightEventReason,
} from "@base-ui/react/combobox";

export type DefinedOption = {
  value: string;
  label?: string | React.ReactNode;
};
export type Option = DefinedOption | string | React.ReactNode;

// How the combobox remembers a selection. `undefined` (the historical default)
// infers single vs. multiple from the `value` shape; `"none"` is the free-text
// (Autocomplete) arrangement that has no selected value.
export type ComboboxSelectionMode = "single" | "multiple" | "none";

// Base UI describes every open/value/input change with a cancelable details
// object. These re-exports surface that surface (reason + `cancel()`) on the
// public Telegraph API without leaking the `@base-ui/react` import onto
// consumers. Both roots (Combobox + Autocomplete) share the same union.
export type ComboboxChangeReason = ComboboxRootChangeEventReason;
export type ComboboxChangeDetails = ComboboxRootChangeEventDetails;
export type ComboboxHighlightReason = ComboboxRootHighlightEventReason;
export type ComboboxHighlightDetails = ComboboxRootHighlightEventDetails;

// Imperative handle exposed through `actionsRef` (e.g. `unmount()` after a
// consumer-owned closing animation finishes).
export type ComboboxActions = ComboboxRootActions;

export type SingleSelect = {
  value?: Option;
  onValueChange?: (value: Option | undefined) => void;
};

export type MultiSelect = {
  value?: Array<Option>;
  onValueChange?: (value: Array<Option>) => void;
};
