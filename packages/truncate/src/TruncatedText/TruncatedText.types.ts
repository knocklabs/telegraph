/*
 * Shared types for `TruncatedText`, its primitives, and its helpers. Kept in a
 * standalone module so the component, the `MiddleTruncate` primitive, and the
 * split/slice helpers can all reference them without a circular import.
 */

/** How the content is clipped. */
export type TruncatedTextMode = "truncate" | "fruncate" | "middle";

/** `default` shows an ellipsis marker; `fade` dissolves the text into the bg. */
export type TruncateVariant = "default" | "fade";

/** Which end of a middle-truncated string is kept whole — the other truncates. */
export type TruncatePriority = "start" | "end";

/** Named split strategies for middle truncation. */
export type SplitMode = "center" | "extension" | "leaf-path";

/** `["last", n]` keeps the last n chars intact; `["first", n]` the first n. */
export type SplitOffset = ["last" | "first", number];

export type CustomSplitFn = (contents: string) => [string, string];

/** A named strategy, a raw index, an offset tuple, or a custom function. */
export type Split = SplitMode | number | SplitOffset | CustomSplitFn;
