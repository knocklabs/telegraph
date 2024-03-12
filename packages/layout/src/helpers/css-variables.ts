import {
  BREAKPOINTS,
  Responsive,
  getValueForEachBreakpoint,
  isResponsiveObject,
} from "./breakpoints";
import { deriveSpacing } from "./spacing";

type CssVariableProp = { rule: string; type: string };
type ProcessCssVariableStringArgs = {
  prop: CssVariableProp;
  key: string;
  value: string;
  cssVariables: Record<string, string>;
};

const processCssVariableString = ({
  prop,
  value,
  cssVariables,
}: ProcessCssVariableStringArgs) => {
  if (prop.type.includes("spacing")) {
    const currentValueOfCssVariable = cssVariables[`--tgph-${prop.rule}`] || "";
    return deriveSpacing({
      value,
      type: prop.type,
      currentValue: currentValueOfCssVariable,
    });
  }

  return value;
};

type PropsToCssVariablesArgs = {
  props: Record<string, Responsive<string>>;
  ref: React.RefObject<HTMLElement>;
  propsMap: Record<string, CssVariableProp>;
};

export const propsToCssVariables = ({
  props,
  ref,
  propsMap,
}: PropsToCssVariablesArgs) => {
  if (!ref.current) return;

  const cssVariables: Record<string, string> = {};

  Object.entries(props).forEach(([key, value]) => {
    const prop = propsMap[key];

    if (prop) {
      if (typeof value === "string") {
        cssVariables[`--tgph-${prop.rule}`] = processCssVariableString({
          prop,
          key,
          value,
          cssVariables,
        });
      } else if (isResponsiveObject(value)) {
        const breakpointValues = getValueForEachBreakpoint(value);

        breakpointValues.forEach((breakpointValue, i) => {
          if (breakpointValue) {
            cssVariables[`--tgph-${prop.rule}-${BREAKPOINTS[i]}`] =
              processCssVariableString({
                prop,
                key,
                value: breakpointValue,
                cssVariables,
              });
          }
        });
      }
    }

    Object.entries(cssVariables).forEach(([cssVar, cssValue]) => {
      if (ref.current) {
        ref.current.style.setProperty(cssVar, cssValue);
      }
    });
  });
};
