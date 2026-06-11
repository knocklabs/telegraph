import React from "react";

const FORWARD_REF_SYMBOL = Symbol.for("react.forward_ref");

type ApplyRefPropsProps = {
  children: React.ReactNode;
};

type Child = React.ReactElement & {
  $$typeof: symbol;
  type: { $$typeof: symbol };
};

const mergeProps = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  slotProps: Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  childProps: Record<string, any>,
) => {
  // Match Slot-style precedence: child props win unless a prop needs composition.
  const overrideProps = { ...childProps };

  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];

    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args: unknown[]) => {
          // Child handlers run first so they can observe their original event
          // before the wrapper primitive reacts to it.
          childPropValue(...args);
          slotPropValue(...args);
        };
      } else if (slotPropValue) {
        // Slot-only handlers still need to be forwarded when the child did not
        // define that interaction prop itself.
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === "style") {
      // Keep both style objects while preserving child override behavior for
      // conflicting keys.
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

      if (
        $$typeof === FORWARD_REF_SYMBOL ||
        $$typeofType === FORWARD_REF_SYMBOL
      ) {
        return React.cloneElement(validChild, {
          ...mergeProps(props, childProps as Record<string, unknown>),
          // ForwardRef children may be third-party components that only read
          // `ref` or Telegraph components that still expect `tgphRef`.
          tgphRef: tgphRef || ref,
          ref: tgphRef || ref,
        } as Record<string, unknown>);
      }

      return React.cloneElement(validChild, {
        ...mergeProps(props, childProps as Record<string, unknown>),
        // Plain function children cannot receive a React ref without warnings,
        // so bridge through Telegraph's custom ref prop only.
        tgphRef: tgphRef || ref,
      } as Record<string, unknown>);
    }

    return child;
  });
};

// This adapter accepts refs for many element types, so keeping the forwarded ref
// generic avoids forcing every caller into one DOM element shape.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RefToTgphRef = React.forwardRef<any, any>(
  ({ children: childrenProp, ...props }, ref) => {
    // Parent primitives can recreate ref callbacks every render; store the
    // latest one behind a stable callback so cloned children do not see a new
    // ref prop and loop.
    const refStorage = React.useRef(ref);

    // Track the currently mounted node so a ref identity change can be replayed
    // without waiting for the child to remount.
    const nodeStorage = React.useRef<unknown>(null);

    React.useEffect(() => {
      const prevRef = refStorage.current;
      const currentNode = nodeStorage.current;

      if (prevRef !== ref && currentNode) {
        // Mirror React's native ref replacement behavior by clearing the old
        // ref before attaching the latest ref to the already-mounted node.
        if (typeof prevRef === "function") {
          prevRef(null);
        } else if (prevRef) {
          (prevRef as React.MutableRefObject<unknown>).current = null;
        }

        if (typeof ref === "function") {
          ref(currentNode);
        } else if (ref) {
          (ref as React.MutableRefObject<unknown>).current = currentNode;
        }
      }

      refStorage.current = ref;
    });

    const stableRef = React.useCallback((node: unknown) => {
      // Keep the node available for the effect above if the parent swaps refs
      // after this callback was attached.
      nodeStorage.current = node;

      const currentRef = refStorage.current;

      // The callback identity is stable, but the target ref it forwards to is
      // always the latest parent ref from storage.
      if (typeof currentRef === "function") {
        currentRef(node);
      } else if (currentRef) {
        (currentRef as React.MutableRefObject<unknown>).current = node;
      }
    }, []);

    return applyRefProps({ children: childrenProp, ...props }, stableRef);
  },
);

export { RefToTgphRef };
