import type {
  PolymorphicPropsWithTgphRef,
  TgphComponentProps,
  TgphElement,
} from "@telegraph/helpers";
import { Box } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import clsx from "clsx";
import type * as LucideIconsUnslugified from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import LucideIcons from "lucide-static/icon-nodes.json";

import { COLOR_MAP, SIZE_MAP } from "./Icon.constants";

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

// An object of Lucide icons that contain the displayName of the icon
// so that we can use that name to call the icon dynamically instead
// of needing to bundle the icon directly into the component.
const Lucide = Object.keys(LucideIcons).reduce(
  (acc, key) => {
    const unslugifiedKey = unslugify(
      key,
    ) as keyof typeof LucideIconsUnslugified;
    acc[unslugifiedKey] = {
      displayName: key as keyof typeof LucideIcons,
    };
    return acc;
  },
  {} as Record<
    keyof typeof LucideIconsUnslugified,
    Record<"displayName", keyof typeof LucideIcons>
  >,
);

type LucideIcon = Record<"displayName", keyof typeof LucideIcons>;

type BaseIconProps = {
  icon: Record<"displayName", keyof typeof LucideIcons>;
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
      {/* Dynamically import icons as we need them so we don't bloat the bundle */}
      <DynamicIcon
        name={icon.displayName}
        aria-label={alt}
        width="100%"
        height="100%"
        display="block"
      />
    </Text>
  );
};

export { Icon, Lucide, type LucideIcon };
