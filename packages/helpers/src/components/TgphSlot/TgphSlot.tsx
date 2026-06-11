import { mergeProps } from "@base-ui/react/merge-props";
import {
  Children,
  type ComponentPropsWithRef,
  type MutableRefObject,
  type ReactElement,
  type ReactNode,
  type Ref,
  type RefAttributes,
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
} from "react";

// React marks forwardRef components with this symbol in the element metadata.
// Checking it lets us decide whether a child can safely receive `ref`.
const FORWARD_REF_SYMBOL = Symbol.for("react.forward_ref");

type TgphSlotProps = ComponentPropsWithRef<"span"> &
  Record<string, unknown> & {
    children?: ReactNode;
  };

type SlottableChildProps = Record<string, unknown> &
  RefAttributes<HTMLElement> & {
    tgphRef?: Ref<HTMLElement>;
  };

type IntrinsicMergeProps = ComponentPropsWithRef<"span">;

type ElementWithRef = ReactElement<SlottableChildProps> & {
  $$typeof?: symbol;
  ref?: Ref<HTMLElement>;
  type:
    | string
    | {
        $$typeof?: symbol;
      };
};

type WarningGetter = (() => unknown) & {
  isReactWarning?: boolean;
};

const isReactWarningGetter = (
  getter: (() => unknown) | undefined,
): getter is WarningGetter => {
  return Boolean(getter && "isReactWarning" in getter && getter.isReactWarning);
};

// React 18 and 19 expose child refs differently. Reading the wrong location can
// trigger React's dev warning getter, so mirror Radix's defensive extraction
// before composing the wrapper ref with the child's existing ref.
const getElementRef = (element: ReactElement<SlottableChildProps>) => {
  const propsRefGetter = Object.getOwnPropertyDescriptor(
    element.props,
    "ref",
  )?.get;

  if (isReactWarningGetter(propsRefGetter)) {
    // React 18 can hide the real ref on the element when props.ref is only the
    // dev warning getter, so read the element field in that case.
    return (element as ElementWithRef).ref;
  }

  const elementRefGetter = Object.getOwnPropertyDescriptor(element, "ref")?.get;

  if (isReactWarningGetter(elementRefGetter)) {
    // React 19 moves refs into props; if element.ref is the warning getter,
    // prefer the props ref so we do not trip the warning while composing refs.
    return element.props.ref;
  }

  return element.props.ref ?? (element as ElementWithRef).ref;
};

const setRef = <T,>(ref: Ref<T> | undefined, value: T | null) => {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref !== null && ref !== undefined) {
    (ref as MutableRefObject<T | null>).current = value;
  }
};

const composeRefs = <T,>(...refs: (Ref<T> | undefined)[]) => {
  return (node: T | null) => {
    refs.forEach((ref) => setRef(ref, node));
  };
};

const getDefinedRefs = <T,>(refs: (Ref<T> | undefined)[]) => {
  return refs.filter((ref): ref is Ref<T> => Boolean(ref));
};

const areRefsEqual = <T,>(refs: Ref<T>[], nextRefs: Ref<T>[]) => {
  return (
    refs.length === nextRefs.length &&
    refs.every((ref, index) => ref === nextRefs[index])
  );
};

const useStableComposedRefs = <T,>(...refs: (Ref<T> | undefined)[]) => {
  const definedRefs = getDefinedRefs(refs);
  const refsStorage = useRef(definedRefs);
  const previousRefsStorage = useRef(definedRefs);
  const nodeStorage = useRef<T | null>(null);

  // Keep the returned callback stable while still giving it the latest refs.
  refsStorage.current = definedRefs;

  useEffect(() => {
    const previousRefs = previousRefsStorage.current;
    const currentRefs = refsStorage.current;
    const currentNode = nodeStorage.current;

    if (currentNode && !areRefsEqual(previousRefs, currentRefs)) {
      // A child can add or remove refs between renders; clear removed refs and
      // replay the mounted node to newly introduced refs without remounting it.
      previousRefs.forEach((ref) => {
        if (!currentRefs.includes(ref)) {
          setRef(ref, null);
        }
      });

      currentRefs.forEach((ref) => {
        if (!previousRefs.includes(ref)) {
          setRef(ref, currentNode);
        }
      });
    }

    previousRefsStorage.current = currentRefs;
  });

  const stableRef = useCallback((node: T | null) => {
    // Store the latest node so the effect above can sync refs that appear after
    // the callback was originally attached.
    nodeStorage.current = node;
    composeRefs(...refsStorage.current)(node);
  }, []);

  return definedRefs.length > 0 ? stableRef : undefined;
};

const isIntrinsicElement = (element: ElementWithRef) => {
  return typeof element.type === "string";
};

const isForwardRefElement = (element: ElementWithRef) => {
  return (
    element.$$typeof === FORWARD_REF_SYMBOL ||
    (typeof element.type !== "string" &&
      element.type.$$typeof === FORWARD_REF_SYMBOL)
  );
};

const getRefProps = (
  child: ReactElement<SlottableChildProps>,
  composedRef: Ref<HTMLElement> | undefined,
  composedTgphRef: Ref<HTMLElement> | undefined,
) => {
  const childTgphRef = child.props.tgphRef;

  if (!composedRef && !childTgphRef) {
    return {};
  }

  const element = child as ElementWithRef;

  if (isIntrinsicElement(element)) {
    return { ref: composedRef };
  }

  // ForwardRef children already have a standard React ref channel. Only keep
  // the Telegraph ref channel when the child explicitly opted into tgphRef.
  if (isForwardRefElement(element)) {
    return {
      ...(composedRef ? { ref: composedRef } : {}),
      ...(childTgphRef && composedTgphRef ? { tgphRef: composedTgphRef } : {}),
    };
  }

  // Plain function components cannot receive `ref` without React warnings, so
  // pass only `tgphRef` for Telegraph-style components that do not forward refs.
  return {
    ...(composedTgphRef ? { tgphRef: composedTgphRef } : {}),
  };
};

const TgphSlot = forwardRef<HTMLElement, TgphSlotProps>(
  ({ children, ...props }, forwardedRef) => {
    // Match Radix Slot's one-child contract before cloning wrapper props into
    // the child element.
    const child = Children.only(children);
    const slottableChild = isValidElement<SlottableChildProps>(child)
      ? child
      : null;
    // Compose the wrapper ref with whichever ref API the child already uses so
    // consumers keep their existing `ref` and `tgphRef` behavior.
    const childRef = slottableChild ? getElementRef(slottableChild) : undefined;
    const childTgphRef = slottableChild?.props.tgphRef;
    const composedRef = useStableComposedRefs(forwardedRef, childRef);
    const composedTgphRef = useStableComposedRefs(forwardedRef, childTgphRef);

    if (!slottableChild) {
      return null;
    }

    return cloneElement(slottableChild, {
      // Merge events, className, and data attributes before assigning the
      // compatible ref props chosen for this specific child shape.
      ...mergeProps(
        props as IntrinsicMergeProps,
        slottableChild.props as IntrinsicMergeProps,
      ),
      ...getRefProps(slottableChild, composedRef, composedTgphRef),
    });
  },
);

export { TgphSlot };
export type { TgphSlotProps };
