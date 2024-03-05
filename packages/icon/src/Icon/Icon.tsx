import clsx from "clsx";
import React from "react";

import { colorMap, sizeMap } from "./Icon.constants";
import "./Icon.styles.css";

type IconProps = React.HTMLAttributes<HTMLSpanElement> & {
  icon: string;
  alt: string;
  size?: keyof (typeof sizeMap)["box"];
  variant?: keyof typeof colorMap;
  color?: keyof (typeof colorMap)["primary"];
};

type IconRef = HTMLSpanElement;

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
    // Get SVG part of the icon
    const unsafeIconMarkup = icon?.split(",")?.[1];

    // Replace ionicon classes with telegraph classes
    const iconMarkup = unsafeIconMarkup
      ?.replace(/class='ionicon'/g, "")
      ?.replace(/ionicon-stroke-width/g, "tgph-stroke-width")
      ?.replace(/ionicon-fill-none/g, "tgph-fill-none");

    if (!iconMarkup) {
      return <></>;
    }

    return (
      <span
        role="img"
        aria-label={alt}
        dangerouslySetInnerHTML={{ __html: iconMarkup }}
        className={clsx(
          "box-border",
          size && sizeMap["box"][size],
          size && sizeMap["icon"][size],
          variant && color && colorMap[variant][color],
          "stroke-[currentColor] fill-[currentColor] inline-block",
          className,
        )}
        data-tgph-icon
        data-tgph-icon-size={size}
        data-tgph-icon-variant={variant}
        data-tgph-icon-color={color}
        {...props}
        ref={forwardedRef}
      />
    );
  },
);

export { Icon };
