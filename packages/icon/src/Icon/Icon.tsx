import { IonIcon } from "@ionic/react";
import clsx from "clsx";
import React from "react";

import { colorMap, sizeMap } from "./Icon.constants";

type IconProps = Omit<React.ComponentProps<typeof IonIcon>, "size"> & {
  icon: string;
  alt: string;
  size?: keyof (typeof sizeMap)["box"];
  variant?: keyof typeof colorMap;
  color?: keyof (typeof colorMap)["primary"];
};

type IconRef = HTMLIonIconElement;

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
    return (
      <IonIcon
        role="img"
        aria-label={alt}
        icon={icon}
        className={clsx(
          size && sizeMap["box"][size],
          size && sizeMap["icon"][size],
          variant && color && colorMap[variant][color],
          "inline-block",
          className,
        )}
        {...props}
        ref={forwardedRef}
      />
    );
  },
);

export { Icon };
