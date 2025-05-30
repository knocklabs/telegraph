import {
  type PolymorphicPropsWithTgphRef,
  type TgphElement,
} from "@telegraph/helpers";
import { clsx } from "clsx";
import React from "react";

import { useAnimatePresence } from "../AnimatePresence";

import type { TransitionType } from "./Motion.constants";
import { getAnimationTimingFunction } from "./Motion.helpers";

type MotionValues = {
  opacity?: number;
  scale?: number;
  x?: number | string;
  y?: number | string;
  rotate?: number;
};

type Transition = {
  duration?: number;
  type?: TransitionType;
};

type MotionProps<T extends TgphElement> = PolymorphicPropsWithTgphRef<
  T,
  TgphElement
> & {
  skipAnimation?: boolean;
  initial?: MotionValues;
  animate?: MotionValues;
  exit?: MotionValues;
  transition?: Transition;
  status?: "initial" | "animate" | "exit";
  initializeWithAnimation?: boolean;
  children?: React.ReactNode;
  onAnimationComplete?: () => void;
};

const Motion = <T extends TgphElement>({
  as,
  status = "initial",
  className,
  initial,
  animate,
  exit,
  transition,
  initializeWithAnimation = true,
  skipAnimation = false,
  style,
  children,
  "tgph-motion-key": motionKey,
  onAnimationComplete,
  tgphRef,
  ...props
}: MotionProps<T>) => {
  const Component = as || "div";

  // If the motion element is within the <AnimatePresence/> component,
  // this component needs to respond too the presence change by changing
  // the internalStatus to "exit"
  const { presence, initialAnimateComplete } = useAnimatePresence({
    motionKey: motionKey || "",
    exitDuration: transition?.duration || 0,
  });

  const [currentValues, setCurrentValues] = React.useState(
    initializeWithAnimation === false && initialAnimateComplete === false
      ? animate
      : initial,
  );
  const [internalStatus, setInternalStatus] = React.useState(
    initializeWithAnimation === false && initialAnimateComplete === false
      ? "animate"
      : "initial",
  );

  React.useEffect(() => {
    if (presence === false && internalStatus === "animate") {
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
    // We set a very short timeout here to ensure that the
    // DOM element has responded to the state changes first.
    let timeout: NodeJS.Timeout;

    if (internalStatus === "initial") {
      timeout = setTimeout(() => {
        setCurrentValues(initial);
      }, 10);
    }

    if (internalStatus === "animate") {
      timeout = setTimeout(() => {
        setCurrentValues(animate);

        if (onAnimationComplete) {
          setTimeout(() => {
            onAnimationComplete();
          }, 10);
        }
      }, 10);
    }

    if (internalStatus === "exit") {
      timeout = setTimeout(() => {
        setCurrentValues(exit);
      }, 10);
    }

    return () => timeout && clearTimeout(timeout);
  }, [internalStatus, status, initial, animate, exit, onAnimationComplete]);

  const transitionDuration =
    initializeWithAnimation === false && initialAnimateComplete === false
      ? 0
      : transition?.duration;

  return (
    // @ts-expect-error - CSS variables inline throws a type error, but it's valid HTML.
    <Component
      className={clsx("tgph-motion", className)}
      style={{
        ...(!skipAnimation && {
          "--motion-opacity": currentValues?.opacity,
          "--motion-scale": currentValues?.scale,
          "--motion-x":
            typeof currentValues?.x === "number"
              ? `${currentValues?.x}px`
              : typeof currentValues?.x === "string"
                ? currentValues?.x
                : null,
          "--motion-y":
            typeof currentValues?.y === "number"
              ? `${currentValues?.y}px`
              : typeof currentValues?.y === "string"
                ? currentValues?.y
                : null,
          "--motion-rotate":
            typeof currentValues?.rotate === "number"
              ? `${currentValues?.rotate}deg`
              : null,
          "--motion-transition-duration": `${transitionDuration}ms`,
          "--motion-transition-type": getAnimationTimingFunction(
            transition?.type,
          ),
        }),
        ...style,
      }}
      {...props}
      ref={tgphRef}
    >
      {children}
    </Component>
  );
};

Motion.displayName = "Motion";

// forwardRef is needed here because of how it's used with the `as` prop.
// We then cast the React.FC type so that the component's types can be
// interacted with as usual.
const motion = {
  div: React.forwardRef<TgphElement>((props: MotionProps<"div">, ref) => (
    <Motion as="div" {...props} tgphRef={ref || props.tgphRef} />
  )) as React.FC<MotionProps<"div">>,
  span: React.forwardRef<TgphElement>((props: MotionProps<"span">, ref) => (
    <Motion as="span" {...props} tgphRef={ref || props.tgphRef} />
  )) as React.FC<MotionProps<"span">>,
  button: React.forwardRef<TgphElement>((props: MotionProps<"button">, ref) => (
    <Motion as="button" {...props} tgphRef={ref || props.tgphRef} />
  )) as React.FC<MotionProps<"button">>,
};

export { Motion, motion };
