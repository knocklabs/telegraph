import {
  type ElementType,
  type ReactElement,
  type ReactNode,
  isValidElement,
} from "react";

import type { TgphElement } from "../types/utility";

type PolymorphicButtonProps = {
  as?: TgphElement;
  disabled?: boolean;
};

type InferTriggerNativeButtonOptions = {
  asChild: boolean;
  buttonComponents: readonly ElementType[];
  children: ReactNode;
  nativeButton?: boolean;
};

const inferElementNativeButton = (
  element: ReactElement,
  buttonComponents: readonly ElementType[],
): boolean | undefined => {
  if (typeof element.type === "string") {
    return element.type === "button";
  }

  if (!buttonComponents.includes(element.type as ElementType)) {
    return undefined;
  }

  const { as, disabled } = element.props as PolymorphicButtonProps;
  return !!disabled || as === undefined || as === "button";
};

const inferTriggerNativeButton = ({
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

  return inferElementNativeButton(children, buttonComponents) ?? true;
};

export { inferTriggerNativeButton, type InferTriggerNativeButtonOptions };
