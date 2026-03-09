type Direction =
  | "x"
  | "y"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "all"
  | "side-top"
  | "side-bottom"
  | "side-left"
  | "side-right";

type Axis = "x" | "y" | "both";

export type CssVarProp = {
  cssVar: string;
  value: string;
  direction?: Direction;
  axis?: Axis;
  interactive?: boolean;
};

// Supported pseudo-class states for the object syntax
export const PSEUDO_STATES = [
  "hover",
  "focus",
  "active",
  "focusWithin",
  "disabled",
] as const;

export type PseudoState = (typeof PSEUDO_STATES)[number];

// Maps pseudo state names to CSS variable prefixes
const PSEUDO_CSS_PREFIX: Record<PseudoState, string> = {
  hover: "hover",
  focus: "focus",
  active: "active",
  focusWithin: "focus-within",
  disabled: "disabled",
};

/**
 * Adds pseudo-class variant props to a style props type.
 *
 * Given a base style props type, this creates a new type that also
 * accepts `hover`, `focus`, `active`, `focusWithin`, and `disabled`
 * props as objects containing any of the base style props.
 *
 * @example
 * type BoxStyle = { bg: ColorToken; p: SpacingToken };
 * type BoxStyleWithPseudo = WithPseudo<BoxStyle>;
 * // Allows: { bg: "gray-2", hover: { bg: "gray-3" }, focus: { p: "4" } }
 */
export type WithPseudo<Props> = Props & {
  hover?: Partial<Props>;
  focus?: Partial<Props>;
  active?: Partial<Props>;
  focusWithin?: Partial<Props>;
  disabled?: Partial<Props>;
};

// Helper type to create negative spacing values
// This distributes over union types for proper type expansion
export type NegativeSpacing<T extends string | number | symbol> =
  T extends string ? `-${T}` : never;

// Type that allows both positive and negative spacing values for a given token type
// Using direct template literal for better TypeScript inference and autocomplete
export type WithNegativeSpacing<T extends string | number | symbol> =
  T extends string ? T | `-${T}` : T;

type ApplyDirectionProps = {
  currentValueOfCssVar: string | undefined;
  value: string;
  direction?: Direction;
};

// Helper function to parse directional values (handles calc() expressions)
const parseDirectionalValues = (
  value: string,
): [string, string, string, string] => {
  const matches: string[] = [];
  let current = "";
  let depth = 0;

  for (let i = 0; i < value.length; i++) {
    const char = value[i];

    if (char === "(") {
      depth++;
      current += char;
    } else if (char === ")") {
      depth--;
      current += char;
    } else if (char === " " && depth === 0) {
      // Space at depth 0 means we're between values
      if (current) {
        matches.push(current);
        current = "";
      }
    } else {
      current += char;
    }
  }

  // Push the last value
  if (current) {
    matches.push(current);
  }

  // Ensure we always have 4 values
  while (matches.length < 4) {
    matches.push("0");
  }

  return [
    matches[0] || "0",
    matches[1] || "0",
    matches[2] || "0",
    matches[3] || "0",
  ];
};

// For values like margin and padding that require 4 values
const applyDirectionalValues = ({
  currentValueOfCssVar = "0 0 0 0",
  value,
  direction,
}: ApplyDirectionProps) => {
  const [top, right, bottom, left] =
    parseDirectionalValues(currentValueOfCssVar);

  const newValues = {
    top,
    right,
    bottom,
    left,
  };

  if (direction === "top") {
    newValues.top = value;
  }

  if (direction === "right") {
    newValues.right = value;
  }

  if (direction === "bottom") {
    newValues.bottom = value;
  }

  if (direction === "left") {
    newValues.left = value;
  }

  if (direction === "all") {
    newValues.top = value;
    newValues.right = value;
    newValues.bottom = value;
    newValues.left = value;
  }

  if (direction === "x") {
    newValues.left = value;
    newValues.right = value;
  }

  if (direction === "y") {
    newValues.top = value;
    newValues.bottom = value;
  }

  // "side" direction is used for things like border-radius
  // where we are settings values on corners instead of sides
  // entire sides like padding and margin provide.
  if (direction === "side-top") {
    newValues.top = value;
    newValues.right = value;
  }

  if (direction === "side-bottom") {
    newValues.bottom = value;
    newValues.left = value;
  }

  if (direction === "side-left") {
    newValues.top = value;
    newValues.left = value;
  }

  if (direction === "side-right") {
    newValues.right = value;
    newValues.bottom = value;
  }

  const newValuesString = Object.values(newValues).join(" ");

  return newValuesString;
};

