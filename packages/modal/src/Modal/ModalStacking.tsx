import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type PointerDismissHandler = (event: Event) => void;

const SUPPRESSED_POINTER_DISMISS_RESET_DELAY_MS = 100;

const ModalStackingContext = createContext<{
  dismissTopLayerWithPointer: (event: Event) => void;
  ignorePointerDismissEvent: (event: Event) => void;
  layers: Array<string>;
  setLayers: Dispatch<SetStateAction<Array<string>>>;
  addLayer: (id: string) => void;
  consumeSuppressedDismiss: (id: string) => boolean;
  registerPointerDismissHandler: (
    id: string,
    handler: PointerDismissHandler,
  ) => () => void;
  removeLayer: (id: string) => void;
  removeTopLayer: () => void;
  shouldIgnorePointerDismissEvent: (event: Event) => boolean;
  suppressNextDismissForLayer: (id: string) => void;
}>({
  dismissTopLayerWithPointer: () => {},
  ignorePointerDismissEvent: () => {},
  layers: [],
  setLayers: () => {},
  addLayer: () => {},
  consumeSuppressedDismiss: () => false,
  registerPointerDismissHandler: () => () => {},
  removeLayer: () => {},
  removeTopLayer: () => {},
  shouldIgnorePointerDismissEvent: () => false,
  suppressNextDismissForLayer: () => {},
});

type ModalStackingProviderProps = {
  children: ReactNode;
};

const ModalStackingProvider = ({ children }: ModalStackingProviderProps) => {
  const [layers, setLayers] = useState<Array<string>>([]);
  const layersRef = useRef<Array<string>>([]);
  const ignoredPointerDismissEventsRef = useRef(new WeakSet<Event>());
  const pointerDismissHandlersRef = useRef(
    new Map<string, PointerDismissHandler>(),
  );
  const suppressedDismissLayersRef = useRef(new Set<string>());

  useEffect(() => {
    layersRef.current = layers;
  }, [layers]);

  const addLayer = (id: string) => {
    setLayers((current) => {
      const nextLayers = current.includes(id) ? current : [...current, id];
      layersRef.current = nextLayers;

      return nextLayers;
    });
  };

  const removeLayer = (id: string) => {
    setLayers((current) => {
      const nextLayers = current.filter((layer) => layer !== id);
      layersRef.current = nextLayers;

      return nextLayers;
    });
  };

  const removeTopLayer = () => {
    setLayers((current) => {
      const nextLayers = current.slice(0, -1);
      layersRef.current = nextLayers;

      return nextLayers;
    });
  };

  const registerPointerDismissHandler = useCallback(
    (id: string, handler: PointerDismissHandler) => {
      pointerDismissHandlersRef.current.set(id, handler);

      return () => {
        if (pointerDismissHandlersRef.current.get(id) === handler) {
          pointerDismissHandlersRef.current.delete(id);
        }
      };
    },
    [],
  );

  const dismissTopLayerWithPointer = useCallback((event: Event) => {
    const topLayer = layersRef.current[layersRef.current.length - 1];

    if (!topLayer) {
      return;
    }

    pointerDismissHandlersRef.current.get(topLayer)?.(event);
  }, []);
  const ignorePointerDismissEvent = useCallback((event: Event) => {
    ignoredPointerDismissEventsRef.current.add(event);
  }, []);
  const shouldIgnorePointerDismissEvent = useCallback((event: Event) => {
    return ignoredPointerDismissEventsRef.current.has(event);
  }, []);
  const suppressNextDismissForLayer = useCallback((id: string) => {
    suppressedDismissLayersRef.current.add(id);

    globalThis.setTimeout(() => {
      suppressedDismissLayersRef.current.delete(id);
    }, SUPPRESSED_POINTER_DISMISS_RESET_DELAY_MS);
  }, []);
  const consumeSuppressedDismiss = useCallback((id: string) => {
    const isSuppressed = suppressedDismissLayersRef.current.has(id);

    if (isSuppressed) {
      suppressedDismissLayersRef.current.delete(id);
    }

    return isSuppressed;
  }, []);

  return (
    <ModalStackingContext.Provider
      value={{
        dismissTopLayerWithPointer,
        ignorePointerDismissEvent,
        layers,
        setLayers,
        addLayer,
        consumeSuppressedDismiss,
        registerPointerDismissHandler,
        removeLayer,
        removeTopLayer,
        shouldIgnorePointerDismissEvent,
        suppressNextDismissForLayer,
      }}
    >
      {children}
    </ModalStackingContext.Provider>
  );
};

const useModalStacking = () => {
  return useContext(ModalStackingContext);
};

export { ModalStackingProvider, useModalStacking };
