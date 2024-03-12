import { useComposedRefs } from "@telegraph/compose-refs";
import type t from "@telegraph/tokens";
import clsx from "clsx";
import React from "react";

import { Responsive } from "../helpers/breakpoints";
import { propsToCssVariables } from "../helpers/css-variables";

import { BOX_PROPS, VARIANT } from "./Box.constants";

type BoxProp = keyof typeof BOX_PROPS;
type BoxProps = React.HTMLAttributes<HTMLDivElement> & {
  [key in BoxProp]?: Responsive<`${keyof typeof t.tokens.spacing}`> &
    Responsive<"auto">;
} & {
  // More variants wil beed added here once
  // they are designed
  variant?: "ghost";
};
type BoxRef = HTMLDivElement;

const Box = React.forwardRef<BoxRef, BoxProps>(
  ({ variant = "ghost", className, ...props }, forwardedRef) => {
    const boxRef = React.useRef<HTMLDivElement>(null);
    const composedRef = useComposedRefs(forwardedRef, boxRef);

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
      propsToCssVariables({
        props: filteredProps.box,
        ref: boxRef,
        propsMap: BOX_PROPS,
      });
    }, [filteredProps.box]);

    return (
      <div
        className={clsx("tgph-box", VARIANT[variant], className)}
        ref={composedRef}
        {...filteredProps.rest}
      />
    );
  },
);

export { Box };
