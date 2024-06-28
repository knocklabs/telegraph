import type {
  PolymorphicPropsWithTgphRef,
  TgphComponentProps,
  TgphElement,
} from "@telegraph/helpers";
import { Box } from "@telegraph/layout";
import clsx from "clsx";
// We use "Bell" in place of any icon so we get correct type checking
import type { Bell } from "lucide-react";

import { colorMap, sizeMap } from "./Icon.constants";

type BaseIconProps = {
  icon: typeof Bell;
  size?: keyof (typeof sizeMap)["box"];
  variant?: keyof typeof colorMap;
  color?: keyof (typeof colorMap)["primary"];
} & (
  | {
      alt: string;
    }
  | {
      ["aria-hidden"]: true;
    }
);

type IconProps<T extends TgphElement> = PolymorphicPropsWithTgphRef<
  T,
  HTMLSpanElement
> &
  TgphComponentProps<typeof Box> &
  BaseIconProps;

const Icon = <T extends TgphElement>({
  as,
  size = "2",
  color = "default",
  variant = "primary",
  icon,
  alt,
  className,
  ...props
}: IconProps<T>) => {
  const IconComponent = icon;

  if (!IconComponent) {
    throw new Error(`@telegraph/icon: icon prop is required`);
  }

  if (!alt && !props["aria-hidden"]) {
    throw new Error(`@telegraph/icon: alt prop is required`);
  }

  return (
    <Box
      as={as || "span"}
      className={clsx(
        size && sizeMap["box"][size],
        color && colorMap[variant][color],
        "inline-block",
        className,
      )}
      data-button-icon
      {...props}
    >
      {IconComponent && (
        <IconComponent
          aria-label={alt}
          width="100%"
          height="100%"
          display="block"
        />
      )}
    </Box>
  );
};

export { Icon };
