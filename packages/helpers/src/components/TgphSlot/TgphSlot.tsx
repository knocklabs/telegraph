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
} from "react";

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

const getElementRef = (element: ReactElement<SlottableChildProps>) => {
  const propsRefGetter = Object.getOwnPropertyDescriptor(
    element.props,
    "ref",
  )?.get;

  if (isReactWarningGetter(propsRefGetter)) {
    return (element as ElementWithRef).ref;
  }

  const elementRefGetter = Object.getOwnPropertyDescriptor(element, "ref")?.get;

  if (isReactWarningGetter(elementRefGetter)) {
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

const composeDefinedRefs = <T,>(...refs: (Ref<T> | undefined)[]) => {
  return refs.some(Boolean) ? composeRefs(...refs) : undefined;
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
  ref: Ref<HTMLElement> | undefined,
) => {
  const childRef = getElementRef(child);
  const childTgphRef = child.props.tgphRef;
  const composedRef = composeDefinedRefs(ref, childRef);

  if (!composedRef && !childTgphRef) {
    return {};
  }

  const element = child as ElementWithRef;

  if (isIntrinsicElement(element)) {
    return { ref: composedRef };
  }

  if (isForwardRefElement(element)) {
    const composedTgphRef = childTgphRef
      ? composeDefinedRefs(ref, childTgphRef)
      : composedRef;

    return {
      ...(composedRef ? { ref: composedRef } : {}),
      ...(composedTgphRef ? { tgphRef: composedTgphRef } : {}),
    };
  }

  const composedTgphRef = composeDefinedRefs(ref, childTgphRef);

  return {
    ...(composedTgphRef ? { tgphRef: composedTgphRef } : {}),
  };
};

const TgphSlot = forwardRef<HTMLElement, TgphSlotProps>(
  ({ children, ...props }, forwardedRef) => {
    const child = Children.only(children);

    if (!isValidElement<SlottableChildProps>(child)) {
      return null;
    }

    return cloneElement(child, {
      ...mergeProps(
        props as IntrinsicMergeProps,
        child.props as IntrinsicMergeProps,
      ),
      ...getRefProps(child, forwardedRef),
    });
  },
);

export { TgphSlot };
export type { TgphSlotProps };