type ApplyAxisValuesProps = {
  currentValueOfCssVar: string | undefined;
  value: string;
  axis: Axis;
};

const applyAxisValues = ({
  currentValueOfCssVar = "visible visible",
  value,
  axis,
}: ApplyAxisValuesProps) => {
  const [x, y] = currentValueOfCssVar.split(" ");

  // If the axis is x, we need to set the x value and keep the y value.
  if (axis === "x") {
    return `${value} ${y}`;
  }

  // If the axis is y, we need to set the y value and keep the x value.
  if (axis === "y") {
    return `${x} ${value}`;
  }

  // If the axis is both, we need to set the x and y values.
  return `${value} ${value}`;
};

export type CssVarsPropObject<CssVars extends CssVarsPropObject<CssVars>> =
  Record<keyof CssVars, CssVarProp>;

type CssVarPropKey<CssVars extends CssVarsPropObject<CssVars>> = keyof CssVars;

// Allow for explicitly defined props that are not css vars to end to end typesafe
type OtherProps<CssVars extends CssVarsPropObject<CssVars>, Props> =
  | Omit<
      {
        [key in keyof Props]: Props[key];
      },
      CssVarPropKey<CssVars>
    >
  | object;

// Allow for explicitly defined css vars return css variables object created
// by this function and be end to end typesafe
type StyleProp<CssVars extends CssVarsPropObject<CssVars>> =
  | {
      [key in CssVars[keyof CssVars]["cssVar"]]: string;
    }
  | object;

type GetStylePropParams<CssVars, Props> = {
  props: Props & { style?: Record<string, string> };
  cssVars: CssVars;
};

// Resolves a single prop value against its matching CssVarProp definition.
// Returns the mapped CSS variable value string, handling negative spacing.
const resolveValue = (
  matchingCssVar: CssVarProp,
  propValue: string,
): string => {
  const isNegative = typeof propValue === "string" && propValue.startsWith("-");

  if (isNegative) {
    const positiveValue = propValue.slice(1);
    const positiveVar = matchingCssVar.value.replace("VARIABLE", positiveValue);
    return `calc(-1 * ${positiveVar})`;
  }

  return matchingCssVar.value.replace("VARIABLE", propValue);
};

// Applies a resolved CSS variable value to the styleProp object,
// handling directional and axis properties.
const applyCssVar = <CssVars extends CssVarsPropObject<CssVars>>(
  styleProp: StyleProp<CssVars>,
  matchingCssVar: CssVarProp,
  mappedValue: string,
  cssVarNameOverride?: string,
): StyleProp<CssVars> => {
  const cssVarName = (cssVarNameOverride ??
    matchingCssVar.cssVar) as keyof StyleProp<CssVars>;

  if (matchingCssVar.direction) {
    const currentValueOfCssVar = styleProp?.[cssVarName];
    const directionalValue = applyDirectionalValues({
      currentValueOfCssVar,
      value: mappedValue,
      direction: matchingCssVar.direction,
    });
    return { ...styleProp, [cssVarName]: directionalValue };
  }

  if (matchingCssVar.axis) {
    const currentValueOfCssVar = styleProp?.[cssVarName];
    const axisValue = applyAxisValues({
      currentValueOfCssVar,
      value: mappedValue,
      axis: matchingCssVar.axis,
    });
    return { ...styleProp, [cssVarName]: axisValue };
  }

  return { ...styleProp, [cssVarName]: mappedValue };
};

