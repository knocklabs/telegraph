import React from "react";

type UseTruncateParams = {
  tgphRef: React.RefObject<HTMLElement | null>;
};

const useTruncate = (
  { tgphRef }: UseTruncateParams,
  deps: React.DependencyList = [],
) => {
  const [truncated, setTruncated] = React.useState(false);

  React.useEffect(() => {
    const tgphRefElement = tgphRef.current;

    // Only write when the value actually changes. React usually absorbs a
    // same-value `setState` via its bailout, but in a continuously
    // re-rendering tree (e.g. ReactFlow) the fiber's update lanes stay dirty
    // and that bailout can be defeated — an unconditional `setState` here then
    // feeds a runaway synchronous update loop ("Maximum update depth
    // exceeded", React #185). Returning the previous value keeps a redundant
    // update a genuine no-op even when lanes are dirty.
    const setTruncatedIfChanged = (next: boolean) => {
      setTruncated((prev) => (prev === next ? prev : next));
    };

    if (!tgphRefElement) {
      setTruncatedIfChanged(false);
      return;
    }

    const checkTruncation = () => {
      setTruncatedIfChanged(
        tgphRefElement.scrollWidth > tgphRefElement.clientWidth,
      );
    };

    // Initial check
    checkTruncation();

    // Add a resize observer to check for truncation when the element is resized
    const resizeObserver = new ResizeObserver(checkTruncation);
    resizeObserver.observe(tgphRefElement);

    // Clean up
    return () => {
      resizeObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tgphRef, ...deps]);

  return { truncated };
};

export { useTruncate };
