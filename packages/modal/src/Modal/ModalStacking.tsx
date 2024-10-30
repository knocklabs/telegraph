import React from "react";

type AddLayerOptions = {
  layer?: number;
};

const ModalStackingContext = React.createContext<{
  layers: Array<string>;
  setLayers: React.Dispatch<React.SetStateAction<Array<string>>>;
  addLayer: (id: string, options: AddLayerOptions) => void;
  removeLayer: (id: string) => void;
  removeTopLayer: () => void;
}>({
  layers: [],
  setLayers: () => {},
  addLayer: () => {},
  removeLayer: () => {},
  removeTopLayer: () => {},
});

type ModalStackingProviderProps = {
  children: React.ReactNode;
};

const ModalStackingProvider = ({ children }: ModalStackingProviderProps) => {
  const [layers, setLayers] = React.useState<Array<string>>([]);

  const addLayer = (id: string, options: AddLayerOptions = {}) => {
    const { layer } = options;

    // If a layer is specified, insert the layer at the specified index
    // so that the modal renders at the correct layer in the stack.
    if (typeof layer === "number") {
      return setLayers((current) => {
        if (current.length - 1 < layer) {
          return [...current, id];
        }

        return [...current.slice(0, layer), id, ...current.slice(layer)];
      });
    } else {
      setLayers((current) => [...current, id]);
    }
  };

  const removeLayer = (id: string) => {
    setLayers(layers.filter((layer) => layer !== id));
  };

  const removeTopLayer = () => {
    const id = layers[layers.length - 1];
    if (!id) return;
    removeLayer(id);
  };

  return (
    <ModalStackingContext.Provider
      value={{ layers, setLayers, addLayer, removeLayer, removeTopLayer }}
    >
      {children}
    </ModalStackingContext.Provider>
  );
};

const useModalStacking = () => {
  return React.useContext(ModalStackingContext);
};

export { ModalStackingProvider, useModalStacking };
