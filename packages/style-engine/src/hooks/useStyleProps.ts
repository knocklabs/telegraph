import { type SprinklesProperties as StylePropsProperties } from "@vanilla-extract/sprinkles";
import React from "react";

import { type createStyleProps } from "../index";

// Get the props that are not part of the style props
// so that thoes are still type safe
type PickComponentProps<
  StyleProps extends StylePropsProperties[],
  ComponentProps extends Record<string, unknown>,
> = Omit<ComponentProps, keyof StylePropsFnProperties<StyleProps>>;

// The function returned by `createStyleProps`
type StylePropsFn<StyleProps extends StylePropsProperties[]> = ReturnType<
  typeof createStyleProps<StyleProps>
>;

// The properties that were defined in `defineStyleProps`
type StylePropsFnProperties<StyleProps extends StylePropsProperties[]> =
  Parameters<StylePropsFn<StyleProps>>[0];

type UseStylePropsParams<
  StyleProps extends StylePropsProperties[],
  ComponentProps extends Record<string, unknown>,
> = {
  // The properties defined in `defineStyleProps` and the rest of the component's props
  props: StylePropsFnProperties<StyleProps> & ComponentProps;
  // The function returned by `createStyleProps` which contains the properties
  styleProps: StylePropsFn<StyleProps>;
};

export const useStyleProps = <
  StyleProps extends StylePropsProperties[],
  ComponentProps extends Record<string, unknown>,
>({
  props,
  styleProps: stylePropsFn,
}: UseStylePropsParams<StyleProps, ComponentProps>) => {
  const memoizedProps = React.useMemo(() => props, [props]);
  const filteredProps = React.useMemo(() => {
    const stylePropKeys = stylePropsFn.properties;
    const styleProps = {} as StylePropsFnProperties<StyleProps>;
    const componentProps = {} as PickComponentProps<StyleProps, ComponentProps>;

    if (stylePropKeys) {
      Object.keys(memoizedProps).forEach((_key) => {
        const key = _key as keyof StylePropsFnProperties<StyleProps> &
          ComponentProps;

        if (stylePropKeys.has(key)) {
          Object.assign(styleProps, {
            [key]: memoizedProps[key],
          });
        }
        if (!stylePropKeys.has(key)) {
          Object.assign(componentProps, {
            [key]: memoizedProps[key],
          });
        }
      });
    }

    return { styleProps, componentProps };
  }, [memoizedProps, stylePropsFn]);

  const styleClassName = React.useMemo(() => {
    return stylePropsFn(filteredProps.styleProps);
  }, [filteredProps.styleProps, stylePropsFn]);

  return {
    styleClassName,
    props: filteredProps.componentProps,
    styleProps: filteredProps.styleProps,
  };
};
