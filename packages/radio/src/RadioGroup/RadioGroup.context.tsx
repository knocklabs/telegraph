import { createContext, useContext } from "react";

import type { RadioColor, RadioSize } from "../Radio/Radio.constants";

// Group-level defaults that individual radios inherit. Its own module so
// `Radio` can read it without importing `RadioGroup`, which renders radios —
// that keeps the dependency pointing one way.
export type RadioGroupContextType = {
  size?: RadioSize;
  color?: RadioColor;
  disabled?: boolean;
};

const RadioGroupContext = createContext<RadioGroupContextType | null>(null);

const useRadioGroupContext = () => useContext(RadioGroupContext);

export { RadioGroupContext, useRadioGroupContext };
