import {
  type AsProp,
  type TgphElement,
  resolveNativeButton,
} from "@telegraph/helpers";

type ResolveButtonNativeButtonOptions = AsProp<TgphElement> & {
  disabled?: boolean;
  nativeButton?: boolean;
};

type ResolveButtonNativeButton = (
  options: ResolveButtonNativeButtonOptions,
) => boolean | undefined;

// Base UI needs this before render so it can choose native attributes or
// synthetic button semantics. Motion exposes its underlying intrinsic tag via
// a stable symbol; arbitrary components remain unknown for Base UI to default.
const resolveButtonNativeButton: ResolveButtonNativeButton = ({
  as,
  disabled,
  nativeButton,
}) => {
  // Disabled Telegraph buttons are always rendered as native buttons, so that
  // coercion must win over an explicit value passed to a Base UI primitive.
  if (disabled) {
    return true;
  }

  if (nativeButton !== undefined) {
    return nativeButton;
  }

  if (!as) {
    return true;
  }

  return resolveNativeButton({ component: as });
};

// Button.Root uses this only to choose which component to render. A component
// such as motion.button may resolve to a native button, but it must not be
// replaced with the intrinsic tag or its component behavior will be lost.
const rendersNativeButton = (as?: TgphElement, disabled?: boolean) =>
  !!disabled || !as || as === "button";

export {
  rendersNativeButton,
  resolveButtonNativeButton,
  type ResolveButtonNativeButtonOptions,
};
