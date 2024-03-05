export const SIZE = {
  Container: {
    "1": "gap-1 h-6 pl-1 rounded-2",
    "2": "gap-2 h-8 pl-2 rounded-2",
    "3": "gap-3 h-10 pl-3 rounded-3",
  },
  Field: {
    "1": "text-1",
    "2": "text-2",
    "3": "text-3",
  },
  Icon: {
    "1": "ml-1",
    "2": "ml-2",
    "3": "ml-3",
  },
  TrailingAction: {
    "1": "[&>[data-tgph-button]]:rounded-1",
    "2": "[&>[data-tgph-button]]:rounded-1",
    "3": "[&>[data-tgph-button]]:rounded-2",
  },
} as const;

export const COLOR = {
  Container: {
    default: {
      outline:
        "bg-surface-1 border-gray-6 hover:border-gray-7 focus-within:!border-blue-8",
      ghost:
        "bg-transparent border-transparent hover:bg-gray-3 focus-within:!bg-gray-4 focus-within:!border-blue-8",
    },
    disabled: {
      outline:
        "cursor-not-allowed bg-gray-2 border-gray-2 [&_[data-tgph-icon]]:text-gray-8 placeholder:text-gray-9 [&>input]:text-gray-9",
      ghost:
        "cursor-not-allowed bg-transparent border border-transparent [&_[data-tgph-icon]]:text-gray-8 placeholder:text-gray-9 [&>input]:text-gray-9",
    },
    error: {
      outline: "bg-surface-1 border-red-6",
      ghost: "bg-transparent border-red-6",
    },
  },
  Label: {
    default: "default",
    error: "red",
    disabled: "disabled",
  },
  Message: {
    default: "gray",
    error: "red",
    disabled: "disabled",
  },
} as const;
