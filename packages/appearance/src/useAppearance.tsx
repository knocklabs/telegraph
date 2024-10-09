import { Slot } from "@radix-ui/react-slot";
import React from "react";

type Appearance = "light" | "dark";

type UseAppearanceParams = {
  appearanceOverride?: Appearance;
};

const useAppearance = (params: UseAppearanceParams = {}) => {
  const [appearance, setAppearance] = React.useState<Appearance>(
    params?.appearanceOverride || "light",
  );

  // Collection of helper props to apply to elements to set their appearance
  const invertedAppearance = appearance === "light" ? "dark" : "light";
  const appearanceProps = { "data-tgph-appearance": appearance };
  const invertedAppearanceProps = {
    "data-tgph-appearance": invertedAppearance,
  };
  const lightAppearanceProps = { "data-tgph-appearance": "light" };
  const darkAppearanceProps = { "data-tgph-appearance": "dark" };

  const handleAppearanceChange = (newAppearance: Appearance) => {
    if (document) {
      setAppearance(newAppearance);
      document.documentElement.setAttribute(
        "data-tgph-appearance",
        newAppearance,
      );
    }
  };

  // Observer for the `html` element to detect changes in the data-tgph-appearance
  // and update the appearance state accordingly
  React.useEffect(() => {
    if (!document) return;

    const mutationsCallback = (mutations: MutationRecord[]) => {
      for (const mutation of mutations) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-tgph-appearance"
        ) {
          setAppearance(
            document.documentElement.getAttribute(
              "data-tgph-appearance",
            ) as Appearance,
          );
        }
      }
    };

    // Set the initial appearance state based on the `html` element's `data-tgph-appearance`
    const initialDocument = document.documentElement;
    const initialAppearance = initialDocument.getAttribute(
      "data-tgph-appearance",
    ) as Appearance;
    setAppearance(initialAppearance);

    const observer = new MutationObserver(mutationsCallback);
    observer.observe(document.documentElement, { attributes: true });

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  const toggleAppearance = () => {
    const newAppearance = appearance === "light" ? "dark" : "light";
    handleAppearanceChange(newAppearance);
  };

  return {
    setAppearance: handleAppearanceChange,
    toggleAppearance,
    appearance,
    invertedAppearance,
    appearanceProps,
    invertedAppearanceProps,
    lightAppearanceProps,
    darkAppearanceProps,
  };
};

type AppearanceProps = React.PropsWithChildren<{
  appearance?: Appearance;
  inverted?: boolean;
  asChild?: boolean;
}>;

// Applies the data attribute to the element to set the appearance
// of its children
const Appearance = ({
  inverted,
  appearance,
  asChild,
  ...props
}: AppearanceProps) => {
  const { appearanceProps, invertedAppearanceProps } = useAppearance({
    appearanceOverride: appearance,
  });

  const derivedAppearanceProps = inverted
    ? invertedAppearanceProps
    : appearanceProps;

  const Component = asChild ? Slot : "div";

  return <Component {...derivedAppearanceProps} {...props} />;
};

// Helper component used to explicitly set the appearance of a component
// used in places like the Tooltip component.
const OverrideAppearance = ({
  appearance,
  asChild,
  ...props
}: AppearanceProps) => {
  const { lightAppearanceProps, darkAppearanceProps } = useAppearance();

  const derivedAppearanceProps =
    appearance === "light" ? lightAppearanceProps : darkAppearanceProps;

  const Component = asChild ? Slot : "div";
  return <Component {...derivedAppearanceProps} {...props} />;
};

// Helper component to apply the inverted appearance
const InvertedAppearance = ({
  appearance,
  asChild,
  ...props
}: AppearanceProps) => {
  return (
    <Appearance inverted appearance={appearance} asChild={asChild} {...props} />
  );
};

export { useAppearance, Appearance, InvertedAppearance, OverrideAppearance };
