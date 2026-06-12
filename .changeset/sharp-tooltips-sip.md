---
"@telegraph/data-list": patch
"@telegraph/tag": patch
"@telegraph/tooltip": minor
"@telegraph/truncate": patch
---

Verify published Tooltip consumers against the Base UI-backed implementation and preserve their trigger refs, optional tooltip labels, and Radix-compatible trigger state attributes. TooltipIfTruncated now documents and tests that an explicit `label` takes precedence over child text when both are provided.
