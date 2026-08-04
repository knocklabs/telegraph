import {
  type ElementType,
  type ReactElement,
  type ReactNode,
  isValidElement,
} from "react";

import type { AsProp, TgphElement } from "../types/utility";

type PolymorphicButtonProps = AsProp<TgphElement> & {
  disabled?: boolean;
};

type CompoundButtonComponent = ElementType & {
  Root: ElementType;
};

type InferElementNativeButtonOptions = {
  buttonComponent: CompoundButtonComponent;
  element: ReactElement;
};

type InferElementNativeButton = (
  options: InferElementNativeButtonOptions,
) => boolean | undefined;

const inferElementNativeButton: InferElementNativeButton = ({
  buttonComponent,
  element,
}) => {
  if (typeof element.type === "string") {
    return element.type === "button";
  }

  if (
    element.type !== buttonComponent &&
    element.type !== buttonComponent.Root
  ) {
    return undefined;
  }

  const { as, disabled } = element.props as PolymorphicButtonProps;
  return !!disabled || as === undefined || as === "button";
};

type InferTriggerNativeButtonOptions = {
  asChild: boolean;
  buttonComponent: CompoundButtonComponent;
  children: ReactNode;
  nativeButton?: boolean;
};

type InferTriggerNativeButton = (
  options: InferTriggerNativeButtonOptions,
) => boolean;

const inferTriggerNativeButton: InferTriggerNativeButton = ({
  asChild,
  buttonComponent,
  children,
  nativeButton,
}: InferTriggerNativeButtonOptions): boolean => {
  if (nativeButton !== undefined) {
    return nativeButton;
  }

  if (!asChild || !isValidElement(children)) {
    return true;
  }

  return (
    inferElementNativeButton({
      buttonComponent,
      element: children,
    }) ?? true
  );
};

export { inferTriggerNativeButton, type InferTriggerNativeButtonOptions };
