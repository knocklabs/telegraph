import { useAppearance } from "@telegraph/appearance";
import { Icon } from "@telegraph/icon";
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";

import { colorMap, sizeMap } from "./Kbd.constants";
import { getIconOrKey } from "./Kbd.helpers";
import { usePressed } from "./Kbd.hooks";

type KbdProps = {
  size?: keyof typeof sizeMap;
  contrast?: boolean;
  label: string;
  eventKey?: KeyboardEvent["key"];
} & React.ComponentProps<typeof Stack>;

const Kbd = ({
  size = "1",
  contrast: contrastProp = false,
  label,
  style,
  ...props
}: KbdProps) => {
  const { appearance: appearanceProp } = useAppearance();
  const { pressed } = usePressed({ key: props.eventKey || label });
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
