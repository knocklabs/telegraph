import type { ElementType, ReactElement } from "react";

import type { TgphElement } from "../types/utility";

type PolymorphicButtonProps = {
  as?: TgphElement;
  disabled?: boolean;
};

const inferTriggerNativeButton = (
  element: ReactElement,
  polymorphicButtonComponents: readonly ElementType[],
): boolean | undefined => {
  if (typeof element.type === "string") {
    return element.type === "button";
  }

  if (!polymorphicButtonComponents.includes(element.type as ElementType)) {
    return undefined;
  }

  const { as, disabled } = element.props as PolymorphicButtonProps;
  return !!disabled || as === undefined || as === "button";
};

export { inferTriggerNativeButton };
