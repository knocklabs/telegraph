import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type TooltipGroupContextState = {
  groupOpen: boolean;
  setGroupOpen?: (open: boolean) => void;
};

const TooltipContext = createContext<TooltipGroupContextState>({
  groupOpen: false,
  setGroupOpen: () => {},
});

type UseTooltipGroupParams = {
  open: boolean;
  delay?: number;
};

const useTooltipGroup = ({ open, delay = 600 }: UseTooltipGroupParams) => {
  const context = useContext(TooltipContext);

  useEffect(() => {
    if (!context.setGroupOpen) {
      return;
    }

    if (open === true) {
      context.setGroupOpen(true);
      return;
    }

    const timer = setTimeout(() => {
      context.setGroupOpen?.(false);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [open, context, delay]);

  return {
    groupOpen: context.groupOpen,
  };
};

type TooltipGroupProviderProps = {
  children: ReactNode;
};

const TooltipGroupProvider = ({ children }: TooltipGroupProviderProps) => {
  const [groupOpen, setGroupOpen] = useState<boolean>(false);

  return (
    <TooltipContext.Provider value={{ groupOpen, setGroupOpen }}>
      {children}
    </TooltipContext.Provider>
  );
};

export { TooltipGroupProvider, useTooltipGroup };
