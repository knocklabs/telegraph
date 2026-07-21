import {
  type DependencyList,
  type RefObject,
  useEffect,
  useState,
} from "react";

type UseTruncateParams = {
  tgphRef: RefObject<HTMLElement | null>;
};

/**
 * Reactive "is this element currently truncated?" (`scrollWidth > clientWidth`),
 * kept up to date with a `ResizeObserver`.
 *
 * This is the JS counterpart to `TruncatedText`'s CSS-only engine modes, for
 * two different needs:
 * - Use `TruncatedText` (`mode="fruncate"` / `"middle"`, `variant="fade"`) when
 *   you only need to *render* truncated text — detection stays in CSS, no JS runs.
 * - Use `useTruncate` when you need the truncation state *as a value in render*
 *   — to gate a tooltip, toggle "show more", swap an icon, etc.
 *
 * A pure CSS container query can't be read back into React state without
 * observation, so a `ResizeObserver` is the right bridge. It measures the
 * element you point it at, so it works on any clipped element — native
 * `text-overflow: ellipsis` or a `TruncatedText` engine root. (`mode="middle"`
 * is the exception: its container never overflows, so measure a segment, or
 * gate a tooltip with `TooltipIfTruncated`'s `isTruncated` prop instead.)
 *
 * The state write is value-guarded and the observer is created once per mounted
 * element, so a redundant measurement is a genuine no-op even when the
 * surrounding tree re-renders constantly (e.g. a ReactFlow graph). That is what
 * keeps it from cascading into "Maximum update depth exceeded" (React #185,
 * KNO-14285) — the crash came from the previous unconditional `setState`, not
 * from measuring.
 */
const useTruncate = (
  { tgphRef }: UseTruncateParams,
  deps: DependencyList = [],
) => {
  const [truncated, setTruncated] = useState(false);

  useEffect(() => {
    const element = tgphRef.current;

    // Only write when the value actually changes. React usually absorbs a
    // same-value `setState` via its bailout, but in a continuously
    // re-rendering tree the fiber's lanes stay dirty and that bailout can be
    // defeated; returning the previous value keeps a redundant update a true
    // no-op regardless of how (un)stable the caller's `deps` are.
    const setTruncatedIfChanged = (next: boolean) =>
      setTruncated((prev) => (prev === next ? prev : next));

    if (!element) {
      setTruncatedIfChanged(false);
      return;
    }

    const checkTruncation = () =>
      setTruncatedIfChanged(element.scrollWidth > element.clientWidth);

    // Initial check
    checkTruncation();

    // Re-check whenever the element is resized.
    const resizeObserver = new ResizeObserver(checkTruncation);
    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tgphRef, ...deps]);

  return { truncated };
};

export { useTruncate };
