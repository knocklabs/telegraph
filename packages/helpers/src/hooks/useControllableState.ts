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
  const uncontrolledValueRef = useRef(uncontrolledValue);
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : uncontrolledValue;

  useEffect(() => {
    uncontrolledValueRef.current = uncontrolledValue;
  }, [uncontrolledValue]);

  const setValue = useCallback(
    (nextValueOrUpdater: SetStateAction<T>) => {
      const currentValue = isControlled ? prop : uncontrolledValueRef.current;
      const nextValue =
        typeof nextValueOrUpdater === "function"
          ? (nextValueOrUpdater as (previousValue: T) => T)(currentValue)
          : nextValueOrUpdater;

      if (Object.is(currentValue, nextValue)) {
        return;
      }

      if (!isControlled) {
        uncontrolledValueRef.current = nextValue;
        setUncontrolledValue(nextValue);
      }

      onChange?.(nextValue);
    },
    [isControlled, onChange, prop],
  );

  return [value, setValue] as const;
};
