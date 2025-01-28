import type {
  PolymorphicPropsWithTgphRef,
  TgphComponentProps,
  TgphElement,
} from "@telegraph/helpers";
import { Box } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import clsx from "clsx";
// We use "Bell" in place of any icon so we get correct type checking
import type { Bell } from "lucide-react";

import { COLOR_MAP, SIZE_MAP } from "./Icon.constants";

type BaseIconProps = {
  icon: typeof Bell;
  size?: keyof typeof SIZE_MAP;
  variant?: keyof typeof COLOR_MAP;
  color?: keyof (typeof COLOR_MAP)["primary"];
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
  style,
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
    <Text
      as={as || "span"}
      className={clsx("tgph-icon", className)}
      data-button-icon
      style={{
        // We choose to override these values vs passing them in as props because
        // the icon's sizes aren't all exact telegraph tokens and the colors
        // of the icon are different than the text color. Because of how the Text
        // component is setup this is a valid way to inject these values in for these
        // few cases.
        "--height": SIZE_MAP[size],
        "--width": SIZE_MAP[size],
        "--color": COLOR_MAP[variant][color],
        ...style,
      }}
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
    </Text>
  );
};

export { Icon };
