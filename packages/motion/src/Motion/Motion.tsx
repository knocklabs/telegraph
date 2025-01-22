import type { PolymorphicProps, TgphElement } from "@telegraph/helpers";
import { clsx } from "clsx";
import React from "react";

type MotionValues = {
  opacity?: number;
  scale?: number;
  x?: number;
  y?: number;
  rotate?: number;
};

type Transition = {
  duration?: number;
  type?: "ease-in-out" | "ease-in" | "ease-out" | "linear";
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
  children,
  style,
  ...props
}: MotionProps<T>) => {
  const Component = as || "div";

  const [currentValues, setCurrentValues] = React.useState(initial);
  const [internalStatus, setInternalStatus] = React.useState("initial");

  React.useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (status === "initial") {
      timeout = setTimeout(() => {
        setInternalStatus("animate");
      }, 10);
    }

    if (status === "exit") {
      timeout = setTimeout(() => {
        setInternalStatus("exit");
      }, 10);
    }

    return () => clearTimeout(timeout);
  }, [status]);

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

  console.log("HERE ANIMATE", animate);
  console.log("HERE INTERNAL STATUS", internalStatus);

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
        "--motion-transition-type": transition?.type,
        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
};

export { Motion };
