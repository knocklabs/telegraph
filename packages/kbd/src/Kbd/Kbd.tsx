import { useAppearance } from "@telegraph/appearance";
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";

import { colorMap, sizeMap } from "./Kbd.constants";
import { usePressed } from "./Kbd.hooks";

type KbdProps = {
  size?: keyof typeof sizeMap;
  contrast?: boolean;
  label: string;
  eventKey?: KeyboardEvent["key"];
};

const Kbd = ({
  size = "1",
  contrast: contrastProp = false,
  label,
  ...props
}: KbdProps) => {
  const { appearance } = useAppearance();
  const { pressed } = usePressed({ key: props.eventKey || label });

  const contrast = contrastProp ? "contrast" : "default";

  return (
    <Stack
      {...sizeMap[size].stack}
      bg={
        pressed
          ? colorMap[appearance][contrast].stack.bgPressed
          : colorMap[appearance][contrast].stack.bg
      }
      shadow={pressed ? "inner" : "0"}
      borderColor={colorMap[appearance][contrast].stack.borderColor}
      border="px"
      rounded="1"
      align="center"
      justify="center"
      style={{
        transition: "background-color 0.2s ease-in-out",
      }}
    >
      <Text
        as="span"
        {...sizeMap[size].text}
        color={colorMap[appearance][contrast].text.color}
      >
        {label}
      </Text>
    </Stack>
  );
};
export { Kbd };
