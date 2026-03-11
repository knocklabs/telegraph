export { default as tokens } from "@telegraph/tokens/css-variables-map";

/* NEW STYLE ENGINE EXPORTS - REST TO BE DEPRECATED */
export {
  getStyleProp,
  PSEUDO_STATES,
  type CssVarProp,
  type NegativeSpacing,
  type WithNegativeSpacing,
  type PseudoState,
  type WithPseudo,
} from "./helpers/getStyleProp";
export { useStyleEngine } from "./hooks/useStyleEngine";
