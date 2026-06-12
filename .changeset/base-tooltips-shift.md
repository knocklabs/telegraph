---
"@telegraph/tooltip": patch
"@telegraph/truncate": patch
"@telegraph/vite-config": patch
---

Migrate Tooltip internals from Radix UI to Base UI while preserving the Telegraph API, accessibility attributes, and TooltipIfTruncated behavior. Keep dependency subpath imports external in shared Vite library builds so Base UI-backed packages publish browser-safe ESM output.
