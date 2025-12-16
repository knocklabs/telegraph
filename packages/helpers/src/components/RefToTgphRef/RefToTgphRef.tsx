/**
 * RefToTgphRef Component
 *
 * PURPOSE:
 * ========
 * This component bridges the gap between third-party libraries (like Radix UI) and
 * Telegraph components. Third-party libraries expect components to accept a standard
 * React `ref` prop, but Telegraph components use a custom `tgphRef` prop instead.
 *
 * Without this adapter, using Telegraph components with libraries like Radix would fail
 * because Radix would try to pass a `ref` that Telegraph components wouldn't receive.
 *
 * EXAMPLE USAGE:
 * ==============
 * ```tsx
 * <RadixTooltip.Trigger asChild>
 *   <RefToTgphRef>
 *     <Button>Hover me</Button>  // Button uses tgphRef internally
 *   </RefToTgphRef>
 * </RadixTooltip.Trigger>
 * ```
 *
 * WHAT IT DOES:
 * =============
 * 1. Receives a `ref` from the parent (e.g., Radix)
 * 2. Forwards it as both `ref` AND `tgphRef` to Telegraph children
 * 3. Merges any additional props from the parent with child props
 * 4. Handles both forwardRef components and regular components appropriately
 *
 * THE INFINITE LOOP PROBLEM:
 * ==========================
 * Radix and other libraries often pass ref callbacks that are recreated on every render
 * (new function references). When we pass these unstable refs to children via
 * React.cloneElement, it causes the child to re-render with "new" props even though
 * the ref functionality hasn't actually changed. This can trigger infinite render loops.
 *
 * THE SOLUTION:
 * =============
 * We create a STABLE ref callback using useCallback with an empty dependency array,
 * so the function reference never changes. We store the actual (unstable) ref in a
 * mutable ref (refStorage) and update it on every render. When our stable callback
 * is invoked, it reads from refStorage to get the latest ref and calls it.
 *
 * We also track the DOM node so that if the ref callback itself changes (rare but
 * possible), we can properly cleanup the old ref by calling it with null, and then
 * call the new ref with the current node. This matches React's standard ref behavior.
 */
import React from "react";

const FORWARD_REF_SYMBOL = Symbol.for("react.forward_ref");

type ApplyRefPropsProps = {
  children: React.ReactNode;
};

type Child = React.ReactElement & {
  $$typeof: symbol;
  type: { $$typeof: symbol };
};

/**
 * mergeProps
 *
 * Merges props from the slot (parent/wrapper) with props from the child component.
 * This follows the same approach as Radix's Slot component to ensure compatibility.
 *
 * MERGE STRATEGY:
 * - Event handlers (onX): Compose them so both parent and child handlers run
 * - style: Merge objects (child styles override parent styles with same keys)
 * - className: Concatenate both class strings
 * - Other props: Child props override parent props
 *
 * @see https://github.com/radix-ui/primitives/blob/main/packages/react/slot/src/Slot.tsx
 */
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

/**
 * applyRefProps
 *
 * Clones child elements and applies the forwarded ref and any merged props to them.
 *
 * KEY DECISIONS:
 *
 * 1. ForwardRef Detection:
 *    We check if a child is a forwardRef component by inspecting its $$typeof symbol.
 *    This is necessary because forwardRef components EXPECT a `ref` prop, while
 *    regular function components would throw a warning if given one.
 *
 * 2. Dual Ref Forwarding (forwardRef components):
 *    For forwardRef components, we pass BOTH `ref` and `tgphRef` because:
 *    - They might be third-party components that only understand `ref`
 *    - They might be Telegraph components that need `tgphRef`
 *    - Passing both ensures compatibility with all cases
 *
 * 3. Single Ref Forwarding (regular components):
 *    For non-forwardRef components, we only pass `tgphRef` to avoid React warnings
 *    about function components receiving refs.
 *
 * 4. Ref Priority:
 *    If a child already has a `tgphRef`, we use that instead of the forwarded ref.
 *    This allows child components to override ref behavior if needed.
 */
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

      // CASE 1: ForwardRef Component
      // Pass both `ref` and `tgphRef` to ensure compatibility with both
      // Telegraph components and third-party forwardRef components.
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

      // CASE 2: Regular Component
      // Only pass `tgphRef` to avoid React warnings about function components
      // receiving refs (which would happen if we passed `ref`).
      return React.cloneElement(validChild, {
        ...mergeProps(props, childProps as Record<string, unknown>),
        tgphRef: tgphRef || ref,
      } as Record<string, unknown>);
    }

    // CASE 3: Non-element children (strings, numbers, etc.)
    // Return as-is since they can't receive refs or props.
    return child;
  });
};

