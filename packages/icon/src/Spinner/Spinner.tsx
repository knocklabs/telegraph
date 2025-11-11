import { type TgphComponentProps, type TgphElement } from "@telegraph/helpers";
import { LoaderCircle } from "lucide-react";

import { Icon } from "../Icon";

type SpinnerProps<T extends TgphElement> = Partial<
  TgphComponentProps<typeof Icon<T>>
>;

const Spinner = <T extends TgphElement>({
  color = "gray",
  icon = LoaderCircle,
  animation = "spin",
  alt = "Loading...",
  ...props
}: SpinnerProps<T>) => {
  return (
    <Icon
      color={color}
      icon={icon}
      animation={animation}
      alt={alt}
      role="status"
      aria-live="polite"
      {...props}
    />
  );
};

export { Spinner, type SpinnerProps };
