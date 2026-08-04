import { type ReactNode, isValidElement } from "react";

import type { TgphElement } from "../types/utility";

const MOTION_COMPONENT_SYMBOL = Symbol.for("motionComponentSymbol");
const NATIVE_BUTTON_RESOLVER_SYMBOL = Symbol.for(
  "@telegraph/native-button-resolver",
);

type NativeButtonComponent = string | TgphElement;

type NativeButtonResolver = (props?: unknown) => boolean | undefined;

type ResolvableComponent = {
  [MOTION_COMPONENT_SYMBOL]?: NativeButtonComponent;
  [NATIVE_BUTTON_RESOLVER_SYMBOL]?: NativeButtonResolver;
};

type RegisterNativeButtonResolverOptions = {
  component: object;
  resolver: NativeButtonResolver;
};

type RegisterNativeButtonResolver = (
  options: RegisterNativeButtonResolverOptions,
) => void;

const registerNativeButtonResolver: RegisterNativeButtonResolver = ({
  component,
  resolver,
}) => {
  Object.defineProperty(component, NATIVE_BUTTON_RESOLVER_SYMBOL, {
    configurable: true,
    value: resolver,
  });
};

type ResolveNativeButtonOptions = {
  component: NativeButtonComponent;
  props?: unknown;
};

type ResolveNativeButton = (
  options: ResolveNativeButtonOptions,
) => boolean | undefined;

const resolveNativeButton: ResolveNativeButton = ({ component, props }) => {
  if (typeof component === "string") {
    return component === "button";
  }

  if (
    (typeof component !== "function" && typeof component !== "object") ||
    component === null
  ) {
    return undefined;
  }

  const resolvableComponent = component as ResolvableComponent;
  const resolver = resolvableComponent[NATIVE_BUTTON_RESOLVER_SYMBOL];

  if (resolver) {
    return resolver(props);
  }

  const motionComponent = resolvableComponent[MOTION_COMPONENT_SYMBOL];

  if (motionComponent && motionComponent !== component) {
    return resolveNativeButton({ component: motionComponent, props });
  }

  return undefined;
};

type InferTriggerNativeButtonOptions = {
  asChild: boolean;
  children: ReactNode;
  nativeButton?: boolean;
};

type InferTriggerNativeButton = (
  options: InferTriggerNativeButtonOptions,
) => boolean;

const inferTriggerNativeButton: InferTriggerNativeButton = ({
  asChild,
  children,
  nativeButton,
}) => {
  if (nativeButton !== undefined) {
    return nativeButton;
  }

  if (!asChild || !isValidElement(children)) {
    return true;
  }

  return (
    resolveNativeButton({
      component: children.type,
      props: children.props,
    }) ?? true
  );
};

export {
  inferTriggerNativeButton,
  registerNativeButtonResolver,
  resolveNativeButton,
  type InferTriggerNativeButtonOptions,
  type NativeButtonResolver,
  type RegisterNativeButtonResolverOptions,
  type ResolveNativeButtonOptions,
};
