import clsx from "clsx";
import React from "react";

import { validProps } from "./Box.constants";
import { deriveSpacing } from "./Box.helpers";

type ValidProp = (typeof validProps)[number]["name"];
type BoxProps = React.HTMLAttributes<HTMLDivElement> & {
  [key in ValidProp]?: string;
};
type BoxRef = HTMLDivElement;

const Box = React.forwardRef<BoxRef, BoxProps>(({ ...props }) => {
  // TODO: compose this with forrwardRef once @telegraph/composed-ref is published
  const boxRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const setCssVariables = () => {
      if (!boxRef.current) return;

      const cssVariables: Record<string, string> = {};

      // Iterate through each prop and set add the corresponding value
      // to the cssVariables object
      validProps.forEach((prop) => {
        const value = props[prop.name];
        if (value) {
          if (prop.type.includes("spacing")) {
            return (cssVariables[`--tgph-${prop.rule}`] = deriveSpacing({
              value,
              type: prop.type,
              currentValue: cssVariables[`--tgph-${prop.rule}`] || "",
            }));
          }

          return (cssVariables[`--tgph-${prop.rule}`] = value);
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
  }, [props]);

  const filteredProps = Object.keys(props).reduce(
    (acc, key) => {
      if (!validProps.some((prop) => prop.name === key)) {
        acc[key] = props[key as keyof typeof props];
      }
      return acc;
    },
    {} as Record<string, string>,
  );

  return <div className={clsx("tgph-box")} ref={boxRef} {...filteredProps} />;
});

export { Box };
