import { type LucideIcon } from "@telegraph/icon";
import {
  ArrowBigUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Command,
  CornerDownLeft,
  Delete,
  Option,
} from "lucide-react";

export const getIconOrKey = (
  key: string,
): { icon: LucideIcon; text?: never } | { text: string; icon?: never } => {
  const isMac = navigator.userAgent.includes("Mac");

  if (key === "Meta") {
    return isMac ? { icon: Command } : { text: "Ctrl" };
  }

  if (key === "Enter") {
    return { icon: CornerDownLeft };
  }

  if (key === "Shift") {
    return { icon: ArrowBigUp };
  }

  if (key === "Escape") {
    return { text: "Esc" };
  }

  if (key === "Backspace") {
    return { icon: Delete };
  }

  if (key === "Alt") {
    return isMac ? { icon: Option } : { text: "Alt" };
  }

  if (key === "Control") {
    return { text: "Ctrl" };
  }

  if (key === "ArrowRight") {
    return { icon: ArrowRight };
  }

  if (key === "ArrowLeft") {
    return { icon: ArrowLeft };
  }

  if (key === "ArrowDown") {
    return { icon: ArrowDown };
  }

  if (key === "ArrowUp") {
    return { icon: ArrowUp };
  }

  return key.length === 1 ? { text: key.toUpperCase() } : { text: key };
};
