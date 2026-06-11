import {
  type CSSProperties,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";

import { TgphSlot } from "../TgphSlot";

// Shared a11y-only styles used by migrated primitives that previously relied on
// Radix VisuallyHidden. Keep this object frozen so callers cannot mutate the
// base style contract across component instances.
const VISUALLY_HIDDEN_STYLES = Object.freeze({
  position: "absolute",
  border: 0,
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  wordWrap: "normal",
} satisfies CSSProperties);

export type VisuallyHiddenProps = ComponentPropsWithoutRef<"span"> & {
  asChild?: boolean;
  children?: ReactNode;
};

const getVisuallyHiddenStyle = (
  style: CSSProperties | undefined,
): CSSProperties => {
  return {
    ...VISUALLY_HIDDEN_STYLES,
    ...style,
  };
};

export const VisuallyHidden = ({
  asChild = false,
  style,
  ...props
}: VisuallyHiddenProps) => {
  const visuallyHiddenProps = {
    style: getVisuallyHiddenStyle(style),
    ...props,
  };

  if (asChild) {
    // `asChild` lets consumers hide an existing semantic node, such as `label`
    // or Base UI's title/description element, without adding an extra wrapper.
    return <TgphSlot {...visuallyHiddenProps} />;
  }

  return <span {...visuallyHiddenProps} />;
};
