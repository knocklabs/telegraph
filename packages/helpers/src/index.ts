export type {
  Required,
  AsProp,
  PropsWithAs,
  Optional,
  PolymorphicProps,
  PolymorphicPropsWithTgphRef,
  TgphElement,
  TgphComponentProps,
  OptionalAsPropConfig,
  RemappedOmit,
  AsAndTgphRefProps,
  CSSPropertiesWithVars,
} from "./types/utility";

export { RefToTgphRef } from "./components/RefToTgphRef";
export { TgphSlot, type TgphSlotProps } from "./components/TgphSlot";
export {
  VisuallyHidden,
  type VisuallyHiddenProps,
} from "./components/VisuallyHidden";

export { useControllableState } from "./hooks/useControllableState";
export { useDeterminateState } from "./hooks/useDeterminateState";

export {
  callLegacyDismissHandlers,
  createTgphBaseUIRender,
  getBaseUIMotionOffset,
  getBaseUIPositionerVisibilityStyle,
  inferTriggerNativeButton,
  registerNativeButtonResolver,
  resolveNativeButton,
  type InferTriggerNativeButtonOptions,
  type NativeButtonResolver,
  type RegisterNativeButtonResolverOptions,
  type ResolveNativeButtonOptions,
  type BaseUIChangeDetails,
  type BaseUIFloatingSide,
  type BaseUIPositionerVisibilityStyleParams,
  type LegacyDismissEventHandler,
  type LegacyDismissHandlers,
  type TgphBaseUIRenderElement,
} from "./base-ui";
