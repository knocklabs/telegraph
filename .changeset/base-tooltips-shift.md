---
"@telegraph/tooltip": minor
"@telegraph/truncate": patch
"@telegraph/vite-config": patch
---

Migrate Tooltip internals from Radix UI to Base UI while preserving Telegraph trigger state attributes, dismissal callbacks, collision props, hidden-when-detached behavior, and `tgphRef` support. The portaled tooltip surface keeps a dark Telegraph appearance attribute without reintroducing the removed public `appearance` prop. Keep dependency subpath imports external in shared Vite library builds so Base UI-backed packages publish browser-safe ESM output.
