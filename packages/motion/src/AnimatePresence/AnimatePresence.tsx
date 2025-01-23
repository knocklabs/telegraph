import React from "react";

type MotionElement = {
  motionKey: string;
  exitDuration: number;
};

type AnimatePresenceContextType = {
  presence?: boolean | undefined;
  motionKeys: Array<string>;
  motionElements: Array<MotionElement>;
  setMotionElements: React.Dispatch<React.SetStateAction<Array<MotionElement>>>;
};

const AnimatePresenceContext = React.createContext<AnimatePresenceContextType>({
  presence: undefined,
  motionKeys: [],
  motionElements: [],
  setMotionElements: () => {},
});

type UseAnimatePresenceProps = {
  motionKey?: string;
  exitDuration?: number;
};

export const useAnimatePresence = ({
  motionKey,
  exitDuration,
}: UseAnimatePresenceProps) => {
  const { presence, setMotionElements, motionKeys } = React.useContext(
    AnimatePresenceContext,
  );

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
    if (presence === false && motionKey && motionKeys.includes(motionKey)) {
      return false;
    }

    return true;
  }, [presence, motionKeys, motionKey]);

  return {
    presence: derivedMotionPresence,
  };
};

type AnimatePresenceProps = {
  presence?: boolean;
  "tgph-motion-keys"?: Array<string>;
  children: React.ReactNode;
};

const AnimatePresence = ({
  presence,
  "tgph-motion-keys": motionKeys = [],
  children,
}: AnimatePresenceProps) => {
  const [managedChildren, setManagedChildren] = React.useState(children);

  const [motionElements, setMotionElements] = React.useState<
    Array<MotionElement>
  >([]);
  const [previousPresence, setPreviousPresence] = React.useState(presence);

  React.useEffect(() => {
    const newPresence = presence;
    let timeout: NodeJS.Timeout;

    // If the presence is false and the previous presence was true, we need to animate the children out.
    if (newPresence === false && previousPresence === true) {
      // We need to find the highest duration of the motion elements to animate the children out without
      // interrupting the animation of the other children.
      const highestDuration = Math.max(
        ...motionElements.map((element) => element.exitDuration),
      );

      // Freeze the children until the animation is complete.
      timeout = setTimeout(() => {
        setPreviousPresence(false);
        setManagedChildren(children);
      }, highestDuration);
    } else {
      setManagedChildren(children);
      setPreviousPresence(newPresence);
    }

    return () => timeout && clearTimeout(timeout);
  }, [presence, children, motionElements, previousPresence]);

  return (
    <AnimatePresenceContext.Provider
      value={{ presence, motionKeys, motionElements, setMotionElements }}
    >
      {managedChildren}
    </AnimatePresenceContext.Provider>
  );
};

export { AnimatePresence };
