export { default as tokens } from "@telegraph/tokens/css-variables-map";

/* NEW STYLE ENGINE EXPORTS - REST TO BE DEPRECATED */
export {
  getStyleProp,
  type CssVarProp,
  type NegativeSpacing,
  type WithNegativeSpacing,
} from "./helpers/getStyleProp";
export { useStyleEngine } from "./hooks/useStyleEngine";
