---
"@telegraph/icon": minor
---

update icon component so that the `Lucide` object isn't exported anymore. Instead, utilize icons directly imported from `lucide-react` so that a bundler can properly tree shake lucide in order to drastically reduce bundle size.
