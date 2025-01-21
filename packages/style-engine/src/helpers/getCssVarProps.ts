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
  tgphVar: string;
  direction?: Direction;
};

type ApplyDirectionProps = {
  currentValue: string | undefined;
  tgphVar: string;
  direction?: Direction;
};

// For values like margin and padding that require 4 values
const applyDirectionalValues = ({
  currentValue = "0 0 0 0",
  tgphVar,
  direction,
}: ApplyDirectionProps) => {
  const [top, right, bottom, left] = currentValue.split(" ");

  const newValues = {
    top,
    right,
    bottom,
    left,
  };

  if (direction === "top") {
    newValues.top = tgphVar;
  }

  if (direction === "right") {
    newValues.right = tgphVar;
  }

  if (direction === "bottom") {
    newValues.bottom = tgphVar;
  }

  if (direction === "left") {
    newValues.left = tgphVar;
  }

  if (direction === "all") {
    newValues.top = tgphVar;
    newValues.right = tgphVar;
    newValues.bottom = tgphVar;
    newValues.left = tgphVar;
  }

  if (direction === "x") {
    newValues.left = tgphVar;
    newValues.right = tgphVar;
  }

  if (direction === "y") {
    newValues.top = tgphVar;
    newValues.bottom = tgphVar;
  }

  // "side" direction is used for things like border-radius
  // where we are settings values on corners instead of sides
  // entire sides like padding and margin provide.
  if (direction === "side-top") {
    newValues.top = tgphVar;
    newValues.right = tgphVar;
  }

  if (direction === "side-bottom") {
    newValues.bottom = tgphVar;
    newValues.left = tgphVar;
  }

  if (direction === "side-left") {
    newValues.top = tgphVar;
    newValues.left = tgphVar;
  }

  if (direction === "side-right") {
    newValues.right = tgphVar;
    newValues.bottom = tgphVar;
  }

  const newValuesString = Object.values(newValues).join(" ");

  return newValuesString;
};

type GetCssVarProps<T> = {
  props: Record<string, string>;
  cssVars: T;
};

export const getCssVarProps = <T>(params: GetCssVarProps<T>) => {
  const { props, cssVars } = params;

  if (!props || Object.keys(props).length === 0) {
    return { styleProps: {}, otherProps: {} };
  }

  console.log("HERE PROPS", props);

  const allProps = Object.entries(props).reduce(
    (acc, [key, value]) => {
      const cssVarKey = key as keyof typeof cssVars;

      // If the cssVar is not defined, we don't need to apply it
      // and we can just add it to the otherProps
      if (!cssVars?.[cssVarKey]) {
        Object.assign(acc.otherProps, { [key]: value });
        return acc;
      }

      const cssVarValue = cssVars[cssVarKey] as unknown as CssVarProp;
      const tgphVar = cssVarValue.tgphVar.replace("VARIABLE", value);

      if (cssVarValue.direction) {
        const currentValue = acc.styleProps?.[cssVarValue.cssVar];

        const directionalValue = applyDirectionalValues({
          currentValue,
          tgphVar: tgphVar,
          direction: cssVarValue.direction,
        });

        Object.assign(acc.styleProps, {
          [cssVarValue.cssVar]: directionalValue,
        });

        return acc;
      }

      Object.assign(acc.styleProps, {
        [cssVarValue.cssVar]: tgphVar,
      });
      return acc;
    },
    { styleProps: {} as Record<string, string>, otherProps: {} },
  );

  return {
    styleProps: allProps.styleProps,
    otherProps: allProps.otherProps,
  };
};
