import { type TgphElement } from "@telegraph/helpers";
import { LoaderCircle } from "lucide-react";

import { Icon, type IconBaseProps } from "../Icon";

// `IconBaseProps`, not `IconProps`: Spinner supplies its own `alt`.
type SpinnerProps<T extends TgphElement = "span"> = Partial<
  IconBaseProps<T>
> & {
  alt?: string;
};

const Spinner = <T extends TgphElement = "span">(props: SpinnerProps<T>) => {
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
      {...(rest as Omit<
        IconBaseProps<"span">,
        "color" | "icon" | "animation" | "aria-hidden"
      >)}
    />
  );
};

export { Spinner, type SpinnerProps };
