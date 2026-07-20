import type { TgphComponentProps, TgphElement } from "@telegraph/helpers";
import { Text } from "@telegraph/typography";
import { type ComponentPropsWithoutRef, type ReactNode, type Ref } from "react";

import { TooltipIfTruncated } from "../TooltipIfTruncated";

import {
  middleIsTruncated,
  middleSliceIsTruncated,
  resolveSplit,
} from "./TruncatedText.helpers";
import { MiddleTruncate } from "./TruncatedText.primitives";
import type {
  Split,
  TruncatePriority,
  TruncateVariant,
  TruncatedTextMode,
} from "./TruncatedText.types";

export type {
  CustomSplitFn,
  Split,
  SplitOffset,
  TruncatedTextMode,
  TruncatePriority,
  TruncateVariant,
} from "./TruncatedText.types";

// ── Internal CSS engine ─────────────────────────────────────────────────────
// The extra modes are purely presentational: no state, no effects, no
// ResizeObserver, no `scrollWidth` measurement. Overflow detection lives
// entirely in `TruncatedText.styles.css` via a container size-query (ported from
// Pierre's `truncate`). Because there is no measure→setState machinery, these
// helpers cannot produce the "Maximum update depth exceeded" loop that a
// JS-measured path could (see KNO-14285). They are an implementation detail of
// `TruncatedText` and are not exported.

/** `truncate` clips the end; `fruncate` clips the start. */
type ClipMode = "truncate" | "fruncate";

type ClipProps = {
  children?: ReactNode;
  mode?: ClipMode;
  /** The overflow indicator. Defaults to an ellipsis. */
  marker?: ReactNode;
  variant?: TruncateVariant;
  /** Forwarded to the root element so it can act as a tooltip trigger. */
  tgphRef?: Ref<HTMLDivElement>;
} & Omit<ComponentPropsWithoutRef<"div">, "children">;

const ClipContent = ({
  mode,
  children,
}: {
  mode: ClipMode;
  children?: ReactNode;
}) => (
  <div>
    <div data-tgph-truncate-content="visible">
      {mode === "fruncate" ? <span>{children}</span> : children}
    </div>
    <div data-tgph-truncate-content="overflow" aria-hidden>
      {mode === "fruncate" ? <span>{children}</span> : children}
    </div>
  </div>
);

const ClipMarker = ({ marker }: { marker: ReactNode }) => (
  <div aria-hidden data-tgph-truncate-marker-cell>
    <div data-tgph-truncate-marker>{marker}</div>
  </div>
);

/** One-line clip with a fade/ellipsis marker at the clipped edge. */
const TruncateClip = ({
  children,
  mode = "truncate",
  marker = "…",
  variant = "default",
  tgphRef,
  ...props
}: ClipProps) => {
  const content = (
    <ClipContent key="content" mode={mode}>
      {children}
    </ClipContent>
  );
  const markerNode = <ClipMarker key="marker" marker={marker} />;

  return (
    <div
      ref={tgphRef}
      data-tgph-truncate={mode}
      data-tgph-truncate-variant={variant}
      {...props}
    >
      <div data-tgph-truncate-grid>
        {mode === "truncate"
          ? [content, markerNode]
          : [markerNode, content, <div key="fill" data-tgph-truncate-fill />]}
      </div>
    </div>
  );
};

type MiddleClipProps = {
  children: string;
  split?: Split;
  marker?: ReactNode;
  variant?: TruncateVariant;
  /** Which end stays intact first when space is tight. Defaults to `end`. */
  priority?: TruncatePriority;
} & Omit<ComponentPropsWithoutRef<"div">, "children">;

// Middle truncation (string only, like Pierre): split the string, clip the head
// from its end and the tail from its start, so the middle is elided.
const MiddleClip = ({
  children,
  split = "center",
  marker = "…",
  variant = "default",
  priority = "end",
  ...props
}: MiddleClipProps) => {
  const [head, tail] = resolveSplit(split, children);

  // Exactly one segment truncates (the other is kept whole by the priority flex
  // in the stylesheet), so only that segment's container query fires and a single
  // marker reveals at the seam — no de-duplication needed.
  return (
    <div
      data-tgph-truncate-group="middle"
      data-tgph-truncate-priority={priority}
      {...props}
    >
      <div data-tgph-truncate-segment="head">
        <TruncateClip mode="truncate" marker={marker} variant={variant}>
          {head}
        </TruncateClip>
      </div>
      <div data-tgph-truncate-segment="tail">
        <TruncateClip mode="fruncate" marker={marker} variant={variant}>
          {tail}
        </TruncateClip>
      </div>
    </div>
  );
};

// Wrap RTL-clipped (front-truncated) content so its own glyphs keep logical
// order. The RTL base direction — which is what flips `text-overflow: ellipsis`
// to the start — would otherwise reorder leading/trailing neutral characters
// (a leading "/" or "." would jump to the opposite end).
const LTR_ISOLATE = { direction: "ltr", unicodeBidi: "isolate" } as const;

// ── Public component ────────────────────────────────────────────────────────

