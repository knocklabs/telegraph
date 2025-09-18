---
"@telegraph/button": minor
---

fix(button): switch default "type" from "submit" to "button"

The previous default type="submit" is a minority use case (Buttons used for submitting forms). As such, make it opt-in as opposed to the default.
