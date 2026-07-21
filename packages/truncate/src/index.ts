export { TruncatedText } from "./TruncatedText";
export type {
  TruncatedTextProps,
  TruncatedTextMode,
  // Option types for TruncatedText's engine modes (`fruncate` / `middle` /
  // `variant="fade"`). The CSS engine that backs them is an internal
  // implementation detail of TruncatedText and is intentionally not exported.
  TruncateVariant,
  TruncatePriority,
  Split,
  SplitOffset,
  CustomSplitFn,
} from "./TruncatedText";
export { TooltipIfTruncated } from "./TooltipIfTruncated";
export type { TooltipIfTruncatedProps } from "./TooltipIfTruncated";
export { useTruncate } from "./useTruncate";
