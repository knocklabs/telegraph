---
"@telegraph/select": patch
---

Remove the internal compatibility workaround that discarded `legacyBehavior` before forwarding props to Combobox. Combobox no longer exposes that prop.
