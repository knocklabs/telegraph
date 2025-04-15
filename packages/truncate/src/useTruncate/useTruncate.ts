import React from "react";

type UseTruncateParams = {
  tgphRef: React.RefObject<HTMLElement>;
};

const useTruncate = (
  { tgphRef }: UseTruncateParams,
  deps: React.DependencyList = [],
) => {
  const [truncated, setTruncated] = React.useState(false);

  React.useEffect(() => {
    if (!tgphRef.current) return setTruncated(false);

    const tgphRefElement = tgphRef.current;

    const checkTruncation = () => {
      setTruncated(tgphRefElement.scrollWidth > tgphRefElement.clientWidth);
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