export type TruncatedTextProps<T extends TgphElement = "span"> = {
  tooltipProps?: Partial<TgphComponentProps<typeof TooltipIfTruncated>>;
  /**
   * `truncate` (default) clips the end, `fruncate` the start, and `middle`
   * elides the middle — all with native `text-overflow: ellipsis`, so they clip
   * on glyph boundaries (never mid-glyph) and need no imported CSS. `middle`
   * requires string children. A `fade` `variant` or a custom `marker` upgrades
   * to the CSS engine (modern browsers only; constrain the engine clip box via
   * `style`, not `maxWidth`).
   */
  mode?: TruncatedTextMode;
  /** Ellipsis (default) vs. a soft fade into the background. `fade` uses the engine. */
  variant?: TruncateVariant;
  /** A custom overflow marker (defaults to the native ellipsis). Uses the engine. */
  marker?: ReactNode;
  /** `middle` mode: where to split the string. */
  split?: Split;
  /** `middle` mode: which end stays whole; the other truncates (one ellipsis). */
  priority?: TruncatePriority;
} & TgphComponentProps<typeof Text<T>>;

const TruncatedText = <T extends TgphElement = "span">({
  mode = "truncate",
  variant,
  marker: markerProp,
  split,
  priority,
  tooltipProps,
  style,
  children,
  as,
  ...props
}: TruncatedTextProps<T>) => {
  // The tooltip must show the full, unclipped string. Letting TooltipIfTruncated
  // auto-extract it only unwraps one child level, so an engine/`middle` child
  // would surface the elided, marker-laden markup instead. Pass the string
  // explicitly; callers can still override it via `tooltipProps.label`.
  const label = typeof children === "string" ? children : undefined;

  // An empty marker means "no custom marker" — fall back to the native ellipsis
  // rather than opting into the engine with a blank delimiter.
  const marker = markerProp === "" ? undefined : markerProp;

  // The overlay-marker engine (a container size-query + a masked marker) is used
  // only for effects native truncation can't produce: the `fade` variant and
  // custom `marker`s. Plain ellipsis truncation — end, front, and middle — uses
  // native `text-overflow: ellipsis`, which clips on glyph boundaries (never
  // mid-glyph), needs no JS/container query, and requires no imported CSS.
  const useEngine = variant === "fade" || marker !== undefined;

  // Middle truncation. `variant="fade"` uses the CSS engine (a dissolve). The
  // default measures and slices the string to exactly the `head…tail` characters
  // that fit — a crisp "…", no seam gap, and never a cut glyph, at every width.
  // Pure CSS can't do all three at once (box-filling vs glyph-boundary clipping),
  // so this is the one mode that measures; the JS is scoped to `middle`, runs only
  // on real resizes, and is guarded (see TruncatedText.primitives).
  if (mode === "middle" && typeof children === "string") {
    // Measure-and-slice can only splice a *string* marker into the text; fall to
    // the CSS engine for the `fade` variant or a ReactNode marker (which it can
    // render as a node, while measure-and-slice would drop it).
    const stringMarker = typeof marker === "string" ? marker : undefined;
    if (
      variant === "fade" ||
      (marker !== undefined && stringMarker === undefined)
    ) {
      return (
        <TooltipIfTruncated
          label={label}
          {...tooltipProps}
          isTruncated={middleIsTruncated}
        >
          <Text
            as={(as ?? "div") as T}
            {...props}
            style={{ display: "flex", minWidth: 0, ...style }}
          >
            <MiddleClip
              variant={variant ?? "default"}
              marker={marker}
              split={split}
              priority={priority}
            >
              {children}
            </MiddleClip>
          </Text>
        </TooltipIfTruncated>
      );
    }
    return (
      <TooltipIfTruncated
        label={label}
        {...tooltipProps}
        isTruncated={middleSliceIsTruncated}
      >
        <Text
          as={(as ?? "div") as T}
          {...props}
          // `display: block` so an inline `as` (e.g. "span") still honors
          // `maxWidth` — the slice measures this element's width.
          style={{ display: "block", minWidth: 0, ...style }}
        >
          <MiddleTruncate
            text={children}
            split={split}
            priority={priority}
            marker={stringMarker}
          />
        </Text>
      </TooltipIfTruncated>
    );
  }

  // Engine end/front truncation. The inner Text carries typography; the engine
  // root (which overflows when clipped) is the tooltip trigger.
  if (useEngine && (mode === "truncate" || mode === "fruncate")) {
    return (
      <TooltipIfTruncated label={label} {...tooltipProps}>
        <TruncateClip
          mode={mode}
          variant={variant}
          marker={marker}
          style={style}
        >
          <Text as={as} {...props}>
            {children}
          </Text>
        </TruncateClip>
      </TooltipIfTruncated>
    );
  }

  // Native front truncation: `direction: rtl` flips `text-overflow: ellipsis` to
  // clip (and place the ellipsis) at the start. The RTL base would reorder
  // leading/trailing neutrals (a leading "/" would jump to the end), so the LTR
  // content is wrapped in an isolate to keep its logical glyph order intact.
  if (mode === "fruncate") {
    return (
      <TooltipIfTruncated label={label} {...tooltipProps}>
        <Text
          as={as}
          style={{
            display: "block",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            direction: "rtl",
            ...style,
          }}
          {...props}
        >
          <span style={LTR_ISOLATE}>{children}</span>
        </Text>
      </TooltipIfTruncated>
    );
  }

  // Default: native end truncation. Also the fallback when `middle` is given
  // non-string children.
  return (
    <TooltipIfTruncated label={label} {...tooltipProps}>
      <Text
        as={as}
        style={{
          display: "block",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          ...style,
        }}
        {...props}
      >
        {children}
      </Text>
    </TooltipIfTruncated>
  );
};

export { TruncatedText };
