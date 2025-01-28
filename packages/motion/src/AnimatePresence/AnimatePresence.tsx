import React from "react";

type MotionElement = {
  motionKey: string;
  exitDuration: number;
};

type AnimatePresenceContextType = {
  initialAnimateComplete: boolean;
  motionElements: Array<MotionElement>;
  setMotionElements: React.Dispatch<React.SetStateAction<Array<MotionElement>>>;
  presenceMap: Array<{ "tgph-motion-key": string; value: boolean }>;
  previousPresenceMap: Array<{ "tgph-motion-key": string; value: boolean }>;
};

const AnimatePresenceContext = React.createContext<AnimatePresenceContextType>({
  initialAnimateComplete: false,
  motionElements: [],
  setMotionElements: () => {},
  presenceMap: [],
  previousPresenceMap: [],
});

export const useAnimatePresence = ({
  motionKey,
  exitDuration,
}: MotionElement) => {
  const {
    presenceMap,
    setMotionElements,
    previousPresenceMap,
    initialAnimateComplete,
  } = React.useContext(AnimatePresenceContext);

  React.useEffect(() => {
    if (!motionKey || !exitDuration) return;

    setMotionElements((existingMotionElements: Array<MotionElement>) => {
      const matchingMotionElements = existingMotionElements.filter(
        (element) => motionKey === element.motionKey,
      );

      if (matchingMotionElements.length > 0) return existingMotionElements;

      return [...existingMotionElements, { motionKey, exitDuration }];
    });

    return () => {
      setMotionElements((existingMotionElements: Array<MotionElement>) => {
        const matchingMotionElements = existingMotionElements.filter(
          (element) => motionKey === element.motionKey,
        );

        return matchingMotionElements;
      });
    };
  }, [exitDuration, motionKey, setMotionElements]);

  const derivedMotionPresence = React.useMemo(() => {
    // Detect if the value of the key has changed, if so we change the
    // presence to animate the children out.
    const presenceValue = presenceMap.find(
      (item) => item["tgph-motion-key"] === motionKey,
    )?.value;

    // In caes where the item is removed from the presence map, we need to
    // check the previous presence map to see if the value has changed.
    const previousPresenceValue = previousPresenceMap.find(
      (item) => item["tgph-motion-key"] === motionKey,
    )?.value;

    const hasPresenceValueChanged = presenceValue !== previousPresenceValue;

    if (hasPresenceValueChanged) {
      return false;
    }

    return true;
  }, [motionKey, presenceMap, previousPresenceMap]);

  return {
    presence: derivedMotionPresence,
    initialAnimateComplete,
  };
};

type AnimatePresenceProps = {
  presenceMap: Array<{ "tgph-motion-key": string; value: boolean }>;
  children: React.ReactNode;
};

const AnimatePresence = ({ presenceMap, children }: AnimatePresenceProps) => {
  const [initialAnimateComplete, setInitialAnimateComplete] =
    React.useState(false);
  const [managedChildren, setManagedChildren] = React.useState(children);

  const [motionElements, setMotionElements] = React.useState<
    Array<MotionElement>
  >([]);
  const [previousPresenceMap, setPreviousPresenceMap] =
    React.useState(presenceMap);

  React.useEffect(() => {
    const newPresenceMap = presenceMap;
    let timeout: NodeJS.Timeout;

    const hasPresenceMapChanged =
      // Check if array has changed values
      newPresenceMap?.some(
        (n) =>
          n.value !==
          previousPresenceMap?.find(
            (p) => p["tgph-motion-key"] === n["tgph-motion-key"],
          )?.value,
        // Check if array has changed lengths
      ) || newPresenceMap?.length !== previousPresenceMap?.length;

    // If the presence map has changed, we need to animate the children out.
    if (hasPresenceMapChanged) {
      // We need to find the highest duration of the motion elements to animate the children out without
      // interrupting the animation of the other children.
      const highestDuration = Math.max(
        ...motionElements.map((element) => element.exitDuration),
      );

      // Freeze the children until the animation is complete.
      timeout = setTimeout(() => {
        setManagedChildren(children);
        setPreviousPresenceMap(newPresenceMap);
      }, highestDuration);
    } else {
      setManagedChildren(children);
      setPreviousPresenceMap(newPresenceMap);
    }

    return () => timeout && clearTimeout(timeout);
  }, [children, motionElements, presenceMap, previousPresenceMap]);

  // If useEffect runs once, the initial animation is likely completed.
  // So set this flag so we can use it to logically hide the initial
  // animation when needed.
  React.useEffect(() => {
    if (!initialAnimateComplete) {
      setInitialAnimateComplete(true);
    }
  }, [initialAnimateComplete]);

  return (
    <AnimatePresenceContext.Provider
      value={{
        presenceMap,
        previousPresenceMap,
        initialAnimateComplete,
        motionElements,
        setMotionElements,
      }}
    >
      {managedChildren}
    </AnimatePresenceContext.Provider>
  );
};

export { AnimatePresence };
