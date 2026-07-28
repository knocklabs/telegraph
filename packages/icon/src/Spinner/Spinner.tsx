import { type TgphElement } from "@telegraph/helpers";
import { LoaderCircle } from "lucide-react";

import { Icon, type IconBaseProps } from "../Icon";

// Builds on IconBaseProps rather than IconProps: Spinner always supplies its
// own `alt`, so it has no need for the alt/aria-hidden XOR.
type SpinnerProps<T extends TgphElement = "span"> = Partial<
  IconBaseProps<T>
> & {
  alt?: string;
};

const Spinner = <T extends TgphElement = "span">(props: SpinnerProps<T>) => {
  // Read through the default element: while `T` is unresolved the element
  // passthrough is a deferred conditional, so every prop would otherwise be an
  // unresolved indexed access intersected with its declared type.
  const {
    color = "gray",
    icon = LoaderCircle,
    animation = "spin",
    alt = "Loading...",
    ...rest
  } = props as SpinnerProps<"span">;
  return (
    <Icon
      color={color}
      icon={icon}
      animation={animation}
      alt={alt}
      role="status"
      aria-live="polite"
      {...(rest as Omit<IconBaseProps<"span">, "color" | "icon" | "animation">)}
    />
  );
};

export { Spinner, type SpinnerProps };
