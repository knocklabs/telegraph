import React from "react";

import { propsToCssVariables } from "../helpers/css-variables";
import { organizeComponentAndStyleProps } from "../helpers/style-props";
import type { CssVariableProp } from "../types";

type UseStyleEngineParams = {
  props: Record<string, unknown>;
  propsMap: Record<string, CssVariableProp>;
};

export const useStyleEngine = ({ props, propsMap }: UseStyleEngineParams) => {
  const derivedProps = React.useMemo(() => {
    const { style = {}, ...rest } = props;

    const { style: styleProps, component } = organizeComponentAndStyleProps({
      props,
      propsMap: rest,
    });

    const styleVariables = propsToCssVariables({
      props: styleProps,
      propsMap,
    });

    const styleProp = {
      ...styleVariables,
      ...(style as React.CSSProperties),
    };

    return { style: styleProp, componentProps: component };
  }, [props, propsMap]);

  return derivedProps;
};
