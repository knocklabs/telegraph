import { useComposedRefs } from "@telegraph/compose-refs";
import type {
  PolymorphicPropsWithTgphRef,
  TgphElement,
} from "@telegraph/helpers";
import type t from "@telegraph/tokens";
import clsx from "clsx";
import React from "react";

import { Box } from "../Box";
import { type Responsive } from "../helpers/breakpoints";
import { propsToCssVariables } from "../helpers/css-variables";

import { STACK_PROPS } from "./Stack.constants";

type StackProps<T extends TgphElement> = PolymorphicPropsWithTgphRef<
  T,
  typeof Box
> &
  React.ComponentProps<typeof Box> & {
    gap?: Responsive<`${keyof typeof t.tokens.spacing}`>;
    display?: Responsive<"flex" | "inline-flex">;
    align?: Responsive<React.CSSProperties["alignItems"]>;
    direction?: Responsive<React.CSSProperties["flexDirection"]>;
    justify?: Responsive<React.CSSProperties["justifyContent"]>;
    wrap?: Responsive<React.CSSProperties["flexWrap"]>;
  };

const Stack = <T extends TgphElement>({
  className,
  tgphRef,
  ...props
}: StackProps<T>) => {
  const stackRef = React.useRef<StackProps<T>["tgphRef"]>(null);
  const composedRef = useComposedRefs(tgphRef, stackRef);

  // Filter out the stack props from the rest of the props
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
          stack: Record<string, Responsive<string>>;
          rest: Record<string, Responsive<string>>;
        },
      ),
    [props],
  );

  React.useLayoutEffect(() => {
    propsToCssVariables({
      props: filteredProps.stack,
      ref: stackRef,
      propsMap: STACK_PROPS,
    });
  }, [filteredProps.stack, composedRef]);

  return (
    <Box
      className={clsx("tgph-stack", className)}
      tgphRef={composedRef}
      {...filteredProps.rest}
    />
  );
};

export { Stack };
