import type t from "@telegraph/tokens";
import clsx from "clsx";
import React from "react";

import { Box } from "../Box";
import { deriveSpacing } from "../helpers/deriveSpacing";

import { STACK_PROPS } from "./Stack.constants";

type StackProp = keyof typeof STACK_PROPS;
type StackProps = React.ComponentPropsWithoutRef<typeof Box> & {
  spacing?: `${keyof typeof t.tokens.spacing}`;
  display?: "flex" | "inline-flex";
  align?: React.CSSProperties["alignItems"];
  direction?: React.CSSProperties["flexDirection"];
  justify?: React.CSSProperties["justifyContent"];
  wrap?: React.CSSProperties["flexWrap"];
};

type StackRef = React.ElementRef<typeof Box>;

const Stack = React.forwardRef<StackRef, StackProps>(
  ({ className, ...props }) => {
    // TODO: compose this with forwardRef once @telegraph/composed-ref is published
    const stackRef = React.useRef<HTMLDivElement>(null);

    // Filter out the stac props from the rest of the props
    const filteredProps = React.useMemo(
      () =>
        Object.keys(props).reduce(
          (acc, key) => {
            if (!Object.keys(STACK_PROPS).some((prop) => prop === key)) {
              acc.rest[key] = props[key as keyof typeof props];
            } else {
              acc.stack[key] = props[key as keyof typeof props];
            }
            return acc;
          },
          { stack: {}, rest: {} } as {
            stack: Record<string, string>;
            rest: Record<string, string>;
          },
        ),
      [props],
    );

    React.useLayoutEffect(() => {
      const setCssVariables = () => {
        console.log("STACK REF", stackRef.current);
        if (!stackRef.current) return;

        const cssVariables: Record<string, string> = {};

        // Iterate through each box prop and add
        // the value to the cssVariables object
        Object.entries(filteredProps.stack).forEach(([key, value]) => {
          if (value) {
            const stackProp = STACK_PROPS[key as StackProp];

            // If the stackProp is a spacing type, derive the value so
            // that we utilize our telegraph spacing tokens
            if (stackProp.type?.includes("spacing")) {
              // Get current value so we can merge like values
              const currentValueOfCssVariable =
                cssVariables[`--tgph-${stackProp.rule}`] || "";

              cssVariables[`--tgph-${stackProp.rule}`] = deriveSpacing({
                value,
                type: stackProp.type,
                currentValue: currentValueOfCssVariable || "",
              });
            } else {
              cssVariables[`--tgph-${stackProp.rule}`] = value;
            }
          }
        });

        // Add the cssVariables to the boxRef
        Object.entries(cssVariables).forEach(([key, value]) => {
          if (stackRef.current) {
            stackRef.current.style.setProperty(key, value);
          }
        });
      };
      setCssVariables();
    }, [filteredProps.stack]);

    return (
      <Box
        className={clsx("tgph-stack", className)}
        ref={stackRef}
        {...filteredProps.rest}
      />
    );
  },
);

export { Stack };
