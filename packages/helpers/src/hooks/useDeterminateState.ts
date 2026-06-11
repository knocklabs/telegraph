/*
 * useDeterminateState
 *
 * A hook that returns a state transitioning to a determinate value after a minimum duration.
 * For example, you could use this hook with a button that transitions into a "loading" state,
 * ensuring it remains in the "loading" state for at least 1000ms. This provides clear feedback
 * to the user that the action is being processed.
 *
 */
import { useCallback, useEffect, useRef, useState } from "react";

type UseDeterminateStateParams<T> = {
  value: T;
  determinateValue: T;
  minDurationMs?: number;
};

const useDeterminateState = <T>({
  value,
  determinateValue,
  minDurationMs = 1000,
}: UseDeterminateStateParams<T>): T => {
  const [state, setState] = useState<T>(value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const clearExistingTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleTransition = useCallback(() => {
    if (value === determinateValue) {
      clearExistingTimeout();
      setState(determinateValue);
      startTimeRef.current = Date.now();
    } else if (startTimeRef.current !== null) {
      const elapsedTime = Date.now() - startTimeRef.current;
      const remainingTime = minDurationMs - elapsedTime;

      if (remainingTime > 0) {
        clearExistingTimeout();
        timeoutRef.current = setTimeout(() => {
          setState(value);
          startTimeRef.current = null;
        }, remainingTime);
      } else {
        setState(value);
        startTimeRef.current = null;
      }
    } else {
      setState(value);
    }
  }, [value, determinateValue, minDurationMs]);

  useEffect(() => {
    handleTransition();
    return clearExistingTimeout;
  }, [value, handleTransition]);

  return state;
};

export { useDeterminateState };
