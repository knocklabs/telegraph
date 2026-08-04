import { createContext, useContext } from "react";

import type {
  CheckboxColor,
  CheckboxSize,
} from "../Checkbox/Checkbox.constants";

// Group-level defaults that individual checkboxes inherit. Its own module so
// `Checkbox` can read it without importing `CheckboxGroup`, which renders
// checkboxes — that keeps the dependency pointing one way.
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
