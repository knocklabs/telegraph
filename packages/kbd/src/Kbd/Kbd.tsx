import { useAppearance } from "@telegraph/appearance";
import type { TgphElement } from "@telegraph/helpers";
import { Icon } from "@telegraph/icon";
import { Stack, type StackProps } from "@telegraph/layout";
import { Text } from "@telegraph/typography";

import { colorMap, sizeMap } from "./Kbd.constants";
import { getIconOrKey } from "./Kbd.helpers";
import { usePressed } from "./Kbd.hooks";

export type KbdProps<T extends TgphElement = "div"> = {
  size?: keyof typeof sizeMap;
  contrast?: boolean;
  label: string;
  eventKey?: KeyboardEvent["key"];
} & StackProps<T>;

const Kbd = <T extends TgphElement = "div">(kbdProps: KbdProps<T>) => {
  const {
    size = "1",
    contrast: contrastProp = false,
    label,
    style,
    eventKey,
    ...props
  } = kbdProps as KbdProps<"div">;
  const { appearance: appearanceProp } = useAppearance();
  const { pressed } = usePressed({ key: eventKey || label });
  const { icon, text } = getIconOrKey(label);

  const contrast = contrastProp ? "contrast" : "default";
  const appearance = appearanceProp || "light";

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
        ...style,
      }}
      data-tgph-kbd
      {...props}
    >
      {text && (
        <Text
          as="span"
          {...sizeMap[size].text}
          {...colorMap[appearance][contrast].text}
        >
          {text}
        </Text>
      )}
      {icon && (
        <Icon
          icon={icon}
          alt={label}
          {...sizeMap[size].icon}
          {...colorMap[appearance][contrast].icon}
        />
      )}
    </Stack>
  );
};
export { Kbd };
