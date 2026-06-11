import { mergeProps } from "@base-ui/react/merge-props";
import type { ComponentRenderFn, HTMLProps } from "@base-ui/react/use-render";
import {
  type ComponentPropsWithRef,
  type MutableRefObject,
  type ReactElement,
  type Ref,
  type RefAttributes,
  cloneElement,
  isValidElement,
} from "react";

import { RefToTgphRef } from "../components/RefToTgphRef";

type PropsWithRef = HTMLProps & {
  ref?: Ref<unknown>;
};

type CloneableProps = Record<string, unknown> & RefAttributes<unknown>;

type IntrinsicMergeProps = ComponentPropsWithRef<"button">;

type ElementWithRef = ReactElement<CloneableProps> & {
  ref?: Ref<unknown>;
};

type WarningGetter = (() => unknown) & {
  isReactWarning?: boolean;
};

type TgphBaseUIRenderElement<State = Record<string, unknown>> =
  | ReactElement
  | ((state: State) => ReactElement);

type GetRenderElementParams<State> = {
  element: TgphBaseUIRenderElement<State>;
  state: State;
};

type RenderNativeElementParams = {
  props: PropsWithRef;
  renderElement: ReactElement;
};

const isIntrinsicElement = (element: ReactElement) => {
  return typeof element.type === "string";
};

const isReactWarningGetter = (
  getter: (() => unknown) | undefined,
): getter is WarningGetter => {
  return Boolean(getter && "isReactWarning" in getter && getter.isReactWarning);
};

const getElementRef = (element: ReactElement<CloneableProps>) => {
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
  const definedRefs = refs.filter((ref): ref is Ref<T> => Boolean(ref));

  if (definedRefs.length === 0) {
    return undefined;
  }

  return (node: T | null) => {
    definedRefs.forEach((ref) => setRef(ref, node));
  };
};

const getRenderElement = <State = Record<string, unknown>,>({
  element,
  state,
}: GetRenderElementParams<State>) => {
  if (typeof element === "function") {
    return element(state);
  }

  return element;
};

const renderNativeElement = ({
  props,
  renderElement,
}: RenderNativeElementParams) => {
  // React treats refs specially when cloning, so pull Base UI's forwarded ref
  // out before merging the rest of the props into the rendered element.
  const { ref, ...baseUIProps } = props;
  const cloneableElement = renderElement as ReactElement<CloneableProps>;
  const childRef = getElementRef(cloneableElement);
  const composedRef = composeRefs(childRef, ref);

  return cloneElement(cloneableElement, {
    // Keep Base UI's injected event handlers and data attributes composed with
    // the caller's element props instead of replacing one side wholesale.
    ...mergeProps(
      baseUIProps as IntrinsicMergeProps,
      renderElement.props as IntrinsicMergeProps,
    ),
    ...(composedRef ? { ref: composedRef } : {}),
  });
};

const createTgphBaseUIRender = <
  Props extends HTMLProps = HTMLProps,
  State = Record<string, unknown>,
>(
  element: TgphBaseUIRenderElement<State>,
): ComponentRenderFn<Props, State> => {
  return (props, state) => {
    // Base UI may call `render` with live state, so resolve function children
    // before choosing the native-element path or Telegraph ref bridge.
    const renderElement = getRenderElement({ element, state });

    if (!isValidElement(renderElement)) {
      return renderElement;
    }

    if (isIntrinsicElement(renderElement)) {
      // Native elements can receive Base UI's merged props and React ref
      // directly, so keep Base UI's merge behavior intact here.
      return renderNativeElement({
        props: props as PropsWithRef,
        renderElement,
      });
    }

    // Telegraph components need Base UI's standard `ref` bridged to `tgphRef`.
    return <RefToTgphRef {...props}>{renderElement}</RefToTgphRef>;
  };
};

export { createTgphBaseUIRender };
export type { TgphBaseUIRenderElement };
