import { type ReactNode, isValidElement } from "react";

import type { TgphElement } from "../types/utility";

const MOTION_COMPONENT_SYMBOL = Symbol.for("motionComponentSymbol");
const NATIVE_BUTTON_RESOLVER_SYMBOL = Symbol.for(
  "@telegraph/native-button-resolver",
);

type NativeButtonComponent = string | TgphElement;

type NativeButtonResolver = (
  props?: unknown,
  nativeButton?: boolean,
) => boolean | undefined;

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

// Registers component-specific semantics on a global symbol so separate
// Telegraph package instances can resolve the same component.
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
  nativeButton?: boolean;
  props?: unknown;
};

type ResolveNativeButton = (
  options: ResolveNativeButtonOptions,
) => boolean | undefined;

// Resolves explicit, intrinsic, registered, and Motion component semantics.
// Unknown components remain undefined unless the caller supplies a value.
const resolveNativeButton: ResolveNativeButton = ({
  component,
  nativeButton,
  props,
}) => {
  if (typeof component === "string") {
    return nativeButton ?? component === "button";
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
    return resolver(props, nativeButton);
  }

  const motionComponent = resolvableComponent[MOTION_COMPONENT_SYMBOL];

  if (motionComponent && motionComponent !== component) {
    return resolveNativeButton({
      component: motionComponent,
      nativeButton,
      props,
    });
  }

  return nativeButton;
};

type InferTriggerNativeButtonOptions = {
  asChild: boolean;
  children: ReactNode;
  nativeButton?: boolean;
};

type InferTriggerNativeButton = (
  options: InferTriggerNativeButtonOptions,
) => boolean;

// Resolves composed trigger semantics from its child and otherwise preserves
// Base UI's native-button default.
const inferTriggerNativeButton: InferTriggerNativeButton = ({
  asChild,
  children,
  nativeButton,
}) => {
  if (!asChild || !isValidElement(children)) {
    return nativeButton ?? true;
  }

  return (
    resolveNativeButton({
      component: children.type,
      nativeButton,
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
