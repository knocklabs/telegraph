export const SIZE = {
  Container: {
    "1": "h-6 pl-0 rounded-2",
    "2": "h-8 pl-0 rounded-2",
    "3": "h-10 pl-0 rounded-3",
  },
  Field: {
    "1": "text-1 px-1",
    "2": "text-2 px-2",
    "3": "text-3 px-3",
  },
  Slot: {
    "1": "[&>[data-tgph-button]]:rounded-1",
    "2": "[&>[data-tgph-button]]:rounded-1",
    "3": "[&>[data-tgph-button]]:rounded-2",
  },
  SlotLeading: {
    "1": "order-1 pl-1",
    "2": "order-1 pl-2",
    "3": "order-1 pl-3",
  },
  SlotTrailing: {
    "1": "order-3 pr-1",
    "2": "order-3 pr-2",
    "3": "order-3 pr-3",
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
} as const;
