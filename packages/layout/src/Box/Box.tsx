import type t from "@telegraph/tokens";
import clsx from "clsx";
import React from "react";

import { deriveSpacing } from "../helpers/deriveSpacing";

import { BOX_PROPS, VARIANT } from "./Box.constants";

type BoxProp = keyof typeof BOX_PROPS;
type BoxProps = React.HTMLAttributes<HTMLDivElement> & {
  [key in BoxProp]?: `${keyof typeof t.tokens.spacing}`;
} & {
  // More variants wil beed added here once
  // they are designed
  variant?: "ghost";
};
type BoxRef = HTMLDivElement;

const Box = React.forwardRef<BoxRef, BoxProps>(
  ({ variant = "ghost", className, ...props }) => {
    // TODO: compose this with forwardRef once @telegraph/composed-ref is published
    const boxRef = React.useRef<HTMLDivElement>(null);

    // Filter out the box props from the rest of the props
    const filteredProps = React.useMemo(
      () =>
        Object.keys(props).reduce(
          (acc, key) => {
            if (!Object.keys(BOX_PROPS).some((prop) => prop === key)) {
              acc.rest[key] = props[key as keyof typeof props];
            } else {
              acc.box[key] = props[key as keyof typeof props];
            }
            return acc;
          },
          { box: {}, rest: {} } as {
            box: Record<string, string>;
            rest: Record<string, string>;
          },
        ),
      [props],
    );

    React.useLayoutEffect(() => {
      const setCssVariables = () => {
        if (!boxRef.current) return;

        const cssVariables: Record<string, string> = {};

        // Iterate through each box prop and add
        // the value to the cssVariables object
        Object.entries(filteredProps.box).forEach(([key, value]) => {
          if (value) {
            const boxProp = BOX_PROPS[key as BoxProp];

            // If the boxProp is a spacing type, derive the value so
            // that we utilize our telegraph spacing tokens
            if (boxProp.type.includes("spacing")) {
              // Get current value so we can merge like values
              const currentValueOfCssVariable =
                cssVariables[`--tgph-${boxProp.rule}`] || "";

              cssVariables[`--tgph-${boxProp.rule}`] = deriveSpacing({
                value,
                type: boxProp.type,
                currentValue: currentValueOfCssVariable || "",
              });
            } else {
              cssVariables[`--tgph-${boxProp.rule}`] = value;
            }
          }
        });

        // Add the cssVariables to the boxRef
        Object.entries(cssVariables).forEach(([key, value]) => {
          if (boxRef.current) {
            boxRef.current.style.setProperty(key, value);
          }
        });
      };
      setCssVariables();
    }, [filteredProps.box]);

    return (
      <div
        className={clsx("tgph-box", VARIANT[variant], className)}
        ref={boxRef}
        {...filteredProps.rest}
      />
    );
  },
);

export { Box };
