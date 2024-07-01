export type CssVariableProp = {
  rule: string;
  type: string;
  default?: string;
  valueType?: "static" | "variable";
} & (
  | {
      ordering?: "trbl";
      direction?: "all" | "top" | "right" | "bottom" | "left" | "x" | "y";
    }
  | {
      ordering?: "clockwise";
      direction?:
        | "all"
        | "topLeft"
        | "topRight"
        | "bottomRight"
        | "bottomLeft"
        | "top"
        | "right"
        | "bottom"
        | "left";
    }
);

export type ResponsiveObject<T> = { sm?: T; md?: T; lg?: T; xl?: T; "2xl"?: T };
export type Responsive<T> = T | ResponsiveObject<T>;
