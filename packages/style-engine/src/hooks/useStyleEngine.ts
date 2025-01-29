import React from "react";

import { type CssVarProp, getStyleProp } from "../helpers/getStyleProp";

type CssVarsPropObject<CssVars> = Record<keyof CssVars, CssVarProp>;

export const useStyleEngine = <
  CssVars extends CssVarsPropObject<CssVars>,
  Props extends Record<string, unknown>,
>(
  params: Parameters<typeof getStyleProp<CssVars, Props>>[0],
) => {
  return React.useMemo(() => getStyleProp(params), [params]);
};
