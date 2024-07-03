import { type SprinklesProperties as StyleProperties } from "@vanilla-extract/sprinkles";
import React from "react";

import { type createStyleProps } from "../index";

type StylePropFn<StylePropFnProperties extends StyleProperties[]> = ReturnType<
  typeof createStyleProps<StylePropFnProperties>
>;

type StyleProps<StylePropFnProperties extends StyleProperties[]> = Parameters<
  StylePropFn<StylePropFnProperties>
>[0];

type ComponentProps<
  Props,
  StylePropFnProperties extends StyleProperties[],
> = Omit<Props, keyof StyleProps<StylePropFnProperties>>;

type UseStylePropsParams<
  Props,
  StylePropFnProperties extends StyleProperties[],
> = {
  props: Props;
  stylePropsFn: StylePropFn<StylePropFnProperties>;
};

export const useStyleProps = <
  Props,
  StylePropFnProperties extends StyleProperties[],
>({
  props,
  stylePropsFn,
}: UseStylePropsParams<Props, StylePropFnProperties>) => {
  // Keep this memoed to prevent unnecessary re-renders
  const memoizedProps = React.useMemo<Props>(() => props, [props]);

  // Filter the props into styleProps and componentProps so that we can
  // pass styleProps to the stylePropsFn and componentProps to the component
  const filteredProps = React.useMemo(() => {
    const stylePropFnProperties = stylePropsFn.properties;

    const styleProps = {} as StyleProps<StylePropFnProperties>;
    const componentProps = {} as ComponentProps<Props, StylePropFnProperties>;

    // If there are no memoized props, return the empty styleProps and componentProps objects
    if (!memoizedProps) return { styleProps, componentProps };

    Object.keys(memoizedProps).forEach((_key) => {
      const key = _key as keyof StyleProps<StylePropFnProperties> & keyof Props;
      if (stylePropFnProperties.has(key)) {
        Object.assign(styleProps, {
          [key]: memoizedProps[key],
        });
      }
      if (!stylePropFnProperties.has(key)) {
        Object.assign(componentProps, {
          [key]: memoizedProps[key],
        });
      }
    });

    return { styleProps, componentProps };
  }, [memoizedProps, stylePropsFn?.properties]);

  // Generate the style class name that we can apply to the component
  const styleClassName = React.useMemo(() => {
    return stylePropsFn(filteredProps.styleProps);
  }, [filteredProps.styleProps, stylePropsFn]);

  return {
    styleProps: filteredProps.styleProps,
    componentProps: filteredProps.componentProps,
    styleClassName,
  };
};
