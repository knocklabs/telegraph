import {
  BREAKPOINTS,
  Responsive,
  getValueForEachBreakpoint,
  isResponsiveObject,
} from "./breakpoints";

type CssVariableProp = {
  rule: string;
  type: string;
  direction?: string;
  default?: string;
};

type FormatCssVariableValueArgs = {
  value: string | boolean;
  prop: CssVariableProp;
};
const formatCssVariableValue = ({
  value,
  prop,
}: FormatCssVariableValueArgs): string => {
  if (!value) return "";
  const type = prop.type === "color" ? "" : `-${prop.type}`;

  if (value === true) {
    return `var(--tgph${type}-${prop.default})`;
  }

  return `var(--tgph${type}-${value})`;
};

type FormatDirectionalCssVariablesArgs = {
  cssVariables: Record<string, string>;
  prop: CssVariableProp;
  direction: string;
  value: string | true;
  type: string;
};

const formatDirectionalCssVariables = ({
  cssVariables,
  value,
  prop,
  direction = "all",
}: FormatDirectionalCssVariablesArgs) => {
  const currentValueOfCssVariable = cssVariables[`--tgph-${prop.rule}`] || "";
  const currentValueArray = currentValueOfCssVariable
    ? currentValueOfCssVariable.split(" ")
    : [];

  const directionalValues = {
    top: currentValueArray?.[0] || 0,
    right: currentValueArray?.[1] || 0,
    bottom: currentValueArray?.[2] || 0,
    left: currentValueArray?.[3] || 0,
  };

  if (direction === "all") {
    return formatCssVariableValue({ value, prop });
  }

  if (direction === "x") {
    directionalValues.left = formatCssVariableValue({ value, prop });
    directionalValues.right = formatCssVariableValue({ value, prop });
  }

  if (direction === "y") {
    directionalValues.top = formatCssVariableValue({ value, prop });
    directionalValues.bottom = formatCssVariableValue({ value, prop });
  }

  if (
    direction === "top" ||
    direction === "bottom" ||
    direction === "left" ||
    direction === "right"
  ) {
    directionalValues[direction] = formatCssVariableValue({ value, prop });
  }

  return `${directionalValues.top} ${directionalValues.right} ${directionalValues.bottom} ${directionalValues.left}`;
};

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
  if (prop.direction) {
    return formatDirectionalCssVariables({
      cssVariables,
      prop,
      value,
      direction: prop.direction,
      type: prop.type,
    });
  }

  return formatCssVariableValue({ value, prop });
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
      if (typeof value === "string" || typeof value === "boolean") {
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
