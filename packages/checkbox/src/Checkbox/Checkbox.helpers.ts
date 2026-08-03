import {
  Children,
  type ElementType,
  type ReactNode,
  isValidElement,
} from "react";

/**
 * Counts how many `labelComponent` elements appear in `node`, walking into
 * nested children so a label inside a wrapper still counts.
 *
 * The component is a parameter rather than an import so this file stays free of
 * a cycle back to `Checkbox.tsx`, where the label is defined.
 *
 * It cannot see through a custom component: a label returned by one counts as
 * zero. `Checkbox.Control` then leaves `aria-labelledby` unset and Base UI names
 * the control from the rendered `<label for>` instead, which is the right
 * fallback.
 */
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
