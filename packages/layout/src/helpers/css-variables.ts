import {
  BREAKPOINTS,
  Responsive,
  getValueForEachBreakpoint,
  isResponsiveObject,
} from "./breakpoints";

type CssVariableProp = {
  rule: string;
  type: string;
  default?: string;
} & (
  | {
      ordering?: "trbl";
      direction?: "all" | "top" | "right" | "bottom" | "left" | "x" | "y";
    }
  | {
      ordering?: "clockwise";
      direction?:
        | "all"
        | "topLeft"
        | "topRight"
        | "bottomRight"
        | "bottomLeft"
        | "top"
        | "right"
        | "bottom"
        | "left";
    }
);

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

const TRBL_ARRAY_MAP = {
  top: 0,
  right: 1,
  bottom: 2,
  left: 3,
};

const CLOCKWISE_ARRAY_MAP = {
  topLeft: 0,
  topRight: 1,
  bottomRight: 2,
  bottomLeft: 3,
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

  const directionalValues = [
    currentValueArray?.[0] || 0,
    currentValueArray?.[1] || 0,
    currentValueArray?.[2] || 0,
    currentValueArray?.[3] || 0,
  ];

  if (direction === "all") {
    return formatCssVariableValue({ value, prop });
  }

  if (prop.ordering === "clockwise") {
    if (direction === "top") {
      directionalValues[CLOCKWISE_ARRAY_MAP["topLeft"]] =
        formatCssVariableValue({
          value,
          prop,
        });
      directionalValues[CLOCKWISE_ARRAY_MAP["topRight"]] =
        formatCssVariableValue({
          value,
          prop,
        });
    }

    if (direction === "right") {
      directionalValues[CLOCKWISE_ARRAY_MAP["topRight"]] =
        formatCssVariableValue({
          value,
          prop,
        });
      directionalValues[CLOCKWISE_ARRAY_MAP["bottomRight"]] =
        formatCssVariableValue({
          value,
          prop,
        });
    }

    if (direction === "bottom") {
      directionalValues[CLOCKWISE_ARRAY_MAP["bottomRight"]] =
        formatCssVariableValue({
          value,
          prop,
        });
      directionalValues[CLOCKWISE_ARRAY_MAP["bottomLeft"]] =
        formatCssVariableValue({
          value,
          prop,
        });
    }

    if (direction === "left") {
      directionalValues[CLOCKWISE_ARRAY_MAP["bottomLeft"]] =
        formatCssVariableValue({
          value,
          prop,
        });
      directionalValues[CLOCKWISE_ARRAY_MAP["topLeft"]] =
        formatCssVariableValue({
          value,
          prop,
        });
    }

    if (
      direction === "topLeft" ||
      direction === "topRight" ||
      direction === "bottomRight" ||
      direction === "bottomLeft"
    ) {
      directionalValues[CLOCKWISE_ARRAY_MAP[direction]] =
        formatCssVariableValue({
          value,
          prop,
        });
    }
  } else {
    if (direction === "x") {
      directionalValues[TRBL_ARRAY_MAP["left"]] = formatCssVariableValue({
        value,
        prop,
      });
      directionalValues[TRBL_ARRAY_MAP["right"]] = formatCssVariableValue({
        value,
        prop,
      });
    }

    if (direction === "y") {
      directionalValues[TRBL_ARRAY_MAP["top"]] = formatCssVariableValue({
        value,
        prop,
      });
      directionalValues[TRBL_ARRAY_MAP["bottom"]] = formatCssVariableValue({
        value,
        prop,
      });
    }

    if (
      direction === "top" ||
      direction === "bottom" ||
      direction === "left" ||
      direction === "right"
    ) {
      directionalValues[TRBL_ARRAY_MAP[direction]] = formatCssVariableValue({
        value,
        prop,
      });
    }
  }

  return directionalValues.join(" ");
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
