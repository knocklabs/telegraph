import React from "react";

type LayerContextState = {
  depth: number;
};

const LayerContext = React.createContext<LayerContextState>({
  depth: 0,
});

type LayerProps = {
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  children?: React.ReactNode;
};

const Layer = ({ onEscapeKeyDown: _onEscapeKeyDown, children }: LayerProps) => {
  const nestedLayers = useNestedLayers();
  const layer = useLayer();
  const depth = layer.depth === 0 ? layer.depth : layer.depth + 1;

  const isDeepestLayer = depth === nestedLayers.deepestLayer;

  React.useEffect(() => {
    nestedLayers.setDeepestLayer(Math.max(nestedLayers.deepestLayer, depth));
  }, [depth, nestedLayers]);

  console.log("HERE LAYER", depth, nestedLayers.deepestLayer);

  const onEscapeKeyDown = React.useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && isDeepestLayer) {
        _onEscapeKeyDown?.(event);
      }
    },
    [_onEscapeKeyDown, isDeepestLayer],
  );

  React.useEffect(() => {
    document.addEventListener("keydown", onEscapeKeyDown);
    return () => {
      document.removeEventListener("keydown", onEscapeKeyDown);
    };
  }, [depth, onEscapeKeyDown]);

  if (depth === 1) {
    return (
      <TopLayerProvider>
        <LayerContext.Provider value={{ depth }}>
          {children}
        </LayerContext.Provider>
      </TopLayerProvider>
    );
  }

  return (
    <LayerContext.Provider value={{ depth }}>{children}</LayerContext.Provider>
  );
};

type NestedLayersContextState = {
  deepestLayer: number;
  setDeepestLayer: (deepestLayer: number) => void;
};

const NestedLayersContext = React.createContext<NestedLayersContextState>({
  deepestLayer: 0,
  setDeepestLayer: () => {},
});

const TopLayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [deepestLayer, setDeepestLayer] = React.useState(0);
  return (
    <NestedLayersContext.Provider value={{ deepestLayer, setDeepestLayer }}>
      {children}
    </NestedLayersContext.Provider>
  );
};

const useNestedLayers = () => {
  const context = React.useContext(NestedLayersContext);
  if (!context) {
    return { deepestLayer: 0, setDeepestLayer: () => {} };
  }
  return context;
};

const useLayer = () => {
  const context = React.useContext(LayerContext);
  if (!context) {
    return { depth: 0 };
  }
  return context;
};

export { Layer };
