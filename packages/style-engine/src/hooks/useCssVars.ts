import React from "react";

import { getCssVarProps } from "../helpers/getCssVarProps";

type UseCssVarsParams<T> = Parameters<typeof getCssVarProps>[0] & {
  props: T;
};

export const useCssVars = <T>(params: UseCssVarsParams<T>) => {
  return React.useMemo(() => getCssVarProps(params), [params]);
};
