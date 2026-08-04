import type { ReactElement } from "react";

type NativeButtonResolver = (
  props: Record<string, unknown>,
) => boolean | undefined;

const NATIVE_BUTTON_RESOLVER: unique symbol = Symbol.for(
  "@telegraph/native-button-resolver",
);

type NativeButtonResolverComponent = {
  [NATIVE_BUTTON_RESOLVER]?: NativeButtonResolver;
};

const canHaveNativeButtonResolver = (
  value: unknown,
): value is NativeButtonResolverComponent => {
  return (
    typeof value === "function" || (typeof value === "object" && value !== null)
  );
};

const withNativeButtonResolver = <Component extends object, Props>(
  component: Component,
  resolver: (props: Props) => boolean | undefined,
) => {
  Object.defineProperty(component, NATIVE_BUTTON_RESOLVER, {
    configurable: true,
    value: resolver as NativeButtonResolver,
  });

  return component;
};

const inferNativeButton = (element: ReactElement): boolean | undefined => {
  if (typeof element.type === "string") {
    return element.type === "button";
  }

  if (!canHaveNativeButtonResolver(element.type)) {
    return undefined;
  }

  const resolver = element.type[NATIVE_BUTTON_RESOLVER];

  if (!resolver) {
    return undefined;
  }

  return resolver(element.props as Record<string, unknown>);
};

export { inferNativeButton, withNativeButtonResolver };
export type { NativeButtonResolver };
