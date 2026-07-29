import { type TgphElement } from "@telegraph/helpers";
import { LoaderCircle, type LucideIcon } from "lucide-react";

import { Icon, type IconBaseProps } from "../Icon";

// `IconBaseProps`, not `IconProps`: Spinner supplies its own `alt`. Only `icon`
// is relaxed — a blanket `Partial` also made the rendered element's own
// required props optional. `as` stays out of the `Omit` so `as={Component}`
// can still resolve `T`.
type SpinnerProps<T extends TgphElement = "span"> = Omit<
  IconBaseProps<T>,
  "as" | "icon"
> & {
  as?: T;
  icon?: LucideIcon;
  alt?: string;
};

const Spinner = <T extends TgphElement = "span">(
  spinnerProps: SpinnerProps<T>,
) => {
  const {
    color = "gray",
    icon = LoaderCircle,
    animation = "spin",
    alt = "Loading...",
    ...rest
  } = spinnerProps as SpinnerProps<"span">;
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
