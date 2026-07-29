---
"@telegraph/menu": minor
---

`Menu.Button` accepts a component for `as`, so a menu item can navigate:

```tsx
<Menu.Button as={NextLink} href="/settings">
  Settings
</Menu.Button>
```

`as` was already declared, but it could never resolve to anything except `"button"`. `MenuButtonItemProps` read bare `MenuItemProps`, which is `MenuItemProps<"button">` and carries `as?: "button"`. Intersecting that with the `as?: T` beside it gave `as?: "button" & T`, so every other element failed to assign.

`Menu.SubTrigger` had the same collapse through `MenuSubTriggerItemProps`, and takes a component for `as` now too.

`nativeButton` on both now follows the element that renders instead of defaulting to `true`. Base UI reports an error when the two disagree, and `Button.Root` renders a native button unless `as` says otherwise, forcing one back when `disabled`. Pass `nativeButton` explicitly for a component that resolves to a button.

**This changes keyboard behavior on an item that renders an anchor.** Base UI treated those items as native buttons before, so Space did nothing. Space now activates the item, matching Enter and the WAI-ARIA menu pattern. The invalid `type="button"` that Base UI stamped onto those anchors is gone as well.