/**
 * RefToTgphRef Component Implementation
 *
 * TYPE CONSTRAINTS:
 * We use `any` for the ref type because this component must accept refs of any type
 * (HTMLButtonElement, HTMLDivElement, custom component refs, etc.). Since we're
 * forwarding refs generically, there's no way to statically type this without
 * making the API cumbersome.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RefToTgphRef = React.forwardRef<any, any>(
  ({ children: childrenProp, kind, ...props }, ref) => {
    /**
     * REF STABILIZATION ARCHITECTURE
     *
     * PROBLEM:
     * Libraries like Radix create new ref callback functions on every render.
     * If we pass these unstable refs directly to children via React.cloneElement,
     * React sees the props object as changed (new function reference), causing
     * unnecessary re-renders and potential infinite loops.
     *
     * SOLUTION OVERVIEW:
     * Create a stable callback (stableRef) that never changes (empty deps array),
     * but internally reads from a mutable storage to get the latest ref. This way:
     * - Children receive the same function reference every render (no infinite loops)
     * - The function still forwards to the latest ref (functionality preserved)
     *
     */

    // Storage for the latest ref callback/object from parent (e.g., Radix)
    // This gets updated on every render but doesn't cause re-renders since it's
    // a mutable ref, not state.
    const refStorage = React.useRef(ref);

    // Storage for the current DOM node/component instance
    // We need this to handle ref changes properly (cleanup old, set new)
    const nodeStorage = React.useRef<unknown>(null);

    /**
     * REF CHANGE HANDLING
     *
     * When the parent ref changes (rare, but possible), we need to:
     * 1. Call the OLD ref with null (cleanup - standard React behavior)
     * 2. Call the NEW ref with the current node (re-attach)
     *
     * This matches React's native behavior when a ref prop changes.
     *
     * WHY IN useEffect:
     * We use useEffect (not direct assignment) because we need to detect when
     * the ref has actually changed between renders and perform cleanup/setup.
     */
    React.useEffect(() => {
      const prevRef = refStorage.current;
      const currentNode = nodeStorage.current;

      // Detect ref change
      if (prevRef !== ref && currentNode) {
        // Step 1: Cleanup old ref (call with null)
        if (typeof prevRef === "function") {
          prevRef(null);
        }

        // Step 2: Set new ref with current node
        if (typeof ref === "function") {
          ref(currentNode);
        } else if (ref) {
          (ref as React.MutableRefObject<unknown>).current = currentNode;
        }
      }

      // Update storage with latest ref for next render
      refStorage.current = ref;
    });

    /**
     * STABLE REF CALLBACK
     *
     * This is the key to preventing infinite loops. The function reference
     * returned by useCallback with an empty dependency array NEVER changes.
     *
     * When called (by React when attaching/detaching from DOM):
     * 1. Store the node so we can handle ref changes
     * 2. Read the LATEST ref from refStorage
     * 3. Forward the call to that ref
     *
     * This indirection gives us stability (no infinite loops) while maintaining
     * correctness (always calls the latest ref).
     */
    const stableRef = React.useCallback((node: unknown) => {
      // Store node for ref change handling
      nodeStorage.current = node;

      // Get the current ref (might have been updated since last call)
      const currentRef = refStorage.current;

      // Forward to the actual ref (handle both callback refs and ref objects)
      if (typeof currentRef === "function") {
        currentRef(node);
      } else if (currentRef) {
        (currentRef as React.MutableRefObject<unknown>).current = node;
      }
    }, []); // Empty deps = stable function reference forever

    // Apply the stable ref and merged props to children
    return applyRefProps({ children: childrenProp, ...props }, stableRef);
  },
);

export { RefToTgphRef };
