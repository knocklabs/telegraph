import { Box } from "@telegraph/layout";
import clsx from "clsx";
// We use "Bell" in place of any icon so we get correct type checking
import type { Bell } from "lucide-react";
import React from "react";

import { colorMap, sizeMap } from "./Icon.constants";

type BaseIconProps = {
  icon: typeof Bell;
  alt: string;
  size?: keyof (typeof sizeMap)["box"];
  variant?: keyof typeof colorMap;
  color?: keyof (typeof colorMap)["primary"];
};

type IconProps = BaseIconProps & React.HTMLAttributes<HTMLDivElement>;

type IconRef = SVGSVGElement;

const Icon = React.forwardRef<IconRef, IconProps>(
  (
    {
      size = "2",
      color = "default",
      variant = "primary",
      icon,
      alt,
      className,
      ...props
    },
    forwardedRef,
  ) => {
    const IconComponent = icon;

    if (!IconComponent) {
      throw new Error(`@telegraph/icon: icon prop is required`);
    }

    if (!alt) {
      throw new Error(`@telegraph/icon: alt prop is required`);
    }

    return (
      <Box
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
            ref={forwardedRef}
          />
        )}
      </Box>
    );
  },
);

export { Icon };
