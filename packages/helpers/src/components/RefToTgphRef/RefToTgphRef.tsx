//
// When interacting with components like a Radix.Trigger, they assume that
// our components accept a `ref` prop. This is not the case with our components
// because we use the `tgphRef` prop instead. To work around this, we can create
// a new component that accepts a `ref` prop and forwards it to the `tgphRef`
// prop.
//
import React from "react";

const FORWARD_REF_SYMBOL = Symbol.for("react.forward_ref");

type ApplyRefPropsProps = {
  children: React.ReactNode;
};

type Child = React.ReactElement & {
  $$typeof: symbol;
  type: { $$typeof: symbol };
};

// Merge props the same way that radix slot does
// https://github.com/radix-ui/primitives/blob/main/packages/react/slot/src/Slot.tsx
const mergeProps = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  slotProps: Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  childProps: Record<string, any>,
) => {
  // all child props should override
  const overrideProps = { ...childProps };

  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];

    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      // if the handler exists on both, we compose them
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args: unknown[]) => {
          childPropValue(...args);
          slotPropValue(...args);
        };
      }
      // but if it exists only on the slot, we use only this one
      else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    }
    // if it's `style`, we merge them
    else if (propName === "style") {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue]
        .filter(Boolean)
        .join(" ");
    }
  }

  return { ...slotProps, ...overrideProps };
};

const applyRefProps = (
  { children, ...props }: ApplyRefPropsProps,
  ref: React.Ref<unknown>,
) => {
  if (!children) return null;
  const childrenArray = React.Children.toArray(children);
  return childrenArray.map((child) => {
    if (React.isValidElement(child)) {
      const validChild = child as Child;
      const $$typeof = validChild.$$typeof;
      const $$typeofType = validChild.type.$$typeof;
      const childProps = validChild.props as Record<string, unknown>;
      const tgphRef = childProps.tgphRef;

      // If we detect that the child is a forwardRef, we to pass the `ref` prop
      // to it so that components that exist outside of our library can still
      // receive the ref. We do it this way in order to avoid this warning:
      // "Function components cannot be given refs. Attempts to access this ref will fail.
      // Did you mean to use React.forwardRef()"
      if (
        $$typeof === FORWARD_REF_SYMBOL ||
        $$typeofType === FORWARD_REF_SYMBOL
      ) {
        return React.cloneElement(validChild, {
          ...mergeProps(props, childProps as Record<string, unknown>),
          tgphRef: tgphRef || ref,
          ref: tgphRef || ref,
        } as Record<string, unknown>);
      }

      // Otherwise, we can just pass the `tgphRef` prop to the child.
      return React.cloneElement(validChild, {
        ...mergeProps(props, childProps as Record<string, unknown>),
        tgphRef: tgphRef || ref,
      } as Record<string, unknown>);
    }

    // If the child is not a valid element, we can just return it.
    return child;
  });
};

// We can't generate the type of the ref because it's a forwardRef so any
// works for this use case
//
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RefToTgphRef = React.forwardRef<any, any>(
  ({ children: childrenProp, ...props }, ref) => {
    return applyRefProps({ children: childrenProp, ...props }, ref);
  },
);

export { RefToTgphRef };
