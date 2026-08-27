import type {
  ComboboxRootHighlightEventDetails,
  ComboboxRootHighlightEventReason,
} from "@base-ui/react/combobox";
import type { ReactNode } from "react";

export type DefinedOption = {
  value: string;
  label?: string | ReactNode;
};

export type ComboboxValue = string | Array<string>;

export type ComboboxHighlightReason = ComboboxRootHighlightEventReason;
export type ComboboxHighlightDetails = ComboboxRootHighlightEventDetails;

export type SingleSelect = {
  value?: string;
  onValueChange?: (value: string | undefined) => void;
};

export type MultiSelect = {
  value?: Array<string>;
  onValueChange?: (value: Array<string>) => void;
};
