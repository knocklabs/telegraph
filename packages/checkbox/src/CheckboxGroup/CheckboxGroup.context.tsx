import { createContext, useContext } from "react";

import type {
  CheckboxColor,
  CheckboxSize,
} from "../Checkbox/Checkbox.constants";

/**
 * Group-level defaults that individual checkboxes inherit.
 *
 * This lives in its own module so `Checkbox` can read it without importing
 * `CheckboxGroup` (which renders checkboxes), keeping the dependency in one
 * direction.
 */
export type CheckboxGroupContextType = {
  size?: CheckboxSize;
  color?: CheckboxColor;
  disabled?: boolean;
};

const CheckboxGroupContext = createContext<CheckboxGroupContextType | null>(
  null,
);

const useCheckboxGroupContext = () => useContext(CheckboxGroupContext);

export { CheckboxGroupContext, useCheckboxGroupContext };
