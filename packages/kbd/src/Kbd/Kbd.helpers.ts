import { Lucide } from "@telegraph/icon";

export const getIconOrKey = (key: string) => {
  const isMac = navigator.userAgent.includes("Mac");

  if (key === "Meta") {
    return isMac ? Lucide.Command : "Ctrl";
  }

  if (key === "Enter") {
    return Lucide.CornerDownLeft;
  }

  if (key === "Shift") {
    return Lucide.ArrowBigUp;
  }

  if (key === "Escape") {
    return "Esc";
  }

  if (key === "Backspace") {
    return Lucide.Delete;
  }

  if (key === "Alt") {
    return isMac ? Lucide.Option : "Alt";
  }

  if (key === "Control") {
    return "Ctrl";
  }

  if (key === "ArrowRight") {
    return Lucide.ArrowRight;
  }

  if (key === "ArrowLeft") {
    return Lucide.ArrowLeft;
  }

  if (key === "ArrowDown") {
    return Lucide.ArrowDown;
  }

  if (key === "ArrowUp") {
    return Lucide.ArrowUp;
  }

  return key.length === 1 ? key.toUpperCase() : key;
};
