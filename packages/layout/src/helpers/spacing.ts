type DeriveSpacingArgs = {
  value: string;
  type: string;
  currentValue?: string;
};

export const deriveSpacing = ({
  value,
  type,
  currentValue,
}: DeriveSpacingArgs) => {
  // Get any existing values and add them to the current spacing object
  const currentValueArray = currentValue ? currentValue.split(" ") : [];

  const spacingObject = {
    top: currentValueArray?.[0] || 0,
    right: currentValueArray?.[1] || 0,
    bottom: currentValueArray?.[2] || 0,
    left: currentValueArray?.[3] || 0,
  };

  // Direction of spacing defined in the type
  const spacingDirection = type.split("-")?.[1] || "default";

  // Replace any standalone numbers with the corresponding spacing variable
  // This still allows for the use of px, em, rem, etc. when needed
  const replaceNumbersWithVariables = (char: string) => {
    const trimmedChar = char.trim();
    const isNumber = /^-?\d+$/.test(trimmedChar);

    if (isNumber) {
      return `var(--tgph-spacing-${trimmedChar})`;
    }

    if(trimmedChar === "auto"){
        return "auto";
    }

    // If not a valid spacing value return 0 for that direction
    return "0";
  };

  if (spacingDirection === "gap") {
    return replaceNumbersWithVariables(value);
  }

  // Apply the spacing value to the correct direction
  if (spacingDirection === "x") {
    spacingObject.left = replaceNumbersWithVariables(value);
    spacingObject.right = replaceNumbersWithVariables(value);
  }
  if (spacingDirection === "y") {
    spacingObject.top = replaceNumbersWithVariables(value);
    spacingObject.bottom = replaceNumbersWithVariables(value);
  }

  if (
    spacingDirection === "top" ||
    spacingDirection === "bottom" ||
    spacingDirection === "left" ||
    spacingDirection === "right"
  ) {
    spacingObject[spacingDirection] = replaceNumbersWithVariables(value);
  }

  if (spacingDirection === "default") {
    spacingObject.left = replaceNumbersWithVariables(value);
    spacingObject.right = replaceNumbersWithVariables(value);
    spacingObject.top = replaceNumbersWithVariables(value);
    spacingObject.bottom = replaceNumbersWithVariables(value);
  }

  return `${spacingObject.top} ${spacingObject.right} ${spacingObject.bottom} ${spacingObject.left}`;
};
