import type { TgphComponentProps } from "@telegraph/helpers";
import { Stack } from "@telegraph/layout";
import { useState } from "react";

import { Menu } from "./Menu";

const PROPERTIES = [
  "workflow.name",
  "workflow.status",
  "recipient.email",
  "recipient.id",
  "actor.name",
];

/**
 * A typeable input composed inside `Menu.Trigger`, as PropertySelectorField and
 * the block editor suggestion menus do. Shared between the Storybook story and
 * the headed browser test so both exercise the exact same composition.
 *
 * The input stays a real text field: `nativeButton={false}` + a wrapping `div`
 * put Base UI's button semantics on the div, not the input, and passing
 * `onClick` to the trigger suppresses Base UI's own open-on-press so it doesn't
 * fight the input's focus/typing. Opening is driven by focus/typing; the popup
 * prevents the legacy `openAutoFocus` so keystrokes keep feeding the input.
 */
export const TypeableTriggerExample = (
  args: Partial<TgphComponentProps<typeof Menu.Root>> = {},
) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const matches = PROPERTIES.filter((property) =>
    property.toLowerCase().includes(value.trim().toLowerCase()),
  );

  return (
    <Stack m="20" style={{ width: 260 }}>
      <Menu.Root {...args} open={open} onOpenChange={setOpen}>
        <Menu.Trigger nativeButton={false} onClick={() => {}}>
          <div>
            <input
              aria-label="Filter properties"
              placeholder="Filter properties…"
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={(event) => {
                // Keep typing in the input rather than Base UI's menu typeahead;
                // let only navigation/selection keys reach the open menu.
                if (
                  !["ArrowDown", "ArrowUp", "Enter", "Escape"].includes(
                    event.key,
                  )
                ) {
                  event.stopPropagation();
                }
              }}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "6px 10px",
                borderRadius: 6,
                border: "1px solid var(--tgph-gray-6)",
                font: "inherit",
              }}
            />
          </div>
        </Menu.Trigger>
        <Menu.Content
          {...args}
          onOpenAutoFocus={(event) => event.preventDefault()}
          style={{ width: 260 }}
        >
          {matches.length > 0 ? (
            matches.map((property) => (
              <Menu.Button
                key={property}
                onSelect={() => {
                  setValue(property);
                  setOpen(false);
                }}
              >
                {property}
              </Menu.Button>
            ))
          ) : (
            <Menu.Button disabled={true}>No matches</Menu.Button>
          )}
        </Menu.Content>
      </Menu.Root>
    </Stack>
  );
};
