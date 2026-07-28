import type {
  PolymorphicPropsWithTgphRef,
  TgphElement,
} from "@telegraph/helpers";
import type { BoxProps } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

import { COLOR_MAP, SIZE_MAP } from "./Icon.constants";

type BaseIconProps = {
  icon: LucideIcon;
  size?: keyof typeof SIZE_MAP;
  variant?: keyof typeof COLOR_MAP;
  color?: keyof (typeof COLOR_MAP)["primary"];
  animation?: "spin" | "none";
};

// An icon is either labelled or explicitly hidden. Both keys appear on both
// arms (one as `never`) so the component can destructure them while the union
// still requires exactly one.
type IconA11yProps =
  | { alt: string; ["aria-hidden"]?: never }
  | { alt?: never; ["aria-hidden"]: true };

// Kept separate from the a11y union so consumers that always supply their own
// label (Spinner) can build on it without inheriting the XOR.
export type IconBaseProps<T extends TgphElement = "span"> =
  PolymorphicPropsWithTgphRef<T, HTMLSpanElement> &
    Omit<BoxProps<T>, "as" | "tgphRef"> &
    BaseIconProps;

export type IconProps<T extends TgphElement = "span"> = IconBaseProps<T> &
  IconA11yProps;

const Icon = <T extends TgphElement = "span">(iconProps: IconProps<T>) => {
  // Read through the default element: while `T` is unresolved the element
  // passthrough is a deferred conditional, so every prop would otherwise be an
  // unresolved indexed access intersected with its declared type.
  const {
    as,
    size = "2",
    color = "default",
    variant = "primary",
    animation = "none",
    icon,
    alt,
    className,
    style,
    ...props
  } = iconProps as IconProps<"span">;
  const IconComponent = icon;

  if (!IconComponent) {
    console.error(`@telegraph/icon: icon prop is required`);
  }

  if (!alt && !props["aria-hidden"]) {
    console.error(`@telegraph/icon: alt prop is required`);
  }

  return (
    <Text
      as={as || "span"}
      className={clsx("tgph-icon", className)}
      data-tgph-icon
      data-tgph-icon-animation={animation}
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
          role="img"
          aria-label={alt}
          width="100%"
          height="100%"
          display="block"
          data-tgph-icon-svg
        />
      )}
    </Text>
  );
};

export { Icon, type LucideIcon };
