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

`nativeButton` now follows the element that renders instead of defaulting to `true`. Base UI reports an error when the two disagree, and `Button.Root` renders a native button unless `as` says otherwise, forcing one back when `disabled`. Pass `nativeButton` explicitly for a component that resolves to a button.
