import React from "react";

const ModalStackingContext = React.createContext<{
  layers: Array<string>;
  setLayers: React.Dispatch<React.SetStateAction<Array<string>>>;
  addLayer: (id: string) => void;
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

  const addLayer = (id: string) => {
    setLayers((current) => [...current, id]);
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
