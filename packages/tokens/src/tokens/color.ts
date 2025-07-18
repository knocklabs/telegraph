export const color = {
  transparent: "transparent",
  white: "#FFFFFF",
  black: "#000000",
  surface: {
    1: { light: "#FFFFFF", dark: "#18191B"},
    2: { light: "#FDFDFC", dark: "#101112"},
  },
  alpha: {
    white: {
      1: "rgba(255, 255, 255, 0.05)",
      2: "rgba(255, 255, 255, 0.1)",
      3: "rgba(255, 255, 255, 0.15)",
      4: "rgba(255, 255, 255, 0.2)",
      5: "rgba(255, 255, 255, 0.3)",
      6: "rgba(255, 255, 255, 0.4)",
      7: "rgba(255, 255, 255, 0.5)",
      8: "rgba(255, 255, 255, 0.6)",
      9: "rgba(255, 255, 255, 0.7)",
      10: "rgba(255, 255, 255, 0.8)",
      11: "rgba(255, 255, 255, 0.9)",
      12: "rgba(255, 255, 255, 0.95)",
    },
    black: {
      1: "rgba(0, 0, 0, 0.05)",
      2: "rgba(0, 0, 0, 0.1)",
      3: "rgba(0, 0, 0, 0.15)",
      4: "rgba(0, 0, 0, 0.2)",
      5: "rgba(0, 0, 0, 0.3)",
      6: "rgba(0, 0, 0, 0.4)",
      7: "rgba(0, 0, 0, 0.5)",
      8: "rgba(0, 0, 0, 0.6)",
      9: "rgba(0, 0, 0, 0.7)",
      10: "rgba(0, 0, 0, 0.8)",
      11: "rgba(0, 0, 0, 0.9)",
      12: "rgba(0, 0, 0, 0.95)",
    },
  },
  gray: {
    1: { light: "#FCFCFD", dark: "#101112" },
    2: { light: "#f9f9fb", dark: "#18191B" },
    3: { light: "#EFF0F3", dark: "#212325" },
    4: { light: "#E6E8EB", dark: "#282A2D" },
    5: { light: "#DFE2E5", dark: "#2F3235" },
    6: { light: "#D7DADF", dark: "#383B3E" },
    7: { light: "#CBCFD5", dark: "#45484D" },
    8: { light: "#B6BCC4", dark: "#5C6268" },
    9: { light: "#888E95", dark: "#6A6F76" },
    10: { light: "#7E848A", dark: "#777D84" },
    11: { light: "#60646A", dark: "#AFB5BB" },
    12: { light: "#1D2023", dark: "#EDEEEF" },
  },
  beige: {
    1: { light: "#FDFDFC", dark: "#12110F" },
    2: { light: "#F9F9F8", dark: "#191817" },
    3: { light: "#F0F0EF", dark: "#232220" },
    4: { light: "#E9E8E7", dark: "#2A2927" },
    5: { light: "#E2E1DF", dark: "#31302E" },
    6: { light: "#DAD9D7", dark: "#3B3937" },
    7: { light: "#CFCECC", dark: "#484745" },
    8: { light: "#BCBBB8", dark: "#61605D" },
    9: { light: "#8E8C8A", dark: "#6E6D6A" },
    10: { light: "#83827F", dark: "#7C7A78" },
    11: { light: "#646360", dark: "#B4B3B0" },
    12: { light: "#21201E", dark: "#EEEDEB" },
  },
  accent: {
    1: { light: "#FFFCFB", dark: "#160F0D" },
    2: { light: "#FFF5F2", dark: "#201412" },
    3: { light: "#FFE9E2", dark: "#3B140D" },
    4: { light: "#FFD6CB", dark: "#530E04" },
    5: { light: "#FFC8BA", dark: "#631507" },
    6: { light: "#FFB7A6", dark: "#742315" },
    7: { light: "#FFA28F", dark: "#8D3323" },
    8: { light: "#F88872", dark: "#B5432F" },
    9: { light: "#FF573A", dark: "#FF573A" },
    10: { light: "#F2472A", dark: "#F1492D" },
    11: { light: "#DB3619", dark: "#FF917A" },
    12: { light: "#5C291F", dark: "#FFD1C7" },
  },
  green: {
    1: { light: "#FBFEFC", dark: "#0C130F" },
    2: { light: "#F4FBF7", dark: "#111B16" },
    3: { light: "#E4F7EC", dark: "#112D20" },
    4: { light: "#D3F1E0", dark: "#0C3C28" },
    5: { light: "#BFEAD2", dark: "#104A32" },
    6: { light: "#A7DFC1", dark: "#18583D" },
    7: { light: "#86D0AA", dark: "#1E6949" },
    8: { light: "#4FBA8A", dark: "#217D57" },
    9: { light: "#00AA72", dark: "#00AA72" },
    10: { light: "#009C68", dark: "#009D66" },
    11: { light: "#00834F", dark: "#4DD399" },
    12: { light: "#183B2B", dark: "#AAF3CC" },
  },
  yellow: {
    1: { light: "#FEFDFB", dark: "#16120C" },
    2: { light: "#FEFBE9", dark: "#1D180F" },
    3: { light: "#FFF7C2", dark: "#302008" },
    4: { light: "#FFEE9C", dark: "#3F2700" },
    5: { light: "#FBE577", dark: "#4D3000" },
    6: { light: "#F3D673", dark: "#5C3D05" },
    7: { light: "#E9C162", dark: "#714F19" },
    8: { light: "#F3D673", dark: "#8F6424" },
    9: { light: "#FFC53D", dark: "#FFC53D" },
    10: { light: "#FFBA18", dark: "#FFD60A" },
    11: { light: "#AB6400", dark: "#FFCA16" },
    12: { light: "#4F3422", dark: "#FFE7B3" },
  },
  blue: {
    1: { light: "#FCFDFF", dark: "#0B111C" },
    2: { light: "#F6F9FF", dark: "#111826" },
    3: { light: "#EBF2FF", dark: "#152548" },
    4: { light: "#DEEBFF", dark: "#172E63" },
    5: { light: "#CEE0FF", dark: "#1F3A76" },
    6: { light: "#BBD3FF", dark: "#294787" },
    7: { light: "#A3C1FB", dark: "#35569D" },
    8: { light: "#81A8F6", dark: "#3F66BB" },
    9: { light: "#4A82FF", dark: "#4A82FF" },
    10: { light: "#4276EC", dark: "#3E75F1" },
    11: { light: "#3569E0", dark: "#89B3FF" },
    12: { light: "#193065", dark: "#D1E1FF" },
  },
  red: {
    1: { light: "#FFFCFC", dark: "#180E0F" },
    2: { light: "#FFF7F7", dark: "#201314" },
    3: { light: "#FFE9E9", dark: "#3F0F15" },
    4: { light: "#FFDADB", dark: "#550517" },
    5: { light: "#FFCBCD", dark: "#670A1F" },
    6: { light: "#FFBBBE", dark: "#79182A" },
    7: { light: "#FAA7AB", dark: "#932738" },
    8: { light: "#F28B92", dark: "#C1334A" },
    9: { light: "#E9004A", dark: "#E9004A" },
    10: { light: "#D9003D", dark: "#C3354C" },
    11: { light: "#D9003E", dark: "#FF8E98" },
    12: { light: "#6C041F", dark: "#FFCFD1" },
  },
  purple: {
    1: { light: "#FCFCFF", dark: "#100F1D" },
    2: { light: "#F8F8FF", dark: "#161528" },
    3: { light: "#F1F1FF", dark: "#241E4B" },
    4: { light: "#E6E6FF", dark: "#2E2368" },
    5: { light: "#DADAFF", dark: "#382C77" },
    6: { light: "#CCCBFF", dark: "#423786" },
    7: { light: "#B9B6FF", dark: "#4F449C" },
    8: { light: "#9F99FC", dark: "#6153BD" },
    9: { light: "#6547DE", dark: "#6547DE" },
    10: { light: "#583DC4", dark: "#5936CD" },
    11: { light: "#6148D0", dark: "#AEA8FF" },
    12: { light: "#2E2269", dark: "#DEDEFF" },
  },
};
