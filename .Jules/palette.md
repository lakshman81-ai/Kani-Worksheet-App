## 2026-01-27 - Keyboard Accessibility for Interactive Divs
**Learning:** `div` elements acting as buttons need `onKeyDown` instead of `onKeyPress` to properly handle both 'Enter' and 'Space' keys. Space triggers scrolling by default, so `preventDefault` is required.
**Action:** Always implement `onKeyDown` with checks for `Enter` and `Space` (including `preventDefault`) for custom interactive elements.
