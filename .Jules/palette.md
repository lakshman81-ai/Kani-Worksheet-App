## 2024-05-22 - [Keyboard Accessibility for Custom Controls]
**Learning:** Custom interactive elements (divs) using `onKeyPress` fail to support the Space key for activation, which is a standard accessibility expectation. `onKeyPress` is also deprecated.
**Action:** Always use `onKeyDown` for custom controls. Explicitly handle both `Enter` and `Space` keys. Crucially, call `e.preventDefault()` for the Space key to prevent unwanted page scrolling during interaction.
