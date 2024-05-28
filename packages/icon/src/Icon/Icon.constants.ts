export const sizeMap = {
  box: {
    "0": "h-[0.8125rem] w-[0.8125rem]",
    "1": "h-[0.874rem] w-[0.874rem]",
    "2": "h-4 w-4",
    "3": "h-[1.125rem] w-[1.125rem]",
    "4": "h-5 w-5",
    "5": "h-[1.375rem] w-[1.375rem]",
    "6": "h-[1.625rem] w-[1.625rem]",
    "7": "h-8 w-8",
    "8": "h-9 w-9",
    "9": "h-12 w-12",
  },
} as const;

export const colorMap = {
  primary: {
    default: "text-gray-12",
    gray: "text-gray-11",
    accent: "text-accent-11",
    beige: "text-beige-11",
    blue: "text-blue-11",
    green: "text-green-11",
    yellow: "text-yellow-11",
    purple: "text-purple-11",
    red: "text-red-11",
    white: "text-white",
    disabled: "text-gray-9",
  },
  secondary: {
    default: "text-gray-11",
    gray: "text-gray-10",
    accent: "text-accent-10",
    beige: "text-beige-10",
    blue: "text-blue-10",
    green: "text-green-10",
    yellow: "text-yellow-10",
    purple: "text-purple-10",
    red: "text-red-10",
    white: "text-white",
    disabled: "text-gray-8",
  },
} as const;
