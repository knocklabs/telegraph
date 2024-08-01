import React from "react";

type PressedContextState = {
  currentlyPressedKeys: Array<string> | null;
};

const PressedContext = React.createContext<PressedContextState>({
  currentlyPressedKeys: null,
});

type UsePressedParams = {
  key: KeyboardEvent["key"];
};

const usePressed = ({ key }: UsePressedParams) => {
  const context = React.useContext(PressedContext);
  const [pressed, setPressed] = React.useState(false);

  const handleKeyDown = React.useCallback(
    (event: KeyboardEvent) => {
      if (event.key === key) {
        setPressed(true);
      }
    },
    [key],
  );

  const handleKeyUp = React.useCallback(
    (event: KeyboardEvent) => {
      if (event.key === key) {
        setPressed(false);
      }
    },
    [key],
  );

  React.useEffect(() => {
    // If currentPressedKey is equal to null then this hook
    // is not contained within a KbdProvider. If it is any
    // other value, i.e. string | undefined, then it is contained
    // within a KBD Provider
    if (context?.currentlyPressedKeys !== null) {
      if (context?.currentlyPressedKeys.includes(key)) {
        return setPressed(true);
      }
      return setPressed(false);
    }

    // If context does not exist, add event listeners
    // to set the pressed prop based on the keydown and keyup events
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [context?.currentlyPressedKeys, key, handleKeyDown, handleKeyUp]);

  return { pressed };
};

type KbdProviderProps = {
  children: React.ReactNode;
};

const KbdProvider = ({ children }: KbdProviderProps) => {
  const [currentlyPressedKeys, setCurrentlyPressedKeys] = React.useState<
    PressedContextState["currentlyPressedKeys"]
  >([]);

  // Broadcast the the keys currently being pressed, passing
  // as an array so we can check for multiple keys being pressed
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const keys = [];
      if (event.key) {
        keys.push(event.key);
      }

      if (event.metaKey) {
        keys.push("Meta");
      }

      if (event.shiftKey) {
        keys.push("Shift");
      }

      if (event.altKey) {
        keys.push("Alt");
      }

      if (event.ctrlKey) {
        keys.push("Control");
      }

      setCurrentlyPressedKeys(keys);
    };

    const handleKeyUp = () => {
      setCurrentlyPressedKeys([]);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <PressedContext.Provider value={{ currentlyPressedKeys }}>
      {children}
    </PressedContext.Provider>
  );
};

export { KbdProvider, usePressed };
