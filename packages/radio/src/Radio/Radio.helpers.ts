import {
  Children,
  type ElementType,
  type ReactNode,
  isValidElement,
} from "react";

// Walks nested children, so a label inside a wrapper still counts. The
// component is a parameter rather than an import to keep this file free of a
// cycle back to `Radio.tsx`.
//
// It cannot see through a custom component: a label returned by one counts as
// zero, and Base UI then names the control from the rendered `<label for>`.
export const countLabels = (
  node: ReactNode,
  labelComponent: ElementType,
): number =>
  Children.toArray(node).reduce<number>((total, child) => {
    if (!isValidElement(child)) return total;
    if (child.type === labelComponent) return total + 1;
    const nested = (child.props as { children?: ReactNode }).children;
    return nested ? total + countLabels(nested, labelComponent) : total;
  }, 0);
