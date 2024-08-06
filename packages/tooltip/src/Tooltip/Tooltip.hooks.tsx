import React from "react";

type TooltipGroupContextState = {
  groupOpen: boolean;
  setGroupOpen?: (open: boolean) => void;
};

const TooltipContext = React.createContext<TooltipGroupContextState>({
  groupOpen: false,
  setGroupOpen: () => {},
});

type UseTooltipGroupParams = {
  open: boolean;
  delay?: number;
};

const useTooltipGroup = ({ open, delay = 800 }: UseTooltipGroupParams) => {
  const context = React.useContext(TooltipContext);

  // If the open prop is set to true, we set the groupOpen state to true
  // If the open prop is set to false, we set the groupOpen state to false after a delay
  // to ensure that another tooltip is not opened while this one is closed.
  React.useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (context.setGroupOpen) {
      if (open === true) {
        context.setGroupOpen(true);
      }

      if (open === false) {
        timer = setTimeout(() => {
          if (context.setGroupOpen) {
            context.setGroupOpen(false);
          }
        }, delay);
      }
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [open, context, delay]);

  return {
    groupOpen: context.groupOpen,
  };
};

type TooltipGroupProviderProps = {
  children: React.ReactNode;
};

const TooltipGroupProvider = ({ children }: TooltipGroupProviderProps) => {
  const [groupOpen, setGroupOpen] = React.useState<boolean>(false);

  return (
    <TooltipContext.Provider value={{ groupOpen, setGroupOpen }}>
      {children}
    </TooltipContext.Provider>
  );
};

export { TooltipGroupProvider, useTooltipGroup };
