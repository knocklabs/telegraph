import React from "react";

import { type CssVarsPropObject, getStyleProp } from "../helpers/getStyleProp";

export const useStyleEngine = <
  CssVars extends CssVarsPropObject<CssVars>,
  Props extends Record<string, unknown>,
>(
  params: Parameters<typeof getStyleProp<CssVars, Props>>[0],
) => {
  return React.useMemo(() => getStyleProp(params), [params]);
};
