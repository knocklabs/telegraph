import {
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export type UseControllableStateParams<T> = {
  defaultProp: T;
  onChange?: (value: T) => void;
  prop?: T;
};

export const useControllableState = <T>({
  defaultProp,
  onChange,
  prop,
}: UseControllableStateParams<T>) => {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultProp);
  // Keep the current uncontrolled value available to the setter without making
  // the setter depend on every value change. That keeps callback identity stable
  // for component primitives that pass setters through context.
  const uncontrolledValueRef = useRef(uncontrolledValue);
  // `undefined` keeps the previous Radix-style contract: anything else means
  // the caller owns the value and we only emit changes.
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : uncontrolledValue;

  useEffect(() => {
    uncontrolledValueRef.current = uncontrolledValue;
  }, [uncontrolledValue]);

  const setValue = useCallback(
    (nextValueOrUpdater: SetStateAction<T>) => {
      // React-style updater functions need the freshest value from the active
      // source, not a stale value captured when this setter was created.
      const currentValue = isControlled ? prop : uncontrolledValueRef.current;
      const nextValue =
        typeof nextValueOrUpdater === "function"
          ? (nextValueOrUpdater as (previousValue: T) => T)(currentValue)
          : nextValueOrUpdater;

      if (Object.is(currentValue, nextValue)) {
        return;
      }

      if (!isControlled) {
        // Update the ref before React commits state so multiple same-tick setter
        // calls compare against the latest queued uncontrolled value.
        uncontrolledValueRef.current = nextValue;
        setUncontrolledValue(nextValue);
      }

      onChange?.(nextValue);
    },
    [isControlled, onChange, prop],
  );

  return [value, setValue] as const;
};
