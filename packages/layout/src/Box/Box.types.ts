import type t from "@telegraph/tokens";
import type flattenedTokens from "@telegraph/tokens/flattened-css-variables-map";

import { Responsive } from "../helpers/breakpoints";

import { type BOX_PROPS } from "./Box.constants";

type ValueOfType<VALUE, TYPE> = VALUE extends { type: TYPE } ? VALUE : never;

type KeysOfType<KEYS, TYPE> = {
  [V in keyof KEYS]: ValueOfType<KEYS[V], TYPE> extends never ? never : V;
}[keyof KEYS];

type SpacingProp = KeysOfType<typeof BOX_PROPS, "spacing">;
type ColorProp = KeysOfType<typeof BOX_PROPS, "color">;
type RoundedProp = KeysOfType<typeof BOX_PROPS, "rounded">;

type SpacingProps = {
  [key in SpacingProp]?: Responsive<
    `${keyof typeof t.tokens.spacing}` | "auto" | true
  >;
};

type ColorProps = {
  [key in ColorProp]?: Responsive<`${keyof typeof flattenedTokens.color}`>;
};

type RoundedProps = {
  [key in RoundedProp]?: Responsive<`${keyof typeof t.tokens.rounded}`>;
};


export type BoxPropsTokens = SpacingProps &
  ColorProps &
  RoundedProps
