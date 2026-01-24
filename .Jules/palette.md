## 2025-02-27 - Keyboard Interactions on Custom Controls
**Learning:** Custom interactive elements (divs acting as buttons/radios) frequently used deprecated `onKeyPress` events and lacked `Space` key support, making them inconsistent with native buttons and frustrating for keyboard users.
**Action:** Always use `onKeyDown` for keyboard events on non-native interactive elements and explicitly handle both `Enter` and `Space` (with `preventDefault` for Space to avoid scrolling).
