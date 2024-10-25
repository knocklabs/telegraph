import {
  DismissableLayer,
  type DismissableLayerProps,
} from "@radix-ui/react-dismissable-layer";

type DismissableWrapperProps = DismissableLayerProps & {
  id: string;
  layers: Array<string>;
  children: React.ReactNode;
};

//
// Handles the logic for when a global action like "esc" or clicking outside
// should close the modal. When stacking modals, we don't want to close the
// modal if we are not on the top-most layer.
//
const DismissableWrapper = ({
  id,
  layers,
  children,
  ...props
}: DismissableWrapperProps) => {
  const isTopLayer = id === layers[layers.length - 1];
  const hasMultipleLayers = layers?.length > 1;

  if (isTopLayer && hasMultipleLayers) {
    return <DismissableLayer {...props}>{children}</DismissableLayer>;
  }

  return <>{children}</>;
};

export { DismissableWrapper };
