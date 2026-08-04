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

type InferElementNativeButtonOptions = {
  buttonComponents: readonly ElementType[];
  element: ReactElement;
};

type InferElementNativeButton = (
  options: InferElementNativeButtonOptions,
) => boolean | undefined;

const inferElementNativeButton: InferElementNativeButton = ({
  buttonComponents,
  element,
}) => {
  if (typeof element.type === "string") {
    return element.type === "button";
  }

  if (!buttonComponents.includes(element.type as ElementType)) {
    return undefined;
  }

  const { as, disabled } = element.props as PolymorphicButtonProps;
  return !!disabled || as === undefined || as === "button";
};

type InferTriggerNativeButtonOptions = {
  asChild: boolean;
  buttonComponents: readonly ElementType[];
  children: ReactNode;
  nativeButton?: boolean;
};

type InferTriggerNativeButton = (
  options: InferTriggerNativeButtonOptions,
) => boolean;

const inferTriggerNativeButton: InferTriggerNativeButton = ({
  asChild,
  buttonComponents,
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
      buttonComponents,
      element: children,
    }) ?? true
  );
};

export { inferTriggerNativeButton, type InferTriggerNativeButtonOptions };
