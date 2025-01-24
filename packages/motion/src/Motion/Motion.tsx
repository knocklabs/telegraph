import { type PolymorphicProps, type TgphElement } from "@telegraph/helpers";
import { clsx } from "clsx";
import React from "react";

import { useAnimatePresence } from "../AnimatePresence";

import type { TransitionType } from "./Motion.constants";
import { getAnimationTimingFunction } from "./Motion.helpers";

type MotionValues = {
  opacity?: number;
  scale?: number;
  x?: number;
  y?: number;
  rotate?: number;
};

type Transition = {
  duration?: number;
  type?: TransitionType;
};

type MotionProps<T extends TgphElement> = PolymorphicProps<T> & {
  initial?: MotionValues;
  animate?: MotionValues;
  exit?: MotionValues;
  transition?: Transition;
  status?: "initial" | "animate" | "exit";
  children?: React.ReactNode;
};

const Motion = <T extends TgphElement>({
  as,
  status = "initial",
  className,
  initial,
  animate,
  exit,
  transition,
  style,
  children,
  "tgph-motion-key": motionKey,
  ...props
}: MotionProps<T>) => {
  const Component = as || "div";

  const [currentValues, setCurrentValues] = React.useState(initial);
  const [internalStatus, setInternalStatus] = React.useState("initial");

  // If the motion element is within the <AnimatePresence/> component,
  // this component needs to respond too the presence change by changing
  // the internalStatus to "exit"
  const { presence } = useAnimatePresence({
    motionKey,
    exitDuration: transition?.duration,
  });

  React.useEffect(() => {
    if (presence === false) {
      setInternalStatus("exit");
    }
  }, [presence, internalStatus]);

  // Sync the internalStatus with the external status prop.
  // We do this so we can derive internalStatus
  React.useEffect(() => {
    if (status === "initial") {
      setInternalStatus("animate");
    }

    if (status === "exit") {
      setInternalStatus("exit");
    }
  }, [status]);

  // When the internalStatus changes, we update the currentValues
  // to the corresponding values
  React.useEffect(() => {
    if (internalStatus === "initial") {
      setCurrentValues(initial);
    }

    if (internalStatus === "animate") {
      setCurrentValues(animate);
    }

    if (internalStatus === "exit") {
      setCurrentValues(exit);
    }
  }, [internalStatus, status, initial, animate, exit]);

  return (
    // @ts-expect-error - CSS variables inline throws a type error, but it's valid HTML.
    <Component
      className={clsx("tgph-motion", className)}
      style={{
        "--motion-opacity": currentValues?.opacity,
        "--motion-scale": currentValues?.scale,
        "--motion-x":
          typeof currentValues?.x === "number" ? `${currentValues?.x}px` : null,
        "--motion-y":
          typeof currentValues?.y === "number" ? `${currentValues?.y}px` : null,
        "--motion-rotate":
          typeof currentValues?.rotate === "number"
            ? `${currentValues?.rotate}deg`
            : null,
        "--motion-transition-duration": `${transition?.duration}ms`,
        "--motion-transition-type": getAnimationTimingFunction(
          transition?.type,
        ),
        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
};

Motion.displayName = "Motion";

const motion = {
  div: (props: MotionProps<"div">) => <Motion as="div" {...props} />,
  span: (props: MotionProps<"span">) => <Motion as="span" {...props} />,
};

export { Motion, motion };
