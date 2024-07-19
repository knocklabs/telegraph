//
// When interacting with components like a Radix.Trigger, they assume that
// our components accept a `ref` prop. This is not the case with our components
// because we use the `tgphRef` prop instead. To work around this, we can create
// a new component that accepts a `ref` prop and forwards it to the `tgphRef`
// prop.
//
import { Slot } from "@radix-ui/react-slot";
import React from "react";

// We can't generate the type of the ref because it's a forwardRef so any
// works for this use case
//
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RefToTgphRef = React.forwardRef<any, any>((props, ref) => {
  return <Slot {...props} ref={ref} tgphRef={ref} />;
});

export { RefToTgphRef };
