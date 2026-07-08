import { type SyntheticEvent } from "react";

export type BaseUIPreventableEvent = (Event | SyntheticEvent) & {
  nativeEvent?: Event;
  preventBaseUIHandler?: () => void;
  stopPropagation?: () => void;
};

// Each modal stacked beneath the active one shrinks by this factor per level of
// depth so lower layers read as sitting further back.
export const MODAL_STACK_SCALE_STEP = 0.02;

/**
 * Resting scale for a modal content surface within the modal stack.
 *
 * The active (top) modal rests at scale 1; each layer beneath it shrinks by
 * {@link MODAL_STACK_SCALE_STEP} per level of depth. Depth is measured from the
 * top layer, so an unregistered layer — no `ModalStackingProvider`, or the first
 * paint before the layer registers, where `layersLength` is 0 — still settles at
 * exactly 1 rather than overshooting to 1.02.
 */
export const getStackedModalScale = (layersLength: number, layer: number) => {
  const depthFromTop = Math.max(0, layersLength - 1 - layer);
  return 1 - depthFromTop * MODAL_STACK_SCALE_STEP;
};

export const callAutoFocusHandler = (
  handler: ((event: Event) => void) | undefined,
  eventName: string,
) => {
  // Radix passed cancelable autofocus lifecycle events; synthesize the same
  // event shape and return whether the legacy handler prevented it.
  const event = new Event(eventName, { cancelable: true });
  handler?.(event);
  return event.defaultPrevented;
};
