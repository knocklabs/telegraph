import { useAppearance } from "@telegraph/appearance";
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import { useEffect, useState } from "react";

import { colorMap, sizeMap } from "./Kbd.constants";

type KbdProps = {
  size?: keyof typeof sizeMap;
  contrast?: boolean;
  label: string;
  eventKey?: string;
};

const Kbd = (props: KbdProps) => {
  const { size = "1", contrast = false, label } = props;
  const { appearance } = useAppearance();
  const [pressedState, setPressedState] = useState(false);

  const key = props.eventKey || label;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log(event.key, key);
      if (event.key === key) {
        setPressedState(true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === key) {
        setPressedState(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [key]);

  return (
    <Stack
      {...colorMap[appearance][contrast ? "contrast" : "default"][
        pressedState ? "pressed" : "default"
      ].stack}
      {...sizeMap[size].stack}
      border="px"
      rounded="1"
      align="center"
      justify="center"
    >
      <Text
        as="span"
        {...colorMap[appearance][contrast ? "contrast" : "default"][
          pressedState ? "pressed" : "default"
        ].text}
        {...sizeMap[size].text}
      >
        {label}
      </Text>
    </Stack>
  );
};

export { Kbd };
