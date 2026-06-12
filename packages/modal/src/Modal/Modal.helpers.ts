import { type SyntheticEvent } from "react";

export type BaseUIPreventableEvent = (Event | SyntheticEvent) & {
  nativeEvent?: Event;
  preventBaseUIHandler?: () => void;
  stopPropagation?: () => void;
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
