import { useComposedRefs } from "@telegraph/compose-refs";
import type {
  ComponentPropsWithAs,
  PropsWithAs,
  RefWithAs,
} from "@telegraph/helpers";
import clsx from "clsx";
import React from "react";

import { propsToCssVariables } from "../helpers/css-variables";

import { BOX_PROPS } from "./Box.constants";
import { BoxPropsTokens } from "./Box.types";

type BoxProps = ComponentPropsWithAs<"div", BoxPropsTokens>;
type BoxRef = RefWithAs<"div">;

const Box = React.forwardRef<BoxRef, BoxProps>(
  ({ as = "div", className, ...props }, forwardedRef) => {
    const boxRef = React.useRef<HTMLDivElement>(null);
    const composedRef = useComposedRefs(forwardedRef, boxRef);
    // Filter out the box props from the rest of the props
    const filteredProps = React.useMemo(() => {
      // Set any defaults here
      const mergedProps = { borderColor: true, ...props };
      return Object.keys(mergedProps).reduce(
        (acc, key) => {
          if (!Object.keys(BOX_PROPS).some((prop) => prop === key)) {
            acc.rest[key] = mergedProps[key as keyof typeof mergedProps];
          } else {
            acc.box[key] = mergedProps[key as keyof typeof mergedProps];
          }
          return acc;
        },
        { box: {}, rest: {} } as {
          box: Record<string, string>;
          rest: Record<string, string>;
        },
      );
    }, [props]);

    React.useLayoutEffect(() => {
      propsToCssVariables({
        props: filteredProps.box,
        ref: boxRef,
        propsMap: BOX_PROPS,
      });
    }, [filteredProps.box]);

    const Component = as;

    return (
      <Component
        className={clsx("tgph-box", className)}
        ref={composedRef}
        {...filteredProps.rest}
      />
    );
  },
) as <T extends React.ElementType>(
  props: PropsWithAs<T, BoxPropsTokens>,
) => React.ReactElement;

export { Box };
