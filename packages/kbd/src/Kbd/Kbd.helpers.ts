import { Lucide, type LucideIcon } from "@telegraph/icon";

export const getIconOrKey = (
  key: string,
): { icon: LucideIcon; text?: never } | { text: string; icon?: never } => {
  const isMac = navigator.userAgent.includes("Mac");

  if (key === "Meta") {
    return isMac ? { icon: Lucide.Command } : { text: "Ctrl" };
  }

  if (key === "Enter") {
    return { icon: Lucide.CornerDownLeft };
  }

  if (key === "Shift") {
    return { icon: Lucide.ArrowBigUp };
  }

  if (key === "Escape") {
    return { text: "Esc" };
  }

  if (key === "Backspace") {
    return { icon: Lucide.Delete };
  }

  if (key === "Alt") {
    return isMac ? { icon: Lucide.Option } : { text: "Alt" };
  }

  if (key === "Control") {
    return { text: "Ctrl" };
  }

  if (key === "ArrowRight") {
    return { icon: Lucide.ArrowRight };
  }

  if (key === "ArrowLeft") {
    return { icon: Lucide.ArrowLeft };
  }

  if (key === "ArrowDown") {
    return { icon: Lucide.ArrowDown };
  }

  if (key === "ArrowUp") {
    return { icon: Lucide.ArrowUp };
  }

  return key.length === 1 ? { text: key.toUpperCase() } : { text: key };
};
