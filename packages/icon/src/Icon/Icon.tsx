import type {
  PolymorphicPropsWithTgphRef,
  TgphComponentProps,
  TgphElement,
} from "@telegraph/helpers";
import { Box } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import clsx from "clsx";
import type * as LucideIconsUnslugified from "lucide-react";
import { DynamicIcon, dynamicIconImports } from "lucide-react/dynamic";

import { COLOR_MAP, SIZE_MAP } from "./Icon.constants";
import type { TransformKeysToPascal } from "./Icon.types";

type LucideIcon = TransformKeysToPascal<keyof typeof dynamicIconImports>;

// Take a slugified version of the icon like "a-arrow-down" and return
// the unslugified version like "AArrowDown". We need the unslugified
// version as the object key so that we don't introduce any breaking
// changes to how the Lucide object works in the icon package.
const unslugify = (slug: string): string => {
  return slug
    .split(/[-_]/g)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
};

// An object of Lucide icons that contain the kebab-cased name of
// the icon so that we can use that name to call the icon dynamically
// instead of needing to bundle the icon directly into the component.
// We do it in this way to maintain backwards compatibility with the
// `Lucide.Bell` pattern
const Lucide = Object.keys(dynamicIconImports).reduce(
  (acc, key) => {
    const unslugifiedKey = unslugify(
      key,
    ) as keyof typeof LucideIconsUnslugified;
    acc[unslugifiedKey] = key as TransformKeysToPascal<
      keyof typeof dynamicIconImports
    >;
    return acc;
  },
  {} as Record<
    keyof typeof LucideIconsUnslugified,
    TransformKeysToPascal<keyof typeof dynamicIconImports>
  >,
);

type BaseIconProps = {
  icon: LucideIcon;
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
  if (!icon) {
    console.error(`@telegraph/icon: icon prop is required`);
  }

  if (!alt && !props["aria-hidden"]) {
    console.error(`@telegraph/icon: alt prop is required`);
  }

  return (
    <Text
      as={as || "span"}
      className={clsx("tgph-icon", className)}
      data-button-icon
      role="img"
      aria-label={alt}
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
      <DynamicIcon name={icon} width="100%" height="100%" display="block" />
    </Text>
  );
};

export { Icon, Lucide, type LucideIcon };
