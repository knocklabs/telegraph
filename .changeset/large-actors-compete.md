---
"@telegraph/button": patch
---

fix: make type prop compatible with HTMLButtonProps['type']

In 0.2.0, we were only supporting submit and button, there is also reset and undefined values to support