// Creates a state-prefixed CSS variable name from a base CSS variable.
// e.g. ("--background-color", "hover") => "--hover--background-color"
const createPseudoCssVarName = (
  baseCssVar: string,
  pseudoState: PseudoState,
): string => {
  const prefix = PSEUDO_CSS_PREFIX[pseudoState];
  const baseName = baseCssVar.replace(/^--/, "");
  return `--${prefix}--${baseName}`;
};

export const getStyleProp = <
  CssVars extends CssVarsPropObject<CssVars>,
  Props extends Record<string, unknown>,
>(
  params: GetStylePropParams<CssVars, Props>,
): {
  styleProp: StyleProp<CssVars>;
  otherProps: OtherProps<CssVars, Props>;
  interactive: boolean;
} => {
  const { cssVars } = params;

  if (!params?.props || Object.keys(params.props).length === 0) {
    return { styleProp: {}, otherProps: {}, interactive: false };
  }

  // Assign the additional styles to the style object so that it can be passed
  // to the component as a prop.
  const { style = {}, ...props } = params.props;

  let styleProp: StyleProp<CssVars> = style;
  const otherProps: OtherProps<CssVars, Props> = {};
  let interactive = false;

  Object.keys(props).forEach((_key) => {
    const key = _key as keyof typeof props;

    // Check if this is a pseudo-class object prop (hover, focus, active, etc.)
    if (
      PSEUDO_STATES.includes(_key as PseudoState) &&
      typeof props[key] === "object" &&
      props[key] !== null
    ) {
      const pseudoState = _key as PseudoState;
      const pseudoProps = props[key] as Record<string, string | undefined>;
      const unmatchedPseudoProps: Record<string, string> = {};
      let hasMatched = false;

      Object.keys(pseudoProps).forEach((pseudoPropKey) => {
        const propValue = pseudoProps[pseudoPropKey];
        if (!propValue) return;

        const cssVarsKey = pseudoPropKey as unknown as keyof typeof cssVars;
        const matchingCssVar = cssVars?.[cssVarsKey];

        if (!matchingCssVar) {
          // Collect unmatched pseudo props to pass through to otherProps
          unmatchedPseudoProps[pseudoPropKey] = propValue;
          return;
        }

        hasMatched = true;
        const mappedValue = resolveValue(matchingCssVar, propValue);
        const pseudoCssVarName = createPseudoCssVarName(
          matchingCssVar.cssVar,
          pseudoState,
        );

        styleProp = applyCssVar(
          styleProp,
          matchingCssVar,
          mappedValue,
          pseudoCssVarName,
        );
      });

      // Pass through any unmatched pseudo props so downstream components
      // can process them (e.g. Button passes hover.backgroundColor to Box)
      if (Object.keys(unmatchedPseudoProps).length > 0) {
        const existingPseudo =
          (otherProps as Record<string, unknown>)[_key] || {};
        Object.assign(otherProps, {
          [_key]: { ...existingPseudo, ...unmatchedPseudoProps },
        });
      }

      if (hasMatched) {
        interactive = true;
      }
      return;
    }

    const cssVarsKey = key as unknown as keyof typeof cssVars;
    const matchingCssVar = cssVars?.[cssVarsKey];

    // If the prop is not a css var, just add it to the otherProps
    if (!matchingCssVar) {
      Object.assign(otherProps, { [key]: props[key] });
      return;
    }

    const matchingPropValue = props?.[key] as string | undefined;

    if (!matchingPropValue) {
      Object.assign(styleProp, { [key]: props[key] });
      return;
    }

    const mappedValueOfCssVar = resolveValue(matchingCssVar, matchingPropValue);

    // If the style contains an interactive prop, set the interactive flag to true
    // so that the component can include the interactive class
    if (matchingCssVar.interactive) {
      interactive = true;
    }

    styleProp = applyCssVar(styleProp, matchingCssVar, mappedValueOfCssVar);
  });

  return { styleProp, otherProps, interactive };
};
