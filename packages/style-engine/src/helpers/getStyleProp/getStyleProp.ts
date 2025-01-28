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

export type CssVarProp = {
  cssVar: string;
  value: string;
  direction?: Direction;
  interactive?: boolean;
};

type ApplyDirectionProps = {
  currentValueOfCssVar: string | undefined;
  value: string;
  direction?: Direction;
};

// For values like margin and padding that require 4 values
const applyDirectionalValues = ({
  currentValueOfCssVar = "0 0 0 0",
  value,
  direction,
}: ApplyDirectionProps) => {
  const [top, right, bottom, left] = currentValueOfCssVar.split(" ");

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

  const styleProp: StyleProp<CssVars> = style;
  const otherProps: OtherProps<CssVars, Props> = {};
  let interactive = false;

  Object.keys(props).forEach((_key) => {
    const key = _key as keyof typeof props;
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

    // Replace the VARIABLE placeholder with the actual value of the prop
    const mappedValueOfCssVar = matchingCssVar.value.replace(
      "VARIABLE",
      matchingPropValue,
    );

    const cssVarName = matchingCssVar.cssVar as keyof StyleProp<CssVars>;

    // If the style contains an interactive prop, set the interactive flag to true
    // so that the component can include the interactive class
    if (matchingCssVar.interactive) {
      interactive = true;
    }

    if (matchingCssVar.direction) {
      const currentValueOfCssVar = styleProp?.[cssVarName];

      const directionalValue = applyDirectionalValues({
        currentValueOfCssVar,
        value: mappedValueOfCssVar,
        direction: matchingCssVar.direction,
      });

      Object.assign(styleProp, { [cssVarName]: directionalValue });
      return;
    }

    Object.assign(styleProp, { [cssVarName]: mappedValueOfCssVar });
  });

  return { styleProp, otherProps, interactive };
};
